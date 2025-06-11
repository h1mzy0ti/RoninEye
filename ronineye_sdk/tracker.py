# ronineye_sdk/tracker.py

import time
import requests
import logging
from functools import wraps
from .config import RONINEYE_API_KEY, RONINEYE_ENDPOINT

# Set up logging
logger = logging.getLogger('ronineye.tracker')
logging.basicConfig(level=logging.INFO)  # Ensure logs show up in console too

class RoninEyeTracker:
    @staticmethod
    def _send_metrics(metrics):
        """Internal method to send metrics to the collector endpoint."""
        try:
            response = requests.post(
                RONINEYE_ENDPOINT,
                json=metrics,
                headers={
                    "X-API-KEY": RONINEYE_API_KEY,
                    "User-Agent": "RoninEye-Tracker/1.0"
                },
                timeout=3
            )
            if response.status_code != 201:
                logger.warning(
                    f"Metric submission failed. Status: {response.status_code}, Response: {response.text}"
                )
                print("⚠️ RoninEye Metrics Submission Failed:", response.status_code, response.text)
            else:
                print("✅ RoninEye Metrics Posted:", metrics)
            return response
        except Exception as e:
            logger.error(f"Failed to submit metrics: {str(e)}")
            print("❌ Failed to post metrics:", metrics)
            print("❌ Error:", str(e))
            return None

    @staticmethod
    def monitored_request(method, url, **kwargs):
        """Wrapper for requests that tracks all API calls."""
        if not all([RONINEYE_API_KEY, RONINEYE_ENDPOINT]):
            raise ValueError("RoninEye SDK not properly configured. Please configure with API key and endpoint.")

        start_time = time.time()
        response = None
        status_code = 0
        success = False
        exception = None

        try:
            response = requests.request(method, url, **kwargs)
            status_code = response.status_code
            success = response.ok
        except requests.RequestException as e:
            exception = e
            if hasattr(e, 'response') and e.response is not None:
                status_code = e.response.status_code

        end_time = time.time()
        response_time = round((end_time - start_time) * 1000, 2)

        metrics = {
            "url": url,
            "method": method.upper(),
            "response_time": response_time,
            "status_code": status_code,
            "is_successful": success,
        }

        try:
            RoninEyeTracker._send_metrics(metrics)
        except Exception as e:
            logger.error(f"Error in metrics submission thread: {str(e)}")
            print("❌ Failed to post metrics (from monitored_request):", metrics)
            print("❌ Error:", str(e))

        if exception:
            raise exception
        return response

    @staticmethod
    def track(view_func=None, name=None):
        def decorator(func):
            @wraps(func)
            def wrapper(*args, **kwargs):
                request = None
                for arg in args:
                    if hasattr(arg, 'method'):
                        request = arg
                        break

                method_name = request.method if request else "UNKNOWN"
                url = request.build_absolute_uri() if request else "unknown"
                endpoint_name = name or func.__name__

                start = time.time()
                exception = None
                response = None
                status_code = 200
                success = True

                try:
                    response = func(*args, **kwargs)
                    status_code = getattr(response, 'status_code', 200)
                    success = 200 <= status_code < 400
                except Exception as e:
                    exception = e
                    status_code = getattr(e, 'status_code', 500)
                    success = False

                end = time.time()
                response_time = round((end - start) * 1000, 2)

                metrics = {
                    "url": url,
                    "method": method_name.upper(),
                    "response_time": response_time,
                    "status_code": status_code,
                    "is_successful": success,
                    "endpoint": endpoint_name,
                }

                try:
                    RoninEyeTracker._send_metrics(metrics)
                except Exception as e:
                    logger.error(f"Error sending view metrics: {str(e)}")
                    print("❌ Failed to post metrics (from track decorator):", metrics)
                    print("❌ Error:", str(e))

                if exception:
                    print("✅ RoninEye Metrics Posted (on Exception):", metrics)
                    raise exception
                return response
            return wrapper

        if view_func:
            return decorator(view_func)
        return decorator


track = RoninEyeTracker.track
