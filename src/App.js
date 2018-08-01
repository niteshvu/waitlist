import React, { Component } from 'react';
import logo from './img/liaison.png';
import AddButton from './components/addButton';
import Header from './components/header';

import './App.css';
import Navbar from './components/navbar';

class App extends Component {
  render() {
    return (
      <div>
        <Header history={this.props.history}/>
        <Navbar />
  
      </div>
    );
  }
}

export default App;
