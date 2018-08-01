import React, { Component } from 'react';
import './../App.css';

class Pending extends Component {
  constructor() {
    super();
      this.state = {
      }
    }
    render() {
     
      return (
            <div className="container pending ">
                
                <div className="row">
                    <div className="col-sm-12 pendingNameCol">
                        <h4 className="pendingName">{this.props.userName}</h4>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 pendingImage">
                        <img className="pendingPP" src={this.props.pp}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <h5 className="pendingEmail">{this.props.emailId}</h5>
                    </div>
                </div>
                <div className="row">
                     <a className="col-sm-6 pendingDeclineCol" onClick={this.props.declineUser}>
                         Decline
                    </a>
                    <a className="col-sm-6 pendingAcceptCol" onClick={this.props.acceptUser}>
                         Approve
                    </a> 
                    {/* <a className="col-sm-6 btn btn-danger">
                         <span className="glyphicon glyphicon-remove"></span>
                    </a>
                    <a className="col-sm-6 btn btn-success">
                        <span className="glyphicon glyphicon-ok"></span>
                    </a> */}
                </div>
                
            </div>
      );
    }
  }
  export default Pending;