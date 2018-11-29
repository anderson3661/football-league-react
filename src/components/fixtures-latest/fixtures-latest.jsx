import React, { Component, Fragment } from 'react';
import Button from "@material-ui/core/Button";
import { connect } from 'react-redux';
import { Prompt } from 'react-router';

import { latestFixturesUpdateAfterResults, latestFixturesSeasonHasFinished } from '../../redux/actions';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from "@material-ui/core/TextField";
import FixtureRow from '../fixture-row';
import Tables from '../tables';
import * as helperFixtureUpdates from './fixtures-updates';
import * as helpers from '../../utilities/helper-functions/helpers';
import {Fixture} from '../../utilities/classes/fixture';
import { MAIN_BACKGROUND_IMAGE } from '../../utilities/constants';

import '../../utilities/css/fixtures.scss';
import './fixtures-latest.scss';

const PAUSE_FIXTURES = "Pause Fixtures";
const START_FIXTURES = "Start Fixtures";
const START_SECOND_HALF = "Start Second Half";
const CONTINUE_FIXTURES = "Continue Fixtures";
const FIXTURES_FINISHED = "Fixtures Finished";

const FIXTURE_UPDATE_INTERVAL = 'fixtureUpdateInterval';

class FixturesLatest extends Component {

    appData;
    miscInfo;
    haveSeasonsFixturesBeenCreated;
    hasSeasonFinished
    dateOfThisSetOfFixtures = "";
    frequencyOfUpdates;
    maxMinutesForPeriod;
    displayHeader;
    latestFixtures;
    tableBeforeFixtures;
    tableInPlay;
    formattedDateOfFixtures;
    top3TeamsBeforeFixtures = ["", "", ""];
    authenticated = true;
    updateInterval;
    counterMinutes = 0;
    areFixturesInPlayForRouter = false;
    fixtureUpdates= [];
  

    constructor(props) {
        super(props);
        
        let i;
        let nextSetOfFixtures;
        let fixtures = [];
        
        this.appData = this.props.appData;
        this.miscInfo = this.props.appData.miscInfo;
        const {goalFactors} = this.props.appData.miscInfo;
        
        //The following are set at the start of the component and their values WON'T change (i.e. they are just used for easier reference)
        this.haveSeasonsFixturesBeenCreated = this.miscInfo.haveSeasonsFixturesBeenCreated;
        if (this.haveSeasonsFixturesBeenCreated) {
            this.hasSeasonFinished = this.miscInfo.hasSeasonFinished;
            this.displayHeader = this.hasSeasonFinished ? "Season finished" : "Latest Fixtures";
            // this.speedOfUpdates = this.miscInfo.goalFactors.fixtureUpdateInterval * 1000;
            
            nextSetOfFixtures = helperFixtureUpdates.getNextSetOfFixtures(this.appData.miscInfo.hasSeasonStarted, this.miscInfo.dateOfLastSetOfFixtures, this.appData.setsOfFixtures);

            if (nextSetOfFixtures !== undefined) {
                this.dateOfThisSetOfFixtures = nextSetOfFixtures.dateOfSetOfFixtures;
            }
            // console.log('nextSetOfFixtures', nextSetOfFixtures);
            
            this.latestFixtures = helperFixtureUpdates.getEmptySetOfFixtures();

            for (i = 0; i < nextSetOfFixtures.fixtures.length; i++) {
                this.latestFixtures.fixtures.push(new Fixture(nextSetOfFixtures.fixtures[i], this.appData.teamsForSeason));
                this.latestFixtures.dateOfSetOfFixtures = nextSetOfFixtures.dateOfSetOfFixtures;
                this.latestFixtures.fixtures[i].setUpFixture(this.miscInfo);
                fixtures.push(this.latestFixtures.fixtures[i].getFixtureObject());
            }
            // console.log('this.latestFixtures', this.latestFixtures);
            
            this.formattedDateOfFixtures = helpers.formatDate(this.latestFixtures.dateOfSetOfFixtures);
            
            this.tableBeforeFixtures = this.appData.latestTable;

            if (this.tableBeforeFixtures[0].played > 0) {
                this.top3TeamsBeforeFixtures = [ this.tableBeforeFixtures[0].teamName, this.tableBeforeFixtures[1].teamName, this.tableBeforeFixtures[2].teamName ];
            }
            
        } else {
            this.displayHeader = "New game ... please create fixtures for the season via Administration";
        }
        
        this.tableInPlay = helperFixtureUpdates.setupInPlayTable(this.appData);
        
        this.state = {
            haveLatestFixturesStarted: false,
            areFixturesInPlayForRouter: false,
            haveFixturesBeenPaused: false,
            haveAllFixturesInThisSetFinished: false,
            startFixturesButtonEnabled: true,
            startFixturesButtonText: START_FIXTURES,
            fixtures: fixtures,
            tableInPlay: this.tableInPlay,
            [FIXTURE_UPDATE_INTERVAL]: goalFactors[FIXTURE_UPDATE_INTERVAL],
            showGoalUpdates: false
        }        
        
        this.startSetOfFixtures = this.startSetOfFixtures.bind(this);
        // this.handleChangeGoalUpdates = this.handleChangeGoalUpdates.bind(this);
        
    }

