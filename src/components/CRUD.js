import React, { 
    createContext, useContext, useState, useEffect, useRef, Fragment
} from "react";

import { useParams, Link, useNavigate} from "react-router-dom";
import { useForm } from 'react-hook-form';

import Tooltip from '@mui/material/Tooltip';

import axios from 'axios';

import pako from 'pako'; // Import Pako.js for compression

import { 
    Stack, InputLabel, MenuItem, FormControl, Select, ToggleButton, ToggleButtonGroup, TextField,
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ListItemText, ListItemButton, List,
    Divider, AppBar, Toolbar, IconButton, Typography, CloseIcon, Slide, SearchIconWrapper, StyledInputBase,
    InputBase
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search';

import { styled, alpha } from '@mui/material/styles';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import "../css/App.css";
import add from "../pictures/add.svg"
import about from "../pictures/about.svg"
import next from "../pictures/next.svg"
import search from "../pictures/search.svg"
import update from "../pictures/update.svg"
import remove from "../pictures/delete.svg"
import barChart from "../pictures/bar chart.svg"
import reset from "../pictures/reset.svg"

import TreeList from "../datastructures/TreeList"
import FrequencyListV1 from "../datastructures/FrequencyListV1"
import FrequencyListV2 from "../datastructures/FrequencyListV2"
import LinkedList from "../datastructures/LinkedList"
import DynamicArray from "../datastructures/DynamicArray";

import LastActionResult from "./LastActionResult";
import SpeedResult from "./SpeedResult"
import SizeResult from "./SizeResult";
import ThreadsResult from "./ThreadsResult"
import MemoryResult from "./MemoryResult";

import DynamicArrayDialog from "./DynamicArrayDialog"
import DoublyLinkedListDialog from "./DoublyLinkedListDialog";
import FrequencyListV1Dialog from "./FrequencyListV1Dialog";
import FrequencyListV2Dialog from "./FrequencyListV2Dialog";

// imported contexts
import { domainContext, dstructuresContext, AlertDialogContext } from "./mainpage";
import { orderBy } from "lodash";

//data context
const DialogContext = createContext();
export const LastActionDialog = createContext();
export const SpeedDialog = createContext();
export const SizeDialog = createContext();
export const ThreadsDialog = createContext();
export const MemoryDialog = createContext();

const CRUD = ({display, charts}) => {
    const [domain] = useContext(domainContext)

    const navigate = useNavigate();
 
    // get the user details from login page
    const userDetails = JSON.parse(sessionStorage.getItem('userDetails'));

    const [ dstructures, setdstructures ] = useContext(dstructuresContext)
  
    const [addModal, setAddModal] = useState([])
    const [getModal, setGetModal] = useState([])
    const [deleteModal, setDeleteModal] = useState([])

    const [maxIndex, setMaxIndex] = useState([])
    
    const[messageModal, setMessageModal] = useState([])
    const[messageModalContent, setMessageModalContent] = useState({type:"Confirmation", message:"Confirmation Message", buttonContent:"Confirm", from:{}})

    // for reset button dialog
    const [resetDialog, setResetDialog] = useState(false)

    // for GENERAL last action result
    const [lastActionDialog, setLastActionDialog] = React.useState(false); 

    // for speed dialog
    const [speedDialog, setSpeedDialog] = useState(false)

    // for size dialog
    const [ sizeDialog, setSizeDialog ] = useState(false)

    // for threads dialog
    const [ threadsDialog, setThreadsDialog] = useState(false)

    // for memory dialog
    const [ memoryDialog, setMemoryDialog ] = useState(false)

    // index of opened dialog
    const [openedDSDetails, setOpenedDSDetails] = useState()

    const executeQuery = (query, parameters, access) => { 
        return new Promise((resolve, reject) => {
            // requests
            if (access === 'read') {
              //ipcRenderer.send('execute-sql-r', query);
            } else if (access === 'write') {
              //ipcRenderer.send('execute-sql-w', query, parameters);
            } else if (access === 'update'){
              //ipcRenderer.send('execute-sql-u', query, parameters);
            } 
            
            // results
            // ipcRenderer.once('sql-results-read', (event, result) => {
            //   console.log('SQL Results:', result);
            //   resolve(result)
            // });
        
            // ipcRenderer.once('sql-error', (event, error) => {
            //   reject(error);
            // });
        });
    };

    let retrieveDS = (result, frequencycapacity) => {
        let dsarr = []

        for(let i = 0; i < result.length; i++){
            let dsinstance
      
            // if(result[i].DSName_CLSC === "Tree List"){
            //     if(result[i].JSONData){
            //         dsinstance = TreeList.parse(result[i].JSONData)
            //     }else{
            //         dsinstance = new TreeList(frequencycapacity || 100)
            //     }
            // }
            if(result[i].DSName_CLSC === "Frequency List V2"){
                if(result[i].JSONData){
                    dsinstance = FrequencyListV2.parse(result[i].JSONData)
                }else{
                    dsinstance = new FrequencyListV2(frequencycapacity || 100)
                }
            }else if(result[i].DSName_CLSC === "Frequency List V1"){
                if(result[i].JSONData){
                    dsinstance = FrequencyListV1.parse(result[i].JSONData)
                }else{
                    dsinstance = new FrequencyListV1(frequencycapacity || 100)
                }
            }else if(result[i].DSName_CLSC === "Doubly Linked List"){
                if(result[i].JSONData){
                    dsinstance = LinkedList.parse(result[i].JSONData)
                }else{
                    dsinstance = new LinkedList()
                }
            }else if(result[i].DSName_CLSC === "Dynamic Array"){
                if(result[i].JSONData){
                    dsinstance = DynamicArray.parse(result[i].JSONData)
                }else{
                    dsinstance = new DynamicArray(frequencycapacity || 100)
                }
            }

            let JSONData = dsinstance.toJSON()
            let initialProperty = dsinstance.getLastActionResult()

            // Decompression process for JSONResults
            let JSONResults = null
            if(result[i].JSONResults){
                // Decode the Base64 string
                const decodedBase64 = atob(result[i].JSONResults);
                // Convert the decoded Base64 string back to a Uint8Array
                const uint8Array = Uint8Array.from(decodedBase64, c => c.charCodeAt(0));
                // Decompress the Uint8Array using Pako.js
                JSONResults = pako.inflate(uint8Array, { to: 'string' });
                // // Parse the decompressed string to get back the original JSON data
                // JSONResults = JSON.parse(decompressedData);
            }
            

            let dsobject = {
                ds: dsinstance,
                dsid: result[i].DSID_CLSC, 
                dsbatch: result[i].DSBatch_CLSC,
                dsname: result[i].DSName_CLSC, 
                threaded: result[i].Threaded, 
              
                type: result[i].Type,
                userpivot: result[i].UserAddedPivot,
                datecreated: result[i].DateCreated,
                JSONData: result[i].JSONData || JSONData,
                frequency: result[i].Type === "TRADITIONAL ARRAY" ? JSON.parse(JSONData).capacity : result[i].Frequency,
                speedms: result[i].SpeedMS,
                threads: result[i].ThreadsUsed,
                size: result[i].Size,
                space: result[i].SpaceOccupied || initialProperty.space,
                spaceAdded: result[i].SpaceAdded || initialProperty.space,
                sizeAdded: result[i].SizeAdded,
                pointersAdded: result[i].PointersAdded,
                actiontype: result[i].ActionType,
                actioninput: result[i].StartingIndex,
                actioncount: result[i].EndIndex_Count,
                inputparameters: result[i].Direction,
                speednotation: result[i].SpeedNotation,
                spacenotation: result[i].SpaceNotation,
                sizepointers: result[i].SizePointers,
                JSONResults: JSONResults, 
                ActionDate: result[i].ActionDate,
                ActionSet: result[i].ActionSet || 0,
                AccountID: userDetails.AccountID
            }

            dsarr.push(dsobject)
        }

        setdstructures(dsarr)
    }

    const updatedsdetails = (result) => {
        setdstructures([...result])
    }

    useEffect(() => {
        document.title = 'Analytics';
        
        if(!userDetails){
            navigate('/');
        }

        setAddModal(document.querySelector('#add-modal'))
        setGetModal(document.querySelector('#get-modal'))
        setDeleteModal(document.querySelector('#delete-modal'))
        setMessageModal(document.querySelector('#message-modal'))
        
        const fetchData = async () => {
            try {                
                //get the last actions and datastructure 
                let response = await axios.post(`${domain}/analytics`, {userDetails});

                console.log(response, "response")

                await retrieveDS(response.data);            
                setMaxIndex(response.data[0].Size === null ? -1 : response.data[0].Size-1 )
            } catch (error) {
              console.error('SQL Error:', error);
            }
        };

        fetchData()
    }, [])

    return(
        <DialogContext.Provider value={[resetDialog, setResetDialog, dstructures, setdstructures, retrieveDS, setMaxIndex]}>
        <LastActionDialog.Provider value={[lastActionDialog, setLastActionDialog, dstructures]}>
        <SpeedDialog.Provider value={[speedDialog, setSpeedDialog, dstructures, openedDSDetails, setOpenedDSDetails]}>
        <SizeDialog.Provider value={[sizeDialog, setSizeDialog, dstructures, openedDSDetails, setOpenedDSDetails]}>
        <ThreadsDialog.Provider value={[threadsDialog, setThreadsDialog, dstructures, openedDSDetails, setOpenedDSDetails]}>
        <MemoryDialog.Provider value={[memoryDialog, setMemoryDialog, dstructures, openedDSDetails, setOpenedDSDetails]}>
            <section className={`${display} bg-[#f8f8fa] h-full w-full rounded-ss-[20px] flex flex-col rounded-ee-[8px]`}>
                <SortHeader updatedsdetails={updatedsdetails} dstructures={dstructures}/>
                <ResetDialog />
                <LastActionResult />
                <SpeedResult />
                <SizeResult />
                <ThreadsResult />
                <MemoryResult />           

                <div className='flex flex-1'>
                    <ActionSideBar addModal={addModal} getModal={getModal} deleteModal={deleteModal} messageModal={messageModal} modalContent={{messageModalContent, setMessageModalContent}}/>
                    
                    <AddDialog addModal={addModal} maxIndex={{maxIndex, setMaxIndex}} datastructures={{dstructures, setdstructures}} updatedsdetails={updatedsdetails} executeQuery={executeQuery}/>
                    <GetDialog getModal={getModal} maxIndex={{maxIndex, setMaxIndex}} datastructures={{dstructures, setdstructures}} updatedsdetails={updatedsdetails} executeQuery={executeQuery}/>
                    <DeleteDialog deleteModal={deleteModal} maxIndex={{maxIndex, setMaxIndex}} datastructures={{dstructures, setdstructures}} updatedsdetails={updatedsdetails} executeQuery={executeQuery}/>
                    <ConfirmDialog messageModal={messageModal} content={{messageModalContent, setMessageModalContent}} ds={{dstructures, setdstructures, retrieveDS, setMaxIndex}} executeQuery={executeQuery} charts={charts}/>
        
                    <div className='flex-1 relative max-h-full max-w-full py-1 overflow-hidden'>
                        <main className='absolute h-full w-full overflow-y-scroll px-5'>

                            {dstructures.map((item, index) => (
                                <DSDetails key={index} dsDetails={item} index={index}/>
                            ))}

                            {/* <DSDetails dsDetails={{}}/>
                            <DSDetails dsDetails={{}}/> */}
                        </main>
                    </div> 
                </div>
            </section>
        </MemoryDialog.Provider>
        </ThreadsDialog.Provider>
        </SizeDialog.Provider>
        </SpeedDialog.Provider>
        </LastActionDialog.Provider>
        </DialogContext.Provider>
    )
}

const AddDialog = ({addModal, maxIndex, datastructures, updatedsdetails, executeQuery}) =>{
    
    const [domain] = useContext(domainContext)

    const formRef = useRef(null);

    const [selectedRadio, setSelectedRadio] = useState('');
    const [indexInput, setIndexInput] = useState('');
    const [countInput, setCountInput] = useState('');

    const [isRadioDisabled, setRadioDisabled] = useState([`block`, false, false]);
    
    let submitModal = () =>{
        addModal.close()
    }

    const handleRadioChange = (event) => {
        setSelectedRadio(event.target.value);
    };

    const handleInputChange = (event) =>{
        setIndexInput(event.target.value)
    }

    const handleInputChangeCount = (event) => {
        setCountInput(event.target.value)
    }

    const compareBigO = (firstBigO, secondBigO) => {
        // Map Big O notations to their corresponding growth rates
        const growthRates = {
          'O(1)': 1,
          'O(log n)': 2,
          'O(n)': 3,
          'O(n log n)': 4,
          'O(n^2)': 5,
          // Add more as needed
        };
      
        // Retrieve growth rates for the provided Big O notations
        const firstRate = growthRates[firstBigO];
        const secondRate = growthRates[secondBigO];
      
        // Check if the provided Big O notations are valid
        if (firstBigO == undefined) {
          return secondBigO
        }
      
        // Compare the growth rates and determine which one is slower or higher
        if (firstRate < secondRate) {
          return secondBigO;
        } else if (firstRate > secondRate) {
          return firstBigO;
        } else {
          return firstBigO;
        }
    }

    const add = async (datastructures, index, count, parameter) => {
        console.log("test")
        index = index == '' ? 0 : parseInt(index)
        count = parseInt(count)
        parameter = parameter == '' ? "Add Start" : parameter

        let updatedds = datastructures.dstructures
 
        let initialSize = updatedds[0].ds.size() 

        // array for storing all results
        // will be used to get average
        let allResults

        for(let i = 0; i < datastructures.dstructures.length; i++){
            allResults = []

            let speedms = 0
            let speednotation
            let spacenotation
            let threads = 0
            let space
            let frequency
            let capacity
            let sizepointers
            let size
            let sizeAdded = 0
            let spaceAdded = 0
            let pointersAdded = 0

            if(initialSize === 0){
                for(let j = 0; j < count; j++){
                    let prevSize = datastructures.dstructures[i].ds.size() // original size before the the action

                    let actionresult = datastructures.dstructures[i].ds.add(0)
                    threads +=  actionresult.threads
                    space = actionresult.space
                    frequency = actionresult.frequency ? actionresult.frequency : null
                    capacity = actionresult.capacity ? actionresult.capacity : null
                    sizepointers = actionresult.sizepointers
                    size = actionresult.size
                    speedms += actionresult.speedms
                    speednotation = compareBigO(speednotation, actionresult.speednotation)
                    spacenotation = compareBigO(spacenotation, actionresult.spacenotation)
                    sizeAdded += actionresult.sizeAdded
                    spaceAdded += actionresult.spaceAdded
                    pointersAdded += actionresult.pointersAdded
                    
                    // for JSONResults
                    actionresult.prevSize = prevSize
                    actionresult.currentIndex = j
                    allResults.push(actionresult)
                }
            }else if(parameter === "Add After"){
                for(let j = index; j < index + count; j++){
                    let prevSize = datastructures.dstructures[i].ds.size() // original size before the the action

                    let actionresult = datastructures.dstructures[i].ds.addAfterIndex(j, 0)
                    threads +=  actionresult.threads
                    space = actionresult.space
                    frequency = actionresult.frequency ? actionresult.frequency : null
                    capacity = actionresult.capacity ? actionresult.capacity : null
                    sizepointers = actionresult.sizepointers
                    size = actionresult.size
                    speedms += actionresult.speedms
                    speednotation = compareBigO(speednotation, actionresult.speednotation)
                    spacenotation = compareBigO(spacenotation, actionresult.spacenotation)
                    sizeAdded += actionresult.sizeAdded
                    spaceAdded += actionresult.spaceAdded
                    pointersAdded += actionresult.pointersAdded
                    
                    // for JSONResults
                    actionresult.prevSize = prevSize
                    actionresult.currentIndex = j
                    allResults.push(actionresult)
                }   
            }else{
                console.log("Add Before");
            }

            updatedds[i].speedms = Math.floor(speedms * 1e6) / 1e6
            updatedds[i].speednotation = speednotation
            updatedds[i].spacenotation = spacenotation
            updatedds[i].threads = threads
            updatedds[i].space = space
            updatedds[i].frequency = frequency
            updatedds[i].capacity = capacity
            updatedds[i].sizepointers = sizepointers
            updatedds[i].size = size
            updatedds[i].sizeAdded = sizeAdded
            updatedds[i].spaceAdded = spaceAdded
            updatedds[i].pointersAdded = pointersAdded
            updatedds[i].actiontype = "Add"
            updatedds[i].actioninput = index
            updatedds[i].actioncount = count
            updatedds[i].inputparameters = parameter
            updatedds[i].ActionSet += 1
            updatedds[i].JSONData = updatedds[i].ds.toJSON()

            // COMPRESSING THE JSONRESULTS 
            // for actionresults table 
            let JSONResults = JSON.stringify(allResults)
            // conver to Unit8Array
            const toUnit8Array = new TextEncoder().encode(JSONResults);
            // Compress JSONResults using Pako.js
            const compressedData = pako.deflate(toUnit8Array)
            // Encode the compressed data to Base64
            const compressedJSONResults = btoa(String.fromCharCode.apply(null, compressedData));
            updatedds[i].JSONResults = compressedJSONResults

            const currentDate = new Date();
            const formattedDateTime = currentDate.toISOString().slice(0, 19).replace('T', ' ');
            updatedds[i].ActionDate = formattedDateTime

            // add results to actionresults table
            let insertActionResults = await axios.post(`${domain}/analytics/add/insertActionResults`, {actionResults : updatedds[i]});

            updatedds[i].JSONResults = JSONResults // so JSONResults doesnt become the compressed version for other components

            // // udpate JSONData column of datstructures table
            // let updateJSONData = await axios.post('http://localhost:3001/analytics/add/updateJSONData', {JSONData, DSID});

            // this has been removed since capacity in database is now the initial capacity 
            // // update capacity
            // if(updatedds[i].dsname === "Dynamic Array"){
            //     let updateCapacity = await axios.post('http://localhost:3001/analytics/add/updateCapacity', {DSData : updatedds[i]});
            // }  
        }

        maxIndex.setMaxIndex(maxIndex.maxIndex += count)    
        updatedsdetails(updatedds)
    }

    const handleSubmit = (event) => {
        event.preventDefault(); 

        const index = indexInput;
        const count = countInput
        const parameter = index === '' ? '' : "Add After";

        add(datastructures, index, count, parameter)

        setSelectedRadio('')
        setIndexInput('')
        setCountInput('')
        event.target.reset()
        submitModal()
    };

    useEffect(() => {
        let size = datastructures.dstructures[0].size;

        if(size === 0 || size == undefined){
            setRadioDisabled([`hidden`, true, true])
        }else{
            setRadioDisabled([`block`, false, false])
        }

    }, [datastructures.dstructures])

    return(
        <dialog id="add-modal" className="p-5 ring-1 ring-gray-400">
            <form ref={formRef} onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                    <div>
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Adding a node</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">This action will be applied to every datastructure.</p>
                    </div>
                    
                    <div className="relative">
                        <label htmlFor="add-index" className={`${isRadioDisabled[0]} bg-white text-sm font-medium leading-6 text-gray-900`}>Starting Index (max index is {maxIndex.maxIndex === -1 ? 0 : maxIndex.maxIndex})</label>
                        <input required type="number" name="index" value={indexInput} onChange={handleInputChange} disabled={isRadioDisabled[1]} min={0} max={maxIndex.maxIndex === -1 ? 0 : maxIndex.maxIndex} placeholder={"e.g. '8'"} id="add-index" autoComplete="given-name" 
                        className={`${isRadioDisabled[0]} w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 
                        ring-inset ring-gray-300 placeholder:text-gray-400 border-none focus:ring-2 focus:ring-inset outline-none focus:ring-indigo-400 sm:text-sm sm:leading-6`}/>
                    </div>

                    <div className="relative">
                        <label htmlFor="add-index-count" className=" bg-white text-sm font-medium leading-6 text-gray-900">Count (number of item to be added; server limit is 3000)</label>
                        <input required type="number" name="count" value={countInput} onChange={handleInputChangeCount} min={1} max={3000} placeholder={"e.g. '10'"} id="add-index-count" autoComplete="given-name" className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 
                        ring-inset ring-gray-300 placeholder:text-gray-400 border-none focus:ring-2 focus:ring-inset outline-none focus:ring-indigo-400 sm:text-sm sm:leading-6"/>
                    </div>

                    <div className="flex gap-5 ">
                        <div className="flex items-center gap-x-3 cursor-pointer">
                            <input required id="push-everything" name="add-parameter" value="Add Before" onClick={handleRadioChange} type="radio" disabled //disabled={isRadioDisabled[1]} 
                            className={`${isRadioDisabled[0]} hidden cursor-pointer h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600`}/>
                            <label htmlFor="push-everything" className={`${isRadioDisabled[0]} hidden cursor-pointer text-sm font-medium leading-6 text-gray-900`}>Add Before</label>
                        </div>

                        <div className="flex items-center gap-x-3 cursor-pointer">
                            <input id="push-email" name="add-parameter" value="Add After" type="radio" onClick={handleRadioChange} disabled //disabled={isRadioDisabled[1]} 
                            className={`${isRadioDisabled[0]} hidden cursor-pointer h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600`}/>
                            <label htmlFor="push-email" className={`${isRadioDisabled[0]} hidden cursor-pointer text-sm font-medium leading-6 text-gray-900`}>Add After</label>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-x-6">
                        <button onClick={submitModal} type="button" className="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
                        <button  type="submit" className="rounded-md w-[100px] bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm 
                        hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Add</button>
                    </div>
                </div>
            </form> 
        </dialog>
    )
}

const GetDialog = ({getModal, maxIndex, datastructures, updatedsdetails, executeQuery}) =>{
    const [domain] = useContext(domainContext)

    const formRef = useRef(null);

    const [indexInput, setIndexInput] = useState('');
    const [countInput, setCountInput] = useState('');

    let submitModal = () =>{
        getModal.close()
    }

    const handleInputChange = (event) =>{
        setIndexInput(event.target.value)
    }

    const handleInputChangeCount = (event) => {
        setCountInput(event.target.value)
    }

    const compareBigO = (firstBigO, secondBigO) => {
        // Map Big O notations to their corresponding growth rates
        const growthRates = {
          'O(1)': 1,
          'O(log n)': 2,
          'O(n)': 3,
          'O(n log n)': 4,
          'O(n^2)': 5,
          // Add more as needed
        };
      
        // Retrieve growth rates for the provided Big O notations
        const firstRate = growthRates[firstBigO];
        const secondRate = growthRates[secondBigO];
      
        // Check if the provided Big O notations are valid
        if (firstBigO == undefined) {
          return secondBigO
        }
      
        // Compare the growth rates and determine which one is slower or higher
        if (firstRate < secondRate) {
          return secondBigO;
        } else if (firstRate > secondRate) {
          return firstBigO;
        } else {
          return firstBigO;
        }
    }


    const get = async (datastructures, index, count) => {
        let updatedds = datastructures.dstructures

        // array for storing all results
        // will be used to get average
        let allResults

        for(let i = 0; i < datastructures.dstructures.length; i++){
            allResults = []

            let speedms = 0
            let speednotation
            let spacenotation
            let threads = 0
            let space
            let frequency
            let capacity 
            let sizepointers
            let size
            let sizeAdded = 0
            let spaceAdded = 0
            let pointersAdded = 0
            let parameter

            if(index >= count){
                parameter = "Left"

                for(let j = index; j >= count; j--){ 
                    let prevSize = datastructures.dstructures[i].ds.size() // original size before the the action

                    let actionresult = datastructures.dstructures[i].ds.get(j)
                    threads +=  actionresult.threads
                    space = actionresult.space
                    frequency = actionresult.frequency ? actionresult.frequency : null
                    capacity = actionresult.capacity ? actionresult.capacity : null
                    sizepointers = actionresult.sizepointers
                    size = actionresult.size
                    speedms += actionresult.speedms
                    speednotation = compareBigO(speednotation, actionresult.speednotation)
                    spacenotation = compareBigO(spacenotation, actionresult.spacenotation)
                    sizeAdded += actionresult.sizeAdded
                    spaceAdded += actionresult.spaceAdded
                    pointersAdded += actionresult.pointersAdded

                     // for JSONResults
                    actionresult.prevSize = prevSize
                    actionresult.currentIndex = j
                    allResults.push(actionresult)
                }
            }else if(index < count){
                parameter = "Right"

                for(let j = index; j <= count; j++){
                    let prevSize = datastructures.dstructures[i].ds.size() // original size before the the action

                    let actionresult = datastructures.dstructures[i].ds.get(j)
                    threads +=  actionresult.threads
                    space = actionresult.space
                    frequency = actionresult.frequency ? actionresult.frequency : null
                    capacity = actionresult.capacity ? actionresult.capacity : null
                    sizepointers = actionresult.sizepointers
                    size = actionresult.size
                    speedms += actionresult.speedms
                    speednotation = compareBigO(speednotation, actionresult.speednotation)
                    spacenotation = compareBigO(spacenotation, actionresult.spacenotation)
                    sizeAdded += actionresult.sizeAdded
                    spaceAdded += actionresult.spaceAdded
                    pointersAdded += actionresult.pointersAdded

                    // for JSONResults
                    actionresult.prevSize = prevSize
                    actionresult.currentIndex = j
                    allResults.push(actionresult)
                }
            }

            updatedds[i].speedms = Math.floor(speedms * 1e6) / 1e6
            updatedds[i].speednotation = speednotation
            updatedds[i].spacenotation = spacenotation
            updatedds[i].threads = threads
            updatedds[i].space = space
            updatedds[i].frequency = frequency
            updatedds[i].capacity = capacity
            updatedds[i].sizepointers = sizepointers
            updatedds[i].size = size
            updatedds[i].sizeAdded = sizeAdded
            updatedds[i].spaceAdded = spaceAdded
            updatedds[i].pointersAdded = pointersAdded
            updatedds[i].actiontype = "Get"
            updatedds[i].actioninput = index
            updatedds[i].actioncount = count
            updatedds[i].inputparameters = parameter
            updatedds[i].ActionSet += 1
            updatedds[i].JSONData = updatedds[i].ds.toJSON()
            
            // COMPRESSING THE JSONRESULTS 
            // for actionresults table 
            let JSONResults = JSON.stringify(allResults)
            // conver to Unit8Array
            const toUnit8Array = new TextEncoder().encode(JSONResults);
            // Compress JSONResults using Pako.js
            const compressedData = pako.deflate(toUnit8Array)
            // Encode the compressed data to Base64
            const compressedJSONResults = btoa(String.fromCharCode.apply(null, compressedData));
            updatedds[i].JSONResults = compressedJSONResults

            const currentDate = new Date();
            const formattedDateTime = currentDate.toISOString().slice(0, 19).replace('T', ' ');
            updatedds[i].ActionDate = formattedDateTime

            // add results to actionresults table
            let insertActionResults = await axios.post(`${domain}/analytics/add/insertActionResults`, {actionResults : updatedds[i]});

            updatedds[i].JSONResults = JSONResults // so JSONResults doesnt become the compressed version for other components
        }

        updatedsdetails(updatedds)
    }

    const handleSubmit = (event) => {
        event.preventDefault(); 

        let index = parseInt(indexInput);
        let count = parseInt(countInput)

        let ds = datastructures.dstructures[0].ds

        if(count >= ds.size()){
            count = ds.size() - 1
        }else if(count < 0){
            count = 0
        }

        get(datastructures, index, count)

        setIndexInput('')
        setCountInput('')
        event.target.reset()
        submitModal()
    };

    return(
        <dialog id="get-modal" className="p-5 ring-1 ring-gray-400">
            <form ref={formRef} onSubmit={handleSubmit}>
                <div className="flex flex-col gap-5">
                    <div>
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Getting a Node</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">This action will be applied to every datastructure.</p>
                    </div>
                    
                    <div className="relative">
                        <label htmlFor="get-index" className=" bg-white text-sm font-medium leading-6 text-gray-900">From Index (max index is {maxIndex.maxIndex === -1 ? 0 : maxIndex.maxIndex})</label>
                        <input type="number" name="index" value={indexInput} onChange={handleInputChange} min={0} max={maxIndex.maxIndex === -1 ? 0 : maxIndex.maxIndex} placeholder={"e.g. '8'"} id="get-index" autoComplete="given-name" className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 
                        ring-inset ring-gray-300 placeholder:text-gray-400 border-none focus:ring-2 focus:ring-inset outline-none focus:ring-indigo-400 sm:text-sm sm:leading-6"/>
                    </div>

                    <div className="relative">
                        <label htmlFor="get-index-count" className=" bg-white text-sm font-medium leading-6 text-gray-900">To Index (server limit is 3000)</label>
                        <input type="number" name="count" value={countInput} onChange={handleInputChangeCount} min={0} max={3000} placeholder={"e.g. '10'"} id="get-index-count" autoComplete="given-name" className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 
                        ring-inset ring-gray-300 placeholder:text-gray-400 border-none focus:ring-2 focus:ring-inset outline-none focus:ring-indigo-400 sm:text-sm sm:leading-6"/>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button onClick={submitModal} type="button" className="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
                        <button  type="submit" className="rounded-md w-[100px] bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm 
                        hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Get</button>
                    </div>
                </div>
            </form> 
        </dialog>
    )
}

const DeleteDialog = ({deleteModal, maxIndex, datastructures, updatedsdetails, executeQuery}) =>{
    const [domain] = useContext(domainContext)

    const formRef = useRef(null);

    const [indexInput, setIndexInput] = useState('');
    const [countInput, setCountInput] = useState('');

    let submitModal = () =>{
        deleteModal.close()
    }

    const handleInputChange = (event) =>{
        setIndexInput(event.target.value)
    }

    const handleInputChangeCount = (event) => {
        setCountInput(event.target.value)
    }

    const compareBigO = (firstBigO, secondBigO) => {
        // Map Big O notations to their corresponding growth rates
        const growthRates = {
          'O(1)': 1,
          'O(log n)': 2,
          'O(n)': 3,
          'O(n log n)': 4,
          'O(n^2)': 5,
          // Add more as needed
        };
      
        // Retrieve growth rates for the provided Big O notations
        const firstRate = growthRates[firstBigO];
        const secondRate = growthRates[secondBigO];
      
        // Check if the provided Big O notations are valid
        if (firstBigO == undefined) {
          return secondBigO
        }
      
        // Compare the growth rates and determine which one is slower or higher
        if (firstRate < secondRate) {
          return secondBigO;
        } else if (firstRate > secondRate) {
          return firstBigO;
        } else {
          return firstBigO;
        }
    }

    const remove = async (datastructures, index, count) => {
        let updatedds = datastructures.dstructures

        // array for storing all results
        // will be used to get average
        let allResults
        
        for(let i = 0; i < datastructures.dstructures.length; i++){
            allResults = []

            let speedms = 0
            let speednotation
            let spacenotation
            let threads = 0
            let space
            let frequency
            let capacity
            let sizepointers
            let size
            let sizeAdded = 0
            let spaceAdded = 0
            let pointersAdded = 0
            let parameter

            if(index >= count){
                parameter = "Left"

                for(let j = index; j >= count; j--){ 
                    let prevSize = datastructures.dstructures[i].ds.size() // original size before the the action

                    let actionresult = datastructures.dstructures[i].ds.delete(count)
                    threads +=  actionresult.threads
                    space = actionresult.space
                    frequency = actionresult.frequency ? actionresult.frequency : null
                    capacity = actionresult.capacity ? actionresult.capacity : null
                    sizepointers = actionresult.sizepointers
                    size = actionresult.size
                    speedms += actionresult.speedms
                    speednotation = compareBigO(speednotation, actionresult.speednotation)
                    spacenotation = compareBigO(spacenotation, actionresult.spacenotation)
                    sizeAdded += actionresult.sizeAdded
                    spaceAdded += actionresult.spaceAdded
                    pointersAdded += actionresult.pointersAdded

                    // for JSONResults
                    actionresult.prevSize = prevSize
                    actionresult.currentIndex = j
                    allResults.push(actionresult)     

                }
            }else if(index < count){
                parameter = "Right"

                for(let j = index; j <= count; j++){
                    let prevSize = datastructures.dstructures[i].ds.size() // original size before the the action

                    let actionresult = datastructures.dstructures[i].ds.delete(index)
                    threads +=  actionresult.threads
                    space = actionresult.space
                    frequency = actionresult.frequency ? actionresult.frequency : null
                    capacity = actionresult.capacity ? actionresult.capacity : null
                    sizepointers = actionresult.sizepointers
                    size = actionresult.size
                    speedms += actionresult.speedms
                    speednotation = compareBigO(speednotation, actionresult.speednotation)
                    spacenotation = compareBigO(spacenotation, actionresult.spacenotation)
                    sizeAdded += actionresult.sizeAdded
                    spaceAdded += actionresult.spaceAdded
                    pointersAdded += actionresult.pointersAdded

                    // for JSONResults
                    actionresult.prevSize = prevSize
                    actionresult.currentIndex = j
                    allResults.push(actionresult)
                }
            }

            updatedds[i].speedms = Math.floor(speedms * 1e6) / 1e6
            updatedds[i].speednotation = speednotation
            updatedds[i].spacenotation = spacenotation
            updatedds[i].threads = threads
            updatedds[i].space = space
            updatedds[i].frequency = frequency
            updatedds[i].capacity = capacity
            updatedds[i].sizepointers = sizepointers
            updatedds[i].size = size
            updatedds[i].sizeAdded = sizeAdded
            updatedds[i].spaceAdded = spaceAdded
            updatedds[i].pointersAdded = pointersAdded
            updatedds[i].actiontype = "Delete"
            updatedds[i].actioninput = index
            updatedds[i].actioncount = count
            updatedds[i].inputparameters = parameter
            updatedds[i].ActionSet += 1
            updatedds[i].JSONData = updatedds[i].ds.toJSON()

            // COMPRESSING THE JSONRESULTS 
            // for actionresults table 
            let JSONResults = JSON.stringify(allResults)
            // conver to Unit8Array
            const toUnit8Array = new TextEncoder().encode(JSONResults);
            // Compress JSONResults using Pako.js
            const compressedData = pako.deflate(toUnit8Array)
            // Encode the compressed data to Base64
            const compressedJSONResults = btoa(String.fromCharCode.apply(null, compressedData));
            updatedds[i].JSONResults = compressedJSONResults

            const currentDate = new Date();
            const formattedDateTime = currentDate.toISOString().slice(0, 19).replace('T', ' ');
            updatedds[i].ActionDate = formattedDateTime

            // // for datstructures table 
            // let JSONData = updatedds[i].ds.toJSON()
            // let DSID = updatedds[i].dsid

            // add results to actionresults table
            let insertActionResults = await axios.post(`${domain}/analytics/add/insertActionResults`, {actionResults : updatedds[i]});

            updatedds[i].JSONResults = JSONResults // so JSONResults doesnt become the compressed version for other components

            // // udpate JSONData column of datstructures table
            // let updateJSONData = await axios.post('http://localhost:3001/analytics/add/updateJSONData', {JSONData, DSID}); 
        }

        maxIndex.setMaxIndex(updatedds[0].ds.size() -1) 
        updatedsdetails(updatedds)
    }

    const handleSubmit = (event) => {
        event.preventDefault(); 

        let index = parseInt(indexInput);
        let count = parseInt(countInput)

        let ds = datastructures.dstructures[0].ds

        if(count >= ds.size()){
            count = ds.size() - 1
        }else if(count < 0){
            count = 0
        }

        remove(datastructures, index, count)

        setIndexInput('')
        setCountInput('')
        event.target.reset()
        submitModal()
    };


    return(
        <dialog id="delete-modal" className="p-5 ring-1 ring-gray-400">
            <form ref={formRef} onSubmit={handleSubmit}>
                <div className="flex flex-col gap-5">
                    <div>
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Deleting a node</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">This action will apply to every datastructure.</p>
                    </div>
                    
                    <div className="relative">
                        <label htmlFor="delete-index" className=" bg-white text-sm font-medium leading-6 text-gray-900">From Index (max index is {maxIndex.maxIndex === -1 ? 0 : maxIndex.maxIndex})</label>
                        <input type="number" name="index" value={indexInput} onChange={handleInputChange} min={0} max={maxIndex.maxIndex === -1 ? 0 : maxIndex.maxIndex} placeholder={"e.g. '8'"} id="delete-index" autoComplete="given-name" className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 
                        ring-inset ring-gray-300 placeholder:text-gray-400 border-none focus:ring-2 focus:ring-inset outline-none focus:ring-indigo-400 sm:text-sm sm:leading-6"/>
                    </div>

                    <div className="relative">
                        <label htmlFor="delete-index-count" className=" bg-white text-sm font-medium leading-6 text-gray-900">To Index (server limit is 3000)</label>
                        <input type="number" name="count" value={countInput} onChange={handleInputChangeCount} min={0} max={3000} placeholder={"e.g. '10'"} id="delete-index-count" autoComplete="given-name" className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 
                        ring-inset ring-gray-300 placeholder:text-gray-400 border-none focus:ring-2 focus:ring-inset outline-none focus:ring-indigo-400 sm:text-sm sm:leading-6"/>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button onClick={submitModal} type="button" className="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
                        <button  type="submit" className="rounded-md w-[100px] bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm 
                        hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Delete</button>
                    </div>
                </div>
            </form> 
        </dialog>
    )
}

const ConfirmDialog = ({messageModal, content, ds, executeQuery, charts}) =>{
    const formRef = useRef(null);

    let submitModal = () =>{
        messageModal.close()
    }

    const DataOptionsTemplate = () => {
        const options = {
            plugins: { 
              title: {
                display: true,
                text: "",
                font: {
                  size: 15,
                },
                margin: {
                  top: 20,
                },
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Data Structures', 
                  color: 'black',
                  font: {
                    size: 10,
                  },
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Speed in millisecond', 
                  color: 'black',
                  font: {
                    size: 10,
                  },
                },
                ticks: {
                    callback: function (value, index, values) {
                      // Format the tick value to display up to 6 decimals
                      return Math.floor(value * 1e6) / 1e6
                    },
                },
              },
            },
        };
    
        let data = {
            labels: [""],
            datasets: []
        }
    
        return [data, options]
    }

    const handleSubmit = (event) => {
        event.preventDefault(); 
        
        let from = content.messageModalContent.from 

        if(from === "CRUD-Reset"){
            let dscount = ds.dstructures.length
            let batch

            const getHighestBatch = async () =>{
                let batchqry = `SELECT COALESCE(MAX(dsbatch), 0) + 1 as dsbatch FROM dsdetails`
                let result = await executeQuery(batchqry, [], 'read');
                batch = result[0].dsbatch

                for(let i = 0; i < dscount; i++){
                    //dsbatch, dsname, threaded, frequency, type, userpivot, datecreated, dsdata
                    //ds={{dstructures, setdstructures, retrieveDS, setMaxIndex}}
                    let dsname = ds.dstructures[i].dsname
                    let threaded = ds.dstructures[i].threaded
                    let frequency = dsname === "Doubly Linked List" ? 0 : 100
                    let type = ds.dstructures[i].type
                    let userpivot = ds.dstructures[i].userpivot
                    let datecreated = "12-31-2022 2:30 PM"
                    let dsdata 

                    if(dsname === "Tree List")
                        dsdata = new TreeList(100).toJSON()
                    else if(dsname === "Doubly Linked List")
                        dsdata = new LinkedList(100).toJSON()
                    else if(dsname === "Dynamic Array")
                        dsdata = new DynamicArray(100).toJSON()
                    
                    let parameters = [
                        batch, 
                        dsname, 
                        threaded, 
                        frequency, 
                        type, 
                        userpivot,
                        datecreated,
                        dsdata
                    ];
    
                    let insertqry = `INSERT INTO dsdetails 
                                    (dsbatch, dsname, threaded, frequency, type, userpivot, datecreated, dsdata) 
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ? )`
    
                    result = await executeQuery(insertqry, parameters, 'write');
                }

                let qry = `
                SELECT ds.*, ar.actionnumber, ar.actiontype, ar.actioninput, ar.actioncount, ar.inputparameters, ar.speedms, ar.speednotaion, ar.size, ar.sizepointers, ar.space, ar.spacenotation, ar.threads, ar.sizeAdded, ar.spaceAdded, ar.pointersAdded
                FROM dsdetails ds
                LEFT JOIN (
                    SELECT *
                    FROM actionresults ar_inner
                    WHERE ar_inner.actionnumber = (
                        SELECT MAX(actionnumber)
                        FROM actionresults
                        WHERE dsid = ar_inner.dsid
                    )
                ) ar ON ds.dsid = ar.dsid
                WHERE ds.dsbatch = ${batch};`;

                result = await executeQuery(qry, [1,2,3], 'read');
                ds.retrieveDS(result);
                ds.setMaxIndex(result[0].size === null ? -1 : result[0].size-1)
            }

            getHighestBatch()
        }else if(from === "CRUD-Flatten"){

            const fetch = async () => {
                
              
                let dstructures = ds.dstructures
                let dsCount = dstructures.length
                let actiontype = dstructures[0].actiontype
                let actioninput = dstructures[0].actioninput
                let actioncount = dstructures[0].actioncount
                let actionparameters = dstructures[0].actionparameters
                let initialListSize = dstructures[0].size - dstructures[0].sizeAdded
                let initialArraySize = dstructures[2].frequency - dstructures[2].sizeAdded
                let colors = ["#a8c7ff", "#ff9696", "#96ffcc"]
                let datasets

                //speed related
                let speedArr = DataOptionsTemplate()
                datasets = []
                speedArr[1].plugins.title.text = [`Speed of ${actiontype} Action From Index ${actioninput} to ${actioncount};`, `Initial List Size: ${initialListSize}, Array Size: ${initialArraySize}`] ;
                speedArr[1].scales.x.title.text = "Data Structures";
                speedArr[1].scales.y.title.text = "Speed in Millisecond";

                for(let i = 0; i < dsCount; i++){
                    let dataObject = {
                        label: dstructures[i].dsname,
                        data: [dstructures[i].speedms],
                        backgroundColor: colors[i]
                    }

                    datasets.push(dataObject)
                }

                speedArr[0].datasets = datasets
                charts.setLastSpeedBarData(speedArr[0])
                charts.setLastSpeedBarDataOptions(speedArr[1])

                
                // size related
                let sizeArr = DataOptionsTemplate()
                datasets = []
                sizeArr[1].plugins.title.text = [`Size Added from ${actiontype}ing Index ${actioninput} to ${actioncount};`, `Initial List Size: ${initialListSize}, Array Size: ${initialArraySize}`] ;
                sizeArr[1].scales.x.title.text = "Data Structures";
                sizeArr[1].scales.y.title.text = "Number of Size Added";

                for(let i = 0; i < dsCount; i++){
                    let dataObject = {
                        label: dstructures[i].dsname,
                        data: [dstructures[i].sizeAdded],
                        backgroundColor: colors[i]
                    }

                    datasets.push(dataObject)
                }

                sizeArr[0].datasets = datasets
                charts.setLastSizeBarData(sizeArr[0])
                charts.setLastSizeBarDataOptions(sizeArr[1])

                // space related
                let spaceArr = DataOptionsTemplate()
                datasets = []
                spaceArr[1].plugins.title.text = [`Memory Added from ${actiontype}ing Index ${actioninput} to ${actioncount};`, `Initial List Size: ${initialListSize}, Array Size: ${initialArraySize}`] ;
                spaceArr[1].scales.x.title.text = "Data Structures";
                spaceArr[1].scales.y.title.text = "Memory Added in Bytes";

                for(let i = 0; i < dsCount; i++){
                    let dataObject = {
                        label: dstructures[i].dsname,
                        data: [dstructures[i].spaceAdded],
                        backgroundColor: colors[i]
                    }

                    datasets.push(dataObject)
                }

                spaceArr[0].datasets = datasets
                charts.setLastSpaceBarData(spaceArr[0])
                charts.setLastSpaceBarDataOptions(spaceArr[1])

                // threads related
                let threadsArr = DataOptionsTemplate()
                datasets = []
                threadsArr[1].plugins.title.text = [`Total Threads Used from ${actiontype}ing Index ${actioninput} to ${actioncount};`, `Initial List Size: ${initialListSize}, Array Size: ${initialArraySize}`] ;
                threadsArr[1].scales.x.title.text = "Data Structures";
                threadsArr[1].scales.y.title.text = "Count of Threads";

                for(let i = 0; i < dsCount; i++){
                    let dataObject = {
                        label: dstructures[i].dsname,
                        data: [dstructures[i].threads],
                        backgroundColor: colors[i]
                    }

                    datasets.push(dataObject)
                }

                threadsArr[0].datasets = datasets
                charts.setLastThreadsBarData(threadsArr[0])
                charts.setLastThreadsBarDataOptions(threadsArr[1])


                let chartPanel = document.querySelector("#Charts")
                chartPanel.click()
            }

            fetch()
        }

        submitModal()
    };


    return(
        <dialog id="message-modal" className="p-5 ring-1 ring-gray-400">
            <form ref={formRef} onSubmit={handleSubmit}>
                <div className="flex flex-col gap-5">
                    <div>
                        <h2 className="text-base font-semibold leading-7 text-gray-900">{content.messageModalContent.type}</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">{content.messageModalContent.message}</p>
                    </div>
                    
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button onClick={submitModal} type="button" className="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
                        <button  type="submit" className="rounded-md w-[100px] bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm 
                        hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">{content.messageModalContent.buttonContent}</button>
                    </div>
                </div>
            </form> 
        </dialog>
    )
}

