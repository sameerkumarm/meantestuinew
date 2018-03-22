
import React, { Component, PropTypes } from 'react';
import { Alert} from 'react-bootstrap';
let to;

export default class Notification extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleShow = this.handleShow.bind(this);

    this.state = {
      show: true,
      autoDismiss: true
    };
  }

  handleDismiss() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }
  
  componentWillReceiveProps(nextProps){
	  this.setState({show:nextProps.show});
  }
  componentDidMount() {
	  to = setTimeout(()=>{
		  this.handleDismiss();
	  }, this.props.delay || 5000);
  }
  
  componentDidUpdate() {
	  if(this.state.show) {
		  setTimeout(()=>{
			  this.handleDismiss();
		  }, this.props.delay || 5000);
	  }
  }
  
  componentWillUnmount(){
      clearTimeout(to);
   }
  render() {
    if (this.state.show) {
      return (
        <Alert bsStyle={this.props.alertType||'success'} onDismiss={this.handleDismiss}>
          <p>{this.props.message}</p>
        </Alert>
      );
    }

    return null;
  }
}