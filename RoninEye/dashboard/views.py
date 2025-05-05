from django.shortcuts import render

def home(request):
    return render(request,'home.html')

def dashboard(request):
    return render(request,'dashbaord.html')

def configuration(request):
    return render(request,'configuration.html')
def settings(request):
    return render(request,'settings.html')
def alerts(request):
    return render(request,'alerts.html')