
import {GET_DEFAULT_NAV_DATA, GET_NAV_DATA, INIT_APP_DATA, INIT_DASHBOARD, INIT_SEARCH_VIEW,UPDATE_SEARCH_VIEW_FIELD_VALUE, FETCH_SCHEME_SEARCH_RESULTS} from '../../utils/ActionTypes';
import {viewSchema, UIUtil} from '../../utils/ViewUtils';

const initialState = {
};

export default function appData(state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case GET_DEFAULT_NAV_DATA: 
			return getNavData(state);
		case GET_NAV_DATA: 
			return getNavData(state, payload);
		case INIT_APP_DATA:
			return initAppData(state, payload);
		case INIT_DASHBOARD:
			return initDashboard(state, payload);
		case INIT_SEARCH_VIEW:
			return initSearchView(state, payload);
		case UPDATE_SEARCH_VIEW_FIELD_VALUE:
			return updateSearchFormData(state, payload);
		case FETCH_SCHEME_SEARCH_RESULTS:
			return searchSchemeResults(state, payload);
		default:
			return state||initialState;
	}
}


function getNavData(state, payload) {
	const {entitledApps} = state;
	let subMenuItems = null;
	let menuItem = null;
	let loadedMenus = state.loadedMenus || {};
	if(state.loadedMenus && payload.loadedAppId && state.loadedMenus[payload.loadedAppId]) {
		subMenuItems = state.loadedMenus[payload.loadedAppId];
	}
	if(!subMenuItems && payload && payload.jsonData && payload.jsonData.menuText) {
		subMenuItems = JSON.parse("[" + payload.jsonData.menuText + "]");
	}
	if(subMenuItems && subMenuItems.length ) {
		let finalSubMenu = [];
		if(!state.loadedMenus[payload.loadedAppId]) {
			if(state.navData && state.navData.length) {
				menuItem = state.navData;
			}
			else {
				menuItem = entitledApps.map((app, index)=>{
					return {...app, ...{id:app.appId, label:app.menuDisplayName}}
				});
			}
			//menuItem = menuItem.concat(subMenuItems);
			let subMenu = [];
			subMenuItems.map((item, index)=> {
				const sI = [].concat(getSubMenuItems(item, payload.loadedAppId));
				let ssI = [];
				sI.map(sItem=>{
					sItem.map(elem=>{
						ssI = ssI.concat(elem);
					})
				})
				subMenu = subMenu.concat(ssI);
			});
			finalSubMenu = subMenu;/*.reduce((acc,obj)=>{
			obj.label = obj.text;
			obj.link = '/' + payload.loadedAppId + '/' + obj.parentCatId + '-' + obj.catId + '/' + obj.schemeId;
			if(!obj.parentCatId) {
				obj.parentCatId = 0;
			}
			if(!acc[obj.parentCatId]) {
				acc[obj.parentCatId] = {};
			}
			if(!acc[obj.parentCatId][obj.catId]) {
				acc[obj.parentCatId][obj.catId] = [obj];
			}
			else {
				acc[obj.parentCatId][obj.catId].push(obj);
			}
			return acc;
		}, {});*/
			loadedMenus[payload.loadedAppId] = finalSubMenu;
		}
		else {
			finalSubMenu = state.loadedMenus[payload.loadedAppId];
		}
		return {...state, ...{subMenu:finalSubMenu, loadedMenus:loadedMenus}}
	}
	else {
		menuItem = entitledApps.map((app, index)=>{
			return {...app, ...{id:app.appId, label:app.menuDisplayName, fetchChildren:true}}
		});
		return {...state, ...{navData:menuItem}};
	}
}


function getSubMenuItems(item, appId) {
	let subIt = [];
	if(item.submenu && item.submenu.itemdata) {
		subIt = item.submenu.itemdata.map((subItem, subIndex)=> {
			return getSubMenuItems(subItem, appId);
		});
		return subIt;
	}
	else {
		return {...item, ...{appId:appId, link:'/app/' + appId + '/' + item.schemeId}};
	}
}

function initAppData(state, payload) {
	let schemaObj = viewSchema(payload).getSchema();
	return {...state, ...payload};
}
function initSearchView(state, payload) {
	debugger
	const {data} = payload;
	var formData = {fieldDataMap:data};
	var numberOfRows = Math.ceil(data.length/2);
	let schemaObj = viewSchema(formData).getSchema();
	return {...state, ...{searchPageInfo:schemaObj}};
}

function updateSearchFormData(state, payload) {
	let searchFormData = state.searchPageInfo.searchFormData||{};
	const searchPageInfo = {...state.searchPageInfo, ...{searchFormData:{...searchFormData, ...payload.fieldData}}};
	return {...state, ...{searchPageInfo:searchPageInfo}};
}

