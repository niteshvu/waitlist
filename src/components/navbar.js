import React, { Component } from 'react';
import './../App.css';
import NewPR from './newPR';
import Warning from './warning';
import AddButton from './addButton';

import Header from './header';
import Moment from 'react-moment';
import moment from 'moment';
import Zoom from 'react-reveal/Zoom';
import Filter from './filter';
import {firebase} from '../firebase.js';
import ReactDOM from 'react-dom';



class Navbar extends Component {

    constructor() {
        super();
        this.state = {
            pullRequests: [],
            inputValue: '',
            warning: false,
            acceptedUsers: [],
            currentUser: {
                accessApproved: false,
                isAdmin: false,
                requested: null,
                uid: null,
                userDisplayName: null, 
                userEmail: null,
                userPhotoURL:null
            }
        }
        this.deletePullRequest = this.deletePullRequest.bind(this);
        }

    componentDidMount() {

        const itemsRef = firebase.database().ref('pullrequests');
        let userName;

        this.auth = firebase.auth().onAuthStateChanged(
        function(user) {
            if (user) {

                const itemsRef2 = firebase.database().ref('acceptedUsers'); 
                let newState = [];
                itemsRef2.on('value', (snapshot) => {
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
                  });
                this.setState({
                    userName: user.email ,
                    acceptedUsers : newState
                });


            const tempUserData = [...this.state.acceptedUsers];
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
                }
            }
            } else {
            // No user is signed in.
            }
        }.bind(this)
        );


        let userid = '';
        itemsRef.on('value', (snapshot) => {
          let items = snapshot.val();
          let newState = [];
          for (let item in items) {
            newState.push({
              id: items[item].id,
              name: items[item].name,
              sortIndex: items[item].sortIndex,
              createdDate: items[item].createdDate,
              clickedOk: items[item].clickedOk,
              clickedEdit: items[item].clickedEdit,
              gitHub: items[item].gitHub
            });
          }
          //console.log(userName);

          
          this.setState({
            pullRequests: newState,
          });
        });
        
        
        
          
      }

      componentWillUnmount() {
        // Unsubscribe.
        this.auth();
      }


  addNewPR = () => {
        var a = moment().format(); 
        
        if(this.state.pullRequests.length === 0)
        {
            let nextPr = {
                id: 1, name: '', createdDate: a, sortIndex: 1, clickedOk: false, clickedEdit: false, gitHub: ''
                }
                const prs = [...this.state.pullRequests]
                prs.push(nextPr);
                this.setState({
                    pullRequests: prs
                })
        }
        else{
            const maxID = this.state.pullRequests[this.state.pullRequests.length-1].id+1;
            let nextPR = {
                id: maxID, name: '', createdDate: a, sortIndex: this.state.pullRequests.length + 1, clickedOk: false, clickedEdit: false, gitHub: ''
                }
            const prs = [...this.state.pullRequests]
            prs.push(nextPR);
            this.setState({
                pullRequests: prs
            })
         }
         this.setState({
        })
  }

  deletePullRequest = (pr) => { 
    if (!pr.clickedEdit){
    const prIndex = this.state.pullRequests.findIndex(p => {
        return p.id=== pr.id;
       })
    const pullrequests = [...this.state.pullRequests];
    pullrequests.splice(prIndex,1);

    for(var i=0; i<pullrequests.length; i++)
    {
        pullrequests[i].sortIndex = i+1;
    }
    this.setState({
        pullRequests: pullrequests
    })
    if(pr.clickedOk)
    {
        const itemsRef = firebase.database().ref('pullrequests');
            itemsRef.on('value', gotData);
            var keys;
            function gotData(data){
                if(data.val())
                {
                    var scores = data.val();
                    keys = Object.keys(scores);
                }
            }
        const keyToUpdate = [];
        for(var i = 0; i <= pullrequests.length ; i++)
        {
                if (i != prIndex){
                    keyToUpdate.push(keys[i]);   
                }
        }
        keyToUpdate.map((key, index) => {
            var updates = {};
            updates['/sortIndex'] = index + 1 ;
            firebase.database().ref('pullrequests').child(key).update(updates);   
        })
        
        return firebase.database().ref('pullrequests').child(keys[prIndex]).remove();
    }
    }
    else{
        if(!this.state.warning)
        {
            this.setState({
                warning: true
            })
            setTimeout(function(){
                this.setState({warning:false});
            }.bind(this),3000);
        }
    }
  }



  bindPullRequests = (event) => {
    const prIndex = this.state.pullRequests.findIndex(p => {
        return p.id===event.id;
       })
    const pullrequests = [...this.state.pullRequests];
    pullrequests[prIndex].name = event.name;
    pullrequests[prIndex].gitHub = event.gitHub;

    this.setState({
        pullRequests: pullrequests
    })
  }

  callBackEdit = (event) => {
    const prIndex = this.state.pullRequests.findIndex(p => {
        return p.id===event.id;
       })
       const pullrequests = [...this.state.pullRequests];
    pullrequests[prIndex].clickedOk = false;

    this.setState({
        pullRequests: pullrequests
    })
  }
  

  
  render() {
    console.log(this.state.userName);
    console.log(this.state.currentUser);

    
    // const prList = this.state.pullRequests.map((pr, index) => {
    //     return <NewPR delete = {() => this.deletePullRequest(pr)}
    //                 pullrequests = {pr}
    //                 callBack = {this.bindPullRequests.bind(this)}
    //                 name = {this.state.pullRequests[index].name}
    //                 sortIndex = {this.state.pullRequests[index].sortIndex}
    //                 editPullRequest = {this.callBackEdit.bind(this)}

    //     />
    // })

    
    return (
      <div>
        <AddButton   addNewPR = {this.addNewPR} isDisabled = {!this.state.currentUser.accessApproved}/>
        
        
        {/* <a id="addButton" className="btn btn-default" onClick={this.addNewPR}><span className="glyphicon glyphicon-plus"></span></a> */}
        {/* <div id="test"></div> */}
        <div className="container prContainer">
            {/* <div className="row col-sm-12">
                <Filter/>
            </div> */}
            <div className="row col-sm-12">
            {
                this.state.pullRequests.map((pr, index) => (
                    <NewPR delete = {() => this.deletePullRequest(pr)}
                        pullrequests = {pr}
                        callBack = {this.bindPullRequests.bind(this)}
                        name = {this.state.pullRequests[index].name}
                        gitHub = {this.state.pullRequests[index].gitHub}
                        sortIndex = {this.state.pullRequests[index].sortIndex}
                        editPullRequest = {this.callBackEdit.bind(this)}
                    />
                ))

            }
            </div>
        </div>
        {
            (this.state.warning ? <Warning message="Sorry! Can't delete an unsaved instance"/> : null)
        }
      </div>
      
    );
  }
}
export default Navbar;
