import React, { useState } from 'react';
import { COINS } from '../constants/coins';
import { ButtonGroup } from './ButtonGroup';

export function CoinSwitch({ setCoin }) {
	const [selectedCoin, setSelectedCoin] = useState('SOLUSDT');

	const handleCoinChange = (value) => {
		setSelectedCoin(value);
		setCoin(value);
	};

	return (
		<ButtonGroup
			options={COINS}
			selectedValue={selectedCoin}
			onChange={handleCoinChange}
		/>
	);
}
