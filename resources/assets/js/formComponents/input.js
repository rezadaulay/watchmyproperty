import React from 'react';
import Formsy from 'formsy-react';
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap'

const FormsyInput = React.createClass({

  // Add the Formsy Mixin
  mixins: [Formsy.Mixin],

  // setValue() will set the value of the component, which in
  // turn will validate it and the rest of the form
  changeValue(event) {
    this.setValue(event.currentTarget[this.props.type === 'checkbox' ? 'checked' : 'value']);
  },
  render() {

    // Set a specific className based on the validation
    // state of this component. showRequired() is true
    // when the value is empty and the required prop is
    // passed to the input. showError() is true when the
    // value typed is invalid
    const className = 'form-group' + (this.props.className || ' ') +
      (this.showRequired() ? 'required' : this.showError() ? 'error' : '');

    // An error message is returned ONLY if the component is invalid
    // or the server has returned an error message
    const errorMessage = this.getErrorMessage();

    return (
      <FormGroup controlId={this.props.id}>
        <ControlLabel>{this.props.label} {this.isRequired() ? '*' : null}</ControlLabel>
        <FormControl 
          onChange={this.changeValue}
          value={this.getValue()}
          {...this.props} />
        {this.props.help && <HelpBlock>{this.props.help}</HelpBlock>}
        <span className='validation-error'>{errorMessage}</span>
      </FormGroup>
    );
  }
});

export default FormsyInput;