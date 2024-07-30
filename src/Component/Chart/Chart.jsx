import { createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';
import useChartData from '../../hooks/useChartData';

export function Chart(props) {
	const {
		interval,
		coin,
		colors: {
			backgroundColor = 'white',
			textColor = 'black',
			candleUpColor = '#4CAF50',
			candleDownColor = '#F44336',
		} = {},
	} = props;

	const chartContainerRef = useRef();
	const data = useChartData(interval, coin);
	const [chart, setChart] = useState(null);
	const [series, setSeries] = useState(null);

	useEffect(() => {
		const handleResize = () => {
			if (chart) {
				chart.applyOptions({ width: chartContainerRef.current.clientWidth });
			}
		};

		const newChart = createChart(chartContainerRef.current, {
			layout: {
				background: { type: ColorType.Solid, color: backgroundColor },
				textColor,
			},
			width: chartContainerRef.current.clientWidth,
			height: 300,
		});

		newChart.timeScale().fitContent();
		const newSeries = newChart.addCandlestickSeries({
			upColor: candleUpColor,
			downColor: candleDownColor,
			borderVisible: false,
			wickUpColor: candleUpColor,
			wickDownColor: candleDownColor,
		});

		setChart(newChart);
		setSeries(newSeries);

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
			newChart.remove();
		};
	}, []);

	useEffect(() => {
		if (series) {
			series.setData(data);
		}
	}, [data, series]);

	useEffect(() => {
		if (chart && series) {
			series.setData([]);
			chart.removeSeries(series);
			const newSeries = chart.addCandlestickSeries({
				upColor: candleUpColor,
				downColor: candleDownColor,
				borderVisible: false,
				wickUpColor: candleUpColor,
				wickDownColor: candleDownColor,
			});
			newSeries.setData(data);
			setSeries(newSeries);
			chart.timeScale().fitContent();
		}
	}, [coin, interval]);

	return (
		<div ref={chartContainerRef} style={{ width: '100%', height: '300px' }}>
			<div ref={chartContainerRef} />
		</div>
	);
}
