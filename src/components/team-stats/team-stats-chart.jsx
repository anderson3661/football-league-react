import React from "react";

import {Line} from 'react-chartjs-2';

import "./team-stats.css";

class TeamStatsChart extends React.Component {

    data;
    legendOpts;
    options;

    constructor(props) {
        super(props);

        let { teamName, fixturesToOutput } = this.props;

        let xAxisLabels = [];
        let positionsAfterFixtures = [];
        for (let i = 0; i < this.props.appData.miscInfo.numberOfFixturesForSeason; i++) {
            positionsAfterFixtures.push(fixturesToOutput[i].positionInTable);
            xAxisLabels.push('Fixture ' + (i + 1));
        }

        this.data = {
            labels: xAxisLabels,
            datasets: [
                {
                    label: `${teamName}'s league position by fixture`,
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: positionsAfterFixtures
                }
            ]
        };

        this.options = {
            scales: {
                yAxes: [{
                    id: 'y-axis',
                    type: 'linear',
                    ticks: {
                        max: 20,
                        min: 1,
                        stepSize: 1,
                        reverse: true
                    }
                }]
            }
        }

        this.legendOpts = {
            display: true,
            position: 'top',
            fullWidth: true,
            reverse: false,
            labels: {
                fontSize: 24,
                fontColor: 'slategray'
            }
          };

    }

    render() {       

        return (
            <div className="container-team-stats-graph">
                <div className="container-team-stats-graph-row">
                    <div className="container-team-stats-graph-mixed-chart">
                        <Line data={this.data} options={this.options} legend={this.legendOpts} />
                    </div>
                </div>
            </div>
        );
    }
}

export default TeamStatsChart;