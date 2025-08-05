from django.db import models
from django.contrib.auth import get_user_model
from post.models import Post

User = get_user_model()

# Define choices for permission levels
PERMISSION_LEVELS = (
    ('banned', 'Banned'),
    ('normal', 'Normal'),
    ('admin', 'Admin'),
    ('owner', 'Owner'),
)

class GroupModel(models.Model):
    name = models.CharField(max_length=100, unique=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='created_groups'
    )
    # Replace direct ManyToManyField with one using GroupMembership
    users = models.ManyToManyField(
        User,
        related_name='joined_groups',
        through='GroupMembership'
    )
    posts = models.ManyToManyField(
        Post,
        through='GroupPostShare',
        related_name='shared_to_groups'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class GroupMembership(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='group_memberships'
    )
    group = models.ForeignKey(
        GroupModel,
        on_delete=models.CASCADE,
        related_name='memberships'
    )
    role = models.CharField(
        max_length=20,
        choices=PERMISSION_LEVELS,
        default='normal'
    )
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'group')  # Ensure a user can only have one role per group

    def __str__(self):
        return f"{self.user.username} - {self.group.name} ({self.role})"

class GroupPostShare(models.Model):
    group = models.ForeignKey(GroupModel, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    shared_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    shared_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.group.name} by {self.post}"