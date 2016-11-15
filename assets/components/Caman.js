import React from 'react';

export default class Caman extends React.Component {
  render() {
    return (
<div>
  <img
    id="example" 
    src="/images/example1_600.jpg"
    data-caman-hidpi="/images/example1_1200.jpg"
    /
  >

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
          value="0"
          data-filter="brightness"
        / >
        <span className="FilterValue">0</span>
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