const ResetDialog = () => { 
    const [domain] = useContext(domainContext)

    const 
        [resetDialog, setResetDialog, 
        dstructures, setdstructures, 
        retrieveDS, 
        setMaxIndex] = useContext(DialogContext)
    
    const userDetails = JSON.parse(sessionStorage.getItem('userDetails'));
    const accountID = userDetails.AccountID

    //const [frequencyCapacity, setFrequencyCapacity] = useState(100);
    
    const onConfirm = async (frequencyCapacity) => {      
        // getting the current highest batch of an account
        let getHighestBatch = await axios.post(`${domain}/analytics/reset/getHighestBatch`, {accountID});
        let highestBatch = getHighestBatch.data[0].DSBatch
        // let highestBatch = dstructures[0].dsbatch

        //create new instance of datastructures in 'datastructures' table
        // let treelist = new TreeList(frequencyCapacity)
        // let treeliststr = treelist.toJSON()
        
        let frequencylistv2 = new FrequencyListV2(100)
        let frequencylistv2str = frequencylistv2.toJSON()

        let frequencylistv1 = new FrequencyListV1(100)
        let frequencylistv1str = frequencylistv1.toJSON()
        
        let linkedlist = new LinkedList()
        let linkedliststr = linkedlist.toJSON()
        
        let dynamicarray = new DynamicArray(100)
        let dynamicarraystr = dynamicarray.toJSON()

        let batch = highestBatch + 1
        let data = {accountID, batch, frequencylistv2str, frequencylistv1str, linkedliststr, dynamicarraystr, frequencyCapacity}

        let initializeDS = await axios.post(`${domain}/analytics/reset/initializeDS`, {data});

        //update last used batch from accounts table
        let updateLastUsedDSBatch = await axios.post(`${domain}/analytics/reset/updateLastUsedDSBatch`, {data});

        //get the last actions and datastructure 
        let response = await axios.post(`${domain}/analytics`, {userDetails});
        let newDataStructures = response.data

        //update states
        retrieveDS(newDataStructures, frequencyCapacity);
        setMaxIndex(-1)

        // close the dialog
        handleClose()
    }

    const handleClose = () => {
        //setFrequencyCapacity(100)
        setResetDialog(false)
    }

    return (
        <Fragment>
            <Dialog
                open={resetDialog}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"

                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                      event.preventDefault();
                      const formData = new FormData(event.currentTarget);
                      const formJson = Object.fromEntries(formData.entries());
                      let frequencyCapacity = formJson.frequencyCapacity;
                      frequencyCapacity = parseInt(frequencyCapacity, 10);  

                      onConfirm(frequencyCapacity)
                      handleClose();
                    },
                }}
            >
                <DialogTitle id="alert-dialog-title">
                {"Confirmation to reset"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Resetting the datastructures will revert back all datastructures in its initial state.
                </DialogContentText>
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="name"
                    name="frequencyCapacity"
                    label="Frequency / Capacity"
                    type="number"
                    fullWidth
                    variant="standard"
                    defaultValue={100}
                    InputProps={{
                        inputProps: { 
                            min: 10 
                        }
                    }}
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                {/* <Button onClick={onConfirm} autoFocus>
                    Confirm
                </Button> */}
                <Button type="submit">
                    Confirm
                </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    )
}

