import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate} from "react-router-dom";
import { useForm } from 'react-hook-form';

import axios from 'axios';

import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from 'jwt-decode';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/system/Box';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import TreeList from "../datastructures/TreeList"
import LinkedList from "../datastructures/LinkedList"
import DynamicArray from "../datastructures/DynamicArray";
import FrequencyListV1 from "../datastructures/FrequencyListV1"
import FrequencyListV2 from "../datastructures/FrequencyListV2"

import '../css/index.css';


const Login = () => {
    const domain = 'localhost:3001'

    const navigate = useNavigate();

    //forms
    const { register, handleSubmit, setError, formState: { errors, isSubmitting}} = useForm();

    //useEffects
    useEffect(() => {
        document.title = 'Custom List'; // change tab header/title

        // disable back button
        const disableBackButton = () => {
            window.history.pushState(null, '', window.location.href);
            window.onpopstate = function () {
              window.history.pushState(null, '', window.location.href);
            };
        };
        disableBackButton();

        // Listen for login/logout events from other tabs
        const channel = new BroadcastChannel('auth_channel');
        channel.onmessage = (event) => {
            if (event.data.type === 'login') {
                localStorage.setItem('isLoggedIn', true);
            } else if (event.data.type === 'logout') {
                localStorage.removeItem('isLoggedIn');
            }
        };

        // clean up
        return () => {
            window.onpopstate = null;

            //close the broadcast channel when the component is unmounted
            channel.close();
        };
    }, []);

    // functions
    const onSubmit = async (data) => {
        try {
            data.Origin = "Website"
    
            const response = await axios.post(`http://${domain}/login`, {data,});

            let AccountStatus = response.data[0] ? response.data[0].AccountStatus : ''

            if(!response.data[0]){ // if array is empty
                setError("root", { message: "Login failed. Please try again.",});
            }else if(AccountStatus === "Disabled"){
                setError("root", { message: "Account is disabled.",})
            }else{
                // Check if another instance is already logged in
                const anotherInstanceLoggedIn = localStorage.getItem('isLoggedIn');
                if (anotherInstanceLoggedIn) {
                    setError("root", { message: "Account is logged in another tab.",});
                    return;
                }
                localStorage.setItem('isLoggedIn', true);
                // Attach a listener to detect tab/browser closure
                window.addEventListener('beforeunload', () => {
                    // Send a broadcast message to other tabs
                    const channel = new BroadcastChannel('auth_channel');
                    channel.postMessage({ type: 'logout' });

                    // Clear the flag from localStorage
                    localStorage.removeItem('isLoggedIn');
                });
                // send a message to other tabs
                const channel = new BroadcastChannel('auth_channel');
                channel.postMessage({ type: 'login' });

                // pass the user account details in json format
                const userDetails = JSON.stringify(response.data[0])
                sessionStorage.setItem('userDetails', userDetails);
                
                navigate('/analytics');
            }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    }

    const handleGoogleLogin = async (credentialResponse) => {
        try{
            // let treelist = new TreeList(100)
            // let treeliststr = treelist.toJSON()
            let frequencylistv2 = new FrequencyListV2(100)
            let frequencylistv2str = frequencylistv2.toJSON()

            let frequencylistv1 = new FrequencyListV1(100)
            let frequencylistv1str = frequencylistv1.toJSON()
        
            let linkedlist = new LinkedList()
            let linkedliststr = linkedlist.toJSON()
        
            let dynamicarray = new DynamicArray(100)
            let dynamicarraystr = dynamicarray.toJSON()

            const credentials = jwtDecode(credentialResponse.credential)
          
            const data = {
                Email : credentials.email,
                Password: null,
                ExpirationDate : credentials.exp,
                Firstname : credentials.given_name,
                Lastname : credentials.family_name,
                Origin : "Google",
                Role : "User",
                isVerified: 1,
                // treeliststr,
                frequencylistv2str,
                frequencylistv1str,
                linkedliststr,
                dynamicarraystr,
                AccountStatus: "Operational"
            }

            // const data = {}

            // checks wheter email is already registered 
            let response = await axios.post(`http://${domain}/signup`, {data});
            
            if (!response.data[0]) { // no account yet, register the credentials
                let createdAccountResult = await axios.post(`http://${domain}/signup/createAccount`, {data});
                response = await axios.post(`http://${domain}/signup`, {data});           
            } 

            let AccountStatus = response.data[0].AccountStatus
            if(AccountStatus === "Disabled"){
                setError("root", { message: "Account is disabled.",})
            }else{
                // Check if another instance is already logged in
                const anotherInstanceLoggedIn = localStorage.getItem('isLoggedIn');
                if (anotherInstanceLoggedIn) {
                    setError("root", { message: "Account is logged in another tab.",});
                    return;
                }
                localStorage.setItem('isLoggedIn', true);
                // Attach a listener to detect tab/browser closure
                window.addEventListener('beforeunload', () => {
                    // Send a broadcast message to other tabs
                    const channel = new BroadcastChannel('auth_channel');
                    channel.postMessage({ type: 'logout' });

                    // Clear the flag from localStorage
                    localStorage.removeItem('isLoggedIn');
                });
                // send a message to other tabs
                const channel = new BroadcastChannel('auth_channel');
                channel.postMessage({ type: 'login' });
                
                 // pass the user account details in json format
                const userDetails = JSON.stringify(response.data[0])
                sessionStorage.setItem('userDetails', userDetails);
                navigate('/analytics');
            }
        }catch (error) {
          console.error('Error from handleGoogleLogin() function', error);
        }
    }

    // params
    const params = useParams()

    return (
        <main className="flex justify-center items-center h-screen bg-red-100">
            <div className=" flex flex-col bg-slate-100 min-w-[400px] min-h-[500px] shadow-md rounded-md">
                <section className="flex flex-col flex-[1.5] justify-center items-center gap-2">  
                    <h1 className="text-[1.5rem] font-bold">Login to your account</h1>
                    <h3 className="text-sm">Don't have an account? <Link to="/signup" className="text-blue-500">Sign up here!</Link></h3>
                </section>
                    
                <form className="relative flex flex-col justify-center items-center gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <TextField type="email" label="Email" variant="outlined" sx={{ width: 3/4}} size="small" {...register('Email', { required: true })}/>
                    <TextField type="password" inputProps={{ minLength: 8 }} label="Password" variant="outlined" sx={{ width: 3/4}} size="small"  {...register('Password', { required: true})}/>
                    <Link to="/signup" className=" relative right-[-21%] bottom-2 text-sm text-blue-500">Forgot password?</Link>
                    <Button disabled={isSubmitting} type="submit" variant="contained" sx={{width: 3/4, height:"40px"}}>{isSubmitting ? "Loading" : "Login"}</Button>
                    <h3 className={`${errors.root ? 'block' : 'hidden'} text-red-500 font-bold h-2`}>{errors.root && errors.root.message}</h3>
                </form>

                <div className="h-[100px] flex justify-center items-center gap-5">
                    <div className=" bg-gray-400 h-[1px] w-[30%]"></div>
                    <h2 className="font-bold text-gray-500 text-md"> OR </h2>
                    <div className=" bg-gray-400 h-[1px] w-[30%]"> </div>
                </div>

                <section className="flex justify-center items-start flex-1">
                    <GoogleLogin 
                        onSuccess={handleGoogleLogin}

                        onError={() => {
                            console.log("Login Failed")
                        }}

                        width="300"  style={{ height: '100px' }}
                    />
                </section>
            </div>
        </main>
    );
}
 
export default Login;
