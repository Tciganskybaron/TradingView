import React, { useState } from 'react';
import { INTERVALS } from '../../constants/Intervals';
import { ButtonGroup } from '../index';

export function RangeSwitcher({ setInterval }) {
	const [selectedInterval, setSelectedInterval] = useState('1m');

	const handleIntervalChange = (value) => {
		setSelectedInterval(value);
		setInterval(value);
	};

	return (
		<ButtonGroup
			options={INTERVALS}
			selectedValue={selectedInterval}
			onChange={handleIntervalChange}
		/>
	);
}
