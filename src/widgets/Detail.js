import React, { useEffect, useState } from 'react';
import {
  useParams
} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    tableLayout: 'fixed',
    width: 350,
  },
});

export default function DetailWidget() {
  let { recordId } = useParams();

  const classes = useStyles();

  const [recordDetails, setRecordDetails] = useState([]);

  const fetchRecordDetails = async () => {
    const recordDetailsPromise = await fetch("https://planninglabs.carto.com:443/api/v2/sql?q=select * from facdb_v2019_12 WHERE uid='" + recordId + "'");

    const { rows: [ recordDetails ] } = await recordDetailsPromise.json();

    setRecordDetails(recordDetails);
  }

  useEffect(() => {
    fetchRecordDetails();
  }, [recordId]);

  return (
    recordDetails ?
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableBody>
            {Object.keys(recordDetails).map((key) => (
              ["the_geom", "the_geom_webmercator", "cartodb_id"].includes(key) ? <></> :
              <>
                <TableRow key={recordDetails[key]}>
                  <TableCell component="th" scope="row">
                    {key}
                  </TableCell>
                  <TableCell align="right">
                    {recordDetails[key]}
                  </TableCell>
                </TableRow>
              </>
            ))
          }
          </TableBody>
        </Table>
      </TableContainer>
    : <></>
  )
}