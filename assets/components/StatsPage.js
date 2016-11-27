// React
import React from 'react';

// constants
import Events from '../constants/SocketEvents'

export default class StatsPage extends React.Component {
  populate() {
    socket.emit(Events.getAllSongs);
  }

  constructor() {
    super();
    var _this = this;

    this.state = {
      songs : []
    };

    socket.on(Events.getAllSongs, function(resp) {
      var songs = resp.data || [];

      _this.setState({
        songs : songs
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

  componentDidUpdate() {
    console.log("DID UPDATE");
  }

  componentWillUpdate() {
    console.log("WILL UPDATE");
  }

  render() {
    return (
      <div className="uk-grid">
      <script src="test.js"></script>
        <div className="uk-width-1-1 uk-row-first">
          <h2> Statistics </h2>
            {this.state.songs.map(function(song) {
              var date = new Date(song.created);
              var hours = date.getHours();
              var minutes = date.getMinutes();
              var ampm = hours >= 12 ? 'pm' : 'am';
              hours = hours % 12;
              hours = hours ? hours : 12; // the hour '0' should be '12'
              minutes = minutes < 10 ? '0'+minutes : minutes;
              var strTime = hours + ':' + minutes + ' ' + ampm;
              var dateFmt =  date.getDate() + '/' + date.getMonth() + '/' + (date.getYear() + 1900) +
                ' ' + strTime;
              /*
              return <tr key={song._id}>
                  <td>{song.transform}</td>
                  <td><a href={'/app/#/view/'+song.filename}>{song.title}</a></td>
                  <td>{song.artist}</td>
                  <td>{song.length}</td>
                  <td>{dateFmt}</td>
                  <td>{song.format}</td>
                </tr>
                */
              return <p>{song._id}</p>
            }) }
        </div>
      </div>
      );
    }
  }
