// Initialize all charts when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const initialTimeRange = document.getElementById('time-range') ? 
        document.getElementById('time-range').value : '24h';
    
    initializeCharts(initialTimeRange);
});

// Function to initialize all charts
function initializeCharts(timeRange) {
    initResponseTimeChart(timeRange);
    initErrorRateChart(timeRange);
    initStatusCodeChart(timeRange);
    initUptimeChart(timeRange);
    initRequestVolumeChart(timeRange);
    initFailingEndpointsChart(timeRange);
    initSLABreachChart(timeRange);
    initErrorHeatmapChart(timeRange);
}

// Function to update all charts with new time range
function updateAllCharts(timeRange) {
    initializeCharts(timeRange);
}

// Helper function to generate time series data
function generateTimePoints(count, timeRange) {
    const now = new Date();
    const points = [];
    
    let timeStep;
    switch (timeRange) {
        case '1h':
            timeStep = 60 * 1000; // 1 minute
            break;
        case '6h':
            timeStep = 6 * 60 * 1000; // 6 minutes
            break;
        case '24h':
            timeStep = 30 * 60 * 1000; // 30 minutes
            break;
        case '7d':
            timeStep = 2 * 60 * 60 * 1000; // 2 hours
            break;
        case '30d':
            timeStep = 8 * 60 * 60 * 1000; // 8 hours
            break;
        default:
            timeStep = 30 * 60 * 1000; // default to 30 minutes
    }
    
    for (let i = count - 1; i >= 0; i--) {
        const time = new Date(now.getTime() - i * timeStep);
        points.push(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
    
    return points;
}

// 1. Response Time Chart
function initResponseTimeChart(timeRange) {
    const timePoints = generateTimePoints(24, timeRange);
    const responseTimeData = timePoints.map(time => {
        const baseResponseTime = Math.floor(Math.random() * 170 + 80);
        // Add some spikes
        const spike = Math.random() > 0.9 ? Math.floor(Math.random() * 300 + 100) : 0;
        
        return {
            x: time,
            y: baseResponseTime + spike
        };
    });
    
    // Add threshold line data
    const thresholdData = timePoints.map(time => {
        return {
            x: time,
            y: 300 // SLA threshold
        };
    });
    
    const options = {
        series: [
            {
                name: 'Response Time',
                data: responseTimeData
            },
            {
                name: 'Threshold',
                data: thresholdData,
                type: 'line'
            }
        ],
        chart: {
            height: 250,
            type: 'area',
            toolbar: {
                show: false
            },
            animations: {
                enabled: true
            },
            fontFamily: 'Inter, sans-serif'
        },
        colors: ['#4f46e5', '#ef4444'],
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: [2, 2],
            dashArray: [0, 5]
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.1,
                stops: [0, 100]
            }
        },
        xaxis: {
            categories: timePoints,
            labels: {
                style: {
                    colors: '#6b7280',
                    fontSize: '12px'
                }
            }
        },
        yaxis: {
            title: {
                text: 'Response Time (ms)',
                style: {
                    color: '#6b7280',
                    fontSize: '12px',
                    fontWeight: 500
                }
            },
            labels: {
                style: {
                    colors: '#6b7280',
                    fontSize: '12px'
                }
            }
        },
        tooltip: {
            x: {
                format: 'HH:mm'
            },
            y: {
                formatter: function(value) {
                    return `${value} ms`;
                }
            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            fontSize: '12px',
            markers: {
                width: 12,
                height: 12,
                radius: 12
            }
        },
        grid: {
            borderColor: '#e5e7eb',
            strokeDashArray: 4,
            xaxis: {
                lines: {
                    show: true
                }
            }
        }
    };
    
    const chart = new ApexCharts(document.querySelector("#response-time-chart"), options);
    chart.render();
}

// 2. Error Rate Chart
function initErrorRateChart(timeRange) {
    const timePoints = generateTimePoints(24, timeRange);
    const errorRateData = timePoints.map(time => {
        // Base error rate with some randomness
        const baseErrorRate = (Math.random() * 5) / 10;
        // Add some spikes
        const spike = Math.random() > 0.9 ? Math.random() * 8 + 2 : 0;
        
        return {
            x: time,
            y: (baseErrorRate + spike).toFixed(2)
        };
    });
    
    const options = {
        series: [{
            name: 'Error Rate',
            data: errorRateData
        }],
        chart: {
            height: 250,
            type: 'area',
            toolbar: {
                show: false
            },
            animations: {
                enabled: true
            },
            fontFamily: 'Inter, sans-serif'
        },
        colors: ['#ef4444'],
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.1,
                stops: [0, 100]
            }
        },
        xaxis: {
            categories: timePoints,
            labels: {
                style: {
                    colors: '#6b7280',
                    fontSize: '12px'
                }
            }
        },
        yaxis: {
            title: {
                text: 'Error Rate (%)',
                style: {
                    color: '#6b7280',
                    fontSize: '12px',
                    fontWeight: 500
                }
            },
            labels: {
                formatter: function(value) {
                    return value + '%';
                },
                style: {
                    colors: '#6b7280',
                    fontSize: '12px'
                }
            }
        },
        tooltip: {
            x: {
                format: 'HH:mm'
            },
            y: {
                formatter: function(value) {
                    return value + '%';
                }
            }
        },
        grid: {
            borderColor: '#e5e7eb',
            strokeDashArray: 4,
            xaxis: {
                lines: {
                    show: true
                }
            }
        }
    };
    
    const chart = new ApexCharts(document.querySelector("#error-rate-chart"), options);
    chart.render();
}

