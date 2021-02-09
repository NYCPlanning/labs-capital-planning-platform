import React from 'react';
import './App.css';
import mapboxgl from 'mapbox-gl';

class App extends React.Component {
  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [5, 34],
      zoom: 2
    });
  }

  render() {
    return (
      <div className="as-app">
        <header className="as-toolbar"></header>
        <nav className="as-tabs"></nav>
    
        <div className="as-content">
          <aside className="as-sidebar as-sidebar--left"></aside>
    
          <main className="as-main">
            <div className="as-map-area">
              <div ref={el => this.mapContainer = el} className="mapContainer" />
    
              <div className="as-map-panels">
                <div className="as-panel as-panel--top as-panel--right">
                  <div className="as-panel__element as-p--32 as-bg--warning"></div>
                </div>
              </div>
    
            </div>
            <footer className="as-map-footer as-bg--complementary"></footer>
          </main>
    
          <aside className="as-sidebar as-sidebar--right"></aside>
        </div>
      </div>
    );
  }
}

export default App;
