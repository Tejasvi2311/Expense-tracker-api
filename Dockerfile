# Use official Python image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set working directory
WORKDIR /app

# Install system dependencies including mysqladmin
RUN apt-get update \
    && apt-get install -y \
        gcc \
        libmagic-dev \
        default-libmysqlclient-dev \
        pkg-config \
        build-essential \
        default-mysql-client \
    && apt-get clean

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy project files
COPY . /app/

# Start the Django server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
