from django.db import models
from users.models import CustomUser
from django.core.exceptions import ValidationError

def validate_non_empty(value):
    if not value.strip():
        raise ValidationError("Content cannot be empty.")


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Post(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('published', 'Published'),
    )
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE , related_name='posts')
    title = models.CharField(max_length=200)
    post = models.TextField(validators=[validate_non_empty])
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='posts')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=['author']),
            models.Index(fields=['category']),
        ]

    def __str__(self):
        return f"{self.title} by {self.author} in {self.category}"


class PostLike(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    post = models.ForeignKey('Post', on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')  # Prevent duplicate likes

    def __str__(self):
        return f"{self.user} liked {self.post}"