import { Link } from 'react-router';
import React, { PropTypes } from 'react';

export default class IndexPage extends React.Component {
  render() {
    return (
      <div className="uk-grid">
        <div className="uk-width-1-1 uk-row-first">
          <div className="uk-heading-large">Machine learning for all senses</div> 
          <div className="uk-text-large">Transform your music</div>
        </div>
        <div className="uk-grid">
          <div className="uk-width-medium-1-4 row-first">
            Elements go here
          </div>
          <div className="uk-width-medium-3-4">
            <h2>Music-to-image transform</h2>
            <p>Put some text here</p>
          </div>
        </div>
      </div>
    );
  }
}
