import React, { useState } from 'react';
import { CHART } from '../../constants/charts';
import { ButtonGroup } from '../../component';

export function ChartSwitcher({ setChartType }) {
	const [selectedChartType, setSelectedChartType] = useState('candlestick');

	const handleChartTypeChange = (value) => {
		setSelectedChartType(value);
		setChartType(value);
	};

return (
		<ButtonGroup
			options={CHART}
			selectedValue={selectedChartType}
			onChange={handleChartTypeChange}
		/>
	);
}
