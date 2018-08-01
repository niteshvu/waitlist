import React, { Component } from 'react';
import './../App.css';
import Header from './header';
import Search from './search';
import CurrentUser from './currentUser';
import Pending from './pending';
import DeleteUser from './deleteUser';
import {firebase,  auth, provider } from '../firebase.js';

class AddUser extends Component {

    constructor(props){
      super(props); 
      this.state = {
        userData : [
          
          ],
        pendingUserData: [

        ],
        acceptedUserData: [

        ]
      }
    }

  
  componentDidMount() {
    
    const itemsRef = firebase.database().ref('userData');
    const itemsRef2 = firebase.database().ref('acceptedUsers'); 
    itemsRef.on('value', (snapshot) => {
      let items = snapshot.val();
      let newState = [];
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
          let newState2 = [];
          for (let item in items2) {
            newState2.push({
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
    
            acceptedUserData: newState2
          });
        });
        
      });
      
    }



    adminClicked = (user) => {
      const itemsRef = firebase.database().ref('acceptedUsers');
            itemsRef.on('value', gotData);
            var keys;
            function gotData(data){
                if(data.val())
                {
                    var scores = data.val();
                    keys = Object.keys(scores);
                }
            }
        let keyToUpdate = 0;
        for(var i = 0; i < keys.length ; i++)
        {
                if (user.uid == this.state.acceptedUserData[i].uid){
                    keyToUpdate = keys[i];   
                }
        }
        var updates = {};
        updates['/isAdmin'] = !user.isAdmin;
        if(!user.isAdmin){
          updates['/accessApproved'] = true;
        }
        firebase.database().ref('acceptedUsers').child(keyToUpdate).update(updates);   
    }

    accessClicked = (user) => {
      const itemsRef = firebase.database().ref('acceptedUsers');
            itemsRef.on('value', gotData);
            var keys;
            function gotData(data){
                if(data.val())
                {
                    var scores = data.val();
                    keys = Object.keys(scores);
                }
            }
        let keyToUpdate = 0;
        for(var i = 0; i < keys.length ; i++)
        {
                if (user.uid == this.state.acceptedUserData[i].uid){
                    keyToUpdate = keys[i];   
                }
        }
        var updates = {};
        updates['/accessApproved'] = !user.accessApproved;
        firebase.database().ref('acceptedUsers').child(keyToUpdate).update(updates);   
    }


    acceptUser = (user) => {
      const itemsRef = firebase.database().ref('acceptedUsers');
        const acceptedUserData = {
          uid: user.uid,
          userEmail: user.userEmail,
          userPhotoURL: user.userPhotoURL,
          userDisplayName: user.userDisplayName,
          isAdmin: false,
          accessApproved: true,
          requested: false
        }
        itemsRef.push(acceptedUserData);


        const itemsRef2 = firebase.database().ref('userData');
        itemsRef2.on('value', gotData);
            var keys;
            function gotData(data){
                if(data.val())
                {
                    var scores = data.val();
                    keys = Object.keys(scores);
                }
            }
        let keyToUpdate = 0;
        for(var i = 0; i < this.state.userData.length ; i++)
        {
                if (user.uid == this.state.userData[i].uid){
                    keyToUpdate = keys[i];   
                }
        }
        var updates = {};
        updates['/accessApproved'] = !user.accessApproved;
        firebase.database().ref('userData').child(keyToUpdate).remove();
    }
  
    render() {
      return (
        <div>
        <Header/>
        <div className="container currentUserContainer">
            <div className="row">
              <div className="col-sm-12">
                  <strong><h4>Manage Users</h4></strong>
                  <br/>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-3">   
              </div>
              <div className="col-sm-3">   
                <h5 className="grey">Name</h5> 
              </div>
              <div className="col-sm-4">  
                <h5 className="grey">Email</h5>
              </div>
              <div className="col-sm-1">   
                 <h5 className="grey">Admin</h5>
              </div>
              <div className="col-sm-1">   
                <h5 className="grey">Access</h5>
              </div>
            </div>
            <div className="row">
                <div className="col-sm-12">
                {
                  this.state.acceptedUserData.map((user, index) => (
                      <CurrentUser 
                        pp = {user.userPhotoURL}
                        userName = {user.userDisplayName}
                        emailId = {user.userEmail}
                        access = {user.accessApproved}
                        isAdmin = {user.isAdmin}
                        adminClicked = {() => this.adminClicked(user, index)}
                        accessClicked = {() => this.accessClicked(user, index)}
                      />
                  ))
                }
            </div>
          </div>
          </div>
          <br/>
          <div className="container ">
                <h4>Pending Requests</h4>
                <div className="row">
                  <div className="col-sm-12">
                    {
                      this.state.userData.map((user, index) => (
                        user.requested?
                        <Pending 
                          pp = {user.userPhotoURL}
                          userName = {user.userDisplayName}
                          emailId = {user.userEmail}
                          access = {user.accessApproved}
                          isAdmin = {user.isAdmin}
                          declineUser = {() => this.declineUser(user, index)}
                          acceptUser = {() => this.acceptUser(user, index)}
                        />:null
                      ))
                    }
                  </div>
                </div>
          </div>
        </div>
      );
    }
  }
  export default AddUser;