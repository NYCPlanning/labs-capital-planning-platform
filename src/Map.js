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

  state = {
    facilityFilter: constructWhereClaus('facdomain', this.props.filters.facilityDomain),
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const finalWhereClaus = constructWhereClaus('facdomain', this.props.filters.facilityDomain);
    console.log("final where claus: ", finalWhereClaus);
    this._renderFacilityLayer(finalWhereClaus)

    // if (prevProps.filters.facilityDomain != this.props.filters.facilityDomain) {
    //   this.setState({
    //     facilityFilter: finalWhereClaus
    //   }, this._renderFacilityLayer);
    // }
  }

  _renderFacilityLayer(whereClaus) {
    this.layer = new CartoSQLLayer({
      data: `SELECT * FROM facdb_v2019_12 ${whereClaus}`,
      pointRadiusMinPixels: 10,
      getLineColor: [0, 0, 0, 0.75],
      lineWidthMinPixels: 3,
      getFillColor: colorCategories({
        attr: 'facdomain',
        domain: [
          'LIBRARIES AND CULTURAL PROGRAMS',
          'PARKS, GARDENS, AND HISTORICAL SITES',
          'HEALTH AND HUMAN SERVICES',
        ],
        colors: 'Bold'
      })
    })
  }

  layer = new CartoSQLLayer({
    data: `SELECT * FROM facdb_v2019_12 ${this.state.facilityFilter}`,
    pointRadiusMinPixels: 2,
    getLineColor: [0, 0, 0, 0.75],
    getFillColor: [238, 77, 90],
    lineWidthMinPixels: 1
  })

  render() {
    return (
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
      </div>
    );
  }
}
