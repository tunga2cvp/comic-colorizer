import logging
import logging.handlers as handlers
import os
from dotenv import load_dotenv


__service_name__ = "comic-colorizer-backend"
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__)))


def create_dir(dir_path):
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)


def setup_logger():
    log_dir_path = '{}/log'.format(ROOT_DIR)
    create_dir(log_dir_path)

    logger = logging.getLogger(__service_name__)
    logger.setLevel(logging.INFO)

    format_pattern = '%(asctime)s - %(name)s - %(levelname)s - %(threadName)s - %(message)s'
    formatter = logging.Formatter(format_pattern)

    handler = logging.StreamHandler()
    handler.setFormatter(formatter)

    error_log_handler = handlers.RotatingFileHandler(filename='{}/{}.log'.format(log_dir_path, __service_name__),
                                                     maxBytes=5000, backupCount=0)
    error_log_handler.setFormatter(formatter)

    logger.addHandler(handler)
    logger.addHandler(error_log_handler)

    return logger


setup_logger()


MODEL_1_PATH = ROOT_DIR + '/model/unet_color_rgb'
MODEL_2_PATH = ROOT_DIR + '/model/unet_rgb'

SOURCE_IMAGES_PATH = ROOT_DIR + '/log/source_images'
RESULT_IMAGES_PATH = ROOT_DIR + '/log/result_images'
SUPPLEMENT_IMAGES_PATH = ROOT_DIR + '/log/supplement_images'


create_dir(SOURCE_IMAGES_PATH)
create_dir(RESULT_IMAGES_PATH)
create_dir(SUPPLEMENT_IMAGES_PATH)

ENV_MODE = os.getenv('ENV_MODE')
if ENV_MODE is None:
    _DOT_ENV_PATH = os.path.join(ROOT_DIR, ".env")
    load_dotenv(_DOT_ENV_PATH)


def _env(name, default):
    """ Get configuration from environment in priorities:
      1. the env var with prefix of $ENV_MODE
      2. the env var with the same name (in upper case)
      3. the default value

    :param str name: configuration name
    :param default: default value
    """

    def _bool(val):
        if not val:
            return False
        return val not in ('0', 'false', 'no')

    # make sure configuration name is upper case
    name = name.upper()

    # try to get value from env vars
    val = default
    for env_var in ('%s_%s' % (ENV_MODE, name), name):
        try:
            val = os.environ[env_var]
            break
        except KeyError:
            pass
    else:
        env_var = None

    # convert to the right types
    if isinstance(default, bool):
        val = _bool(val)
    return env_var, val


_IGNORED_CONFIG = (
    'ROOT_DIR',
    'STATIC_DIR',
    'ENV_MODE',
)

# rewrite all configuration with environment variables
_vars = list(locals().keys())
for name in _vars:
    if name in _IGNORED_CONFIG:
        continue
    if not name.startswith('_') and name.isupper():
        env_var, val = _env(name, locals()[name])
        locals()[name] = val
