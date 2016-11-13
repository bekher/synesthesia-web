import React from 'react';

export default class Loading extends React.Component {
  render() {
    return (
      <div>
        <div className="loading-container">
            <div className="loading"></div>
            <div id="loading-text">loading</div>
        </div>

      </div>
    );
  }
}
