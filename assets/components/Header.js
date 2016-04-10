import React from 'react';
import { Link } from 'react-router';

export default class Header extends React.Component {
  render() {
    return (
      <nav className="uk-navbar uk-margin-large-bottom" >
        <a className="uk-navbar-brand">Synestesia</a>
        <ul className="uk-navbar-nav">
          <li>
            <a href="/app/#/">Home</a>
          </li>
          <li>
            <a href="/app/#/upload">Upload</a>
          </li>
          <li>
            <a href="/app/#/browse">Browse</a>
          </li>
        </ul>
        <div className="uk-navbar-flip">
          <ul className="uk-navbar-nav">
          <li>
            <a href="/#/login">Login</a>
          </li>
          </ul>
        </div>
      </nav>
    );
  }
}
