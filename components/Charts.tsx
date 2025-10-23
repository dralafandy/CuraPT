import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { styles, mainTextColor } from '../styles'; // Import mainTextColor directly

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

interface ChartProps {
    labels: string[];
    data: number[];
    title: string;
    backgroundColors?: string[];
    borderColors?: string[];
}

// Generate a default color palette if not provided
const generateDefaultColors = (count: number) => {
    const colors = [
        '#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8', '#6c757d', '#343a40', '#fd7e14', '#e83e8c', '#6f42c1'
    ];
    return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
};

export const BarChartComponent: React.FC<ChartProps> = ({ labels, data, title, backgroundColors, borderColors }) => {
    const defaultBackground = backgroundColors || generateDefaultColors(labels.length);
    const defaultBorder = borderColors || defaultBackground.map(color => color.replace('rgb', 'rgba').replace(')', ', 1)'));

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: title,
                data: data,
                backgroundColor: defaultBackground,
                borderColor: defaultBorder,
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    font: {
                        family: "'Cairo Play', sans-serif",
                    }
                }
            },
            title: {
                display: true,
                text: title,
                font: {
                    size: 16,
                    family: "'Cairo Play', sans-serif",
                },
                color: mainTextColor // Corrected: Use mainTextColor directly
            },
        },
        scales: {
            x: {
                ticks: {
                    font: {
                        family: "'Cairo Play', sans-serif",
                    },
                    color: mainTextColor, // Corrected: Use mainTextColor directly
                },
            },
            y: {
                ticks: {
                    font: {
                        family: "'Cairo Play', sans-serif",
                    },
                    color: mainTextColor, // Corrected: Use mainTextColor directly
                    callback: function(value: string | number) {
                        // For numbers, remove .00 and handle currency for financial reports
                        if (typeof value === 'number') {
                            if (title.includes('إيرادات')) { // Simple check for financial context
                                return value.toLocaleString() + ' ج.م';
                            }
                            return value % 1 === 0 ? value.toString() : value.toFixed(2);
                        }
                        return value;
                    }
                },
            },
        },
    };

    return (
        <div style={styles.reportChartContainer}>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export const PieChartComponent: React.FC<ChartProps> = ({ labels, data, title, backgroundColors, borderColors }) => {
    const defaultBackground = backgroundColors || generateDefaultColors(labels.length);
    const defaultBorder = borderColors || defaultBackground.map(color => color.replace('rgb', 'rgba').replace(')', ', 1)'));

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: title,
                data: data,
                backgroundColor: defaultBackground,
                borderColor: defaultBorder,
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    font: {
                        family: "'Cairo Play', sans-serif",
                    }
                }
            },
            title: {
                display: true,
                text: title,
                font: {
                    size: 16,
                    family: "'Cairo Play', sans-serif",
                },
                color: mainTextColor // Corrected: Use mainTextColor directly
            },
        },
    };

    return (
        <div style={styles.reportChartContainer}>
            <Pie data={chartData} options={options} />
        </div>
    );
};