
import React from 'react';
import Link from 'react-router/lib/Link';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';

import Welcome from "../app/Welcome";
import SearchView from "../search/SearchView";

const NoMatch = () => (<div className="text-center">
  <h3 className="text-danger">404: Page not found!</h3>
  <Link to="/">Back To Home</Link>
</div>);

const UnAuthorized = () => (<div className="text-center">
<br/><br/>
<h3 className="text-danger">Sorry you do not have entitlements</h3>
<Link to="/close">Exit</Link>
</div>);

const Close = () => (<div className="text-center">
<br/><br/>
<h3>Exiting Application...</h3>
</div>);

const requireAuth = function(nextState, replace, callback){
		replace('/');
		callback();
};

const exitApp = function(nextState, replace, callback){
	  window.close();
};

export default (
  <Route path="/" component={Welcome}>
    <Route path="/home" component={SearchView}/>
    <Route path="*" component={NoMatch} />
  </Route>
);