// 3. Status Code Distribution Chart
function initStatusCodeChart() {
    const options = {
        series: [
            Math.floor(Math.random() * 20 + 75), // 2xx
            Math.floor(Math.random() * 12 + 3),  // 4xx
            Math.floor(Math.random() * 7 + 1),   // 5xx
            Math.floor(Math.random() * 2)        // Other
        ],
        chart: {
            height: 250,
            type: 'donut',
            fontFamily: 'Inter, sans-serif'
        },
        labels: ['2xx Success', '4xx Client Error', '5xx Server Error', 'Other'],
        colors: ['#10b981', '#f59e0b', '#ef4444', '#6b7280'],
        legend: {
            position: 'bottom',
            fontSize: '12px',
            markers: {
                width: 12,
                height: 12,
                radius: 12
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function(val) {
                return val.toFixed(1) + '%';
            },
            style: {
                fontSize: '12px',
                fontWeight: 500
            }
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '60%',
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '14px',
                            fontWeight: 600
                        },
                        value: {
                            show: true,
                            fontSize: '16px',
                            fontWeight: 600,
                            formatter: function(val) {
                                return val + '%';
                            }
                        },
                        total: {
                            show: true,
                            label: 'Total',
                            formatter: function() {
                                return '100%';
                            }
                        }
                    }
                }
            }
        }
    };
    
    const chart = new ApexCharts(document.querySelector("#status-code-chart"), options);
    chart.render();
}

// 4. Uptime Chart (Radial)
function initUptimeChart() {
    const uptime = (100 - Math.random() * 1).toFixed(1);
    
    const options = {
        series: [parseFloat(uptime)],
        chart: {
            height: 250,
            type: 'radialBar',
            fontFamily: 'Inter, sans-serif'
        },
        plotOptions: {
            radialBar: {
                hollow: {
                    size: '70%'
                },
                dataLabels: {
                    name: {
                        show: true,
                        fontSize: '16px',
                        fontWeight: 600,
                        offsetY: -10
                    },
                    value: {
                        show: true,
                        fontSize: '24px',
                        fontWeight: 600,
                        formatter: function(val) {
                            return val.toFixed(1) + '%';
                        }
                    }
                },
                track: {
                    background: '#e5e7eb'
                }
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                type: 'horizontal',
                shadeIntensity: 0.5,
                gradientToColors: ['#3b82f6'],
                stops: [0, 100]
            }
        },
        stroke: {
            lineCap: 'round'
        },
        labels: ['Uptime'],
        colors: ['#10b981']
    };
    
    const chart = new ApexCharts(document.querySelector("#uptime-chart"), options);
    chart.render();
}