    handleChangeFixtureUpdateInterval = () => (e) => {
        this.setState({[FIXTURE_UPDATE_INTERVAL]: e.target.value});
    }

    handleChangeShowGoalUpdates(e) {
        this.setState({showGoalUpdates: e.target.checked})
    }
    
    startSetOfFixtures() {

        if (this.state.startFixturesButtonText === PAUSE_FIXTURES) {

            clearInterval(this.updateInterval);

            this.setState({
                haveFixturesBeenPaused: true,
                startFixturesButtonText: CONTINUE_FIXTURES
            });

        } else {

            if (!this.state.haveLatestFixturesStarted) {
                this.setState({ haveLatestFixturesStarted: true });
                this.setState({ areFixturesInPlayForRouter: true });
            }
            
            if (this.state.haveFixturesBeenPaused) {
                
                this.setState({haveFixturesBeenPaused: false});
                
            } else {
                
                this.maxMinutesForPeriod = 0                       // Set to zero as will be calculated for each fixture below
                this.counterMinutes = 0;
                
                this.latestFixtures.fixtures.forEach(fixture => {
                    if (!fixture.hasFixtureFinished) {
                        fixture.startFixture();
                        this.tableInPlay = helperFixtureUpdates.updateInPlayTable(fixture, this.tableBeforeFixtures, this.tableInPlay);      // Set up in play table before fixtures start (so all teams in the current fixture are drawing)
                        
                        this.maxMinutesForPeriod = helperFixtureUpdates.getMaximumMinutes(fixture, this.maxMinutesForPeriod);      // Get the maximum number of minutes for this period of all fixtures in play
                    }
                });               
                
                this.setState({tableInPlay: this.tableInPlay});
            }

            this.setState({ startFixturesButtonText: PAUSE_FIXTURES, });

            this.updateInterval = setInterval(() => this.checkFixturesProgress(), this.state[FIXTURE_UPDATE_INTERVAL] * 1000);

        }
    }

