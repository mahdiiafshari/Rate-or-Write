import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

@pytest.mark.django_db
class TestUserAPI:
    def setup_method(self):
        self.client = APIClient()
        self.register_url = '/api/users/register/'
        self.login_url = '/api/users/login/'
        self.logout_url = '/api/users/logout/'
        self.profile_url = '/api/users/profile/'
        self.current_user_url = '/api/users/auth/me/'
        self.users_list_url = '/api/users/'
        self.global_profile_url = '/api/users/{id}/'

    def create_user(self, username="testuser",  password="testpass123"):
        user = User.objects.create_user(username=username, password=password)
        return user

    def authenticate(self, user):
        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        return refresh

    # RegisterUserView
    def test_register_user_success(self):
        response = self.client.post(self.register_url, {
            "username": "newuser",
            "email": "new@example.com",
            "password": "newpassword123",
            "password2": "newpassword123",
            "bio": "Optional bio here",  # Optional fields you can add
            "gender": "male",
        }, format='json')

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["detail"] == "User created successfully"
        assert response.data["user"]["username"] == "newuser"

    def test_register_user_missing_fields(self):
        response = self.client.post(self.register_url, {})
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    # LoginView
    def test_login_valid_credentials(self):
        self.create_user()
        response = self.client.post(self.login_url, {
            "username": "testuser",
            "password": "testpass123"
        })
        assert response.status_code == status.HTTP_200_OK
        assert response.data["user"]["username"] == "testuser"

    def test_login_invalid_credentials(self):
        response = self.client.post(self.login_url, {
            "username": "wrong",
            "password": "badpass"
        })
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    # LogoutView
    def test_logout_valid_refresh_token(self):
        user = self.create_user()
        refresh = self.authenticate(user)
        response = self.client.post(self.logout_url, {"refresh": str(refresh)})
        assert response.status_code == status.HTTP_205_RESET_CONTENT
        assert response.data["detail"] == "Logout successful"

    def test_logout_missing_token(self):
        user = self.create_user()
        self.authenticate(user)
        response = self.client.post(self.logout_url)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "Refresh token required" in response.data["detail"]

    def test_logout_invalid_token(self):
        user = self.create_user()
        self.authenticate(user)
        response = self.client.post(self.logout_url, {"refresh": "invalidtoken"})
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "Invalid token" in response.data["detail"]

    # UserProfileView
    def test_retrieve_user_profile_authenticated(self):
        user = self.create_user()
        self.authenticate(user)
        response = self.client.get(self.profile_url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["username"] == user.username

    def test_update_user_profile(self):
        user = self.create_user()
        self.authenticate(user)
        response = self.client.patch(self.profile_url, {"first_name": "NewName"})
        assert response.status_code == status.HTTP_200_OK
        assert response.data["first_name"] == "NewName"

    def test_retrieve_user_profile_unauthenticated(self):
        response = self.client.get(self.profile_url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    # --- CurrentUserView ---
    def test_current_user_view_authenticated(self):
        user = self.create_user()
        self.authenticate(user)
        response = self.client.get(self.current_user_url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["username"] == user.username

    # --- ListUsersView ---
    def test_list_users_excludes_staff(self):
        user = self.create_user(username="user1")
        staff_user = self.create_user(username="admin")
        staff_user.is_staff = True
        staff_user.save()

        self.authenticate(user)
        response = self.client.get(self.users_list_url)
        assert response.status_code == status.HTTP_200_OK
        usernames = [u["username"] for u in response.data]
        assert "user1" in usernames
        assert "admin" not in usernames

    # GlobalUserProfileView
    def test_global_user_profile_view(self):
        user = self.create_user()
        viewer = self.create_user(username="viewer")
        self.authenticate(viewer)

        response = self.client.get(self.global_profile_url.format(id=user.id))
        assert response.status_code == status.HTTP_200_OK
        assert response.data["username"] == user.username
