import React, { PropTypes } from 'react';

import $ from 'jquery';
let css = {
  progressBar: {
    width: '0%',
    color: '#fff',
  },
  container: {
    height: "500px",
    position: "relative",
    marginLeft: "35px",
    width: "95%",
    background: "gray",
  }
}

export default class OverlayUpload extends React.Component {

  componentDidMount() {
    var progressbar = $("#progressbar");
    var bar         = progressbar.find('.uk-progress-bar');
    var settings    = {

      action: '/transformImg/'+this.props.imgId, // upload url

      allow : '*.(png|jpg|jpeg)', // allow only images

      loadstart: function() {
        bar.css("width", "0%").css("color", "#fff").text("0%");
        progressbar.removeClass("uk-hidden");
      },

      progress: function(percent) {
        percent = Math.ceil(percent);
        bar.css("width", percent+"%").css("color", "#fff").text(percent+"%");
        if (percent == 100) {
          $("#uploadComplete").text("Upload complete.");
        }
      },

      allcomplete: function(response) {

        bar.css("width", "100%").css("color", "#fff").text("100%, processing... please wait");

        setTimeout(function(){
          progressbar.addClass("uk-hidden");
        }, 1000);
      }
    };

    var drop   = UIkit.uploadDrop($("#upload-drop"), settings);

  }

  render() {
    return (
      <div id="upload-drop" className="uk-grid" >
        <div className="uk-width-1-1 " style={css.container}>
          <br />
          <div className="uk-placeholder">
            <h3>Drag an image to overlay here</h3>
          </div>
          <div id="progressbar" className="uk-progress uk-hidden">
            <div className="uk-progress-bar" style={css.progressBar}>...</div>
          </div>
          <h2 id="uploadComplete"></h2>
        </div>
        <br />
      </div>
    );
  }
}
