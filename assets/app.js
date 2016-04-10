import React from 'react';
import ReactDOM from 'react-dom';
import { Router, IndexRoute, Route } from 'react-router';
import createHashHistory from 'history/lib/createHashHistory';
import { MainPage, IndexPage, BrowsePage, UploadPage } from './components';

ReactDOM.render(
  <Router history={createHashHistory({ queryKey: false })}>
    <Route path='/' component={MainPage}>
      <Route path='upload' component={UploadPage} />
      <Route path='browse' component={BrowsePage} />
      <IndexRoute name= '/' component={IndexPage} />
    </Route>

  </Router>,
  document.getElementById('app-container')
);
