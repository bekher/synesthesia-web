import React from 'react';
import { Link } from 'react-router';

export default class Header extends React.Component {
  render() {
    return (
      <nav className="uk-navbar uk-margin-large-bottom" >
        <a className="uk-navbar-brand">Synestesia</a>
        <ul className="uk-navbar-nav">
          <li>
            <a href="/#/">Home</a>
          </li>
          <li>
            <a href="/#/upload">Upload</a>
          </li>
          <li>
            <a href="/#/browse">Browse</a>
          </li>
        </ul>
        <div className="uk-navbar-flip">
          <ul className="uk-navbar-nav">
          <li>
            <a href="/logout">Logout</a>
          </li>
          </ul>
        </div>
      </nav>
    );
  }
}