// 5. Request Volume Chart
function initRequestVolumeChart(timeRange) {
    const timePoints = generateTimePoints(24, timeRange);
    const requestData = timePoints.map(time => {
        const totalRequests = Math.floor(Math.random() * 1200 + 800);
        const errorRate = Math.random() * 0.1; // 0-10% error rate
        const errorCount = Math.floor(totalRequests * errorRate);
        
        return {
            x: time,
            successCount: totalRequests - errorCount,
            errorCount: errorCount,
            totalRequests: totalRequests
        };
    });
    
    const options = {
        series: [
            {
                name: 'Success',
                type: 'column',
                data: requestData.map(item => item.successCount)
            },
            {
                name: 'Error',
                type: 'column',
                data: requestData.map(item => item.errorCount)
            },
            {
                name: 'Total Requests',
                type: 'line',
                data: requestData.map(item => item.totalRequests)
            }
        ],
        chart: {
            height: 300,
            type: 'line',
            stacked: false,
            toolbar: {
                show: false
            },
            fontFamily: 'Inter, sans-serif'
        },
        colors: ['#10b981', '#ef4444', '#3b82f6'],
        stroke: {
            width: [0, 0, 3],
            curve: 'smooth'
        },
        plotOptions: {
            bar: {
                columnWidth: '70%'
            }
        },
        fill: {
            opacity: [1, 1, 0.2],
            gradient: {
                inverseColors: false,
                shade: 'light',
                type: "vertical",
                opacityFrom: 0.85,
                opacityTo: 0.55,
                stops: [0, 100, 100, 100]
            }
        },
        markers: {
            size: 0
        },
        xaxis: {
            categories: timePoints,
            labels: {
                style: {
                    colors: '#6b7280',
                    fontSize: '12px'
                }
            }
        },
        yaxis: [
            {
                title: {
                    text: 'Request Count',
                    style: {
                        color: '#6b7280',
                        fontSize: '12px',
                        fontWeight: 500
                    }
                },
                labels: {
                    style: {
                        colors: '#6b7280',
                        fontSize: '12px'
                    }
                }
            }
        ],
        tooltip: {
            shared: true,
            intersect: false,
            y: {
                formatter: function(value) {
                    return value.toLocaleString();
                }
            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            fontSize: '12px',
            markers: {
                width: 12,
                height: 12,
                radius: 12
            }
        },
        grid: {
            borderColor: '#e5e7eb',
            strokeDashArray: 4
        }
    };
    
    const chart = new ApexCharts(document.querySelector("#request-volume-chart"), options);
    chart.render();
}

// 6. Top Failing Endpoints Chart
function initFailingEndpointsChart() {
    const endpoints = [
        '/api/users/profile',
        '/api/products/search',
        '/api/orders/create',
        '/api/auth/login',
        '/api/payments/process',
        '/api/analytics/report',
        '/api/inventory/check'
    ];
    
    const endpointData = endpoints.map(endpoint => {
        return {
            endpoint: endpoint,
            errorRate: (Math.random() * 15 / 10) * (Math.random() > 0.7 ? Math.random() * 7 + 3 : 1)
        };
    }).sort((a, b) => b.  * 15 / 10) * (Math.random() > 0.7 ? Math.random() * 7 + 3 : 1)
        };
    }).sort((a, b) => b.errorRate - a.errorRate).slice(0, 5);
    
    const options = {
        series: [{
            data: endpointData.map(item => item.errorRate.toFixed(2))
        }],
        chart: {
            type: 'bar',
            height: 250,
            toolbar: {
                show: false
            },
            fontFamily: 'Inter, sans-serif'
        },
        plotOptions: {
            bar: {
                horizontal: true,
                barHeight: '70%',
                distributed: true,
                dataLabels: {
                    position: 'top'
                }
            }
        },
        colors: endpointData.map(item => {
            if (item.errorRate > 5) return '#ef4444';
            if (item.errorRate > 2) return '#f59e0b';
            return '#10b981';
        }),
        dataLabels: {
            enabled: true,
            formatter: function(val) {
                return val + '%';
            },
            offsetX: 30,
            style: {
                fontSize: '12px',
                fontWeight: 500
            }
        },
        xaxis: {
            categories: endpointData.map(item => item.endpoint),
            labels: {
                style: {
                    colors: '#6b7280',
                    fontSize: '12px'
                }
            },
            title: {
                text: 'Error Rate (%)',
                style: {
                    color: '#6b7280',
                    fontSize: '12px',
                    fontWeight: 500
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#6b7280',
                    fontSize: '12px'
                }
            }
        },
        tooltip: {
            y: {
                formatter: function(val) {
                    return val + '%';
                }
            }
        },
        grid: {
            borderColor: '#e5e7eb',
            strokeDashArray: 4,
            xaxis: {
                lines: {
                    show: true
                }
            }
        }
    };
    
    const chart = new ApexCharts(document.querySelector("#failing-endpoints-chart"), options);
    chart.render();
}

