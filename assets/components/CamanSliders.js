import React from 'react';

let css = {
  img : {
    width: "auto",
    height: "auto"
  }
};

export default class CamanFrame extends React.Component {

  
  constructor() {
    super();

    this.state = {
      imgPath: '',
      filters: {
        brightness: 0,
      }
    }
    this.sliderChanged = this.sliderChanged.bind(this);
    this.sliderChanging = this.sliderChanging.bind(this);
    this.transformFinished = this.transformFinished.bind(this);

    socket.on(Events.camanTransform, this.transformFinished);
  }

  componentDidMount() {
    socket.emit(Events.camanTransform, this.state.filters);
  }

  /* not actually needed unless path changes, could be used to update from server in future */
  componentDidUpdate(prevProps, prevState) {
    if (! prevState.imgPath && this.state.imgPath) {
    }
  }

  sliderChanged(sliderName) {
    // thunking hard
   return (e) => {
      
      // TODO: call caman render
      console.log("slider val changed " + this.state.brightness);
      this.renderCaman();
    }
  }
  sliderChanging(sliderName) {
    return (e) => {
      var newFilters = _.extend({}, this.state.filters);

      switch (sliderName) {
        case "brightness":
          newFilters.brightness = e.target.value
          break;
      }
      this.setState({
        filters: newFilters
      })

    }
  }

  render() {

    return (
      <div>
        <img
          id="example" 
          src={this.props.imgPath}
          style={css.img}
          data-camanwidth="100"
          data-camanheight="100"
          /
       

  <div id="Filters">
    <div className="Filter">
      <div className="FilterName">
        <p>brightness</p>
      </div>

      <div className="FilterSetting">
        <input
          type="range" 
          min="-100"
          max="100"
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
          min="-100"
          max="100"
          step="1"
          value="0"
          data-filter="contrast" /
        >
        <span className="FilterValue">0</span>
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
          value="0"
          data-filter="saturation" /
         >
        <span className="FilterValue">0</span>
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
          value="0"
          data-filter="vibrance" /
        >
        <span className="FilterValue">0</span>
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
          data-filter="exposure" /
        >
        <span className="FilterValue">0</span>
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
          value="0"
          data-filter="hue" /
        >
        <span className="FilterValue">0</span>
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
          value="0"
          data-filter="sepia" /
        >
        <span className="FilterValue">0</span>
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
          value="0"
          data-filter="gamma" /
        >
        <span className="FilterValue">0</span>
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
          value="0"
          data-filter="noise" /
        >
        <span className="FilterValue">0</span>
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
          value="0"
          data-filter="clip" /
        >
        <span className="FilterValue">0</span>
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
          value="0"
          data-filter="sharpen" /
        >
        <span className="FilterValue">0</span>
      </div>
    </div>
  
    <div className="Filter">
      <div className="FilterName">
        <p>stackBlur</p>
      </div>

      <div className="FilterSetting">
        <input
          type="range" 
          min="0"
          max="20"
          step="1"
          value="0"
          data-filter="stackBlur" /
        >
        <span className="FilterValue">0</span>
      </div>
    </div>
  

  <div className="Clear"></div>
  </div>
  </div>

    );
  }
}
