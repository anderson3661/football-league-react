import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import { Prompt } from 'react-router';

import { MAIN_BACKGROUND_IMAGE, INCLUDE_FIREBASE_OPTION } from '../../utilities/constants';
import * as helpers from '../../utilities/helper-functions/helpers';
import { getAppData as helperGetAppData, deleteAppData as helperDeleteAppData } from '../../utilities/data';
import { createFixtures as helperCreateFixtures } from '../../utilities/helper-functions/create-fixtures';

import { adminUpdate, adminCreateFixtures, adminResetApp } from '../../redux/actions';

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
// import FormLabel from '@material-ui/core/FormLabel';

import ConfirmationDialog from '../dialogs/confirmationDialog';
import ConfirmationYesNo from '../dialogs/confirmYesNo';

import "./administration.scss";

const SEASON = 'season';
const SEASON_START_DATE = 'seasonStartDate';
const NUMBER_OF_FIXTURES_FOR_SEASON = 'numberOfFixturesForSeason';
const FIXTURE_UPDATE_INTERVAL = 'fixtureUpdateInterval';
const BASE_FOR_RANDOM_MULTIPLIER = 'baseForRandomMultiplier';
const AWAY_TEAM_FACTOR = 'isAwayTeam';
const IS_NOT_A_TOP_TEAM_FACTOR = 'isNotATopTeam';
const GOALS_PER_MINUTE_FACTOR = 'likelihoodOfAGoalDuringASetPeriod';
const IS_IT_A_GOAL_FACTOR = 'isItAGoal';

class Administration extends Component {

    input;
    data;

    constructor(props) {
        super(props);
        // console.log('props in administration: ', props);

        const teams = this.props.appData.teamsForSeason;
        const {miscInfo} = this.props.appData;
        const {goalFactors} = this.props.appData.miscInfo;

        this.state = {
            value: 'browser',
            dialogSaveChangesIsOpen: false,
            dialogCreateFixturesYesNoIsOpen: false,
            dialogCreateFixturesYesSelected: false,
            dialogCreateFixturesConfirmIsOpen: false,
            dialogResetAppYesNoIsOpen: false,
            dialogResetAppYesSelected: false,
            dialogResetAppConfirmIsOpen: false,
            haveChangesBeenMade: false,
            teams: teams,
            [SEASON]: miscInfo[SEASON],
            [SEASON_START_DATE]: miscInfo[SEASON_START_DATE],
            [NUMBER_OF_FIXTURES_FOR_SEASON]: miscInfo[NUMBER_OF_FIXTURES_FOR_SEASON],
            [FIXTURE_UPDATE_INTERVAL]: goalFactors[FIXTURE_UPDATE_INTERVAL],
            [BASE_FOR_RANDOM_MULTIPLIER]: goalFactors[BASE_FOR_RANDOM_MULTIPLIER],
            [AWAY_TEAM_FACTOR]: goalFactors[AWAY_TEAM_FACTOR],
            [IS_NOT_A_TOP_TEAM_FACTOR]: goalFactors[IS_NOT_A_TOP_TEAM_FACTOR],
            [GOALS_PER_MINUTE_FACTOR]: goalFactors[GOALS_PER_MINUTE_FACTOR],
            [IS_IT_A_GOAL_FACTOR]: goalFactors[IS_IT_A_GOAL_FACTOR]
        };

        this.updateOriginalValues();
    }

    updateOriginalValues = () => {
        // These are used to see whether any values have changed so that a warning can be issued if the user trys to navigate away from the page
        this.originalValues = Object.assign({}, this.state);
        this.originalValuesTeams = this.state.teams.map(a => ({...a}));         // Deep clone of object
    }

