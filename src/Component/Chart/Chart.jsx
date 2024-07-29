import { createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';
import useChartData from "../../hooks/useChartData"

export function Chart (props) {
    const {
        colors: {
            backgroundColor = 'white',
            textColor = 'black',
            candleUpColor = '#4CAF50',
            candleDownColor = '#F44336',
        } = {},
    } = props;

    const chartContainerRef = useRef();

		const data = useChartData();


    useEffect(() => {
        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        };

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: backgroundColor },
                textColor,
            },
            width: chartContainerRef.current.clientWidth / 2,
            height: 300,
        });
        chart.timeScale().fitContent();

        const newSeries = chart.addCandlestickSeries({
            upColor: candleUpColor,
            downColor: candleDownColor,
            borderVisible: false,
            wickUpColor: candleUpColor,
            wickDownColor: candleDownColor,
        });
        newSeries.setData(data);

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [data, backgroundColor, textColor, candleUpColor, candleDownColor]);

    return (
        <div ref={chartContainerRef} />
    );
};
