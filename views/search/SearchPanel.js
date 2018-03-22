import React, { PropTypes, Component } from 'react';
import { Breadcrumb, Modal, Button, Panel, Row, Glyphicon} from 'react-bootstrap';
import FieldGroup from "../components/FieldGroup";
import {formFieldTypes} from '../utils/ViewUtils';
import {Form} from 'react-form';

class SearchPanel extends Component {


	constructor(props) {
		super(props);
		this.state = {open:true, searchData:{}}
	}
	componentWillMount() {

	}

	title = ()=>{return <span onClick={ ()=> {this.setState({open: !this.state.open}); this.props.onResize(!this.state.open);}}><Glyphicon glyph={this.state.open?'chevron-down':'chevron-right'}/> Search </span>};

	getFieldData = (formData, schemeId)=> {
		if(!formData) {
			return undefined;
		}
		const {rowGroup} = formData;
		const title = this.title();
		return( 
				<Panel collapsible={true} header={title || 'Search'} expanded={this.state.open}>
				<Form onSubmit={submittedValues => this.onButtonClick(submittedValues)}>
				{formApi => (
					<form onSubmit={formApi.submitForm} id='searchForm'>
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
					</form>
					)}
				</Form>
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
				<button key={buttons.length} type='submit'>
				<Glyphicon glyph='search'/>&nbsp; <span>Search</span>&nbsp;
				</button>	  
		);
		return buttons;
	}

	onButtonClick = (submittedValues)=>{
		const keys = Object.keys(submittedValues);
		let searchObj = {};
		keys.map(key=>{
			if(submittedValues[key])
				searchObj[key] = submittedValues[key];
		});
		this.props.onButtonClick(searchObj);
	}

	render() {
		const { props } = this;
		const { searchPageInfo } = props;
		const fields = this.getFieldData(searchPageInfo);
		return (
				<div>{fields}</div>
		);

	}

}

SearchPanel.propTypes = {
		searchPageInfo: PropTypes.object,
		schemeId:PropTypes.string,
		children: PropTypes.node
};

export default SearchPanel;