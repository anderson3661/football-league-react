import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'

import { MAIN_BACKGROUND_IMAGE } from '../../utilities/constants';

import * as helpers from '../../utilities/helper-functions/helpers';

import '../../utilities/css/tables.css';

library.add(faArrowUp, faArrowDown);

let Tables = (props) => {

    // console.log('table props', props);

    let table;
    let { tableTypeFull, tableTypeLatestFixtures, tableBeforeLatestFixtures, tableDuringLatestFixtures, showGoalUpdates } = props;
    const { latestTable } = props.appData;
    const { hasSeasonFinished } = props.appData.miscInfo;

    table = (tableDuringLatestFixtures === null || tableDuringLatestFixtures === undefined) ? latestTable : tableDuringLatestFixtures;
    tableTypeFull = (tableTypeFull === null || tableTypeFull === undefined) ? false : tableTypeFull;
    tableTypeLatestFixtures = (tableTypeLatestFixtures === null || tableTypeLatestFixtures === undefined) ? false : tableTypeLatestFixtures;
    tableBeforeLatestFixtures = (tableBeforeLatestFixtures === null || tableBeforeLatestFixtures === undefined) ? [] : tableBeforeLatestFixtures;    
    showGoalUpdates = (showGoalUpdates === null || showGoalUpdates === undefined) ? false : showGoalUpdates;            // Used for when 'Show Goal Updates' is selected on the Latest Fixtures page   

    const mainBodyOfTable =         
        <table className={`league-table${ tableTypeFull ? '-full' : '' }`}>
            <tbody className="league-table-body">

                <tr className="league-table-header">
                    <td className="league-table-position">&nbsp;</td>
                    {tableTypeLatestFixtures && <td className="league-table-movement">&nbsp;</td>}
                    <td className="league-table-teamName">Team</td>
                    <th className="league-table-played">{tableTypeLatestFixtures ? "Pl" : "Played"}</th>
                    <td className="league-table-won">{ tableTypeFull || tableTypeLatestFixtures ? "W" : "Won" }</td>
                    {!showGoalUpdates && <td className="league-table-drawn">{ tableTypeFull || tableTypeLatestFixtures ? "D" : "Drawn" }</td>}
                    {!showGoalUpdates && <td className="league-table-lost">{ tableTypeFull || tableTypeLatestFixtures ? "L" : "Lost" }</td>}
                    {!tableTypeLatestFixtures && <td className="league-table-goalsFor">{ tableTypeFull ? "GF" : "For" }</td>}
                    {!tableTypeLatestFixtures && <td className="league-table-goalsAgainst">{ tableTypeFull ? "GA" : "Against" }</td>}
                    {tableTypeFull && <td className="league-table-won">W</td>}
                    {tableTypeFull && <td className="league-table-drawn">D</td>}
                    {tableTypeFull && <td className="league-table-lost">L</td>}
                    {tableTypeFull && <td className="league-table-goalsFor">GF</td>}
                    {tableTypeFull && <td className="league-table-goalsAgainst">GA</td>}
                    <td className="league-table-goalDifference">GD</td>
                    <td className={`league-table-points ${showGoalUpdates ? "showGoalUpdates" : ""}`}>{tableTypeLatestFixtures ? "Po" : "Points"}</td>
                    {!showGoalUpdates && <td className="league-table-form-header">Form</td>}
                </tr>

                {table.map((team, i) => {
                    return (
                        <tr key={i} className="league-table-row">
                            <td className="league-table-position">{i + 1}</td>

                            {tableTypeLatestFixtures &&
                                <td className="league-table-movement">

                                    {tableTypeLatestFixtures && tableBeforeLatestFixtures[0].played > 0 &&
                                        i < helpers.getPositionInArrayOfObjects(tableBeforeLatestFixtures, 'teamName', team.teamName) &&
                                        <FontAwesomeIcon className="arrow-up" icon={faArrowUp} />}

                                    {tableTypeLatestFixtures && tableBeforeLatestFixtures[0].played > 0 &&
                                        i > helpers.getPositionInArrayOfObjects(tableBeforeLatestFixtures, 'teamName', team.teamName) &&
                                        <FontAwesomeIcon className="arrow-down" icon={faArrowDown} />}

                                </td>
                            }

                            {/* <td className="league-table-teamName"><a className="teamNameLink" routerLink="/teamstats/{{ team.teamName }}" (mouseover)="hover=true" (mouseleave)="hover=false"><span>{{ team.teamName }}</span></a></td> */}
                            {/* <td className="league-table-teamName"><a className="teamNameLink" routerLink="/teamstats/{ team.teamName }" ><span>{ team.teamName }</span></a></td> */}
                            <td className="league-table-teamName"><NavLink to={`/teamstats/${ team.teamName }`} className="teamNameLink">{ team.teamName }</NavLink></td>
                            {/* <li><NavLink to="/fixtures-latest" className="nav-link" activeClassName="active-link">{ team.teamName }</NavLink></li> */}
                            {/* <Route exact path="/teamstats/teamName" render={(props) => <TeamStats {...props.appData} />} /> */}
                            {/* <td className="league-table-teamName"><a className="teamNameLink"><span>{ team.teamName }</span></a></td> */}
                            <td className="league-table-played">{ team.played }</td>
                            <td className="league-table-won">{ tableTypeFull ? team.homeWon : team.won }</td>
                            {!showGoalUpdates && <td className="league-table-drawn">{ tableTypeFull ? team.homeDrawn : team.drawn }</td>}
                            {!showGoalUpdates && <td className="league-table-lost">{ tableTypeFull ? team.homeLost : team.lost }</td>}
                            {!tableTypeLatestFixtures && <td className="league-table-goalsFor">{ tableTypeFull ? team.homeGoalsFor : team.goalsFor }</td>}
                            {!tableTypeLatestFixtures && <td className="league-table-goalsAgainst">{ tableTypeFull ? team.homeGoalsAgainst : team.goalsAgainst }</td>}
                            {tableTypeFull && <td className="league-table-won">{ team.awayWon }</td>}
                            {tableTypeFull && <td className="league-table-drawn">{ team.awayDrawn }</td>}
                            {tableTypeFull && <td className="league-table-lost">{ team.awayLost }</td>}
                            {tableTypeFull && <td className="league-table-goalsFor">{ team.awayGoalsFor }</td>}
                            {tableTypeFull && <td className="league-table-goalsAgainst">{ team.awayGoalsAgainst }</td>}
                            <td className="league-table-goalDifference">{ team.goalDifference }</td>
                            <td className={`league-table-points ${showGoalUpdates ? "showGoalUpdates" : ""}`}>{ team.points }</td>
                            {!showGoalUpdates &&
                                <td className="league-table-form">
                                    {team.form.map((formElement, i) => {
                                        return <span key={i} className={"league-table-form-cell " + formElement}>{ formElement }</span>
                                    })}
                                </td>
                            }
                        </tr>
                    )
                })}
            </tbody>
        </table>

    if(tableTypeLatestFixtures) {
        return (
            <div className="league-table-in-play">
                <h3>As It Stands Table</h3>
                {mainBodyOfTable}
            </div>
        )
    } else {
        return (
            <div className="container-main-content-tables">
                <img className="full-screen-background-image" src={MAIN_BACKGROUND_IMAGE} alt=""></img>
                <div className="container-card tables">
                    <div className="main-header">
                        <h1>Premier League Table { hasSeasonFinished ? " - Final" : "" }</h1>
                    </div>
                    {mainBodyOfTable}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        appData: state.appData
    }
}

Tables = connect(mapStateToProps, null)(Tables)

export default Tables;