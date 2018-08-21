import React, { Component } from 'react';
import '../styles/App.css';
import DonutChart from '../components/DonutChart';
import LineChart from '../components/LineChart';
import StackChart from '../components/StackChart';
import { Grid, Row, Col } from 'react-flexbox-grid';

const directoryUrl = process.env.REACT_APP_DATA_DIR_URL;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }
  componentDidMount() {
    // Contains all the logic for loading data into localStorage
    const SaveDataToLocalStorage = (data) => {
      let a = localStorage.getItem('statementTotals') ? JSON.parse(localStorage.getItem('statementTotals')) : [];
      data.date = new Date().toISOString();
      a.push(data);
      localStorage.setItem('statementTotals', JSON.stringify(a));
    }
    // Checks if the filename has changed at the endpoint
    const newFileHash = (file) => {
      const ogFile = localStorage.getItem('fileName');
      if (ogFile) {
        return ogFile.includes(file) ? false : true;
      }
      // if fileName doesn't exist we should set it
      localStorage.setItem('fileName', file);
      return true;
    }
    fetch(directoryUrl).then((res) => {
      return res.json();
    }).then((responseJson) => {
      // We use newFileHash to check if the filename has changed
      let saveTrigger = newFileHash(responseJson[0].name);
      let apiData = responseJson[0].download_url;
      fetch(apiData).then((res) => {
        return res.json();
      }).then((res) => {
        // We only save data to local storage if the file hash has changed
        if (saveTrigger) {
          SaveDataToLocalStorage({ value: res.total.statements.pct });
        }
        // localStorage.clear();
        // SaveDataToLocalStorage({ value: res.total.statements.pct });
        this.setState({ data: res })
      }).catch((error) => console.error(error));
    }).catch((error) => console.error(error));
  }
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
            <LineChart data={this.state.data}/>
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
            <StackChart fileSet='index.route.js'/>
            <StackChart fileSet='config'/>
            <StackChart fileSet='server/auth'/>
            <StackChart fileSet='server/helpers'/>
            <StackChart fileSet='server/post'/>
            <StackChart fileSet='server/tag'/>
            <StackChart fileSet='server/user'/>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default App;
