from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Competition, Competitor
from .serializers import CompetitionSerializer, CompetitorSerializer
from django.core.exceptions import ValidationError
from rest_framework.exceptions import PermissionDenied

class CompetitionCreateView(generics.CreateAPIView):
    """
    View for admins to create a new competition.
    Only accessible to admin users.
    """
    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        # Ensure only admins can create, and set default status if needed
        serializer.save()

class CompetitionListView(generics.ListAPIView):
    """
    View to list all competitions.
    Accessible to all users (authenticated or not).
    """
    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        # Optionally filter by status or other query params
        queryset = super().get_queryset()
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status.upper())
        return queryset

class CompetitorRegisterView(generics.CreateAPIView):
    """
    View to register a user for a competition.
    Requires authentication and a valid post associated with the user.
    """
    queryset = Competitor.objects.all()
    serializer_class = CompetitorSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Ensure the competition is active and the user hasn't already registered
        competition = serializer.validated_data['competition']
        if competition.status != 'ACTIVE':
            raise ValidationError("Cannot register for a non-active competition.")
        if Competitor.objects.filter(competition=competition, user=self.request.user).exists():
            raise ValidationError("You are already registered for this competition.")
        # Ensure the post belongs to the user
        post = serializer.validated_data['post']
        if post.user != self.request.user:
            raise PermissionDenied("You can only register with your own post.")
        serializer.save(user=self.request.user)