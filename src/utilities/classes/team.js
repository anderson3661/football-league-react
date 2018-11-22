import * as helpers from '.././helper-functions/helpers';

class Team {

    teamName = "";
    isATopTeam = false;
    teamsPlayed = [];
    teamsPlayedAtHome = [];
    teamsPlayedAway = [];
    orderOfFixtures = [];

    numberOfTeams;

    constructor(appData, arrayNumberOfTeam) {
        this.teamName = appData.teamsForSeason[arrayNumberOfTeam].teamName;
        this.isATopTeam = appData.teamsForSeason[arrayNumberOfTeam].isATopTeam;
        this.numberOfTeams = appData.miscInfo.numberOfTeams;
    }

    numberOfMatchesPlayed() { return this.orderOfFixtures.length; }

    numberOfHomeGamesPlayed() { return this.teamsPlayedAtHome.length; }

    allHomeGamesPlayed() { return (this.teamsPlayedAtHome.length === this.numberOfTeams - 1); }

    allAwayGamesPlayed() { return (this.teamsPlayedAway.length === this.numberOfTeams - 1); }

    venueLast() { return this.orderOfFixtures[this.orderOfFixtures.length - 1]; }

    venuePrevious() { return this.orderOfFixtures[this.orderOfFixtures.length - 2]; }

    fixtureAlreadyPlayed(opposingTeam) { return helpers.getPositionInArrayOfObjects(this.teamsPlayedAway, "teamName", opposingTeam) !== -1; }

    wereLastTwoMatchesAtHome() {
        let nMatchesPlayed = this.numberOfMatchesPlayed();
        if (nMatchesPlayed > 1 && (this.orderOfFixtures[nMatchesPlayed - 1] === "H" && this.orderOfFixtures[nMatchesPlayed - 2] === "H")) return true;
        return false;
    }

    tooManyHomeGamesPlayed() {
        //During the last 1/4 of season do not allow a team to play in total more than 1 home v away matches (before that it is 2)
        let nToCompare = (this.numberOfMatchesPlayed() <= ((this.numberOfTeams - 1) * 2 * 3 / 4)) ? 2 : 2;
        return ((this.teamsPlayedAtHome.length - this.teamsPlayedAway.length) >= nToCompare);
    }

    tooManyAwayGamesPlayed() {
        //During the last 1/4 of season do not allow a team to play in total more than 1 away v home matches (before that it is 2)
        let nToCompare = (this.numberOfMatchesPlayed() <= ((this.numberOfTeams - 1) * 2 * 3 / 4)) ? 2 : 2;
        return ((this.teamsPlayedAway.length - this.teamsPlayedAtHome.length) >= nToCompare);
    }

    hasPlayedOtherTeamRecently(opposingTeam) {
        let oppositionMatch;
        //During first 3/4 of season do not allow a team to play against another team within 3 matches of each other
        if (this.numberOfMatchesPlayed() <= ((this.numberOfTeams - 1) * 2 * 3 / 4)) {
            oppositionMatch = helpers.getPositionInArrayOfObjects(this.teamsPlayed, "teamName", opposingTeam);
            if (oppositionMatch !== -1) {
                if (this.numberOfMatchesPlayed() - oppositionMatch < 4) return true;
            }
        }
        return false;
    }

    updateCheckArraysForTeam(opposingTeamName, dateOfFixture, venue) {
        this.teamsPlayed.push({ 'teamName': opposingTeamName, 'date': dateOfFixture, 'venue': venue });
    }

    updateCheckArraysForHomeTeam(awayTeamName, dateOfFixture) {
        this.teamsPlayedAtHome.push({ 'teamName': awayTeamName, 'date': dateOfFixture });
        this.orderOfFixtures.push('H');
    }

    updateCheckArraysForAwayTeam(homeTeamName, dateOfFixture) {
        this.teamsPlayedAway.push({ 'teamName': homeTeamName, 'date': dateOfFixture });
        this.orderOfFixtures.push('A');
    }
}

export default Team;