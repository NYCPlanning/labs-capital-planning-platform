import React from 'react';
import './App.css';
import LayersList from './LayersList';
import Map from './Map';
import NavBar from './NavBar';

class App extends React.Component {
  state = {
    filters: {
      facilityDomain: ['HEALTH AND HUMAN SERVICES'],
    },
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
              onFilterSelection={this.onFilterSelection}
            />
          </aside>

          <main className="as-main">
            <Map
              filters={this.state.filters}
            />
          </main>
        </div>
      </div>
    );
  }
}

export default App;
