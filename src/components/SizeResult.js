import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { LastActionDialog, SpeedDialog, SizeDialog } from './CRUD';

import SingleYChart from './SingleYChart'

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

import {Box, Paper} from '@mui/material'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

const _ = require('lodash');

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SizeResult() {
  const [ sizeDialog, setSizeDialog, dstructures, openedDSDetails, setOpenedDSDetails] = useContext(SizeDialog) 

  const [ allResults, setAllResults ] = useState([])
  const [ output, setOutput] = useState({})

  const handleClose = () => {
    setSizeDialog(false);
  };

  // for output card
  const getOutput = () => {
        if(openedDSDetails && openedDSDetails.dsDetails.JSONResults){
            let dsDetails = openedDSDetails.dsDetails

            if(dsDetails.dsname === "Dynamic Array"){
                let prevSize = JSON.parse(dsDetails.JSONResults)[0].prevSize
                let size = dsDetails.size 
                let sizeAdded = size - prevSize

                // is actually capacity, did this for code simplicity in printing it
                let pointers = dsDetails.frequency
                let pointersAdded = dsDetails.sizeAdded
                let primaryText = "Capacity"

                return {size, sizeAdded, pointers, pointersAdded, primaryText}
            }else{
                let size = dsDetails.size
                let sizeAdded = dsDetails.sizeAdded

                let pointers = dsDetails.sizepointers
                let pointersAdded = dsDetails.pointersAdded
                let primaryText = "Pivot Count"

                return {size, sizeAdded, pointers, pointersAdded, primaryText}
            }    
        }

        return {}
  }

  // for list of last actions (speed)
  const getAllResultsSummary = () => {
      let arr = []

      if(openedDSDetails && openedDSDetails.dsDetails.JSONResults){ // if dstructures are not empty
          let results = JSON.parse(openedDSDetails.dsDetails.JSONResults)
          let dsname = openedDSDetails.dsDetails.dsname

          for(let i = 0; i < results.length; i++){
              let currentIndex = results[i].currentIndex
              let size 
              let sizeAdded
              let text 

              if(dsname === "Dynamic Array"){
                size = results[i].capacity
                sizeAdded = results[i].sizeAdded
                text = "Capacity"
              }else{
                size = results[i].sizepointers
                sizeAdded = results[i].pointersAdded
                text = "Pivot Count"
              }

              arr.push({currentIndex, size, sizeAdded, text})
          }
      } 

      return arr
  }

  // sort the dstructures everytime dstructures is updated
  useEffect(() => {
    setOutput(getOutput())
    setAllResults(getAllResultsSummary())
  }, [openedDSDetails])

  return (
    <React.Fragment>
      <Dialog
        fullScreen
        open={sizeDialog}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative', backgroundColor: '#5b7ea8' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {openedDSDetails ? openedDSDetails.dsDetails.dsname + " Last Action Summary" : ""}
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              save
            </Button>
          </Toolbar>
        </AppBar>

        <div className='w-full h-[50vh] min-h-[450px] flex gap-5 px-5 py-4 box-border'>

          {/* charts div */}
          <div className='bg-gray-50 shadow3 rounded flex-[7] relative'>
              <div className='h-full w-full'>
                  <SingleYChart />
              </div>
          </div>
          
          <div className='flex-[3] h-full bg-gray-50 shadow3 rounded py-3 px-7 box-border'>
              <div className='flex flex-col gap-3  w-full h-full'>

                  <div className='flex flex-col items-center justify-center flex-[3] gap-2'>
                      <h1 className='text-[1.5rem] font-bold '> Inputs </h1>
                      <h2 className='text-[1.1rem] text-gray-600'>from size: {dstructures[0].JSONResults ? JSON.parse(dstructures[0].JSONResults)[0].prevSize : "dstructures empty"} </h2>
                  </div>
                  
                  <Divider />
                  
                  <div className='flex-[7] flex flex-col gap-3'>
                      <h2>Action: {dstructures[0].actiontype} </h2>
                      <h2>Starting Index: {dstructures[0].actioninput}</h2>
                      <h2>Ending Index: {dstructures[0].actioncount}</h2>
                      <h2>Action Direction: {dstructures[0].inputparameters}</h2>
                  </div>
                  
              </div>
          </div>
        </div>

        {/* data div */}
        <div className='min-h-[450px] h-full w-full flex px-5 py-4 gap-5'>

            {/* fasteset overall speed div */}
           <div className='bg-gray-50 shadow3 rounded h-full max-h-[400px] overflow-auto flex-1 flex flex-col'>
                <h1 className='text-[1.5rem] font-bold text-center min-h-[20%] flex items-center justify-center'>
                    Output
                </h1>

                <div className='w-full h-full'>
                    <List>
                        <ListItemButton>
                            <ListItemText primary={"Size"} secondary={output.size} />

                            <Typography variant="body2" color="textSecondary">
                                {`(+ ${output.sizeAdded})`}
                            </Typography>
                        </ListItemButton>   

                        <Divider />

                        <ListItemButton>
                            <ListItemText primary={output.primaryText} secondary={output.pointers} />

                            <Typography variant="body2" color="textSecondary">
                                {`(+ ${output.pointersAdded})`}
                            </Typography>
                        </ListItemButton>            
                    </List>
                </div>   
           </div>

           {/* All Runs */}
           <div className='bg-gray-50 shadow3 rounded h-full max-h-[400px] overflow-auto flex-1 flex flex-col'>
                <h1 className='text-[1.5rem] font-bold text-center min-h-[20%] flex items-center justify-center'>
                    All Runs (Speed)
                </h1>

                <div className='w-full h-full'>
                    <List>
                        {allResults.map((item, index) => (
                            <div key={index}>
                                <ListItemButton>
                                  <ListItemText primary={"Index: " + item.currentIndex} secondary={item.text + ": " + item.size} />

                                  <Typography variant="body2" color="textSecondary">
                                      {`(+ ${item.sizeAdded})`}
                                  </Typography>
                                </ListItemButton>
                                {index !== allResults.length - 1 && <Divider />}
                            </div>
                        ))} 
                    </List>
                </div>   
           </div>

        </div>

      </Dialog>
    </React.Fragment>
  );
}