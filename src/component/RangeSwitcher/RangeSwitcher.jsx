import React from 'react';
import { INTERVALS } from '../../constants/Intervals';
import { ButtonGroup } from '../index';
import useChart from "../../store/chart";

export function RangeSwitcher() {
	const interval = useChart((state) => state.interval);
	const setInterval = useChart((state) => state.setInterval);

	const handleIntervalChange = (value) => {
		setInterval(value);
	};

	return (
		<ButtonGroup
			options={INTERVALS}
			selectedValue={interval}
			onChange={handleIntervalChange}
		/>
	);
}
