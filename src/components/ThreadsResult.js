import * as React from 'react';
import { useContext, useEffect, useState, useRef } from 'react';

import { ThreadsDialog } from './CRUD';
import SingleYChart from './SingleYChart'

import {
  exportComponentAsJPEG,
  exportComponentAsPDF,
  exportComponentAsPNG
} from "react-component-export-image";

import ReactToPrint from 'react-to-print';

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

const _ = require('lodash');

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ThreadsResult() {
  const componentRef = useRef();

  const [ threadsDialog, setThreadsDialog, dstructures, openedDSDetails, setOpenedDSDetails] = useContext(ThreadsDialog) 

  const [ allResults, setAllResults ] = useState([])
  const [ output, setOutput] = useState({})

  const handleClose = () => {
    setThreadsDialog(false);
  };

  const saveAsImage = () => {
    let className = 'disable-shadow'

    // disable shadow // shadow is not renderd properly in component to image
    componentRef.current.classList.add(className);
    componentRef.current.querySelectorAll('*').forEach(child => {
      child.classList.add(className);
    });

    exportComponentAsPNG(componentRef)

    // enable shadow
    componentRef.current.classList.remove(className);
    componentRef.current.querySelectorAll('*').forEach(child => {
      child.classList.remove(className);
    });
  }

  // for output card
  const getOutput = () => {
        // getthe the mean and standard deviation
        if(openedDSDetails && openedDSDetails.dsDetails.JSONResults){ // if dstructures are not empty
            let results = JSON.parse(openedDSDetails.dsDetails.JSONResults)

            // Step 1: Calculate the mean
            const sum = results.reduce((total, value) => total + value.threads, 0)
            const mean = sum / results.length;

            // Step 2: Calculate the squared difference between each data point and the mean
            const squaredDifferences = results.map(value => Math.pow(value.threads - mean, 2));

            // Step 3: Find the average of these squared differences
            const averageSquaredDifference = squaredDifferences.reduce((total, value) => total + value, 0) / results.length;

            // Step 4: Take the square root of the average to get the standard deviation
            const standardDeviation = Math.sqrt(averageSquaredDifference) ;

            return {dsname: dstructures[openedDSDetails.dsIndex].dsname, sum, mean, standardDeviation}
        }

        return {}
  }

  // for list of last actions (speed)
  const getAllResultsSummary = () => {
        let arr = []

        if(openedDSDetails && openedDSDetails.dsDetails.JSONResults){ // if dstructures are not empty
            let results = JSON.parse(openedDSDetails.dsDetails.JSONResults)

            let prev = 0

            for(let i = 0; i < results.length; i++){
                let currentIndex = results[i].currentIndex
                let threads = results[i].threads
                let diff = prev - threads // 1 2 = -1 // 2 1 = 1 // 2 2 = 0
                let sign = diff >= 0 ? "+" : "-"

                prev = threads

                arr.push({currentIndex, threads, diff, sign})
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
        open={threadsDialog}
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
            <ReactToPrint
              trigger={() => <Button autoFocus color="inherit"> print </Button>}
              content={() => componentRef.current}
            />
            <Button autoFocus color="inherit" onClick={saveAsImage}>
              save
            </Button>
          </Toolbar>
        </AppBar>

        <div className='w-full h-[50vh] min-h-[450px] flex gap-5 px-5 py-4 box-border flexCol' ref={componentRef}>

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
                      <h2>{dstructures[0].actiontype === "Add" ? "Count:" : "Ending Index:"} {dstructures[0].actioncount}</h2>
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
                            <ListItemText primary={"Overall Count"} secondary={output.sum + " threads"} />
                        </ListItemButton>

                        <Divider />

                        <ListItemButton>

                            <ListItemText primary={"Average Count"} secondary={output.mean + " threads"} />
                        </ListItemButton>

                        <Divider />

                        <ListItemButton>
                            <ListItemText primary={"Standard Deviation"} secondary={output.standardDeviation + " threads"} />
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
                                  <ListItemText primary={"Index: " + item.currentIndex} secondary={"Threads Used: " + item.threads} />

                                  <Typography variant="body2" color="textSecondary">
                                      {`(+ ${item.diff})`}
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