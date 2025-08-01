# AppointmentLinker Hub - Node.js Backend

This is the Node.js backend for the AppointmentLinker Hub healthcare appointment scheduling application. It provides a RESTful API for managing users, patients, doctors, appointments, and medical records.

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- TypeScript

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB database (local or MongoDB Atlas)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/apptlinker-hub
   JWT_SECRET=your_jwt_secret_key
   ```

### Running the Application

- Development mode:
  ```bash
  npm run dev
  ```

- Production mode:
  ```bash
  npm start
  ```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - User login
- `GET /api/users/me` - Get current user profile

### Specializations
- `GET /api/specializations` - Get all specializations
- `POST /api/specializations` - Create a specialization (Admin)
- `GET /api/specializations/:id` - Get specialization by ID
- `PUT /api/specializations/:id` - Update specialization (Admin)
- `DELETE /api/specializations/:id` - Delete specialization (Admin)

### Patients
- `POST /api/patients/me` - Create patient profile
- `GET /api/patients/me` - Get current patient profile
- `PATCH /api/patients/me` - Update current patient profile
- `GET /api/patients` - Get all patients (Admin/Doctor)
- `GET /api/patients/:id` - Get patient by ID (Admin/Doctor)

### Doctors
- `GET /api/doctors` - Get all doctors
- `POST /api/doctors/me` - Create doctor profile
- `GET /api/doctors/me` - Get current doctor profile
- `PATCH /api/doctors/me` - Update current doctor profile
- `GET /api/doctors/:id` - Get doctor by ID

### Availability
- `GET /api/availability/doctor/:doctorId` - Get a doctor's availability
- `POST /api/availability` - Create availability slot (Doctor)
- `GET /api/availability/me` - Get doctor's availability slots (Doctor)
- `PUT /api/availability/:slotId` - Update availability slot (Doctor)
- `DELETE /api/availability/:slotId` - Delete availability slot (Doctor)

### Appointments
- `POST /api/appointments` - Book an appointment (Patient)
- `PATCH /api/appointments/:appointmentId/cancel` - Cancel appointment (Patient)
- `PATCH /api/appointments/:appointmentId/status` - Update appointment status (Doctor)
- `GET /api/appointments/me` - Get user's appointments (Patient/Doctor)

### Medical Records
- `POST /api/medical-records` - Create a medical record (Doctor)
- `GET /api/medical-records/patient/:patientId` - Get patient records (Doctor)
- `GET /api/medical-records/me` - Get own medical records (Patient)
- `GET /api/medical-records/:recordId` - Get a specific record
- `PATCH /api/medical-records/:recordId` - Update medical record (Doctor)

## Data Models

- User - Authentication and user info
- Patient - Patient profile linked to user
- Doctor - Doctor profile linked to user
- Specialization - Medical specializations
- Availability - Doctor availability slots
- Appointment - Scheduled appointments
- MedicalRecord - Patient medical records

## License

This project is licensed under the MIT License.
