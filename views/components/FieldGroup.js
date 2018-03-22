import React, { Component, PropTypes } from 'react';
import {Col} from 'react-bootstrap';
import '../styles/styles.less';
import {formFieldTypes} from '../utils/ViewUtils';

import {Text, Field, Select } from 'react-form';

const Message = ({ color, message }) => (
  <div className="mb-4" style={{ color }}>
    <small>{message}</small>
  </div>
)


const validate = value => {
	debugger
	return {error: !value ? "This is a required field" : null};
}

const getSSIValue = () => new Date().getTime();

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
	  	// Use the form field and your custom input together to create your very own input!
	  	 return( <Field field={fieldData.fieldName} validate={fieldData.required ? validate : null}>
	  	    { fieldApi => {

	  	      // Remember to pull off everything you dont want ending up on the <input>
	  	      // thats why we pull off onChange, onBlur, and field
	  	      // Note, the ...rest is important because it allows you to pass any
	  	      // additional fields to the internal <input>.
	  	      const { onChange, onBlur, field, ...rest } = this.props;

	  	      const { value, error, warning, success, setValue, setTouched } = fieldApi;

	  	      return (
	  	        <div style={{'paddingBottom':'5px'}}>
	  	          <textarea
	  	            {...rest}
	  	            value={value || ''}
	  	            onChange={e => {
	  	              setValue(e.target.value)
	  	              if (onChange) {
	  	                onChange(e.target.value, e)
	  	              }
	  	            }}
	  	            onBlur={e => {
	  	              setTouched()
	  	              if (onBlur) {
	  	                onBlur(e)
	  	              }
	  	            }}
	  	          readOnly = {fieldData.readOnly}
	  	          className='demo-form-input'
	  	          />
	  	          {error ? <Message color="red" message={error} /> : null}
	  	          {!error && warning ? <Message color="orange" message={warning} /> : null}
	  	          {!error && !warning && success ? <Message color="green" message={success} /> : null}
	  	        </div>
	  	      )
	  	    }}
	  	  </Field>);
	  	case 'text':
	  		/*return (
	  				<div>
			  			<Form.Field name={fieldData.fieldName} fieldData={fieldData} formData={formData}  type="plainTextField" />
		                <Form.Message for={fieldData.fieldName} errorClass='val-error-msg'/>
	                </div>
		  		);*/
	  		//return formFieldTypes['plaintextfield']({name:fieldData.fieldName, fieldData:fieldData, formData:formData});
	  		return( <Field validate={fieldData.required ? validate : null} field={fieldData.fieldName}>
	  	    { fieldApi => {

	  	      // Remember to pull off everything you dont want ending up on the <input>
	  	      // thats why we pull off onChange, onBlur, and field
	  	      // Note, the ...rest is important because it allows you to pass any
	  	      // additional fields to the internal <input>.
	  	      const { onChange, onBlur, field, ...rest } = this.props;

	  	      const { error, warning, success, setValue, setTouched } = fieldApi;
	  	      
	  	      let {value} = fieldApi;
	  	      
	  	      if(this.props.mode =='add' && fieldData.fieldName=='Ssi'){
	  	    	  value = getSSIValue();
	  	    	  setValue('Ssi', value);
	  	      }

	  	      return (
	  	        <div style={{'paddingBottom':'5px'}}>
	  	          <input
	  	            {...rest}
	  	            value={value || fieldData.data ||''}
	  	            onChange={e => {
	  	              setValue(e.target.value)
	  	              if (onChange) {
	  	                onChange(e.target.value, e)
	  	              }
	  	            }}
	  	            onBlur={e => {
	  	              setTouched()
	  	              if (onBlur) {
	  	                onBlur(e)
	  	              }
	  	            }}
	  	          readOnly = {fieldData.readOnly}
	  	            className='demo-form-input'
	  	          />
	  	          {error ? <Message color="red" message={error} /> : null}
	  	          {!error && warning ? <Message color="orange" message={warning} /> : null}
	  	          {!error && !warning && success ? <Message color="green" message={success} /> : null}
	  	        </div>
	  	      )
	  	    }}
	  	  </Field>);
	  	case 'radio':
	  		/*return (
	  				<div>
			  			<Form.Field name={fieldData.fieldName} fieldData={fieldData} formData={formData}  type="radioField" />
		                <Form.Message for={fieldData.fieldName} errorClass='val-error-msg'/>
	                </div>
		  		);*/
	  		return formFieldTypes['radiofield']({name:fieldData.fieldName, fieldData:fieldData, formData:formData});
	  	case 'checkbox':
	  		/*return (
	  				<div>
			  			<Form.Field name={'chk'+fieldData.fieldName} fieldData={fieldData} formData={formData}  type="checkboxField" />
		                <Form.Message for={fieldData.fieldName} errorClass='val-error-msg'/>
	                </div>
		  		);*/
	  		return formFieldTypes['checkboxfield']({name:fieldData.fieldName, fieldData:fieldData, formData:formData});
	  	case 'number':
	  		/*return (
	  				<div>
			  			<Form.Field name={fieldData.fieldName} fieldData={fieldData} formData={formData}  type="doubleTextField" />
		                <Form.Message for={fieldData.fieldName} errorClass='val-error-msg'/>
	                </div>
		  		);*/
	  		return formFieldTypes['doubletextfield']({name:fieldData.fieldName, fieldData:fieldData, formData:formData});
	  	case 'select':
	  		/*return (
	  				<div>
			  			<Form.Field name={fieldData.fieldName} fieldData={fieldData} formData={formData}  type="selectField" />
		                <Form.Message for={fieldData.fieldName} errorClass='val-error-msg'/>
	                </div>
		  		);*/
	  		//return formFieldTypes['selectfield']({name:fieldData.fieldName, fieldData:fieldData, formData:formData});
	  		return( <Field validate={fieldData.required ? validate : null} field={fieldData.fieldName}>
	  	    { fieldApi => {

		  	      // Remember to pull off everything you dont want ending up on the <input>
		  	      // thats why we pull off onChange, onBlur, and field
		  	      // Note, the ...rest is important because it allows you to pass any
		  	      // additional fields to the internal <input>.
		  	      const { onChange, onBlur, field, ...rest } = this.props;

		  	      const { value, error, warning, success, setValue, setTouched } = fieldApi;
		  	      let options = fieldData.fieldLoV.map((lovObj)=> <option value={lovObj.paramValue}>{lovObj.paramDesc}</option>);
		  	      options.unshift(<option value="" selected='true'>{'Select '+fieldData.fieldDesc}</option>);
		  	      return (
		  	        <div style={{'paddingBottom':'5px'}}>
		  	          <select
		  	            {...rest}
		  	            value={value || fieldData.data ||''}
		  	            onChange={e => {
		  	              setValue(e.target.value)
		  	              if (onChange) {
		  	                onChange(e.target.value, e)
		  	              }
		  	            }}
		  	            onBlur={e => {
		  	              setTouched()
		  	              if (onBlur) {
		  	                onBlur(e)
		  	              }
		  	            }}
		  	          readOnly = {fieldData.readOnly}
		  	          className='demo-form-input'
		  	          >
		  	          {options}
		  	          </select>
		  	          {error ? <Message color="red" message={error} /> : null}
		  	          {!error && warning ? <Message color="orange" message={warning} /> : null}
		  	          {!error && !warning && success ? <Message color="green" message={success} /> : null}
		  	        </div>
		  	      )
		  	    }}
		  	  </Field>)
	  	case 'date':
	  		/*return (
	  				<div>
			  			<Form.Field name={fieldData.fieldName} fieldData={fieldData} formData={formData}  type="dateField" />
		                <Form.Message for={fieldData.fieldName} errorClass='val-error-msg'/>
	                </div>
		  		);*/
	  		return formFieldTypes['datefield']({name:fieldData.fieldName, fieldData:fieldData, formData:formData});
	  	default:
	  		return (<div></div>);
	  }
  }
  
  render() {
	const { formData} = this.props;
	let {fieldData} = this.props;
    const { fieldName, fieldDesc} = fieldData;
    //const { schemeID} = formData.params;
    const fieldDetails = this.getComponentDetails(this.props);
    let display = true;
    if(this.props.screenType == 'searchView') {
    	display = fieldData.displayInSearch;
    	fieldData.readOnly = false;
    	fieldData.required = false;
    }
    if(display){
    	return (
    			<div style={(formData.approveModified || formData.splitWindow) ? {"display":"inline-block"} :{"display":"inline-block","width":'50%'}}>
    			<Col sm={2}>
    		    <label id={"lbl"+fieldName}>{fieldData.required ? <font><span style={{color:'red'}}>*</span>{fieldDesc}</font> : <font>{fieldDesc}</font>}</label>
    		    </Col>
    		    <Col sm={10}>
    		    <div className={this.getColStyle('value', formData)}>
    		    	{fieldDetails}
    		    </div>
    		    </Col>
    			</div>
    	);
    }
    else {
    	return null;
    }
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