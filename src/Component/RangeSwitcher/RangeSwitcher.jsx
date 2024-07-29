import React, { useState } from 'react';

const INTERVALS = [
	{ label: '1 Minute', value: '1m' },
	{ label: '5 Minutes', value: '5m' },
	{ label: '15 Minutes', value: '15m' },
	{ label: '1 Hour', value: '1h' },
	{ label: '1 Day', value: '1d' },
];

export function RangeSwitcher(props) {
	const{ setInterval } = props;
	return (
		<div>
			{INTERVALS.map(intervalOption => (
				<button key={intervalOption.value} onClick={() => setInterval(intervalOption.value)}>
					{intervalOption.label}
				</button>
			))}
		</div>
	);
}
