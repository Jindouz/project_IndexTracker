import os
import logging
from django.conf import settings
from django.contrib.auth.models import User
from functools import wraps

def get_logs_folder_path():
    return os.path.join(settings.LOGS_ROOT)

logs_file_path = os.path.join(get_logs_folder_path(), 'logger.log')

# Configure logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')

file_handler = logging.FileHandler(logs_file_path)
file_handler.setFormatter(formatter)

logger.addHandler(file_handler)

def extract_user_from_args(args):
    for arg in args:
        if isinstance(arg, User):
            return arg
    return None

def log_action(action):
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(*args, **kwargs):
            user = kwargs.get('user', None)
            if user is None:
                user = extract_user_from_args(args)
            if user is None:
                user = "user"
            log_message = f"User {user} has logged in."
            logger.info(log_message)
            return view_func(*args, **kwargs)
        return wrapper
    return decorator

def log_401_error(detail):
    log_message = f"Unauthorized access: {detail}"
    logger.error(log_message)