import React, { Component, PropTypes } from 'react';
import {Col} from 'react-bootstrap';
import Form from 'react-formal';

class FieldGroup extends Component {
  
  constructor(props) {
	  super(props);
  }
  
  getColStyle = (type, formData)=> {
		 
	 	const {approveModified, clobExists, splitWindow, colsPerRow} = formData;
		if(type == 'column') {
			if(approveModified || clobExists || colsPerRow == 1 || splitWindow) {
				return 'col-md-12';
			}
			else if(colsPerRow == 2) {
				return 'col-md-6';
			}
			else if(colsPerRow == 3) {
				return 'col-md-4';
			}
		}
		else if(type == 'label') {
			if(approveModified || clobExists || colsPerRow == 1) {
				return 'col-md-3';
			}
			else if(colsPerRow == 2) {
				return 'col-md-2';
			}
			else if(colsPerRow == 3) {
				return 'col-md-1';
			}
		}
		else if(type == 'value') {
			if(approveModified || clobExists || colsPerRow == 1) {
				return 'col-md-9';
			}
			else if(colsPerRow == 2) {
				return 'col-md-4';
			}
			else if(colsPerRow == 3) {
				return 'col-md-3';
			}
		}
  }
  
  getComponentDetails = ()=> {
	  const { fieldData, formData} = this.props;
	  const {apprvlStatus, pendingApprovalErr, dataViewFormData} = formData;
	  const fieldReadOnly = fieldData.readOnly || apprvlStatus != null || (pendingApprovalErr != null && pendingApprovalErr != '');
	  switch (fieldData.displayType) {
	  	case 'textarea':
	  		return (
  				<div>
		  			<Form.Field name={fieldData.fieldName} type="textAreaField" />
	                <Form.Message for={fieldData.fieldName}/>
                </div>
	  		);
	  	case 'text':
	  		return (
	  				<div>
			  			<Form.Field name={fieldData.fieldName} fieldData={fieldData} formData={formData}  type="plainTextField" />
		                <Form.Message for={fieldData.fieldName}/>
	                </div>
		  		);
	  	case 'radio':
	  		return (
	  				<div>
			  			<Form.Field name={fieldData.fieldName} fieldData={fieldData} formData={formData}  type="radioField" />
		                <Form.Message for={fieldData.fieldName}/>
	                </div>
		  		);
	  	case 'checkbox':
	  		return (
	  				<div>
			  			<Form.Field name={'chk'+fieldData.fieldName} fieldData={fieldData} formData={formData}  type="checkboxField" />
		                <Form.Message for={fieldData.fieldName}/>
	                </div>
		  		);
	  	case 'number':
	  		return (
	  				<div>
			  			<Form.Field name={fieldData.fieldName} fieldData={fieldData} formData={formData}  type="doubleTextField" />
		                <Form.Message for={fieldData.fieldName}/>
	                </div>
		  		);
	  	case 'select':
	  		return (
	  				<div>
			  			<Form.Field name={fieldData.fieldName} fieldData={fieldData} formData={formData}  type="selectField" />
		                <Form.Message for={fieldData.fieldName}/>
	                </div>
		  		);
	  	case 'date':
	  		return (
	  				<div>
			  			<Form.Field name={fieldData.fieldName} fieldData={fieldData} formData={formData}  type="dateField" />
		                <Form.Message for={fieldData.fieldName}/>
	                </div>
		  		);
	  	default:
	  		return (<div></div>);
	  }
  }
  
  render() {
	const { fieldData, formData} = this.props;
    const { fieldName, fieldDesc} = fieldData;
    //const { schemeID} = formData.params;
    const fieldDetails = this.getComponentDetails(this.props);
    return (
	  <div style={(formData.approveModified || formData.splitWindow) ? {"display":"inline-block"} :{"display":"inline-block","width":'50%'}}>
	    <Col sm={2}>
	    <label id={"lbl"+fieldName}>{fieldDesc}</label>
	    </Col>
	    <Col sm={10}>
	    <div className={this.getColStyle('value', formData)}>
	    	{fieldDetails}
	    </div>
	    </Col>
	  </div>
    );
  }
};
FieldGroup.propTypes = {
  formData: PropTypes.object.isRequired,
  fieldData: PropTypes.object.isRequired,
  screenType: PropTypes.oneOf(['searchView','dataView','modalView']).isRequired,
  children: PropTypes.node
};

/*function mapShellProps(props) {
  let visible = true;
  const {fieldData, schemeId, formData, screenType} = props;
  const dynamicScript = require("babylon").parse(formData.customScriptData, {
	  allowImportExportEverywhere: true,
	  // parse in strict mode and allow module declarations
	  sourceType: "module",

	  plugins: [
	    // enable jsx and flow syntax
	    "jsx",
	    "objectRestSpread",
	    "exportExtensions",
	    "dynamicImport",
	    "classProperties"
	  ]
	});
  const generate = require('escodegen').generate;
  const dynaUpd = require('lave')(dynamicScript, {generate, format:'module'});
  const evalVal = dynaUpd;
  const updateView = require('../shell/'+schemeId+'_ShellView');
  const updateObj = updateView(formData, formData.searchFormData);
  const viewTypeObj = updateObj[screenType];
  let customFieldObj = undefined;
  if(viewTypeObj) {
	  customFieldObj = viewTypeObj[fieldData.fieldName];
	  if(customFieldObj && typeof customFieldObj.getVisibility === 'function'){
		  visible = customFieldObj.getVisibility();
	  }
  }
  return {...props, ...{fieldData:{...fieldData, ...customFieldObj}, visible:visible}};
}*/

export default FieldGroup;