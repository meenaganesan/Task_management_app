import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Signup from './components/Signup/Signup';
import Login from './components/Login/Login';
import AuthorisedUser from './components/AuthorisedUser'

const App = () => {
  return(
    <div>
      <Router>
        <Switch>
          <Route exact path='/' component={Login} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/signup' component={Signup}/>
          <Route path='/dashboard' component={AuthorisedUser}/>
        </Switch>
      </Router>
    </div>  
  )
}
export default App;