import React, { Component } from 'react';
import { LinePath, Line, Bar } from '@vx/shape';
import { scaleTime, scaleLinear } from '@vx/scale';
import { GridRows } from '@vx/grid';
import { AxisBottom } from '@vx/axis';
import { extent } from 'd3-array';

const sTotal = JSON.parse(localStorage.getItem('statementTotals')) || 0;
const xSelector = d => new Date(d.date);
const ySelector = d => d.value;

class LineChart extends Component {
  state = {
    position: null
  };
  render() {
    let statementTotals;
    if (this.props.data) {
      statementTotals = `${this.props.data.total.statements.total} TOTAL STATEMENTS`;
    }
    const { position } = this.state;
    // calculate graph width based on window minus padding
    const width = document.documentElement.offsetWidth-40;
    const height = 300;
    const margin = {
      top: 60,
      bottom: 30
    };
    const yMax = height - margin.top - margin.bottom;

    const xScale = scaleTime({
      range: [0, width],
      domain: extent(sTotal, xSelector),
    });

    const yScale = scaleLinear({
      range: [height, 0],
      domain: [0, 100],
    });

    return (
      <svg width={width} height={height}>
        <rect x={0} y={0} width={width} height={height} fill="#01172f" stroke="#094c9b" strokeWidth="4" />
        <GridRows
          lineStyle={{ pointerEvents: 'none' }}
          scale={yScale}
          width={width}
          stroke="#143d6d"
        />
        <LinePath
          data={position ? sTotal.slice(0, position.index) : sTotal}
          xScale={xScale}
          yScale={yScale}
          x={xSelector}
          y={ySelector}
          strokeWidth={4}
          stroke="#60BFFF"
        />
        {position && (
          <LinePath
            data={sTotal.slice(position.index)}
            xScale={xScale}
            yScale={yScale}
            x={xSelector}
            y={ySelector}
            strokeWidth={4}
            stroke="#60BFFF"
          />
        )}

        {position && (
          <Line
            from={{ x: position.x, y: 0 }}
            to={{ x: position.x, y: height }}
            strokeWidth={1}
            stroke="#60BFFF"
          />
        )}
        <Bar
          x={0}
          y={0}
          width={width}
          height={height}
          fill="transparent"
          rx={14}
          data={sTotal}
        />
        <text
          dy={"1.5em"}
          dx={".5em"}
          fontSize={14}
          fontWeight={200}
          textAnchor={"left"}
          style={{ pointerEvents: "none" }}
          fill="#60BFFF"
        >
          {statementTotals}
        </text>
        <AxisBottom
          scale={xScale}
          top={yMax + margin.top}
          stroke="#094c9b"
          tickStroke="transparent"
          tickLabelProps={(value, index) => ({
            fill: '#9A9A9A',
            fontSize: 11,
            textAnchor: 'middle'
          })}
        />
      </svg>
    );
  }
}

export default LineChart;
