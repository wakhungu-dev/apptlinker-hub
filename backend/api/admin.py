
from django.contrib import admin
from .models import Patient, Doctor, Specialization, Availability, Appointment, MedicalRecord

admin.site.register(Patient)
admin.site.register(Doctor)
admin.site.register(Specialization)
admin.site.register(Availability)
admin.site.register(Appointment)
admin.site.register(MedicalRecord)