    checkFixturesProgress = () => {
        let fixtureMinuteUpdate;
        let updateAfterGoal;
        let fixturesNew;

        this.counterMinutes++;

        this.latestFixtures.fixtures.forEach((fixture, i) => {
            fixtureMinuteUpdate = fixture.updateFixture(this.appData.teamsForSeason, this.miscInfo);
            updateAfterGoal = false;
            if (fixtureMinuteUpdate.homeTeamUpdate || fixtureMinuteUpdate.awayTeamUpdate) {
                updateAfterGoal = true;
                if (fixtureMinuteUpdate.homeTeamUpdate) {
                    // this.fixtureUpdates.push({scoreUpdate: `${this.counterMinutes} mins - ${fixture.homeTeam} ${fixture.homeTeamsScore} ${fixture.awayTeam} ${fixture.awayTeamsScore}`, scoringTeam: fixture.homeTeam});
                    this.updateWithLatestGoal(this.counterMinutes, fixture, "Home");
                }
                if (fixtureMinuteUpdate.awayTeamUpdate) {
                    // this.fixtureUpdates.push({scoreUpdate: `${this.counterMinutes} mins - ${fixture.homeTeam} ${fixture.homeTeamsScore} ${fixture.awayTeam} ${fixture.awayTeamsScore}`, scoringTeam: fixture.awayTeam});
                    this.updateWithLatestGoal(this.counterMinutes, fixture, "Away");
                }
            }

            if (i===0) {
                fixturesNew = [ fixture.getFixtureObject(), ...this.state.fixtures.slice(i+1) ]
            } else {
                fixturesNew = [...this.state.fixtures.slice(0, i), fixture.getFixtureObject(), ...this.state.fixtures.slice(i+1) ];
            }

            this.setState({ fixtures: fixturesNew });

            if (updateAfterGoal) {
                this.tableInPlay = helperFixtureUpdates.updateInPlayTable(fixture, this.tableBeforeFixtures, this.tableInPlay);

                this.setState({ tableInPlay: this.tableInPlay });
            }
        });

        if (this.maxMinutesForPeriod === this.counterMinutes) {

            clearInterval(this.updateInterval);
    
            this.haveAllFixturesInThisSetFinished = (this.latestFixtures.fixtures.filter(fixture => fixture.hasFixtureFinished).length === this.latestFixtures.fixtures.length);
    
            if (this.haveAllFixturesInThisSetFinished) {
    
                this.setState({
                    startFixturesButtonText: FIXTURES_FINISHED,
                    startFixturesButtonEnabled: false                //Enable/Disable the Start Fixtures button
                });
                
                
                this.props.dispatch(latestFixturesUpdateAfterResults({
                    hasSeasonStarted: true,
                    dateOfSetOfFixtures: this.dateOfThisSetOfFixtures,
                    fixtures: this.state.fixtures,
                    table: this.state.tableInPlay
                }));

                this.setState({ areFixturesInPlayForRouter: false });

            } else {
                this.setState({
                    startFixturesButtonText: START_SECOND_HALF,
                    startFixturesButtonEnabled: true                //Enable/Disable the Start Fixtures button
                });
            }
        }
    
    }

    updateWithLatestGoal(mins, fixture, scoringTeam) {
        this.fixtureUpdates.push(
            {
                mins: fixture.isFirstHalf ? (mins > 45 ? `45(+${mins - 45})` : mins) : (mins + 45 > 90 ? `90(+${mins + 45 - 90})` : mins + 45),
                homeTeam: fixture.homeTeam,
                homeTeamsScore: fixture.homeTeamsScore,
                awayTeam: fixture.awayTeam,
                awayTeamsScore: fixture.awayTeamsScore,
                scoringTeam: scoringTeam
            }
        )
    }

    authenticated() {
        // return this.auth.authenticated;
        return true;
    }

    componentDidMount() {
        helpers.goToTopOfPage();
    }

    componentDidUpdate(prevProps, prevState) {
        // Scroll to the bottom of the Goal Updates window as it updates
        const div = document.getElementById("in-play-updates");
        if (div) div.scrollTop = div.scrollHeight - div.clientHeight;
    }

    componentWillUnmount() {
        clearInterval(this.updateInterval);
        const { haveSeasonsFixturesBeenCreated, hasSeasonStarted, dateOfLastSetOfFixtures } = this.props.appData.miscInfo;
        const { setsOfFixtures } = this.props.appData;
        if (haveSeasonsFixturesBeenCreated && helperFixtureUpdates.getNextSetOfFixtures(hasSeasonStarted, dateOfLastSetOfFixtures, setsOfFixtures).fixtures.length === 0) {
            this.props.dispatch(latestFixturesSeasonHasFinished({hasSeasonFinished: true}));
        }
    }
    