const DSDetails = ({dsDetails, index}) => {
    const [ dynamicArrayDialog, setDynamicArrayDialog ] = useState(false)
    const [ doublyLinkedListDialog, setDoublyLinkedListDialog ] = useState(false)
    const [ frequencyListV1Dialog, setFrequencyListV1Dialog ] = useState(false)
    const [ frequencyListV2Dialog, setFrequencyListV2Dialog ] = useState(false)

    const print = () => {
        if(dsDetails.dsname === "Dynamic Array"){
            setDynamicArrayDialog(true)
        }else if(dsDetails.dsname === "Doubly Linked List"){
            setDoublyLinkedListDialog(true)
        }else if(dsDetails.dsname === "Frequency List V1"){
            setFrequencyListV1Dialog(true)
        }else if(dsDetails.dsname === "Frequency List V2"){
            setFrequencyListV2Dialog(true)
        }
    }

    useEffect(() => {
  
        const slider = document.querySelectorAll('.items');
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.forEach(makeDragScroll)

        function makeDragScroll(slider){
            slider.addEventListener('mousedown', (e) => {
                isDown = true;
                slider.classList.add('active');
                startX = e.pageX - slider.offsetLeft;
                scrollLeft = slider.scrollLeft;
                slider.style.cursor='grabbing'
            });
            slider.addEventListener('mouseleave', () => {
                isDown = false;
                slider.classList.remove('active');
                slider.style.cursor='grab'
            });
            slider.addEventListener('mouseup', () => {
                isDown = false;
                slider.classList.remove('active');
                slider.style.cursor='grab'
            });
            slider.addEventListener('mousemove', (e) => {
                if(!isDown) return;
                e.preventDefault();
                const x = e.pageX - slider.offsetLeft;
                const walk = (x - startX); //scroll-fast
                slider.scrollLeft = scrollLeft - walk;
            });
        }
    }, [])


    return( 
        <section className='bg-gradient-to-l from-red-50 to-[#f7f6ed75] rounded-md max-w-full 
        w-full h-[200px] min-h-[200px] my-5 flex gap-20 shadow3 items cursor-grab  overflow-x-hidden'>

            <DynamicArrayDialog dsDetails={dsDetails} dynamicArrayDialog={dynamicArrayDialog} setDynamicArrayDialog={setDynamicArrayDialog}/>
            <DoublyLinkedListDialog dsDetails={dsDetails} doublyLinkedListDialog={doublyLinkedListDialog} setDoublyLinkedListDialog={setDoublyLinkedListDialog} />
            <FrequencyListV1Dialog dsDetails={dsDetails} frequencyListV1Dialog={frequencyListV1Dialog} setFrequencyListV1Dialog={setFrequencyListV1Dialog}/>
            <FrequencyListV2Dialog dsDetails={dsDetails} frequencyListV2Dialog={frequencyListV2Dialog} setFrequencyListV2Dialog={setFrequencyListV2Dialog}/>

            <div className='h-full min-w-[400px] flex flex-col relative'>
                <Tooltip title="How it works">
                    <img src={about} onClick={print} className='w-[1.6rem] absolute left-1 top-1 cursor-pointer'></img>
                </Tooltip>
                <div className='flex-[2] flex justify-center items-center text-[1.5rem] font-bold font-sans text-gray-700'>
                    <h1>{dsDetails.dsname}</h1>
                </div>

                <div className='flex-[1] grid grid-cols-2 grid-rows-3 justify-items-left text-sm left-12 relative text-gray-500'>
                    <h4>Threaded: <span className='font-bold text-gray-600 text-md float'>{dsDetails.threaded === 0 ? "FALSE" : "TRUE"}</span></h4>
                    <Tooltip 
                        title={
                            dsDetails.dsname === "Dynamic Array" ? 
                            "A special property of traditional arrays. The maximum number of items the array can hold before it create and move to a larger array." : 
                            "A special property of custom linked lists. Determines how often a pivot pointer is added."
                        }
                    >
                        <h4>{dsDetails.dsname === "Dynamic Array" ? "Capacity: " : "Frequency: "} 
                            <span className='font-bold text-gray-600 text-md'>{dsDetails.frequency || dsDetails.capacity || 0}</span>
                        </h4>
                    </Tooltip>
                    <h4>Type: <span className='font-bold text-gray-600 text-md'>{dsDetails.type}</span></h4>
                    {/* {dsDetails.dsname === "Dynamic Array" ? null : <h4>User-added Pivot: <span className='font-bold text-gray-600 text-md'>{dsDetails.userpivot}</span></h4>} */}
                </div>
            </div>
            
            <div className='h-full flex gap-10 py-4 px-4'>
                <DSDetailsItems dsDetails={dsDetails} dsIndex={index} title={["Speed", "Time Complexity"]} value={[dsDetails.speedms, dsDetails.speednotation]} unit={["milliseconds", "Big-O"]}/>
                <DSDetailsItems dsDetails={dsDetails} dsIndex={index} title={dsDetails.dsname !== "Dynamic Array" ? ["Size", "Pivot Count", "Size Added", "Pointers Added"] : ["Size", "Capacity Added"]} value={dsDetails.dsname !== "Dynamic Array" ? [dsDetails.size, dsDetails.sizepointers, dsDetails.sizeAdded, dsDetails.pointersAdded] : [dsDetails.size, dsDetails.sizeAdded]} unit={["count", "count", "count", "count"]}/>
                <DSDetailsItems dsDetails={dsDetails} dsIndex={index} title={["Threads"]} value={[dsDetails.threads]} unit={["count"]}/>
                <DSDetailsItems dsDetails={dsDetails} dsIndex={index} title={["Memory", "Space Complexity", "Memory Added"]} value={[dsDetails.space, dsDetails.spacenotation, dsDetails.spaceAdded]} unit={["bytes", "Big-O", "bytes"]}/>
            </div>
        </section>
    )
}

