
# RoninEye - API Performance Monitoring App

RoninEye is a lightweight and extensible API performance monitoring application. It allows developers and teams to track real-time metrics such as API uptime, error rates, response time, and request volumes. The application comes with a Django-based backend, powerful dashboard visualizations using ApexCharts, and an easy-to-integrate SDK for monitored services.

---
## 🖼️ Screenshots

<div align="center">
<img src="/screenshots/RE0.png" width="55%" style="margin: 10px;">
</div>

<div align="center">
  <img src="/screenshots/2.png" width="22%" style="margin: 14px;">
  <img src="/screenshots/re1.png" width="45%" style="margin: 10px;"><br>
  <img src="/screenshots/RE2.png" width="45%" style="margin: 10px;">
  <img src="/screenshots/3.png" width="45%" style="margin: 10px;">
</div>

## 🚀 Features

- 📈 Real-time monitoring of API metrics
- 🕵️ Heatmaps for hourly calls and errors
- 📊 Graphs for response time, error rate, and uptime
- 🔐 API Key-based authentication
- 📦 RoninEye SDK for easy integration with any Python-based API
- ⚙️ Modular Django architecture


---

## 🛠️ Setting Up RoninEye (Monitoring App)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/h1mzy0ti/RoninEye.git
   cd ronineye
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run migrations and start server**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser  # Optional
   python manage.py runserver
   ```

---

## 🧪 Setting Up Example API (`imf_api`)

The `imf_api` is a sample Django API project that mimics an external API you want to monitor.

1. Navigate to the `imf_api/` directory:
   ```bash
   cd example_api
   ```

2. Install dependencies and run the server:
   ```bash
   pip install -r requirements.txt
   python manage.py runserver 8001
   ```

---

## 🧩 RoninEye SDK Integration

The SDK automatically captures all GET/POST requests from your API and sends metrics to RoninEye.

### ✅ Installation

Simply add the SDK module to your monitored API or install it:
```bash
pip install path/to/ronineye_sdk.whl
```

### ⚙️ Configuration

In your `settings.py` of the monitored app and in the `config.py` of ronineye_sdk:
```python
RONINEYE_API_KEY = "your-generated-key"
RONINEYE_MONITOR_URL = "http://127.0.0.1:8001/api-monitor/collect-metrics/ or your localhost" 
```

### 💡 Usage

No need to manually add code for each API! The SDK uses a decorator to hook into view functions:
```python
from ronineye_sdk.tracker import track

@track
def your_view(request):
    ...
```

---

## 🔒 API Authentication

API endpoints are secured using API Keys:
- Generate keys via the dashboard.
- Each request from a monitored app must include a valid key in headers.

```http
GET /api-monitor/collect-metrics/ HTTP/1.1
Authorization: Api-Key YOUR_KEY
```

---

## 📬 Contributing

Contributions are welcome! Please fork the repo and submit a pull request.

---

## 📄 License

MIT License. See `LICENSE` file for details.
