// React
import React from 'react';

// constants
import Events from '../constants/SocketEvents'

var css = {
  stickyplace: {
    height: '270px',
    margin: '0px'
  },
  sidepanel: {
    top: '35px',
    width: '173px'
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
      song : null
    };
    socket.on(Events.getOneSong, function(resp) {
      console.log('data'+resp.data);
      var song = resp.data || null;

      _this.setState({
        song : song
      });
    });
   
  }

  componentDidMount() {
    //ViewStore.listen(_this.onChange);

    this.populate();
  }
  componentWillUnmount() {
    //ViewStore.unlisten(this._onchange);
  }

  render() {
    return (
      <div className="uk-grid">
          { this.state.song ? 
            <div>
              <h2>Song info: {this.state.song.title}</h2>
              <h3>Artist: {this.state.song.artist}</h3>
              <h3>Album: {this.state.song.album}</h3>
              <div className='uk-width-medium-3-4 uk-row-first'>
                <p>Transform: {this.state.song.transform}</p>
                <p>Duration: {this.state.song.length}</p>
                <p>Format: {this.state.song.format}</p>
              </div>
              <div className="uk-width-medium-1-4">
                  { this.state.song.complete != true ?
                    <div>
                      <p>Original:</p>
                      <audio controls>
                        <source src={'/inputs/audio/'+this.state.song.filename} type="audio/mpeg" />
                        You browser does not support audio...
                      </audio>
                      <p>Input image:</p>
                      <img src={'input/images/'+this.state.song.filename+'.png'} />
                      <p>Output image:</p>
                      <img src={'output/images/'+this.state.song.filename+'.png'} />
                      <p>Transformed audio:</p>
                      <audio controls>
                        <source src={'/inputs/audio/'+this.state.song.filename + '.mp3'} type="audio/mpeg" />
                        You browser does not support audio...
                      </audio>
                    </div>
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
                      </ul>
                    </div>
                    </div>
                  }
              </div>
              <a href='/app/#/browse'>Back to browse</a>
            </div>
            : <div>
                <h2> Song not found :(</h2>
                <a href="/app/#/browse">Try browsing for songs that exist </a>
              </div>

          }
      </div>
      );
    }
  }
