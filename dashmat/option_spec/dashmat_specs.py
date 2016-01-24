"""
Here we define the yaml specification for dashmat options

The specifications are responsible for sanitation, validation and normalisation.
"""
from input_algorithms.errors import BadSpecValue
from input_algorithms.validators import regexed
from input_algorithms.spec_base import valid_string_spec, required, dictionary_spec
from input_algorithms.spec_base import string_spec as String, listof as List, dictof as Dict
from input_algorithms.dictobj import dictobj
from importlib import import_module

from dashmat.formatter import MergedOptionStringFormatter

from dashmat.core_modules import CheckBase
from dashmat.widgets.base import Widget


class Import(valid_string_spec):
    validators = [regexed("^(?P<module>[a-zA-Z_][a-zA-Z_0-9]*(\.[a-zA-Z_][a-zA-Z_0-9]*)*):(?P<class>[a-zA-Z_][a-zA-Z_0-9]*)$")]
    def setup(self, checked_class):
        self.checked_class = checked_class

    def normalise_filled(self, meta, val):
        # Run string & regex validator
        val = super(Import, self).normalise_filled(meta, val)

        # Now validate it is importable
        path = self.validators[0].regexes[0][1].match(val).groupdict()
        try:
            module = import_module(path['module'])
            val = getattr(module, path['class'])
            if not issubclass(val, self.checked_class):
                raise BadSpecValue(
                    "Wrong class type. {} is not a {}".format(
                          val.__name__
                        , self.checked_class.__name__
                    ),
                    meta=meta
                )
            return val
        except ImportError:
            raise BadSpecValue("Import not found", val=val, meta=meta)
        except AttributeError:
            raise BadSpecValue("Couldnt find class", val=val, meta=meta)


class DashboardWidget(dictobj.Spec):
    type = dictobj.Field(
        String
    )

    data = dictobj.Field(
        String
    )


class Dashboard(dictobj.Spec):
    description = dictobj.Field(
          String
        , default = "{_key_name_1}"
        , formatted = True
        , help = "Description to show up in the index"
        )

    widgets = dictobj.Field(
          List(DashboardWidget.FieldSpec())
        , wrapper = required
        , help = "List of widgets to place in the dashboard"
        )


class Check(dictobj.Spec):
    import_path = dictobj.Field(
          Import(CheckBase)
        , formatted = True
        , wrapper = required
        , help = "Import path of the check class"
        )

    options = dictobj.Field(
          dictionary_spec
        , help = "Options to pass into the constructor"
        )


class ConfigRoot(dictobj.Spec):
    dashboards = dictobj.Field(
        Dict(String(), Dashboard.FieldSpec(formatter=MergedOptionStringFormatter))
        , wrapper = required
    )

    checks = dictobj.Field(
        Dict(String(), Check.FieldSpec(formatter=MergedOptionStringFormatter))
        , wrapper = required
    )

    installed_widgets = dictobj.Field(
        List(Import(Widget))
        , wrapper = required
    )