    updateHaveChangesBeenMade = () => {

        // console.log('state',this.state);
        // console.log('originalValues',this.originalValues);

        let {teams} = this.state;

        for (let i = 0; i < teams.length; i++) {
            if (teams[i].teamName !== this.originalValuesTeams[i].teamName || teams[i].isATopTeam !== this.originalValuesTeams[i].isATopTeam) {
                this.setState({ haveChangesBeenMade: true })
            }
        }

        if (this.state[SEASON] !== this.originalValues[SEASON] ||
            this.state[SEASON_START_DATE] !== this.originalValues[SEASON_START_DATE] ||
            this.state[NUMBER_OF_FIXTURES_FOR_SEASON] !== this.originalValues[NUMBER_OF_FIXTURES_FOR_SEASON] ||
            this.state[FIXTURE_UPDATE_INTERVAL] !== this.originalValues[FIXTURE_UPDATE_INTERVAL] ||
            this.state[BASE_FOR_RANDOM_MULTIPLIER] !== this.originalValues[BASE_FOR_RANDOM_MULTIPLIER] ||
            this.state[AWAY_TEAM_FACTOR] !== this.originalValues[AWAY_TEAM_FACTOR] ||
            this.state[IS_NOT_A_TOP_TEAM_FACTOR] !== this.originalValues[IS_NOT_A_TOP_TEAM_FACTOR] ||
            this.state[GOALS_PER_MINUTE_FACTOR] !== this.originalValues[GOALS_PER_MINUTE_FACTOR] ||
            this.state[IS_IT_A_GOAL_FACTOR] !== this.originalValues[IS_IT_A_GOAL_FACTOR]) {
                this.setState({ haveChangesBeenMade: true })
        }
    }

    componentWillReceiveProps(nextProps, prevState) {
        // console.log('nextProps', nextProps);
        this.setStateOnChange(nextProps, SEASON, false);
        this.setStateOnChange(nextProps, SEASON_START_DATE, false);
        this.setStateOnChange(nextProps, NUMBER_OF_FIXTURES_FOR_SEASON, false);
        this.setStateOnChange(nextProps, FIXTURE_UPDATE_INTERVAL, true);
        this.setStateOnChange(nextProps, BASE_FOR_RANDOM_MULTIPLIER, true);
        this.setStateOnChange(nextProps, AWAY_TEAM_FACTOR, true);
        this.setStateOnChange(nextProps, IS_NOT_A_TOP_TEAM_FACTOR, true);
        this.setStateOnChange(nextProps, GOALS_PER_MINUTE_FACTOR, true);
        this.setStateOnChange(nextProps, IS_IT_A_GOAL_FACTOR, true);
    }

    setStateOnChange(nextProps, field, isGoalFactors) {
        if (isGoalFactors) {
            if (nextProps.appData.miscInfo.goalFactors[field] !== this.props.appData.miscInfo.goalFactors[field]) {
                this.setState({[field]: nextProps.appData.miscInfo.goalFactors[field]});
                this.updateHaveChangesBeenMade();
            }
        } else {
            if (nextProps.appData.miscInfo[field] !== this.props.appData.miscInfo[field]) {
                this.setState({[field]: nextProps.appData.miscInfo[field]});
                this.updateHaveChangesBeenMade();
            }
        }
    }

    handleChangeAdminFields = (field) => (e) => {
        // console.log('field: ', field);
        this.setState({[field]: e.target.value})
        this.updateHaveChangesBeenMade();
    }

    handleTeamsInputChange = (i) => (e) => {
        const newTeams = [...this.state.teams];
        newTeams[i].teamName = e.target.value;
        this.setState({ teams: newTeams });
        this.updateHaveChangesBeenMade();
    }

    handleIsATopTeamInputChange = (i) => (e) => {
        const newTeams = [...this.state.teams];
        newTeams[i].isATopTeam = e.target.checked;
        this.setState({ teams: newTeams });
        this.updateHaveChangesBeenMade();
    }
    
