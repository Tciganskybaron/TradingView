import React from "react";
import { Chart } from './Component';

const initialData = [
    { time: '2024-07-22', open: 100, high: 110, low: 90, close: 105 },
    { time: '2024-07-23', open: 105, high: 115, low: 95, close: 100 },
    { time: '2024-07-24', open: 100, high: 105, low: 85, close: 90 },
    { time: '2024-07-25', open: 90, high: 100, low: 80, close: 85 },
    { time: '2024-07-26', open: 85, high: 95, low: 75, close: 80 },
    { time: '2024-07-27', open: 80, high: 90, low: 70, close: 75 },
    { time: '2024-07-28', open: 75, high: 85, low: 65, close: 70 },
    { time: '2024-07-29', open: 70, high: 80, low: 60, close: 65 },
    { time: '2024-07-30', open: 65, high: 75, low: 55, close: 60 },
];

export default function App() {
  return (
    <div>
			<Chart data={initialData} /> 
    </div>
  );
}
