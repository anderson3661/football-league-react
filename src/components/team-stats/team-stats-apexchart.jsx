import React from "react";

import Chart from "react-apexcharts";

// import {PLAYERS_ARRAY, OOM_ROUNDS} from '../../utilities/constants';

import "./team-stats.css";

class TeamStatsApexChart extends React.Component {
    
    constructor(props) {
        super(props);

        let { teamName } = this.props;
    
        this.state = {
            options: {
                chart: {
                    background: '#f4f4f4',
                    foreColor: '#333'
                },
                title: {
                    text: `${teamName}'s league position by fixture`,
                    align: 'center',
                    style: {
                        fontSize: '24px',
                        fontWeight: 'bold'
                    }
                },
                xaxis: {
                    categories: [1,2,3,4],
                    title: {
                        text: 'Fixture Number',
                        style: {
                            fontSize: '18px'
                        }
                    },
                    tickAmount: 9,
                    min: 1,
                    max: 10
                },
                yaxis: {
                    categories: ['A9','A8'],
                    title: {
                        text: 'League Position',
                        style: {
                            fontSize: '18px'
                        }
                    },
                    ticks: {
                        reverse: true
                    }
                    // tickAmount: 19,
                    // min: 1,
                    // max: 20
                },
                legend: {
                    show: true,
                    position: 'top'
                },
                tooltip: {
                    x: {
                        show: true,
                    }
                },
                dataLabels: {
                    enabled: true,
                }
            },
            series: [
                {
                    name: 'League Position',
                    data: [8,4,5,18]
                }
            ]
        }
    }

    render() {

        return (
            <div className="container-team-stats-graph">
                <div className="container-team-stats-graph-row">
                    <div className="container-team-stats-graph-mixed-chart">
                        <Chart
                            options={this.state.options}
                            series={this.state.series}
                            type="line"
                            width="100%"
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default TeamStatsApexChart;