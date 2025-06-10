"""
URL configuration for RoninEye project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from dashboard.views import *
from api_monitor.views import *
from users.views import *
from django.conf.urls.static import static


urlpatterns = [
    path('',home, name='home'),
    path('dashboard/',dashboard,name='dashboard'),
    path('documentation/',documentation,name='documentation'),
    path('configuration/',configuration,name='configuration'),
    path('settings/',settings,name='settings'),
    path('alerts/',alerts,name='alerts'),
    path('login/',login,name='login'),
    path('signup/',signup,name='signup'),
    path('logout/', logout, name='logout'),
    path('profile/',profile,name='profile'),
    
]
