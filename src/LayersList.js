import React from 'react';
import CategoryWidget from './widgets/category';

export default class LayersList extends React.Component {
  facilitiesCategories =  [
    { name: 'Bars & Restaurants', value: 1000 },
    { name: 'Fashion', value: 900 },
    { name: 'Grocery', value: 800 },
    { name: 'Health', value: 400 },
    { name: 'Shopping mall', value: 250 },
    { name: 'Transportation', value: 1000 },
    { name: 'Leisure', value: 760 }
  ];

  render() {
    return (
      <CategoryWidget
        heading="Facilities Categories"
        categories={this.facilitiesCategories}
      />
    );
  }
}
