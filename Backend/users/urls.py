from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import UserProfileView, RegisterUserView, LoginView, LogoutView, CurrentUserView, ListUsersView, \
    GlobalUserProfileView

router = DefaultRouter()

urlpatterns = [
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('auth/me/', CurrentUserView.as_view(), name='current_user'),
    path('' , ListUsersView.as_view(), name='user_list'),
    path('<int:id>/', GlobalUserProfileView.as_view(), name='user_profile'),
]
