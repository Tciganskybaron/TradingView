import { create } from 'zustand';

const useChart = create(set => ({
	interval: '1m',
	coin: 'SOLUSDT',
	chartType: 'candlestick',
	isAddingLine: false,
	isDrawingTrendLine: false,
	lineSeries: [],
	trendLinePoints: [],
	setInterval: newInterval => set({ interval: newInterval }),
	setCoin: newCoin => set({ coin: newCoin }),
	setChartType: newChartType => set({ chartType: newChartType }),
	setIsAddingLine: bool => set({ isAddingLine: bool }),
	setIsDrawingTrendLine: bool => set({ isDrawingTrendLine: bool }),
	setLineSeries: line => {
		set(state => ({ lineSeries: [...state.lineSeries, line] }));
	},
	setTrendLinePoints: linePoints => set({ trendLinePoints: linePoints }),
}));

export default useChart;
