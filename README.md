
# HealthSync - Healthcare Appointment Scheduling System

HealthSync is a comprehensive healthcare appointment scheduling system built with React, Django, and Tailwind CSS. The application allows patients to register, find doctors, book appointments, and manage their medical records.

## Features

- User authentication for patients, doctors, and administrators
- Patient management with profile and medical records
- Doctor management with specializations and availability settings
- Appointment scheduling with availability checking
- Medical records management
- Responsive and modern UI with Tailwind CSS

## Tech Stack

- **Frontend**: React, Tailwind CSS, React Router, React Query
- **Backend**: Django, Django REST Framework
- **Database**: SQLite (development), PostgreSQL (recommended for production)
- **API Documentation**: Swagger/OpenAPI

## Getting Started

### Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- pip
- npm or yarn

### Setting Up the Backend

1. Clone the repository:
   ```
   git clone <repository-url>
   cd healthcare-appointment-system
   ```

2. Set up the Python virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install the required Python packages:
   ```
   pip install -r requirements.txt
   ```

4. Set up the database:
   ```
   cd backend
   python manage.py migrate
   ```

5. Create a superuser (admin):
   ```
   python manage.py createsuperuser
   ```

6. Start the Django development server:
   ```
   python manage.py runserver
   ```

The backend will be available at http://localhost:8000/

### Setting Up the Frontend

1. In a new terminal, navigate to the project root:
   ```
   cd healthcare-appointment-system
   ```

2. Install the required Node.js packages:
   ```
   npm install
   ```

3. Start the React development server:
   ```
   npm run dev
   ```

The frontend will be available at http://localhost:8080/

## API Documentation

After starting the backend server, you can access the API documentation at:
- Swagger UI: http://localhost:8000/swagger/
- ReDoc: http://localhost:8000/redoc/

## Project Structure

```
healthcare-appointment-system/
├── backend/                # Django backend
│   ├── api/                # Django app for REST API
│   ├── healthcare_project/ # Django project settings
│   └── manage.py           # Django management script
├── src/                    # React frontend
│   ├── components/         # Reusable React components
│   ├── contexts/           # React contexts (auth, etc.)
│   ├── lib/                # Utility functions and API clients
│   ├── pages/              # React pages/routes
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
└── README.md               # Project documentation
```

## Deployment

For production deployment:

1. Configure a production-ready database like PostgreSQL in Django settings
2. Set appropriate environment variables for secrets and configurations
3. Build the React frontend: `npm run build`
4. Serve the Django application using a production WSGI server like Gunicorn
5. Set up Nginx or similar to serve static files and proxy API requests

## Security Considerations

- The application implements authentication and authorization
- Patient data is protected with appropriate access controls
- In a production environment, ensure HTTPS is enabled
- Regularly update dependencies to patch security vulnerabilities
