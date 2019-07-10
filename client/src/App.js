import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import GameClient from './components/GameClient';
import './App.css';

const App = () => (
  <Router>
    <div className='main'>
    	<Route exact path="/" component={GameClient} />
    	<Route exact path="/:id" component={GameClient} />
    </div>
  </Router>
);

export default App;