import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import "../css/App.css";

import monitoring from "../pictures/monitoring.svg";
import barChart from "../pictures/bar chart.svg"
import analytics from "../pictures/Analytics.svg"
import history from "../pictures/history.svg"
import about from "../pictures/about.svg"
import settings from "../pictures/settings.svg"
import admin from "../pictures/admin.svg"
import update from "../pictures/update.svg"

const SideBar = ({setHeaderTitle, highlight, setAnalyticsOpen, setDashboardOpen, currentPanelOpened, setCurrentPanelOpened, setSettingsOpen, setAdminOpen, setAboutOpen}) => {
    const userDetails = JSON.parse(sessionStorage.getItem('userDetails'));

    return(
        <section className="bg-[#d5e3f2]  w-20 h-full flex flex-col rounded-es-[8px]"> 
            <div className='flex-1 flex flex-col'>
                <SideBarItem logo={analytics} title="Analytics" setHeaderTitle={setHeaderTitle} thisHighlight={highlight.analyticsHighlight} highlight={highlight} setAnalyticsOpen = {setAnalyticsOpen} currentPanelOpened ={currentPanelOpened} setCurrentPanelOpened={setCurrentPanelOpened}/>
                <SideBarItem logo={history} title="History" setHeaderTitle={setHeaderTitle} thisHighlight={highlight.dashboardHighlight} highlight={highlight} setDashboardOpen={setDashboardOpen} currentPanelOpened = {currentPanelOpened} setCurrentPanelOpened={setCurrentPanelOpened}/>
                { userDetails.Role === "Admin" && 
                    <SideBarItem logo={admin} title="Admin" setHeaderTitle={setHeaderTitle} thisHighlight={highlight.adminHighlight} highlight={highlight} setAdminOpen={setAdminOpen} currentPanelOpened = {currentPanelOpened} setCurrentPanelOpened={setCurrentPanelOpened}/>
                }
                {/* <SideBarItem logo={barChart} title="Charts" setHeaderTitle={setHeaderTitle} thisHighlight={highlight.chartsHighlight} highlight={highlight} setChartsOpen = {setChartsOpen} currentPanelOpened = {currentPanelOpened} setCurrentPanelOpened={setCurrentPanelOpened}/> */}
            </div>

            <div className="">
                <SideBarItem logo={about} title="About" setHeaderTitle={setHeaderTitle} thisHighlight={highlight.aboutHighlight} highlight={highlight} setAboutOpen={setAboutOpen} currentPanelOpened={currentPanelOpened} setCurrentPanelOpened={setCurrentPanelOpened}/>
                <SideBarItem logo={settings} title="Settings" setHeaderTitle={setHeaderTitle} thisHighlight={highlight.settingsHighlight} highlight={highlight} setSettingsOpen={setSettingsOpen} currentPanelOpened = {currentPanelOpened} setCurrentPanelOpened={setCurrentPanelOpened}/>
            </div>
        </section>
    )
}

const SideBarItem = (props) =>{
    const navigate = useNavigate();

    let showPanel = () => {
        props.currentPanelOpened('hidden')
        let bg = "bg-[#f8f8fa]"
        let hd = "transparent hover:bg-[#23406b20]"

        if(props.title==="Analytics"){
            props.setAnalyticsOpen('block')
            props.setCurrentPanelOpened(() => props.setAnalyticsOpen)

            props.highlight.setAnalyticsHighlight(bg)
            if(props.highlight.setAnalyticsHighlight !== props.highlight.ch){
                props.highlight.ch(hd)
                props.highlight.sch(() => props.highlight.setAnalyticsHighlight)
            }

            props.setHeaderTitle("Analytics")
            document.title = 'Analytics';
            navigate('/analytics');
        }else if(props.title==="Charts"){ // this panel has been removed
            props.setChartsOpen('block')
            props.setCurrentPanelOpened(() => props.setChartsOpen)

            props.highlight.setChartsHighlight(bg)
            if(props.highlight.setChartsHighlight !== props.highlight.ch){
                props.highlight.ch(hd)
                props.highlight.sch(() => props.highlight.setChartsHighlight)
            }

            props.setHeaderTitle("Charts")
        }else if(props.title==="History"){
            props.setDashboardOpen('block')
            props.setCurrentPanelOpened(() => props.setDashboardOpen)

            props.highlight.setDashboardHighlight(bg)
            if(props.highlight.setDashboardHighlight !== props.highlight.ch){
                props.highlight.ch(hd)
                props.highlight.sch(() => props.highlight.setDashboardHighlight)
            }

            props.setHeaderTitle("History")
            document.title = 'History';
            navigate('/history');
        }else if(props.title==="Settings"){
            props.setSettingsOpen('block')
            props.setCurrentPanelOpened(() => props.setSettingsOpen)

            props.highlight.setSettingsHighlight(bg)
            if(props.highlight.setSettingsHighlight !== props.highlight.ch){
                props.highlight.ch(hd)
                props.highlight.sch(() => props.highlight.setSettingsHighlight)
            }

            props.setHeaderTitle("Settings")
            document.title = 'Settings';
            navigate('/settings');
        }else if(props.title === "Admin"){
            props.setAdminOpen('block')
            props.setCurrentPanelOpened(() => props.setAdminOpen)

            props.highlight.setAdminHighlight(bg)
            if(props.highlight.setAdminHighlight !== props.highlight.ch){
                props.highlight.ch(hd)
                props.highlight.sch(() => props.highlight.setAdminHighlight)
            }

            props.setHeaderTitle("Admin")
            document.title = 'Admin';
            navigate('/admin');
        }else if(props.title==="About"){
            props.setAboutOpen('block')
            props.setCurrentPanelOpened(() => props.setAboutOpen)

            props.highlight.setAboutHighlight(bg)
            if(props.highlight.setAboutHighlight !== props.highlight.ch){
                props.highlight.ch(hd)
                props.highlight.sch(() => props.highlight.setAboutHighlight)
            }

            props.setHeaderTitle("About")
            document.title = 'About';
            navigate('/about');
        }
    }

    return(
        <div id={props.title} onClick={showPanel} className={`transition-all  flex flex-col justify-center items-center text-center ${props.thisHighlight} h-[4rem] w-[72px] mx-1
        rounded my-1 cursor-pointer gap-1 `}>
            <img src={props.logo} className='w-[1.8rem]'></img>
            <h4 className='text-[.8rem] text-gray-700'>{props.title}</h4>
        </div>
    )
}
 
export default SideBar;