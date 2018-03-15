import React from 'react';
import {DropdownList, DateTimePicker, SelectList} from 'react-widgets';
import {Glyphicon, FormControl, HelpBlock, InputGroup, Radio, Checkbox, Button} from 'react-bootstrap';
import yup from 'yup';

/**
 * Custom form field types
*/

export const formFieldTypes = {
		textareafield: (props) => {
		  const { fieldData, formData} = props;
		  const fieldReadOnly = fieldData.readOnly ;
		  let fileUplLink = undefined;
			if(!fieldData.readOnly){
				fileUplLink = 
						<span>
							<FormControl {...props} type="file" label="Select Files"/>
							<HelpBlock>(Maximum File size allowed is 20MB)</HelpBlock>
						</span>
			}
			return (<div>
				{fileUplLink}
		  		<FormControl {...props} componentClass="textarea" placeholder={"Enter "+ fieldData.fieldDesc} 
		  			rows="25" value={props.value} onChange={props.onChange}
		  			readOnly={fieldReadOnly}/>
	
			</div>);
	  },
	radiofield: (props) => {
  		const { fieldData, formData} = props;
  		const { dataViewFormData={}} = formData;
  		const fieldReadOnly = fieldData.readOnly ;
  		const ListItem = (itemProps)=>{<font style={{"whiteSpace": "nowrap", "overflow": "hidden", "textOverflow": "ellipsis"}}>{itemProps.paramDesc}</font>};
  		return (<SelectList {...props} data={fieldData.fieldLoV} name={fieldData.fieldName} valueField="paramValue" textField="paramDesc"
				onChange={props.onChange} disable={fieldReadOnly} itemComponent={ListItem}/>);
  	},
  	checkboxfield: (props) => {
  		const { fieldData, formData} = props;
  		const { dataViewFormData={}} = formData;
  		const fieldReadOnly = fieldData.readOnly ;
  		const ListItem = (itemProps)=>{<font style={{"whiteSpace": "nowrap", "overflow": "hidden", "textOverflow": "ellipsis"}}>{itemProps.paramDesc}</font>};
  		return (<SelectList {...props} name={"chk_" + fieldData.fieldName} data={fieldData.fieldLoV} name={fieldData.fieldName} valueField="paramValue" textField="paramDesc"
			onChange={props.onChange} disable={fieldReadOnly} multiple={true} itemComponent={ListItem}/>
  			);
  	},
  	plaintextfield: (props) => {
  		const { fieldData, formData} = props;
  		const { dataViewFormData={}} = formData;
  		const fieldReadOnly = fieldData.readOnly ;
  		//gtmValidator={{fieldData.dataType, false, false}}
  		return (
  				<FormControl {...props} type="text" value={props.value ? props.value:""} name={fieldData.fieldName} placeholder={"Enter "+ fieldData.fieldDesc} onChange={props.onChange} 
  				readOnly = {fieldReadOnly} maxlength = {fieldData.maxLength} />
  		);
  	},
  	doubletextfield: (props) => {
  		const { fieldData, formData} = props;
  		const { dataViewFormData={}} = formData;
  		const fieldReadOnly = fieldData.readOnly ;
  		if(fieldData.commaSepAmount) {
  			return (
  					<FormControl {...props} type="text" value={props.value ? props.value:""} name={fieldData.fieldName} placeholder={"Enter "+ fieldData.fieldDesc} onChange={props.onChange} 
  					readOnly = {fieldReadOnly} maxlength = {fieldData.maxLength} />
  			);
  		}
  		else {
  			return (
  					<FormControl {...props} type="text" value={props.value ? props.value:""} name={fieldData.fieldName} placeholder={"Enter "+ fieldData.fieldDesc} onChange={props.onChange} 
  					readOnly = {fieldReadOnly} maxlength = {fieldData.maxLength} format="currency"/>
  			);
  		}
  	},
  	selectfield: (props) => {
  		const { fieldData, formData} = props;
  		const { dataViewFormData={}} = formData;
  		const fieldReadOnly = fieldData.readOnly;
  		if(fieldData.multiSelect) {
  			//gtmValidator={{fieldData.dataType, fieldData.upperCase, fieldData.lowerCase}}
  			return (
  					<InputGroup>
			  			<FormControl {...props} type="text" value={props.value ? props.value:""} name={fieldData.fieldName} placeholder={"Select "+ fieldData.fieldDesc} onChange={props.onChange} 
			  				readOnly = {fieldReadOnly} maxlength = {fieldData.maxLength} />
			  	        <InputGroup.Button>
			  	          <Button><Glyphicon glyph="remove" /></Button>
			  	        </InputGroup.Button>
			  	        <InputGroup.Button>
			  	          <Button><Glyphicon glyph="zoom-in" /></Button>
			  	        </InputGroup.Button>
		  	        </InputGroup>
  			);
  		}
  		else{
  			let options = fieldData.fieldLoV;
  			/*if(fieldData.fieldLoV) {
  				options = fieldData.fieldLoV.map((item, index)=>{
  					return (<option value={item.paramValue}>{item.paramDesc}</option>);
  				});
  			}*/
  			if(options && options.length) {
  				options.unshift({paramValue:"", paramDesc:""});
  			}
  			const onChange = (value)=>{
  				props.onChange ? props.onChange(value.paramValue) : undefined;
  			}
  			return(
  					/*<FormControl componentClass="select" placeholder={"Select "+ fieldData.fieldDesc} value={props.value} onChange={props.onChange}>
  						{options}
  					</FormControl>*/
  					<DropdownList {...props} data={options} valueField="paramValue" textField="paramDesc" value={props.value}
  						defaultValue={(props.value ||"")} onChange={onChange} disabled={fieldReadOnly}/>
  			);
  		}
  	}
  
};

