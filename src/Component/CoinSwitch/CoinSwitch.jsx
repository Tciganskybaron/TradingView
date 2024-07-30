import React, { useState } from 'react';
import styles from './CoinSwitch.module.css';
import cn from 'classnames';

const COINS = [
	{ label: 'Solana', value: 'SOLUSDT' },
	{ label: 'Ethereum', value: 'ETHUSDT' },
	{ label: 'Bitcoin', value: 'BTCUSDT' },
];

export function CoinSwitch(props) {
	const { setCoin } = props;
	const [selectedCoin, setSelectedCoin] = useState('SOLUSDT');

	const handleCoinChange = (value) => {
		setSelectedCoin(value);
		setCoin(value);
	};

	return (
		<div className={styles.buttonGroup}>
			{COINS.map(coinOption => (
				<button
					key={coinOption.value}
					className={cn(styles.button, {
						[styles.active]: selectedCoin === coinOption.value,
					})}
					onClick={() => handleCoinChange(coinOption.value)}
				>
					{coinOption.label}
				</button>
			))}
		</div>
	);
}
