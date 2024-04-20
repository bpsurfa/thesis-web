import * as React from 'react';
import { useContext, useEffect, useState, useRef } from 'react';

import { LastActionDialog } from './CRUD';
import BarsDataset from './BarsDataSet';

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


export default function LastActionResult() {
  const componentRef = useRef();

  const [lastActionDialog, setLastActionDialog, dstructures] = useContext(LastActionDialog) 

  const [sortedDS, setSortedDS] = useState(() => dstructures)
  const [sortedBySpaceDS, setSortedBySpaceDS] = useState(() => dstructures)

  const [sortedByAverageDS, setSortedByAverageDS] = useState([])

  const handleClose = () => {
    setLastActionDialog(false);
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
      let allResults = []

      // getthe the mean and standard deviation
      if(dstructures[0].JSONResults){
          for(let i = 0; i < dstructures.length; i++){
              let results = JSON.parse(dstructures[i].JSONResults)

              // Step 1: Calculate the mean
              const mean = results.reduce((total, value) => total + value.speedms, 0) / results.length;
              const roundedMean = Math.floor(mean * 1e6) / 1e6;

              // Step 2: Calculate the squared difference between each data point and the mean
              const squaredDifferences = results.map(value => Math.pow(value.speedms - roundedMean, 2));

              // Step 3: Find the average of these squared differences
              const averageSquaredDifference = squaredDifferences.reduce((total, value) => total + value, 0) / results.length;

              // Step 4: Take the square root of the average to get the standard deviation
              const standardDeviation = Math.sqrt(averageSquaredDifference) ;
              const rounded = Math.floor(standardDeviation * 1e6) / 1e6;

              allResults.push({dsname: dstructures[i].dsname, mean: roundedMean, standardDeviation: rounded})
          }
      }

      return _.sortBy(allResults, 'standardDeviation');
  }

  // sort the dstructures everytime dstructures is updated
  useEffect(() => {
    let sortedData = _.sortBy(dstructures, 'speedms');
    let sortedBySpeedData = _.sortBy(dstructures, 'space');
    //let sortedByAverageData = _.sortBy(sortedByAverageDS, 'standardDeviation');

    setSortedDS(sortedData)
    setSortedBySpaceDS(sortedBySpeedData)
    setSortedByAverageDS(getAverageData())
  }, [dstructures])

  return (
    <React.Fragment>
      
      <Dialog
        fullScreen
        open={lastActionDialog}
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
              Last Action Summary
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

        <div className='w-full h-full min-h-[800px] min-w-[1000px] overflow-auto flex flex-col' >
            {/* charts-lastaction div */}
            <div className='flex-1 flex gap-5 px-5 py-4 flexCol' ref={componentRef}>

              {/* charts div */}
              <div className='bg-gray-50 shadow3 rounded flex-[7] relative'>
                  <div className='h-full w-full'>
                      <BarsDataset />
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
            <div className='flex-1 flex px-5 py-4 gap-5'>

                {/* fasteset overall speed div */}
              <div className='bg-gray-50 shadow3 rounded h-full max-h-[400px] overflow-auto flex-1 flex flex-col h450'>
                    <h1 className='text-[1.5rem] font-bold text-center min-h-[20%] flex items-center justify-center'>
                        Fastest Overall Speed
                    </h1>

                    <div className='w-full h-full'>
                        <List>
                            {sortedDS.map((item, index) => (
                                <div key={index}>
                                    <ListItemButton>
                                      <ListItemText primary={(index+1) + ". " + item.dsname} secondary={item.speedms + "ms"} />
                                    </ListItemButton>
                                    {index !== sortedDS.length - 1 && <Divider />}
                                </div>
                            ))}
                        </List>
                    </div>   
              </div>

              {/* fastest average speed */}
              <div className='bg-gray-50 shadow3 rounded h-full max-h-[400px] overflow-auto flex-1 flex flex-col'>
                    <h1 className='text-[1.5rem] font-bold text-center min-h-[20%] flex items-center justify-center'>
                        Fastest Average Speed
                    </h1>

                    <div className='w-full h-full'>
                        <List>
                            {sortedByAverageDS.map((item, index) => (
                                <div key={index}>
                                    <ListItemButton>
                                      <ListItemText primary={(index+1) + ". " + item.dsname} secondary={item.standardDeviation + `ms (Standard Deviation)`} />

                                      <Typography variant="body2" color="textSecondary">
                                          {item.mean + " ms Average Speed"}
                                      </Typography>
                                    </ListItemButton>
                                    {index !== sortedDS.length - 1 && <Divider />}
                                </div>
                            ))}
                        </List>
                    </div>   
              </div>

              {/* lowest memory occupied */}
              <div className='bg-gray-50 shadow3 rounded h-full max-h-[400px] overflow-auto flex-1 flex flex-col'>
                    <h1 className='text-[1.5rem] font-bold text-center min-h-[20%] flex items-center justify-center'>
                        Lowest Memory Usage
                    </h1>

                    <div className='w-full h-full'>
                        <List>
                            {sortedBySpaceDS.map((item, index) => (
                                <div key={index}>
                                    <ListItemButton>
                                      <ListItemText primary={(index+1) + ". " + item.dsname} secondary={item.space + " bytes"} />
                                    </ListItemButton>
                                    {index !== sortedDS.length - 1 && <Divider />}
                                </div>
                            ))}
                        </List>
                    </div>   
              </div>
            </div>
        </div>               

      </Dialog>
    </React.Fragment>
  );
}