const DSDetailsItems = ({title, value, unit, dsDetails, dsIndex}) => {
    const [index, setIndex] = useState(0)
    
    // context for speed dialog - linkedlist
    const [ speedDialog, setSpeedDialog, dstructures, openedDSDetails, setOpenedDSDetails] = useContext(SpeedDialog)

    // context for speed dialog 
    const [ sizeDialog, setSizeDialog] = useContext(SizeDialog)

    // context for threads dialog
    const [ threadsDialog, setThreadsDialog ] = useContext(ThreadsDialog)

    //context for memroy dialog 
    const [ memoryDialog, setMemoryDialog] = useContext(MemoryDialog)

    // context for alert dialog
    const [setAlertDialog, setAlertDialogDetails] = useContext(AlertDialogContext)

    const speedNext = () => {
        let size = value.length

        console.log(title, value)

        if(index === size-1){
            setIndex(0)
        }else{
            setIndex(index + 1)
        }
    }

    const openDialog = () =>{
        let hasRecord = dstructures[0].actiontype != null

        if(hasRecord){
            if(title[0] === "Speed"){
                setOpenedDSDetails({dsDetails, dsIndex, currentDialog : "Speed"})
                setSpeedDialog(true)
            }else if(title[0] === "Size"){
                setOpenedDSDetails({dsDetails, dsIndex, currentDialog : "Size"})
                setSizeDialog(true)
            }else if(title[0] === "Threads"){
                setOpenedDSDetails({dsDetails, dsIndex, currentDialog : "Threads"})
                setThreadsDialog(true)
            }else if(title[0] === "Memory"){
                setOpenedDSDetails({dsDetails, dsIndex, currentDialog : "Memory"})
                setMemoryDialog(true)
            }    
        }else{
            let handleConfirm = undefined
            let title = "Notice"
            let content = "Action cannot be done: no output is recorded for this batch"
            let negativeButton = undefined
            let possitiveButton = "Ok"

            setAlertDialogDetails({handleConfirm, title, content, negativeButton, possitiveButton})
            setAlertDialog(true)
        }
    }

    return(
        <Tooltip 
            title={
                title[index] === "Speed" ? "Total execution time of the last action" : 
                title[index] === "Time Complexity" ? "Worst case Big O notation of time complexity from the last action" :
                title[index] === "Capacity Added" ? "Number of capacity added from the last action" :
                title[index] === "Size" ? "Number of items this datastructure is currently holding" :
                title[index] === "Pivot Count" ? "Number of pivot pointers this datastructure is currently holding" :
                title[index] === "Size Added" ? "Number of items added or deleted from the last action" :
                title[index] === "Pointers Added" ? "Number of pivot pointers added or deleted from the last action" :
                title[index] === "Threads" ? "Number of threads used from the last action" :
                title[index] === "Memory" ? "Total number of space allocated by this datastructure" :
                title[index] === "Space Complexity" ? "Worst case Big O notation of space complexity from the last action" :
                title[index] === "Memory Added" ? "Number of space allocated added from the last action" : ""
            }
        >
            <div className='relative bg-[#ffffff80] min-h-full w-[200px] min-w-[200px] rounded-lg flex flex-col shadow1'> 
                <Tooltip title="Last action summary">
                    <img src={about} onClick={openDialog} className='w-[1.5rem] absolute left-1 top-1 cursor-pointer'></img>
                </Tooltip>
                {title[index] !== "Threads" ? ( // dont load next button if its threads
                    <Tooltip title="Next data">
                        <img src={next} onClick={speedNext} className='w-[1.6rem] absolute right-1 top-1 cursor-pointer'></img>
                    </Tooltip>
                ) : null}
                <div className='flex flex-col w-full h-full justify-center items-center flex-[7]'>
                    <h1 className='flex-[8] flex justify-center items-center text-[1.5rem] font-bold relative top-3'>
                        {value[index] === null ? "N/A" : value[index]}
                    </h1>
                    <h2 className='flex-[3] text-gray-500'>
                        {unit[index]}
                    </h2>
                </div>

                <div className='shadow w-full h-full flex-[3] flex justify-center items-center bg-slate-200 rounded-es-lg rounded-ee-lg font-semibold text-gray-800'>
                    <h2 className=''>
                        {title[index]}
                    </h2>
                </div>
            </div>
        </Tooltip>
    ) 
}

