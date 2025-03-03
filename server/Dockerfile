# Use Python 3.9 as base image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1     PYTHONUNBUFFERED=1

# Create and set working directory
WORKDIR /app

# Install system dependencies and clean up to reduce image size
RUN apt-get update &&     apt-get install -y --no-install-recommends gcc python3-dev &&     rm -rf /var/lib/apt/lists/*

# Upgrade pip to the latest version and install dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip &&     pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . /app/

# Expose Django port
EXPOSE 8000

# Run Django in development mode with auto-reload
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
