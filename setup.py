from setuptools import setup, find_packages
from dashmat import VERSION

setup(
      name = "dashmat"
    , version = VERSION
    , packages = find_packages(exclude=['tests'])
    , package_data =
      { 'dashmat.widgets': [ 'bundles/*.js' ]
      , 'dashmat.server':
        [ 'templates/*.html'
        , 'static/*.js'
        ]
      }

    , install_requires =
      [ "six"
      , "croniter"
      , "requests"
      , "slumber"
      , "input_algorithms==0.4.5.4"
      , "delfick_app==0.7.3"
      , "option-merge==0.9.9.4"

      , "Flask==0.10.1"
      , "tornado==4.3"
      , "pyYaml==3.10"
      ]

    , extras_require =
      { "tests":
        [ "noseOfYeti>=1.5.0"
        , "nose"
        , "mock==1.0.1"
        , "tox"
        ]
      }

    , entry_points =
      { 'console_scripts' :
        [ 'dashmat = dashmat.executor:main'
        ]
      }

    # metadata for upload to PyPI
    , url = "https://github.com/realestate-com-au/dashmat"
    , author = "Stephen Moore"
    , author_email = "stephen.moore@rea-group.com"
    , description = "Application that reads yaml and serves up a pretty dashboard"
    , license = "MIT"
    , keywords = "dashboard"
    )

