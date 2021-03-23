import React from 'react';
import DeckGL from '@deck.gl/react';
import {StaticMap} from 'react-map-gl';
import {CartoSQLLayer, setDefaultCredentials, colorCategories} from '@deck.gl/carto';
import {
  useHistory,
} from "react-router-dom";

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

// Higher-order component to accomodate useHistory react-router hook
function wrappedMap(mapComponent) {
  return function WrappedComponent(props) {
    let history = useHistory();

    return (<Map
      {...props}
      history={history}
    />);
  }
}

class Map extends React.Component {
  componentDidMount() {
    setDefaultCredentials({
      username: process.env.REACT_APP_CARTO_USERNAME,
      apiKey: process.env.REACT_APP_CARTO_API_KEY,
    });
  }


  _onPointClick = (info,  event) => {
    this.props.history.push("/details/" + info.object.properties.uid)
  }

  _generateNewLayer(domainData) {
    return new CartoSQLLayer({
      data: `SELECT * FROM facdb_v2019_12`,
      pointRadiusMinPixels: 7,
      getLineColor: [0, 0, 0, 0.75],
      lineWidthMinPixels: 3,
      getFillColor: colorCategories({
        attr: 'facdomain',
        domain: domainData,
        colors: 'Bold',
      }),
      onClick: this._onPointClick,
      pickable: true,
    });
  }

  state = {
    layers: [
      this._generateNewLayer(this.props.categoryData.facilityDomain.map(value => value.name)),
    ],
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      (prevProps.filters.facilityDomain !== this.props.filters.facilityDomain)
      || (prevProps.categoryData.facilityDomain !== this.props.categoryData.facilityDomain)
    ) {
      const layer = new CartoSQLLayer({
        id: '12345',
        data: `SELECT * FROM facdb_v2019_12 ${constructWhereClaus('facdomain', this.props.filters.facilityDomain)}`,
        pointRadiusMinPixels: 7,
        getLineColor: [0, 0, 0, 0.75],
        lineWidthMinPixels: 3,
        getFillColor: colorCategories({
          attr: 'facdomain',
          domain: this.props.categoryData.facilityDomain.map(value => value.name),
          colors: 'Bold',
        }),
        onClick: this._onPointClick,
        pickable: true,
      });
  
      this.setState({
        layers: [layer],
      });
    }
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

export default wrappedMap(Map);