import React from 'react';
import { Link } from 'react-router';

var css = {
  navbar: {
    background: "#7A6CBB"
  },
  a: {
    fontSize: "16px",
    color: "#fff",
    textShadow: "none",
  },
  brand: {
    fontSize: "22px",
    color: "#fff",
    textShadow: "none",
  }
}
export default class Header extends React.Component {
  render() {
    return (
      <nav className="uk-navbar uk-margin uk-container" style={css.navbar} >

        <ul className="uk-navbar-nav">
				  <li><a className="uk-navbar-brand" style={css.brand}>Synesthesia</a>
          </li>
          <li className="">
            <a className="" style={css.a} href="/app/#/"> Home </a>
          </li>
          <li>
            <a className="" href="/app/#/browse" style={css.a}>Browse</a>
          </li>
          <li className="">
            <a className="" href="/app/#/stats/" style={css.a}>Stats</a>
          </li>
        </ul>
        <div className="uk-navbar-flip">
          <ul className="uk-navbar-nav">
          <li>
            <a href="https://github.com/bekher/synesthesia-web/" style={css.a}>
             <i className="uk-icon-github uk-icon-small"></i>&nbsp; Github</a>
          </li>
          </ul>
        </div>
      </nav>
    );
  }
}
