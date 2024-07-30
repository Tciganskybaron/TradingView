import React, { useState } from 'react';
import styles from './RangeSwitcher.module.css';
import cn from 'classnames';

const INTERVALS = [
	{ label: '1M', value: '1m' },
	{ label: '5M', value: '5m' },
	{ label: '15M', value: '15m' },
	{ label: '1H', value: '1h' },
	{ label: '1D', value: '1d' },
];

export function RangeSwitcher(props) {
	const { setInterval } = props;
	const [selectedInterval, setSelectedInterval] = useState('1m');

	const handleIntervalChange = (value) => {
		setSelectedInterval(value);
		setInterval(value);
	};

	return (
		<div className={styles.buttonGroup}>
			{INTERVALS.map(intervalOption => (
				<button
					key={intervalOption.value}
					className={cn(styles.button, {
						[styles.active]: selectedInterval === intervalOption.value,

					})}
					onClick={() => handleIntervalChange(intervalOption.value)}
				>
					{intervalOption.label}
				</button>
			))}
		</div>
	);
}
