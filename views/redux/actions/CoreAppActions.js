import {INIT_APP_DATA, INIT_SEARCH_VIEW, FETCH_SCHEME_SEARCH_RESULTS} from '../../utils/ActionTypes';
import { POST_METHOD, GET_METHOD} from '../../utils/Constants';
import {fetchData, fetchJSON} from '../../utils/RestUtil';

export function getEntitledAppsDetails(appId) {
	return (dispatch, getState) => {
		var url = "/fields";
		debugger
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
				getEntitledAppsDetails(appId)
		).then((data) => { 
			dispatch({
				type: INIT_SEARCH_VIEW,
				payload: {data : data.data}
			})
		})
		.catch(error => {
			return Promise.reject(error);
		});
	}
}

export function submitSearch(showNextItem, searchFormData) {
	return (dispatch, getState) => {
		const url = '/angular/SchemeSearch.action';
		const searchData = {...searchFormData, ...{appId:getState().appData.appIdFromServer}};
		fetchData(url, GET_METHOD, { params:searchData, showLoading:true, headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}})
		.then(data =>  {
			return data.json().then(json => {
		          if (!data.ok) {
		              return Promise.reject(json);
		            }
			         dispatch({
					      type: FETCH_SCHEME_SEARCH_RESULTS,
					      payload: {data:json, showNextItem:showNextItem}
					 });
		          });
		});
	  };
}