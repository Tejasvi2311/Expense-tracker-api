from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Expense

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model=User
        fields=['username','email','password']

    def create(self,validated_data):
        user =User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']

        )
        return user

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model=Expense
        fields='__all__'
        read_only_fields=['id','date','user']