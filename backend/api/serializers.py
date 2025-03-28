
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Patient, Doctor, Specialization, Availability, Appointment, MedicalRecord

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class SpecializationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialization
        fields = ['id', 'name']

class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    
    class Meta:
        model = Patient
        fields = ['id', 'user', 'date_of_birth', 'phone', 'address', 'insurance_provider', 'insurance_id', 'created_at']
        read_only_fields = ['created_at']
    
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(
            username=user_data['username'],
            email=user_data['email'],
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
            password='temppassword123'  # In a real app, you'd handle this better
        )
        return Patient.objects.create(user=user, **validated_data)

class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    specializations = SpecializationSerializer(many=True)
    
    class Meta:
        model = Doctor
        fields = ['id', 'user', 'specializations', 'biography', 'created_at']
        read_only_fields = ['created_at']
    
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        specializations_data = validated_data.pop('specializations')
        
        user = User.objects.create_user(
            username=user_data['username'],
            email=user_data['email'],
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
            password='temppassword123'  # In a real app, you'd handle this better
        )
        
        doctor = Doctor.objects.create(user=user, **validated_data)
        
        for specialization_data in specializations_data:
            specialization, _ = Specialization.objects.get_or_create(name=specialization_data['name'])
            doctor.specializations.add(specialization)
        
        return doctor

class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = ['id', 'doctor', 'day', 'start_time', 'end_time']
        read_only_fields = ['id']

class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Appointment
        fields = ['id', 'patient', 'doctor', 'date', 'start_time', 'end_time', 
                  'reason', 'status', 'notes', 'created_at', 'updated_at',
                  'patient_name', 'doctor_name']
        read_only_fields = ['created_at', 'updated_at', 'patient_name', 'doctor_name']
    
    def get_patient_name(self, obj):
        return f"{obj.patient.user.first_name} {obj.patient.user.last_name}"
    
    def get_doctor_name(self, obj):
        return f"Dr. {obj.doctor.user.first_name} {obj.doctor.user.last_name}"
    
    def validate(self, data):
        """
        Check that the appointment doesn't conflict with existing appointments
        and falls within doctor's availability.
        """
        doctor = data.get('doctor')
        date = data.get('date')
        start_time = data.get('start_time')
        end_time = data.get('end_time')
        
        # Validate end_time is after start_time
        if start_time >= end_time:
            raise serializers.ValidationError("End time must be after start time")
        
        # Check for conflicts with other appointments
        conflicting_appointments = Appointment.objects.filter(
            doctor=doctor,
            date=date,
            status__in=['scheduled', 'confirmed']
        ).filter(
            # Overlapping time ranges
            models.Q(start_time__lt=end_time, end_time__gt=start_time)
        )
        
        if self.instance:
            conflicting_appointments = conflicting_appointments.exclude(pk=self.instance.pk)
        
        if conflicting_appointments.exists():
            raise serializers.ValidationError("This time slot conflicts with an existing appointment")
        
        # Check if the appointment is within doctor's availability
        day_of_week = date.strftime('%A')
        availability = Availability.objects.filter(
            doctor=doctor,
            day=day_of_week,
            start_time__lte=start_time,
            end_time__gte=end_time
        )
        
        if not availability.exists():
            raise serializers.ValidationError("The doctor is not available at this time")
        
        return data

class MedicalRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalRecord
        fields = ['id', 'patient', 'appointment', 'diagnosis', 'prescription', 'notes', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
