
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import appData from './reducers/CoreAppData';

export default combineReducers({
	appData,
	routing: routerReducer
});
