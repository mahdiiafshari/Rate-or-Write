from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

from .manager import CustomUserManager


class GenderChoices(models.TextChoices):
    MALE = 'male', _('Male')
    FEMALE = 'female', _('Female')
    UNKNOWN = 'unknown', _('Unknown')


class CustomUser(AbstractUser):
    bio = models.TextField(_("Bio"), blank=True, null=True)
    profile_picture = models.ImageField(_("Profile Picture"), upload_to='profile_pics/', blank=True, null=True)
    gender = models.CharField(
        max_length=10,
        choices=GenderChoices.choices,
        default=GenderChoices.UNKNOWN,
        verbose_name=_("Gender")
    )

    objects = CustomUserManager()

    def __str__(self):
        return self.get_full_name() or self.username

    @property
    def followers(self):
        return CustomUser.objects.filter(follower_relationships__following=self)

    @property
    def following(self):
        return CustomUser.objects.filter(following_relationships__follower=self)