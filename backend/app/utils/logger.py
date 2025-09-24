import os
import logging
import sys
from logging.handlers import RotatingFileHandler
from typing import Optional, Union

def setup_logger(name: Optional[str] = None, log_level: Optional[Union[str, int]] = None):
    """
    Configure logging with both console and file handlers.
    
    Args:
        name: Name of the logger (None for root logger)
        log_level: The logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL or int level)
    
    Returns:
        logging.Logger: Configured logger instance
    """
    # Get logger instance
    logger = logging.getLogger(name)
    
    # Avoid duplicate handlers
    if logger.handlers:
        return logger
    
    # Set log level
    if log_level is None:
        log_level = os.getenv('LOG_LEVEL', 'INFO')
    if isinstance(log_level, str):
        log_level = getattr(logging, log_level.upper(), logging.INFO)
    logger.setLevel(log_level)
    
    # Create logs directory if it doesn't exist
    log_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'logs')
    os.makedirs(log_dir, exist_ok=True)
    
    # Create a custom formatter with colors and emojis
    class CustomFormatter(logging.Formatter):
        grey = "\x1b[38;21m"
        yellow = "\x1b[33;21m"
        red = "\x1b[31;21m"
        bold_red = "\x1b[31;1m"
        reset = "\x1b[0m"
        format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        emojis = {
            'DEBUG': '🔍',
            'INFO': 'ℹ️',
            'WARNING': '⚠️',
            'ERROR': '❌',
            'CRITICAL': '🔥'
        }

        def format(self, record):
            # Add emoji to the message
            level_emoji = self.emojis.get(record.levelname, 'ℹ️')
            record.msg = f"{level_emoji} {record.msg}"
            
            # Apply color based on log level
            if record.levelno >= logging.ERROR:
                color = self.bold_red
            elif record.levelno >= logging.WARNING:
                color = self.yellow
            elif record.levelno >= logging.INFO:
                color = self.reset
            else:  # DEBUG
                color = self.grey
                
            # Create the format string with color
            log_format = f"{color}%(asctime)s - %(name)s - %(levelname)s - %(message)s{self.reset}"
            formatter = logging.Formatter(log_format, datefmt='%Y-%m-%d %H:%M:%S')
            return formatter.format(record)

    # Console handler with color formatting
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(log_level)
    console_handler.setFormatter(CustomFormatter())
    
    # File handler for all logs with rotation (10MB per file, keep 5 backups)
    log_file = os.path.join(log_dir, 'app.log')
    file_handler = RotatingFileHandler(
        log_file, 
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5,
        encoding='utf-8'
    )
    file_handler.setLevel(logging.DEBUG)
    file_formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    file_handler.setFormatter(file_formatter)
    
    # Error file handler for errors only
    error_file_handler = RotatingFileHandler(
        os.path.join(log_dir, 'error.log'),
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5,
        encoding='utf-8'
    )
    error_file_handler.setLevel(logging.ERROR)
    error_file_handler.setFormatter(file_formatter)
    
    # Add handlers
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)
    logger.addHandler(error_file_handler)
    
    # Prevent duplicate logs in case of multiple calls
    logger.propagate = False
    
    logger.info("Logging configured successfully")
    return logger
