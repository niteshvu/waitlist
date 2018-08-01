import React, { Component } from 'react';
import './../App.css';

class CurrentUser extends Component {
  constructor() {
    super();
      this.state = {
      }
    }
    render() {
     
      return (
            <div className="container currentUser">
                
                <div className="row">
                    <div className="col-sm-3">
                        <img className="currentUserPP" src={this.props.pp}/>
                    </div>
                    <div className="col-sm-3 accessSwitches">
                        <h5>{this.props.userName}</h5>
                    </div>
                    <div className="col-sm-4 accessSwitches ">
                        <h5>{this.props.emailId}</h5>
                    </div>
                    <div className="col-sm-1 accessSwitches">
                        <label className="switch">
                            <input type="checkbox" defaultChecked ={this.props.isAdmin} onChange={this.props.adminClicked}/>
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <div className="col-sm-1 accessSwitches">
                        <label className="switch">
                            <input type="checkbox" defaultChecked ={this.props.access} onChange={this.props.accessClicked}/>
                            <span className="slider round"></span>
                        </label>
                    </div>
                </div>
                
            </div>
      );
    }
  }
  export default CurrentUser;