function searchSchemeResults(state, payload) {
	const {data, showNextItem} = payload;
	let {searchPageInfo} = state;
	let {searchFormData} = searchPageInfo;
	let newState = {}
	/*if(searchFormData.PRCSG_GRP_NME && searchFormData.PRCSG_GRP_NME.$invalid) {
		$rootScope.showErrors([$rootScope.translate('i18nMsgKey', 'Processing Group is required')]);
		$scope.formInvalid = true;
		return;
	}*/
	if(state[appIdFromServer] && state[appIdFromServer]['additionalFilterCriteria'] 
			&& state[appIdFromServer]['additionalFilterCriteria']['additionalFilterParams']) {
		var paramsArray = state[appIdFromServer]['additionalFilterCriteria']['additionalFilterParams'].split(",");
		if(paramsArray && paramsArray.length > 0) {
			for (let i=0; i< paramsArray.length; i++) {
				if(searchFormData.hasOwnProperty(paramsArray[i]) 
						&& !state.schemeDetails.hasOwnProperty(paramsArray[i])) {
					delete searchFormData[paramsArray[i]];
				}else if(state.schemeDetails.hasOwnProperty(paramsArray[i])) {
					searchFormData[paramsArray[i]] = state.schemeDetails[paramsArray[i]];
				}
			}
			delete state[appIdFromServer]['additionalFilterCriteria']; 
		}
	}
	
	let errorList = [];
	for(let i=0;i<searchPageInfo.searchFields.length;i++){
		if(searchPageInfo.searchFields[i].enableDateRange){
			var fieldNameFromDate =searchPageInfo.searchFields[i].fieldName+"_From";
			var fieldNameToDate =searchPageInfo.searchFields[i].fieldName+"_To";
											
			if(typeof(searchFormData[fieldNameToDate])!='undefined' || typeof(searchFormData[fieldNameFromDate])!='undefined' ){ 
				if((searchFormData[fieldNameFromDate]!='' && searchFormData[fieldNameFromDate]!=null)){
					searchFormData['rangeDateCriteria']=true;
				if(searchFormData[fieldNameToDate]=='' || searchFormData[fieldNameToDate]==null){
					searchFormData[fieldNameToDate]=searchFormData[fieldNameFromDate];
				}else if(dateCompare(searchFormData[fieldNameFromDate],searchFormData[fieldNameToDate])== 2){
					searchFormData['rangeDateCriteria']=false;
					data['error'] = true;
					//errorList[errorList.length] = $rootScope.translate('i18nMsgKey','For Field '+ $scope.pageInfo.searchFields[i].fieldDesc + ' From Date Shold Be Lesser Than To Date');
				}
				
			}else if($scope.searchFormData[fieldNameFromDate]==null &&  $scope.searchFormData[fieldNameToDate]!=null){
				searchFormData['rangeDateCriteria']=false;
				data['error'] = true;
				//errorList[errorList.length] = $rootScope.translate('i18nMsgKey','For Field '+ $scope.pageInfo.searchFields[i].fieldDesc + ' From Date is Mandatory If To Date is Selected');

			}
		 }
		}
	}
	
	if(data.error){
		/*var uniqueErrorList = [];
		$.each(errorList, function(i, el){
		    if($.inArray(el, uniqueErrorList) === -1) uniqueErrorList.push(el);
		});
		errorList = uniqueErrorList;

		$rootScope.showErrors(errorList);
		$scope.formInvalid = true;*/
		const uniqueErrors = Array.from(errorList.reduce((m, t) => m.set(t,t), new Map()).values());
		//return false;
	}
	searchFormData['additionalFilterParams'] = null;
	newState.schemeDetailArray = data.schemeDetailArray;
	const details = (data.yuiGridInfo != null) ? data.yuiGridInfo.pageData : '';
	
	newState['tableHeader'] = (data.yuiGridInfo != null && data.yuiGridInfo.displayColumnsList != null) ? data.yuiGridInfo.displayColumnsList :  data.schemeStruct.schemeParamList;
	newState.apprvlStatus = data.apprvlSts;
	newState.updateAccess = data.updateAccess;
	newState.disableCheckBoxes = data.schemeStruct.disableCheckBoxes;
	newState.importAccess = data.importAccess;
	newState.disableAddButton = data.disableAddButton;
	newState.showDefaultButtons = data.showDefaultButtons;
	newState.suppressDeleteButton = data.suppressDeleteButton;
	newState.actionButtonList = data.actionButtonList;
	UIUtil.setUpdateAccess(newState.updateAccess); // Added for Inquiry View Change
	if(!showNextItem) {
		newState.tableHeader = searchPageInfo['tableHeader'];
		newState.predicate = 'rowIndex';
		newState.tableData = details;
		newState.tableData = UIUtil.constructTableDetails({...searchPageInfo, ...newState});
		newState.currentPage = searchPageInfo.currentPage;
		newState.entryLimit = searchPageInfo.entryLimit;
		if(newState.tableData) {
			newState.filteredItems = newState.tableData.length; 
			newState.totalItems = newState.tableData.length;
		}
		//newState.openListPanel();
	}
	newState.model = {allItemsSelected: false};
	newState.chkStatus = {};
	newState.selectedValues = [];
	newState.statusMap = {};
	//newState.canEdit();
	//$rootScope.hideWait();
	if(showNextItem) {
		/*var data = UIUtil.parseJSONString(details);
		if(data && data.length > 0) {
			newState.openDataViewModalForGetWork('edit', data[0].SCHME_PRM_VLE_ID)						
		}
		else {
			//$rootScope.showErrors(['No records found.']);
			if(!newState.showTableData && !newState.showSearchCriteria) {
				newState.closeTab();
			}
		}*/
	}
	searchPageInfo = {...searchPageInfo,...newState};
	return {...state, ...{searchPageInfo:searchPageInfo}};
} 

