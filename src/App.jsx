import React from "react";
import { Chart, RangeSwitcher, CoinSwitcher, ChartSwitcher } from './component';
import styles from './App.module.css';

export default function App() {
	return (
		<div className={styles.main}>
			<div className={styles.box}>
				<div className={styles.control}>
					<ChartSwitcher />
					<RangeSwitcher />
					<CoinSwitcher />
				</div>
				<Chart />
			</div>
		</div>
	);
}




