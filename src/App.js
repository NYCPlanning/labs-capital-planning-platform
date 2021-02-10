import React from 'react';
import './App.css';
import DeckGL from '@deck.gl/react';
import {LineLayer} from '@deck.gl/layers';
import {StaticMap} from 'react-map-gl';
import CategoryWidget from './widgets/category';

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0
};

// Data to be used by the LineLayer
const data = [
  {sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781]}
];

class App extends React.Component {
  layers = [
    new LineLayer({id: 'line-layer', data})
  ];

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
        
        <div className="as-content">
          <aside className="as-sidebar as-sidebar--left">
            <CategoryWidget
              heading="Business Volume"
              description="Description"
              categories={this.categories}
            />
          </aside>
    
          <main className="as-main">
            <div className="as-map-area mapContainer">
              <DeckGL
                initialViewState={INITIAL_VIEW_STATE}
                controller={true}
                layers={this.layers}
              >
                <StaticMap
                  mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                />
              </DeckGL>
    
              <div className="as-map-panels">
                <div className="as-panel as-panel--top as-panel--right">
                  <div className="as-panel__element as-p--32 as-bg--warning"></div>
                </div>
              </div>
    
            </div>
          </main>
    
          <aside className="as-sidebar as-sidebar--right"></aside>
        </div>
      </div>
    );
  }
}

export default App;
