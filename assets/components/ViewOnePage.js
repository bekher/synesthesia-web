// React
import React from 'react';

// constants
import Events from '../constants/SocketEvents'

// deps
import Wavesurfer from 'react-wavesurfer'

import Loading from './Loading'
//import CamanFrame from './CamanFrame'

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
    'maxWidth': '200%',
    height: 'auto',
    width: 'auto'
  },
  wave: {
    width: '220%',
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
      playingInput: false,
      playingInputIcon: "uk-icon-play",
      playingOutput: false,
      playingOutputIcon: "uk-icon-play",
      inputSongURL: null,
      inputImgURL: null,
      outputSongURL: null,
      outputImgURL: null
    };

    socket.on(Events.getOneSong, function(resp) {
      var song = resp.data || null;

      console.log(song);
      _this.setState({
        song : song,
        inputSongURL: '/inputs/audio/'+song.filename,
        outputSongURL: '/outputs/audio/'+song.filename+'.mp3',//'/outputs/audio/'+song.filename,
      });
    });

    
    //TODO: socket.on(Events.songUpdated(song.id), function(resp) {

    this.inputPlayButtonPressed = this.inputPlayButtonPressed.bind(this);
    this.outputPlayButtonPressed = this.outputPlayButtonPressed.bind(this);
    this.populate = this.populate.bind(this);

  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.song != null && prevState.song == null) {
      var song = this.state.song;

      this.inputWavesurfer = WaveSurfer.create({
        container: '#waveInput',
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

      this.inputWavesurfer.load(this.state.inputSongURL);
    } 
    if (this.state.song != null && this.state.song.completedTransform &&
       (! prevState.song || !prevState.song.completedTransform)) {
       var song = this.state.song
       this.outputWavesurfer = WaveSurfer.create({
        container: '#waveOutput',
        waveColor: '#4f66ff',
        progressColor: '#93499B',
        //scrollParent: true,
        fillParent: true,
        //minPxPerSec: 1.5,
        autoCenter: true,
        barWidth: 1.5,
        cursorWidth: 2,
        cursorColor: "#9B6880"
      });

      this.outputWavesurfer.load(this.state.outputSongURL);

    }
    if (this.state.playingInput != prevState.playingInput) {
      this.inputWavesurfer.playPause();
      if (this.state.playingInput) {
        this.setState({playingInputIcon : "uk-icon-pause"});
      } else {
        this.setState({playingInputIcon : "uk-icon-play"});
      }
    } 
    if (this.state.playingOutput != prevState.playingOutput) {
      this.outputWavesurfer.playPause();
      if (this.state.playingOutput) {
         this.setState({playingOutputIcon : "uk-icon-pause"});
      } else {
         this.setState({playingOutputIcon : "uk-icon-play"});
      }
    }
  }

  componentDidMount() {
    //ViewStore.listen(_this.onChange);
    socket.on(this.props.params.id, function(resp) {
      var song = resp.data || null;
      console.log("recv update for song");
      this.setState({
        song: song,
      });
    });

    this.populate();
  }
  componentWillUnmount() {
    //ViewStore.unlisten(this._onchange);
  }

  inputPlayButtonPressed() {
    this.setState({playingInput: !this.state.playingInput});
  }

  outputPlayButtonPressed() {
    this.setState({playingOutput: !this.state.playingOutput});
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

        { (! this.state.song.completedTransform) &&
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
        <div id="waveInput" style={css.wave}>
          <button onClick={this.inputPlayButtonPressed} className="button button--sacnite button--round-l button--inverted">
            <i className={"button__icon "+this.state.playingInputIcon}></i><span>Play</span></button>
          <div className="progress progress-striped active" id="progress-bar">
            <div className="progress-bar progress-bar-info"></div>
          </div>
        </div>
        {
          this.state.song.preprocessComplete &&
            <div>
              <br />
              <p>Image pre-transformation: </p>
              <a href={'/inputs/images/'+this.state.song.filename+'.png'}>
                <img src={'/inputs/images/'+this.state.song.filename+'.png'} style = {css.image}/>
              </a>
            </div>
        }
        {
          this.state.song.completedTransform ? 
            <div>
              <br />
              <h2> Synestized Output </h2>
              <h3>Transform: {this.state.song.transform}</h3>
               <div id="waveOutput" style={css.wave}>
                <button onClick={this.outputPlayButtonPressed} className="button button--sacnite button--round-l button--inverted">
                  <i className={"button__icon "+this.state.playingOutputIcon}></i><span>Play</span></button>
                <div className="progress progress-striped active" id="progress-bar">
                  <div className="progress-bar progress-bar-info"></div>
                </div>
               </div>
              <p> Image post-transformation </p>
              <a href={'/outputs/images/'+this.state.song.filename+'.png'}>
                <img src={'/outputs/images/'+this.state.song.filename+'.png'} style = {css.image}/>
              </a>
            </div>
              : 
                this.state.song.startedTransform ?
                  <div>
                    <br />
                    <p> Synestizing your image, this may take a while </p>
                    <Loading />
                  </div>
                    :
                    <p> <i>Synestize an image by applying a transform </i></p>
                
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
