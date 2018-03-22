import React from "react";
import {findDOMNode} from "react-dom";
import {Panel, Glyphicon, Table, Button} from 'react-bootstrap';
import AddEditModal from '../addedit/AddEditModal';

class DataGridContainer extends React.Component {
    constructor(props){
      super(props);
      this.state = {
	        data : props.tableData,
	        colConfig : props.tableHeader,
	        open: true,
	        openDetails: false,
	        recordId:null
      	};
    }
    componentWillReceiveProps(nextProps) {
    	//this.setState({data : nextProps.tableData, colConfig : nextProps.tableHeader, open: true, openDetails:false});
    	//this.setState({open: true});
    }
    
    title = ()=>{
    	return (
    		<div>
    			<span onClick={ ()=> this.setState({open: !this.state.open})}><Glyphicon glyph={this.state.open?'chevron-down':'chevron-right'}/> Results </span>
    			<div className="pull-right" style={{paddingRight:'50px'}}>
    				<Button onClick={ ()=> {
							this.setState({openDetails: true, mode:'add', recordId:null});
    				}} title="Add"><Glyphicon glyph='plus'/></Button>
    			</div>
    		</div>
    	);
    }
    
    detailsClose = ()=>{
    	this.setState({openDetails: false, mode:null});
    }
  
    render() {
      const {colConfig, data} = this.state;
      const {tableHeader, searchResults} = this.props;
      let detailsComp = null;
      if(this.state.openDetails) {
    	  detailsComp = <AddEditModal open={this.state.openDetails} close={this.detailsClose} recordId={this.state.recordId} mode={this.state.mode}/>;
      }
      return (
    	<div>
    		{detailsComp}
    		<Panel collapsible={true} header={this.title() || 'Results'} expanded={this.state.open} style={{height:'auto'}}>
	    		<div style={{height:this.props.height}}>
			        <div style={{height: "90%", 'position':'relative', 'overflowY':'auto'}}>
			        <Table striped bordered condensed hover>
			        <thead>
			          <tr>
			            {tableHeader.map(headerobj=> <th>{headerobj.headerDesc}</th>)}
			          </tr>
			        </thead>
			        <tbody>
			        	{
			        	 searchResults.map(result => {
			        		return (<tr>
			        			{tableHeader.map(headerobj=> {
			        				if(headerobj.headerKey === 'view'){
			        					return <td><Button onClick={()=>this.setState({openDetails:true, mode:'view', recordId:result['_id']})}><Glyphicon glyph="camera"/></Button></td>
			        				}
			        				else if(headerobj.headerKey === 'edit' ){
			        					return <td><Button onClick={()=>this.setState({openDetails:true, mode:'edit', recordId:result['_id']})}><Glyphicon glyph="edit"/></Button></td>
			        				}
			        				else if(headerobj.headerKey === 'del' ){
			        					return <td><Button onClick={()=>this.props.deleteHandler(result['_id'])}><Glyphicon glyph="remove"/></Button></td>
			        				}
			        				else {
			        					return <td><font>{result[headerobj.headerKey]}</font></td>
			        				}
			        			})
			        		  }
			        			</tr>);
			        		})
			        	}
			        </tbody>
			      </Table>
			        </div>
		        </div>
	        </Panel>
        </div>
        );
    }
}

export default DataGridContainer;