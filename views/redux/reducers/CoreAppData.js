
import {INIT_APP_DATA, INIT_SEARCH_VIEW,UPDATE_SEARCH_VIEW_FIELD_VALUE,
		FETCH_SCHEME_SEARCH_RESULTS, INIT_DETAILS_VIEW, DISPLAY_SUCCESS_MESSAGE, DISPLAY_FAILURE_MESSAGE} from '../../utils/ActionTypes';
import {viewSchema, UIUtil} from '../../utils/ViewUtils';

const initialState = {
};

export default function appData(state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case INIT_APP_DATA:
			return initAppData(state, payload);
		case INIT_DETAILS_VIEW:
			return initDetailsView(state, payload);
		case INIT_SEARCH_VIEW:
			return initSearchView(state, payload);
		case FETCH_SCHEME_SEARCH_RESULTS:
			return searchSchemeResults(state, payload);
		case DISPLAY_SUCCESS_MESSAGE:
		case DISPLAY_FAILURE_MESSAGE:
			return displayMessage(state, payload);
		default:
			return state||initialState;
	}
}


function initAppData(state, payload) {
	let schemaObj = viewSchema(payload).getSchema();
	return {...state, ...payload};
}
function initSearchView(state, payload) {
	const {data, searchResults} = payload;
	let pageInfo = {};
	var formData = {fieldDataMap:data};
	let schemaObj = viewSchema(formData).getSchema();
	pageInfo.searchFormData = schemaObj.formFieldData;
	pageInfo.schemaData = schemaObj.schemaData;
	pageInfo.initialFormValues = schemaObj.formFieldData;
	pageInfo.rowGroup = (function(arr, size) {
		var chunkData = [];
		size = parseInt(size);
		for(var idx = 0; idx < arr.length; idx += size) {
			chunkData.push(arr.slice(idx, idx+size));
		}
		return chunkData;
	})(data, 2) || [];
	pageInfo.screenType = 'searchScreen';
	pageInfo.searchResults = searchResults;
	pageInfo.tableHeader = [];
	pageInfo.tableHeader = data.map((field)=>{return {headerKey:field.fieldName, headerDesc:field.fieldDesc}});
	pageInfo.tableHeader.unshift({headerKey:'view',headerDesc:'View'}, {headerKey:'edit', headerDesc:'Edit'}, {headerKey:'del', headerDesc:'Delete'});
	pageInfo.notifications = undefined;
	return {...state, ...{searchPageInfo:pageInfo}, openDetails:undefined};
}

function initDetailsView(state, payload) {
	const {data, recordData} = payload;
	let pageInfo = {};
	let formData = {fieldDataMap:data};
	let schemaObj = viewSchema(formData).getSchema(true);
	pageInfo.formData = schemaObj.formFieldData;
	pageInfo.schemaData = schemaObj.schemaData;
	pageInfo.initialFormValues = schemaObj.formFieldData;
	pageInfo.rowGroup = (function(arr, size) {
		var chunkData = [];
		size = parseInt(size);
		for(var idx = 0; idx < arr.length; idx += size) {
			chunkData.push(arr.slice(idx, idx+size));
		}
		return chunkData;
	})(data, 2) || [];
	pageInfo.screenType = 'detailsScreen';
	pageInfo.notification = undefined;
	return {...state,...{searchPageInfo:{...state.searchPageInfo,...{notification:undefined}}}, ...{detailsPageInfo:pageInfo}, openDetails:undefined};
}

function updateSearchFormData(state, payload) {
	let {searchPageInfo, detailsPageInfo} = state;
	searchPageInfo.searchResults = payload.searchResults;
	searchPageInfo.notification = undefined;
	detailsPageInfo = undefined;
	return {...state, ...{searchPageInfo:{...searchPageInfo,...{notification:undefined}}}, ...{detailsPageInfo:detailsPageInfo}, openDetails:undefined};
}

function searchSchemeResults(state, payload) {
	const {searchData, searchResults} = payload;
	let {searchPageInfo, detailsPageInfo} = state;
	searchPageInfo.searchData = searchData;
	searchPageInfo.searchResults = searchResults;
	searchPageInfo.notification = undefined;
	detailsPageInfo = undefined;
	return {...state, ...{searchPageInfo:{...searchPageInfo,...{notification:undefined}}}, ...{detailsPageInfo:detailsPageInfo}, openDetails:undefined};
} 

function displayMessage(state, payload) {
	let {searchPageInfo, detailsPageInfo} = state;
	const {data} = payload;
	if(data.screenType=='searchView') {
		searchPageInfo = {...searchPageInfo, ...{notification:data}};
	}
	else {
		detailsPageInfo = {...detailsPageInfo, ...{notification:data}};
	}
	return {...state, ...{searchPageInfo:searchPageInfo}, ...{detailsPageInfo:detailsPageInfo}, openDetails:!data.closeDetails};
}

