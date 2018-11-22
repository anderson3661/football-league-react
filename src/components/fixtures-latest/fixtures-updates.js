import * as helpers from '../../utilities/helper-functions/helpers';

const SHOW_FORM_MATCHES = 10;
const HOME_TEAM = 0;

export function getMaximumMinutes(fixture, maxMinutesForPeriod) {
    return Math.max(maxMinutesForPeriod, fixture.maxNumberOfMinutes - fixture.minutesPlayed + 1);    //Add 1 to fixture value
}

export function getNextSetOfFixtures(hasSeasonStarted, dateOfLastSetOfFixtures, allSeasonsFixtures) {
    let i;
    let setOfFixtures;

    if (dateOfLastSetOfFixtures === "" && !hasSeasonStarted) {
        return allSeasonsFixtures[0];
    } else {
        i = 0;
        // console.log('allSeasonsFixtures:', allSeasonsFixtures);
        for (setOfFixtures of allSeasonsFixtures) {
            if (setOfFixtures.dateOfSetOfFixtures === dateOfLastSetOfFixtures && i !== allSeasonsFixtures.length - 1) {
                return allSeasonsFixtures[i + 1];
            }
            i++;
        };
    }

    return getEmptySetOfFixtures();
}

export function getEmptySetOfFixtures() {
    return { dateOfSetOfFixtures: "", fixtures: [] };
}

export function setupInPlayTable(appData) {
    let tableInPlay;

    //Deep clone the array
    tableInPlay = JSON.parse(JSON.stringify(appData.latestTable));

    //Add a new array element for Form
    tableInPlay.forEach(team => {
        team.form.push("");
    });

    return tableInPlay;
}

export function updateInPlayTable(fixture, tableBeforeFixtures, tableBeforeUpdate) {
    let homeOrAwayCounter;
    let thisTeam;
    let homeTeam;
    let awayTeam;
    let homeTeamScore;
    let awayTeamScore;
    let indexBeforeFixture;
    let indexInPlay;
    let teamBeforeFixture;
    let teamInPlay;
    let tableInPlay;

    //Deep clone the table before this update
    tableInPlay = JSON.parse(JSON.stringify(tableBeforeUpdate));

    homeTeam = fixture.homeTeam;
    awayTeam = fixture.awayTeam;
    homeTeamScore = fixture.homeTeamsScore;
    awayTeamScore = fixture.awayTeamsScore;

    for (homeOrAwayCounter = 0; homeOrAwayCounter <= 1; homeOrAwayCounter++) {

        thisTeam = (homeOrAwayCounter === HOME_TEAM) ? homeTeam : awayTeam;

        indexBeforeFixture = helpers.getPositionInArrayOfObjects(tableBeforeFixtures, "teamName", thisTeam);
        teamBeforeFixture = tableBeforeFixtures[indexBeforeFixture];

        indexInPlay = helpers.getPositionInArrayOfObjects(tableInPlay, "teamName", thisTeam);
        teamInPlay = tableInPlay[indexInPlay];

        teamInPlay.played = teamBeforeFixture.played + 1;

        teamInPlay.won = teamBeforeFixture.won;
        teamInPlay.drawn = teamBeforeFixture.drawn;
        teamInPlay.lost = teamBeforeFixture.lost;

        teamInPlay.points = teamBeforeFixture.points;

        if (homeOrAwayCounter === HOME_TEAM) {

            teamInPlay.homeWon = teamBeforeFixture.homeWon;
            teamInPlay.homeDrawn = teamBeforeFixture.homeDrawn;
            teamInPlay.homeLost = teamBeforeFixture.homeLost;

            if (homeTeamScore > awayTeamScore) {
                teamInPlay.homeWon++;
                teamInPlay.won++;
                teamInPlay.points += 3;
                teamInPlay.form[teamInPlay.form.length - 1] = "W";
            }

            if (homeTeamScore === awayTeamScore) {
                teamInPlay.homeDrawn++;
                teamInPlay.drawn++;
                teamInPlay.points += 1;
                teamInPlay.form[teamInPlay.form.length - 1] = "D";
            }

            if (homeTeamScore < awayTeamScore) {
                teamInPlay.homeLost++;
                teamInPlay.lost++;
                teamInPlay.form[teamInPlay.form.length - 1] = "L";
            }

            teamInPlay.goalsFor = teamBeforeFixture.goalsFor + homeTeamScore;
            teamInPlay.goalsAgainst = teamBeforeFixture.goalsAgainst + awayTeamScore;
            teamInPlay.homeGoalsFor = teamBeforeFixture.homeGoalsFor + homeTeamScore;
            teamInPlay.homeGoalsAgainst = teamBeforeFixture.homeGoalsAgainst + awayTeamScore;
            teamInPlay.goalDifference = teamBeforeFixture.goalDifference + homeTeamScore - awayTeamScore;

        } else {

            teamInPlay.awayWon = teamBeforeFixture.awayWon;
            teamInPlay.awayDrawn = teamBeforeFixture.awayDrawn;
            teamInPlay.awayLost = teamBeforeFixture.awayLost;

            if (awayTeamScore > homeTeamScore) {
                teamInPlay.awayWon++;
                teamInPlay.won++;
                teamInPlay.points += 3;
                teamInPlay.form[teamInPlay.form.length - 1] = "W";
            }

            if (awayTeamScore === homeTeamScore) {
                teamInPlay.awayDrawn++;
                teamInPlay.drawn++;
                teamInPlay.points += 1;
                teamInPlay.form[teamInPlay.form.length - 1] = "D";
            }

            if (awayTeamScore < homeTeamScore) {
                teamInPlay.awayLost++;
                teamInPlay.lost++;
                teamInPlay.form[teamInPlay.form.length - 1] = "L";
            }

            teamInPlay.goalsFor = teamBeforeFixture.goalsFor + awayTeamScore;
            teamInPlay.goalsAgainst = teamBeforeFixture.goalsAgainst + homeTeamScore;
            teamInPlay.awayGoalsFor = teamBeforeFixture.awayGoalsFor + awayTeamScore;
            teamInPlay.awayGoalsAgainst = teamBeforeFixture.awayGoalsAgainst + homeTeamScore;
            teamInPlay.goalDifference = teamBeforeFixture.goalDifference + awayTeamScore - homeTeamScore;
        }

        // Just take the last (i.e. latest) 10 games for the Form column
        if (teamInPlay.form.length > SHOW_FORM_MATCHES) {
            teamInPlay.form = teamInPlay.form.slice(teamInPlay.form.length - SHOW_FORM_MATCHES);
        }
    }

    tableInPlay.sort(helpers.deepSortAlpha(['points', 'goalDifference', 'goalsFor', 'teamName']));

    return tableInPlay;
}