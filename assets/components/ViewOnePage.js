// React
import React from 'react';

// constants
import Events from '../constants/SocketEvents'

// deps
//import Wavesurfer from 'react-wavesurfer'

import Loading from './Loading'
import CamanSliders from './CamanSliders'
import OverlayUpload from './OverlayUpload'

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
    'maxWidth': '150%',
    height: 'auto',
    width: 'auto',
  },
  inline: {
    display: 'inline-block',
    position: 'absolute',
  },
  title: {
    paddingTop: '15px'
  },
  albumArt: {
    paddingRight: '20px',
    maxWidth: '150px',
    height: 'auto'
  },
  wave: {
    //width: '220%',
    width: '150%'
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

    this.inputPlayButtonPressed = this.inputPlayButtonPressed.bind(this);
    this.outputPlayButtonPressed = this.outputPlayButtonPressed.bind(this);
    this.populate = this.populate.bind(this);
    this.songUpdateBroadcast = this.songUpdateBroadcast.bind(this);
    this.curSongUpdated = this.curSongUpdated.bind(this);
    this.outputAudioUpdated = this.outputAudioUpdated.bind(this);
  }

  makeOutputWavesurfer() {
     return  WaveSurfer.create({
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
       this.outputWavesurfer = this.makeOutputWavesurfer();
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

  songUpdateBroadcast(resp) {
    var song = resp.data || null;
    console.log("recv update for song");
    console.log(song);
    this.setState({
      song: song,
    });
  }

  curSongUpdated(resp) {
    var song = resp.data || null;
    this.setState({
      song : song,
      inputSongURL: '/inputs/audio/'+song.filename,
      outputSongURL: '/outputs/audio/'+song.filename+'.mp3',//'/outputs/audio/'+song.filename,
    });
  }

  outputAudioUpdated(resp) {
    if (this.state && this.state.song) {
      if (resp.data == this.state.song.filename) {
        this.setState({playingOutput: false});
        this.outputWavesurfer.destroy();
        this.outputWavesurfer = this.makeOutputWavesurfer();
        this.outputWavesurfer.load(this.state.outputSongURL);
      }
    }
  }

  componentDidMount() {
    socket.on(this.props.params.id, this.songUpdateBroadcast);
    socket.on(Events.getOneSong, this.curSongUpdated);
    socket.on(Events.camanToAudio, this.outputAudioUpdated);

    this.populate();
  }

  componentWillUnmount() {
    socket.removeListener(this.props.params.id, this.songUpdateBroadcast);
    socket.removeListener(Events.getOneSong, this.curSongUpdated);
    socket.removeListener(Events.camanToAudio, this.outputAudioUpdated);
    this.setState({playingInput: false});
    this.setState({playingOutput: false});
    if (this.inputWavesurfer) 
      this.inputWavesurfer.destroy();
    if (this.outputWavesurfer)
      this.outputWavesurfer.destroy();
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
        <br />
         <div>
          { this.state.song.hasAlbumArt ?
            <div>
              <img src={this.state.song.albumArtPath} style = {css.albumArt}/>
              <div style={css.inline}>
                <h1 style={css.title}>{this.state.song.title}</h1>
                <h3 >{this.state.song.artist} | {this.state.song.album} | {this.state.song.length+" "} 
                   | {this.state.song.format} </h3>
              </div>
           </div>
           :
           <div>
                <h1>{this.state.song.title}</h1>
                <h3 >{this.state.song.artist} | {this.state.song.album} | {this.state.song.length+" "} 
                   | {this.state.song.format} </h3>


           </div>
          }
        </div>

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
                {
                  //<li><a href={'/transform/'+this.state.song.filename+'/extend'} >Extend</a></li>
                  //<li><a href={'/transform/'+this.state.song.filename+'/pitch'} >Pitch</a></li>
                }
                <li><a href={'/transform/'+this.state.song.filename+'/redshift'} >Red Shift</a></li>
                <li><a href={'/transform/'+this.state.song.filename+'/blueshift'} >Blue Shift</a></li>
                <li><a href={'/transform/'+this.state.song.filename+'/greenshift'} >Green Shift</a></li>
                <li><a href={'/transform/'+this.state.song.filename+'/passthrough'} >Passthrough</a></li>
                </ul>
                </div>
                </div>
          }
        }

        <div className='uk-width-1-2'>
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
              {
              /*<a href={'/outputs/images/'+this.state.song.filename+'.png'}>
                <img src={'/outputs/images/'+this.state.song.filename+'.png'} style = {css.image}/>
              </a>
              */
              }
              <CamanSliders imgPath={'/outputs/images/'+this.state.song.filename+'.png'} imgId={this.props.params.id} />
              <p> Try the overlay transform: </p>
              <OverlayUpload imgId={this.props.params.id}/>
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
            {//<h2> Song not found 😞</h2>
            }
            <h2> ♫ Loading song ♫  </h2>
            <a href="/app/#/browse">Back to browse</a>
              </div>

      }
      </div>
    );
  }
}
