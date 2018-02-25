import React from 'react'
import {Switch, Route} from 'react-router-dom'
import Home from './components/Home';
import Code from './components/Code';

export default (
    <Switch>
        <Route exact path='/' component={Home}/>
        <Route path='/:id' component={Code}/>
    </Switch>
)