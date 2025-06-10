from django.shortcuts import render,redirect
from django.http import JsonResponse
from django.contrib.auth import get_user_model, authenticate, login as auth_login
from django.contrib.auth import logout as auth_logout
from django.contrib.auth.hashers import make_password
from django.views.decorators.csrf import csrf_exempt
from dashboard.views import *
from dashboard.templates import *
import json
from django.contrib import messages

User = get_user_model()



def login(request):
    if request.method == 'GET':
        return render(request, 'login.html')

    elif request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '').strip()

        if not username or not password:
            return render(request, 'login.html', {'error': 'Both username and password are required'})

        user = authenticate(request, username=username, password=password)

        if user is not None:
            auth_login(request, user)
            return redirect('dashboard')
        else:
            return render(request, 'login.html', {'error': 'Invalid credentials'})

    return redirect('login')  


def signup(request):
    if request.method == "POST":
        username = request.POST.get('username', '').strip()
        email = request.POST.get('email', '').strip()
        password = request.POST.get('password', '')
        confirm_password = request.POST.get('confirm-password', '')

        # Basic validation
        if not username or not email or not password or not confirm_password:
            return render(request, 'signup.html', {'error': 'All fields are required.'})

        if password != confirm_password:
            return render(request, 'signup.html', {'error': 'Passwords do not match.'})

        if User.objects.filter(username=username).exists():
            return render(request, 'signup.html', {'error': 'Username already taken.'})

        if User.objects.filter(email=email).exists():
            return render(request, 'signup.html', {'error': 'Email already registered.'})

        # Create the user
        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()

        messages.success(request, "Account created successfully! Please login.")
        return redirect('dashboard')

    # GET request just render the signup form
    return render(request, 'signup.html')

def logout(request):
    auth_logout(request)
    messages.success(request, "You have been logged out.")
    return redirect('home')  # or wherever your login page is
