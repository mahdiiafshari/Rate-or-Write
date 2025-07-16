# accounts/manager.py
from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _

class CustomUserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, username, email=None, password=None, **extra_fields):
        if not username:
            raise ValueError(_('The Username must be set'))

        email = self.normalize_email(email)
        extra_fields.setdefault('is_active', True)

        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if not password:
            raise ValueError(_('Superusers must have a password.'))

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superusers must have is_staff=True.'))

        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superusers must have is_superuser=True.'))

        return self.create_user(username, email, password, **extra_fields)
