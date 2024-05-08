import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function LineChart({ data, interval=1, hfull=false }) {

    const [options, setOptions] = useState({
        chart: {
            type: "area",
            ...(hfull ? {height: '100%'} : {}),
        },
        plotOptions:{
            area:{
                lineWidth: 3,
                marker: {
                    lineWidth: 2,
                    radius: 4.5
                }
            }
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        title: {
            text: ''
        },
        tooltip: {
            borderRadius: 5,
            format: '<span style="font-size: 14px; background-color: #f5f7fe; font-weight: 600;" >₹ {y}</span>'
        },
        series: [{
            color:"#0171E7",
            fillColor: {
                linearGradient: [0, 0, 15, 400],
                stops: [
                    [0, "#0171E745"],
                    [1, "#0171E700"]
                ]
            },
            data
        }],
        xAxis:[{
            lineWidth: 2,
            lineColor: "#E4E5E5",
            tickLength: 0,
            tickInterval: interval  ,
            title: {
                text: 'Date'
            },
            labels: {
                formatter: function() {
                    const date = new Date();
                    date.setDate(date.getDate() - data.length + this.value);

                    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    const day = date.getDate();
                    const monthIndex = date.getMonth();
                    const month = months[monthIndex];
                    const dateLabel = `${day} ${month}`;
                    
                    return '<span style="font-size: 12px; font-weight: 500">'+dateLabel+'</span>';
                },
            }
        }],
        yAxis:[{
            lineWidth: 2,
            lineColor: "#E4E5E5",
            gridLineWidth: 0,
            title: {
                text: 'Value (₹)'
            },
            labels: {
                formatter: function() {
                    let number = parseInt(this.value)
                    if (number >= 10000000) 
                        return '<span style="font-size: 12px; font-weight: 500">'+ (number / 10000000) + ' Cr</span>';
                    if (number >= 100000) 
                        return '<span style="font-size: 12px; font-weight: 500">'+ (number / 100000) + ' L</span>';
                    if (number >= 1000) 
                        return '<span style="font-size: 12px; font-weight: 500">'+ (number / 1000) + ' K</span>';
                    return '<span style="font-size: 12px; font-weight: 500">'+ number + '</span>';
                },
            }
        }]
    })

    useEffect(()=> {
        // console.log([{ ...options.series[0], data: data}])
        setOptions( options => ({
            ...options,
            xAxis: [{ ...options.xAxis[0], 
                tickInterval: interval
            }],
            series: [{ ...options.series[0], data: data}]
        }))
    }, [interval, data])

    return <HighchartsReact highcharts={Highcharts} options={options} />;
}
