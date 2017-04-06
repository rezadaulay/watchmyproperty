import React from 'react'
import { render } from 'react-dom'

import axios from 'axios';
import Config from '../../config';

import Formsy from 'formsy-react';
import FormsyInput from './../../formComponents/input';

import { Button, Alert } from 'react-bootstrap'

class CreateProperty extends React.Component {
  
  constructor(props) {
    super(props)
	this.state = {
      canSubmit: false,
      successMsg: null
    };

    this.submit = this.submit.bind(this);
    this.enableButton = this.enableButton.bind(this);
    this.disableButton = this.disableButton.bind(this);
  }

  submit(model) {
	let th = this;
	let submittedForm = th.refs.form;
	th.setState({
		successMsg:  null
	})
	
	axios.post(Config.apiUrl+'/properties',{
		name : model.formName,
	}).then(function(response){
		submittedForm.reset()
		th.setState({
			successMsg:  'Data Saved'
		})
	})
	.catch(function(error){
		console.log(error);
	});
  }
  
  resetForm(form){
	console.log(12);
	form.reset()
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
    return (
		<div className="container col-md-4 col-md-offset-4">
	    	<Formsy.Form ref="form" onValidSubmit={this.submit} onValid={this.enableButton} onInvalid={this.disableButton} noValidate >
	    		<h2>Create New Property</h2>
				<Alert bsClass={!this.state.successMsg ? "hide" : "alert alert-success"} bsStyle="success" >
		          <p>{this.state.successMsg}</p>
		        </Alert>
	    		<FormsyInput
	    			validations="isRequired"
		            id="formName"
					type="text"
					label="Property Name"
					placeholder="Name"
					name="formName" 
					required />

			    <Button bsClass="btn btn-primary pull-right" type="submit" disabled={!this.state.canSubmit}>Save</Button>
	    	</Formsy.Form>
    	</div>
	)	
  }
}

export default CreateProperty;