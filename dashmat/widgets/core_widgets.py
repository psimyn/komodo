import pkg_resources

from dashmat.widgets.base import Widget


class Number(Widget):
    def get_bundle(self):
        return pkg_resources.resource_stream('dashmat.widgets', 'bundles/Number.js')
