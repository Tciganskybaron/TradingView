import { create } from 'zustand';

const useChart = create(set => ({
	interval: '1m',
	coin: 'SOLUSDT',
	chartType: 'candlestick',
	isAddingLine: false,
	lineSeries: [],
	setInterval: newInterval => set({ interval: newInterval }),
	setCoin: newCoin => set({ coin: newCoin }),
	setChartType: newChartType => set({ chartType: newChartType }),
	setIsAddingLine: bool => set({ isAddingLine: bool }),
	setLineSeries: line => {
		set(state => ({ lineSeries: [...state.lineSeries, line] }));
	},
}));

export default useChart;
