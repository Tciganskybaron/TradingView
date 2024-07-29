import React from 'react';

const COINS = [
	{ label: 'Solana', value: 'SOLUSDT' },
	{ label: 'Ethereum', value: 'ETHUSDT' },
	{ label: 'Bitcoin', value: 'BTCUSDT' },
];

export function CoinSwitch(props) {
	const { setCoin } = props;
	return (
		<div>
			{COINS.map(coinOption => (
				<button key={coinOption.value} onClick={() => setCoin(coinOption.value)}>
					{coinOption.label}
				</button>
			))}
		</div>
	);
}
