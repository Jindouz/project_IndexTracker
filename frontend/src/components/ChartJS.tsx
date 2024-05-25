import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useAppSelector } from '../app/hooks';
import { selectChartData, selectChartDataWeekly } from '../features/intraday/IntradayViewerSlice';

const MyChart: React.FC<{ activeTab: 'daily' | 'weekly' }> = ({ activeTab }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);

    const weeklyChartData = useAppSelector(selectChartDataWeekly);
    const dailyChartData = useAppSelector(selectChartData);


    useEffect(() => {
      const selectedChartData = activeTab === 'weekly' ? weeklyChartData : dailyChartData;
      if (!weeklyChartData) return; 
      
      const ctx = chartRef.current?.getContext('2d');
      if (!ctx) return;

      const minValue = Math.min(...weeklyChartData.datasets[0].data);

      const chart = new Chart(ctx, {
          type: 'line',
          data: {
              labels: weeklyChartData.labels,
              datasets: [
                  {
                      label: selectedChartData.datasets[0].label,
                      data: selectedChartData.datasets[0].data,
                      backgroundColor: 'rgba(33, 181, 207, 0.1)',
                      borderColor: '#21b5cf',
                      fill: true,
                  },
              ],
          },
          options: {
              scales: {
                  x: {
                      type: 'category',
                      ticks: {
                          autoSkip: true,
                          maxTicksLimit: 10,
                          maxRotation: 0,
                          color: 'grey',
                      },
                      grid: {
                          color: 'rgba(33, 181, 207, 0.1)',
                      },
                      title: {
                          color: 'white',
                      },
                  },
                  y: {
                      beginAtZero: false,
                      min: minValue - 1,
                      position: 'right',
                      ticks: {
                          color: 'white',
                      },
                      grid: {
                          color: 'rgba(33, 181, 207, 0.1)',
                      },
                      title: {
                          color: 'white',
                      },
                  },
              },
              plugins: {
                  tooltip: {
                      intersect: false,
                      callbacks: {
                          label: (context: any) => {
                              const label = context.dataset.label || '';
                              if (context.parsed.y !== null) {
                                  return `${label}: $${context.parsed.y.toFixed(2)}`;
                              }
                              return '';
                          },
                      },
                  },
              },
              responsive: true,
              elements: {
                  line: {
                      tension: 0.4,
                  },
                  point: {
                      radius: 0,
                      hoverRadius: 14,
                  },
              },
          },
      });

      return () => {
          chart.destroy();
      };
    }, [weeklyChartData, dailyChartData]);

  return <canvas ref={chartRef} />;
};

const ChartComponent: React.FC<{ activeTab: 'daily' | 'weekly' }> = ({ activeTab }) => {
    return (
        <div>
            <MyChart activeTab={activeTab} />
        </div>
    );
};


export default ChartComponent;
