import React from 'react';
import CategoryWidget from './widgets/category';

export default class LayersList extends React.Component {
  state = {
    categories: [],
  };

  async componentDidMount() {
    const facilityCategoriesPromise = await fetch('https://planninglabs.carto.com/api/v2/sql?q=SELECT facdomain, COUNT(*) AS count FROM facdb_v2019_12 GROUP BY facdomain');
    const { rows: rawFacilityCategories } = await facilityCategoriesPromise.json();

    this.setState({
      categories: rawFacilityCategories.map(row => { return { name: row.facdomain, value: row.count} }),
    });
  }

  render() {
    return (
      <CategoryWidget
        heading="Facilities Categories"
        categories={this.state.categories}
        onSelectedChanged={this.props.onFilterSelection}
      />
    );
  }
}
