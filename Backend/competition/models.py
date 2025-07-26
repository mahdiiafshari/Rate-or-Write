from django.conf import settings
from django.db import models
from post.models import Category


class Competition(models.Model):
    STATUS_CHOICES = (
        ('DRAFT', 'Draft'),
        ('ACTIVE', 'Active'),
        ('CLOSED', 'Closed'),
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='DRAFT')
    is_public = models.BooleanField(default=True)
    name = models.CharField(max_length=100 ,unique=True, )
    category = models.ForeignKey(Category,null=True, on_delete=models.SET_NULL)
    bio = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class Competitor(models.Model):
    competition = models.ForeignKey(Competition, on_delete=models.CASCADE, related_name='competitors')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='competitors')
    post = models.OneToOneField('post.Post', on_delete=models.CASCADE, related_name='competitor')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('competition', 'user')
        indexes = [
            models.Index(fields=['created_at']),
            models.Index(fields=['competition', 'user']),
        ]

    def __str__(self):
        return f"{self.user.username} in {self.competition.name}"
