import pkg_resources

from dashmat.widgets.base import Widget


class Number(Widget):
    def get_bundle(self):
        return pkg_resources.resource_stream('dashmat.widgets', 'bundles/Number.js')

class StatusList(Widget):
    def get_bundle(self):
        return pkg_resources.resource_stream('dashmat.widgets', 'bundles/StatusList.js')

class Graph(Widget):
    def get_bundle(self):
        return pkg_resources.resource_stream('dashmat.widgets', 'bundles/Graph.js')

class Gauge(Widget):
    def get_bundle(self):
        return pkg_resources.resource_stream('dashmat.widgets', 'bundles/Gauge.js')

class TimeSince(Widget):
    def get_bundle(self):
        return pkg_resources.resource_stream('dashmat.widgets', 'bundles/TimeSince.js')
