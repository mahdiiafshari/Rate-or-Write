from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Competitor

@receiver(post_save, sender=Competitor)
def update_competitor_count_on_create(sender, instance, created, **kwargs):
    if created:
        instance.competition.update_competitor_count()