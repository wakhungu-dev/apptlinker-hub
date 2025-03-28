
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PatientViewSet, DoctorViewSet, SpecializationViewSet,
    AvailabilityViewSet, AppointmentViewSet, MedicalRecordViewSet,
    UserRegistrationView, UserLoginView, UserLogoutView, CurrentUserView,
    CheckDoctorAvailabilityView
)

router = DefaultRouter()
router.register(r'patients', PatientViewSet)
router.register(r'doctors', DoctorViewSet)
router.register(r'specializations', SpecializationViewSet)
router.register(r'availabilities', AvailabilityViewSet)
router.register(r'appointments', AppointmentViewSet)
router.register(r'medical-records', MedicalRecordViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', UserLogoutView.as_view(), name='logout'),
    path('user/', CurrentUserView.as_view(), name='current-user'),
    path('check-availability/', CheckDoctorAvailabilityView.as_view(), name='check-availability'),
]
