from django.shortcuts import render
from api_monitor.models import APIMetric
from django.utils.timezone import now, timedelta
from django.db.models import Avg, Count, Q
import json
from django.core.serializers.json import DjangoJSONEncoder
from django.contrib.auth.decorators import login_required

def home(request):
    return render(request,'home.html')
def documentation(request):
    return render(request,'documentation.html')

@login_required(login_url='login')
def dashboard(request):
    all_metrics = APIMetric.objects.all()
    last_hour_metrics = APIMetric.objects.filter(timestamp__gte=now() - timedelta(hours=1))

    # KPIs
    avg_response_time = all_metrics.aggregate(avg=Avg('response_time'))['avg'] or 0
    total_count = all_metrics.count()
    error_count = all_metrics.filter(is_successful=False).count()
    uptime_count = all_metrics.filter(is_successful=True).count()

    error_rate = (error_count / total_count * 100) if total_count else 0
    uptime = (uptime_count / total_count * 100) if total_count else 0
    requests_per_min = last_hour_metrics.count() / 60

    # Status code distribution (for pie chart)
    status_dist = list(
        all_metrics.values('status_code').annotate(count=Count('id')).order_by('status_code')
    )

    context = {
        'avg_response_time': round(avg_response_time, 2),
        'error_rate': round(error_rate, 2),
        'uptime': round(uptime, 2),
        'requests_per_min': int(requests_per_min),
        'status_distribution_json': json.dumps(status_dist, cls=DjangoJSONEncoder),
    }

    return render(request, 'dashbaord.html', context)

@login_required(login_url='login')
def configuration(request):
    return render(request,'configuration.html')

@login_required(login_url='login')
def settings(request):
    return render(request,'settings.html')

@login_required(login_url='login')
def alerts(request):
    return render(request,'alerts.html')

@login_required(login_url='login')
def profile(request):
    return render(request,'profile.html')

