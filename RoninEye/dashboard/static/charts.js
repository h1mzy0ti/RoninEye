// Coming Soon Modal & Charts Initialization
document.addEventListener("DOMContentLoaded", function () {
  // ==== Modal Logic ====
  const triggers = document.querySelectorAll(".coming-soon");
  const modalOverlay = document.getElementById("modal-overlay");
  const modalCloseBtn = document.getElementById("modal-close-btn");

  if (modalOverlay && modalCloseBtn) {
    triggers.forEach(el => {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        modalOverlay.style.display = "flex";
      });
    });

    modalCloseBtn.addEventListener("click", function () {
      modalOverlay.style.display = "none";
    });

    window.addEventListener("click", function (e) {
      if (e.target === modalOverlay) {
        modalOverlay.style.display = "none";
      }
    });
  }

  // ==== Dummy Data ====
  const defaultMetrics = window.metrics || {
  avg_response_time: 0,
  error_rate: 0,
  uptime: 0,
  requests_per_min: 0,
  };

  const formattedStatusCodeData = (window.statusCodeDist || []).map(item => ({
  label: item.status_code.toString(),
  value: item.count,
}));

const defaultCharts = {
  ...
  status_code_distribution: formattedStatusCodeData,
  ...
};

  // ==== Dummy Generators ====
  function generateDummyTimeSeries(unit) {
    const now = new Date();
    return Array.from({ length: 24 }, (_, i) => ({
      x: new Date(now.getTime() - i * 60 * 60 * 1000).toLocaleTimeString(),
      y: Math.floor(Math.random() * 100) + (unit === "%" ? 0 : 50),
    })).reverse();
  }

  function generateDummyPie() {
    return [
      { label: "200 OK", value: 75 },
      { label: "404 Not Found", value: 10 },
      { label: "500 Server Error", value: 15 },
    ];
  }

  function generateDummyBar(labels) {
    return labels.map(label => ({
      x: label,
      y: Math.floor(Math.random() * 20),
    }));
  }

  function generateDummyHeatmap() {
    const heatmap = [];
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        heatmap.push({
          day,
          hour,
          value: Math.floor(Math.random() * 10),
        });
      }
    }
    return heatmap;
  }

  // ==== Chart Renderers ====
  function renderLineChart(containerId, data, label) {
    const container = document.querySelector(`#${containerId}`);
    if (!container) return;

    const options = {
      chart: { type: "line", height: 300 },
      series: [{ name: label, data: data.map(d => d.y) }],
      xaxis: { categories: data.map(d => d.x) },
    };
    new ApexCharts(container, options).render();
  }

  function renderBarChart(containerId, data) {
    const container = document.querySelector(`#${containerId}`);
    if (!container) return;

    const options = {
      chart: { type: "bar", height: 300 },
      series: [{ data: data.map(d => d.y) }],
      xaxis: { categories: data.map(d => d.x) },
    };
    new ApexCharts(container, options).render();
  }

  function renderPieChart(containerId, data) {
    const container = document.querySelector(`#${containerId}`);
    if (!container) return;

    const options = {
      chart: { type: "donut", height: 300 },
      series: data.map(d => d.value),
      labels: data.map(d => d.label),
    };
    new ApexCharts(container, options).render();
  }

  function renderHeatmap(containerId, data) {
    const container = document.querySelector(`#${containerId}`);
    if (!container) return;

    const series = Array.from({ length: 7 }, (_, day) => ({
      name: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day],
      data: data
        .filter(d => d.day === day)
        .map(d => ({ x: `${d.hour}:00`, y: d.value })),
    }));

    const options = {
      chart: { type: "heatmap", height: 350 },
      series,
      dataLabels: { enabled: false },
      colors: ["#008FFB"],
    };
    new ApexCharts(container, options).render();
  }

  // ==== Render Charts Conditionally ====
  if (typeof ApexCharts !== "undefined") {
    renderLineChart("response-time-chart", defaultCharts.response_time, "Response Time");
    renderLineChart("error-rate-chart", defaultCharts.error_rate, "Error Rate");
    renderPieChart("status-code-chart", defaultCharts.status_code_distribution);
    renderLineChart("uptime-chart", defaultCharts.uptime, "Uptime");
    renderLineChart("request-volume-chart", defaultCharts.request_volume, "Requests");
    renderBarChart("failing-endpoints-chart", defaultCharts.failing_endpoints);
    renderBarChart("sla-breach-chart", defaultCharts.sla_breach);
    renderHeatmap("heatmap-errors-chart", defaultCharts.heatmap_errors);
  } else {
    console.warn("ApexCharts is not loaded.");
  }

  // ==== Set Default Metrics ====
  const metricsMap = {
  "avg-response-time": `${defaultMetrics.avg_response_time} ms`,
  "error-rate": `${defaultMetrics.error_rate} %`,
  "uptime": `${defaultMetrics.uptime} %`,
  "requests-per-min": `${defaultMetrics.requests_per_min}`,
};

for (const [id, value] of Object.entries(metricsMap)) {
  const el = document.getElementById(id);
  if (el) el.innerText = value;
}