    handleSaveChanges = (e) => {
        // console.log(this.state);
        
        e.preventDefault();
        
        if (this.validateAdmin()) return;

        this.setState({dialogSaveChangesIsOpen: true});

        // [NUMBER_OF_FIXTURES_FOR_SEASON]: parseInt(document.getElementById(NUMBER_OF_FIXTURES_FOR_SEASON).value.trim(), 10),
        let data = {
            teams: this.state.teams,
            miscInfo: {
                [SEASON]: this.state[SEASON].trim(),
                [SEASON_START_DATE]: this.state[SEASON_START_DATE].trim(),
                [NUMBER_OF_FIXTURES_FOR_SEASON]: parseInt(this.state[NUMBER_OF_FIXTURES_FOR_SEASON].toString().trim(), 10),
                goalFactors: {
                    [FIXTURE_UPDATE_INTERVAL]: parseFloat(this.state[FIXTURE_UPDATE_INTERVAL].toString().trim()),
                    [BASE_FOR_RANDOM_MULTIPLIER]: parseFloat(this.state[BASE_FOR_RANDOM_MULTIPLIER].toString().trim()),
                    [AWAY_TEAM_FACTOR]: parseFloat(this.state[AWAY_TEAM_FACTOR].toString().trim()),
                    [IS_NOT_A_TOP_TEAM_FACTOR]: parseFloat(this.state[IS_NOT_A_TOP_TEAM_FACTOR].toString().trim()),
                    [GOALS_PER_MINUTE_FACTOR]: this.state[GOALS_PER_MINUTE_FACTOR].toString().trim(),
                    [IS_IT_A_GOAL_FACTOR]: parseFloat(this.state[IS_IT_A_GOAL_FACTOR].toString().trim())
                }
            }
        }
        
        this.props.dispatch(adminUpdate(data));

        this.setState({ haveChangesBeenMade: false });
        this.updateOriginalValues();
    }
    
    handleDialogCloseSaveChanges = () => {
        this.setState({ dialogSaveChangesIsOpen: false })
    }

    handleCreateFixtures = () => {
        if (this.state.haveChangesBeenMade) {
            alert('Changes have been made ... please save these first and re-try');
        } else {
            this.setState({dialogCreateFixturesYesNoIsOpen: true});
        }
    }

    handleDialogYesNoCloseCreateFixtures = (value) => {
        this.setState({ dialogCreateFixturesYesSelected: value, dialogCreateFixturesYesNoIsOpen: false }, () => {
            if (this.state.dialogCreateFixturesYesSelected) {
                const { dispatch } = this.props;
                let data = helperCreateFixtures(this.props.appData);
                // console.log('Data :', data);

                dispatch(adminCreateFixtures({appData: data}));

                this.setState({dialogCreateFixturesConfirmIsOpen: true});
            }
        });
    }

    handleDialogConfirmCloseCreateFixtures = () => {
        this.setState({ dialogCreateFixturesConfirmIsOpen: false })
    }

    handleResetApp = () => {
        this.setState({dialogResetAppYesNoIsOpen: true});
    }

    handleDialogYesNoCloseResetApp = (value) => {
        this.setState({ dialogResetAppYesSelected: value, dialogResetAppYesNoIsOpen: false }, () => {
            if (this.state.dialogResetAppYesSelected) {
                const { dispatch } = this.props;
                helperDeleteAppData();              // Delete the stored app data
                let data = helperGetAppData(true);
                // console.log('Data :', data);

                dispatch(adminResetApp(data));

                this.setState({dialogResetAppConfirmIsOpen: true});
            }
        });
    }

    handleDialogConfirmCloseResetApp = () => {
        this.setState({ dialogResetAppConfirmIsOpen: false })
    }

