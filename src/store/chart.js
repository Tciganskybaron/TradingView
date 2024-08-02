import { create } from 'zustand';

const useChart = create(set => ({
    interval: '1m',
    coin: 'SOLUSDT',
    chartType: 'candlestick',
    isAddingLine: false,
    isDrawingTrendLine: false,
    trendLinePoints: [],
    lineSeries: {},
    setInterval: newInterval => set({ interval: newInterval }),
    setCoin: newCoin => set({ coin: newCoin }),
    setChartType: newChartType => set({ chartType: newChartType }),
    setIsAddingLine: bool => set({ isAddingLine: bool }),
    setIsDrawingTrendLine: bool => set({ isDrawingTrendLine: bool }),
    setTrendLinePoints: linePoints => set({ trendLinePoints: linePoints }),
    addLineSeries: (coin, line) => set(state => ({
        lineSeries: {
            ...state.lineSeries,
            [coin]: [...(state.lineSeries[coin] || []), line],
        },
    })),
    clearLineSeries: coin => set(state => ({
        lineSeries: {
            ...state.lineSeries,
            [coin]: [],
        },
    })),
}));

export default useChart;
