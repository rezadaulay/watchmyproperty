import React, { Component, PropTypes } from 'react';
import { render, constructor, handleInputChange } from 'react-dom'
import Router from 'react-router'
import AuthStore from './../../stores/AuthStore';
import AuthActions from './../../actions/AuthActions';
import connectToStores from 'alt/utils/connectToStores';

import Formsy from 'formsy-react';
import FormsyInput from './../../formComponents/input';

import { Button, Alert } from 'react-bootstrap'


Formsy.addValidationRule('isRequired', (values, value) => {
	return value && value.toString().trim().length;
});


class Login extends Component {
  static getStores() {
    return [AuthStore]
  }

  static getPropsFromStores() {
    return AuthStore.getState()
  }

  constructor(props) {
    super(props)
    this.state = {canSubmit: false}

    this.enableButton = this.enableButton.bind(this);
    this.disableButton = this.disableButton.bind(this);
    //this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  submit(model) {
    AuthActions.login({
      username: model.formEmail,
      password: model.formpassword
    });
  }

  enableButton() {
  	this.setState({
  		canSubmit: true
  	})
  }

  disableButton() {
  	this.setState({
  		canSubmit: false
  	})
  }

  render() {
    var divError = (AuthStore.getState().error) ? AuthStore.getState().error : null

    return (
    	<div className="container col-md-4 col-md-offset-4">
	    	<Formsy.Form className="form_auth" noValidate onValidSubmit={this.submit} onValid={this.enableButton} onInvalid={this.disableButton} >
	    		<h2>Silahkan Login</h2>
	    		<p>Masukkan Email & Password Anda</p>
	    		<Alert bsClass={!divError ? "hide" : "alert alert-danger"} bsStyle="danger" >
		          <p>{divError}</p>
		        </Alert>
	    		<FormsyInput
	    			validations="isEmail"
	    			validationError="Email Tidak Valid"
		            id="formEmail"
					type="text"
					label="Email Anda"
					placeholder="Email"
					name="formEmail" 
					required />

	    		<FormsyInput
	    			validations="isRequired"
	    			validationError="Password"
		            id="formpassword"
					type="password"
					label="Password Anda"
					placeholder="Password"
					name="formpassword"
					required />

			    <Button bsClass="btn btn-primary pull-right" type="submit" disabled={!this.state.canSubmit}>Login</Button>
	    	</Formsy.Form>
    	</div>
    );
  }
}

export default connectToStores(Login);