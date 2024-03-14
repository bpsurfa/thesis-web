import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import "../css/App.css";

import monitoring from "../pictures/monitoring.svg";
import barChart from "../pictures/bar chart.svg"
import analytics from "../pictures/Analytics.svg"
import history from "../pictures/history.svg"
import about from "../pictures/about.svg"
import settings from "../pictures/settings.svg"
import update from "../pictures/update.svg"

const SideBar = ({setHeaderTitle, highlight, setChartsOpen, setAnalyticsOpen, setDashboardOpen, currentPanelOpened, setCurrentPanelOpened}) => {
    return(
        <section className="bg-slate-200 w-20 h-full flex flex-col rounded-es-[8px]"> 
            <div className='flex-1 flex flex-col'>
                <SideBarItem logo={analytics} title="Analytics" setHeaderTitle={setHeaderTitle} thisHighlight={highlight.analyticsHighlight} highlight={highlight} setAnalyticsOpen = {setAnalyticsOpen} currentPanelOpened ={currentPanelOpened} setCurrentPanelOpened={setCurrentPanelOpened}/>
                <SideBarItem logo={history} title="History" setHeaderTitle={setHeaderTitle} thisHighlight={highlight.dashboardHighlight} highlight={highlight} setDashboardOpen={setDashboardOpen} currentPanelOpened = {currentPanelOpened} setCurrentPanelOpened={setCurrentPanelOpened}/>
                <SideBarItem logo={barChart} title="Charts" setHeaderTitle={setHeaderTitle} thisHighlight={highlight.chartsHighlight} highlight={highlight} setChartsOpen = {setChartsOpen} currentPanelOpened = {currentPanelOpened} setCurrentPanelOpened={setCurrentPanelOpened}/>
            </div>

            <div className="">
                <SideBarItem logo={about} title="About"/>
                <SideBarItem logo={settings} title="Settings"/>
            </div>
        </section>
    )
}

const SideBarItem = (props) =>{
    const navigate = useNavigate();

    let showPanel = () => {
        props.currentPanelOpened('hidden')
        let bg = "bg-[#f8f8fa]"
        let hd = "transparent hover:bg-[#00000010]"

        if(props.title==="Analytics"){
            props.setAnalyticsOpen('block')
            props.setCurrentPanelOpened(() => props.setAnalyticsOpen)

            props.highlight.setAnalyticsHighlight(bg)
            if(props.highlight.setAnalyticsHighlight !== props.highlight.ch){
                props.highlight.ch(hd)
                props.highlight.sch(() => props.highlight.setAnalyticsHighlight)
            }

            props.setHeaderTitle("Analytics")
            navigate('/analytics');
        }else if(props.title==="Charts"){
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

            navigate('/history');
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