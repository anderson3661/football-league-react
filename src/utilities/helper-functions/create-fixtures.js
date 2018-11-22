import Team from '../classes/team';
import SetOfFixtures from '../classes/set-of-fixtures';
import * as helpers from './helpers';

const CONSOLE_LOG_FIXTURES = false;
const NUMBER_OF_ATTEMPTS_TO_GET_SET_OF_TEAMS = 100000;

export function createFixtures(appData) {
    let i;
    let setOfFixtures;
    let setOfFixturesCounter;
    let retryCounter;
    let teams = [];
    let datesOfFixturesForSeason = [];
    let fixturesForSeason = [];
    let dateOfSetOfFixtures = appData.miscInfo.seasonStartDate;
    const {numberOfFixturesForSeason} = appData.miscInfo;
    
    // Populate the datesOfFixturesForSeason array, an element for every set of fixtures in the season
    for (i = 0; i < numberOfFixturesForSeason; i++) {
        datesOfFixturesForSeason.push({ 'date': dateOfSetOfFixtures = getFixturesDate(dateOfSetOfFixtures), 'numberOfFixtures': numberOfFixturesForSeason.toString() });
    }

    // Populate the teams array, an element for each team, containing properties and numerous methods
    for (i = 0; i < appData.teamsForSeason.length; i++) {
        teams.push(new Team(appData, i));
    }

    for (setOfFixturesCounter = 0; setOfFixturesCounter < numberOfFixturesForSeason; setOfFixturesCounter++) {

        if (CONSOLE_LOG_FIXTURES) {
            console.log('');
            console.log('Starting fixture set ' + (setOfFixturesCounter + 1));
        }

        if (setOfFixturesCounter === 32) {
            if (CONSOLE_LOG_FIXTURES) console.log('');
        }

        retryCounter = 0;

        setOfFixtures = undefined;

        while (setOfFixtures === undefined || setOfFixtures.fixtures === undefined) {

            setOfFixtures = {
                fixtures: (new SetOfFixtures(appData, teams)).createSetOfFixtures(),
                dateOfSetOfFixtures: datesOfFixturesForSeason[setOfFixturesCounter].date
            };

            retryCounter++;
            if (retryCounter > NUMBER_OF_ATTEMPTS_TO_GET_SET_OF_TEAMS) {
                console.log('Cannot get teams for set of fixtures');
                alert('Cannot create fixtures for season ... ' + fixturesForSeason.length + ' sets of fixtures created');
                return;
            }
        }

        updateCheckArrays(setOfFixtures, teams);

        fixturesForSeason.push(setOfFixtures);        //Update the array - this is used to output the matches to the web page
    }

    //Update the All Fixtures array in the data service and save
    appData.miscInfo.haveSeasonsFixturesBeenCreated = true;
    appData.setsOfFixtures = fixturesForSeason;
    // this.dataService.saveAppData();

    if (CONSOLE_LOG_FIXTURES) console.log('Fixtures created');

    return appData;

    // this.dataService.confirmationMessage("Fixtures created for season");
}

function updateCheckArrays(setOfFixtures, teams) {
    //We now have the 20 teams and therefore 10 matches.
    //Now update the arrays used to check numbers of home/away games and also the dates of these games
    let homeTeam = "";
    let awayTeam = "";
    let homeTeamIndex;
    let awayTeamIndex;

    homeTeamIndex = 0;
    awayTeamIndex = 0;

    setOfFixtures.fixtures.forEach(fixture => {
        homeTeam = fixture.homeTeam;
        awayTeam = fixture.awayTeam;

        homeTeamIndex = helpers.getPositionInArrayOfObjects(teams, "teamName", homeTeam);
        awayTeamIndex = helpers.getPositionInArrayOfObjects(teams, "teamName", awayTeam);

        teams[homeTeamIndex].updateCheckArraysForTeam(teams[awayTeamIndex].teamName, setOfFixtures.dateOfSetOfFixtures, "H");
        teams[awayTeamIndex].updateCheckArraysForTeam(teams[homeTeamIndex].teamName, setOfFixtures.dateOfSetOfFixtures, "A");
        teams[homeTeamIndex].updateCheckArraysForHomeTeam(teams[awayTeamIndex].teamName, setOfFixtures.dateOfSetOfFixtures);
        teams[awayTeamIndex].updateCheckArraysForAwayTeam(teams[homeTeamIndex].teamName, setOfFixtures.dateOfSetOfFixtures);

        if (CONSOLE_LOG_FIXTURES) console.log(homeTeam + ' v ' + awayTeam);
    });
}

function getFixturesDate(date) {
    let fixturesDate;
    let fixturesDateNew;

    fixturesDate = new Date(date);
    fixturesDateNew = new Date(fixturesDate);
    fixturesDateNew.setDate(fixturesDateNew.getDate() + 7);

    return fixturesDateNew.toDateString();
}