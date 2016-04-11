import { Link } from 'react-router';
import React, { PropTypes } from 'react';

export default class IndexPage extends React.Component {
  render() {
    return (
      <div className="uk-grid">
        <div className="uk-width-1-1 uk-row-first">
          
          <div className="uk-heading-large">Welcome to Synesthesia</div> 
          <div className="uk-text-large">See your music and hear your pictures. Transform your music by the pixel - try it out <a href='/app/#/upload'>here</a>!</div>
        </div>
        <div>


        </div>
      </div>
    );
  }
}
