# PromptFlow

A flow-based prompt engineering tool built with Django and React.

## Quick Start with Docker

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd promptflow
   ```

2. Set up environment variables:
   ```bash
   # Copy the example environment file
   cp server/.env.example server/.env
   
   # Edit the .env file with your actual values
   ```

3. Build and run the containers:
   ```bash
   docker-compose up --build
   ```

4. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

## Environment Variables

The following environment variables are required in `server/.env`:

- `DJANGO_SECRET_KEY`: Django secret key for security
- `FIELD_ENCRYPTION_KEY`: Key for encrypting sensitive data
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret

## Development

For development, the application uses Docker volumes to enable hot-reloading:
- Frontend code changes will automatically trigger a rebuild
- Backend code changes will be reflected immediately

## Testing

The docker-compose file includes several testing services (currently commented out):
- `django-test`: Run Django tests
- `django-llm-evals`: Run LLM evaluation framework
- `django-coverage`: Generate test coverage reports

To run tests, uncomment the relevant service in docker-compose.yml and run:
```bash
docker-compose run django-test
```
