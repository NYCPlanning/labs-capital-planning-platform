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
  constructor(type, domain, group, subgroup, checked, children) {
    this.type = type;
    this.domain = domain;
    this.group = group;
    this.subgroup = subgroup;
    this.checked = checked;
    this.children = children;

    if (type === "domain") {
      this.label = domain;
    }
    if (type === "group") {
      this.label = group;
    }
    if (type === "subgroup") {
      this.label = subgroup;
    }

    this.id = this.label + '-' + type;
  }

  id;

  // domain, group, subgroup
  type;

  domain;

  group;

  subgroup;

  label;

  // checked, indeterminate, unchecked
  checked = "unchecked";

  children = [];
}

function _insertFacdomain(list, combination) {
  if (!(list.find(listItem => listItem.id === combination.facdomain + '-domain'))) {
    list.push(new ListItem(
      "domain",
      combination.facdomain,
      combination.facgroup,
      combination.facsubgrp,
      "unchecked",
      []
    ));
  }
};

// only call this function after _insertFacdomain
function _insertFacgroup(list, combination) {
  const facdomainItem = list.find(listItem => listItem.id === combination.facdomain  + '-domain');

  if (!(facdomainItem.children.find(listItem => listItem.id === combination.facgroup  + '-group'))) {
    facdomainItem.children.push(new ListItem(
      "group",
      combination.domain,
      combination.facgroup,
      combination.facsubgrp,
      "unchecked",
      []
    ));
  }
};

// only call this function after _insertFacgroup
function _insertFacsubgrp(list, combination) {
  const facdomainItem = list.find(listItem => listItem.id === combination.facdomain + '-domain');
  const facgroupItem = facdomainItem.children.find(listItem => listItem.id === combination.facgroup + '-group');

  if (!(facgroupItem.children.find(listItem => listItem.id === combination.facsubgrp + '-group'))) {
    facgroupItem.children.push(new ListItem(
      "subgroup",
      combination.domain,
      combination.facgroup,
      combination.facsubgrp,
      "unchecked",
      []
    ));
  }
};

function _constructLayersList(combinations, condition) {
  let list = [];

  combinations.forEach((combination) => {
    _insertFacdomain(list, combination);
    _insertFacgroup(list, combination);
    _insertFacsubgrp(list, combination);
  });

  return list;
}

class App extends React.Component {
  state = {}

  async componentDidMount() {
    const facilityGroupCombinationsPromise = await fetch('https://planninglabs.carto.com/api/v2/sql?q=SELECT facdomain, facgroup, facsubgrp FROM planninglabs.facdb_v2019_12 GROUP BY facdomain, facgroup, facsubgrp');
    const { rows: facilityGroupCombinations } = await facilityGroupCombinationsPromise.json();

    const nestedFacilityLayers = _constructLayersList(facilityGroupCombinations);

    this.setState({
      nestedFacilityLayers: nestedFacilityLayers,
    });
  }

  toggledChildren = (children, checkedValue) => {
    return children.map(child => {
      return {
        ...child,
        checked: checkedValue,
        children: this.toggledChildren(child.children, checkedValue),
      }
    })
  }

  onListItemToggle = (item) => {
    const newNestedFacilityLayers = this.state.nestedFacilityLayers.map((domain) => {
      if (domain.id === item.id) {
        const newCheckedValue = (domain.checked === "checked") ? "unchecked" : "checked";

        return {
          ...domain,
          checked: newCheckedValue,
          children: this.toggledChildren(domain.children, newCheckedValue),
        }
      }

      return {
        ...domain,
        children: domain.children.map((group) => {
          if (group.id === item.id) {
            const newCheckedValue = (group.checked === "checked") ? "unchecked" : "checked";

            return {
              ...group,
              checked: newCheckedValue,
              children: this.toggledChildren(group.children, newCheckedValue),
            }
          }
   
          return {
            ...group,
            children: group.children = group.children.map((subgroup) => {
              if (subgroup.id === item.id) {
                return {
                  ...subgroup,
                  checked: (subgroup.checked === "checked") ? "unchecked" : "checked",
                }
              };
  
              return subgroup;
            }),
          }
        }),
      }
    });

    this.setState({
      nestedFacilityLayers: newNestedFacilityLayers,
    })
  }

  getCheckedSubgroups = () => {
    if (!this.state.nestedFacilityLayers) return [];

    return this.state.nestedFacilityLayers.reduce((domainAcc, curDomain) => {
      return domainAcc.concat(curDomain.children.reduce((groupAcc, curGroup) => {
        return groupAcc.concat(curGroup.children.reduce((subgroupAcc, curSubgroup) => {
          if (curSubgroup.checked === "checked") return subgroupAcc.concat(curSubgroup.subgroup);

          return subgroupAcc;
        }, []));
      }, []));
    }, []);
  }

  getDomains = () => {
    if (!this.state.nestedFacilityLayers) return [];

    return this.state.nestedFacilityLayers.map(domain => domain.domain);
  }

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
              onListItemToggle={this.onListItemToggle}
            />
          </Drawer>

          <main className="">
            <Map
              selectedFacSubgroups={this.getCheckedSubgroups()}
              domains={this.getDomains()}
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
