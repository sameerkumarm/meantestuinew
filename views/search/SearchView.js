import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as coreActions from '../redux/actions/CoreAppActions';
import { Nav, NavItem, Breadcrumb, Modal, Button, Panel, Col} from 'react-bootstrap';
import FieldGroup from "../components/FieldGroup";
import Form from 'react-formal';
import {dataViewFieldTypes} from '../utils/ViewUtils';
import SearchPanel from './SearchPanel';
import DataGridContainer from './DataGridContainer';

class SearchView extends Component {

  
  constructor() {
	super();
	this.state = {height:'50vh'};
  }
  componentWillMount() {
	  
  }
  
  onIconClick = (e)=> {
	  debugger
  }
  
  submit = (viewType)=>{
	  const showNextItem = (viewType === 'GetWork');
	  const {searchPageInfo, appData} = this.props;
	  const {searchFormData} = searchPageInfo;
	  const {schemeDetails} = appData;
	  const searchQueryObj = {...searchFormData, ...schemeDetails};
	  this.props.actions.submitSearch(showNextItem, searchQueryObj);
  }
  
  createTemplate = ()=> {
	  
  }
  
  reset = ()=>{
	  this.props.actions.updateSearchFieldData(this.props.searchPageInfo.initialFormValues);
  }
  
  panelResize = (isOpen)=>{
	  if(!isOpen){
		  this.setState({height:'80vh'});
	  }
	  else{
		  this.setState({height:'50vh'}); 
	  }
  }
  
  onButtonClick = (name, event)=>{
	  if(name=='Inquiry' || name=='GetWork'){
		  this.submit(name);
	  }
	  else if(name == 'reset'){
		  this.reset();
	  }
  }
  
  onFieldChange = (values, fields)=>{
	  this.props.actions.updateSearchFieldData(values);
  }
  
  render() {
    const { props } = this;
    const { searchPageInfo} = props;
    const {tableHeaderPre=[], tableHeader=[], tableHeaderPost=[]} = searchPageInfo;
    
    const tableCols = [...tableHeaderPre, ...tableHeader, ...tableHeaderPost];
	/*return (
	          <Form horizontal name="searchViewForm" schema={searchPageInfo.schemaData} defaultValue={searchPageInfo.schemaData ? searchPageInfo.schemaData.default() : undefined}> 
	          	{this.getFieldData(searchPageInfo)}
	          </Form>
	);*/
    if(searchPageInfo) {
    	debugger
    	return (
    			<Col md={12}>
	    			<SearchPanel searchPageInfo={searchPageInfo} onButtonClick={this.onButtonClick} onResize={this.panelResize} onFieldChange={this.onFieldChange}/>	
	    			<DataGridContainer tableData={searchPageInfo.tableData} tableHeader={tableCols} height={this.state.height} searchFormData={searchPageInfo.searchFormData}/>
    			</Col>
    		);
    }
    else {
    	return <div>Loading....</div>
    }
  }

}

SearchView.propTypes = {
  // Injected by React Redux
  appData: PropTypes.object,
  searchPageInfo: PropTypes.object,
  actions: PropTypes.object.isRequired,
  // Injected by React Router
  children: PropTypes.node
};

function mapStateToProps(state) {
	const {appData} = state;
	const {searchPageInfo, schemeDetails={}} = appData;
  return {
	  appData: appData,
	  searchPageInfo: searchPageInfo
  };
}

function mapDispatchToProps(dispatch) {
  const actions = { ...coreActions};
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchView);
