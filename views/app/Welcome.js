'use strict'
import React, { PropTypes, Component } from 'react';
import * as coreActions from '../redux/actions/CoreAppActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Nav, NavItem, Col} from 'react-bootstrap';
import update from 'react-addons-update';
import {withRouter} from 'react-router';

class Welcome extends Component {


	constructor(props) {
		super(props);
		this.state = {width:'100%'};
	}

	componentDidMount() {
		const { history, location, authsession } = this.props;
		//if(authsession.userId) {
		this.props.actions.initializeApp();
		//}
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.location && nextProps.location.pathname =='/') {
			nextProps.router.replace('/home');
		}
	}

	render() {
		const { props } = this;
		const { appData, subMenu, categoryList } = props;
		const {menuData=[]} = this.state;
		let menu = undefined;
		return (
				<div flex='flex' style={{height:'100%'}}>
				{menu}
				<div className="main-content" style={{paddingLeft:'20px'}}>
				<Col className="spaced">
				{React.Children.map(this.props.children, child => React.cloneElement(child, {width:this.state.width}))}
				</Col>
				</div>
				</div>
		);
	}

}

Welcome.propTypes = {
		// Injected by React Redux
		appData: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired,
		// Injected by React Router
		children: PropTypes.node,
		router: React.PropTypes.shape({
			push: React.PropTypes.func.isRequired
		}).isRequired
};

function mapStateToProps(state, props) {
	return {
		appData: state.appData, 
		authsession: state.authsession,
		children: props.children
	};
}

function mapDispatchToProps(dispatch, action) {
	const actions = { ...coreActions};
	return {
		actions: bindActionCreators(actions, dispatch),
		dispatch: dispatch
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Welcome));