/**
 * Schema Definition for form validation
 */
export const viewSchema = function(formData) {
	/**
	 * Custom function for start & end date comparison
	 */
	yup.addMethod(yup.mixed, 'compareDate', function(ref, message, flag) {
	      return this.test('compareDate', message, function (dateValue) {
	        let otherDate = this.resolve(ref);
	       
	        if(typeof otherDate == 'undefined' || typeof dateValue == 'undefined')
	            return true ;

	        otherDate = new Date(otherDate).getTime();
	        dateValue = new Date(dateValue).getTime();
	        // console.log(otherDate, dateValue)
	        if(flag == 1)
	          return  otherDate > dateValue;
	        else
	          return  dateValue > otherDate;
	      })
	});
	return {
		getSchema : function(mode) {
			const fields = formData.fieldDataMap;
			let formFieldData = formData.dataViewFormData||{};
			let fieldSchemaObj = {};
			fields.map((field)=>{
				const fieldData = field;
				switch (fieldData.displayType) {
				  	
					case 'textarea':
					case 'text':
				  		let defaultString = yup.string().default(fieldData.data ? fieldData.data : "");
				  		if(mode){
				  			if(fieldData.mandatory) {
				  				defaultString = defaultString.required(fieldData.fieldDesc + ' is a required field');
				  			}
				  			defaultString = defaultString.max(fieldData.maxLength, fieldData.fieldDesc + ' is more than maximum length');
				  		}
				  		fieldSchemaObj[fieldData.fieldName] = defaultString;
				  		formFieldData[fieldData.fieldName] = fieldData.data;
				  		break;
				  	case 'radio':
				  		let radioString = yup.string().default(fieldData.selectedData ? fieldData.selectedData : "");
				  		if(mode){
				  			if(fieldData.mandatory) {
				  				radioString = radioString.required(fieldData.fieldDesc + ' is a required field');
				  			}
				  		}
				  		fieldSchemaObj[fieldData.fieldName] = radioString;
				  		formFieldData[fieldData.fieldName] = fieldData.selectedData;
				  		break;
				  	case 'checkbox':
				  		const chkData = fieldData.selectedData ? fieldData.selectedData.split(',') : null;
				  		let checkboxData = yup.array().of(yup.string()).default(chkData && chkData.length ? chkData : null);
				  		if(mode){
				  			if(fieldData.mandatory) {
				  				checkboxData = checkboxData.required(fieldData.fieldDesc + ' is a required field');
				  			}
				  		}
				  		fieldSchemaObj['chk' + fieldData.fieldName] = checkboxData;
				  		formFieldData['chk' + fieldData.fieldName] = chkData;
				  		formFieldData[fieldData.fieldfieldData.fieldName] = fieldData.selectedData;
				  		break;
				  	case 'number':
				  		let numberVal = yup.number().default(fieldData.data ? fieldData.data : "");
				  		if(mode){
				  			if(fieldData.mandatory) {
				  				numberVal = numberVal.required(fieldData.fieldDesc + ' is a required field');
				  			}
				  			numberVal = numberVal.max((Math.pow(10, fieldData.maxLength)-1), fieldData.fieldDesc + ' is more than maximum length');
				  		}
				  		fieldSchemaObj[fieldData.fieldName] = numberVal;
				  		formFieldData[fieldData.fieldName] = fieldData.data;
				  		break;
				  	case 'select':
				  		let selectString = yup.string().default(fieldData.selectedData ? fieldData.selectedData : "");
				  		if(fieldData.miltiSelect){
				  			selectString = yup.string().default(fieldData.data ? fieldData.data : "");
				  		}
				  		if(mode){
				  			if(fieldData.mandatory) {
				  				selectString = selectString.required(fieldData.fieldDesc + ' is a required field');
				  			}
				  			selectString = selectString.max(fieldData.maxLength, fieldData.fieldDesc + ' is more than maximum length');
				  		}
				  		fieldSchemaObj[fieldData.fieldName] = selectString;
				  		formFieldData[fieldData.fieldName] = fieldData.data;
				  		break;
				  	case 'date':
				  		let dateDefault = yup.date().default(fieldData.data ? fieldData.data : null);
				  		if(mode){
				  			if(fieldData.mandatory) {
				  				dateDefault = dateDefault.required(fieldData.fieldDesc + ' is a required field').nullable(false).transform(function(currentValue, originalValue){
						  			if ( this.isType(originalValue) ) return originalValue;
						  			if(originalValue == "") return null; 
					  			});
				  			}
				  			if(fieldData.customMaxDate) {
				  				dateDefault = dateDefault.max(fieldData.customMaxDate, fieldData.fieldDesc + ' is more than max allowed date');
				  			}
				  			if(fieldData.customMinDate) {
				  				dateDefault = dateDefault.min(fieldData.customMaxDate, fieldData.fieldDesc + ' is less than min allowed date');
				  			}
				  		}
				  		else{
				  			dateDefault = dateDefault.nullable(true).transform(function(currentValue, originalValue){
								  			if ( this.isType(originalValue) ) return originalValue;
								  			if(originalValue == "") return null; 
							  			});
				  		}
				  		fieldSchemaObj[fieldData.fieldName] = dateDefault;
				  		formFieldData[fieldData.fieldName] = fieldData.data;
				  		break;
			  }
			});
			return {schemaData:yup.object(fieldSchemaObj), formFieldData:formFieldData};
		}
	}
	/*yup.object({
	    firstName:defaultString.required('Name is required').max(10, 'Max legnth is 10').min(5, 'Min legnth is 5'),
	    startDate: yup.date().min(new Date(2016, 0, 1), "Start date must be greater than 2016").compareDate(yup.ref('endDate'), 'End date must be less than Start date', 1),
	    endDate: yup.date().max(new Date(), "End date can't be greater than current date").compareDate(yup.ref('startDate'), 'End date must be less than Start date', 2),
	    colorId: defaultString.required('Favorite color is required'),
	    email: defaultString.email('Must be a valid email'),
	    age: yup.number().required('Age is required').max(100, "Age must be < 100")
	          .min(18, "Age must be > 18")

	  });*/
};

