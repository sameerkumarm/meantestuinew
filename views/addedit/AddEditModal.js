import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as coreActions from '../redux/actions/CoreAppActions';
import { Nav, NavItem, Breadcrumb, Modal, Button, Panel, Col, Row, Glyphicon} from 'react-bootstrap';
import FieldGroup from "../components/FieldGroup";
import {Form} from 'react-form';
import {dataViewFieldTypes} from '../utils/ViewUtils';
import "../styles/app.css";
import Notification from '../components/Notification';


class AddEditModal extends React.Component {
	constructor(props){
      super(props);
      this.state = {
	        form: {},
	        errors: {}
      	};
	}
	
	componentWillMount() {
		if(this.props.open) {
			this.props.actions.fetchRecordDetails(this.props.mode, this.props.recordId);
		}
	} 
	
	componentWillReceiveProps(nextProps) {
		if(nextProps.openDetails === false) {
			this.props.close();
		}
	}
	
	onButtonClick = (formValue)=>{
		this.props.actions.saveRecord(this.props.mode, {...formValue,...{_id:this.props.recordId}})
	}
	
	handleFormChange = (value, paths)=>{
		this.setState({form:value});
	}
	
	handleErrors = (errors)=>{
		this.setState({errors:errors});
	}
	
	getFieldData = (formData, schemeId)=> {
		if(!formData) {
			return undefined;
		}
		const {rowGroup} = formData;
		return( 
				<Panel header={this.props.mode=='add' ? 'Add SSI' : "Edit SSI"}>
				<Form onSubmit={submittedValues => this.onButtonClick(submittedValues)}>
				{formApi => (
					<form onSubmit={formApi.submitForm} id='detailsForm'>
					{
						rowGroup.map((row, idx) => {
							return (
									<Row key={idx}>
									{this.getFields(row, formData, schemeId)}
									</Row>
							);
						})
					}
				<button type="submit" className="mb-4 btn btn-primary">
					<Glyphicon glyph='save'/>&nbsp; <span>Save</span>&nbsp;
				</button>
				<button className="mb-4 btn btn-primary" onClick={this.props.close.bind(null, 'Cancel')}>
					<Glyphicon glyph='cancel'/>&nbsp; <span>Cancel</span>&nbsp;
				</button>
				</form>
				)}
				</Form>
				</Panel>
		);

	}

	getFields = (row, formData, schemeId) => {
		return row.map((field, idx) => {
			const props = {fieldData:field, key:idx, screenType:'dataView', formData:formData, schemeId:schemeId, mode:this.props.mode}; 
			return <FieldGroup {...props}/>
		});
	}
	
	render() {
		const { props } = this;
		const { detailsPageInfo } = props;
		/*<Form horizontal name="detailsForm" schema={detailsPageInfo.schemaData} 
		value = {this.state.form}
		onChange= {this.handleFormChange}
		onError= {this.handleError}
		onSubmit={this.onButtonClick}
		> */
		if(detailsPageInfo){
			
		    const fields = this.getFieldData(detailsPageInfo);
		    let notification = null;
	    	if(detailsPageInfo.notification){
	    		notification = <Notification show={true} message={detailsPageInfo.notification.message} alertType={detailsPageInfo.notification.success ? 'success':'error'}/>
	    	}
			return (
					<div id="addEditModalWindow">
						<Modal show={this.props.open} onHide={this.props.close} style={{width:'90%'}}>
							<Modal.Header closeButton>
							</Modal.Header>
							<Modal.Body>
							   {fields}
							</Modal.Body>
							<Modal.Footer>
								{notification}
							</Modal.Footer>
						</Modal>
					</div>
					);
		}
		else {
			return null;
		}
	}
}

function mapStateToProps(state, props) {
	const {appData} = state;
	const {detailsPageInfo, openDetails} = appData;
  return {...props, appData, detailsPageInfo, openDetails};
}

function mapDispatchToProps(dispatch) {
  const actions = { ...coreActions};
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

AddEditModal.propTypes = {
		detailsPageInfo: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(AddEditModal);
