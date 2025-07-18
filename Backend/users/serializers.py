# users/serializers.py
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'bio', 'gender', 'profile_picture')

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match"})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')  # Remove password2 from data
        user = User.objects.create_user(**validated_data)
        return user


class CustomUserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'full_name',
            'bio',
            'profile_picture',
            'gender',
            'date_joined',
        ]
        read_only_fields = ['id', 'username', 'email', 'date_joined', 'full_name']

    def get_full_name(self, obj):
        return obj.get_full_name()

