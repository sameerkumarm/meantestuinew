import React, { PropTypes, Component } from 'react';
import { Breadcrumb, Modal, Button, Panel, Row, Glyphicon} from 'react-bootstrap';
import FieldGroup from "../components/FieldGroup";
import Form from 'react-formal';
import {formFieldTypes} from '../utils/ViewUtils';

Form.addInputTypes(formFieldTypes);

class SearchPanel extends Component {


	constructor(props) {
		super(props);
		this.state = {open:true}
	}
	componentWillMount() {

	}

	title = ()=>{return <span onClick={ ()=> {this.setState({open: !this.state.open}); this.props.onResize(!this.state.open);}}><Glyphicon glyph={this.state.open?'minus-sign':'plus-sign'}/> Search </span>};

	getFieldData = (formData, schemeId)=> {
		if(!formData) {
			return undefined;
		}
		const {rowGroup} = formData;
		const title = this.title();
		return( 
				<Panel collapsible={true} header={title || 'Search'} expanded={this.state.open}>
				{
					rowGroup.map((row, idx) => {
						return (
								<Row key={idx}>
								{this.getFields(row, formData, schemeId)}
								</Row>
						);
					})
				}
				{this.getButtons(formData)}
				</Panel>
		);

	}

	getFields = (row, formData, schemeId) => {
		return row.map((field, idx) => {
			const props = {fieldData:field, key:idx, screenType:'searchView', formData:formData, schemeId:schemeId}; 
			return <FieldGroup {...props}/>
		});
	}

	handleFormChange = (values, fields)=> {
		this.props.onFieldChange(values, fields);
	}

	getButtons = (formData)=> {
		let buttons = [];
		buttons.push(
				<Form.Button name = "gtmTemplateSearch" key={buttons.length} onClick={this.onButtonClick.bind(null, 'Inquiry')}>
				<Glyphicon glyph='search'/>&nbsp; <span>Search</span>&nbsp;
				</Form.Button>	  
		);
		if(formData.managerViewEnabled || formData.workItemViewEnabled){
			buttons.push(
					<Form.Button key={buttons.length} onClick={this.onButtonClick.bind(null, 'GetWork')}>
					<Glyphicon glyph='open'/>&nbsp; <span>Get Work</span>&nbsp;
					</Form.Button>	  
			);
		}
		buttons.push(
				<Form.Button name = "createTemplateButton" key={buttons.length} onClick={this.onButtonClick.bind(null, 'template')}>
				<Glyphicon glyph='file'/>&nbsp; <span>Create Template</span>&nbsp;
				</Form.Button>	  
		);
		buttons.push(
				<Form.Button onClick={this.onButtonClick.bind(null, 'reset')} key={buttons.length}>
				<Glyphicon glyph='repeat'/>&nbsp; <span>Reset</span>&nbsp;
				</Form.Button>	  
		);
		return buttons;
	}

	onButtonClick = (name, e)=>{
		this.props.onButtonClick(name, e);
	}

	onIconClick = (e)=> {
		debugger
	}

	render() {
		const { props } = this;
		const { searchPageInfo } = props;

		return (
				<Form horizontal name="searchViewForm" schema={searchPageInfo.schemaData} value={props.searchPageInfo.searchFormData ? props.searchPageInfo.searchFormData : {}} onChange={this.handleFormChange}> 
				{this.getFieldData(searchPageInfo)}
				</Form>
		);

	}

}

SearchPanel.propTypes = {
		searchPageInfo: PropTypes.object,
		schemeId:PropTypes.string,
		children: PropTypes.node
};

export default SearchPanel;