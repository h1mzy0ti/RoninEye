# views.py

from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST, require_http_methods
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.timezone import now
import json

from .models import APIKey, APIMetric


@require_POST
@login_required
def generate_api_key(request):
    """
    Generate a new API key for the logged-in user.
    """
    api_key = APIKey.objects.create(user=request.user)
    return JsonResponse({
        'success': True,
        'key': {
            'id': api_key.id,
            'key': api_key.key
        }
    })


@login_required
@require_http_methods(['DELETE'])
def delete_api_key(request, key_id):
    """
    Delete an existing API key by ID for the logged-in user.
    """
    try:
        key = APIKey.objects.get(id=key_id, user=request.user)
        key.delete()
        return JsonResponse({'success': True})
    except APIKey.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'API Key not found'}, status=404)


@csrf_exempt
@require_POST
def collect_metrics(request):
    api_key_value = request.headers.get("X-API-KEY")

    if not api_key_value:
        return JsonResponse({"error": "Missing API Key"}, status=400)

    try:
        api_key = APIKey.objects.get(key=api_key_value, is_active=True)
    except APIKey.DoesNotExist:
        return JsonResponse({"error": "Invalid API Key"}, status=401)

    try:
        data = json.loads(request.body)

        APIMetric.objects.create(
            url=data["url"],
            method=data["method"],
            response_time=data["response_time"],
            status_code=data["status_code"],
            is_successful=data["is_successful"],
            timestamp=now()
        )

        return JsonResponse({"message": "Metric recorded."}, status=201)

    except KeyError as e:
        return JsonResponse({"error": f"Missing field: {str(e)}"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
