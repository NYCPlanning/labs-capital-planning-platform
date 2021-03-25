import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import DcpLogo from './assets/dcp_logo_772.png';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: "#fefefe",
    color: "#d96b27",
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",sans-serif',
  },
  dcpLogo: {
    height: '2.25rem',
    paddingRight: 10,
    verticalAlign: 'bottom',
  }
}));

export default function NavBar() {
  const classes = useStyles();

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" noWrap>
          <img
            src={DcpLogo}
            className={classes.dcpLogo}
            alt="Department of City Planning Logo"
          />
          Capital Planning Platform
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
