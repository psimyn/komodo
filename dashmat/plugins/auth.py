from dashmat.plugins.base import PluginBase
from social.apps.flask_app.routes import social_auth
from social.apps.flask_app.default.models import init_social
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String

import logging
log = logging.getLogger(__name__)

class User(declarative_base()):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String)


class SocialAuthPlugin(PluginBase):
    def init_db(self):
        engine = create_engine('sqlite:///:memory:', echo=True)
        return engine

    def flask_init(self, app):
        log.info('Installing auth')
        app.config['SECRET_KEY'] = 'abc123'
        app.config['SOCIAL_AUTH_USER_MODEL'] = 'dashmat.plugins.auth.User'
        app.config['SOCIAL_AUTH_AUTHENTICATION_BACKENDS'] = [
            'social.backends.google.GooglePlusAuth',
        ]
        app.config['SOCIAL_AUTH_GOOGLE_PLUS_KEY'] = 'ZZZ'
        app.config['SOCIAL_AUTH_GOOGLE_PLUS_SECRET'] = 'ZZZ'
        app.register_blueprint(social_auth)
        db = self.init_db()
        init_social(app, db)
