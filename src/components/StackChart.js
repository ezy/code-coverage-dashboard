import React, { Component } from 'react';
import { BarStackHorizontal } from '@vx/shape';
import { Group } from '@vx/group';
import { scaleBand, scaleLinear, scaleOrdinal } from '@vx/scale';

class StackChart extends Component {
  render() {
    const { fileSet } = this.props;
    // If props exist for data reurn them, otherwise return defaults
    const totalData = () => {
      if (this.props.data) { // eslint-disable-line react/destructuring-assignment
        return this.props.data; // eslint-disable-line react/destructuring-assignment
      }
      const dataObj = {};
      dataObj[fileSet] = {
        statements: {
          total: 1, covered: 0, skipped: 0, pct: 0,
        },
      };
      return dataObj;
    };
    const dataTotals = totalData();
    // Filter the target file groups and return 'statements' for our metric
    const dataSet = Object.keys(dataTotals)
      .filter(d => d.includes(fileSet))
      .map(d => dataTotals[d].statements);
    // Sum the statement values for one or many items
    const sumValues = (obj, key) => Object.values(obj).reduce((a, b) => {
      if (!b) {
        return a[key];
      }
      return typeof a === 'object' ? a[key] + b[key] : a + b[key];
    });
    const sTotal = dataSet.length >= 2 ? sumValues(dataSet, 'total') : dataSet[0].total;
    const sCovered = dataSet.length >= 2 ? sumValues(dataSet, 'covered') : dataSet[0].covered;
    // Work out precentage from totaled values
    const sPct = sCovered / sTotal * 100;
    // Set the data
    const data = [{
      pct: sPct,
      diff: 100 - sPct,
    }];
    const keys = Object.keys(data[0]).map(d => d);
    const width = parseInt((document.documentElement.offsetWidth / 8 - 5).toFixed(0), 10);
    const height = 80;
    const margin = {
      top: 40,
      left: 0,
      right: 20,
      bottom: 20,
    };
    if (width < 10) return null;

    // bounds
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    //  scales
    const xScale = scaleLinear({
      rangeRound: [0, xMax],
      domain: [0, 100],
      nice: true,
    });
    const yScale = scaleBand({
      rangeRound: [40, 0],
      domain: 1,
      padding: 0.4,
    });
    const zScale = scaleOrdinal({
      domain: keys,
      range: ['#55CA01', '#F0FFE4'],
    });

    return (
      <div style={{ display: 'inline-block' }}>
        <svg width={width} height={height}>
          <rect x={0} y={0} width={width} height={height} fill="#001E40" />
          <Group top={margin.top} left={margin.left}>
            <BarStackHorizontal
              data={data}
              keys={keys}
              height={yMax}
              y={d => d}
              xScale={xScale}
              yScale={yScale}
              zScale={zScale}
            />
            <text
              dy="-.7em"
              fontSize={16}
              fontWeight={200}
              textAnchor="left"
              style={{ pointerEvents: 'none' }}
              fill="#F2F2F2"
            >
              {fileSet}
            </text>
            <text
              dy="1.1em"
              dx=".3em"
              fontSize={16}
              fontWeight={200}
              textAnchor="left"
              style={{ pointerEvents: 'none' }}
              fill="#001E40"
            >
              {sPct.toFixed()}
            </text>
          </Group>
        </svg>
      </div>
    );
  }
}

export default StackChart;
