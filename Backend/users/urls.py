from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import UserProfileView, RegisterUserView

router = DefaultRouter()

urlpatterns = [
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('register/', RegisterUserView.as_view(), name='register'),
]