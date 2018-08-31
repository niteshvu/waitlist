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
        selectedStatus:'',
        currentUser: {
            accessApproved: false,
            isAdmin: false,
            requested: null,
            uid: null,
            userDisplayName: null,
            userEmail: null,
            userPhotoURL:null
        },
        statusList: [
        {
            id:1,
            name: ''
        },
        {
          id:1,
          name: 'Ready to Merge'
        },{
          id:2,
          name: 'QA Pending'
        },{
          id:3,
          name: 'QA Approved'
        },{
          id:4,
          name: 'Must for release'
        }]
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

onStatusHandler = (event) => {
    this.setState({selectedStatus: event.target.value})
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
    pullrequests.status = this.state.selectedStatus;
    pullrequests.clickedOk = true;
    const pr = {
        id: pullrequests.id,
        name: pullrequests.name,
        createdDate: pullrequests.createdDate,
        sortIndex: pullrequests.sortIndex,
        clickedOk: pullrequests.clickedOk,
        clickedEdit: pullrequests.clickedEdit,
        gitHub: pullrequests.gitHub,
        status: pullrequests.status
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
        updates['/status'] = pullrequests.status;
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

  chooseColor = (status) => {
    let QA_Pending = {
        'color': '#a01823'
    },
    QA_Approved = {
        'color': '#3a6ab7'
    },
    Must_for_release = {
        'color': '#226338'
    },
    Ready_to_Merge = {
        'color': '#666633'
    }


    if(status == 'QA Pending'){
        return QA_Pending;
    }
    else if(status == 'QA Approved'){
        return QA_Approved;
    }
    else if(status == 'Must for release'){
        return Must_for_release;
    }
    else if(status == 'Ready to Merge'){
        return Ready_to_Merge;
    }
  }

  chooseIcon = (status) => {
    
    if(status == 'QA Pending'){
        return 'glyphicon glyphicon-hourglass';
    }
    else if(status == 'QA Approved'){
        return 'glyphicon glyphicon-thumbs-up';
    }
    else if(status == 'Must for release'){
        return 'glyphicon glyphicon-flag';
    }
    else if(status == 'Ready to Merge'){
        return 'glyphicon glyphicon-ok';
    }
  }



  render() {
    let disableButtons = null;
    const currentHasAccess = JSON.parse(sessionStorage.getItem('currentHasAccess'));
    if(!currentHasAccess || this.props.isDisabled){
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

                    {(this.props.pullrequests.clickedOk ?
                        <p>{this.props.name}</p>
                    :<select onChange={(event) => this.onInputHandler(event)} >
                    {this.state.users.map((e, key) => {
                         return <option
                           value={e.userDisplayName ? e.userDisplayName : this.props.name}
                           selected={this.props.name === e.userDisplayName}
                           key={key}>{e.userDisplayName}</option>;
                     })}
                    </select>)}

                </div>
                <div className="col-sm-3 editOrOK">
                    <i className="fa fa-github"></i>&nbsp;
                    {(this.props.pullrequests.clickedOk ?
                        <a className="githubLink" target="_blank" href={this.props.gitHub}>#{this.props.gitHub.substr(-4)}</a>
                    :<input
                    type="text"
                    value={this.state.inputLink ? this.state.inputLink : this.props.gitHub}
                    onChange={(event) => this.onInputHandlerGitHub(event)} placeholder="Link to the PR"></input>)}

                </div>
                <div className="col-sm-2 editOrOK">
                  {(this.props.pullrequests.clickedOk ?
                      <p style={this.chooseColor(this.props.status)}><span class={this.chooseIcon(this.props.status)}></span>&nbsp;&nbsp;{this.props.status}</p>
                  :<select onChange={(event) => this.onStatusHandler(event)} >
                  {this.state.statusList.map((e, key) => {
                       return <option
                         key={e.id}
                         value={e.name ? e.name : this.props.status}
                         selected={this.props.status === e.userDisplayName}
                         key={key}>{e.name}</option>;
                   })}
                  </select>)}
                </div>
                <div className="col-sm-2 editOrOK">
                    <p className="time"><span className="glyphicon glyphicon-time"></span> <Moment fromNow>{this.props.pullrequests.createdDate}</Moment></p>
                </div>
                <div className="col-sm-1 editOrOK">
                    {
                        (this.props.pullrequests.clickedOk)
                        ?<a style={disableButtons} className="edit actions" onClick={this.clickEditHandler}><span className="glyphicon glyphicon-edit"></span></a>
                        :<a style={disableButtons} className="ok actions" onClick={this.clickOkHandler}>  <span className="glyphicon glyphicon-ok"></span></a>
                    }
                </div>
                <div className="col-sm-1 editOrOK">
                    <a style={disableButtons} className="delete actions" onClick={this.props.delete}><span className="glyphicon glyphicon-remove"></span></a>
                </div>
            </div>
        </div>


      </div></Fade>
    );
  }
}
export default NewPR;