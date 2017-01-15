import React from 'react';
import {Router, Route, Link, browserHistory } from 'react-router';

export default () =>
    <Router history={browserHistory}>
        <Route path='/test1'><Link to='/'>go to home</Link></Route>
        <Route path='/test2'><Link to='/'>go to home</Link></Route>
        <Route path='/'>
            <Link to='/test1'>go to 1</Link>
            <Link to='/test2'>go to 2</Link>
        </Route>
    </Router>
