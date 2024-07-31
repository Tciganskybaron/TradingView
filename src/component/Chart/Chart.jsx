import { createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';
import styles from './Chart.module.css';
import useChartData from '../../hooks/useChartData';
import useResize from '../../hooks/useResize';
import useChart from '../../store/chart';

export function Chart(props) {
    const {
        colors: {
            backgroundColor = 'white',
            textColor = 'black',
            candleUpColor = '#4CAF50',
            lineColor = '#2962FF',
            candleDownColor = '#F44336',
            areaTopColor = '#2962FF',
            areaBottomColor = 'rgba(41, 98, 255, 0.28)',
        } = {},
    } = props;
    const { interval, coin, chartType } = useChart((state) => state);

    const chartContainerRef = useRef();
    const width = useResize();
    const data = useChartData(interval, coin, chartType, width);

    const [chart, setChart] = useState(null);
    const [series, setSeries] = useState(null);

    useEffect(() => {
        const handleResize = () => {
            if (chart) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth, height: chartContainerRef.current.clientHeight });
                chart.timeScale().fitContent();
            }
        };

        const newChart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: backgroundColor },
                textColor,
            },
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            localization: {
                locale: 'en-US',
            }
        });

        newChart.timeScale().fitContent();
        setChart(newChart);

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            newChart.remove();
        };
    }, [backgroundColor, textColor]);

    useEffect(() => {
        if (chart) {
            if (series) {
                chart.removeSeries(series);
            }

            const newSeries = chartType === 'candlestick'
                ? chart.addCandlestickSeries({
                    upColor: candleUpColor,
                    downColor: candleDownColor,
                    borderVisible: false,
                    wickUpColor: candleUpColor,
                    wickDownColor: candleDownColor,
                })
                : chart.addAreaSeries({ lineColor, topColor: areaTopColor, bottomColor: areaBottomColor });

            newSeries.setData(data);
            setSeries(newSeries);
            chart.timeScale().fitContent();
        }
    }, [chart, chartType, data, candleUpColor, candleDownColor, lineColor, areaTopColor, areaBottomColor]);

    useEffect(() => {
        if (chart) {
            chart.applyOptions({ width: chartContainerRef.current.clientWidth, height: chartContainerRef.current.clientHeight });
            chart.timeScale().fitContent();
        }
    }, [width]);

    return (
        <div ref={chartContainerRef} className={styles.chart} />
    );
}
