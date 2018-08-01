import React, { Component } from 'react';
import './../App.css';
import Header from './header';
import DeleteUser from './deleteUser';
import {firebase} from '../firebase.js';

class Search extends Component {

    constructor() {
        super();
        this.state = {
            users : [
                
              ],
              inputValue: '',
            tempUsers : [
    
            ]
        }
        }

        componentDidMount() {
            const itemsRef = firebase.database().ref('users');
            itemsRef.on('value', (snapshot) => {
              let items = snapshot.val();
              let newState = [];
              for (let item in items) {
                newState.push({
                  id: items[item].id,
                  name: items[item].name,
                });
              }
              console.log(newState);
              this.setState({
                users: newState
              });
            });
          }

    // fillState = () => {
    //     const users = [...this.state.users];

    //     users = this.props.sendUsers;

    //     this.setState({
    //         users: users
    //     })
    // }

    onInputHandler = (event) => {
        this.setState({
            inputValue: event.target.value
        })
        const userData = [...this.state.users];
        const tempUserData = [...this.state.tempUsers];
        
        for(var i=0; i < userData.length; i++)
        {   
            let input = String(this.state.inputValue).toLowerCase();
            if(userData[i].name.substring(0,2).toLowerCase() === input)
            {
                tempUserData.push(userData[i]);
            }
        }
        this.setState({
            tempUsers: tempUserData
        })
        if(this.state.inputValue === '')
        {
            const emptyArray = [];
            this.setState({
                tempUsers: emptyArray
            })
        }
    }

    deleteFromUsers = (user) => {
        // const prIndex = this.state.users.findIndex(p => {
        //     return p.id===user.id;
        //    })
        // const userData = [...this.state.users];
        // userData.splice(prIndex, 1);

        const prIndex2 = this.state.tempUsers.findIndex(p => {
            return p.id===user.id;
           })
        const tempUserData = [...this.state.tempUsers];
        tempUserData.splice(prIndex2, 1);
        this.setState({
            // users: userData,
            tempUsers: tempUserData,
            inputValue: ''
        })

          const itemsRef = firebase.database().ref('users');
                 itemsRef.on('value', gotData);
                 var keys;
                 function gotData(data){
                     if(data.val())
                     {
                         var scores = data.val();
                         keys = Object.keys(scores);
                     }
                 }
        const userToDelete = this.state.users.findIndex(p => {
            return p.id === user.id
        })
        return firebase.database().ref('users').child(keys[userToDelete]).remove();
      }
      
    render() {
      {() => this.clearTempUsers()}
      return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">
                        <input className="searchBox" type="text" onChange={(event) => this.onInputHandler(event)} value={this.state.inputValue}></input>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        {(this.state.inputValue.length > 2 ?
                        this.state.tempUsers.map((user, index) => {
                            return <DeleteUser user = {user.name} triggerDelete={() => this.deleteFromUsers(user)}/>
                        }): null
                        )}
                        {(this.state.inputValue.length > 2 && this.state.tempUsers.length === 0 ?
                            <p className="noMatch">No match found</p>
                        : null
                        )}
                    <hr/>
                    </div>
                </div>
            </div>

        </div>
      );
    }
  }
  export default Search;