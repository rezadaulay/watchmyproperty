import React from 'react'
import { render } from 'react-dom'

import { Link } from 'react-router'

import { LinkContainer } from 'react-router-bootstrap'

import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'

import AuthActions from './../actions/AuthActions';

const AppNav = React.createClass({
  render() {
	const onClickLogout = () => { AuthActions.logout(); };
	
    return (
    	<div>
	    	<Navbar collapseOnSelect >
			    <Navbar.Header>
			      <Navbar.Brand>
			        <Link to="/">Properti App</Link>
			      </Navbar.Brand>
			      <Navbar.Toggle />
			    </Navbar.Header>
			    <Navbar.Collapse>
			      <Nav>
			        <NavDropdown eventKey={1} title="Properti" id="basic-nav-dropdown">
				          <LinkContainer to="properties">
							<MenuItem eventKey={1.1}>Show Datas</MenuItem>
						  </LinkContainer>
				          <LinkContainer to="createProperty">
							<MenuItem eventKey={1.1}>Create Data</MenuItem>
						  </LinkContainer>
			        </NavDropdown>
			      </Nav>
			      <Nav pullRight>
			        <NavDropdown eventKey={1} title="Akun" id="basic-nav-dropdown">
			          	<MenuItem eventKey={1.2} onSelect={onClickLogout}>Logout</MenuItem>
			        </NavDropdown>
			      </Nav>
			    </Navbar.Collapse>
		  	</Navbar>
			<div className="container">
				{this.props.children}
			</div>
	  	</div>
		);
  }
})

module.exports = AppNav