const SortHeader = ({updatedsdetails, dstructures}) => {
    const [sortBy, setSortBy] = React.useState('type');
    const [orderBy, setOrderBy] = React.useState('dsc');

    //styles
    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        height : '45px',
        backgroundColor: alpha('#e7eef6', 1),
        '&:hover': {
          backgroundColor: alpha('#dfe9f5', 1),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing(1),
          width: 'auto',
        },
      }));
      
      const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }));
      
      const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        width: '100%',
        '& .MuiInputBase-input': {
          padding: theme.spacing(1.5, 1, 0, 0),
          // vertical padding + font size from searchIcon
          paddingLeft: `calc(1em + ${theme.spacing(4)})`,
          transition: theme.transitions.create('width'),
          [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
              width: '20ch',
            },
          },
        },
      }));

    const handleSortByChange = (event) => { // dropdowns or filters
        setSortBy(event.target.value)
    };

    const handleOrderByChange = (event, newOrderBy) => {
        setOrderBy(newOrderBy || orderBy)
    };

    useEffect(() => {
        let sortedArray

        if(sortBy === "type"){
            if(!dstructures[0].type) return () => {};
            
            if(orderBy === "dsc"){
                sortedArray = dstructures.sort((a, b) => a.type.localeCompare(b.type));
            }else{
                sortedArray = dstructures.sort((a, b) => b.type.localeCompare(a.type));
            }
        }else if(sortBy === "name"){
            if(!dstructures[0].dsname) return () => {};
            
            if(orderBy === "dsc"){
                sortedArray = dstructures.sort((a, b) => a.dsname.localeCompare(b.dsname));
            }else{
                sortedArray = dstructures.sort((a, b) => b.dsname.localeCompare(a.dsname));
            }
        }else if(sortBy === "speed"){
            if(!dstructures[0].speedms) return () => {};
            
            if(orderBy === "dsc"){
                sortedArray = dstructures.sort((a, b) => b.speedms - a.speedms);
            }else{
                sortedArray = dstructures.sort((a, b) => a.speedms - b.speedms);
            }
        }else if(sortBy === "memory"){
            if(!dstructures[0].space) return () => {};
            
            if(orderBy === "dsc"){
                sortedArray = dstructures.sort((a, b) => b.space - a.space);
            }else{
                sortedArray = dstructures.sort((a, b) => a.space - b.space);
            }
        }

        updatedsdetails(sortedArray)
    }, [sortBy, orderBy])

    useEffect(() => {
        // return sort components to default values after reset
        if(dstructures[0].speedms === null){
            setSortBy('type');
            setOrderBy('dsc');
        }
    }, [dstructures])
    
    return(
        <section className='bg-[#f8f8fa] h-16 w-full flex rounded-ss-[8px] shadow z-10'>
            <div className='min-w-[13rem] bg-[#d7e9f0] rounded-ss-[8px]'></div>

            <div className="flex w-full">
                <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={3} marginX={4} width={"100%"}>
                    {/* <Tooltip title="Component is under maintenance"> */}
                        <FormControl sx={{ minWidth: 200 }} size="small">
                            <InputLabel id="demo-select-small-label">Sort by</InputLabel>
                            <Select
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                value={sortBy}
                                label="Sort by"
                                disabled={dstructures[0].speedms === null ? true : false}
                                onChange={handleSortByChange}
                            >
                                {/* <MenuItem value="">
                                <em>None</em>
                                </MenuItem> */}
                                <MenuItem value={"type"}>Type</MenuItem>
                                <MenuItem value={"name"}>Name</MenuItem>
                                <MenuItem value={"speed"}>Speed</MenuItem>
                                <MenuItem value={"memory"}>Memory</MenuItem>
                            </Select>
                        </FormControl>
                    {/* </Tooltip> */}

                    {/* <FormControl sx={{ minWidth: 200 }} size="small">
                        <InputLabel id="demo-select-small-label">Group by</InputLabel>
                        <Select
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            value={age}
                            label="Group by"
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                            <em>None</em>
                            </MenuItem>
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl> */}

                    {/* <Tooltip title="Component is under maintenance"> */}
                        <ToggleButtonGroup
                            color="primary"
                            value={orderBy}
                            exclusive
                            onChange={handleOrderByChange}
                            aria-label="Platform"
                            disabled={dstructures[0].speedms === null ? true : false}
                            sx={{height: "65%"}}
                            >
                            <ToggleButton value="asc">Ascending</ToggleButton>
                            <ToggleButton value="dsc">Descending</ToggleButton>
                        </ToggleButtonGroup>
                    {/* </Tooltip> */}
                </Stack>

                <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={0} marginX={3} width={"100%"}>
                    <Tooltip title="Component is under maintenance">
                        <Search size="large">
                            <SearchIconWrapper>
                            <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                            />
                        </Search>
                    </Tooltip>
                </Stack>
            </div>
        </section>
    )
}