    validateAdmin = () => {
        let validationWarnings = "";

        if (!this.areAllArrayValuesEntered(this.state.teams, "teamName")) {
            validationWarnings += `\n- All Teams must be entered`;
        }

        if (this.state[SEASON] === "") {
            validationWarnings += `\n- 'Season' must be entered in NNNN/NN format`;
        }

        if (this.state[SEASON_START_DATE] === "") {
            validationWarnings += `\n- 'Season Start Date' must be entered in DD mmm YYYY format`;
        }

        if (isNaN(this.state[NUMBER_OF_FIXTURES_FOR_SEASON]) || this.state[NUMBER_OF_FIXTURES_FOR_SEASON] < 1 || this.state[NUMBER_OF_FIXTURES_FOR_SEASON] > 30) {
            validationWarnings += `\n- 'Number of Fixtures for Season' must be a valid number between 1 and 30 (30 is currently the upper limit due to fixture scheduling issues)`;
        }

        if (isNaN(this.state[FIXTURE_UPDATE_INTERVAL]) || this.state[FIXTURE_UPDATE_INTERVAL] <= 0) {
            validationWarnings += `\n- 'Fixture Update Interval (seconds)' must be a valid number, greater than 0`;
        }

        if (isNaN(this.state[BASE_FOR_RANDOM_MULTIPLIER]) || this.state[BASE_FOR_RANDOM_MULTIPLIER] < 50 || this.state[BASE_FOR_RANDOM_MULTIPLIER] > 150) {
            validationWarnings += `\n- 'Base For Random Multiplier' must be a valid number between 50 and 150`;
        }

        if (isNaN(this.state[AWAY_TEAM_FACTOR]) || this.state[AWAY_TEAM_FACTOR] < 0.5 || this.state[AWAY_TEAM_FACTOR] > 2) {
            validationWarnings += `\n- 'Away Team Factor' must be a valid number between 0.5 and 2`;
        }

        if (isNaN(this.state[IS_NOT_A_TOP_TEAM_FACTOR]) || this.state[IS_NOT_A_TOP_TEAM_FACTOR] < 1 || this.state[IS_NOT_A_TOP_TEAM_FACTOR] > 2) {
            validationWarnings += `\n- 'Is Not A Top Team Factor' must be a valid number between 1 and 2`;
        }

        if (this.state[GOALS_PER_MINUTE_FACTOR] === "") {
            validationWarnings += `\n- 'Goals Per Minute Factor' must be entered (as an array of objects)`;
        }

        if (isNaN(this.state[IS_IT_A_GOAL_FACTOR]) || this.state[IS_IT_A_GOAL_FACTOR] < 1 || this.state[IS_IT_A_GOAL_FACTOR] > 5) {
            validationWarnings += `\n- 'Is It A Goal Factor' must be a valid number between 1 and 5`;
        }

        if (validationWarnings) {
            alert(`Cannot continue ... please correct the following and retry ...\n\n` + validationWarnings);
        }

        return validationWarnings;
    }

    areAllArrayValuesEntered = (arrayName, propertyName) => {
        let allValuesEntered = true;
        arrayName.forEach(value => {if (value[propertyName].trim() === "") allValuesEntered = false});
        return allValuesEntered;
    }

    componentDidMount() {
        helpers.goToTopOfPage();
    }


