import pytest
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from users.models import GenderChoices

User = get_user_model()

@pytest.mark.django_db
class TestCustomUser:

    def test_create_user_with_all_fields(self):
        user = User.objects.create_user(
            username="testuser1",
            email="test1@example.com",
            password="testpass1234",
            first_name="mahdi",
            last_name="afshari",
            bio="Bio text here",
            gender=GenderChoices.MALE
        )
        assert user.username == "testuser1"
        assert user.email == "test1@example.com"
        assert user.bio == "Bio text here"
        assert user.gender == GenderChoices.MALE
        assert user.check_password("testpass1234")

    def test_default_gender_is_unknown(self):
        user = User.objects.create_user(
            username="nogender",
            password="password"
        )
        assert user.gender == GenderChoices.UNKNOWN

    def test_str_returns_full_name(self):
        user = User.objects.create_user(
            username="nameduser",
            first_name="mahdii",
            last_name="Afsharii",
            password="pass"
        )
        assert str(user) == "mahdii Afsharii"

    def test_str_returns_username_if_no_name(self):
        user = User.objects.create_user(
            username="onlyusername",
            first_name="",
            last_name="",
            password="pass"
        )
        assert str(user) == "onlyusername"

    def test_gender_choices_valid(self):
        valid_choices = [GenderChoices.MALE, GenderChoices.FEMALE, GenderChoices.UNKNOWN]
        for gender in valid_choices:
            user = User(
                username=f"user_{gender}",
                gender=gender
            )
            user.set_password("pass")
            user.full_clean()  # Should not raise

    def test_invalid_gender_raises_validation_error(self):
        user = User(
            username="badgender",
            gender="invalid"
        )
        user.set_password("pass")
        with pytest.raises(ValidationError):
            user.full_clean()

    def test_custom_manager_create_user(self):
        user = User.objects.create_user(
            username="manageruser",
            email="manager@example.com",
            password="securepass"
        )
        assert isinstance(user, User)
        assert user.username == "manageruser"
        assert user.email == "manager@example.com"

