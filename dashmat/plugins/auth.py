from dashmat.plugins.base import PluginBase

from social.apps.flask_app.routes import social_auth
from social.apps.flask_app.default.models import init_social, PSABase

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String

from flask_login import UserMixin, LoginManager, current_user

from flask import g, request, redirect, url_for, session

import logging
log = logging.getLogger(__name__)

Base = declarative_base()


class User(Base, UserMixin):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(200))
    email = Column(String(200))


class SocialAuthPlugin(PluginBase):
    def __init__(self, client_id, client_secret, restrict_emails=None, restrict_domains=None):
        self.client_id = client_id
        self.client_secret = client_secret
        self.restrict_emails = restrict_emails
        self.restrict_domains = restrict_domains
        self.db_engine = create_engine('sqlite:///:memory:', echo=False)
        Session = sessionmaker(autocommit=False, autoflush=False, bind=self.db_engine)
        self.db_session = scoped_session(Session)

    def configure(self, app):
        app.config['SECRET_KEY'] = 'abc123'
        app.config['SOCIAL_AUTH_USER_MODEL'] = 'dashmat.plugins.auth.User'
        app.config['SOCIAL_AUTH_PASSWORDLESS'] = True
        app.config['SOCIAL_AUTH_AUTHENTICATION_BACKENDS'] = [
            'social.backends.google.GooglePlusAuth',
        ]

        # Where to redirect on error
        app.config['SOCIAL_AUTH_LOGIN_URL'] = '/login/'
        # Where to go after login
        app.config['SOCIAL_AUTH_LOGIN_REDIRECT_URL'] = '/login/'

        app.config['SOCIAL_AUTH_GOOGLE_PLUS_KEY'] = self.client_id
        app.config['SOCIAL_AUTH_GOOGLE_PLUS_SECRET'] = self.client_secret

        if self.restrict_domains:
            app.config['SOCIAL_AUTH_GOOGLE_PLUS_WHITELISTED_DOMAINS'] = self.restrict_domains
        if self.restrict_emails:
            app.config['SOCIAL_AUTH_GOOGLE_PLUS_WHITELISTED_ENMAILS'] = self.restrict_emails


    def commit(self, error=None):
        if error is None:
            self.db_session.commit()
        else:
            self.db_session.rollback()
        self.db_session.remove()

    def get_user(self, userid):
        try:
            return self.db_session.query(User).get(int(userid))
        except (TypeError, ValueError):
            return None

    def inject_user(self):
        g.user = current_user

    def auth_required(self):
        if not request.endpoint.startswith('social.') and not current_user.is_authenticated:
            session['login_redirect'] = request.endpoint
            return redirect(url_for('social.auth', backend='google-plus'))

    def endpoint(self):
        if current_user.is_authenticated:
            return_path = session.pop('login_redirect') or 'dashmat.home'
            return redirect(url_for(return_path))
        return 'Authentication failed'

    def flask_init(self, app):
        log.info('Installing auth')
        self.configure(app)

        init_social(app, self.db_session)
        # init_social adds some extra columns to the PSABase models...
        Base.metadata.create_all(self.db_engine)
        PSABase.metadata.create_all(self.db_engine)

        login_manager = LoginManager()
        login_manager.init_app(app)
        login_manager.user_loader(self.get_user)

        app.register_blueprint(social_auth)
        app.before_request(self.inject_user)
        app.before_request(self.auth_required)
        app.teardown_appcontext(self.commit)
        app.route('/login/', methods=['GET'])(self.endpoint)
