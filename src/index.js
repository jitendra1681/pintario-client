import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import registerServiceWorker from './registerServiceWorker'

// ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(
	<MuiThemeProvider>
	    <Router>
	      <Route exact path="/:id" component={App}/>
	    </Router>
	</MuiThemeProvider>,
  document.getElementById('root')
)

registerServiceWorker();
