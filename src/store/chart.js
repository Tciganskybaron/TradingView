import { create } from 'zustand';

const useChart = create(set => ({
	interval: '1m',
	coin: 'SOLUSDT',
	chartType: 'candlestick',
	setInterval: newInterval => set({ interval: newInterval }),
	setCoin: newCoin => set({ coin: newCoin }),
	setChartType: newChartType => set({ chartType: newChartType }),
}));

export default useChart;
