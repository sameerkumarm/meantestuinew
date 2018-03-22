import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as coreActions from '../redux/actions/CoreAppActions';
import { Nav, NavItem, Breadcrumb, Modal, Button, Panel, Col} from 'react-bootstrap';
import FieldGroup from "../components/FieldGroup";
import {dataViewFieldTypes} from '../utils/ViewUtils';
import SearchPanel from './SearchPanel';
import DataGridContainer from './DataGridContainer';
import Notification from '../components/Notification';

class SearchView extends Component {

  
  constructor() {
	super();
	this.state = {height:'50vh'};
  }
  componentWillReceiveProps(nextProps) {
	  const { searchPageInfo} = nextProps;
	  if(searchPageInfo.notification) {
		  this.props.actions.submitSearch(searchPageInfo.searchData);
	  }
  }
  
  onIconClick = (e)=> {
  }
  
  submit = (viewType)=>{
	  this.props.actions.submitSearch(searchQueryObj);
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
  
  onButtonClick = (searchData)=>{
	  this.props.actions.submitSearch(searchData);
  }
  
  onFieldChange = (values, fields)=>{
	  this.props.actions.updateSearchFieldData(values);
  }
  
  deleteHandler = (recordId)=> {
	  this.props.actions.deleteRecord(recordId);
  }
  
  render() {
    const { props } = this;
    const { searchPageInfo} = props;
    const {tableHeader=[]} = searchPageInfo;
    if(searchPageInfo) {
    	let notification = null;
    	if(searchPageInfo.notification){
    		notification = <Notification show={true} message={searchPageInfo.notification.message} alertType={searchPageInfo.notification.success ? 'success':'error'}/>
    	}
    	return (
    			<Col md={12}>
    				{notification} 
	    			<SearchPanel searchPageInfo={searchPageInfo} onButtonClick={this.onButtonClick} onResize={this.panelResize} onFieldChange={this.onFieldChange}/>	
	    			<DataGridContainer tableData={searchPageInfo.tableData} tableHeader={tableHeader} height={this.state.height} searchResults={searchPageInfo.searchResults} deleteHandler={this.deleteHandler}/>
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
