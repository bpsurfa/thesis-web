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

import FLV1 from '../pictures/FLV1.png'
import FLV12 from '../pictures/FLV12.png'
import FLV13 from '../pictures/FLV13.png'
import FLV14 from '../pictures/FLV14.png'
import FLV15 from '../pictures/FLV15.png'
import FLV6 from '../pictures/FLV6.png'

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


export default function FrequencyListV1Dialog({dsDetails, frequencyListV1Dialog, setFrequencyListV1Dialog}) {
  const [domain, server] = useContext(domainContext)

  const handleClose = () => {
    setFrequencyListV1Dialog(false);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = 'FrequencyListV1T.js';
    link.href = `${server}/FrequencyListV1T.js`; 
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
        open={frequencyListV1Dialog}
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

            <Tooltip title="Download the FrequencyListV1T class implementation in javascript">
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
                            
                            <Tooltip title="A special property of custom linked lists. Determines how often a pivot pointer is added.">
                              <ListItemButton> 
                                    <ListItemText primary={"Frequency"} secondary={"Default is every 100 items added."} />
                              </ListItemButton>
                            </Tooltip>
                            <Divider />

                            {/* <Tooltip title="A special property of traditional arrays. The maximum number of items the array can hold before it create and move to a larger array.">
                              <ListItemButton> 
                                    <ListItemText primary={"Capacity"} secondary={"Default capacity is 100."} />
                              </ListItemButton>
                            </Tooltip>
                            <Divider /> */}

                            <ListItemButton>
                                  <ListItemText primary={"Made by"} secondary={"Ralph Matthew De Leon"} />
                            </ListItemButton>
                            <Divider />

                            <ListItemButton>
                                  <ListItemText primary={"Date Created"} secondary={"April 08, 2024"} />
                            </ListItemButton>
                            <Divider />

                            <ListItemButton>
                                  <ListItemText primary={"Last Updated"} secondary={"April 08, 2024"} />
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
                            <Tooltip title="Adds an item to the end of the array. Worst case is O(n) when the array of pivot pointers have to expand in capacity. Otherwise, O(1)">
                              <ListItemButton> 
                                    <ListItemText primary={"add(item)"} secondary={"O(n)"} />
                              </ListItemButton>
                            </Tooltip>
                            <Divider />

                            <Tooltip title="Adds an item after the given index. Worst case is O(n) where n is the number of pivot pointers. When done somwhere at the start of middle, it has to traverse the array of pivot pointers to update the pivot pointers.">
                              <ListItemButton> 
                                    <ListItemText primary={"addAfter(index, item)"} secondary={"O(n)"} />
                              </ListItemButton>
                            </Tooltip>
                            <Divider />

                            <Tooltip title="Retrieves the item from the given index. Actual notation is O(frequency/2) which equates to O(1).">
                              <ListItemButton> 
                                    <ListItemText primary={"get(index)"} secondary={"O(1)"} />
                              </ListItemButton>
                            </Tooltip>
                            <Divider />

                            <Tooltip title="Updates the item from the given index. Actual notation is O(frequency/2) which equates to O(1).">
                              <ListItemButton> 
                                    <ListItemText primary={"update(index, item)"} secondary={"O(1)"}/>
                              </ListItemButton>
                            </Tooltip>
                            <Divider />

                            <Tooltip title="Removes the item from the given index. Worst case is O(n) where n is the number of pivot pointers. When done somwhere at the start of middle, it has to traverse the array of pivot pointers to update the pivot pointers. ">
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
                        <div className="flex-[1] min-h-[30%] text-[1.5rem] font-bold text-gray-800 flex items-end justify-center"> What is Frequency List V1 T</div>
                        <div className="flex-[2] text-[1rem] font-semibold text-gray-700 text-justify px-[10%] py-[5%] leading-loose"> 
                            Frequency List V1 T is a custom doubly linked list that involves putting a pivot pointer at the end of the list every 'frequency' number of items added. 
                            Pivot pointers are maintained at those indeces no matter the case, hence, the name Frequency List. Pivot Pointers are stored in a seperate array, 
                            and its initial size is the frequency value given. Head and Tail is also a pivot pointer but is not stored in pivotArray. 
                            When it comes to traversal, this version is the fastest out of all custom lists as it makes use of the direct access capability 
                            of array to get to the closest pivot pointer; before traversing the actual list from there. It is important to note that this version 
                            naturally occupies more space due to having additional datastructure for pivot pointers. The 'T' in the name indicates multi-threading capability.
                        </div>
                    </div>

                    <div className='w-full h-full flex flex-col gap-5 overflow-auto p-[20px]'>
                        <div className='w-full h-full flex flex-col gap-4 items-center justify-center'>
                            <h1 className='text-[1.2rem] font-bold'>Read Operation</h1>
                            
                            <div className='flex flex-col gap-2 text-justify leading-loose'>
                                <li>
                                    Since it makes use of array to store pivot pointers, traversal is O(1) in notation. Traversal includes computation 
                                    of index of the closest pivot pointer from the given index; traverasing the actual list to the node at given index from there.
                                </li>
                                <li>
                                    Actual speed notation is O(Frequency/2). Pivot pointers are maintained at 'frequency' value indeces, thus, 
                                    the highest number of node traversed will be between two pivot pointers in the actual list.
                                </li>
                                <li>
                                    This traversal method is also applied for delete, update, and addAfterIndex actions as it also has traverse to the node at given index first.
                                </li>
                            </div >
                        </div>

                        <Divider />

                        <div className='w-full h-full flex flex-col gap-4 items-center justify-center'>
                            <h1 className='text-[1.2rem] font-bold'>Write Operation</h1>
                            
                            <div className='flex flex-col gap-2 text-justify leading-loose'>
                                <li> 
                                    For write operations such as addAfterIndex and delete that is done somewhere at the start to the middle of the index, the speed notation 
                                    in worst case O(n), where n is the number of pivot pointers. Pivot pointers must be maintained at 'frequency' indeces, thus, it has to traverse
                                    the array of pivot pointers to update the pointers.
                                </li>
                                <li> 
                                    When write operations are done only at the end of the list (tail), there will be no need to update the pivot pointers as it wont change its position.
                                    This makes the speed notation O(1) in average and O(n) whenever it has to expand.
                                </li>
                                <li> 
                                    The array of pivot pointers also follows the same rules as the regular Dynamic Array T, it has to expand its capacity once became full. This makes
                                    the notation O(n). All multi-threading capability are also applied in this aspect.
                                </li>
                            </div >
                        </div>
                    </div>       
                </div>
            </section>

            <section className='gap-5 p-5'>
              <div className='w-full h-full bg-gray-100 shadow3 rounded flex flex-col'>
                  <div className='w-full h-full min-h-[100px] max-h-[150px] text-gray-800 font-bold text-[1.8rem] flex items-center justify-center bg-[#d8e4f2]'>
                      <h1> Adding an item after the index 2 (3rd Item)</h1>
                  </div>
                  
                  <div className='w-full h-full flex flex-col p-10 gap-5'>
                      <div className='w-full h-auto text-[1.2rem] text-gray-600 font-semibold'>
                        <h3>
                          1. Initial state of the Frequency List V1. Frequency is 4; Current size is 7. Pivot pointers are store in Pivot Array.
                        </h3>
                      </div>
                      
                      <div className='relative ml-5 w-[40%] h-auto'>
                        <img src={FLV1} alt='image representation of array in its initial stae.' className='w-auto h-auto' />    
                      </div>
                  </div>

                  <div className='w-full h-full flex flex-col p-10 gap-5'>
                      <div className='w-full h-auto text-[1.2rem] text-gray-600 font-semibold'>
                        <h3>
                          2. Next step is to get the closest pivot pointer from the given index. Because we are using array to store the pivot pointers, we only have to solve for its index using 
                          Math.round(((index+1) - frequency) / frequency) + 1.
                        </h3>
                      </div>
                      
                      <div className='relative ml-5 w-[20%] h-auto'>
                        <img src={FLV12} alt='image representation of array in its initial stae.' className='w-auto h-auto' />    
                      </div>
                  </div>

                  <div className='w-full h-full flex flex-col p-10 gap-5'>
                      <div className='w-full h-auto text-[1.2rem] text-gray-600 font-semibold'>
                        <h3>
                          3. After retrieving the closest pivot pointer, start traversing the list to get to the node at given index.
                        </h3>
                      </div>
                      
                      <div className='relative ml-5 w-[40%] h-auto'>
                        <img src={FLV13} alt='image representation of array in its initial stae.' className='w-auto h-auto' />    
                      </div>
                  </div>

                  <div className='w-full h-full flex flex-col p-10 gap-5'>
                      <div className='w-full h-auto text-[1.2rem] text-gray-600 font-semibold'>
                        <h3>
                          4. Next step is to create a new node with the given value and connect the pointers accordingly. This follows the same mechanics as the traditional Doubly Linked List.
                        </h3>
                      </div>
                      
                      <div className='relative ml-5 w-[40%] h-auto'>
                        <img src={FLV14} alt='image representation of array in its initial stae.' className='w-auto h-auto' />    
                      </div>
                  </div>

                  <div className='w-full h-full flex flex-col p-10 gap-5'>
                      <div className='w-full h-auto text-[1.2rem] text-gray-600 font-semibold'>
                        <h3>
                          5. To maintain the pivot pointers to stay at 'frequency' indeces, we have to move the pivot pointers greater than and equal to the computed index to left by one. 
                        </h3>
                      </div>
                      
                      <div className='relative ml-5 w-[20%] h-auto'>
                        <img src={FLV15} alt='image representation of array in its initial stae.' className='w-auto h-auto' />    
                      </div>
                  </div>

                  <div className='w-full h-full flex flex-col p-10 gap-5'>
                      <div className='w-full h-auto text-[1.2rem] text-gray-600 font-semibold'>
                        <h3>
                          6. List size is now 8, a multiple of frequency, so we have to set the tail node as pivot pointer and store it in array.
                        </h3>
                      </div>
                      
                      <div className='relative ml-5 w-[20%] h-auto'>
                        <img src={FLV6} alt='image representation of array in its initial stae.' className='w-auto h-auto' />    
                      </div>
                  </div>
              </div>
            </section>
        </main>

      </Dialog>
    </React.Fragment>
  );
}