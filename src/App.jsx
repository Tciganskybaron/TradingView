import React, { useState } from "react";
import { Chart, RangeSwitcher, CoinSwitcher, ChartSwitcher } from './component';
import styles from './App.module.css';

export default function App() {
	const [interval, setInterval] = useState('1m');
	const [coin, setCoin] = useState('SOLUSDT');
	const [chartType, setChartType] = useState('candlestick');

	return (
		<div className={styles.main}>
			<div className={styles.box}>
				<div className={styles.control}>
					<ChartSwitcher setChartType={setChartType} />
					<RangeSwitcher setInterval={setInterval} />
					<CoinSwitcher setCoin={setCoin} />
				</div>
				<Chart interval={interval} coin={coin} chartType={chartType} />
			</div>
		</div>
	);
}



