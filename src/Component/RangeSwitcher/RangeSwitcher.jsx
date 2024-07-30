import React from 'react';
import { INTERVALS } from '../../constants/Intervals';
import { ButtonGroup } from '../index';
import useChart from "../../store/chart";

export function RangeSwitcher() {
	const { interval,setInterval } = useChart((state) => state);

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