    render() {
        // console.log('this.Props.data.appData in Administration: ', this.props.appData);
        // const appDataMiscInfo = this.props.appData.miscInfo;
        const {haveChangesBeenMade, teams} = this.state;
        // this.state.numberOfFixturesForSeason = this.props.appData.miscInfo.numberOfFixturesForSeason;
        // console.log(teams);

        return (
            <Fragment>
                <div className="outer-container-administration">
                    <img className="full-screen-background-image" src={MAIN_BACKGROUND_IMAGE} alt=""></img>
                    <div className="container-main-content-administration">
                        <div className="container-card header">
                            <header>
                                <h1>Administration</h1>
                                <span>For help, click on the Help link at the bottom of the screen</span>

                                <Prompt when={haveChangesBeenMade} message={`Are you sure you want to abandon these unsaved changes'} ?`} />

                                {INCLUDE_FIREBASE_OPTION &&
                                    <div className="dataStorage">
                                        {/* <FormControl component="fieldset" className={classes.formControl}> */}
                                        <span className="dataStorageLabel">Where is data saved?</span>
                                        <FormControl component="fieldset">
                                            {/* <FormLabel component="legend">Where is data saved?</FormLabel> */}
                                            <RadioGroup
                                                aria-label="Where is data saved?"
                                                name="dataStorage"
                                                className="dataStorageButtons"
                                                value={this.state.value}
                                                onChange={this.handleChange}
                                            >
                                                <FormControlLabel value="browser" control={<Radio />} label="Browser" labelplacement="start" />
                                                <FormControlLabel value="firebase" control={<Radio />} label="Firebase" labelplacement="start" />
                                            </RadioGroup>
                                        </FormControl>
                                            {/* <span>Where is data saved?</span>
                                            <mat-radio-group name="dataStorage">
                                                <mat-radio-button value="Browser">Browser</mat-radio-button>
                                                <mat-radio-button value="Firebase">Firebase</mat-radio-button>
                                            </mat-radio-group> */}
                                    </div>
                                }
                            </header>
                        </div>

                        <form>
                            <div className="container-admin">
                                <div className="container-admin-teams">
                                    <div className="container-card">
                                        <h2>Teams for the Season</h2>

                                        <table className="admin-teams">
                                            <thead>
                                                <tr className="teams-header">
                                                <th className="admin-team-number">No.</th>
                                                <th className="admin-team-team">Team</th>
                                                <th className="admin-team-top-team">Top Team?</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {teams.map((team, i) => {
                                                    return (
                                                        <tr key={i} className="team-row">
                                                            <td className="admin-team-number">{i + 1}</td>
                                                            <td><input type="text" onChange={this.handleTeamsInputChange(i)} value={team.teamName} /></td>
                                                            <td><input type="checkbox" onChange={this.handleIsATopTeamInputChange(i)} defaultChecked={team.isATopTeam} value={team.isATopTeam} /></td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="container-admin-factors">

                                    <div className="container-card">
                                        <h2>Information for the Season</h2>

                                        {/* defaultValue={miscInfo[SEASON]} */}

                                        <div className="grid-season-info">

                                            <TextField
                                                id={SEASON}
                                                label="Season"
                                                placeholder="e.g. 2017/18"
                                                className="form-control"
                                                value={this.state[SEASON]}
                                                onChange={this.handleChangeAdminFields(SEASON)}
                                            />

                                            <TextField
                                                id={SEASON_START_DATE}
                                                label="Season Start Date"
                                                placeholder="e.g. 05 Aug 2017"
                                                className="form-control"
                                                value={this.state[SEASON_START_DATE]}
                                                onChange={this.handleChangeAdminFields(SEASON_START_DATE)}
                                            />

                                            <TextField
                                                id={NUMBER_OF_FIXTURES_FOR_SEASON}
                                                label="Number of Fixtures for Season"
                                                placeholder="e.g. 38"
                                                className="form-control"
                                                value={this.state[NUMBER_OF_FIXTURES_FOR_SEASON]}
                                                onChange={this.handleChangeAdminFields(NUMBER_OF_FIXTURES_FOR_SEASON)}
                                            />

                                        </div>

                                    </div>

                                    <div className="container-card">
                                        <h2>Match Score Factors</h2>

                                        <div className="grid-season-info">

                                            <TextField
                                                id={FIXTURE_UPDATE_INTERVAL}
                                                label="Fixture Update Interval (seconds)"
                                                placeholder="e.g. 0.5"
                                                className="form-control"
                                                value={this.state[FIXTURE_UPDATE_INTERVAL]}
                                                onChange={this.handleChangeAdminFields(FIXTURE_UPDATE_INTERVAL)}
                                            />

                                            <TextField
                                                id={BASE_FOR_RANDOM_MULTIPLIER}
                                                label="Base For Random Multiplier"
                                                placeholder="e.g. 90"
                                                className="form-control"
                                                value={this.state[BASE_FOR_RANDOM_MULTIPLIER]}
                                                onChange={this.handleChangeAdminFields(BASE_FOR_RANDOM_MULTIPLIER)}
                                            />

                                            <TextField
                                                id={AWAY_TEAM_FACTOR}
                                                label="Away Team Factor"
                                                placeholder="e.g. 1.1"
                                                className="form-control"
                                                value={this.state[AWAY_TEAM_FACTOR]}
                                                onChange={this.handleChangeAdminFields(AWAY_TEAM_FACTOR)}
                                            />

                                            <TextField
                                                id={IS_NOT_A_TOP_TEAM_FACTOR}
                                                label="Is Not A Top Team Factor"
                                                placeholder="e.g. 1.1"
                                                className="form-control"
                                                value={this.state[IS_NOT_A_TOP_TEAM_FACTOR]}
                                                onChange={this.handleChangeAdminFields(IS_NOT_A_TOP_TEAM_FACTOR)}
                                            />

                                            <div className="fullWidth">
                                                <TextField
                                                    id={GOALS_PER_MINUTE_FACTOR}
                                                    label="Goals Per Minute Factor"
                                                    placeholder="e.g. [{'minutes': 30, 'factor': 1.8}, {'minutes': 80, 'factor': 1.2}, {'minutes': 120, 'factor': 1}]"
                                                    className="form-control"
                                                    fullWidth
                                                    value={this.state[GOALS_PER_MINUTE_FACTOR]}
                                                    onChange={this.handleChangeAdminFields(GOALS_PER_MINUTE_FACTOR)}
                                                />
                                            </div>

                                            <TextField
                                                id={IS_IT_A_GOAL_FACTOR}
                                                label="Is It A Goal Factor"
                                                placeholder="e.g. 2"
                                                className="form-control"
                                                value={this.state[IS_IT_A_GOAL_FACTOR]}
                                                onChange={this.handleChangeAdminFields(IS_IT_A_GOAL_FACTOR)}
                                            />

                                        </div>
                                    </div>

                                    <div className="container-card buttons-card">
                                        <div className="buttons">
                                            <Button variant="contained" color="primary" id="saveChanges" onClick={this.handleSaveChanges}>Save Changes</Button>
                                            &nbsp; &nbsp;
                                            <Button variant="contained" color="secondary" id="createFixtures" disabled={this.props.appData.setsOfFixtures.length>0} onClick={this.handleCreateFixtures}>Create Season's Fixtures</Button>
                                            &nbsp; &nbsp;
                                            <Button variant="contained" color="secondary" id="resetApp" onClick={this.handleResetApp}>Reset App</Button>

                                            <ConfirmationDialog message="Changes saved" open={this.state.dialogSaveChangesIsOpen} onClose={this.handleDialogCloseSaveChanges} />
                                            <ConfirmationYesNo message="Are you sure you want to create fixtures for the season ?" dialogYesNoSelectedIsYes={this.state.dialogCreateFixturesYesSelected} open={this.state.dialogCreateFixturesYesNoIsOpen} onClose={this.handleDialogYesNoCloseCreateFixtures} />
                                            <ConfirmationDialog message="Season's fixtures created" open={this.state.dialogCreateFixturesConfirmIsOpen} onClose={this.handleDialogConfirmCloseCreateFixtures} />
                                            <ConfirmationYesNo message="Are you sure you want to reset the app ?" dialogYesNoSelectedIsYes={this.state.dialogResetAppYesSelected} open={this.state.dialogResetAppYesNoIsOpen} onClose={this.handleDialogYesNoCloseResetApp} />
                                            <ConfirmationDialog message="App has been reset" open={this.state.dialogResetAppConfirmIsOpen} onClose={this.handleDialogConfirmCloseResetApp} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    // console.log('mapStateToProps in administration');
    // console.log('state in mapStateToProps in administration', state);
    return {
        appData: JSON.parse(JSON.stringify(state.appData))
    }
}

Administration = connect(mapStateToProps, null)(Administration)

export default Administration;