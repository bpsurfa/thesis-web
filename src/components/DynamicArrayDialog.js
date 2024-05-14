import * as React from 'react';
import { useContext, useEffect, useState, useRef } from 'react';

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
import Tooltip from '@mui/material/Tooltip';

import DA1 from '../pictures/DA1.png'
import DA2 from '../pictures/DA2.png'
import DA3 from '../pictures/DA3.png'

import DynamicArray from '../datastructures/DynamicArray';

// imported contexts
import { domainContext, dstructuresContext, AlertDialogContext } from "./mainpage";

const _ = require('lodash');

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

        // if(int === 2){
        //     return "O(log n)"
        // }else if(int === 1){
        //     return "O(n)"
        // }else if(int === 3){
        //     return "O(1)"
        // }


export default function DynamicArrayDialog({dsDetails, dynamicArrayDialog, setDynamicArrayDialog}) {
  const [domain, server] = useContext(domainContext)

  const handleClose = () => {
    console.log(dsDetails)
    setDynamicArrayDialog(false);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = 'DynamicArrayT.js';
    link.href = `${server}/DynamicArrayT.js`; // Adjust the URL as needed
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toPascalCase = (str) => {
    if (!str) return '';

    if(str === "CUSTOM LIST"){
      return "Custom List"
    }else if(str === "TRADITIONAL LIST"){
      return "Traditional List"
    } else {
      return "Traditional Array"
    }
  }

  return (
    <React.Fragment>
      <Dialog
        fullScreen
        open={dynamicArrayDialog}
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
              {dsDetails.dsname}
            </Typography>

            <Tooltip title="Download the DynamicArrayT class implementation in javascript">
              <Button autoFocus color="inherit" onClick={handleDownload}>
                Download 
              </Button>
            </Tooltip>
           
          </Toolbar>
        </AppBar>

  
        <main className='w-full h-full bg-red-50 overflow-auto'>
            {/* parent div for details and public methods */}
            <section className='h-[50%] min-h-[400px] max-h-[50vh] w-full flex gap-5 p-5'>
                {/* details and properties div */}
                <div className='w-full h-full bg-gray-100 shadow3 rounded box-border flex flex-col'>
                    <div className="flex items-center justify-center w-full min-h-[25%] bg-[#d8e4f2]">
                        <h1 className="text-[1.5rem] font-bold text-gray-800"> Details & Properties </h1>
                    </div>

                    <div className='w-full h-full overflow-auto'>
                        <List>
                            <ListItemButton>
                                <ListItemText primary={"Name"} secondary={dsDetails.dsname} />
                            </ListItemButton>
                            <Divider />

                            <ListItemButton>
                                  <ListItemText primary={"Type"} secondary={toPascalCase(dsDetails.type)} />
                            </ListItemButton>
                            <Divider />

                            <ListItemButton>
                                  <ListItemText primary={"Multi-threading"} secondary={dsDetails.threaded === 0 ? "False" : "True"} />
                            </ListItemButton>
                            <Divider />
                      
                            {/* <Tooltip title="Default is every 100 items added.">
                              <ListItemButton> 
                                    <ListItemText primary={"Frequency"} secondary={"A special property of custom linked lists. Determines how often a pivot pointer is added."} />
                              </ListItemButton>
                            </Tooltip>
                            <Divider /> */}

                            <Tooltip title="A special property of traditional arrays. The maximum number of items the array can hold before it create and move to a larger array.">
                              <ListItemButton> 
                                    <ListItemText primary={"Capacity"} secondary={"Default capacity is 100."} />
                              </ListItemButton>
                            </Tooltip>
                            <Divider />

                            <ListItemButton>
                                  <ListItemText primary={"Made by"} secondary={"Ralph Matthew De Leon"} />
                            </ListItemButton>
                            <Divider />

                            <ListItemButton>
                                  <ListItemText primary={"Date Created"} secondary={new Date(dsDetails.datecreated).toLocaleString()} />
                            </ListItemButton>
                            <Divider />

                            <ListItemButton>
                                  <ListItemText primary={"Last Updated"} secondary={new Date(dsDetails.datecreated).toLocaleString()} />
                            </ListItemButton>
                       
                        </List>
                    </div>
                </div>

                {/* public methods div */}
                <div className='w-full h-full bg-gray-100 shadow3 rounded box-border flex flex-col'>
                    <div className="flex items-center justify-center w-full min-h-[25%] bg-[#d8e4f2]">
                        <h1 className="text-[1.5rem] font-bold text-gray-800"> Public Methods </h1>
                    </div>

                    <div className='w-full h-full overflow-auto'>
                        <List>                    
                            <Tooltip title="Adds an item to the end of the array. Has to create and move to a larger array when capacity is reached.">
                              <ListItemButton> 
                                    <ListItemText primary={"add(item)"} secondary={"O(n)"} />
                              </ListItemButton>
                            </Tooltip>
                            <Divider />

                            <Tooltip title="Adds an item after the given index. Has to move all items from the item next to given index to right by one place.">
                              <ListItemButton> 
                                    <ListItemText primary={"addAfter(index, item)"} secondary={"O(n)"} />
                              </ListItemButton>
                            </Tooltip>
                            <Divider />

                            <Tooltip title="Retrieves the item from the given index.">
                              <ListItemButton> 
                                    <ListItemText primary={"get(index)"} secondary={"O(1)"} />
                              </ListItemButton>
                            </Tooltip>
                            <Divider />

                            <Tooltip title="Updates the item from the given index.">
                              <ListItemButton> 
                                    <ListItemText primary={"update(index, item)"} secondary={"O(1)"}/>
                              </ListItemButton>
                            </Tooltip>
                            <Divider />

                            <Tooltip title="Removes the item from the given index. Has to move all items from the item next to given index to left by one place.">
                              <ListItemButton> 
                                    <ListItemText primary={"delete(index)"} secondary={"O(n)"}/>
                              </ListItemButton>
                            </Tooltip>
                            <Divider />
                        </List>
                    </div>
                </div>
            </section>

            <section className='h-[50%] min-h-[400px] w-full flex gap-5 p-5'>
                <div className='w-full h-full bg-gray-100 shadow3 rounded flex'>
                    <div className="min-w-[65%] w-full h-full flex flex-col overflow-auto ">
                        <div className="flex-[1] min-h-[30%] text-[1.5rem] font-bold text-gray-800 flex items-end justify-center"> What is Dynamic Array T</div>
                        <div className="flex-[2] text-[1rem] font-semibold text-gray-700 text-justify px-[10%] py-[5%] leading-loose"> 
                            Dynamic array T is an index-based linear data structure and is a modified version of the traditional array. Unlike the traditional array in some programming languages that have a fixed size, a dynamic array can grow or shrink dynamically based on the number of elements it contains.  Dynamic arrays typically employ techniques such as automatic resizing, memory reallocation, and efficient indexing to provide efficient access and manipulation of elements. In languages, such as javascript, dynamic array is the default implementation of the array. The 'T' in the name indicates multi-threading capability.
                        </div>
                    </div>

                    <div className='w-full h-full flex flex-col gap-5 overflow-auto p-[20px]'>
                        <div className='w-full h-full flex flex-col gap-4 items-center justify-center'>
                            <h1 className='text-[1.2rem] font-bold'>Read Operation</h1>
                            
                            <div className='flex flex-col gap-2 text-justify leading-loose'>
                              <li>When it comes to read operations, arrays are the usually on the top as it can access any element instantaenously. </li>
                            
                            </div >
                        </div>

                        <Divider />

                        <div className='w-full h-full flex flex-col gap-4 items-center justify-center'>
                            <h1 className='text-[1.2rem] font-bold'>Read Operation</h1>
                            
                            <div className='flex flex-col gap-2 text-justify leading-loose'>
                              <li> Write operations are array's weakness. When the capacity is reached, array has to create an entire new array with larger size before transfering the items.</li>
                              <li> When doing write operation somewhere in the middle of the array, it has to move all items to right one by one in order to make a space.</li>
                              <li> When moving items, it assigns two threads to transfer a half of the list each, effectively doubling the speed.</li>
                            </div >
                        </div>
                    </div>       
                </div>
            </section>

            <section className='gap-5 p-5'>
              <div className='w-full h-full bg-gray-100 shadow3 rounded flex flex-col'>
                  <div className='w-full h-full min-h-[100px] max-h-[150px] text-gray-800 font-bold text-[1.8rem] flex items-center justify-center bg-[#d8e4f2]'>
                      <h1> Adding an item in index 1 (2nd Item)</h1>
                  </div>
                  
                  <div className='w-full h-full flex flex-col p-10 gap-5'>
                      <div className='w-full h-auto text-[1.2rem] text-gray-600 font-semibold'>
                        <h3>
                          1. Initial state of the array.
                        </h3>
                      </div>
                      
                      <div className='relative ml-5 w-[30%] h-auto'>
                        <img src={DA1} alt='image representation of array in its initial stae.' className='w-auto h-auto' />    
                      </div>
                  </div>

                  <div className='w-full h-full flex flex-col p-10 gap-5'>
                      <div className='w-full h-auto text-[1.2rem] text-gray-600 font-semibold'>
                        <h3>
                          2. Moving all elements from the specified index to right by 1 place.
                        </h3>
                      </div>
                      
                      <div className='relative ml-5 w-[30%] h-auto'>
                        <img src={DA2} alt='image representation of array in its initial stae.' className='w-auto h-auto' />    
                      </div>
                  </div>

                  <div className='w-full h-full flex flex-col p-10 gap-5'>
                      <div className='w-full h-auto text-[1.2rem] text-gray-600 font-semibold'>
                        <h3>
                          3. Putting the given item to the index
                        </h3>
                      </div>
                      
                      <div className='relative ml-5 w-[30%] h-auto'>
                        <img src={DA3} alt='image representation of array in its initial stae.' className='w-auto h-auto' />    
                      </div>
                  </div>
              </div>
            </section>
        </main>

      </Dialog>
    </React.Fragment>
  );
}