import React, { useState } from "react";
import { Chart, RangeSwitcher } from './Component';


export default function App() {
	const [interval, setInterval] = useState('1m');
  return (
    <div>
			<RangeSwitcher setInterval={setInterval} />
			<Chart interval={interval}/> 
    </div>
  );
}
