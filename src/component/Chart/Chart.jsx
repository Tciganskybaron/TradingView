import { createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef, useCallback } from 'react';
import Hammer from 'hammerjs';
import styles from './Chart.module.css';
import useChartData from '../../hooks/useChartData';
import useResize from '../../hooks/useResize';
import useChart from '../../store/chart';
import { LineSwitcher } from '../index';

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
    const { interval, coin, chartType, isAddingLine, setIsAddingLine, isDrawingTrendLine, setIsDrawingTrendLine, trendLinePoints, setTrendLinePoints } = useChart((state) => state);

    const chartContainerRef = useRef();
    const chartRef = useRef(null);
    const seriesRef = useRef(null);
    const linesRef = useRef([]);
    const trendLinesRef = useRef([]);

    const width = useResize();

    const { data, isLoading } = useChartData(interval, coin, chartType, width);

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

    const disableScroll = useCallback(() => {
        if (chartRef.current) {
            chartRef.current.applyOptions({
                handleScroll: false,
                handleScale: false,
            });
        }
    }, []);

    const enableScroll = useCallback(() => {
        if (chartRef.current) {
            chartRef.current.applyOptions({
                handleScroll: true,
                handleScale: true,
            });
        }
    }, []);

    const addSupportResistanceLine = useCallback((event) => {
        if (chartRef.current && isAddingLine) {
            const boundingRect = chartContainerRef.current.getBoundingClientRect();
            const y = event.center.y - boundingRect.top;

            const price = seriesRef.current.coordinateToPrice(y);
            if (price) {
                const line = chartRef.current.addLineSeries();
                line.setData([{ time: data[0].time, value: price }, { time: data[data.length - 1].time, value: price }]);
                linesRef.current.push(line);
            }
            setIsAddingLine(false);
            enableScroll();
        }
    }, [isAddingLine, setIsAddingLine, data, enableScroll]);

    const startTrendLine = useCallback((event) => {
        if (chartRef.current) {
            const boundingRect = chartContainerRef.current.getBoundingClientRect();
            const x = event.center.x - boundingRect.left;
            const y = event.center.y - boundingRect.top;

            const price = seriesRef.current.coordinateToPrice(y);
            const time = chartRef.current.timeScale().coordinateToTime(x);

            if (price !== null && time !== null) {
                setTrendLinePoints([{ time, value: price }]);
                const newTrendLine = chartRef.current.addLineSeries();
                newTrendLine.setData([{ time, value: price }]);
                trendLinesRef.current.push(newTrendLine);
                disableScroll();
            }
        }
    }, [disableScroll]);

    const finishTrendLine = useCallback((event) => {
        if (chartRef.current && trendLinePoints.length === 1) {
            const boundingRect = chartContainerRef.current.getBoundingClientRect();
            const x = event.center.x - boundingRect.left;
            const y = event.center.y - boundingRect.top;

            const price = seriesRef.current.coordinateToPrice(y);
            const time = chartRef.current.timeScale().coordinateToTime(x);

            if (price !== null && time !== null) {
                const finalTrendLinePoints = [trendLinePoints[0], { time, value: price }];
                const lastTrendLine = trendLinesRef.current[trendLinesRef.current.length - 1];
                lastTrendLine.setData(finalTrendLinePoints);
                linesRef.current.push(lastTrendLine);
                setTrendLinePoints([]);
                enableScroll();
            }
        }
    }, [trendLinePoints, enableScroll]);

    const updateTrendLine = useCallback((event) => {
        if (chartRef.current && trendLinePoints.length === 1) {
            const boundingRect = chartContainerRef.current.getBoundingClientRect();
            const x = event.center.x - boundingRect.left;
            const y = event.center.y - boundingRect.top;

            const price = seriesRef.current.coordinateToPrice(y);
            const time = chartRef.current.timeScale().coordinateToTime(x);

            if (price !== null && time !== null) {
                const updatedPoints = [trendLinePoints[0], { time, value: price }];
                const lastTrendLine = trendLinesRef.current[trendLinesRef.current.length - 1];
                lastTrendLine.setData(updatedPoints);
            }
        }
    }, [trendLinePoints]);

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

    useEffect(() => {
        const hammer = new Hammer(chartContainerRef.current);

        hammer.on('tap', (event) => {
            handleChartClick(event);
        });

        hammer.on('panmove', (event) => {
            handleMouseMove(event);
        });

        return () => {
            hammer.destroy();
        };
    }, [handleChartClick, handleMouseMove]);

    useEffect(() => {
        if (coin) {
            handleRemoveLinesButtonClick();
        }
    }, [coin]);

    const handleAddLineButtonClick = () => {
        setIsAddingLine(true);
        disableScroll();
    };

    const handleAddTrendLineButtonClick = () => {
        setIsDrawingTrendLine(true);
        disableScroll();
    };

    const handleRemoveLinesButtonClick = useCallback(() => {
        linesRef.current.forEach(line => chartRef.current.removeSeries(line));
        trendLinesRef.current.forEach(line => chartRef.current.removeSeries(line));
        linesRef.current = [];
        trendLinesRef.current = [];
        enableScroll();
    }, [enableScroll]);

    return (
        <div className={styles.container}>
            <LineSwitcher 
                handleAddLineButtonClick={handleAddLineButtonClick} 
                handleAddTrendLineButtonClick={handleAddTrendLineButtonClick}
                handleRemoveLinesButtonClick={handleRemoveLinesButtonClick} 
                selectedValue={isAddingLine ? 'addLine' : isDrawingTrendLine ? 'addTrendLine' : null}
            />
            <div ref={chartContainerRef} className={styles.chart}>
                <div className="click-area" />
            </div>
        </div>
    );
}
