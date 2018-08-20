import React, { Component } from 'react';
import { Pie } from '@vx/shape';
import { Group } from '@vx/group';

class DonutChart extends Component {
  render() {
    const selectName = this.props.selectName;
    const dataStatementTotal = require('../data/coverage-summary.json').total[selectName];
    const remainder = 100 - dataStatementTotal.pct;
    const pctData = [{pct: dataStatementTotal.pct, rem: remainder}];
    const data = Object.keys(pctData[0])
      .map(k => ({usage: pctData[0][k] }));
    const width = parseInt((document.documentElement.offsetWidth/4-10).toFixed(0), 10);
    const height = (width/1.4).toFixed(0);
    if (width < 10) return null;
    const fills = ['#55CA01', '#F0FFE4'];
    const radius = Math.min(width, height)/2;
    return (
      <svg width={width} height={height}>
        <Group top={height/2.5} left={width/2}>
          <Pie
            data={data}
            pieValue={d => d.usage}
            outerRadius={radius - (radius/3)}
            innerRadius={radius - (radius/2)}
            fill={d => fills[d.index]}
            padAngle={0}
            pieSort={(a, b) => a.index - b.index}
          />
          <text
            dy={".33em"}
            fontSize={52}
            fontWeight={800}
            textAnchor={"middle"}
            style={{ pointerEvents: "none" }}
            fill="#fff"
          >
            {dataStatementTotal.pct.toFixed(0)}
          </text>
          <text
            dy={width/2.8}
            fontSize={24}
            fontWeight={200}
            textAnchor={"middle"}
            style={{ pointerEvents: "none" }}
            fill={"#80CCFF"}
          >
            {selectName.toUpperCase()}
          </text>
        </Group>
      </svg>
    );
  }
}

export default DonutChart;
