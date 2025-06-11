from django.shortcuts import render
from api_monitor.models import APIMetric
from django.utils.timezone import now, timedelta
from django.db.models import Avg, Count, Q
import json
from django.core.serializers.json import DjangoJSONEncoder
from django.contrib.auth.decorators import login_required
from api_monitor.models import APIKey
from django.db.models import F

def home(request):
    return render(request,'home.html')
def documentation(request):
    return render(request,'documentation.html')

from django.db.models.functions import TruncMinute
from django.utils.timezone import now
from collections import defaultdict

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

    # Line Charts
    response_times = (
        last_hour_metrics
        .annotate(minute=TruncMinute('timestamp'))
        .values('minute')
        .annotate(avg_response=Avg('response_time'))
        .order_by('minute')
    )

    error_rates = (
        last_hour_metrics
        .annotate(minute=TruncMinute('timestamp'))
        .values('minute')
        .annotate(
            total=Count('id'),
            errors=Count('id', filter=Q(is_successful=False))
        )
        .annotate(rate=100.0 * F('errors') / F('total'))
        .order_by('minute')
    )

    # Status Pie Chart
    status_dist = list(
        all_metrics.values('status_code').annotate(count=Count('id')).order_by('status_code')
    )

    # Uptime Line Chart (last hour)
    uptime_series = (
        last_hour_metrics
        .annotate(minute=TruncMinute('timestamp'))
        .values('minute')
        .annotate(
            total=Count('id'),
            up=Count('id', filter=Q(is_successful=True))
        )
        .annotate(rate=100.0 * F('up') / F('total'))
        .order_by('minute')
    )

    # Request Volume Line Chart (last hour)
    request_volume_series = (
        last_hour_metrics
        .annotate(minute=TruncMinute('timestamp'))
        .values('minute')
        .annotate(count=Count('id'))
        .order_by('minute')
    )

    # Heatmap Utility Function
    def build_heatmap(metrics, filter_q=None):
        heatmap = {}
        for metric in metrics:
            hour = metric.timestamp.hour
            day = metric.timestamp.strftime("%a")  # Mon, Tue, etc.
            key = (day, hour)
            if filter_q is None or filter_q(metric):
                heatmap[key] = heatmap.get(key, 0) + 1

        series = []
        days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        for day in days:
            data = []
            for hour in range(24):
                count = heatmap.get((day, hour), 0)
                data.append({'x': f"{hour}:00", 'y': day, 'z': count})
            series.append({'name': day, 'data': data})
        return series

    calls_heatmap = build_heatmap(last_hour_metrics)
    errors_heatmap = build_heatmap(last_hour_metrics, filter_q=lambda m: not m.is_successful)

    context = {
        'avg_response_time': round(avg_response_time, 2),
        'error_rate': round(error_rate, 2),
        'uptime': round(uptime, 2),
        'requests_per_min': int(requests_per_min),

        'status_distribution_json': json.dumps(status_dist, cls=DjangoJSONEncoder),
        'response_time_json': json.dumps([
            {'x': item['minute'].isoformat(), 'y': item['avg_response']} for item in response_times
        ]),
        'error_rate_json': json.dumps([
            {'x': item['minute'].isoformat(), 'y': round(item['rate'], 2)} for item in error_rates
        ]),
        'uptime_json': json.dumps([
            {'x': item['minute'].isoformat(), 'y': round(item['rate'], 2)} for item in uptime_series
        ]),
        'request_volume_json': json.dumps([
            {'x': item['minute'].isoformat(), 'y': item['count']} for item in request_volume_series
        ]),
        'calls_heatmap_json': json.dumps(calls_heatmap),
        'errors_heatmap_json': json.dumps(errors_heatmap),
    }

    return render(request, 'dashbaord.html', context)

@login_required(login_url='login')
def configuration(request):
    api_keys = APIKey.objects.filter(user=request.user)
    return render(request, 'configuration.html', {'api_keys': api_keys})

@login_required(login_url='login')
def settings(request):
    return render(request,'settings.html')

@login_required(login_url='login')
def alerts(request):
    return render(request,'alerts.html')

@login_required(login_url='login')
def profile(request):
    return render(request,'profile.html')

