import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute,hashHistory } from 'react-router'
import axios from 'axios';

import AppNav from './components/appnav'

import Login from './components/auth/login'

import Homepage from './components/general/homepage'
import Properties from './components/general/properties'
import CreateProperty from './components/general/create-property'
import ShowProperty from './components/general/show-property'
import UpdateProperty from './components/general/update-property'

import AuthActions from './actions/AuthActions';
import AuthStore from './stores/AuthStore';

// Try to connect user from local storage value
AuthActions.localLogin();
// Handle API request errors
axios.interceptors.response.use(response => {
  return response;
}, error => {
  return new Promise((resolve, reject) => {
    if (error.status === 401 && error.data.error === 'access_denied') {
      AuthActions.refreshToken({initialRequest: error.config, resolve: resolve, reject: reject});
    } else {
      reject(error);
    }
  });
});

var requireAuth = (nextState, replace) => {
  if (AuthStore.getState().accessToken === null) {
    replace('login')
  }
}

var requireUnAuth = (nextState, replace) => {
  if (AuthStore.getState().accessToken !== null) {
    replace('/')
  }
}

render((
  <Router history={hashHistory}>
    <Route path="/" component={AppNav} onEnter={requireAuth}>
      <IndexRoute component={Homepage} />
      <Route path="properties" component ={Properties} />
      <Route path="createProperty" component ={CreateProperty} />
      <Route path="showProperty/:propertyId" component ={ShowProperty} />
      <Route path="updateProperty/:propertyId" component ={UpdateProperty} />
    </Route>
    <Route path="login" component={Login} onEnter={requireUnAuth}></Route>
  </Router>
), document.querySelector('#main-app'));