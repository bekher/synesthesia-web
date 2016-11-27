import React, { PropTypes } from 'react';

var css = {
  text : {
    color: "#FFF7FF",
  }
}
export default class UploadErrorPage extends React.Component {
  render() {
    return (
      <div className="uk-grid" style={css.text}>
        <h2>Upload error: file not recognized</h2>
      </div>
    );
  }
}
