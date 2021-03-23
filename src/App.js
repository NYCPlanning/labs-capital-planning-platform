import React from 'react';
import './App.css';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import NestedLayersList from './widgets/NestedLayersList';
import Map from './Map';
import NavBar from './NavBar';
import DetailWidget from './widgets/Detail';
import {
  Switch,
  Route,
} from "react-router-dom";

class ListItem {
  constructor(id, type, checked, label, children) {
    this.id = id;
    this.type = type;
    this.checked = checked;
    this.label = label;
    this.children = children;
  }

  id;

  // facdomain, facgroup, facsubgrp
  type;

  // checked, indeterminate, unchecked
  checked = "checked";

  label;

  children = [];
}

function _insertFacdomain(list, combination) {
  if (!(list.find(listItem => listItem.id === combination.facdomain))) {
    list.push(new ListItem(
      combination.facdomain,
      "facdomain",
      true,
      combination.facdomain,
      []
    ));
  }
};

// only call this function after _insertFacdomain
function _insertFacgroup(list, combination) {
  const facdomainItem = list.find(listItem => listItem.id === combination.facdomain);

  if (!(facdomainItem.children.find(listItem => listItem.id === combination.facgroup))) {
    facdomainItem.children.push(new ListItem(
      combination.facgroup,
      "facgroup",
      true,
      combination.facgroup,
      []
    ));
  }
};

// only call this function after _insertFacgroup
function _insertFacsubgrp(list, combination) {
  const facdomainItem = list.find(listItem => listItem.id === combination.facdomain);
  const facgroupItem = facdomainItem.children.find(listItem => listItem.id === combination.facgroup);

  if (!(facgroupItem.children.find(listItem => listItem.id === combination.facsubgrp))) {
    facgroupItem.children.push(new ListItem(
      combination.facsubgrp,
      "facsubgrp",
      true,
      combination.facsubgrp,
      []
    ));
  }
};

function _constructLayersList(combinations) {
  let list = [];

  combinations.map((combination) => {
    _insertFacdomain(list, combination);
    _insertFacgroup(list, combination);
    _insertFacsubgrp(list, combination);
  })

  return list;
}

class App extends React.Component {
  state = {
    categoryData: {
      facilityDomain: [],
    },
    filters: {
      facilityDomain: [],
    },
  }

  async componentDidMount() {
    const facilityCategoriesPromise = await fetch('https://planninglabs.carto.com/api/v2/sql?q=SELECT facdomain, COUNT(*) AS count FROM facdb_v2019_12 GROUP BY facdomain');
    const { rows: rawFacilityCategories } = await facilityCategoriesPromise.json();

    const facilityGroupCombinationsPromise = await fetch('https://planninglabs.carto.com/api/v2/sql?q=SELECT facdomain, facgroup, facsubgrp FROM planninglabs.facdb_v2019_12 GROUP BY facdomain, facgroup, facsubgrp');
    const { rows: facilityGroupCombinations } = await facilityGroupCombinationsPromise.json();

    const nestedFacilityLayers = _constructLayersList(facilityGroupCombinations);

    this.setState({
      nestedFacilityLayers: nestedFacilityLayers,
      categoryData: {
        facilityDomain: rawFacilityCategories.map(row => { return { name: row.facdomain, value: row.count} }),
      },
    });
  }

  onFilterSelection = (event) => {
    let { detail } = event;

    this.setState({ filters: {
        facilityDomain: detail,
      }
    });
  }

  // TODO: Move to Material UI Grid
  render() {
    return (
      <Grid>
        <NavBar />

        <Grid item>
          <Drawer
            anchor="left"
            open={true}
            variant="persistent"
          >
            <Toolbar />

            <NestedLayersList
              nestedLayers={this.state.nestedFacilityLayers}
            />
          </Drawer>

          <main className="">
            <Map
              filters={this.state.filters}
              categoryData={this.state.categoryData}
            />
          </main>

          <Switch>
            <Route exact path="/">
            </Route>
            <Route path="/details/:recordId">
              <Drawer
                anchor="right"
                open={true}
                variant="persistent"
              >
                <Toolbar />

                <DetailWidget />
              </Drawer>
            </Route>
          </Switch>
        </Grid>
      </Grid>
    );
  }
}

export default App;
