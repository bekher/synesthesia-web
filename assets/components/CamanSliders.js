import React from 'react';

// constants
import Events from '../constants/SocketEvents'

let css = {
  img : {
    maxWidth: '150%',
    width: 'auto',
    height: 'auto'
  }
};

export default class CamanSliders extends React.Component {

  
  makeInitialFilterState() {
    return {
         brightness: 0,
        contrast: 0,
        saturation: 0,
        vibrance: 0,
        exposure: 0,
        hue: 0,
        sepia: 0,
        gamma: 0,
        noise: 0,
        clip: 0,
        sharpen: 0
    }

  }

  constructor() {
    super();

    this.state = {
      imgPath: '',
      id: '',
      filters: this.makeInitialFilterState(),
      waitingForFeedback: false,
      recvdFeedback: false,
    }
    this.sliderChanged = this.sliderChanged.bind(this);
    this.sliderChanging = this.sliderChanging.bind(this);
    this.transformFinished = this.transformFinished.bind(this);
    this.updateAudioButtonPressed = this.updateAudioButtonPressed.bind(this);
  }

  componentWillUnmount() {
    socket.removeListener(Events.camanTransform, this.transformFinished);
    socket.removeListener(props.imgId, this.imgRefresh);
  }

  componentDidMount() {
    socket.on(Events.camanTransform, this.transformFinished);
    socket.on(this.props.imgId, this.imgRefresh);
  }

  componentWillReceiveProps(nextProps) {
  }

  /* not actually needed unless path changes, could be used to update from server in future */
  componentDidUpdate(prevProps, prevState) {
 
    if (! prevState.imgPath && this.state.imgPath) {

    }

  }

  imgRefresh() {
      // reload img
      // cachebreaking is genius
    $("#outputImg").attr("src", ""+$("#outputImg").attr("src")+"?" + new Date().getTime());
  }

  transformFinished(resp) {
    if (! resp.error) {
        this.setState({waitingForFeedback : false, recvdFeedback: true, filters: this.makeInitialFilterState() });
      this.imgRefresh();
    }
  }

  sliderChanged(sliderName) {
    // thunking hard
   return (e) => {
      
      if (! this.state.waitingForFeedback) {
        socket.emit(Events.camanTransform, {
          id: this.props.imgId,
          filters: this.state.filters
        });
        console.log("Emmitting stuff " + this.props.imgId)
      }
      this.setState({waitingForFeedback: true});

      }
  }

  sliderChanging(sliderName) {
    return (e) => {
      console.log(sliderName + ' ' + e.target.value);
      var newFilters = _.extend({}, this.state.filters);

      newFilters[sliderName] = e.target.value
      this.setState({
        filters: newFilters
      })

    }
  }

  updateAudioButtonPressed() {
    socket.emit(Events.camanToAudio, {
      id: this.props.imgId,
    });
  }