    render() {

        return (            
            <div className={`container-main-content-latest-fixtures ${this.state.showGoalUpdates ? "show-goal-updates" : ""}`}>
                <img className="full-screen-background-image" src={MAIN_BACKGROUND_IMAGE} alt=""></img>

                <Prompt when={this.state.areFixturesInPlayForRouter} message="Are you sure you want to abandon these fixtures ?"/>

                <div className="container-card latest-fixtures-header">
                    <h1>{ this.displayHeader }</h1>

                    {this.haveSeasonsFixturesBeenCreated && !this.hasSeasonFinished &&
                        <Fragment>
                            <div className="fixture-update-button">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    id="startSetOfFixtures"
                                    onClick={this.startSetOfFixtures}
                                    value={this.state.startFixturesButtonText}
                                    disabled={!this.authenticated || !this.state.startFixturesButtonEnabled}
                                    >{this.state.startFixturesButtonText}
                                </Button>
                            </div>

                            <div className="fixture-update-interval">
                                <TextField
                                    id={FIXTURE_UPDATE_INTERVAL}
                                    label="Fixture Update Interval (seconds)"
                                    placeholder="e.g. 0.5"
                                    className="form-control"
                                    fullWidth
                                    disabled={this.state.areFixturesInPlayForRouter && !this.state.haveFixturesBeenPaused}
                                    value={this.state[FIXTURE_UPDATE_INTERVAL]}
                                    onChange={this.handleChangeFixtureUpdateInterval(FIXTURE_UPDATE_INTERVAL)}
                                />
                            </div>

                            <div className="showGoalUpdates">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            className="showGoalsText"
                                            checked={this.state.showGoalUpdates}
                                            onChange={this.handleChangeShowGoalUpdates.bind(this)}
                                            value={this.state.showGoalUpdates.toString()}
                                        />
                                    }
                                    label="Show Goal Updates"
                                />                        
                            </div>
                        </Fragment>
                    }
                </div>

                {this.haveSeasonsFixturesBeenCreated && !this.hasSeasonFinished && (
                    <div className={`split-grid ${this.state.showGoalUpdates ? "show-goal-updates" : ""}`}>

                        <div className="container-card fixtures">
                            <div className="fixtures-date">{this.formattedDateOfFixtures}</div>

                            <div className="fixtures in-play">
                                {this.state.fixtures.map((fixture, i) => {
                                    return (
                                        <FixtureRow
                                            key={i}                                        
                                            fixture={fixture}
                                            showForLatestFixtures={true}
                                            haveLatestFixturesStarted={this.state.haveLatestFixturesStarted}
                                            showGoals={false}
                                            top3TeamsBeforeFixtures={this.top3TeamsBeforeFixtures}
                                        />
                                    )
                                })}
                            </div>
                        </div>

                        {this.state.showGoalUpdates &&
                            <div className="container-card in-play-updates">
                                <div className="fixtures in-play-updates" id="in-play-updates">
                                    <h3>Goal Updates</h3>
                                    {/* {this.fixtureUpdates.map((update, i) => <p key={i}>{update.scoreUpdate}</p>)} */}
                                    {this.fixtureUpdates.map((update, i) => {
                                        return (
                                        <p key={i}>
                                            <span className="mins">{update.mins}</span>
                                            <span className={`team ${update.scoringTeam === "Home" ? "goal" : ""}`}>{update.homeTeam} {update.homeTeamsScore}</span>
                                            &nbsp;&nbsp;
                                            <span className={`team ${update.scoringTeam === "Away" ? "goal" : ""}`}>{update.awayTeam} {update.awayTeamsScore}</span>
                                        </p>
                                        )
                                    })}
                                </div>
                            </div>
                        }

                        <div className="container-card table">
                            <Tables
                                {...this.appData}
                                tableTypeLatestFixtures={true}
                                tableDuringLatestFixtures={this.state.tableInPlay}
                                tableBeforeLatestFixtures={this.tableBeforeFixtures}
                                showGoalUpdates={this.state.showGoalUpdates}
                            />
                        </div>

                        {this.state.showGoalUpdates &&
                            <div className="container-card table-repeat">
                                <Tables
                                    {...this.appData}
                                    tableTypeLatestFixtures={true}
                                    tableDuringLatestFixtures={this.state.tableInPlay}
                                    tableBeforeLatestFixtures={this.tableBeforeFixtures}
                                    showGoalUpdates={this.state.showGoalUpdates}
                                />
                            </div>
                        }
                    </div>
                )}
            </div>
        );
    };
};

const mapStateToProps = (state, ownProps) => {
    return {
        appData: JSON.parse(JSON.stringify(state.appData))
    }
}

FixturesLatest = connect(mapStateToProps, null)(FixturesLatest)

export default FixturesLatest;