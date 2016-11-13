import { Link } from 'react-router';
import React, { PropTypes } from 'react';

let css = {
  progressBar: {
    width: '0%'
  }
};

import $ from 'jquery';

export default class UploadPage extends React.Component {

  componentDidMount() {
    var progressbar = $("#progressbar");
    var bar         = progressbar.find('.uk-progress-bar');
    var settings    = {

      action: '/upload', // upload url

      allow : '*.(mp3)', // allow only images

      loadstart: function() {
        bar.css("width", "0%").text("0%");
        progressbar.removeClass("uk-hidden");
      },

      progress: function(percent) {
        percent = Math.ceil(percent);
        bar.css("width", percent+"%").text(percent+"%");
      },

      allcomplete: function(response) {

        bar.css("width", "100%").css("color", "#fff").text("100%, processing... please wait");

        setTimeout(function(){
          progressbar.addClass("uk-hidden");
          window.location.replace("/#/browse");
        }, 2500);
      }
    };

    var select = UIkit.uploadSelect($("#upload-select"), settings);
    var drop   = UIkit.uploadDrop($("#upload-drop"), settings);

  }

  render() {
    return (
      <div id="upload-drop" className="uk-grid" style={ {height: "1000 px"}}>
        <div className="uk-width-1-1 uk-row-first">
          <p> Upload mp3</p> 
          <form className="uk-form">
          <input type="text" />
          <p></p>
          <div className="uk-placeholder">
            <h4>Drag an audio file here</h4><a className="uk-form-file"><br/><br/><input id="upload-select" type="file" /></a>
          </div>
          <div id="progressbar" className="uk-progress uk-hidden">
            <div className="uk-progress-bar" style={css.progressBar}>...</div>
          </div>
          </form>
        </div>
      </div>
    );
  }
}
