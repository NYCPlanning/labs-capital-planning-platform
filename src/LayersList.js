import React from 'react';
import CategoryWidget from './widgets/category';

export default class LayersList extends React.Component {
  state = {
    categories: [],
    selection: [],
    filter: null,
  };

  facilitiesCategories =  [
    { name: 'LIBRARIES AND CULTURAL PROGRAMS', value: 1000 },
    { name: 'PARKS, GARDENS, AND HISTORICAL SITES', value: 900 },
    { name: 'HEALTH AND HUMAN SERVICES', value: 800 },
  ];


  render() {
    return (
      <CategoryWidget
        heading="Facilities Categories"
        categories={this.facilitiesCategories}
        onSelectedChanged={this.props.onFilterSelection}
      />
    );
  }
}