const ActionSideBar = ({addModal, getModal, deleteModal, messageModal, modalContent}) => {
    return(
        <section className="bg-[#edeef3]  w-52 h-full flex flex-col p-2 px-3 gap-3"> 
            <ActionSideBarItem logo={add} title="Add" hoverColor="bg-[#afdbc080]" modal={addModal}/>
            <ActionSideBarItem logo={update} title="Get / Update" hoverColor="bg-[#ccd8ed]" modal={getModal}/>
            <ActionSideBarItem logo={remove} title="Delete" hoverColor="bg-[#d6aeae90]" modal={deleteModal}/>
            <div className="mx-auto w-[75%] h-[1px] m-1 bg-[rgba(0,0,0,.1)]"></div>
            <ActionSideBarItem logo={barChart} title="Last Action" hoverColor="bg-[#dce0e095]" modal={messageModal} modalContent={modalContent}/>
            <ActionSideBarItem logo={reset} title="Reset" hoverColor="bg-[#dce0e095]" modal={messageModal} modalContent={modalContent}/>
        </section>
    )
}

const ActionSideBarItem = (props) => {
    const [resetDialog, setResetDialog] = useContext(DialogContext)
    const [lastActionDialog, setLastActionDialog] = useContext(LastActionDialog)
    const [setAlertDialog, setAlertDialogDetails, dstructures] = useContext(AlertDialogContext)

    // previous version of dialog
    let openModal = () => {
        let hasActionRecord = dstructures[0].JSONResults // jsonresults will only have a vanlue after an action
        let size = dstructures[0].size || 0
       
        if(props.title==="Reset"){
            if(!hasActionRecord){
                let handleConfirm = undefined
                let title = "Notice"
                let content = "Action cannot be done: datastructures are already in its initial state"
                let negativeButton = undefined
                let possitiveButton = "Ok"

                setAlertDialogDetails({handleConfirm, title, content, negativeButton, possitiveButton})
                setAlertDialog(true)
            }else{
                setResetDialog(true)
            }
        }else if(props.title==="Last Action"){
            if(!hasActionRecord){
                let handleConfirm = undefined
                let title = "Notice"
                let content = "Action cannot be done: no output is recorded for this batch"
                let negativeButton = undefined
                let possitiveButton = "Ok"

                setAlertDialogDetails({handleConfirm, title, content, negativeButton, possitiveButton})
                setAlertDialog(true)
            }else{
                setLastActionDialog(true)
            }
        }else{
            if(size === 0 && props.title !== "Add"){
                let handleConfirm = undefined
                let title = "Notice"
                let content = "Action cannot be done: data structures are currently empty."
                let negativeButton = undefined
                let possitiveButton = "Ok"

                setAlertDialogDetails({handleConfirm, title, content, negativeButton, possitiveButton})
                setAlertDialog(true)
            }else{
                props.modal.showModal(); 
            }
        }
    }

    return(  
        <div onClick={openModal} className={`flex p-4 gap-2 items-center  ${props.hoverColor}
        cursor-pointer rounded transition-all duration-200 shadow2 hover:shadow-md ring-1 ring-[#7a7e8250]`}>
            <img src={props.logo} className='w-[1.6rem]'></img>
            <span className='text-[rgba(0,0,0,.6)] font-bold text-md text-stroke'>{props.title}</span>
        </div>         
    )
}
 
export default CRUD;