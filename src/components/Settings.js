import React, { 
    createContext, useContext, useState, useEffect, useRef, Fragment
} from "react";


import { useParams, Link, useNavigate} from "react-router-dom";

import { 
    Stack, InputLabel, MenuItem, FormControl, Select, ToggleButton, ToggleButtonGroup, TextField,
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ListItemText, ListItemButton, List,
    Divider, AppBar, Toolbar, IconButton, Typography, CloseIcon, Slide, SearchIconWrapper, StyledInputBase,
    InputBase, InputAdornment
} from '@mui/material'

import Swal from 'sweetalert2'
import axios from 'axios';

import LogoutIcon from '@mui/icons-material/Logout';
import EmailIcon from '@mui/icons-material/Email';

// imported contexts
import { domainContext, dstructuresContext, AlertDialogContext } from "./mainpage";
import { set } from "lodash";

const Settings = ({display}) => {
    const [domain] = useContext(domainContext)

    const navigate = useNavigate();

    // get the user details from login page
    const [userDetails, setUserDetails] = useState(JSON.parse(sessionStorage.getItem('userDetails')));

    // textfields values state
    const [firstname, setFirstname] = useState(userDetails.Firstname);
    const [lastname, setLastname] = useState(userDetails.Lastname);
    const [email, setEmail] = useState(userDetails.Email);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // error messages state
    const [ nameError, setNameError ] = useState([])
    const [ emailError, setEmailError ] = useState([])
    const [ passwordError, setPasswordError ] = useState([])

    // for disabling save button. will disable the button if a value in any textfield has chagned
    const [ valueChanged, setValueChanged ] = useState(true)

    // useContext
    const [ dstructures, setdstructures ] = useContext(dstructuresContext)
    const [ setAlertDialog, setAlertDialogDetails] = useContext(AlertDialogContext)

    const handleLogout = () => {
        const handleConfirm = () => {
            // Send a message to other tabs
            const channel = new BroadcastChannel('auth_channel');
            channel.postMessage({ type: 'logout' });
            // Clear login state from localStorage
            localStorage.removeItem('isLoggedIn');

            sessionStorage.clear();
            
            navigate('/')
        }

        let title = "Confirmation"
        let content = "Are you sure you want to logout?"
        let negativeButton = "Cancel"
        let possitiveButton = "Logout"

        setAlertDialogDetails({handleConfirm, title, content, negativeButton, possitiveButton})
        setAlertDialog(true)
    }

    const handleReset = () => {
        setFirstname(userDetails.Firstname)
        setLastname(userDetails.Lastname)
        setEmail(userDetails.Email)
        setNewPassword('')
        setConfirmPassword('')
        setNameError([])
        setEmailError([])
        setPasswordError([])
    }

    const handleSave = async () => {
        let success = true

        // first name conditions

        let nameErrors = []
        let emailErrors = []
        let passwordErrors = []

        if(firstname.length < 2){
            nameErrors.push("Firstname must contain at least 2 characters.")
            success = false
        }

        if(/\d/.test(firstname)){
            nameErrors.push("Firstname must not contain numericals.")
            success = false
        }   

        // last name conditions
        if(firstname.length < 2){
            nameErrors.push("Lastname must contain at least 2 characters.")
            success = false
        }

        if(/\d/.test(lastname)){
            nameErrors.push("Lastname must not contain numericals.")
            success = false
        }
        
        // email conditions
        let data = {Email: userDetails.Email, Origin: userDetails.Origin}
        let response = await axios.post(`${domain}/signup`, {data});
        if(email !== userDetails.Email && !response.data[0]){ // email already exist
            emailErrors.push("Email is already taken.")
            success = false
        }

        if(!email.includes('@')){
            emailErrors.push("Email must contain exactly one '@' symbol.")
            success = false
        }
    
        // new password conditions
        if(newPassword !== confirmPassword){
            passwordErrors.push("Password does not match.")
            success = false
        }else{
            if( newPassword.length != 0 && newPassword.length < 8){
                passwordErrors.push("New password must contain at least 8 characters")
                success = false
            }
        }

        if(success){
            let Password = passwordErrors.length === 0 && newPassword.length != 0 ? newPassword : userDetails.Password

            data = {Email: email, Password, Firstname: firstname, Lastname: lastname, AccountID: userDetails.AccountID}

            let response = await axios.post(`${domain}/settings/updateUserDetails`, {data});

            // updating userDetails session item
            let newUserDetails = {...userDetails}
            newUserDetails.Firstname = firstname;
            newUserDetails.Lastname = lastname;
            newUserDetails.Email = email;
            newUserDetails.Password = Password
            const updatedUserDetailsString = JSON.stringify(newUserDetails);
            sessionStorage.setItem('userDetails', updatedUserDetailsString);

            // success message
            Swal.fire({
                icon: 'success',
                title: 'Details sucessfully updated! Website must be reloaded.',
                showConfirmButton: true,
                confirmButtonText: 'Reload',
                allowOutsideClick: false
              }).then((result) => {
                if (result.isConfirmed) {
                    window.location.reload(); // so it goes back to analytics tab
                }
            });
        }else{
            setNameError(nameErrors)
            setEmailError(emailErrors)
            setPasswordError(passwordErrors)
        }
        // if succes, give message 
    }

    // for save button to disable when a value has changed
    useEffect(() => {
        let firstnameChanged = firstname !== userDetails.Firstname
        let lastnameChanged = lastname !== userDetails.Lastname
        let emailChanged = email !== userDetails.Email
        let newPasswordChanged = newPassword.length !== 0
        let confirmPasswordChanged = confirmPassword.length !== 0

        setValueChanged(!firstnameChanged && !lastnameChanged && !emailChanged && !newPasswordChanged && !newPasswordChanged && !confirmPasswordChanged)
    }, [firstname, lastname, email, newPassword, confirmPassword])

    // onSubmit={handleSubmit(onSubmit)} for form
    return(
        <section className={`${display} h-full w-full rounded-ss-[8px] rounded-ee-[8px] bg-red-50`}>

            <div className="max-w-[1000px] h-full max-h-[100vh] px-10 py-5 m-auto border-l border-gray-300 bg-slate-50 overflow-auto">
                <form className="w-full h-full flex flex-col"> 

                    {/* tab title and logout */}
                    <section className="flex-1 w-full flex items-start pt-4 min-h-[150px]">
                            <div className="flex-1 flex flex-col justify-center gap-1">
                                <h1 className="text-[1.5rem] font-bold text-gray-800">
                                    Account Settings
                                </h1>
                                <h1 className="text-[.9rem]  text-gray-700">
                                    Update your personal details here
                                </h1>
                            </div>

                            <div className="flex-1 flex items-center justify-end relative top-[10px]">
                                <Button variant="outlined" size="large" color="error" startIcon={<LogoutIcon />} onClick={handleLogout}>
                                    Logout
                                </Button>
                            </div>
                    </section>

                    <Divider />

                    {/* My Profile. How his use profile looks in public */}
                    <section className="flex-1 flex pt-4 min-h-[150px]">
                            <div className="flex-[4] flex flex-col gap-1">
                                <h1 className="text-[1.2rem] font-bold text-gray-800">
                                    User Profile
                                </h1>
                                <h1 className="text-[.9rem]  text-gray-700">
                                    This is how you will be displayed in sections
                                </h1>
                            </div>   

                            <div className="flex-[6]">
                                {/* <TextField id="outlined-basic" label="" variant="outlined" /> */}
                            </div>
                    </section>
                    
                    <Divider />

                    {/* Name Input*/}
                    <section className="flex-1 flex pt-4">
                            <div className="flex-[4] flex flex-col gap-1">
                                <h1 className="text-[1.1rem] font-bold text-gray-800">
                                    Name
                                </h1>
                                {/* <h1 className="text-[.9rem]  text-gray-700">
                                    This is how you will be displayed in sections
                                </h1> */}
                            </div>   

                            <div className="flex-[6] flex flex-col gap-5 min-h-[125px]">
                                <div className="flex gap-5">
                                    <TextField 
                                    id="firstName" 
                                    label="Firstname" 
                                    variant="outlined" 
                                    value={firstname} 
                                    onChange={(event) => setFirstname(event.target.value)}
                                    disabled={userDetails.Origin === "Google"}
                                    />

                                    <TextField 
                                    id="lastName" 
                                    label="Lastname" 
                                    variant="outlined" 
                                    value={lastname} 
                                    onChange={(event) => setLastname(event.target.value)}
                                    disabled={userDetails.Origin === "Google"}
                                    />
                                </div>

                                <div className="flex flex-col gap-5">
                                    {nameError.map((item, index) => (
                                        <div key={index}>
                                            <Typography variant="body1" color="error">
                                                {`${item}`}
                                            </Typography>
                                        </div>
                                    ))} 
                                </div>
                            </div>
                    </section>

                    <Divider />

                    {/* Email Input*/}
                    <section className="flex-1 flex pt-4">
                            <div className="flex-[4] flex flex-col gap-1">
                                <h1 className="text-[1.1rem] font-bold text-gray-800">
                                    Email
                                </h1>
                                {/* <h1 className="text-[.9rem]  text-gray-700">
                                    This is how you will be displayed in sections
                                </h1> */}
                            </div>   

                            <div className="flex-[6] flex flex-col gap-5 min-h-[125px]">
                                <div className="flex gap-5">
                                    <TextField
                                        id="email"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                <EmailIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                        variant="outlined"
                                        value={email} onChange={(event) => setEmail(event.target.value)}
                                        disabled={userDetails.Origin === "Google"}
                                    />
                                </div>

                                <div className="flex flex-col gap-5">
                                    {emailError.map((item, index) => (
                                        <div key={index}>
                                            <Typography variant="body1" color="error">
                                                {`${item}`}
                                            </Typography>
                                        </div>
                                    ))} 
                                </div>
                            </div>
                    </section>

                    <Divider />

                    {/* Change passowrd */}
                    {userDetails.Password && 
                    <section className="flex-1 flex pt-4">
                            <div className="flex-[4] flex flex-col gap-1">
                                <h1 className="text-[1.1rem] font-bold text-gray-800">
                                    Password
                                </h1>
                                <h1 className="text-[.9rem]  text-gray-700">
                                    Fill up to change your current password
                                </h1>
                            </div>   

                            <div className="flex-[6] flex flex-col gap-5 min-h-[125px]">
                                <div className="flex gap-5">
                                    <TextField id="newPassword" label="New Password" variant="outlined" value={newPassword} onChange={(event) => setNewPassword(event.target.value)}/>
                                    <TextField id="confirmPassword" label="Confirm Password" variant="outlined" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)}/>
                                </div>

                                <div className="flex flex-col gap-5">
                                    {passwordError.map((item, index) => (
                                        <div key={index}>
                                            <Typography variant="body1" color="error">
                                                {`${item}`}
                                            </Typography>
                                        </div>
                                    ))} 
                                </div>
                            </div>
                    </section> }
                    
                    {userDetails.Password && <Divider /> }

                    {/* Save */}
                    <section className="flex-1 flex pb-4 min-h-[130px]">
                            {userDetails.Origin === "Website" && 
                                <div className="flex-1 flex gap-5 items-end justify-end">
                                <Button variant="outlined" size="large" onClick={handleReset} color="warning">Reset</Button>
                                <Button variant="contained" size="large" onClick={handleSave} disabled={valueChanged}>Save</Button>
                            </div>}
                    </section>
                </form>
            </div>
        </section>
    )
}

export default Settings;