import * as React from 'react';
import { useContext, useEffect, useState, useRef } from 'react';

import { MemoryDialog } from './CRUD';
import DoubleAxesChart from './DoubleAxesChart';

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

export default function MemoryResult() {
  const componentRef = useRef();

  const [ memoryDialog, setMemoryDialog, dstructures, openedDSDetails, setOpenedDSDetails] = useContext(MemoryDialog) 

  const [ averageData, setAverageData ] = useState({})
  const [ allResults, setAllResults ] = useState([])
  const [ allResultsNotation, setAllResultsNotation ] = useState([])

  const handleClose = () => {
    setMemoryDialog(false);
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

  // get average 
  const getAverageData = () => {

      // getthe the mean and standard deviation
      if(openedDSDetails && openedDSDetails.dsDetails.JSONResults){ // if dstructures are not empty
          let results = JSON.parse(openedDSDetails.dsDetails.JSONResults)

          // Step 1: Calculate the mean
          const sum = results.reduce((total, value) => total + value.spaceAdded, 0)
          const roundedSum = Math.floor(sum * 1e6) / 1e6;
          const mean = sum / results.length;
          const roundedMean = Math.floor(mean * 1e6) / 1e6;

          // Step 2: Calculate the squared difference between each data point and the mean
          const squaredDifferences = results.map(value => Math.pow(value.spaceAdded - roundedMean, 2));

          // Step 3: Find the average of these squared differences
          const averageSquaredDifference = squaredDifferences.reduce((total, value) => total + value, 0) / results.length;

          // Step 4: Take the square root of the average to get the standard deviation
          const standardDeviation = Math.sqrt(averageSquaredDifference) ;
          const rounded = Math.floor(standardDeviation * 1e6) / 1e6;

          return {dsname: dstructures[openedDSDetails.dsIndex].dsname, mean: roundedMean, standardDeviation: rounded, memoryAdded: roundedSum}
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
              let spaceAdded = results[i].spaceAdded
              let diff = prev - spaceAdded // 1 2 = -1 // 2 1 = 1 // 2 2 = 0
              let sign = diff >= 0 ? "+" : "-"

              //formatting
              diff = Math.floor(Math.abs(diff) * 1e6) / 1e6;
              spaceAdded = Math.floor(spaceAdded * 1e6) / 1e6;

              prev = spaceAdded
              arr.push({currentIndex, spaceAdded, diff, sign})
          }
      } 
      return arr
  }

  // notation to int
  const notationToInt = (notation) => {
      if(notation === "O(log n)"){
          return 2
      }else if(notation === "O(n)"){
          return 1
      }else if(notation === "O(1)"){
          return 3
      }
  }

  // int to notation
  const intToNotation = (int) => {
      if(int === 2){
          return "O(log n)"
      }else if(int === 1){
          return "O(n)"
      }else if(int === 3){
          return "O(1)"
      }
  }

  // for list of last actions (notation)
  const getAllRunsNotation = () => {
    let arr = []

    if(openedDSDetails && openedDSDetails.dsDetails.JSONResults){ // if dstructures are not empty
        let results = JSON.parse(openedDSDetails.dsDetails.JSONResults)

        let prevNotation

        for(let i = 0; i < results.length; i++){
            let currentIndex = results[i].currentIndex
            let spacenotation = notationToInt(results[i].spacenotation)
            let diff = prevNotation ? spacenotation - prevNotation : 0 
            let sign = diff >= 0 ? "+" : "-"

            prevNotation = spacenotation 

            //formatting
            diff = Math.abs(diff)
            spacenotation = intToNotation(spacenotation)

            arr.push({currentIndex, spacenotation, diff, sign})
        }
    } 
    return arr
}

  // sort the dstructures everytime dstructures is updated
  useEffect(() => {
    setAverageData(getAverageData())
    setAllResults(getAllResultsSummary())
    setAllResultsNotation(getAllRunsNotation())
  }, [openedDSDetails])

  return (
    <React.Fragment>
      <Dialog
        fullScreen
        open={memoryDialog}
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
                  <DoubleAxesChart />
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
                    Memory Usage
                </h1>

                <div className='w-full h-full'>
                    <List>
                        <ListItemButton>
                            <ListItemText primary={"Overall Memory Usage"} secondary={openedDSDetails ? openedDSDetails.dsDetails.space + " bytes" : ""} />
                        </ListItemButton>

                        <Divider />

                        <ListItemButton>
                            <ListItemText primary={"Overall Memory Added"} secondary={averageData.memoryAdded + " bytes"} />
                        </ListItemButton>

                        <Divider />

                        <ListItemButton>

                            <ListItemText primary={"Average Memory Added"} secondary={averageData.mean + " bytes"} />
                        </ListItemButton>

                        <Divider />

                        <ListItemButton>
                            <ListItemText primary={"Standard Deviation"} secondary={averageData.standardDeviation + " bytes"} />
                        </ListItemButton>

                    </List>
                </div>   
           </div>

           {/* All Runs (Speed) */}
           <div className='bg-gray-50 shadow3 rounded h-full max-h-[400px] overflow-auto flex-1 flex flex-col'>
                <h1 className='text-[1.5rem] font-bold text-center min-h-[20%] flex items-center justify-center'>
                    All Runs
                </h1>

                <div className='w-full h-full'>
                    <List>
                        {allResults.map((item, index) => (
                            <div key={index}>
                                <ListItemButton>
                                  <ListItemText primary={"Index: " + item.currentIndex} secondary={item.spaceAdded + ` bytes`} />

                                  <Typography variant="body2" color="textSecondary">
                                      {`(${item.sign} ${item.diff} bytes)`}
                                  </Typography>
                                </ListItemButton>
                                {index !== allResults.length - 1 && <Divider />}
                            </div>
                        ))} 
                    </List>
                </div>   
           </div>

           {/* All Runs (Notation) */}
           <div className='bg-gray-50 shadow3 rounded h-full max-h-[400px] overflow-auto flex-1 flex flex-col'>
                <h1 className='text-[1.5rem] font-bold text-center min-h-[20%] flex items-center justify-center'>
                    All Runs (Notation)
                </h1>

                <h3 className='text-[1rem] flex items-center justify-around gap-3'>
                    <span>O(n) = 1,</span>   
                    <span>O(log n) = 2, </span> 
                    <span>O(1) =3</span>
                </h3>

                <div className='w-full h-full'>
                    <List>
                        {allResultsNotation.map((item, index) => (
                            <div key={index}>
                                <ListItemButton>
                                  <ListItemText primary={"Index: " + item.currentIndex} secondary={item.spacenotation} />

                                  <Typography variant="body2" color="textSecondary">
                                      {`(${item.sign} ${item.diff} level)`}
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