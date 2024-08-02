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
    const {
        interval,
        chartType,
        isAddingLine,
        setIsAddingLine,
        isDrawingTrendLine,
        setIsDrawingTrendLine,
        trendLinePoints,
        setTrendLinePoints,
        addLineSeries,
        clearLineSeries,
    } = useChart(state => state);

	  const coin = useChart(state => state.coin)
		const lineSeries = useChart(state => state.lineSeries)

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
            },
            watermark: {
                color: 'rgba(0, 0, 0, 0.1)',
                visible: true,
                text: 'Deluge.Cash',
                fontSize: 24,
                horzAlign: 'center',
                vertAlign: 'center',
            },
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
                const lineData = [{ time: data[0].time, value: price }, { time: data[data.length - 1].time, value: price }];
                line.setData(lineData);
                linesRef.current.push(line);
                addLineSeries(coin, { type: 'supportResistance', data: lineData });
            }
            setIsAddingLine(false);
            enableScroll();
        }
    }, [isAddingLine, setIsAddingLine, data, enableScroll, coin, addLineSeries]);

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
                addLineSeries(coin, { type: 'trendLine', data: finalTrendLinePoints });
                setTrendLinePoints([]);
                enableScroll();
                setIsDrawingTrendLine(false);
            }
        }
    }, [trendLinePoints, enableScroll, addLineSeries, coin]);

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
            removeLines();
            if (lineSeries[coin]) {
                lineSeries[coin].forEach(line => {
                    const newLine = chartRef.current.addLineSeries();
                    newLine.setData(line.data);
                    linesRef.current.push(newLine);
                });
            }
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

const removeLines = useCallback(() => {
    if (chartRef.current && linesRef.current) {
        linesRef.current.forEach(line => {
            if (line) {
                chartRef.current.removeSeries(line);
            }
        });
        linesRef.current = [];
    }
    if (chartRef.current && trendLinesRef.current) {
        trendLinesRef.current = [];
    }
}, [ chartRef, trendLinesRef]);

const handleRemoveLinesButtonClick = useCallback(() => {
    removeLines();
    enableScroll();
    clearLineSeries(coin);
}, [enableScroll, removeLines, clearLineSeries, coin]);



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