  render() {

    return (
      <div>
        <img
          id="outputImg" 
          src={this.props.imgPath}
          style={css.img}
          data-camanwidth="100"
          data-camanheight="100"
        / >
       
        {
          this.state.recvdFeedback &&
            <p>You transform is now visible! 
              <br />Done transforming the image? 
              <br />
              <a href="JavaScript:void(0)" onClick={this.updateAudioButtonPressed}>
                Click here to transform the audio
              </a>
            </p>
        }
  <div id="Filters">
    <div className="Filter">
      <div className="FilterName">
        <p>brightness</p>
      </div>

      <div className="FilterSetting">
        <input
          type="range" 
          min="-50"
          max="50"
          step="1"
          value={this.state.filters.brightness}
          onChange={this.sliderChanging('brightness')}
          onMouseUp={this.sliderChanged('brightness')}
          data-filter="brightness"
        / >
        <span className="FilterValue">{this.state.filters.brightness}</span>
      </div>
    </div>
  
    <div className="Filter">
      <div className="FilterName">
        <p>contrast</p>
      </div>

      <div className="FilterSetting">
        <input
          type="range" 
          min="-50"
          max="50"
          step="1"
          value={this.state.filters.contrast}
          onChange={this.sliderChanging('contrast')}
          onMouseUp={this.sliderChanged('contrast')}
          data-filter="contrast" /
        >
        <span className="FilterValue">{this.state.filters.contrast}</span>
      </div>
    </div>
  
    <div className="Filter">
      <div className="FilterName">
        <p>saturation</p>
      </div>

      <div className="FilterSetting">
        <input
          type="range" 
          min="-100"
          max="100"
          step="1"
          value={this.state.filters.saturation}
          onChange={this.sliderChanging('saturation')}
          onMouseUp={this.sliderChanged('saturation')}
          data-filter="saturation" /
         >
        <span className="FilterValue">{this.state.filters.saturation}</span>
      </div>
    </div>
  
    <div className="Filter">
      <div className="FilterName">
        <p>vibrance</p>
      </div>

      <div className="FilterSetting">
        <input
          type="range" 
          min="-100"
          max="100"
          step="1"
          value={this.state.filters.vibrance}
          onChange={this.sliderChanging('vibrance')}
          onMouseUp={this.sliderChanged('vibrance')}
          data-filter="vibrance" /
        >
        <span className="FilterValue">{this.state.filters.vibrance}</span>
      </div>
    </div>
  
    <div className="Filter">
      <div className="FilterName">
        <p>exposure</p>
      </div>

      <div className="FilterSetting">
        <input
          type="range" 
          min="-100"
          max="100"
          step="1"
          value="0"
          value={this.state.filters.exposure}
          onChange={this.sliderChanging('exposure')}
          onMouseUp={this.sliderChanged('exposure')}
          data-filter="exposure" /
        >
        <span className="FilterValue">{this.state.filters.exposure}</span>
      </div>
    </div>
  
    <div className="Filter">
      <div className="FilterName">
        <p>hue</p>
      </div>

      <div className="FilterSetting">
        <input
          type="range" 
          min="0"
          max="100"
          step="1"
          value={this.state.filters.hue}
          onChange={this.sliderChanging('hue')}
          onMouseUp={this.sliderChanged('hue')}
          data-filter="hue" /
        >
        <span className="FilterValue">{this.state.filters.hue}</span>
      </div>
    </div>
  
    <div className="Filter">
      <div className="FilterName">
        <p>sepia</p>
      </div>

      <div className="FilterSetting">
        <input
          type="range" 
          min="0"
          max="100"
          step="1"
          value={this.state.filters.sepia}
          onChange={this.sliderChanging('sepia')}
          onMouseUp={this.sliderChanged('sepia')}
          data-filter="sepia" /
        >
        <span className="FilterValue">{this.state.filters.sepia}</span>
      </div>
    </div>
  
    <div className="Filter">
      <div className="FilterName">
        <p>gamma</p>
      </div>

      <div className="FilterSetting">
        <input
          type="range" 
          min="0"
          max="10"
          step="0.1"
          value={this.state.filters.gamma}
          onChange={this.sliderChanging('gamma')}
          onMouseUp={this.sliderChanged('gamma')}
          data-filter="gamma" /
        >
        <span className="FilterValue">{this.state.filters.gamma}</span>
      </div>
    </div>
  
    <div className="Filter">
      <div className="FilterName">
        <p>noise</p>
      </div>

      <div className="FilterSetting">
        <input
          type="range" 
          min="0"
          max="100"
          step="1"
          value={this.state.filters.noise}
          onChange={this.sliderChanging('noise')}
          onMouseUp={this.sliderChanged('noise')}
          data-filter="noise" /
        >
        <span className="FilterValue">{this.state.filters.noise}</span>
      </div>
    </div>
  
    <div className="Filter">
      <div className="FilterName">
        <p>clip</p>
      </div>

      <div className="FilterSetting">
        <input
          type="range" 
          min="0"
          max="100"
          step="1"
          value={this.state.filters.clip}
          onChange={this.sliderChanging('clip')}
          onMouseUp={this.sliderChanged('clip')}
          data-filter="clip" /
        >
        <span className="FilterValue">{this.state.filters.clip}</span>
      </div>
    </div>
  
    <div className="Filter">
      <div className="FilterName">
        <p>sharpen</p>
      </div>

      <div className="FilterSetting">
        <input
          type="range" 
          min="0"
          max="100"
          step="1"
          value={this.state.filters.sharpen}
          onChange={this.sliderChanging('sharpen')}
          onMouseUp={this.sliderChanged('sharpen')}
          data-filter="sharpen" /
        >
        <span className="FilterValue">{this.state.filters.sharpen}</span>
      </div>
    </div>
  

  <div className="Clear"></div>
  </div>
  </div>

    );
  }
}
