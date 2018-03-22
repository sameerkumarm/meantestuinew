import {INIT_APP_DATA, INIT_SEARCH_VIEW,UPDATE_SEARCH_VIEW_FIELD_VALUE, 
		FETCH_SCHEME_SEARCH_RESULTS, INIT_DETAILS_VIEW, DISPLAY_SUCCESS_MESSAGE, DISPLAY_FAILURE_MESSAGE} from '../../utils/ActionTypes';
import { POST_METHOD, GET_METHOD} from '../../utils/Constants';
import {fetchData, fetchJSON, postData, putData, deleteData} from '../../utils/RestUtil';

export function getEntitledAppsDetails(appId) {
	return (dispatch, getState) => {
		var url = "/fields";
		return fetchJSON( url , GET_METHOD, { params:{}, showLoading:true })
		.then(response => {
			return {data: response};
		})
		.catch(error => {
			return Promise.reject(error);
		});
	}
	//return $http.post(url + "?version=angular&appId=" + appId);
};

export function initializeApp(appId) {
	return function (dispatch, getState) {
		return dispatch(
				getEntitledAppsDetails()
		).then((data) => {
			return putData('http://192.168.99.100:31007/api/fetchAll', {})
			.then(searchResults =>  {
				if(searchResults.ok){
					searchResults.json().then(recordJsonData => {
						return dispatch({
							type: INIT_SEARCH_VIEW,
							payload: {data : data.data, searchResults:recordJsonData.ssis}
						})
					});
				}
				else {
					return Promise.reject("Failed Search operation");
				}
			})	
		})
		.catch(error => {
			return Promise.reject(error);
		});
	}
}

export function submitSearch(searchFormData) {
	return (dispatch, getState) => {
		let url = 'http://192.168.99.100:31007/api/fetchAll';
		const searchData = {...searchFormData};
		putData(url, searchData)
		.then(searchResults =>  {
			if(searchResults.ok){
				searchResults.json().then(recordJsonData => {
					return dispatch({
						type: FETCH_SCHEME_SEARCH_RESULTS,
						payload: {searchResults:recordJsonData.ssis, searchData:searchData}
					});
				});
			}
			else {
				return Promise.reject("Failed Search operation");
			}
		})
		.catch(error => {
			return Promise.reject(error);
		});
	};
}

export function fetchRecordDetails(mode, recordId) {
	return function (dispatch, getState) {
		if((mode == 'edit' || mode=='view') && recordId) {
			fetchJSON("http://192.168.99.100:31007/api/fetch/"+recordId, GET_METHOD, {})
			.then(recordData =>  {
				dispatch({
					type: INIT_DETAILS_VIEW,
					payload: {fields: recordData.fields, data : recordData.data}
				})
			}).catch(error => {
				return Promise.reject(error);
			});
		}
		else{
			dispatch(
					getEntitledAppsDetails()
			).then((data) => {
				dispatch({
					type: INIT_DETAILS_VIEW,
					payload: {data : data.data}
				})
			})
			.catch(error => {
				return Promise.reject(error);
			});
		}
	}
}

export function deleteRecord(recordId) {
	return function (dispatch, getState) {
		const {appData} = getState();
		const {searchPageInfo} = appData;
		const {searchData} = searchPageInfo;
		if(recordId) {
			deleteData("http://192.168.99.100:31006/api/del/"+recordId)
			.then(recordData =>  {
				if(recordData.ok){
					recordData.json().then(recordJsonData => {
						dispatch({
							type: DISPLAY_SUCCESS_MESSAGE,
							payload: {data : {screenType:'searchView',success:recordJsonData.success, message:recordJsonData.message, closeDetails:true}}
						});
						/*dispatch(
							submitSearch(searchData)
						);*/
					});
				}
				else {
					return Promise.reject("Failed Delete operation");
				}
			}).catch(error => {
				dispatch({
					type: DISPLAY_FAILURE_MESSAGE,
					payload: {data : {screenType:'dataView',success:false, message:"Failed Delete operation", closeDetails:false}}
				})
			});
		}
	}
}

export function saveRecord(mode, record) {
	return function (dispatch, getState) {
		const {appData} = getState();
		const {searchPageInfo} = appData;
		const {searchData} = searchPageInfo;
		if(mode == 'edit') {
			putData("http://192.168.99.100:31005/api/update/", record)
			.then(recordData =>  {
				if(recordData.ok){
					recordData.json().then(recordJsonData => {
						dispatch({
							type: DISPLAY_SUCCESS_MESSAGE,
							payload: {data : {screenType:'searchView',success:recordJsonData.success, message:recordJsonData.message, closeDetails:true}}
						});
					});
				}
				else {
					return Promise.reject("Failed Update operation");
				}
			}).catch(error => {
				dispatch({
					type: DISPLAY_FAILURE_MESSAGE,
					payload: {data : {screenType:'dataView',success:false, message:"Failed Update operation", closeDetails:false}}
				})
			});
		}
		else{
			postData("http://192.168.99.100:31002/api/add/", record).then((recordData) => {
				if(recordData.ok){
					recordData.json().then(recordJsonData => {
						dispatch({
							type: DISPLAY_SUCCESS_MESSAGE,
							payload: {data : {screenType:'searchView',success:recordJsonData.success, message:recordJsonData.message, closeDetails:true}}
						});
						/*dispatch(
								submitSearch(searchData)
							);*/
					});
				}
				else {
					return Promise.reject("Failed Save operation");
				}
			})
			.catch(error => {
				dispatch({
					type: DISPLAY_FAILURE_MESSAGE,
					payload: {data : {screenType:'dataView',success:false, message:"Failed Save operation", closeDetails:false}}
				})
			});
		}
	}
}