import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useEffect, useState } from "react";


const DoughnutChart = ({ data, totalName }) => {
    const calculateTotal = () => {
        return data.reduce((acc, item) => acc + item.value, 0);
    };

    const totalValue = calculateTotal();

    // Sort data in descending order based on value
    const sortedData = [...data].sort((a, b) => b.value - a.value);

    // Set the title conditionally
    const chartTitle =
        sortedData.length === 0
            ? `<div style="text-align: center; font-family: 'Poppins';">
                <div style="font-size: 12px; font-weight: 500; margin-bottom: 20px;">No Records </div>
            </div>`
            : `<div style="font-family: 'Poppins'; display: flex; flex-direction: column;">
                <div style="font-size: 12px; font-weight: 500; white-space: nowrap;">${totalName}</div>
                <br /><br />
                <div style="font-size: 32px; font-weight: bold;"> ${totalValue.toLocaleString("en-In")}</div>
            </div>`;

        useEffect(() => {
            setOptions((previousOptions) => ({
                ...previousOptions,
                title: {
                    text: chartTitle,
                    x: 0,
                    width: 0,
                    verticalAlign: "middle",
                    align: "center",
                    floating: true,
                },
                series: [
                    {
                        data: sortedData.map((item) => ({
                            name: item.name,
                            y: item.value,
                            color: item.color,
                            showInLegend: false,
                        })),
                    },
                ],
            }));
        }, [data]);

    const [options, setOptions] = useState({
        chart: {
            type: "pie",
            backgroundColor: "transparent", // Background color of the doughnut chart
            height: "100%",
        },
        title: {
            text: chartTitle,
            x: 80,
            width: 160,
            verticalAlign: "middle",
            align: "center",
            floating: true,
        },
        exporting: {
            enabled: false,
        },
        legend: {
            enabled: false,
        },
        plotOptions: {
            pie: {
                innerSize: "60%",
                dataLabels: {
                    enabled: false,
                },
                borderRadius: 4, // Adjust the radius value as needed
            },
        },
        tooltip: {
            backgroundColor: "#FFFFFF",
            borderColor: "#FFFFFF",
            borderRadius: 10,
            style: {
                color: "#000000",
                fontFamily: "Poppins",
            },
            formatter() {
                return `<span style="color:#6E6E72; font-weight: 500; font-size: 12px">${this.key} <span style="color: black; font-weight: bold">${this.y?.toLocaleString("en-In")}</span> </span>`;
            },
            labels: {
                enabled: false,
            },
        },
        series: [
            {
                data: sortedData.map((item) => ({
                    name: item.name,
                    y: item.value,
                    color: item.color,
                    showInLegend: false,
                })),
            },
        ],
        credits: {
            enabled: false,
        },
        responsive: {
            rules: [
                {
                    condition: {
                        minWidth: 624,
                    },
                    chartOptions: {
                        tooltip: {
                            backgroundColor: "#FFFFFF",
                            borderColor: "#FFFFFF",
                            borderRadius: 20,
                            style: {
                                color: "#000000",
                                fontSize: "14px",
                            },
                            formatter() {
                                return `<span style="color:#6E6E72; font-weight: 500; font-size: 12px">${this.key} <span style="color: black; font-weight: bold">${this.y?.toLocaleString("en-In")}</span> </span>`;
                            },
                            labels: {
                                enabled: false,
                            },
                        },
                    },
                },
            ],
        },
    });

    useEffect(() => {
        setOptions((previousOptions) => ({
            ...previousOptions,
            title: {
                text: chartTitle,
                x: 80,
                width: 160,
                verticalAlign: "middle",
                align: "center",
                floating: true,
            },
            series: [
                {
                    data: sortedData.map((item) => ({
                        name: item.name,
                        y: item.value,
                        color: item.color,
                        showInLegend: false,
                    })),
                },
            ],
        }));
    }, [data]);

    return <HighchartsReact highcharts={Highcharts} options={options}  />;
    }

    export default DoughnutChart;
