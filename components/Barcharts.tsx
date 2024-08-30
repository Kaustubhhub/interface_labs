import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function BasicBars() {
    return (
        <div>
            <BarChart
                xAxis={[{ scaleType: 'band', data: ['group A', 'FBA inbound Pickup Service', 'FBA inventory Storage Fee'] }]}
                series={[{ data: [4, 3, 5] }]}
                width={500}
                height={300}
            />
        </div>
    );
}
