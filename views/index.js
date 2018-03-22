import './styles/styles.less';
import React, { Component, PropTypes } from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Router from 'react-router/lib/Router';
import browserHistory from 'react-router/lib/browserHistory';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from './redux/configureStore';
import routes from './routes';
import {IntlProvider} from 'react-intl';

const initialState = { routing: {}, appData:{}};

@DragDropContext(HTML5Backend)
class AppView extends Component {

 render() {
    const { store, history} = this.props;
	return (
			<IntlProvider locale='en'>
				<Provider store={store}>
					<Router history={history} routes={routes} />
				</Provider>
			</IntlProvider>
	);
  }
}

AppView.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

class DefaultDataView extends Component {
	
	constructor(props) {
		super(props);
	}
	
	render() {
		return (
		 <AppView store={this.props.store} history={this.props.history}/>	
		)
	}
}

DefaultDataView.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

const store = configureStore(initialState);
const history = syncHistoryWithStore(browserHistory, store);

render(
		<DefaultDataView store={store} history={history}/>,
		document.getElementById('app')
);

//export default DefaultDataView;
