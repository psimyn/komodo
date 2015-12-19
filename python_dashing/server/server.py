from python_dashing.server.react import ReactServer
from python_dashing.scheduler import Scheduler

from tornado.httpserver import HTTPServer
from tornado.wsgi import WSGIContainer
from tornado.ioloop import IOLoop

from flask import send_from_directory, render_template, abort
from werkzeug.routing import PathConverter
from flask import Flask

from textwrap import dedent
import threading
import tempfile
import logging
import shutil
import flask
import time
import os

log = logging.getLogger("python_dashing.server")

here = os.path.dirname(__file__)

class Server(object):
    def __init__(self, host, port, debug, dashboards, modules, module_options, allowed_static_folders, compiled_static_prep, compiled_static_folder, without_checks):
        self.thread_stopper = {"finished": False}

        self.host = host
        self.port = port
        self.modules = modules
        self.dashboards = dashboards
        self.module_options = module_options
        self.without_checks = without_checks

        self.compiled_static_prep = compiled_static_prep
        self.compiled_static_folder = compiled_static_folder
        self.allowed_static_folders = allowed_static_folders

        static_folder = os.path.join(here, "static")
        if static_folder not in self.allowed_static_folders:
            self.allowed_static_folders.append(static_folder)

        self.react_server = ReactServer()

    def serve(self):
        http_server = HTTPServer(WSGIContainer(self.app))
        http_server.listen(self.port, self.host)
        log.info("Starting server on http://%s:%s", self.host, self.port)

        try:
            IOLoop.instance().start()
        finally:
            self.thread_stopper["finished"] = True

    def start_checks(self, scheduler, thread_stopper):
        first_run = True
        while True:
            if thread_stopper['finished']:
                break

            try:
                scheduler.run(force=first_run)
            except Exception:
                log.exception("Failed to run scheduler")

            first_run = False
            time.sleep(5)

    @property
    def app(self):
        if getattr(self, "_app", None) is None:
            self._app = Flask("python_dashing.server", static_url_path=os.path.join(here, "static"))

            # Remove auto generated static route
            while self._app.url_map._rules:
                self._app.url_map._rules.pop()
            for key in list(self._app.url_map._rules_by_endpoint):
                self._app.url_map._rules_by_endpoint.pop(key)
            self._app.url_map.update()
            self._app.view_functions.clear()

            scheduler = Scheduler()
            if not self.without_checks:
                for name, module in self.modules.items():
                    scheduler.register(module, name)

            checks_thread = threading.Thread(target=self.start_checks, args=(scheduler, self.thread_stopper, ))
            checks_thread.daemon = True
            checks_thread.start()

            # Register our own routes
            self.register_routes(self._app)

            # Prepare the docker image for translating jsx into javascript
            self.react_server.prepare(self.compiled_static_folder)
        return self._app

    def register_routes(self, app):
        class EverythingConverter(PathConverter):
            regex = '.*?'
        app.url_map.converters['everything'] = EverythingConverter

        @app.route("/diagnostic/status/heartbeat", methods=['GET'])
        def heartbeat():
            return ""

        @app.route("/diagnostic/status/nagios", methods=['GET'])
        def nagios():
            return "OK"

        @app.route("/diagnostic/version", methods=['Get'])
        def version():
            static_dir = os.path.join(here, "static")
            return send_from_directory(static_dir, "version")

        @app.route("/static/react_boilerplate.js", methods=["GET"])
        def react_boilerplate():
            location = os.path.join(self.compiled_static_folder, "react_boilerplate.js")
            if not os.path.exists(location):
                self.react_server.build_boilerplate()
            return send_from_directory(self.compiled_static_folder, "react_boilerplate.js")

        @app.route("/static/dashboards/<everything:path>", methods=["GET"])
        def static_dashboards(path):
            if path not in self.dashboards:
                raise abort(404)

            dashboard = self.dashboards[path]
            javascript = dashboard.make_dashboard_module()

            dashboard_folder = os.path.join(self.compiled_static_folder, "dashboards")
            if not os.path.exists(dashboard_folder):
                os.makedirs(dashboard_folder)

            filename = path.replace("_", "__").replace("/", "_")

            js_location = os.path.join(dashboard_folder, "{0}.js".format(filename))
            raw_location = os.path.join(dashboard_folder, "{0}.raw".format(filename))

            if os.path.exists(raw_location):
                with open(raw_location) as fle:
                    if fle.read() != javascript:
                        with open(raw_location, 'w') as write_fle:
                            write_fle.write(javascript)
            else:
                with open(raw_location, 'w') as write_fle:
                    write_fle.write(javascript)

            if not os.path.exists(js_location) or os.stat(raw_location).st_mtime > os.stat(js_location).st_mtime:
                directory = None
                try:
                    directory = tempfile.mkdtemp(dir=self.compiled_static_prep)
                    shutil.copy(raw_location, os.path.join(directory, "{0}.js".format(filename)))
                    with open(os.path.join(directory, "webpack.config.js"), 'w') as fle:
                        fle.write(dedent("""
                          var webpack = require("webpack");

                          module.exports = {{
                              entry: [ "/raw/{0}.js" ],
                              output: {{
                                filename: "/compiled/dashboards/{0}.js",
                                library: "Dashboard"
                              }},
                              module: {{
                                loaders: [
                                  {{
                                    exclude: /node_modules/,
                                    loader: "babel",
                                    query: {{
                                      presets: ["react", "es2015"]
                                    }}
                                  }}
                                ]
                              }},
                              plugins: [
                                new webpack.NoErrorsPlugin()
                              ]
                          }};
                        """.format(filename)))
                    self.react_server.build_webpack(directory)
                finally:
                    if directory and os.path.exists(directory):
                        shutil.rmtree(directory)

            return send_from_directory(dashboard_folder, "{0}.js".format(filename))

        @app.route('/static/<path:path>', methods=['GET'])
        def static(path):
            while path and path.startswith("/"):
                path = path[1:]
            path = os.path.join(here, "static", path)

            if any(path.startswith(folder) for folder in self.allowed_static_folders):
                return send_from_directory(os.path.dirname(path), os.path.basename(path))
            else:
                raise abort(404)

        def make_dashboard(path, dashboard):
            def dashboard():
                title = path.replace("/", ' ').replace('_', ' ').title()
                return render_template('index.html', dashboardjs="/static/dashboards/{0}".format(path), title=title)
            dashboard.__name__ = "dashboard_{0}".format(path.replace("_", "__").replace("/", "_"))
            return dashboard

        for path, dashboard in self.dashboards.items():
            app.route(path, methods=["GET"])(make_dashboard(path, dashboard))

