import React, { Component } from 'react';
import './../App.css';
import Fade from 'react-reveal/Fade';

class Warning extends Component {

    constructor() {
        super();
        this.state = {
            
        }
        }
  render() {
      return (
      <Fade><div className="warning">
          <h5><span className="glyphicon glyphicon-alert"></span>&nbsp;&nbsp;{this.props.message}</h5>
      </div></Fade>
      
      )}
}
export default Warning;
