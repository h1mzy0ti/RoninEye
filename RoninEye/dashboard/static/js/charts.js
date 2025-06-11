document.addEventListener("DOMContentLoaded", function () {
    // Response Time Chart
    new ApexCharts(document.querySelector("#response-time-chart"), {
        chart: { type: 'line', height: 250 },
        series: [{ name: 'Avg Response Time (ms)', data: responseTimeData }],
        xaxis: { type: 'datetime' }
    }).render();

    // Error Rate Chart
    new ApexCharts(document.querySelector("#error-rate-chart"), {
        chart: { type: 'line', height: 250 },
        series: [{ name: 'Error Rate (%)', data: errorRateData }],
        xaxis: { type: 'datetime' }
    }).render();

    // Status Code Pie Chart
    const statusData = statusCodeDist.map(item => item.count);
    const labels = statusCodeDist.map(item => `Status ${item.status_code}`);
    new ApexCharts(document.querySelector("#status-code-chart"), {
        chart: { type: 'pie', height: 250 },
        series: statusData,
        labels: labels
    }).render();

    // Uptime Monitor
    new ApexCharts(document.querySelector("#uptime-chart"), {
        chart: { type: 'line', height: 250 },
        series: [{ name: 'Uptime (%)', data: uptimeData }],
        xaxis: { type: 'datetime' }
    }).render();

    // Request Volume
    new ApexCharts(document.querySelector("#request-volume-chart"), {
        chart: { type: 'line', height: 250 },
        series: [{ name: 'Requests Per Minute', data: requestVolumeData }],
        xaxis: { type: 'datetime' }
    }).render();

    new ApexCharts(document.querySelector("#heatmap-calls-chart"), {
        chart: { type: 'heatmap', height: 250 },
        plotOptions: {
            heatmap: {
                shadeIntensity: 0.5,
                colorScale: {
                    ranges: [
                        { from: 0, to: 10, color: "#00A100", name: "Low" },
                        { from: 11, to: 50, color: "#FFB200", name: "Medium" },
                        { from: 51, to: 1000, color: "#FF0000", name: "High" }
                    ]
                }
            }
        },
        series: callsHeatmapData
    }).render();

    // Hourly Errors Heatmap
    new ApexCharts(document.querySelector("#heatmap-errors-chart"), {
        chart: { type: 'heatmap', height: 250 },
        plotOptions: {
            heatmap: {
                shadeIntensity: 0.5,
                colorScale: {
                    ranges: [
                        { from: 0, to: 2, color: "#00A100", name: "Low" },
                        { from: 3, to: 10, color: "#FFB200", name: "Medium" },
                        { from: 11, to: 1000, color: "#FF0000", name: "High" }
                    ]
                }
            }
        },
        series: errorsHeatmapData
    }).render();
});
