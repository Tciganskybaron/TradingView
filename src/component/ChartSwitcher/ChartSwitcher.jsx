import React from 'react';
import { CHART } from '../../constants/charts';
import { ButtonGroup } from '../../component';
import useChart from "../../store/chart";

export function ChartSwitcher() {
	const chartType = useChart((state) => state.chartType);
	const setChartType = useChart((state) => state.setChartType);

	const handleChartTypeChange = (value) => {
		setChartType(value);
	};

  return (
		<ButtonGroup
			options={CHART}
			selectedValue={chartType}
			onChange={handleChartTypeChange}
		/>
	);
}