// 7. SLA Breach Count Chart
function initSLABreachChart(timeRange) {
    const timePoints = generateTimePoints(12, timeRange);
    const slaData = timePoints.map(time => {
        return {
            x: time,
            y: Math.floor(Math.random() * 10)
        };
    });
    
    const options = {
        series: [{
            name: 'SLA Breaches',
            data: slaData
        }],
        chart: {
            height: 250,
            type: 'bar',
            toolbar: {
                show: false
            },
            fontFamily: 'Inter, sans-serif'
        },
        colors: ['#f59e0b'],
        plotOptions: {
            bar: {
                columnWidth: '60%',
                borderRadius: 4
            }
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: timePoints,
            labels: {
                style: {
                    colors: '#6b7280',
                    fontSize: '12px'
                }
            }
        },
        yaxis: {
            title: {
                text: 'Breach Count',
                style: {
                    color: '#6b7280',
                    fontSize: '12px',
                    fontWeight: 500
                }
            },
            labels: {
                style: {
                    colors: '#6b7280',
                    fontSize: '12px'
                }
            }
        },
        tooltip: {
            y: {
                formatter: function(val) {
                    return val + ' breaches';
                }
            }
        },
        grid: {
            borderColor: '#e5e7eb',
            strokeDashArray: 4,
            xaxis: {
                lines: {
                    show: true
                }
            }
        }
    };
    
    const chart = new ApexCharts(document.querySelector("#sla-breach-chart"), options);
    chart.render();
}

// 8. Error Heatmap Chart
function initErrorHeatmapChart() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const hours = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
    
    function generateHeatmapData() {
        const data = [];
        for (let i = 0; i < days.length; i++) {
            for (let j = 0; j < hours.length; j++) {
                // Generate more errors during business hours on weekdays
                let errorFactor = 1;
                if (i < 5 && j >= 2 && j <= 4) {
                    errorFactor = 3;
                }
                
                data.push({
                    x: hours[j],
                    y: days[i],
                    value: Math.floor(Math.random() * 10 * errorFactor),
                    errorFactor: errorFactor
                });
            }
        }
        return data;
    }
    
    const options = {
        series: [{
            name: 'Errors',
            data: generateHeatmapData()
        }],
        chart: {
            height: 300,
            type: 'heatmap',
            toolbar: {
                show: false
            },
            fontFamily: 'Inter, sans-serif'
        },
        dataLabels: {
            enabled: false
        },
        colors: ["#3b82f6"],
        xaxis: {
            categories: hours,
            labels: {
                style: {
                    colors: '#6b7280',
                    fontSize: '12px'
                }
            },
            title: {
                text: 'Hour of Day',
                style: {
                    color: '#6b7280',
                    fontSize: '12px',
                    fontWeight: 500
                }
            }
        },
        yaxis: {
            categories: days,
            labels: {
                style: {
                    colors: '#6b7280',
                    fontSize: '12px'
                }
            },
            title: {
                text: 'Day of Week',
                style: {
                    color: '#6b7280',
                    fontSize: '12px',
                    fontWeight: 500
                }
            }
        },
        plotOptions: {
            heatmap: {
                shadeIntensity: 0.5,
                radius: 0,
                colorScale: {
                    ranges: [{
                        from: 0,
                        to: 3,
                        name: 'low',
                        color: '#10b981'
                    },
                    {
                        from: 4,
                        to: 7,
                        name: 'medium',
                        color: '#f59e0b'
                    },
                    {
                        from: 8,
                        to: 30,
                        name: 'high',
                        color: '#ef4444'
                    }]
                }
            }
        },
        tooltip: {
            y: {
                formatter: function(val) {
                    return val + ' errors';
                }
            }
        }
    };
    
    const chart = new ApexCharts(document.querySelector("#error-heatmap-chart"), options);
    chart.render();
}
