import * as React from 'react';
import { useContext, useEffect, useState, useRef } from 'react';

import { useNavigate } from "react-router-dom";

import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { alpha } from '@mui/material/styles';

import PersonOffIcon from '@mui/icons-material/PersonOff';
import HowToRegIcon from '@mui/icons-material/HowToReg';

import { DataGrid } from '@mui/x-data-grid';

// imported contexts
import { domainContext, dstructuresContext, AlertDialogContext } from "./mainpage";

//import dialogs
import { AlertDialog } from "./AlertDialog"

import axios from 'axios';


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
    field: 'accountID',
    headerName: 'ID',
    sortable: true,
    flex: 1,
  },
  {
    field: 'accountStatus',
    headerName: 'Status',
    sortable: true,
    flex: 1,
  },
  {
    field: 'email',
    headerName: 'Email',
    sortable: true,
    flex: 1
  },
  {
    field: 'isVerified',
    headerName: 'Verified', 
    sortable: true,
    flex: 1
  },
  { 
    field: 'firstname', 
    headerName: 'Firstname',
    sortable: true,
    flex: 1
  },
  {
    field: 'lastname',
    headerName: 'lastname',
    sortable: true,
    flex: 1
  },
  {
    field: 'role',
    headerName: 'Role',
    sortable: true,
    flex: 1
    //type: 'number',
  },
  {
    field: 'origin',
    headerName: 'Origin',
    sortable: true,
    flex: 1
    //description: 'This column has a value getter and is not sortable.',
    // valueGetter: (params) =>
    //   `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },
];

const rowsData = [
  //{ rownumber: 1, batch: 1, actionnumber: 0, datastructures: 3, size: 0, lastaction: "N/A", datecreated: "09/20/24 24:00PM", lastupdated: "N/'A"},
];

export default function UsersTable() {
    const [domain] = useContext(domainContext)

    const userDetails = JSON.parse(sessionStorage.getItem('userDetails'));

    // use context
    const [ dstructures, setdstructures ] = React.useContext(dstructuresContext)

    const [selectionModel, setSelectionModel] = React.useState([]);
    const [selectedRow, setSelectedRow] = React.useState(undefined);
    const [rows, setRows] = React.useState(rowsData)

    // Custom cell renderer to conditionally style cell text
    const CustomCellRenderer = (params) => {
      const { value } = params;
      const cellStyle = value === 'Disabled' ? { color: 'red' } : {}; // Conditionally apply red color
      return <div style={cellStyle}>{value}</div>;
    };

    const handleSelectionChange = (selectedRowNumber) => {
 
        let row = rows.find((row) => row.accountID === selectedRowNumber[0])
        console.log(row)
        setSelectedRow(row);
        setSelectionModel(selectedRowNumber);
    };

    const handleClearSelection = () => {
        setSelectionModel([]);
        setSelectedRow(undefined)
    };

    const setUsersTableData = async () => {
        // get table data
        let response = await axios.post('http://localhost:3001/admin/getAllAccounts');

        let arr = []

        for(let i = 0; i < response.data.length; i++){
            // skip if item is the current batch used 
            // if(
            //   i < dstructures.length && 
            //   response.data[i].DSBatch === dstructures[i].dsbatch && 
            //   response.data[i].ActionSet === dstructures[i].ActionSet)
            // {
            //   continue
            // }

            let accountID = response.data[i].AccountID
            let accountStatus = response.data[i].AccountStatus
            let email = response.data[i].Email
            let isVerified = response.data[i].isVerified
            let firstname = response.data[i].Firstname
            let lastname = response.data[i].Lastname
            let role = response.data[i].Role
            let origin = response.data[i].Origin

            arr.push({accountID, accountStatus, email, isVerified, firstname, lastname, role, origin})
        }
        
        setRows(arr)
    }

    React.useEffect(() => {
        setUsersTableData()
    }, []);

    return (
        <div className='w-full h-full flex flex-col'>
            {/* Toolbar */}
            <EnhancedTableToolbar numSelected={selectedRow ? 1 : 0} selectedRow={selectedRow} setUsersTableData={setUsersTableData} handleClearSelection={handleClearSelection}/>

            <style>{customCss}</style> {/* Inject custom CSS */}

            <DataGrid
                rows={rows}
                // columns={columns}
                columns={columns.map((column) => ({
                  ...column,
                  renderCell: (params) => <CustomCellRenderer {...params} />, // Use custom cell renderer
                }))}
                autoPageSize
                getRowId={(row) => row.accountID} 
                disableVirtualization
                onSelectionModelChange={handleSelectionChange}
                selectionModel={selectionModel}        
            />
        </div>
    );
}


// toolbar component
function EnhancedTableToolbar(props) {
    const navigate = useNavigate();

    const userDetails = JSON.parse(sessionStorage.getItem('userDetails'));
    const AccountID = userDetails.AccountID

    // useContexts
    const [setAlertDialog, setAlertDialogDetails] = React.useContext(AlertDialogContext)

    const { numSelected, selectedRow} = props;

    const openDisableAccountDialog = () => {
        const handleConfirm = async () => {
            let data = {AccountID: selectedRow.accountID}
            let response = await axios.post('http://localhost:3001/admin/disableAccount', {data});
    
            props.setUsersTableData()
            props.handleClearSelection()
        }

        let title = "Confirmation"
        let content = "Are you sure you want to disable this account?"
        let negativeButton = "Cancel"
        let possitiveButton = "Disable"

        setAlertDialogDetails({handleConfirm, title, content, negativeButton, possitiveButton})
        setAlertDialog(true)
    };

    const openEnableAccountDialog = () => {
        const handleConfirm = async () => {
            console.log("asd")
            let data = {AccountID: selectedRow.accountID}
            let response = await axios.post('http://localhost:3001/admin/enableAccount', {data});
    
            props.setUsersTableData()
            props.handleClearSelection() 
        }

        let title = "Confirmation"
        let content = "Are you sure you want to make this account operational?"
        let negativeButton = "Cancel"
        let possitiveButton = "Confirm"

        setAlertDialogDetails({handleConfirm, title, content, negativeButton, possitiveButton})
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
            <strong> Account ID {selectedRow.accountID}, {selectedRow.email} </strong> selected <span className='text-gray-500 text-[.9rem]'>(CTRL + left click to deselect)</span>
          </Typography>
        ) : (
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
            color="inherit"
          >
            Accounts <span className='text-gray-500 text-[.9rem]'>(Select a row to disable)</span>
          </Typography>
        )}

        { // conditionally renders button for when 1. account status is operational 2. account status is disabled 3. does not render if selected row is the current user
        selectedRow && selectedRow.accountID !== userDetails.AccountID && (
            numSelected > 0 && selectedRow.accountStatus === "Operational" ? (
            <Tooltip title="Disable">
                <IconButton onClick={openDisableAccountDialog}>
                <PersonOffIcon />
                </IconButton>
            </Tooltip>
            ) : numSelected > 0 && selectedRow.accountStatus !== "Operational" ? (
            <Tooltip title="Enable">
                <IconButton onClick={openEnableAccountDialog}>
                <HowToRegIcon />
                </IconButton>
            </Tooltip>
            ) : null
        )
        }

      </Toolbar>
    );
}