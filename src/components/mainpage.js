import React, { useState, useEffect, createContext } from "react";
import { useNavigate } from 'react-router-dom';

import "../css/App.css";
import SideBar from "./SideBar";
import Header from "./Header";
import CRUD from "./CRUD";
import Charts from "./Charts"
import Dashboard from "./Dashboard";
import Settings from "./Settings"
import Admin from "./Admin"
import About from "./About"

//import dialogs
import { AlertDialog } from "./AlertDialog"

export const AlertDialogContext = createContext();
export const dstructuresContext = createContext();
export const domainContext = createContext();

function App() {
  const domain = `http://localhost:3001` // domain name
  const server = `http://localhost:3000` // server 

  // if userdetails is empty. user trying to directly access mainpage without login
  if(!sessionStorage.getItem('userDetails')){
    window.location.href = '/';
  }

  const navigate = useNavigate();

  // get the user details from login page
  const [userDetails, setUserDetails] = useState(JSON.parse(sessionStorage.getItem('userDetails')));

  const [dstructures, setdstructures] = useState([{}, {}, {}])

  const [analyticsOpen, setAnalyticsOpen] = useState('block')
  // const [chartsOpen, setChartsOpen] = useState('hidden')
  const [dashboardOpen, setDashboardOpen] = useState('hidden')
  const [settingsOpen, setSettingsOpen] = useState('hidden')
  const [adminOpen, setAdminOpen] = useState('hidden')
  const [aboutOpen, setAboutOpen] = useState('hidden')

  const [cpo, scpo] = useState(() => setAnalyticsOpen)


  const [analyticsHighlight, setAnalyticsHighlight] = useState("bg-[#f8f8fa]")
  const [dashboardHighlight, setDashboardHighlight] = useState("transparent hover:bg-[#23406b20]") // a.k.a history
  const [settingsHighlight, setSettingsHighlight] = useState("transparent hover:bg-[#23406b20]") 
  const [adminHighlight, setAdminHighlight] = useState("transparent hover:bg-[#23406b20]") 
  const [aboutHighlight, setAboutHighlight] = useState("transparent hover:bg-[#23406b20]")

  const [ch, sch] = useState(() => setAnalyticsHighlight)

  const [headerTitle, setHeaderTitle] = useState("Analytics")

  // alert dialog state
  const [alertDialog, setAlertDialog] = React.useState(false);
  const [alertDialogDetails, setAlertDialogDetails] = React.useState({})
  
  useEffect(() => {
    navigate('/analytics');
    localStorage.setItem('isLoggedIn', true);
    
    // for back button - redirects user to login
    const handleBackButton = () => {
      // Send a message to other tabs
      const channel = new BroadcastChannel('auth_channel');
      channel.postMessage({ type: 'logout' });
      // Clear login state from localStorage
      localStorage.removeItem('isLoggedIn');

      sessionStorage.clear();
      navigate('/')
    };

    window.addEventListener('popstate', handleBackButton);
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [])

  return (
    <domainContext.Provider value={[domain, server]}>
    <dstructuresContext.Provider value={[dstructures, setdstructures]}>
    <AlertDialogContext.Provider value={[setAlertDialog, setAlertDialogDetails, dstructures]}>
        <AlertDialog 
            alertDialog={alertDialog} 
            setAlertDialog={setAlertDialog} 
            handleConfirm={alertDialogDetails.handleConfirm} 
            text={{
                title: alertDialogDetails.title,
                content: alertDialogDetails.content,
                negativeButton : alertDialogDetails.negativeButton,
                possitiveButton : alertDialogDetails.possitiveButton
            }}
        />

        <div className="App">
          <div className="flex flex-col h-screen w-screen overflow-auto">
                {/* <Header headerTitle={headerTitle}/> */}

                <div className="bg-[#d5e3f2] flex flex-1 rounded-es-[8px] rounded-ee-[8px]">
                    <SideBar setHeaderTitle={setHeaderTitle} 
                        highlight={{ch, sch, analyticsHighlight, setAnalyticsHighlight, dashboardHighlight, setDashboardHighlight, settingsHighlight, setSettingsHighlight, adminHighlight, setAdminHighlight, aboutHighlight, setAboutHighlight}} 
                        currentPanelOpened={cpo} 
                        setCurrentPanelOpened={scpo} 
                        setDashboardOpen={setDashboardOpen} 
                        setAnalyticsOpen = {setAnalyticsOpen} 
                        setSettingsOpen = {setSettingsOpen}
                        setAdminOpen = {setAdminOpen}
                        setAboutOpen = {setAboutOpen}
                      />

                    <main className="flex-1">
                        <CRUD display = {analyticsOpen} />
                        <Dashboard display={dashboardOpen}/>
                        {userDetails.Role === "Admin" && <Admin display={adminOpen}/>}
                        <About  display={aboutOpen}/>
                        <Settings display={settingsOpen}/>
                        {/* <Charts display = {chartsOpen} charts={{lastSpeedBarData, lastSpeedBarDataOptions, lastSizeBarData, lastSizeBarDataOptions, lastSpaceBarData, lastSpaceBarDataOptions, lastThreadsBarData, lastThreadsBarDataOptions}}/> */}
                    </main>
                </div>
            </div> 
        </div>
    </AlertDialogContext.Provider>    
    </dstructuresContext.Provider>
    </domainContext.Provider>
  );
}

export default App;

