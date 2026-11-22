import { Component } from 'react';
import { LinePath } from '@visx/shape';
import { scaleTime, scaleLinear } from '@visx/scale';
import { GridRows } from '@visx/grid';
import { AxisBottom } from '@visx/axis';
import { extent } from 'd3-array';

const DAY = 24 * 60 * 60 * 1000;
const xSelector = d => new Date(d.date);
const ySelector = d => d.value;

const readStatementTotals = () => {
  try {
    const stored = JSON.parse(localStorage.getItem('statementTotals'));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

class LineChart extends Component {
  render() {
    const { data } = this.props;
    const statementTotals = readStatementTotals();
    const headline = data ? `${data.total.statements.total} TOTAL STATEMENTS` : '';
    // calculate graph width based on window minus padding
    const width = Math.max(document.documentElement.offsetWidth - 40, 10);
    const height = 270;
    const margin = {
      top: 60,
      bottom: 30,
    };
    const yMax = height - margin.top - margin.bottom;

    // localStorage needs at least two readings to draw a line
    const xDomain = statementTotals.length > 1
      ? extent(statementTotals, xSelector)
      : [new Date(Date.now() - DAY), new Date()];

    const xScale = scaleTime({
      range: [0, width],
      domain: xDomain,
    });

    const yScale = scaleLinear({
      range: [height, 0],
      domain: [0, 100],
    });

    return (
      <svg width={width} height={height} role="img" aria-label="Statement coverage over time">
        <rect x={0} y={0} width={width} height={height} fill="#01172f" stroke="#094c9b" strokeWidth="4" />
        <GridRows
          scale={yScale}
          width={width}
          stroke="#143d6d"
          pointerEvents="none"
        />
        <LinePath
          data={statementTotals}
          x={d => xScale(xSelector(d))}
          y={d => yScale(ySelector(d))}
          strokeWidth={4}
          stroke="#60BFFF"
        />
        <rect x={0} y={0} width={width} height={height} fill="transparent" />
        <text
          dy="1.5em"
          dx=".5em"
          fontSize={14}
          fontWeight={200}
          textAnchor="left"
          style={{ pointerEvents: 'none' }}
          fill="#60BFFF"
        >
          {headline}
        </text>
        <AxisBottom
          scale={xScale}
          top={yMax + margin.top}
          stroke="#094c9b"
          tickStroke="transparent"
          tickLabelProps={() => ({
            fill: '#9A9A9A',
            fontSize: 11,
            textAnchor: 'middle',
          })}
        />
      </svg>
    );
  }
}

export default LineChart;
