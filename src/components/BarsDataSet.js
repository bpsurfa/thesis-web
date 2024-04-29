import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { LastActionDialog } from './CRUD';

import CanvasJSReact from '@canvasjs/react-charts';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const colors = ['#8884d8', '#82ca9d', '#ffc658'];

const containerProps1 = {
  width: "100%", // Set width to 100% of the parent element
  height: "100px", // Set height to 100% of the parent element
};

export default function BarsDataset() {
  const [lastActionDialog, setLastActionDialog, dstructures] = useContext(LastActionDialog) 

  const dataPoints = () => {
    let arr = []

    for(let i = 0; i < dstructures.length; i++){
        let obj = {
          label: dstructures[i].dsname,
          y: dstructures[i].speedms
        } 

        arr.push(obj)
    }
    
    return arr
  }

  const options = {
    backgroundColor: "rgba(0,0,0,0)",
    title: {
      text: "Last Action Result"
    },
    exportEnabled: true,
    responsive: true,
    maintainAspectRatio: false,
    axisX: {
      title: "Data Structures" // Add X axis label
    },
    axisY: {
      title: "Speed in Milliseconds", // Add Y axis label
      
      labelFormatter: function (e) {
        return Math.floor(e.value * 1e6) / 1e6 // Format to four decimal places
      }
    },
    data: [
        {
          // Change type to "doughnut", "line", "splineArea", etc.
          type: "column",
          dataPoints: [
            { label: "Apple",  y: 10  },
            { label: "Orange", y: 15  },
            { label: "Banana", y: 25  },
            { label: "Mango",  y: 30  },
            { label: "Grape",  y: 28  }
          ]
        }
    ]
  }

  const [data, setData] = useState(options)


  useEffect(() => {
      options.data[0].dataPoints = dataPoints()
      setData(options)
  }, [dstructures])

  return (
    <div className='w-full h-full'>
        <CanvasJSChart 
            options = {data}
            containerProps={{ style: { width: '100%', height: 'auto' } }}
          /* onRef={ref => this.chart = ref} */
        />
        {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
  );
}