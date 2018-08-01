import React, { Component } from 'react';
import './../App.css';
import Zoom from 'react-reveal/Zoom';


class DeleteUser extends Component {

    
    render() {
      return (
        <Zoom ><div className="inline-block">
          <span className="label">
                <span className="username">{this.props.user}</span>
                <a onClick = {this.props.triggerDelete}><span className="glyphicon glyphicon-remove removeuser"></span></a> 
          </span>
        </div></Zoom>
      );
    }
  }
  export default DeleteUser;