import React, { useEffect, useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import axios from 'axios'
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import Welcome from './components/Welcome';
import Home from './components/Home';
import Footer from './components/Footer';
import './App.css';
const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL

const PrivateRoute = ({ component: Component, ...rest }) => {
  const user = localStorage.getItem('jwtToken');
  return <Route {...rest} render={(props) => {
      return user ? <Component {...rest} {...props} /> : <Redirect to="/login" />
    }}
  />;
}

function App() {
  // set state values
  let [currentUser, setCurrentUser] = useState("");
  let [isAuthenticated, setIsAuthenticated] = useState(true);
  let [allUsers, setAllUsers] = useState([])

  useEffect(() => {
    let token;
    if (!localStorage.getItem('jwtToken')) {
      setIsAuthenticated(false);
    } else {
      token = jwt_decode(localStorage.getItem('jwtToken'));
      setAuthToken(localStorage.jwtToken);
      setCurrentUser(token);
      setIsAuthenticated(true);
    }

  }, []);

  const nowCurrentUser = (userData) => {
    console.log('nowCurrentUser is working...');
    setCurrentUser(userData);
    setIsAuthenticated(true);
  };
  
  useEffect(()=>{
    axios.get(`${REACT_APP_SERVER_URL}/api/users`)
    .then(response => {
      setAllUsers(response.data)
    })
    .catch(error => console.log(error)); 
  },[])
  
  
  const handleLogout = () => {
    if (localStorage.getItem('jwtToken')) {
      localStorage.removeItem('jwtToken');
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
  }
  
  
  console.log('Current User', currentUser);
  console.log('Authenicated', isAuthenticated);
  console.log(allUsers.data)

  return (
    <div>
      <Navbar handleLogout={handleLogout} isAuth={isAuthenticated} />
      <div className="container mt-5">
        <Switch>
          <Route path="/signup" render={ (props) => <Signup {...props} nowCurrentUser={nowCurrentUser} setIsAuthenticated={setIsAuthenticated} user={currentUser}/>}  />
          <Route 
            path="/login" 
            render={ (props) => <Login {...props} nowCurrentUser={nowCurrentUser} setIsAuthenticated={setIsAuthenticated} user={currentUser}/>} 
          />
          <PrivateRoute path="/home" component={ Home } user={currentUser} allUsers={allUsers}/>
          <PrivateRoute path="/profile/edit/" component={ EditProfile } user={currentUser} />
          <PrivateRoute path="/profile" component={ Profile } user={currentUser} handleLogout={handleLogout}/>
          <Route exact path="/" component={ Welcome } />
        </Switch>
      </div>
      <Footer />
    </div>
  );
}

export default App;
