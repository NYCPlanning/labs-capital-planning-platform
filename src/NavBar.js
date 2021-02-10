import React from 'react';

export default class NavBar extends React.Component {
  render() {
    return (
      <as-toolbar>
        <div href="#" className="as-toolbar__item">
          Capital Planning Platform
        </div>
        <nav className="as-toolbar__actions">
          <ul>
            <li>
              <a href="#" className="as-toolbar__item">About the Data</a>
            </li>
          </ul>
        </nav>
      </as-toolbar>
    );
  }
}
