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

  state = {
    layers: [],
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.layers !== this.props.layers
    ) {
      const newLayers = this.props.layers.map((layer) => {
        return new CartoSQLLayer({
          id: layer,
          data: `SELECT * FROM facdb_v2019_12 WHERE facsubgrp = '${layer}'`,
          pointRadiusMinPixels: 7,
          getLineColor: [0, 0, 0, 0.75],
          lineWidthMinPixels: 3,
          getFillColor: colorCategories({
            attr: 'facdomain',
            domain: this.props.domains,
            colors: 'Bold',
          }),
          onClick: this._onPointClick,
          pickable: true,
        });
      })

      this.setState({
        layers: newLayers,
      });
    }
  }


  render() {
    return (
      <div className="mapContainer">
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