import { createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef, useState, useCallback } from 'react';
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
    const { interval, coin, chartType, isAddingLine, setIsAddingLine } = useChart((state) => state);

    const chartContainerRef = useRef();
    const width = useResize();
    const { data, isLoading } = useChartData(interval, coin, chartType, width);

    const chartRef = useRef(null);
    const seriesRef = useRef(null);
    const linesRef = useRef([]);
    const [isDrawingTrendLine, setIsDrawingTrendLine] = useState(false);
    const [trendLinePoints, setTrendLinePoints] = useState([]);
    const trendLineSeriesRef = useRef(null);

    useEffect(() => {
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
        chartRef.current = newChart;

        const handleResize = () => {
            if (chartRef.current) {
                chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth, height: chartContainerRef.current.clientHeight });
                chartRef.current.timeScale().fitContent();
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            newChart.remove();
        };
    }, [backgroundColor, textColor]);

    useEffect(() => {
        if (chartRef.current) {
            if (seriesRef.current) {
                chartRef.current.removeSeries(seriesRef.current);
            }

            const newSeries = chartType === 'candlestick'
                ? chartRef.current.addCandlestickSeries({
                    upColor: candleUpColor,
                    downColor: candleDownColor,
                    borderVisible: false,
                    wickUpColor: candleUpColor,
                    wickDownColor: candleDownColor,
                })
                : chartRef.current.addAreaSeries({ lineColor, topColor: areaTopColor, bottomColor: areaBottomColor });

            seriesRef.current = newSeries;
        }
    }, [chartType, candleUpColor, candleDownColor, lineColor, areaTopColor, areaBottomColor]);

    useEffect(() => {
        if (seriesRef.current && !isLoading && data.length > 0) {
            seriesRef.current.setData(data);
            chartRef.current.timeScale().fitContent();
        }
    }, [data, isLoading]);

    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth, height: chartContainerRef.current.clientHeight });
            chartRef.current.timeScale().fitContent();
        }
    }, [width]);

    const addSupportResistanceLine = useCallback((event) => {
        if (chartRef.current && isAddingLine) {
            const boundingRect = chartContainerRef.current.getBoundingClientRect();
            const y = event.clientY - boundingRect.top;

            const price = seriesRef.current.coordinateToPrice(y);
            if (price) {
                const line = chartRef.current.addLineSeries();
                line.setData([{ time: data[0].time, value: price }, { time: data[data.length - 1].time, value: price }]);
                linesRef.current.push(line);
            }
            setIsAddingLine(false);
        }
    }, [isAddingLine, setIsAddingLine, data]);

    const startTrendLine = useCallback((event) => {
        if (chartRef.current) {
            const boundingRect = chartContainerRef.current.getBoundingClientRect();
            const x = event.clientX - boundingRect.left;
            const y = event.clientY - boundingRect.top;

            const price = seriesRef.current.coordinateToPrice(y);
            const time = chartRef.current.timeScale().coordinateToTime(x);

            if (price !== null && time !== null) {
                setTrendLinePoints([{ time, value: price }]);
                trendLineSeriesRef.current = chartRef.current.addLineSeries();
            }
        }
    }, []);

    const finishTrendLine = useCallback((event) => {
        if (chartRef.current && trendLinePoints.length === 1) {
            const boundingRect = chartContainerRef.current.getBoundingClientRect();
            const x = event.clientX - boundingRect.left;
            const y = event.clientY - boundingRect.top;

            const price = seriesRef.current.coordinateToPrice(y);
            const time = chartRef.current.timeScale().coordinateToTime(x);

            if (price !== null && time !== null) {
                const finalTrendLinePoints = [trendLinePoints[0], { time, value: price }];
                trendLineSeriesRef.current.setData(finalTrendLinePoints);
                linesRef.current.push(trendLineSeriesRef.current);
                setIsDrawingTrendLine(false);
                setTrendLinePoints([]);
            }
        }
    }, [trendLinePoints]);

    const updateTrendLine = useCallback((event) => {
        if (chartRef.current && trendLinePoints.length === 1) {
            const boundingRect = chartContainerRef.current.getBoundingClientRect();
            const x = event.clientX - boundingRect.left;
            const y = event.clientY - boundingRect.top;

            const price = seriesRef.current.coordinateToPrice(y);
            const time = chartRef.current.timeScale().coordinateToTime(x);

            if (price !== null && time !== null) {
                const updatedPoints = [trendLinePoints[0], { time, value: price }];
                trendLineSeriesRef.current.setData(updatedPoints);
            }
        }
    }, [trendLinePoints]);

    useEffect(() => {
        const handleChartClick = (event) => {
            if (isAddingLine) {
                addSupportResistanceLine(event);
            } else if (isDrawingTrendLine) {
                if (trendLinePoints.length === 0) {
                    startTrendLine(event);
                } else if (trendLinePoints.length === 1) {
                    finishTrendLine(event);
                }
            }
        };

        const handleMouseMove = (event) => {
            if (isDrawingTrendLine && trendLinePoints.length === 1) {
                updateTrendLine(event);
            }
        };

        if (chartContainerRef.current) {
            chartContainerRef.current.addEventListener('click', handleChartClick);
            chartContainerRef.current.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            if (chartContainerRef.current) {
                chartContainerRef.current.removeEventListener('click', handleChartClick);
                chartContainerRef.current.removeEventListener('mousemove', handleMouseMove);
            }
        };
    }, [addSupportResistanceLine, startTrendLine, finishTrendLine, updateTrendLine, isAddingLine, isDrawingTrendLine, trendLinePoints]);

    useEffect(() => {
        if (coin) {
            handleRemoveLinesButtonClick();
        }
    }, [coin]);

    const handleAddLineButtonClick = () => {
        setIsAddingLine(true);
    };

    const handleAddTrendLineButtonClick = () => {
        setIsDrawingTrendLine(true);
    };

    const handleRemoveLinesButtonClick = useCallback(() => {
        linesRef.current.forEach(line => chartRef.current.removeSeries(line));
        linesRef.current = [];
    }, []);

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <div>
                <button onClick={handleAddLineButtonClick}>Add Support/Resistance Line</button>
                <button onClick={handleAddTrendLineButtonClick}>Add Trend Line</button>
                <button onClick={handleRemoveLinesButtonClick}>Remove All Lines</button>
            </div>
            <div ref={chartContainerRef} className={styles.chart} />
        </div>
    );
}
