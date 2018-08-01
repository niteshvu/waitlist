import React, { Component } from 'react';
import './../App.css';
import Navbar from './navbar';
import Slide from 'react-reveal/Slide';

class AddButton extends Component {
  constructor() {
    super();
      this.state = {
          userLogin: null
      }
    }
    enabled = () => {
      const userLogin = sessionStorage.getItem('userLogin');
        if(userLogin){
          return 0;
        }
        else{
          return 1;
        }

    }


    render() {
     //console.log(this.state.pullRequests)
      return (
        <div>
         <button id="addButton" className="btn btn-default" onClick={this.props.addNewPR} disabled={this.props.isDisabled}><span className="glyphicon glyphicon-plus"></span></button>
        </div>
      );
    }
  }
  export default AddButton;