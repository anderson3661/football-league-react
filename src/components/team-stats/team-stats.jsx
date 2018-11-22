import React, { Component } from 'react';
import { connect } from 'react-redux';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import TeamStatsChart from './team-stats-chart';
import FixtureRow from "../fixture-row";

import * as helpers from './helpers';

import "../../utilities/css/fixtures.css";
import "./team-stats.css";

class TeamStats extends Component {

    fixturesForSeason;
    fixturesToOutput;
    table;
    teamName;

    constructor(props) {
        super(props);

        this.state = {
            showGoals: false
        }

        this.loadInitialData(props);
    }

    loadInitialData(props) {
        let teamsForSeason;
        let homeTeam;
        let awayTeam;
        let homeTeamsScore;
        let awayTeamsScore;
        let homeTeamsGoals;
        let awayTeamsGoals;
        let dateOfFixture;
        let winDrawLoss;
        let positionInTable;

        this.teamName = this.props.match.params.teamName;

        this.fixturesForSeason = props.appData.setsOfFixtures;
        this.fixturesToOutput = [];
        this.table = [];

        teamsForSeason = props.appData.teamsForSeason;

        this.fixturesForSeason.forEach((setOfFixtures) => {
            for (let fixture of setOfFixtures.fixtures) {
                dateOfFixture = setOfFixtures.dateOfSetOfFixtures;

                if (fixture.homeTeam === this.teamName || fixture.awayTeam === this.teamName) {

                    homeTeam = fixture.homeTeam;
                    awayTeam = fixture.awayTeam;
                    homeTeamsScore = fixture.homeTeamsScore;
                    awayTeamsScore = fixture.awayTeamsScore;
                    homeTeamsGoals = fixture.homeTeamsGoals;
                    awayTeamsGoals = fixture.awayTeamsGoals;

                    if (fixture.hasFixtureFinished) {
                        winDrawLoss = (fixture.homeTeam === this.teamName && homeTeamsScore > awayTeamsScore) ? "W" : "";
                        winDrawLoss = (fixture.homeTeam === this.teamName && homeTeamsScore === awayTeamsScore) ? "D" : winDrawLoss;
                        winDrawLoss = (fixture.homeTeam === this.teamName && homeTeamsScore < awayTeamsScore) ? "L" : winDrawLoss;
                        winDrawLoss = (fixture.awayTeam === this.teamName && awayTeamsScore > homeTeamsScore) ? "W" : winDrawLoss;
                        winDrawLoss = (fixture.awayTeam === this.teamName && awayTeamsScore === homeTeamsScore) ? "D" : winDrawLoss;
                        winDrawLoss = (fixture.awayTeam === this.teamName && awayTeamsScore < homeTeamsScore) ? "L" : winDrawLoss;
                    } else {
                        winDrawLoss = "";
                    }

                    break;      // Exit the loop if the team has been found
                };
            };
            
            positionInTable = (winDrawLoss === "") ? 0 : helpers.getPositionInTable(teamsForSeason, setOfFixtures, this.table, this.teamName);

            this.fixturesToOutput.push({ dateOfFixture, homeTeam, awayTeam, homeTeamsScore, awayTeamsScore, homeTeamsGoals, awayTeamsGoals, winDrawLoss, positionInTable, hasFixtureFinished: winDrawLoss !== "" });
        });

    }

    handleChangeShowGoals(e) {
        this.setState({showGoals: e.target.checked})
    }

    render() {

        return (
            <div className="container-main-content-team-stats">

                <div className="main-header-show-goals">
                    <h1>Results/Fixtures for { this.teamName }</h1>
                    <div className="showGoals">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.showGoals}
                                    onChange={this.handleChangeShowGoals.bind(this)}
                                    value={this.state.showGoals.toString()}
                                />
                            }
                            label="Show Goals"
                        />                        
                    </div>
                </div>

                <div className="fixtures">
                    {this.fixturesToOutput.map((fixture, i) => {
                        return (
                            <FixtureRow
                                key={i}
                                fixture={fixture}
                                showForTeamStats={true}
                                showGoals={this.state.showGoals}
                                winDrawLoss={fixture.winDrawLoss}
                            />
                        );
                    })}
                </div>

                <TeamStatsChart
                    teamName = {this.teamName}
                    appData = {this.props.appData}
                    fixturesToOutput = {this.fixturesToOutput}
                />

            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        appData: state.appData
    }
}

TeamStats = connect(mapStateToProps, null)(TeamStats)

export default TeamStats;