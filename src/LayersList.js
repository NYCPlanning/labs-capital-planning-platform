import React from 'react';
import CategoryWidget from './widgets/Category';

export default class LayersList extends React.Component {
  render() {
    return (
      <CategoryWidget
        heading="Facilities Categories"
        categories={this.props.categoryData.facilityDomain}
        onSelectedChanged={this.props.onFilterSelection}
      />
    );
  }
}
