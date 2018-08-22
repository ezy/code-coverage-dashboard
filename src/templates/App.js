/* eslint-disable react/destructuring-assignment */

import React, { Component } from 'react';
import '../styles/App.css';
import { Grid, Row, Col } from 'react-flexbox-grid';
import DonutChart from '../components/DonutChart';
import LineChart from '../components/LineChart';
import StackChart from '../components/StackChart';

const directoryUrl = process.env.REACT_APP_DATA_DIR_URL;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    // Contains all the logic for loading data into localStorage
    const SaveDataToLocalStorage = (data) => {
      const a = localStorage.getItem('statementTotals') ? JSON.parse(localStorage.getItem('statementTotals')) : [];
      data.date = new Date().toISOString();
      a.push(data);
      localStorage.setItem('statementTotals', JSON.stringify(a));
    };
    // Checks if the filename has changed at the endpoint
    const newFileHash = (file) => {
      const ogFile = localStorage.getItem('fileName');
      if (ogFile) {
        return !ogFile.includes(file);
      }
      // if fileName doesn't exist we should set it
      localStorage.setItem('fileName', file);
      return true;
    };
    // We fetch the github folder directory based on our .env variables
    fetch(directoryUrl).then(res => res.json()).then((responseJson) => {
      // We use newFileHash to check if the filename has changed
      const saveTrigger = newFileHash(responseJson[0].name);
      const apiData = responseJson[0].download_url;
      fetch(apiData).then(res => res.json()).then((res) => {
        // We only save data to local storage if the file hash has changed
        if (saveTrigger) {
          SaveDataToLocalStorage({ value: res.total.statements.pct });
        }
        // localStorage.clear();
        console.log(JSON.parse(localStorage.getItem('statementTotals')));
        // SaveDataToLocalStorage({ value: res.total.statements.pct });
        this.setState({ data: res });
      }).catch(error => console.error(error));
    }).catch(error => console.error(error));
  }

  render() {
    // Set a one hour timeout to refresh and update data
    setTimeout(() => {
      window.location.reload();
    }, 3600000);
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
            <LineChart data={this.state.data} />
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <h2>Totals</h2>
          </Col>
        </Row>
        <Row>
          <Col sm={3}>
            <DonutChart selectName="statements" data={this.state.data} />
          </Col>
          <Col sm={3}>
            <DonutChart selectName="lines" data={this.state.data} />
          </Col>
          <Col sm={3}>
            <DonutChart selectName="functions" data={this.state.data} />
          </Col>
          <Col sm={3}>
            <DonutChart selectName="branches" data={this.state.data} />
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <h2>SECTIONS</h2>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <StackChart fileSet="index.route.js" data={this.state.data} />
            <StackChart fileSet="config" data={this.state.data} />
            <StackChart fileSet="server/auth" data={this.state.data} />
            <StackChart fileSet="server/helpers" data={this.state.data} />
            <StackChart fileSet="server/post" data={this.state.data} />
            <StackChart fileSet="server/tag" data={this.state.data} />
            <StackChart fileSet="server/user" data={this.state.data} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default App;
