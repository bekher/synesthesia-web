// React
import React from 'react';

// constants
import Events from '../constants/SocketEvents'

// deps
import Wavesurfer from 'react-wavesurfer'

import Loading from './Loading'
import Caman from './Caman'

var css = {
  stickyplace: {
    height: '270px',
    margin: '0px'
  },
  sidepanel: {
    top: '35px',
    width: '173px'
  },
  image: {
    'max-width': '100%',
    height: 'auto',
    width: 'auto'
  },
  wave: {
    width: '800px',
  }

};

export default class ViewOnPage extends React.Component {

  populate() {
    socket.emit(Events.getOneSong, this.props.params.id);
  }

  constructor() {
    super();
    var _this = this;

    this.state = {
      song : null,
      playing: false,
      playicon: "uk-icon-play"
    };

    socket.on(Events.getOneSong, function(resp) {
      var song = resp.data || null;

      console.log(song);
      _this.setState({
        song : song
      });
    });

    this.playButtonPressed = this.playButtonPressed.bind(this);

  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.song != null && prevState.song == null) {
      var song = this.state.song;

      this.wavesurfer = WaveSurfer.create({
        container: '#wave',
        waveColor: 'violet',
        progressColor: '#93499B',
        //scrollParent: true,
        fillParent: true,
        //minPxPerSec: 1.5,
        autoCenter: true,
        barWidth: 1.5,
        cursorWidth: 2,
        cursorColor: "#9B6880"
      });

      this.wavesurfer.load('/inputs/audio/'+song.filename);
      console.log('/inputs/audio/'+song.filename);
    }
    if (this.state.playing != prevState.playing) {
      this.wavesurfer.playPause();
      if (this.state.playing) {
        this.setState({playicon : "uk-icon-pause"});
      } else {
        this.setState({playicon : "uk-icon-play"});
      }
}
  }

  componentDidMount() {
    //ViewStore.listen(_this.onChange);

    this.populate();
  }
  componentWillUnmount() {
    //ViewStore.unlisten(this._onchange);
  }

  playButtonPressed() {
    this.setState({playing: !this.state.playing});
  }

  render() {
    return (
      <div>
      { this.state.song ? 
        <div>
        <h1>{this.state.song.title}</h1>
        <h3>{this.state.song.artist} | {this.state.song.album} | {this.state.song.length+" "} 
             | {this.state.song.format} </h3>

				<div className="uk-grid">

        { this.state.song.completedTransform ? <span />
              :
                <div className="uk-sticky-placeholder" style={css.stickyplace}>
                <div className='uk-panel uk-panel-box uk-active' style={css.sidepanel} data-uk-sticky="top{:35}">
                <ul className="uk-nav uk-side-nav">
                <li className="uk-nav-header">Apply a trnasform</li>
                <li><a href={'/transform/'+this.state.song.filename+'/metallic'} >Metallic</a></li>
                <li><a href={'/transform/'+this.state.song.filename+'/reverse'} >Reverse</a></li>
                <li><a href={'/transform/'+this.state.song.filename+'/shuffle'} >Shuffle</a></li>
                <li><a href={'/transform/'+this.state.song.filename+'/decay'} >Decay</a></li>
                <li><a href={'/transform/'+this.state.song.filename+'/speed'} >Speed</a></li>
                <li><a href={'/transform/'+this.state.song.filename+'/extend'} >Extend</a></li>
                <li><a href={'/transform/'+this.state.song.filename+'/pitch'} >Pitch</a></li>
                <li><a href={'/transform/'+this.state.song.filename+'/redshift'} >Red Shift</a></li>
                <li><a href={'/transform/'+this.state.song.filename+'/blueshift'} >Blue Shift</a></li>
                <li><a href={'/transform/'+this.state.song.filename+'/greenshift'} >Green Shift</a></li>
                <li><a href={'/transform/'+this.state.song.filename+'/dream'} >Google Deep Dream</a></li>
                </ul>
                </div>
                </div>
          }
        }

        <div className='uk-width-1-3'>
        <br />
        <h2>Original </h2>
        <div id="wave" style={css.wave}>
        <button onClick={this.playButtonPressed} className="button button--sacnite button--round-l button--inverted">
          <i className={"button__icon "+this.state.playicon}></i><span>Play</span></button>
          <div className="progress progress-striped active" id="progress-bar">
            <div className="progress-bar progress-bar-info"></div>
          </div>
        </div>
        {
          this.state.song.completedTransform ? 
            <div>
              <p>Output image:</p>
              <img src={'/outputs/images/'+this.state.song.filename+'.png'} style = {css.image}/>
              <p>Transformed audio (This may take a while):</p>
              <p>Transform: {this.state.song.transform}</p>
                <audio controls>
              <source src={'/outputs/audio/'+this.state.song.filename + '.mp3'} type="audio/mpeg" />
              You browser does not support audio...
                </audio>
              <Caman />
            </div>
              : 
                this.state.song.startedTransform ?
                  <Loading />
                    :
                  <p>Select a transform</p>
                
        }

            </div>
          </div>
        <a href='/app/#/browse'>Back to browse</a>
          </div>
            : <div>
            <h2> Song not found 😞</h2>
            <a href="/app/#/browse">Try browsing for songs that exist </a>
              </div>

      }
      </div>
    );
  }
}
