import React, { useState } from 'react';
import { COINS } from '../../constants/coins';
import { ButtonGroup } from '../../component';

export function CoinSwitcher({ setCoin }) {
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
