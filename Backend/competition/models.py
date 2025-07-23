from django.conf import settings
from django.db import models
from post.models import Category


class Competition(models.Model):
    name = models.CharField(max_length=100)
    category = models.ForeignKey(Category,null=True, on_delete=models.SET_NULL)
    bio = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Competitor(models.Model):
    competition = models.ForeignKey(Competition, on_delete=models.CASCADE , related_name='competitors')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE ,related_name="competitors")
    post = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('competition', 'user')
