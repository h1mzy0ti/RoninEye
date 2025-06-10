from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST, require_http_methods
from django.http import JsonResponse
from .models import APIKey

@login_required
@require_POST
def generate_api_key(request):
    new_key = APIKey.objects.create(user=request.user, name='New Key')
    return JsonResponse({'success': True, 'key': {'id': new_key.id, 'key': new_key.key}})

@login_required
@require_http_methods(['DELETE'])
def delete_api_key(request, key_id):
    try:
        key = APIKey.objects.get(id=key_id, user=request.user)
        key.delete()
        return JsonResponse({'success': True})
    except APIKey.DoesNotExist:
        return JsonResponse({'success': False})
