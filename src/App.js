import React from 'react';
import './App.css';
import LayersList from './LayersList';
import Map from './Map';
import NavBar from './NavBar';

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

    this.setState({
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

  render() {
    return (
      <div className="as-app">
        <NavBar />

        <div className="as-content">
          <aside className="as-sidebar as-sidebar--left">
            <LayersList
              categoryData={this.state.categoryData}
              onFilterSelection={this.onFilterSelection}
            />
          </aside>

          <main className="as-main">
            <Map
              filters={this.state.filters}
              categoryData={this.state.categoryData}
            />
          </main>
        </div>
      </div>
    );
  }
}

export default App;
