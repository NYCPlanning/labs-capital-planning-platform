import React from 'react';
import './App.css';
import DeckGL from '@deck.gl/react';
import {StaticMap} from 'react-map-gl';
import {CartoSQLLayer, setDefaultCredentials} from '@deck.gl/carto';
import CategoryWidget from './widgets/category';

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: -73.986607,
  latitude: 40.691869,
  zoom: 13,
  pitch: 0,
  bearing: 0
};

class App extends React.Component {
  componentDidMount() {
    setDefaultCredentials({
      username: process.env.REACT_APP_CARTO_USERNAME,
      apiKey: process.env.REACT_APP_CARTO_API_KEY,
    });
  }

  layer = new CartoSQLLayer({
    data: 'SELECT * FROM facdb_v2019_12',
    pointRadiusMinPixels: 2,
    getLineColor: [0, 0, 0, 0.75],
    getFillColor: [238, 77, 90],
    lineWidthMinPixels: 1
  })

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
                layers={[this.layer]}
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
