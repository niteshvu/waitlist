import React, { Component } from 'react';
import './../App.css';
import logo from '../img/liaison.png';
import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom'
import ReactDOM from "react-dom";
import Login from './login';
import {firebase,  auth, provider } from '../firebase.js';


class Header extends Component {

    constructor(props){
      super(props);

      this.state = {
        show: false ,
        username: '',
        user: null ,
        userData: [
        ],
        currentUser: {
            isAdmin: false,
            requested: null,
            uid: null,
            userDisplayName: null,
            userEmail: null,
            userPhotoURL:null
        }
      }
      this.login = this.login.bind(this);
      this.logout = this.logout.bind(this);

    }

    componentDidMount() {
        auth.onAuthStateChanged((user) => {
          if (user) {
            this.setState({ user });
          }
        });


    const itemsRef = firebase.database().ref('userData');
    const itemsRef2 = firebase.database().ref('acceptedUsers');
    let newState = [];
    itemsRef.on('value', (snapshot) => {
      let items = snapshot.val();

      for (let item in items) {
        newState.push({
            uid: items[item].uid,
            userEmail: items[item].userEmail,
            userPhotoURL: items[item].userPhotoURL,
            userDisplayName: items[item].userDisplayName,
            isAdmin: items[item].isAdmin,
            accessApproved: items[item].accessApproved,
            requested: items[item].requested
        });
      }
      this.setState({
        userData: newState,

      });

      itemsRef2.on('value', (snapshot) => {
          let items2 = snapshot.val();
          for (let item in items2) {
            newState.push({
                uid: items2[item].uid,
                userEmail: items2[item].userEmail,
                userPhotoURL: items2[item].userPhotoURL,
                userDisplayName: items2[item].userDisplayName,
                isAdmin: items2[item].isAdmin,
                accessApproved: items2[item].accessApproved,
                requested: items2[item].requested
            });
          }
          this.setState({

            userData: newState,
            currentUser: {
                isAdmin: false,
                requested: null,
                uid: null,
                userDisplayName: null,
                userEmail: null,
                userPhotoURL:null
            }

          });
        });

      });

    }

    logout() {
      let comp = this;
        auth.signOut()
        .then(() => {
            comp.setState({
             user: null,
             currentUser: {
                accessApproved: null,
                isAdmin: false,
                requested: null,
                uid: null,
                userDisplayName: null,
                userEmail: null,
                userPhotoURL:null
            }
        });
        sessionStorage.clear();
        });


    }

    login() {
        auth.signInWithPopup(provider)
          .then((result) => {
            const user = result.user;
            sessionStorage.setItem('user', user.uid);
            this.setState({
              user
            });
            const itemsRef = firebase.database().ref('userData');
            const itemsRef2 = firebase.database().ref('acceptedUsers');
            const userData = {
                uid: user.uid,
                userEmail: user.email,
                userPhotoURL: user.photoURL,
                userDisplayName: user.displayName,
                isAdmin: false,
                accessApproved: false,
                requested: false
            }
            var checkAlreadyLogin = false;
            const tempuserData = [...this.state.userData];
            for (var i = 0; i < tempuserData.length; i++)
            {
                 if(tempuserData[i].uid === user.uid)
                 {
                     checkAlreadyLogin = true;
                 }
            }
            if(!checkAlreadyLogin){
                itemsRef.push(userData);
            }
            const tempUserData = [...this.state.userData];
            for(var i=0; i < tempUserData.length; i++)
            {
                if(user.uid == tempUserData[i].uid)
                {
                    this.setState({
                        currentUser: {
                            accessApproved: tempUserData[i].accessApproved,
                            isAdmin: tempUserData[i].isAdmin,
                            requested: tempUserData[i].requested,
                            uid: tempUserData[i].uid,
                            userDisplayName: tempUserData[i].userDisplayName,
                            userEmail: tempUserData[i].userEmail,
                            userPhotoURL:tempUserData[i].userPhotoURL
                        }
                    })
                    sessionStorage.setItem('currentUserIsAdmin', this.state.currentUser.isAdmin);
                    sessionStorage.setItem('currentHasAccess', this.state.currentUser.accessApproved);
                }
            }
          });
    }

    requestAccess = () => {
        const itemsRef = firebase.database().ref('userData');
        itemsRef.on('value', gotData);
            var keys;
            function gotData(data){
                if(data.val())
                {
                    var scores = data.val();
                    keys = Object.keys(scores);
                }
            }

        const currentUserId = this.state.currentUser.uid;

        let newState = [];
        itemsRef.on('value', (snapshot) => {
            let items = snapshot.val();
            for (let item in items) {
              newState.push({
                uid: items[item].uid
              });
            }

          });
          let keyIndex;
          for(var i=0; i < newState.length; i++)
          {
             if(currentUserId == newState[i].uid)
             {
                 keyIndex = i;
             }
          }
          var updates = {};
          updates['/requested'] = true ;
          firebase.database().ref('userData').child(keys[keyIndex]).update(updates);
          const currentUser = [...this.state.currentUser];
          currentUser.requested = true;
          currentUser.accessApproved = false;
          currentUser.isAdmin = false;
          currentUser.userDisplayName = this.state.currentUser.userDisplayName;
          this.setState(
              {
                  currentUser: currentUser
              }
          )

    }


    render() {
        const currentUserIsAdmin = JSON.parse(sessionStorage.getItem('currentUserIsAdmin'));
        let disableButtons = null;
        if(!currentUserIsAdmin)
            disableButtons = {
                display: "none"
            }

      return (
        <div>
            <nav className="navbar navbar-fixed-top navbar-default" >
            <a className="navbar-brand" href="#">
                <img src={logo} className="img-responsive logo"/>
            </a>
            <div className="container-fluid">
                <div className="navbar-header">
                <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar-collapse-main">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                </button>
            </div>
            <div className="collapse navbar-collapse" id="navbar-collapse-main">
                <ul className="nav navbar-nav navbar-right">

                   {!this.state.currentUser.requested && this.state.currentUser.accessApproved === false ? <li><button className="btn btn-primary" onClick={this.requestAccess}>Request Access</button></li> :null}
                   {this.state.currentUser.requested && this.state.currentUser.accessApproved ===false ? <li><button className="btn btn-danger" >Request Pending..</button></li> :null}

                    <li><Link to="/home">Home</Link></li>
                    {this.state.currentUser.userDisplayName?<li className="manageUsername"><span className="glyphicon glyphicon-user"></span>&nbsp;&nbsp;<strong >{this.state.currentUser.userDisplayName}</strong></li>:null}
                    <li className="manageUser">{this.state.user ?
                        <Link to="/home" onClick={this.logout}>Log Out</Link>
                        :
                        <a className="loginButton" onClick={this.login}>Log In</a>
                    }</li>

                    <li>
                      {this.state.user ?
                         <Link to="/addUsers" className ="dropdown-item manageUser"><span style={disableButtons}>Manage Users</span></Link>
                          :''}
                    </li>

                </ul>
            </div>

            </div>
        </nav>
        </div>
      );
    }
  }

  export default Header;