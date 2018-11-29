import * as helpers from '../../utilities/helper-functions/helpers';

import { createTable as helpersCreateTable } from '../../utilities/data';

const HOME_TEAM = 0;

export function getPositionInTable(teamsForSeason, setOfFixtures, table, teamName) {
    let homeOrAwayCounter;
    let teamIndex;
    let team;

    if (table.length === 0) helpersCreateTable(table, teamsForSeason);        //If this is the first set of fixtures then create a new blank table

    setOfFixtures.fixtures.forEach(fixture => {
        let {homeTeam, awayTeam, homeTeamsScore, awayTeamsScore} = fixture;

        for (homeOrAwayCounter = 0; homeOrAwayCounter <= 1; homeOrAwayCounter++) {

            teamIndex = helpers.getPositionInArrayOfObjects(table, "teamName", (homeOrAwayCounter === HOME_TEAM) ? homeTeam : awayTeam);

            debugger;
            team = table[teamIndex];

            team.played = team.played + 1;

            // team.won = team.won;
            // team.drawn = team.drawn;
            // team.lost = team.lost;

            // team.points = team.points;

            if (homeOrAwayCounter === HOME_TEAM) {

                // team.homeWon = team.homeWon;
                // team.homeDrawn = team.homeDrawn;
                // team.homeLost = team.homeLost;

                if (homeTeamsScore > awayTeamsScore) {
                    team.homeWon++;
                    team.won++;
                    team.points += 3;
                }

                if (homeTeamsScore === awayTeamsScore) {
                    team.homeDrawn++;
                    team.drawn++;
                    team.points += 1;
                }

                if (homeTeamsScore < awayTeamsScore) {
                    team.homeLost++;
                    team.lost++;
                }

                team.goalsFor += homeTeamsScore;
                team.goalsAgainst += awayTeamsScore;
                team.homeGoalsFor += homeTeamsScore;
                team.homeGoalsAgainst += awayTeamsScore;
                team.goalDifference += homeTeamsScore - awayTeamsScore;

            } else {

                // team.awayWon = team.awayWon;
                // team.awayDrawn = team.awayDrawn;
                // team.awayLost = team.awayLost;

                if (awayTeamsScore > homeTeamsScore) {
                    team.awayWon++;
                    team.won++;
                    team.points += 3;
                }

                if (awayTeamsScore === homeTeamsScore) {
                    team.awayDrawn++;
                    team.drawn++;
                    team.points += 1;
                }

                if (awayTeamsScore < homeTeamsScore) {
                    team.awayLost++;
                    team.lost++;
                }

                team.goalsFor += awayTeamsScore;
                team.goalsAgainst += homeTeamsScore;
                team.awayGoalsFor += awayTeamsScore;
                team.awayGoalsAgainst += homeTeamsScore;
                team.goalDifference += awayTeamsScore - homeTeamsScore;
            }

        }
    });

    table.sort(helpers.deepSortAlpha(['points', 'goalDifference', 'goalsFor', 'teamName']));

    return helpers.getPositionInArrayOfObjects(table, "teamName", teamName) + 1;

}