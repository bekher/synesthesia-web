import { Link } from 'react-router';
import React, { PropTypes } from 'react';
import UploadPage from './UploadPage'

var css = {
  text : {
    color: "#FFF7FF",
  }
}
export default class IndexPage extends React.Component {
  render() {
    return (
      <div className="uk-grid" style={css.text}>
        <div className="uk-width-1-1 uk-row-first">
          
          <div className="uk-heading-large">Welcome to Synesthesia</div> 
          <div className="uk-text-large">See your music and hear your pictures. Transform your music by the pixel.</div>
          <br />
          <UploadPage />
        </div>
        <div>


        </div>
      </div>
    );
  }
}
