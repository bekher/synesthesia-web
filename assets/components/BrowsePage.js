// React
import React from 'react';
import { Link } from 'react-router';

// constants
import Events from '../constants/SocketEvents'

export default class BrowsePage extends React.Component {
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
      console.log('data'+resp.data);
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

  render() {
    return (
      <div className="uk-grid">
        <div className="uk-width-1-1 uk-row-first">
          <h2> Browse creations </h2>
          <table className="uk-table">
            <caption>All audio creations</caption>
            <thead>
              <tr>
                <th>Transform</th>
                <th>Name</th>
                <th>Author</th>
                <th>Length</th>
                <th>Date</th>
                <th>Format</th>
              </tr>
            </thead>
            <tbody>
            {this.state.songs.map(function(song) {
              return <tr key={song._id}>
                  <td>{song.transform}</td>
                  <td>{song.name}</td>
                  <td>{song.author}</td>
                  <td>{song.length}</td>
                  <td>{song.date}</td>
                  <td>{song.format}</td>
                </tr>
            }) }
            </tbody>
          </table>
        </div>
      </div>
      );
    }
  }
