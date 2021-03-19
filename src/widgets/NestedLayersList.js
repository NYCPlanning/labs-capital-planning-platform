import React, { useState } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from '@material-ui/core/Paper';

function LayersList(props)  {
  const { list, title } = props;

  let listTitle = title ?  (
    <ListSubheader component="div" id="nested-list-subheader">
      {title}
    </ListSubheader>
  ) : (null);
  
  return (
    <List
      dense
      subheader={listTitle}
    >
        {list.map((item) => {
          return (
            <LayersListItem
              item={item}
            />
          );
        })}
    </List>
  )
}

function LayersListItem(props)  {
  const [open, setOpen] = React.useState(false);
  const { item } = props;
  const labelId = `checkbox-list-secondary-label-${item.label}`;
  let childList;

  if (item.children) {
    childList = (
      <Collapse in={open} timeout="auto" unmountOnExit>
        <LayersList 
          list={item.children}
        />
      </Collapse>
    );
  }

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItem key={item.label} button
        onClick={handleClick}
      >
        {item.children.length > 0 ? (open ? <ExpandLess /> : <ExpandMore />) : (null)}

        <ListItemText id={labelId} primary={item.label} />

        <ListItemSecondaryAction>
          <Checkbox
            edge="end"
            inputProps={{ 'aria-labelledby': labelId }}
          />
        </ListItemSecondaryAction>
      </ListItem>

      {childList}
    </>
  );
}

export default function NestedLayersList(props) {
  const { nestedLayers } = props;

  if (!nestedLayers) {
    return (null);
  }

  return (
    <Paper
      style={
        {
          marginTop: "15px",
          maxWidth: "350px",
        }
      } 
      elevation={0}
    >
      <LayersList
        title="Facility Categories"
        list={nestedLayers}
      />
    </Paper>
  );
}
