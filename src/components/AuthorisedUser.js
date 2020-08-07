import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Dashboard from './Dashboard/Dashboard';

const AuthorisedUser = () => {
    return (
        <Router>
            <Switch>
                <Route exact path='/dashboard/task' component={Dashboard}/>
            </Switch>
        </Router>
    )
}

export default AuthorisedUser;