import React from 'react';
import DeckGL from '@deck.gl/react';
import {StaticMap} from 'react-map-gl';
import {CartoSQLLayer, setDefaultCredentials, colorCategories} from '@deck.gl/carto';

const INITIAL_VIEW_STATE = {
  longitude: -73.986607,
  latitude: 40.691869,
  zoom: 13,
  pitch: 0,
  bearing: 0
};

function constructWhereClaus(property, facdomainValues) {
  const facdomainConditions = facdomainValues.map(value => `${property}='${value}'`);
  const finalClaus = facdomainConditions.join(') OR (');

  return (facdomainValues.length > 0) ? `WHERE (${finalClaus})` : '';
}

export default class Map extends React.Component {
  componentDidMount() {
    setDefaultCredentials({
      username: process.env.REACT_APP_CARTO_USERNAME,
      apiKey: process.env.REACT_APP_CARTO_API_KEY,
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.filters.facilityDomain !== this.props.filters.facilityDomain) {
      const layer = new CartoSQLLayer({
        id: '12345',
        data: `SELECT * FROM facdb_v2019_12 ${constructWhereClaus('facdomain', this.props.filters.facilityDomain)}`,
        pointRadiusMinPixels: 7,
        getLineColor: [0, 0, 0, 0.75],
        lineWidthMinPixels: 3,
        getFillColor: colorCategories({
          attr: 'facdomain',
          domain: [
            'LIBRARIES AND CULTURAL PROGRAMS',
            'PARKS, GARDENS, AND HISTORICAL SITES',
            'HEALTH AND HUMAN SERVICES',
          ],
          colors: 'Bold',
        }),
      });
  
      this.setState({
        layers: [layer],
      });
    }
  }

  state = {
    layers: [
      new  CartoSQLLayer({
        data: `SELECT * FROM facdb_v2019_12`,
        pointRadiusMinPixels: 7,
        getLineColor: [0, 0, 0, 0.75],
        lineWidthMinPixels: 3,
        getFillColor: colorCategories({
          attr: 'facdomain',
          domain: [
            'LIBRARIES AND CULTURAL PROGRAMS',
            'PARKS, GARDENS, AND HISTORICAL SITES',
            'HEALTH AND HUMAN SERVICES',
          ],
          colors: 'Bold',
        }),
      }),
    ],
  }

  render() {
    return (
      <div className="as-map-area mapContainer">
        <DeckGL
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}
          layers={this.state.layers}
        >
          <StaticMap
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          />
        </DeckGL>
      </div>
    );
  }
}
