import { createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';
import useChartData from '../../hooks/useChartData';

export function Chart (props) {
	const {
		interval,
		colors: {
			backgroundColor = 'white',
			textColor = 'black',
			candleUpColor = '#4CAF50',
			candleDownColor = '#F44336',
		} = {},
	} = props;

	const chartContainerRef = useRef();
	const data = useChartData(interval);
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
			width: chartContainerRef.current.clientWidth / 1.5,
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

		newSeries.setData(data);

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

	return (
		<div>
			<div ref={chartContainerRef} />
		</div>
	);
};