export const UIUtil = (()=>{
	    let totalEditRecords = 0;
	    let updateAccess = undefined;
	    return {
	    	parseJSONString : (jsonData)=>{
	    		let details = [];
	    		if(jsonData != null){
	    			jsonData = jsonData.replace(/\\:/g,":");
	    			jsonData = jsonData.replace(/\\,/g,",");
	    			jsonData = jsonData.replace(/\t/g,"    ");
	    			jsonData = jsonData.split("\\[").join("\[").split("\\]").join("\]").split("\\{").join("\{").split("\\}").join("\}");
	    			details = JSON.parse("["+jsonData+"]");
	    		}
	    		return details;
	    	},
	    	constructTableDetails: (pageInfo)=> {
	    		let header = pageInfo.tableHeader, jsonData = pageInfo.tableData, customEdit = pageInfo.customEdit;
	    		let data = [];
	    		totalEditRecords = 0;
	    		let headerMap = {};
	    		const details = UIUtil.parseJSONString(jsonData);
	    		let schemeDetailInfo = [];
	    		if(pageInfo['schemeDetailArray']) {
	    			var dynamicScript = document.createElement("script");
	    			dynamicScript.type = "text/javascript";
	    			dynamicScript.text = pageInfo['schemeDetailArray'];
	    			document.body.appendChild(dynamicScript);
	    		}
	    		details.map(function(detail, idx) {
	    			let json = {};
	    			json['rowIndex'] = idx;
	    			const schemeParamValueId = detail.SCHME_PRM_VLE_ID;
	    			if(schemeParamValueId == null || schemeParamValueId == '') {
	    				json['schemeParamValueId'] = detail.externalID;
	    			}
	    			else {
	    				json['schemeParamValueId'] = schemeParamValueId;
	    			}
	    			json['status'] = detail.status;
	    			json['lastUpdateAction'] = detail.UPD_ACTION;
	    			json['lastUpdateTimeLocalFormat'] = detail.UPD_DT;
	    			json['processingGrpName'] = detail.PRCSG_GRP_NME;
	    			json['lastUpdatedUserId'] = detail.UPD_LOGIN;
	    			json['lockedBy'] = detail.LOCKED_BY;
	    			json['lockStatus'] = detail.LOCK_STATUS;
	    			json['schemeDetails'] = schemeDetailInfo[schemeParamValueId];
	    			
	    			json['customEdit'] = customEdit;
	    			
	    			if(UIUtil.getUpdateAccess()) {
	    				var updateAccessToRecord = json['schemeDetails'][1];
	    				if(updateAccessToRecord == null || updateAccessToRecord == 'null' || updateAccessToRecord == "true" || (json['lastUpdateAction'] && json['lastUpdateAction'].indexOf('PENDING') > -1)) {
	    					if(json['lastUpdateAction'] == null || (json['lastUpdateAction'] && json['lastUpdateAction'].indexOf('PENDING') == -1)) {
	    						json['editRecord'] = true;
	    						totalEditRecords = totalEditRecords + 1;
	    					}
	    				}
	    				else if(!updateAccessToRecord == "false") {
	    					json['editRecord'] = false;
	    				}
	    			}
	    			else {
	    				json['editRecord'] = false;
	    			}
	    			const paramData = Object.keys(detail);
	    			paramData.map(function(key) {
	    				if(key == 'SCHME_PRM_VLE_ID' || key == 'UPD_ACTION' || key == 'UPD_DT' || key == 'PRCSG_GRP_NME' || key == 'UPD_LOGIN' || key == 'status') {
	    					return;
	    				}
	    				var schemeParamVO = headerMap[key];
	    				if(schemeParamVO  == null) {
	    					for(var i = 0; i < header.length; i++) {
	    						if(key == header[i].paramName) {
	    							headerMap[key] = {
	    									'paramName': header[i].paramName, 
	    									'refParamAseq': header[i].refParamAseq, 
	    									'refParamSeq': header[i].refParamSeq, 
	    									'refSchemId': header[i].refSchemId,
	    									'paramMetaData': header[i].paramMetaData
	    							};
	    							schemeParamVO = headerMap[key];
	    							header[i].dataKey = header[i].paramName;
	    							header[i].width =  "*";
	    							if(header[i].paramMetaData != null && header[i].paramMetaData.paramDataType) {
	    								header[i].dataType = header[i].paramMetaData.paramDataType.toLowerCase();
	    							}
	    							header[i].label = header[i].paramDesc;
	    							/*"locked" : true,
	    			                "menu" : false,
	    			                "cell" : CustomCellComponent,
	    			                "sort":false*/
	    							break;
	    						}
	    					}
	    				}
	    				var anchorLink = false;
	    				var linkType;
	    				if(schemeParamVO != null) {
	    					if( schemeParamVO.paramMetaData != null && schemeParamVO.paramMetaData.paramValuesList != null && schemeParamVO.paramMetaData.paramValuesList.length > 0 ) {
	    						linkType = 'listLookup';
	    						anchorLink = true;
	    					}
	    					else {
	    						if( parseInt(schemeParamVO.refSchemeId) > 0  ) {
	    							if( parseInt(schemeParamVO.refParamSeq) > 0 ) {
	    								linkType = 'paramDesc';
	    								anchorLink = true;
	    							} 
	    							else if( parseInt(schemeParamVO.refParamSeq) == 0  ) {
	    								linkType = 'referenceData';
	    								anchorLink = true;
	    							}
	    							else if( parseInt(schemeParamVO.refParamSeq) < 0 ) {
	    								if( parseInt(schemeParamVO.refParamSeq) > -100 && parseInt(schemeParamVO.refParamSeq) != -99 ){
	    									linkType = 'referenceData';
	    									anchorLink = true;
	    								}
	    							}
	    						}
	    						else if( parseInt(schemeParamVO.refSchemeId) < 0 ) {
	    							linkType = 'paramDesc';
	    							anchorLink = true;
	    						}
	    					}
	    					var dataType;
	    					var data = detail[key];
	    					if(schemeParamVO.paramMetaData != null) {
	    						dataType = schemeParamVO.paramMetaData.paramDataType;
	    						if(dataType==="DOUBLE" && data != null && data != '' && data.indexOf(",")== -1) {
	    							data = parseFloat(data);
	    						}
	    					}
	    					json[schemeParamVO.paramName + 'Data'] = { content: data, link: anchorLink, linkType: linkType };
	    					json[schemeParamVO.paramName] = data;
	    					json['action'] = customEdit ? customEdit : !json['editRecord'] || (pageInfo.apprvlStatus == 'Pending for Approval') ? 'View' :'Edit';
	    				}
	    			});
	    			data.push(json);
	    		});
	    		return data;
	    	},
	    	getTotalEditRecords : ()=> {
				return totalEditRecords;
			},
			setUpdateAccess : (updAccess)=> {
				updateAccess = updAccess;
			},
			getUpdateAccess : ()=> {
				return updateAccess;
			}
	    }
	    
})();

