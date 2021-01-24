import React from 'react';
import './App.css';
import Home from './components/Home';
import CustomerRegistration from './components/CustomerRegistration';
import CustomerList from './components/CustomerList';
import ResortRegistration from './components/ResortRegistration';
import ResortList from './components/ResortList';
import ThankYouCR from './components/ThankYouCR';
import ThankYouRR from './components/ThankYouRR';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class App extends React.Component {
  render() {
    return (
      <div className="App">   
        <Router>
          <div>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/resort_registration">Resort Registration</Link>
              </li>
              <li>
                <Link to="/resort_list">Resort List</Link>
              </li>
              <li>
                <Link to="/customer_registration">Customer Registration</Link>
              </li>
              <li>
                <Link to="/customer_list">Customer List</Link>
              </li>
            </ul>

            <hr />

            <Route exact path="/" component={Home} />
            <Route path="/customer_registration" component={CustomerRegistration} />
            <Route path="/customer_list" component={CustomerList} />
            <Route path="/resort_registration" component={ResortRegistration} />
            <Route path="/resort_list" component={ResortList} />
            <Route path="/thank_you_cr" component={ThankYouCR} />
            <Route path="/thank_you_rr" component={ThankYouRR} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
