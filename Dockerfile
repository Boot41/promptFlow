# Stage 1: Build the React frontend
FROM node:20 AS frontend
ENV VITE_BASE_URL=https://promptflow-mha4s7stfa-el.a.run.app
WORKDIR /client
COPY client/package*.json ./
RUN npm install
COPY client/ ./

# Update Vite config for Django compatibility
RUN sed -i 's/outDir: .build.,/outDir: "build",\n    assetsDir: "assets",\n    base: "\/static\/",/' vite.config.js || echo "Vite config update failed, may need manual update"

RUN npm run build  # Outputs to /client/build

# Stage 2: Build the Django backend
FROM python:3.10 AS backend
WORKDIR /app

ARG GROQ_API_KEY

ENV GROQ_API_KEY=${GROQ_API_KEY}

# Install dependencies
COPY server/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY server/ ./

# Properly configure static files and Whitenoise
RUN echo "\n\
STATIC_URL = '/static/'\n\
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')\n\
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]\n\
WHITENOISE_MIMETYPES = {'.js': 'application/javascript', '.css': 'text/css'}\n\
MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')" >> core/settings.py

# Create static directories and copy frontend build
RUN mkdir -p /app/static
COPY --from=frontend /client/build /app/static

# Run collectstatic to process the files
RUN python manage.py collectstatic --noinput
RUN python manage.py makemigrations
RUN python manage.py migrate

EXPOSE 8000

# Start the server
CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000"]