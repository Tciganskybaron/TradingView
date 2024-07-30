import { createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';
import useChartData from '../../hooks/useChartData';

export function Chart(props) {
	const {
		interval,
		coin,
		chartType,
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

	const chartContainerRef = useRef();
	const data = useChartData(interval, coin, chartType);
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
		setChart(newChart);

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
			newChart.remove();
		};
	}, []);

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
	}, [chart, chartType, data]);

	return (
		<div ref={chartContainerRef} style={{ width: '100%', height: '300px' }} />
	);
}
