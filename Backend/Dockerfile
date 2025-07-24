FROM python:3.11-slim

WORKDIR /app


RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc libpq-dev --fix-missing && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Django project
COPY . .

# Expose the port Django will run on
EXPOSE 8000

# Run Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]