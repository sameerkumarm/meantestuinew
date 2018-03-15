import React from "react";
import {findDOMNode} from "react-dom";
import {Panel, Glyphicon} from 'react-bootstrap';
/*
* @desc By Default ,Columns which do not have any data are shown blank 
*       columns, keyfieldName and data are required for every data grid
*
*/

class DataGridContainer extends React.Component {
    constructor(props){
      super(props);
      this.state = {
	        data : props.tableData,
	        colConfig : props.tableHeader,
	        open: true
      	};
    }
    componentDidMount(){
         // let container = document.getElementById("datagridParentContainer");
         this.calculateCellWidth();
    }
    
    componentWillReceiveProps(nextProps) {
    	this.setState({data : nextProps.tableData, colConfig : nextProps.tableHeader, open: true});
    }
    
    title = ()=>{return <span onClick={ ()=> this.setState({open: !this.state.open})}><Glyphicon glyph={this.state.open?'minus-sign':'plus-sign'}/> Results </span>};
    /**
     * Method written to calculate cell width depending on number of columns an parent container width
     * Updates the colConfig object with calculated width
     */
    calculateCellWidth(){
       let container = 
          findDOMNode(this.refs.datagridParentContainer);
          const rowWidth = container.offsetWidth;
          const colConfig = this.state.colConfig;
          const cellWidth = rowWidth/this.state.colConfig.length;
          colConfig.forEach((element) => {
            if(element.dataKey !== "FUNDGROUP"){
            element.width = cellWidth;
            }
            element.dragDisabled = false;                    

          });    
    }
    /**
     * Sample Method to pass custom styles to the data grid row
     * Write your own business logic and pass this method to getRowStyle prop.
     * @returns {string} classname 
     */
    /*defineRowStyle(row, index){
      *//**
       * Sample logic 
       *//*
        if(typeof row.FUNDGROUP === "undefined"){
          return "ungrouped";
        }
        return "";
    }*/

    /*defineThresholdRowStyle(row, index){
        if(typeof row.THRESHOLD === "undefined"
         && typeof row.TYPE === "undefined"){
          return "sectionHeader";
        }
        return ""; 
    }*/

     /**
     * Sample Method to pass custom cell to the data grid row. Write your own business logic and call this method before data grid is rendered.
     * Call below method to pass custom cell to data grid. This is one of the ways we can pass the cell 
     * You can also pass it as a react component in column config object as shown in an example
     * @returns {Object} customizedColConfig 
     * @example 
     *  colConfig= [{
                "dataKey" : "FUNDGROUP",
                "width": 250,
                "dataType": "string",
                "label" : "Fund Group",
                "locked" : true,
                "menu" : false,
                "cell" : CustomCellComponent 
                  }.....
        CustomCellComponent is a component which has layout for custom cell
     */
    /*passCustomCell(){
      // code to pass custom cell to the data grid
      const fundGroupCol = this.state.colConfig
                           .filter(col => col.dataKey === "FUNDGROUP")[0];
      fundGroupCol.cell = ({value}) =>{
        //value will have the data for the selected column key
        if(!value){
            return (<div className="dataGridCellText ungroupedFund">
                    Ungrouped
                    </div>);
        }
            return <div className="dataGridCellText">{value}</div>;

        
      };
      //end
    }*/
    
  
    render() {
      const {colConfig, data} = this.state;
    // this.passCustomCell();

      return (
    	<Panel collapsible={true} header={this.title() || 'Results'} expanded={this.state.open} style={{height:'auto'}}>
    		<div style={{height:this.props.height}}>
		        <div className="columnChooser datagridParentContainer" ref="datagridParentContainer" style={{height: "90%"}}>
		          
		        </div>
	        </div>
        </Panel>
        );
    }
}

/*function mapShellProps(props) {
	  let visible = true;
	  const {schemeId, searchFormData} = props;
	  const updateView = require('../../shell/'+schemeId+'_ShellView');
	  const updateObj = updateView(props, searchFormData);
	  const viewTypeObj = updateObj['resultsGrid'];
	  let customFieldObj = undefined;
	  if(viewTypeObj) {
		  const {hiddenColumns} = viewTypeObj;
		  props.tableHeader.map((header,i)=>{
				if(hiddenColumns && typeof hiddenColumns === 'array'){
					hiddenColumns.indexOf(header.dataKey) > -1 ? header.hidden = true : undefined;
				}
				if(typeof viewTypeObj[header.dataKey] === 'object'){
					if(viewTypeObj[header.dataKey].hasOwnProperty('cell')){
						header.cell = viewTypeObj[header.dataKey]['cell'];
					}
					if(viewTypeObj[header.dataKey].hasOwnProperty['format']) {
						const formatter = viewTypeObj[header.dataKey].hasOwnProperty['format'];
						const format = typeof formatter === 'function' ? formatter() : typeof formatter === 'string' ? format : undefined; 
						header.dataType === 'datetime' || header.dataType === 'date' ? header.dateFormat = format : undefined;
						header.dataType === 'number' ? header.numberFormat = format : undefined;
					}
				}
		  });
	  }
	  return {...props};
}*/

export default DataGridContainer;