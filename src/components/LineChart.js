import React, { Component } from 'react';
import { LinePath, Line, Bar } from '@vx/shape';
import { scaleTime, scaleLinear } from '@vx/scale';
import { GridRows } from '@vx/grid';
import { localPoint } from '@vx/event';
import { AxisBottom } from '@vx/axis';
import { extent, bisector } from 'd3-array';

const dataTotals = require('../data/coverage-summary.json');
const niceData = { value: dataTotals.total.statements.pct };

function getDataFromUrl() {
   return fetch('https://facebook.github.io/react-native/movies.json')
   .then((response) => response.json())
   .then((responseJson) => {
     console.log(responseJson);
     return responseJson.movies;
   })
   .catch((error) => {
     console.error(error);
   });
}

getDataFromUrl();

function SaveDataToLocalStorage(data) {
  let a = localStorage.getItem('statementTotals') ? JSON.parse(localStorage.getItem('statementTotals')) : [];
  data.date = new Date().toISOString();
  a.push(data);
  localStorage.setItem('statementTotals', JSON.stringify(a));
}

// localStorage.clear();

SaveDataToLocalStorage(niceData);
const sTotal = JSON.parse(localStorage.getItem('statementTotals'));

const xSelector = d => new Date(d.date);
const ySelector = d => d.value;
const bisectDate = bisector(xSelector).left;

class LineChart extends Component {
  state = {
    position: null,
  };
  handleDrag = ({ event, data, xSelector, xScale, yScale }) => {
    const { x } = localPoint(event);
    const x0 = xScale.invert(x);
    let index = bisectDate(data, x0, 1);
    const d0 = data[index - 1];
    const d1 = data[index];
    let d = d0;
    if (d1 && d1.date) {
      if (x0 - xSelector(d0) > xSelector(d1) - x0) {
        d = d1;
      } else {
        d = d0;
        index = index -1;
      }
    }

    this.setState({
      position: {
        index,
        x: xScale(xSelector(d)),
      },
    });
  };
  render() {
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
          onTouchStart={data => event =>
            this.handleDrag({
              event,
              data,
              xSelector,
              xScale,
              yScale,
            })}
          onTouchMove={data => event =>
            this.handleDrag({
              event,
              data,
              xSelector,
              xScale,
              yScale,
            })}
          onMouseMove={data => event =>
            this.handleDrag({
              event,
              data,
              xSelector,
              xScale,
              yScale,
            })}
          onTouchEnd={data => event => this.setState({ position: null })}
          onMouseLeave={data => event => this.setState({ position: null })}
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
          {`${dataTotals.total.statements.total} TOTAL STATEMENTS`}
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
