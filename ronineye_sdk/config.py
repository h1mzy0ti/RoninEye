# ronineye_sdk/config.py

RONINEYE_API_KEY = "Your API-KEY"
RONINEYE_ENDPOINT = "http://127.0.0.1:8000/api-monitor/collect-metrics/"

def configure(api_key: str, endpoint: str):
    global RONINEYE_API_KEY, RONINEYE_ENDPOINT
    RONINEYE_API_KEY = api_key
    RONINEYE_ENDPOINT = endpoint
