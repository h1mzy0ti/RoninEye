from django.contrib import admin
from django.urls import path
from dashboard.views import *
from api_monitor.views import *
from users.views import *
from django.conf.urls.static import static

urlpatterns = [
    path('', home, name='home'),
    path('dashboard/', dashboard, name='dashboard'),
    path('documentation/', documentation, name='documentation'),
    path('configuration/', configuration, name='configuration'),
    path('settings/', settings, name='settings'),
    path('alerts/', alerts, name='alerts'),
    path('login/', login, name='login'),
    path('signup/', signup, name='signup'),
    path('logout/', logout, name='logout'),
    path('profile/', profile, name='profile'),

    path('api-monitor/generate-api-key/', generate_api_key, name='generate_api_key'),
    path('api-monitor/delete-api-key/<int:key_id>/', delete_api_key, name='delete_api_key'),
    path('api-monitor/collect-metrics/', collect_metrics, name='collect_metrics'),
]
