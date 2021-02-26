import React, { useState } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';
import { Redirect } from 'react-router-dom';
const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL;

const Login = (props) => {
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');

    let handleEmail = (e) => {
        setEmail(e.target.value);
    }

    let handlePassword = (e) => {
        setPassword(e.target.value);
    }

    let handleSubmit = (e) => {
        e.preventDefault();

        const userData = { email, password };

        axios.post(`${REACT_APP_SERVER_URL}/api/login`, userData)
        .then(response => {
            const { token } = response.data;
            // Save token to localStorage
            localStorage.setItem('jwtToken', token);
            // Set token to auth header
            setAuthToken(token);
            // Decode token to get the user data
            const decoded = jwt_decode(token);
            // Set current user
            props.nowCurrentUser(decoded);
        })
        .catch(error => console.log(`Login error`, error));
    }

    if (props.user) return <Redirect to="/home" user={props.user} />;

    return (
        <div className="loginForm">
            <div className="loginBox">
                <div className="loginContainer">
                    <div className="cardbody">
                        <h2 className="loginPara">Login</h2>
                        <form className="loginForm" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input type="text" name="email" value={email} onChange={handleEmail} className="form-control" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password" name="password" value={password} onChange={handlePassword} className="form-control" required />
                            </div>
                            <button type="submit" className="loginPageButton">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>    
    );
}

export default Login;   
