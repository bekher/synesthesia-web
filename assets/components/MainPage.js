import React from 'react';
import { Link } from 'react-router';
import DocumentTitle from 'react-document-title';

import Header from './Header';

export default class is extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <DocumentTitle title='Synestesia'>
        <div className='MainPage'>
          <div className='uk-container uk-container-center uk-margin-top uk-margin-large-bottom'>
            <Header />
            { this.props.children }
            </div>
        </div>
      </DocumentTitle>
    );
  }
}
