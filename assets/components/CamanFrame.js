import React from 'react';

let css = {
    img : { 
      width: "auto",
      height: "auto"
    },
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
    this.startCaman = this.startCaman.bind(this);
    this.sliderChanged = this.sliderChanged.bind(this);
    this.sliderChanging = this.sliderChanging.bind(this);
    this.renderCaman = this.renderCaman.bind(this);
    this.caman = null;
  }

  componentDidMount() {
    this.startCaman();
  }

  /* not actually needed unless path changes, could be used to update from server in future */
  componentDidUpdate(prevProps, prevState) {
    if (! prevState.imgPath && this.state.imgPath) {
      this.startCaman();
    }
  }

  startCaman() {
		var busy, changed, filters, presetBusy, presetCaman, render, renderPreset,
			__hasProp = {}.hasOwnProperty;
    
    this.setState ({
      imgPath: this.props.imgPath,
    });


		filters = {};

		busy = false;

		changed = false;

		this.caman = Caman('#example', function() {
      this.resize({
        width: 100,
        height: 100
      });
    });

    /*
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
        console.log(filter);
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
  */
  }

  renderCaman() {
    this.camanBusy = false;
    var _this = this;
    var _render = () => {
      if (! _this.camanBusy && _this.caman) {
        console.log('start render');
        let filters = _this.state.filters;
        _this.camanBusy = true;
        for (var filter in filters) {
          console.log(filter);
          if (filters.hasOwnProperty(filter)) {
            let val = filters[filter];
            console.log(parseFloat(val));
            _this.caman[filter](val);
          }
        }
        return _this.caman.render(function() {
          console.log("finished rendering");
          _this.camanBusy = false; 
        });
      }
    };
    return _render();
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
