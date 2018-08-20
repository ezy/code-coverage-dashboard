import React, { Component } from 'react';
import '../styles/App.css';
import DonutChart from '../components/DonutChart';
import LineChart from '../components/LineChart';
import StackChart from '../components/StackChart';
import { Grid, Row, Col } from 'react-flexbox-grid';

class App extends Component {
  render() {
    return (
      <Grid fluid className="App">
        <Row>
          <Col className="howWide" sm={12}>
            <header className="App-header">
              <h1 className="App-title">Code Coverage Dashboard</h1>
            </header>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <LineChart />
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <h2>Totals</h2>
          </Col>
        </Row>
        <Row>
          <Col sm={3}>
            <DonutChart selectName='statements' />
          </Col>
          <Col sm={3}>
            <DonutChart selectName='lines' />
          </Col>
          <Col sm={3}>
            <DonutChart selectName='functions' />
          </Col>
          <Col sm={3}>
            <DonutChart selectName='branches' />
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <h2>SECTIONS</h2>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <StackChart fileSet='app/app.js'/>
            <StackChart fileSet='app/router.js'/>
            <StackChart fileSet='app/adapters'/>
            <StackChart fileSet='app/components'/>
            <StackChart fileSet='app/components/flows'/>
            <StackChart fileSet='app/controllers'/>
            <StackChart fileSet='app/helpers'/>
            <StackChart fileSet='app/mixins'/>
            <StackChart fileSet='app/models'/>
            <StackChart fileSet='app/routes'/>
            <StackChart fileSet='app/services'/>
            <StackChart fileSet='app/utils'/>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default App;
