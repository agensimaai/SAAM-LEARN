"""
Gunicorn configuration for production deployment.
Run with: gunicorn -c gunicorn.conf.py main:app
"""
import multiprocessing
import os

# Server socket
bind = f"0.0.0.0:{os.getenv('PORT', '8000')}"
backlog = 2048

# Worker processes
workers = int(os.getenv("GUNICORN_WORKERS", multiprocessing.cpu_count() * 2 + 1))
worker_class = "uvicorn.workers.UvicornWorker"
worker_connections = 1000
timeout = 120
keepalive = 5

# Logging
loglevel = os.getenv("LOG_LEVEL", "info")
accesslog = "-"
errorlog = "-"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s'

# Process naming
proc_name = "ai_learning_system"

# Server mechanics
daemon = False
pidfile = None
umask = 0
user = None
group = None

# SSL (set these for HTTPS in production)
# keyfile = "/path/to/key.pem"
# certfile = "/path/to/cert.pem"
