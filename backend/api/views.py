from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, ChangePasswordSerializer, ResetPasswordRequestSerializer, ResetPasswordSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import authentication
from trading212.models import Connection
from rest_framework import status
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from .models import PasswordReset
from django.http import HttpResponse
from django.core.mail import send_mail
import os

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class UserDetails(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [AllowAny]
    
    def get(self, request, username, format=None):
        """
        Return a list of all users.
        """
        id = [user.id for user in User.objects.filter(username = username)]
        api_key = [user.api_key for user in Connection.objects.filter(account = id[0])]
        if api_key == []:
            api_key = "null"
        return Response({'id': id, 'api_key': api_key})
    
class ChangePasswordView(generics.UpdateAPIView):

    queryset = User.objects.all()
    permission_classes = (AllowAny)
    serializer_class = ChangePasswordSerializer

class RequestPasswordReset(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = ResetPasswordRequestSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        email = request.data['email']
        user = User.objects.filter(email__iexact=email).first()

        if user:
            token_generator = PasswordResetTokenGenerator()
            token = token_generator.make_token(user) 
            reset = PasswordReset(email=email, token=token)
            reset.save()

            #print(os.environ)
            #reset_url = f"{os.environ['http://127.0.0.1:8000/api/user/reset']}/{token}"
            subject = 'Update Password!'
            message = 'Thank you for registering at our site.\n To reset your password, click on this link: http://localhost:5173/reset/' + token
            from_email = 'johnrant253@gmail.com'
            recipient_list = [email]
        
            send_mail(subject, message, from_email, recipient_list, fail_silently=False)
        
            #return HttpResponse('Email has been sent!')


            # Sending reset link via email (commented out for clarity)
            # ... (email sending code)

            return Response({'We have sent you a link to reset your password'}, status=status.HTTP_200_OK)
        else:
            return Response({"User with credentials not found"}, status=status.HTTP_404_NOT_FOUND)

        
class ResetPassword(generics.GenericAPIView):
    serializer_class = ResetPasswordSerializer
    permission_classes = []

    def post(self, request, token):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        
        new_password = data['new_password']
        confirm_password = data['confirm_password']
        
        if new_password != confirm_password:
            return Response({"error": "Passwords do not match"}, status=400)
        
        reset_obj = PasswordReset.objects.filter(token=token).first()
        
        if not reset_obj:
            return Response({'error':'Invalid token'}, status=400)
        
        user = User.objects.filter(email=reset_obj.email).first()
        
        if user:
            user.set_password(request.data['new_password'])
            user.save()
            
            reset_obj.delete()
            
            return Response({'Password updated'})
        else: 
            return Response({'No user found'}, status=404)