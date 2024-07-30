import React from 'react';
import { COINS } from '../../constants/coins';
import { ButtonGroup } from '../../component';
import useChart from "../../store/chart";

export function CoinSwitcher() {
	const { coin, setCoin } = useChart((state) => state);

	const handleCoinChange = (value) => {
		setCoin(value);
	};

	return (
		<ButtonGroup
			options={COINS}
			selectedValue={coin}
			onChange={handleCoinChange}
		/>
	);
}
