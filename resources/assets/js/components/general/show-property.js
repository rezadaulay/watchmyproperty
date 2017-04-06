import React from 'react'
import { render } from 'react-dom'

import axios from 'axios';
import Config from '../../config';
import { hashHistory } from 'react-router';

import { Button, Glyphicon } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

class CreateProperty extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
		property : {
			id: null,
			name : null
		}
	}
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
  
  deleteData() {
	axios.delete(Config.apiUrl+'/properties/'+this.state.property.id).then(function(response){
		hashHistory.push('properties');
	})
	.catch(function(error){
		console.log(error);
	});
  }
  
  render() {
    return (
		<div className="container col-md-4 col-md-offset-4">
			<h2>Show Property</h2>
			<label className="control-label">
				Name
			</label>
			<p>{this.state.property.name}</p>
			<LinkContainer to="properties">
				<Button bsStyle="info">Back</Button>
			</LinkContainer>
			<Button className="btn btn-danger pull-right" onClick={this.deleteData.bind(this)}><Glyphicon glyph="trash" /> Delete</Button>
    	</div>
	)	
  }
}

export default CreateProperty;