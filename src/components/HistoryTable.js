import * as React from 'react';
import { useContext, useEffect, useState, useRef } from 'react';

import { useNavigate } from "react-router-dom";

import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { alpha } from '@mui/material/styles';

import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';

import { DataGrid } from '@mui/x-data-grid';

// imported contexts
import { dstructuresContext } from "./mainpage";

//import dialogs
import { AlertDialog } from "./AlertDialog"

import axios from 'axios';

// imported contexts
import { domainContext } from "./mainpage";

// data
const customCss = `
  .MuiDataGrid-cell:focus,
  .MuiDataGrid-cell:active {
    outline: none !important;
    border: none !important;
  }
`;

const columns = [
  {
    field: 'rownumber',
    headerName: 'Row Number',
    sortable: true,
    flex: 1,
    hide: true
  },
  {
    field: 'batch',
    headerName: 'Batch',
    sortable: true,
    flex: 1
  },
  { 
    field: 'actionnumber', 
    headerName: 'Action Number',
    sortable: true,
    flex: 1
  },
  {
    field: 'datastructures',
    headerName: 'Data Structures',
    sortable: true,
    flex: 1
  },
  {
    field: 'size',
    headerName: 'Size',
    sortable: true,
    flex: 1
    //type: 'number',
  },
  {
    field: 'lastaction',
    headerName: 'Last Action',
    sortable: true,
    flex: 1
    //description: 'This column has a value getter and is not sortable.',
    // valueGetter: (params) =>
    //   `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },
  {
    field: 'datecreated',
    headerName: 'Date Created',
    sortable: true,
    flex: 1
  },
  {
    field: 'lastupdated',
    headerName: 'Last Updated',
    sortable: true,
    flex: 1
  },
];

const rowsData = [
  //{ rownumber: 1, batch: 1, actionnumber: 0, datastructures: 3, size: 0, lastaction: "N/A", datecreated: "09/20/24 24:00PM", lastupdated: "N/'A"},
];

export default function HistoryTable() {
    const [domain] = useContext(domainContext)

    const userDetails = JSON.parse(sessionStorage.getItem('userDetails'));

    const [ dstructures, setdstructures ] = React.useContext(dstructuresContext)

    const [selectedRow, setSelectedRow] = React.useState(undefined);

    const [rows, setRows] = React.useState(rowsData)

    const handleSelectionChange = (selectedRowNumber) => {
      let row = rows.find((row) => row.rownumber === selectedRowNumber[0])
      setSelectedRow(row);
    };

    const setHistoryTableData = async () => {
      let AccountID = userDetails.AccountID

      // get table data
      let response = await axios.post(`${domain}/history/getHistoryTableData`, {AccountID});
      console.log(response.data, "data")

      let arr = []

      for(let i = 0; i < response.data.length; i++){
        // skip if item is the current batch used 
        if(
          i < dstructures.length && 
          response.data[i].DSBatch === dstructures[i].dsbatch && 
          response.data[i].ActionSet === dstructures[i].ActionSet)
        {
          continue
        }

        // skip if newly reset
        if(!response.data[i].ActionSet || !response.data[i].ActionType){ 
          continue
        }

        // skip if the record action is get. get action does not modify the datastructure
        if(response.data[i].ActionType === "Get"){
          continue
        }

        let rownumber = response.data[i].RowNumber
        let batch = response.data[i].DSBatch
        let actionnumber = response.data[i].ActionSet// ActionNumber is name of column but this is actually ActionSet from actionresults
        let datastructures = dstructures.length // should do this via query instead
        let size = response.data[i].Size
        let lastaction = response.data[i].ActionType
        let datecreated = new Date(response.data[i].DateCreated).toLocaleString();
        let lastupdated = new Date(response.data[i].ActionDate).toLocaleString();

        arr.push({ rownumber, batch, actionnumber, datastructures, size, lastaction, datecreated, lastupdated})
      }
      
      console.log(arr, "arr")
      setRows(arr)
    }

    React.useEffect(() => {
      if (dstructures[0].dsid != undefined) {
        setHistoryTableData();
      }
    }, [dstructures]);

    return (
        <div className='w-full h-full flex flex-col'>
            {/* Toolbar */}
            <EnhancedTableToolbar numSelected={selectedRow ? 1 : 0} selectedRow={selectedRow} dstructures={dstructures}/>

            <style>{customCss}</style> {/* Inject custom CSS */}

            <DataGrid
                rows={rows}
                columns={columns}
                autoPageSize
                getRowId={(row) => row.rownumber} 
                disableVirtualization
                onSelectionModelChange={handleSelectionChange}        
            />
        </div>
    );
}

function EnhancedTableToolbar(props) {
    const [domain] = useContext(domainContext)

    const navigate = useNavigate();

    const userDetails = JSON.parse(sessionStorage.getItem('userDetails'));

    const [alertDialog, setAlertDialog] = React.useState(false);

    const { numSelected, selectedRow, dstructures } = props;

    const handleConfirm = async () => {
      // handle if recovering a state while at a newly initialized ds
      if(!dstructures[0].size){
          let batch = dstructures[0].dsbatch
          let deleteDSFromBatch = await axios.post(`${domain}/history/deleteDSFromBatch`, {data: {batch}, AccountID: userDetails.AccountID}); 
      }

      //let archiveDS = await axios.post('http://localhost:3001/history/archiveDS', {data: selectedRow, AccountID: userDetails.AccountID}); 
      let archiveAS = await axios.post(`${domain}/history/archiveAS`, {data: selectedRow, AccountID: userDetails.AccountID});
      //let deleteDSFromBatch = await axios.post('http://localhost:3001/history/deleteDSFromBatch', {data: selectedRow, AccountID: userDetails.AccountID}); 
      let deleteASFromBatchSet = await axios.post(`${domain}/history/deleteASFromBatchSet`, {data: selectedRow, AccountID: userDetails.AccountID});

      //update last used batch from accounts table
      let updateLastUsedDSBatch = await axios.post(`${domain}/analytics/reset/updateLastUsedDSBatch`, {data: {accountID : userDetails.AccountID, batch: selectedRow.batch}});

      window.location.reload(); // so it goes back to analytics tab
    }

    const openAlertDialog = () => {
      setAlertDialog(true)
    };

    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            Batch {selectedRow.batch}, Action Number {selectedRow.actionnumber} selected <span className='text-gray-500 text-[.9rem]'>(CTRL + left click to deselect)</span>
          </Typography>
        ) : (
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Versions <span className='text-gray-500 text-[.9rem]'>(Select a row to recover)</span>
          </Typography>
        )}

        <AlertDialog 
          alertDialog={alertDialog} 
          setAlertDialog={setAlertDialog} 
          handleConfirm={handleConfirm} 
          text={{
            title:"Reverting to previous state",
            content: "Reverting to a previous state will delete all succeeding records",
            negativeButton : "Cancel",
            possitiveButton : "Confirm"
          }}
        />

        {numSelected > 0 ? (
          <Tooltip title="Revert">
            <IconButton onClick={openAlertDialog}>
              <RestoreIcon />
            </IconButton>
          </Tooltip>
        ) : null}

        {/* delete button */}
        {/* {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton onClick={handleDeleteClick}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : null} */}
      </Toolbar>
    );
}