import React, { Fragment } from "react";

import Top3 from './top3';

import "./fixture-row.css";

const FixtureRow = (props) => {
    // console.log('FixtureRow props: ', props);
    const {homeTeam, awayTeam, homeTeamsScore, awayTeamsScore, homeTeamsGoals, awayTeamsGoals, minutesPlayed, minutesInfo, hasFixtureFinished, dateOfFixture} = props.fixture;
    
    const haveLatestFixturesStarted = (props.haveLatestFixturesStarted === undefined ? false : props.haveLatestFixturesStarted);
    const showForLatestFixtures = (props.showForLatestFixtures === undefined ? false : props.showForLatestFixtures);
    // const showForRemainingFixtures = (props.showForRemainingFixtures === undefined ? false : props.showForRemainingFixtures);
    // const showForResults = (props.showForResults === undefined ? false : props.showForResults);
    const showForTeamStats = (props.showForTeamStats === undefined ? false : props.showForTeamStats);
    const showGoals = (props.showGoals === undefined ? false : props.showGoals);
    const winDrawLoss = (props.winDrawLoss === undefined ? '' : props.winDrawLoss);
    const top3TeamsBeforeFixtures = (props.top3TeamsBeforeFixtures === undefined ? ["", "", ""] : props.top3TeamsBeforeFixtures);

    return (

        <Fragment>

            <div className=
                {`fixtures-row 
                ${showForTeamStats ? 'team-stats':''} 
                ${showForLatestFixtures ? 'in-play':''} 
                ${showGoals && hasFixtureFinished ? 'show-goals-hide-border-bottom':''}
                `}>             

                {showForTeamStats &&
                    <div className="fixtureDate">{ dateOfFixture }</div>
                }

                <div className="homeTeamsName">
                    {showForLatestFixtures &&
                        (top3TeamsBeforeFixtures[0] === homeTeam) ? <Top3 position="1" /> :
                        (top3TeamsBeforeFixtures[1] === homeTeam) ? <Top3 position="2" /> :
                        (top3TeamsBeforeFixtures[2] === homeTeam) ? <Top3 position="3" /> : null                        
                    }
                    <span className="teamName">{homeTeam}</span>
                </div>

                <div className=
                    {`timeOrScore 
                    ${(showForLatestFixtures && !haveLatestFixturesStarted) || (!showForLatestFixtures && !hasFixtureFinished) ? 'timeOnly': ''} 
                    ${(showForLatestFixtures && haveLatestFixturesStarted) || (!showForLatestFixtures && hasFixtureFinished) ? 'scoresOnly':''}
                    `}>

                    {((showForLatestFixtures && !haveLatestFixturesStarted) || (!showForLatestFixtures && !hasFixtureFinished)) &&
                        <span className="timeOfFixture">15:00</span>
                    }

                    {!showForLatestFixtures && hasFixtureFinished && (
                        <Fragment>
                            <span className="finalScore">{ homeTeamsScore }</span>
                            <span className="finalScore">{ awayTeamsScore }</span>
                        </Fragment>
                    )}

                    {showForLatestFixtures && haveLatestFixturesStarted &&
                        <Fragment>
                            <span className=
                                {`homeTeamsScore 
                                ${haveLatestFixturesStarted && !hasFixtureFinished ? 'activeScore':''} 
                                ${minutesInfo === 'Half-Time' ? 'halfTimeScore':''} 
                                ${hasFixtureFinished ? 'finalScore':''}
                                `}>
                                { homeTeamsScore }
                            </span>

                            <span className=
                                {`awayTeamsScore 
                                ${haveLatestFixturesStarted && !hasFixtureFinished ? 'activeScore':''} 
                                ${minutesInfo === 'Half-Time' ? 'halfTimeScore':''} 
                                ${hasFixtureFinished ? 'finalScore':''}
                                `}>
                                { awayTeamsScore }
                            </span>
                        </Fragment>
                    }

                </div>

                <div className="awayTeamsName">
                    <span className="teamName">{awayTeam}</span>

                    {showForLatestFixtures &&
                        (top3TeamsBeforeFixtures[0] === awayTeam) ? <Top3 position="1" /> :
                        (top3TeamsBeforeFixtures[1] === awayTeam) ? <Top3 position="2" /> :
                        (top3TeamsBeforeFixtures[2] === awayTeam) ? <Top3 position="3" /> : null                        
                    }
                </div>

                {showForTeamStats && (
                    <div className="winDrawLoss">
                        <span className={`result ${ winDrawLoss }`}>{ hasFixtureFinished ? winDrawLoss : '' }</span>
                    </div>
                )}

            </div>

            {(showForLatestFixtures || (showGoals && hasFixtureFinished)) &&
                <Fragment>
                    <div className={`fixtures-row-goal-times ${showForTeamStats ? 'team-stats':''}`}>
                        {showForTeamStats && <div className="fixtureDate">&nbsp;</div>}
                        <div className="teamsGoalTimes home">&nbsp;{ homeTeamsGoals }</div>
                        {/* <div className="minutesPlayed">{ (minutesPlayed === 0 || !showForLatestFixtures) ? ' ' : minutesInfo }</div> */}
                        <div className="minutesPlayed">{ (showForLatestFixtures && minutesPlayed !== 0) ? minutesInfo : ' '}</div>
                        <div className="teamsGoalTimes away">&nbsp;&nbsp;{ awayTeamsGoals }</div>
                        {showForTeamStats && <div className="winDrawLoss">&nbsp;</div>}
                    </div>
                </Fragment>
            }

        </Fragment>

    );
}

export default FixtureRow;