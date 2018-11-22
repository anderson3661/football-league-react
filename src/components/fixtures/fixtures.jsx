import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import FixtureRow from "../fixture-row";
import * as helpers from '../../utilities/helper-functions/helpers';

import { MAIN_BACKGROUND_IMAGE } from '../../utilities/constants';

import "../../utilities/css/fixtures.css";

class Fixtures extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showGoals: false
        }
    }

    handleChangeShowGoals(e) {
        this.setState({showGoals: e.target.checked})
    }

    componentDidMount() {
        helpers.goToTopOfPage();
    }

    render() {
        let i;
        let fixturesToOutput;
        let displayHeader;

        // console.log('this.props: ', this.props);
        // console.log('match: ', this.props.match);
    
        const { haveSeasonsFixturesBeenCreated, hasSeasonStarted, hasSeasonFinished, dateOfLastSetOfFixtures} = this.props.appData.miscInfo;    
        const fixturesForSeason = this.props.appData.setsOfFixtures;    
        const displayRemainingFixtures = (this.props.displayRemainingFixtures === undefined ? false : this.props.displayRemainingFixtures);
        const displayResults = (this.props.displayResults === undefined ? false : this.props.displayResults);

        if (!haveSeasonsFixturesBeenCreated) {
            displayHeader = "New game ... please create fixtures for the season via Administration";
        } else if (hasSeasonFinished) {
            displayHeader = (displayResults ? "Results - Final" : "Season finished");
        } else if (hasSeasonStarted) {
            displayHeader = (displayResults ? "Results" : "Remaining fixtures");
        } else {
            displayHeader = (displayResults ? "Results - no fixtures played yet" : "Remaining fixtures");
        }

        if (haveSeasonsFixturesBeenCreated) {
            if (dateOfLastSetOfFixtures === "") {            
                fixturesToOutput = (displayResults) ? helpers.getEmptyAllFixtures() : fixturesForSeason.slice(0);
            } else {
                if (hasSeasonFinished && !displayResults) {
                    fixturesToOutput = [{ dateOfSetOfFixtures: '', fixtures: [] }];
                } else {
                    for (i = 0; i < fixturesForSeason.length; i++) {
                        if (fixturesForSeason[i].dateOfSetOfFixtures === dateOfLastSetOfFixtures) {
                            // If displaying results, take the elements of the array up to and including the set with the dateOfLastSetOfFixtures set.
                            // If displaying remaining fixtures, take the elements of the array after this date; however in the case where the season has finished
                            // but hasSeasonFinished has not yet been set (i.e. via ComponentWillUnmount on latest-fixtures) just take an empty array
                            fixturesToOutput = (displayResults) ? fixturesForSeason.slice(0, i + 1) :
                                (i >= 0 && fixturesForSeason.length > 1 && i + 1 < fixturesForSeason.length ? fixturesForSeason.slice(i + 1) : [{fixtures: [], dateOfSetOfFixtures: ''}]);
                            break;
                        }
                    }
                }
            }

            // formattedDateOfFixtures = helpers.formatDate(fixturesToOutput[0].dateOfSetOfFixtures);                    //DOESN'T WORK
        }

        return (

            <div className="outer-container-fixtures">
                <div className="container-main-content-fixtures">
                    <img className="full-screen-background-image" src={MAIN_BACKGROUND_IMAGE} alt=""></img>
                    <div className="container-card fixtures-card">

                        <div className={`main-header ${displayResults ? "displayResults" : ""}`}>
                            <h1>{displayHeader}</h1>

                            {displayResults && hasSeasonStarted && (
                                <div className="showGoals">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                className="showGoalsText"
                                                checked={this.state.showGoals}
                                                onChange={this.handleChangeShowGoals.bind(this)}
                                                value={this.state.showGoals.toString()}
                                            />
                                        }
                                        label="Show Goals"
                                    />                        
                                </div>
                            )}

                        </div>

                        {haveSeasonsFixturesBeenCreated && fixturesToOutput[0].dateOfSetOfFixtures !== "" &&
                            fixturesToOutput.map((setOfFixtures, setOfFixturesIndex) => {
                                return (
                                    <Fragment key={setOfFixturesIndex}>
                                        <div className="fixtures-date">{setOfFixtures.dateOfSetOfFixtures}</div>

                                        <div className={`fixtures ${displayResults ? "results" : ""}`}>
                                            {fixturesToOutput[setOfFixturesIndex].fixtures.map((fixture, i) => {
                                                return (
                                                    <FixtureRow
                                                        key={i}
                                                        fixture={fixture}
                                                        displayResults = {displayResults}
                                                        displayRemainingFixtures = {displayRemainingFixtures}
                                                        showGoals={this.state.showGoals}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </Fragment>
                                );
                            })
                        }

                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        appData: state.appData
    }
}

Fixtures = connect(mapStateToProps, null)(Fixtures)

export default Fixtures;