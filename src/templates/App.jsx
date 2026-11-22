import { Component } from 'react';
import '../styles/App.css';
import DonutChart from '../components/DonutChart';
import LineChart from '../components/LineChart';
import StackChart from '../components/StackChart';

const directoryUrl = import.meta.env.VITE_DATA_DIR_URL;

const TOTALS = ['statements', 'lines', 'functions', 'branches'];
const FILE_SETS = [
  'index.route.js',
  'config',
  'server/auth',
  'server/helpers',
  'server/post',
  'server/tag',
  'server/user',
];

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
      // Check the array has at least 2 values to show on LineChart
      const ogArray = localStorage.getItem('statementTotals')
        ? JSON.parse(localStorage.getItem('statementTotals')).length >= 2
        : false;
      // Make sure both localStorage items exist
      if (ogFile && ogArray) {
        localStorage.setItem('fileName', file);
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
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Code Coverage Dashboard</h1>
        </header>
        <section className="App-row">
          <LineChart data={this.state.data} />
        </section>
        <section className="App-row">
          <h2>Totals</h2>
        </section>
        <section className="App-row App-row--totals">
          {TOTALS.map(name => (
            <div className="App-total" key={name}>
              <DonutChart selectName={name} data={this.state.data} />
            </div>
          ))}
        </section>
        <section className="App-row">
          <h2>Sections</h2>
        </section>
        <section className="App-row App-row--sections">
          {FILE_SETS.map(fileSet => (
            <StackChart key={fileSet} fileSet={fileSet} data={this.state.data} />
          ))}
        </section>
      </div>
    );
  }
}

export default App;
