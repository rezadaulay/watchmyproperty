import React from 'react'
import { render } from 'react-dom'

import axios from 'axios';
import Config from '../../config';

import Formsy from 'formsy-react';
//import FormsyInput from './../../formComponents/input';
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap'

import { Button, Alert } from 'react-bootstrap'

class CreateProperty extends React.Component {
  
  constructor(props) {
    super(props)
	this.state = {
      successMsg: null,
	  property : {
			id: null,
			name : null
      }
    };

	this.submit = this.submit.bind(this);
	this.handleChange = this.handleChange.bind(this);
  }
  
  componentDidMount() {
    var th = this;
	var CancelToken = axios.CancelToken;
	this.source = CancelToken.source();

    this.serverRequest = 
      axios.get(Config.apiUrl+'/properties/'+this.props.params.propertyId, {
		  cancelToken: this.source.token
		})
        .then(function(result) {    
          th.setState({
            property: result.data.data
          });
	});
  }
  
  componentWillUnmount() {
	this.source.cancel('Operation canceled by the user.');
  }

  submit(model) {
	let th = this;
	
	axios.put(Config.apiUrl+'/properties/'+this.props.params.propertyId, {
		name : this.state.property.name,
	}).then(function(response){
		th.setState({
			successMsg:  'Data Updated'
		})
	})
	.catch(function(error){
		console.log(error);
	});
  }
  
  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const id = target.id;
	this.setState({
		property : {[id]: value}
	})
  }

  
  render() {
    return (
		<div className="container col-md-4 col-md-offset-4">
	    	<Formsy.Form ref="form" onSubmit={this.submit} >
	    		<h2>Create New Property</h2>
				<Alert bsClass={!this.state.successMsg ? "hide" : "alert alert-success"} bsStyle="success" >
		          <p>{this.state.successMsg}</p>
		        </Alert>
				<FormGroup controlId="formName">
		          <ControlLabel>Name *</ControlLabel>
				  <input 
					  label="Property Name"
					  placeholder="Name" 
					  name="formName" 
					  required="" 
					  type="text" 
					  id="name"
					  className="form-control"
					  value={this.state.property.name}
					  onChange={this.handleChange}
				  />
	    		</FormGroup>
			    <Button bsClass="btn btn-primary pull-right" type="submit" >Save</Button>
	    	</Formsy.Form>
    	</div>
	)	
  }
}
/*
<FormsyInput
	validations="isRequired"
	id="formName"
	type="text"
	label="Property Name"
	placeholder="Name"
	name="formName" 
	value={this.state.property.name}
	required />
*/
export default CreateProperty;