import { useEffect, useState } from 'react';
import axios from 'axios';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { LIMIT } from '../constants/limit';

const useChartData = (interval, coin, chartType, width) => {
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchHistoricalData = async () => {
			setIsLoading(true);
			const response = await axios.get('https://api.binance.com/api/v3/klines', {
				params: {
					symbol: coin,
					interval,
					limit: width > '1000' ? LIMIT.desktop : LIMIT.mobile,
				},
			});

			let historicalData;
			if (chartType === 'candlestick') {
				historicalData = response.data.map(candle => ({
					time: candle[0] / 1000,
					open: parseFloat(candle[1]),
					high: parseFloat(candle[2]),
					low: parseFloat(candle[3]),
					close: parseFloat(candle[4]),
				}));
			} else if (chartType === 'line') {
				historicalData = response.data.map(candle => ({
					time: candle[0] / 1000,
					value: parseFloat(candle[4]),
				}));
			}

			setData(historicalData);
			setIsLoading(false);
		};

		fetchHistoricalData();
	}, [interval, coin, chartType, width]);

	useEffect(() => {
		const client = new W3CWebSocket(`wss://stream.binance.com:9443/ws/${coin.toLowerCase()}@kline_${interval}`);

		client.onmessage = message => {
			const json = JSON.parse(message.data);
			const candlestick = json.k;

			setData(prevData => {
				let newCandle;
				if (chartType === 'candlestick') {
					newCandle = {
						time: candlestick.t / 1000,
						open: parseFloat(candlestick.o),
						high: parseFloat(candlestick.h),
						low: parseFloat(candlestick.l),
						close: parseFloat(candlestick.c),
					};
				} else if (chartType === 'line') {
					newCandle = {
						time: candlestick.t / 1000,
						value: parseFloat(candlestick.c),
					};
				}

				if (prevData.length > 0 && prevData[prevData.length - 1].time === newCandle.time) {
					return [...prevData.slice(0, -1), newCandle];
				} else {
					return [...prevData, newCandle];
				}
			});
		};

		return () => client.close();
	}, [interval, coin, chartType]);

	return { data, isLoading };
};

export default useChartData;
