import React from 'react';
import './App.css';
import LayersList from './LayersList';
import Map from './Map';
import NavBar from './NavBar';

class App extends React.Component {
  render() {
    return (
      <div className="as-app">
        <NavBar />

        <div className="as-content">
          <aside className="as-sidebar as-sidebar--left">
            <LayersList />
          </aside>

          <main className="as-main">
            <Map />
          </main>
        </div>
      </div>
    );
  }
}

export default App;
