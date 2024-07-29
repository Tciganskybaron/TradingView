import { createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';

export function Chart (props) {
    const {
        data,
        colors: {
            backgroundColor = 'white',
            textColor = 'black',
            candleUpColor = '#4CAF50',
            candleDownColor = '#F44336',
        } = {},
    } = props;

    const chartContainerRef = useRef();

    useEffect(
        () => {
            const handleResize = () => {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            };

            const chart = createChart(chartContainerRef.current, {
                layout: {
                    background: { type: ColorType.Solid, color: backgroundColor },
                    textColor,
                },
                width: chartContainerRef.current.clientWidth,
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
        },
        [data, backgroundColor, textColor, candleUpColor, candleDownColor]
    );

    return (
        <div
            ref={chartContainerRef}
        />
    );
};
