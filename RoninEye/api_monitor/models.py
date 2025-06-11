from django.db import models
import secrets
from django.conf import settings

# Create your models here.
from django.db import models
from django.conf import settings

user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)


class APIMetric(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)  # <-- allow null temporarily
    url = models.URLField()
    method = models.CharField(max_length=10)
    response_time = models.FloatField()
    status_code = models.IntegerField()
    is_successful = models.BooleanField()
    timestamp = models.DateTimeField(auto_now_add=True)


class APIKey(models.Model):
    key = models.CharField(max_length=100, unique=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.key:
            self.key = secrets.token_hex(20)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username}'s API Key"