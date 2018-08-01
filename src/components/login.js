import React, { Component } from 'react';
import './../App.css';
import logo from '../img/liaison.png';
import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Slide from 'react-reveal/Slide';

import ReactDOM from "react-dom";

const Login = ({ handleClose, show, children }) => {
    const showHideClassName = show ? "modal display-block" : "modal display-none";
    
      return (
        <div className={showHideClassName}>
          <Slide top><section className="modal-main">
          <a onClick={handleClose}><span className="glyphicon glyphicon-remove closeModal"></span></a>
            {children}
          </section></Slide>
        </div>
      );
    };
export default Login;