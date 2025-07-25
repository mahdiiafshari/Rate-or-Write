from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import UserProfileView, RegisterUserView, LoginView, LogoutView

router = DefaultRouter()

urlpatterns = [
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
]