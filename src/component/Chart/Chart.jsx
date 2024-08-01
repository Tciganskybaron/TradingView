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
    const { interval, coin, chartType, isAddingLine, setIsAddingLine, lineSeries, setLineSeries } = useChart((state) => state);

    const chartContainerRef = useRef();
    const width = useResize();
    const { data, isLoading } = useChartData(interval, coin, chartType, width);

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

            setSeries(newSeries);
        }
    }, [chart, chartType, candleUpColor, candleDownColor, lineColor, areaTopColor, areaBottomColor]);

    useEffect(() => {
        if (series && !isLoading && data.length > 0) {
            series.setData(data);
            chart.timeScale().fitContent();
        }
    }, [series, data, isLoading]);

    useEffect(() => {
        if (chart) {
            chart.applyOptions({ width: chartContainerRef.current.clientWidth, height: chartContainerRef.current.clientHeight });
            chart.timeScale().fitContent();
        }
    }, [width]);

    const addSupportResistanceLine = (event) => {
        if (chart && isAddingLine) {
            const boundingRect = chartContainerRef.current.getBoundingClientRect();
            const y = event.clientY - boundingRect.top;

            const price = series.coordinateToPrice(y);
            if (price) {
                const line = chart.addLineSeries();
                line.setData([{ time: data[0].time, value: price }, { time: data[data.length - 1].time, value: price }]);
                setLineSeries([...lineSeries, line]);
            }
            setIsAddingLine(false);
        }
    };

    useEffect(() => {
        const handleChartClick = (event) => {
            addSupportResistanceLine(event);
        };

        if (chartContainerRef.current) {
            chartContainerRef.current.addEventListener('click', handleChartClick);
        }

        return () => {
            if (chartContainerRef.current) {
                chartContainerRef.current.removeEventListener('click', handleChartClick);
            }
        };
    }, [chart, data, lineSeries, isAddingLine]);

    const handleAddLineButtonClick = () => {
        setIsAddingLine(true);
    };

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <button onClick={handleAddLineButtonClick}>Add Support/Resistance Line</button>
            <div ref={chartContainerRef} className={styles.chart} />
        </div>
    );
}
