
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from .models import Patient, Doctor, Specialization, Availability, Appointment, MedicalRecord
from .serializers import (
    PatientSerializer, DoctorSerializer, SpecializationSerializer,
    AvailabilitySerializer, AppointmentSerializer, MedicalRecordSerializer, UserSerializer
)
from datetime import datetime

class UserRegistrationView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        role = request.data.get('role')
        
        if role == 'patient':
            serializer = PatientSerializer(data=request.data)
        elif role == 'doctor':
            serializer = DoctorSerializer(data=request.data)
        else:
            return Response({"error": "Invalid role specified"}, status=status.HTTP_400_BAD_REQUEST)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        
        if user:
            login(request, user)
            
            # Determine user role
            user_data = UserSerializer(user).data
            if hasattr(user, 'patient_profile'):
                user_data['role'] = 'patient'
                user_data['profile_id'] = user.patient_profile.id
            elif hasattr(user, 'doctor_profile'):
                user_data['role'] = 'doctor'
                user_data['profile_id'] = user.doctor_profile.id
            else:
                user_data['role'] = 'admin'
            
            return Response(user_data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class UserLogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"success": "Successfully logged out"}, status=status.HTTP_200_OK)

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user_data = UserSerializer(request.user).data
        
        if hasattr(request.user, 'patient_profile'):
            user_data['role'] = 'patient'
            user_data['profile_id'] = request.user.patient_profile.id
        elif hasattr(request.user, 'doctor_profile'):
            user_data['role'] = 'doctor'
            user_data['profile_id'] = request.user.doctor_profile.id
        else:
            user_data['role'] = 'admin'
        
        return Response(user_data)

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    
    def get_permissions(self):
        if self.action in ['create']:
            return [AllowAny()]
        elif self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        else:
            return [IsAdminUser()]
    
    @action(detail=True, methods=['get'])
    def appointments(self, request, pk=None):
        patient = self.get_object()
        appointments = Appointment.objects.filter(patient=patient)
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def medical_records(self, request, pk=None):
        patient = self.get_object()
        records = MedicalRecord.objects.filter(patient=patient)
        serializer = MedicalRecordSerializer(records, many=True)
        return Response(serializer.data)

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        else:
            return [IsAdminUser()]
    
    @action(detail=True, methods=['get'])
    def availabilities(self, request, pk=None):
        doctor = self.get_object()
        availabilities = Availability.objects.filter(doctor=doctor)
        serializer = AvailabilitySerializer(availabilities, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def appointments(self, request, pk=None):
        doctor = self.get_object()
        appointments = Appointment.objects.filter(doctor=doctor)
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)

class SpecializationViewSet(viewsets.ModelViewSet):
    queryset = Specialization.objects.all()
    serializer_class = SpecializationSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        else:
            return [IsAdminUser()]

class AvailabilityViewSet(viewsets.ModelViewSet):
    queryset = Availability.objects.all()
    serializer_class = AvailabilitySerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    
    def get_permissions(self):
        if self.action in ['create']:
            return [IsAuthenticated()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        user = self.request.user
        
        if hasattr(user, 'patient_profile'):
            return Appointment.objects.filter(patient=user.patient_profile)
        elif hasattr(user, 'doctor_profile'):
            return Appointment.objects.filter(doctor=user.doctor_profile)
        
        # Admin users can see all appointments
        return Appointment.objects.all()

class MedicalRecordViewSet(viewsets.ModelViewSet):
    queryset = MedicalRecord.objects.all()
    serializer_class = MedicalRecordSerializer
    
    def get_permissions(self):
        return [IsAuthenticated()]
    
    def get_queryset(self):
        user = self.request.user
        
        if hasattr(user, 'patient_profile'):
            return MedicalRecord.objects.filter(patient=user.patient_profile)
        elif hasattr(user, 'doctor_profile'):
            return MedicalRecord.objects.filter(appointment__doctor=user.doctor_profile)
        
        # Admin users can see all records
        return MedicalRecord.objects.all()

class CheckDoctorAvailabilityView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        doctor_id = request.data.get('doctor_id')
        date_str = request.data.get('date')
        
        try:
            doctor = Doctor.objects.get(id=doctor_id)
            date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
            day_of_week = date_obj.strftime('%A')
            
            # Get doctor's availability for the selected day
            availabilities = Availability.objects.filter(doctor=doctor, day=day_of_week)
            
            # Get booked appointments for that day
            appointments = Appointment.objects.filter(
                doctor=doctor,
                date=date_obj,
                status__in=['scheduled', 'confirmed']
            )
            
            available_slots = []
            
            for availability in availabilities:
                # Create time slots (e.g., 30-minute intervals)
                current_time = availability.start_time
                
                while current_time < availability.end_time:
                    end_slot = datetime.combine(date_obj, current_time).replace(
                        hour=(current_time.hour + ((current_time.minute + 30) // 60)),
                        minute=((current_time.minute + 30) % 60)
                    ).time()
                    
                    if end_slot <= availability.end_time:
                        # Check if slot is available (not booked)
                        is_booked = appointments.filter(
                            start_time__lt=end_slot,
                            end_time__gt=current_time
                        ).exists()
                        
                        if not is_booked:
                            available_slots.append({
                                'start_time': current_time.strftime('%H:%M'),
                                'end_time': end_slot.strftime('%H:%M')
                            })
                    
                    # Move to next slot
                    current_time = end_slot
            
            return Response({
                'doctor_id': doctor_id,
                'date': date_str,
                'available_slots': available_slots
            })
            
        except Doctor.DoesNotExist:
            return Response({"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD"}, status=status.HTTP_400_BAD_REQUEST)
