from django.db import models
import secrets

# Create your models here.
from django.db import models
from django.conf import settings

class MonitoredAPI(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    url = models.URLField()
    method = models.CharField(max_length=10, choices=[('GET', 'GET'), ('POST', 'POST')])
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.method})"

class APIMetric(models.Model):
    api = models.ForeignKey(MonitoredAPI, on_delete=models.CASCADE, related_name='metrics')
    response_time = models.FloatField()
    status_code = models.IntegerField()
    is_successful = models.BooleanField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.api.name} at {self.timestamp}"
    
    
class APIKey(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, help_text="Label for the key (e.g., Project X SDK Key)")
    key = models.CharField(max_length=40, unique=True, editable=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_used_at = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.key:
            self.key = secrets.token_hex(20)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({'Active' if self.is_active else 'Inactive'})"