from .base import *
import os

DEBUG = False

ALLOWED_HOSTS = ['*']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': config("SQL_DBNAME"),
        'USER': config("SQL_USERNAME"),
        'PASSWORD': config("SQL_PASSWORD"),
        'HOST': config("SQL_HOST"),
    }
}

# STATIC_ROOT = "/home/myusername/myproject/static"
STATIC_ROOT = "/home/cs50journal/journal/journal/static"
# STATIC_ROOT = os.path.join(BASE_DIR, "static")
