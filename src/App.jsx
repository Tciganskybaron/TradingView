import React, { useState } from "react";
import { Chart, RangeSwitcher, CoinSwitch } from './Component';
import styles from './App.module.css';

export default function App() {
	const [interval, setInterval] = useState('1m');
	const [coin, setCoin] = useState('SOLUSDT');

	return (
		<div className={styles.main}>
			<div className={styles.box}>
				<div className={styles.control}>
					<RangeSwitcher setInterval={setInterval} />
					<CoinSwitch setCoin={setCoin} />
				</div>
				<Chart interval={interval} coin={coin}/> 
			</div>
		</div>
	);
}


