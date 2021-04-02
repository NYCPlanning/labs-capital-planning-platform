import React from 'react';
import DeckGL from '@deck.gl/react';
import mapboxgl from "mapbox-gl";
import {StaticMap} from 'react-map-gl';
import {CartoSQLLayer, setDefaultCredentials, colorCategories} from '@deck.gl/carto';
import {
  useHistory,
} from "react-router-dom";

// https://github.com/mapbox/mapbox-gl-js/issues/10173#issuecomment-750489778
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

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
    const {
      object: {
        properties: {
          uid,
        }
      }
    } = info;

    this.props.history.push("/details/" + uid);

    this.setState({
      ...this.state,
      selectedFeatureId: uid,
    });
  }

  state = {
    layers: [],
    selectedFeatureId: null,
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.selectedFacSubgroups !== this.props.selectedFacSubgroups ||
      prevState.selectedFeatureId !== this.state.selectedFeatureId
    ) {
      const newFacilityLayers = this.props.selectedFacSubgroups.map((subgroup) => {
        return new CartoSQLLayer({
          id: subgroup,
          data: `SELECT * FROM facdb_v2019_12 WHERE facsubgrp = '${subgroup}'`,
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
      });

      const { selectedFeatureId } = this.state;

      let selectionLayer = null;

      if (selectedFeatureId) {
        selectionLayer = new CartoSQLLayer({
          id: selectedFeatureId,
          data: `SELECT the_geom_webmercator FROM facdb_v2019_12 WHERE uid = '${selectedFeatureId}'`,
          pointRadiusMinPixels: 9,
          getLineColor: [255,153,153,255],
          getFillColor: [0, 0, 0, 0],
          lineWidthMinPixels: 3,
        });
      }

      this.setState({
        layers: [...newFacilityLayers, selectionLayer],
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