from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import UserProfileView, RegisterUserView, LoginView

router = DefaultRouter()

urlpatterns = [
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
]