
import { FETCH_METHOD, POST_METHOD, GET_METHOD, FETCH_START, FETCH_END, FETCH_ERROR, NOTIFY_ERROR, NOTIFY_SUCCESS} from './Constants';

let now = Date.now();

export function fetchData(url, initObj = {}) {

	const { params, dispatch = (() => {}), showLoading, ..._initObj } = initObj;

	const fetchObj = {
			method: FETCH_METHOD,
			credentials: 'include',
			cache: 'no-cache',
			..._initObj
	};

	let fetchUrl = url;

	if ( fetchObj.method === POST_METHOD ) {
		if (typeof params === 'string') {
			fetchObj.body = params;
		} else {
			fetchObj.body = JSON.stringify(params || {});
		}
	} else if ( fetchObj.method === GET_METHOD ) {
		const _params = params || {};
		_params._ = now++;
		//fetchUrl = `${fetchUrl}?${$.param(_params)}`;
	}

	return fetch(fetchUrl, fetchObj)
	.then(res => {
		if (!res.ok) {
			return Promise.reject(res);
		}
		return res;
	})
};

export function fetchJSON(url, initObj = {}) {

	const { dispatch = (() => {}) } = initObj;

	const fetchObj = {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			...initObj
	};

	return fetchData(url, fetchObj)
	.then(res => {
		return res.json()
		.then(data => {
			if (data) {
				return data;
			}
			else {
				return Promise.reject(message);
			}
		})
		.catch(error => {
			return Promise.reject(error);
		});
	});
}

export function postData(url, data, options) {
	const postOpts = {
			...{
				body: JSON.stringify(data),
				mode: 'cors',
				redirect: 'follow',
				headers : {
					'content-type': 'application/json'
				}
			},
			...options,
			...{method:'POST'}
		};
	return fetch(url, postOpts);
}

export function putData(url, data, options) {
	const putOpts = {
			...{
				body: JSON.stringify(data),
				mode: 'cors',
				redirect: 'follow',
				headers : {
					'content-type': 'application/json'
				}
			},
			...options,
			...{method:'PUT'}
		};
	return fetch(url, putOpts);
}

export function deleteData(url, data, options) {
	const putOpts = {
			...{
				body: JSON.stringify(data),
				mode: 'cors',
				redirect: 'follow',
				headers : {
					'content-type': 'application/json'
				}
			},
			...options,
			...{method:'DELETE'}}
	return fetch(url, putOpts);
}
