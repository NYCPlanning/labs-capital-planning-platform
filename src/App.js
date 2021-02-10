import React from 'react';
import './App.css';
import mapboxgl from 'mapbox-gl';
import CategoryWidget from './widgets/category';

class App extends React.Component {
  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [5, 34],
      zoom: 2
    });
  }

  categories =  [
    { name: 'Bars & Restaurants', value: 1000 },
    { name: 'Fashion', value: 900 },
    { name: 'Grocery', value: 800 },
    { name: 'Health', value: 400 },
    { name: 'Shopping mall', value: 250 },
    { name: 'Transportation', value: 1000 },
    { name: 'Leisure', value: 760 }
  ];

  render() {
    return (
      <div className="as-app">
        <as-toolbar>
          <div href="#" class="as-toolbar__item">
            Capital Planning Platform
          </div>
          <nav class="as-toolbar__actions">
            <ul>
              <li>
                <a href="#" class="as-toolbar__item">About the Data</a>
              </li>
            </ul>
          </nav>
        </as-toolbar>
        
        <div className="as-content">
          <aside className="as-sidebar as-sidebar--left">
            <CategoryWidget
              heading="Business Volume"
              description="Description"
              categories={this.categories}
            />
          </aside>
    
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
