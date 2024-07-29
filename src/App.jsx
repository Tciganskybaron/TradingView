import React, { useState } from "react";
import { Chart, RangeSwitcher, CoinSwitch } from './Component';

export default function App() {
	const [interval, setInterval] = useState('1m');
	const [coin, setCoin] = useState('SOLUSDT');

	return (
		<div>
			<RangeSwitcher setInterval={setInterval} />
			<CoinSwitch setCoin={setCoin} />
			<Chart interval={interval} coin={coin}/> 
		</div>
	);
}

