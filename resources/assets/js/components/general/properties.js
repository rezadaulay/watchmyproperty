import React from 'react'
import { render } from 'react-dom'
import { Table, Button, Glyphicon } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

import axios from 'axios';
import Config from '../../config';

class Properties extends React.Component {
	
  constructor(props) {
    super(props)
    this.state = {properties: []}
  }
  
  componentDidMount() {
    var th = this;
	var CancelToken = axios.CancelToken;
	this.source = CancelToken.source();

    this.serverRequest = 
      axios.get(Config.apiUrl+'/properties', {
		  cancelToken: this.source.token
		})
        .then(function(result) {    
          th.setState({
            properties: result.data.datas
          });
	});
  }
  
  componentWillUnmount() {
	this.source.cancel('Operation canceled by the user.');
  }
  
  render() {
    return (
		<div>
			<h3>My Property</h3>
			<Table striped bordered condensed hover>
				<thead>
				  <tr>
					<th>#</th>
					<th>Name</th>
					<th>&nbsp;</th>
				  </tr>
				</thead>
				<tbody>
				  {
					  this.state.properties.map(function(property, index) {
						return <tr key={property.id}>
							<td width="5%" className="text-center">{index + 1}</td>
							<td>{property.name}</td>
							<td width="10%">
								<LinkContainer to={{ pathname: 'showProperty/'+property.id }}>
									<Button bsStyle="primary"><Glyphicon glyph="search" /></Button>
								</LinkContainer>
								<LinkContainer to={{ pathname: 'updateProperty/'+property.id }}>
									<Button bsStyle="info"><Glyphicon glyph="pencil" /></Button>
								</LinkContainer>
							</td>
						</tr>
					  })
				  }
				</tbody>
			</Table>
		</div>
	)	
  }
}

module.exports = Properties