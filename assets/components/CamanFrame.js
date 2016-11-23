import React from 'react';

let css = {
    img : { 
      maxWidth: "200%",
      width: "auto",
      height: "auto"
    },
  };

export default class CamanFrame extends React.Component {

  
  constructor() {
    super();

    this.state = {
      imgPath: '',
      //imgPath: this.props.params.imgPath,
    }
  }

    componentDidMount() {
    console.log( this.props.imgPath);
    this.state = {
      imgPath: this.props.imgPath,
    }
		var busy, caman, changed, filters, presetBusy, presetCaman, render, renderPreset,
			__hasProp = {}.hasOwnProperty;

		caman = null;

		presetCaman = null;

		filters = {};

		busy = false;

		changed = false;

		caman = Caman('#example');

		render = _.throttle(function() {
			var filter, value;
			if (busy) {
				changed = true;
				return;
			} else {
				changed = false;
			}
			busy = true;
			caman.revert(false);
			for (filter in filters) {
				if (!__hasProp.call(filters, filter)) continue;
				value = filters[filter];
				value = parseFloat(value, 10);
				if (value === 0) {
					continue;
				}
				caman[filter](value);
			}
			return caman.render(function() {
				busy = false;
				if (changed) {
					return render();
				}
			});
		}, 300);

    $('.FilserSetting input').each(function() {
      var filter;
      filter = $(this).data('filter');
      return filters[filter] = $(this).val();
    });
	$('#Filters').on('change', '.FilterSetting input', function() {
    console.log('here');
      var filter, value;
      filter = $(this).data('filter');
      value = $(this).val();
      filters[filter] = value;
      $(this).find('~ .FilterValue').html(value);
      return render();
    });
  }

  render() {
    return (
<div>
  <img
    id="example" 
    src={this.props.imgPath}
    style={css.img}
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
