import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import NewPR from './components/newPR';
import Navbar from './components/navbar';
import SignIn from './components/signin';
import Login from './components/login';
import AddUser from './components/addUser';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

ReactDOM.render(

<Router>
    <div>
        <Route path="/home" component={App}/>
        <Route exact path="/" component={App}/>
        <Route path="/addUsers" component={AddUser}/>
        <Route path="/signin" component={SignIn}/>
    </div>
</Router>


, document.getElementById('root'));
registerServiceWorker();
