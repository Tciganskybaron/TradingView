import { createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

export function Chart (props) {
    const {
        colors: {
            backgroundColor = 'white',
            textColor = 'black',
            candleUpColor = '#4CAF50',
            candleDownColor = '#F44336',
        } = {},
    } = props;

    const chartContainerRef = useRef();
    const [data, setData] = useState([]);

    useEffect(() => {
        // Функция для получения исторических данных
        const fetchHistoricalData = async () => {
            const response = await axios.get('https://api.binance.com/api/v3/klines', {
                params: {
                    symbol: 'SOLUSDT',
                    interval: '1m',  // Интервал 1 минута
                    limit: 150  // Получаем последние 20 свечек
                }
            });

            const historicalData = response.data.map(candle => ({
                time: candle[0] / 1000, // Преобразование времени в секунды
                open: parseFloat(candle[1]),
                high: parseFloat(candle[2]),
                low: parseFloat(candle[3]),
                close: parseFloat(candle[4]),
            }));

            setData(historicalData);
        };

        fetchHistoricalData();
    }, []);

    useEffect(() => {
        const client = new W3CWebSocket('wss://stream.binance.com:9443/ws/solusdt@kline_1m');

        client.onmessage = (message) => {
            const json = JSON.parse(message.data);
            const candlestick = json.k;

            setData(prevData => {
                const newCandle = {
                    time: candlestick.t / 1000,
                    open: parseFloat(candlestick.o),
                    high: parseFloat(candlestick.h),
                    low: parseFloat(candlestick.l),
                    close: parseFloat(candlestick.c),
                };

                if (prevData.length > 0 && prevData[prevData.length - 1].time === newCandle.time) {
                    return [...prevData.slice(0, -1), newCandle];
                } else {
                    return [...prevData, newCandle];
                }
            });
        };

        return () => client.close();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        };

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: backgroundColor },
                textColor,
            },
            width: chartContainerRef.current.clientWidth / 2,
            height: 300,
        });
        chart.timeScale().fitContent();

        const newSeries = chart.addCandlestickSeries({
            upColor: candleUpColor,
            downColor: candleDownColor,
            borderVisible: false,
            wickUpColor: candleUpColor,
            wickDownColor: candleDownColor,
        });
        newSeries.setData(data);

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [data, backgroundColor, textColor, candleUpColor, candleDownColor]);

    return (
        <div ref={chartContainerRef} />
    );
};
