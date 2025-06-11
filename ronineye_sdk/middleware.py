# ronineye_sdk/middleware.py

import time
import requests
from django.utils.deprecation import MiddlewareMixin
from .config import RONINEYE_API_KEY, RONINEYE_ENDPOINT

class RoninEyeMiddleware(MiddlewareMixin):
    def process_view(self, request, view_func, view_args, view_kwargs):
        request._ronineye_start = time.time()

    def process_response(self, request, response):
        if not hasattr(request, "_ronineye_start"):
            return response

        duration = round((time.time() - request._ronineye_start) * 1000, 2)
        path = request.path
        method = request.method
        status_code = response.status_code
        success = 200 <= status_code < 400

        try:
            requests.post(
                RONINEYE_ENDPOINT,
                json={
                    "url": path,
                    "method": method,
                    "response_time": duration,
                    "status_code": status_code,
                    "is_successful": success
                },
                headers={"Authorization": f"Bearer {RONINEYE_API_KEY}"}
            )
        except:
            pass

        return response
