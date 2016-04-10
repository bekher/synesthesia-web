import { Link } from 'react-router';
import React, { PropTypes } from 'react';

export default class IndexPage extends React.Component {
  render() {
    return (
      <div className="uk-grid">
        <div className="uk-width-1-1 uk-row-first">
          <div className="uk-heading-large">Machine learning for all senses</div> 
          <div className="uk-text-large">Transform your music, <a href='/app/#/upload'>head here to try it out</a></div>
        </div>
        <div>


        </div>
      </div>
    );
  }
}
