import React, { Component } from 'react';
import './../App.css';
import Moment from 'react-moment';
import AddUser from './addUser';
import {firebase} from '../firebase.js';
import Fade from 'react-reveal/Fade';



class NewPR extends Component {

  constructor(props){
    super(props); 
    this.state = {
        inputValue: '',
        inputLink: '',
        users : [
            ],
        newPullRequests: [
        ],
        keys:[],
        gitEdited: '',
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
        this.clickOkHandler = this.clickOkHandler.bind(this);
        this.clickEditHandler = this.clickEditHandler.bind(this);
  }

 componentDidMount() {
   const itemsRef = firebase.database().ref('acceptedUsers');
   let newState = [{uid:0, userDisplayName:''}];
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
       users: newState
     });
   });

   this.auth = firebase.auth().onAuthStateChanged(
    function(user) {
        if (user) {
            for(var i=0; i < newState.length; i++)
            {
                if(user.uid == newState[i].uid)
                {
                    this.setState({
                        currentUser: {
                            accessApproved: newState[i].accessApproved,
                            isAdmin: newState[i].isAdmin,
                            requested: newState[i].requested,
                            uid: newState[i].uid,
                            userDisplayName: newState[i].userDisplayName, 
                            userEmail: newState[i].userEmail,
                            userPhotoURL:newState[i].userPhotoURL
                        }
                    })
                }
            }
        }
        else{

        }
    }.bind(this)
    );
 }


 componentWillUnmount() {
    // Unsubscribe.
    this.auth();
  }

onInputHandler = (event) => {
    this.setState({inputValue: event.target.value}) 
  }

onInputHandlerGitHub = (event) => {
  this.setState({inputLink: event.target.value}) 
}


  clickOkHandler = (e) => {
    e.preventDefault();
    const itemsRef = firebase.database().ref('pullrequests');
    
    let pullrequests = this.props.pullrequests;
    pullrequests.name = this.state.inputValue;
    pullrequests.gitHub = this.state.inputLink;
    pullrequests.clickedOk = true;
    const pr = {
        id: pullrequests.id,
        name: pullrequests.name,
        createdDate: pullrequests.createdDate, 
        sortIndex: pullrequests.sortIndex,
        clickedOk: pullrequests.clickedOk,
        clickedEdit: pullrequests.clickedEdit,
        gitHub: pullrequests.gitHub
    }
    

    if (pullrequests.clickedEdit === false)
    {
        itemsRef.push(pr);
        this.props.callBack(pullrequests);
        this.setState({
            newPullRequests: pullrequests
        })
    }
    else{
        const itemsRef = firebase.database().ref('pullrequests');
        itemsRef.on('value', gotData);
        var keys;
        function gotData(data){
            if(data.val()){
                var scores = data.val();
            keys = Object.keys(scores);
            }  
        }

        var updates = {};
        let pullrequests = this.props.pullrequests;
        pullrequests.clickedOk = true;
        this.setState({
            newPullRequests: pullrequests
        })
        updates['/name'] = pullrequests.name;
        updates['/gitHub'] = pullrequests.gitHub;
        updates['/clickedOk'] = true;
        updates['/clickedclickedEdit'] = false; 
        return firebase.database().ref('pullrequests').child(keys[pullrequests.sortIndex - 1]).update(updates);
    }

  }

  

  clickEditHandler = () => {
    let pullrequests = this.props.pullrequests;
    pullrequests.clickedOk = false;
    pullrequests.clickedEdit = true;
    
    this.props.editPullRequest(pullrequests);
  }

  

  render() {
    let disableButtons = null;
    console.log('inPR' + this.state.currentUser.accessApproved);

    if(this.state.currentUser.accessApproved === false)
    {
        disableButtons = {
            'pointer-events': 'none',
             'cursor': 'not-allowed',
             opacity: 0.4
        }
    }
     
    return (
      <Fade><div>
        <div className="container" id="newPR">  
            <div className="row">
                <div className="col-sm-1">
                    <div className="sortDiv"><strong><p>{this.props.sortIndex}</p></strong></div>
                </div>
                <div className="col-sm-2 editOrOK">
                    {/* <input  className={`${this.state.clickedOk ? 'nameHide' : ''}`} type="text" onChange={(event) => this.onInputHandler(event)} placeholder="Your name.."></input> */}
                    
                    {(this.props.pullrequests.clickedOk ?
                        <strong><p>{this.props.name}</p></strong>
                    :<select onChange={(event) => this.onInputHandler(event)} >
                    {this.state.users.map((e, key) => {
                         return <option key={key}>{e.userDisplayName}</option>;
                     })}
                    </select>)}
                    
                </div>
                <div className="col-sm-3 editOrOK">
                    {/* <input  className={`${this.state.clickedOk ? 'nameHide' : ''}`} type="text" onChange={(event) => this.onInputHandler(event)} placeholder="Your name.."></input> */}
                    <i className="fa fa-github"></i>&nbsp;
                    {(this.props.pullrequests.clickedOk ?
                        <a className="githubLink" target="_blank" href={this.props.gitHub}><strong>#{this.props.gitHub.substr(-4)}</strong></a>
                    :<input onChange={(event) => this.onInputHandlerGitHub(event)} placeholder="Link to the PR"></input>)}
                    
                </div>
                <div className="col-sm-4 editOrOK">
                    <p className="time"><span className="glyphicon glyphicon-time"></span> <Moment fromNow>{this.props.pullrequests.createdDate}</Moment></p>
                </div>
                
                <div className="col-sm-1 editOrOK">
                    { 
                        (this.props.pullrequests.clickedOk)
                        ?<a style={disableButtons} className="edit" onClick={this.clickEditHandler}><span className="glyphicon glyphicon-edit"></span></a> 
                        :<a style={disableButtons} className="ok" onClick={this.clickOkHandler}>  <span className="glyphicon glyphicon-ok"></span></a> 
                    }
                </div>
                <div className="col-sm-1 editOrOK">
                    <a style={disableButtons} className="delete" onClick={this.props.delete}><span className="glyphicon glyphicon-remove"></span></a>
                </div>
            </div>
        </div>

        
      </div></Fade>
    );
  }
}
export default NewPR;
