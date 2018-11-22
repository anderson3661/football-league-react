// import { DataService } from '../services/data.service';
// import { MiscInfoModel, TeamsModel, FixtureModel } from '../interfaces/interfaces';
import * as helpers from '../helper-functions/helpers';

const EXTRA_MINUTES_FIRST_HALF = 5;
const EXTRA_MINUTES_SECOND_HALF = 9;

const HALF_TIME = "Half-Time";
const FULL_TIME = "Full-Time";


export class Fixture {

    dateOfFixture;
    timeOfFixture;
    homeTeam;
    awayTeam;
    homeTeamsScore;
    awayTeamsScore;
    homeTeamsGoals = "";
    awayTeamsGoals;
    isFirstHalf;
    injuryTimeFirstHalf;
    injuryTimeSecondHalf;
    statutoryMinutes;
    maxNumberOfMinutes;
    minutesPlayed;
    minutesInfo;
    hasFixtureFinished;

    goalFactors;
    props;


    constructor(fixture) {
        this.timeOfFixture = fixture.timeOfFixture;
        this.homeTeam = fixture.homeTeam;
        this.awayTeam = fixture.awayTeam;
    }

    getFixtureObject() {
        return {
            dateOfFixture: this.dateOfFixture,
            timeOfFixture: this.timeOfFixture,
            homeTeam: this.homeTeam,
            awayTeam: this.awayTeam,
            homeTeamsScore: this.homeTeamsScore,
            awayTeamsScore: this.awayTeamsScore,
            homeTeamsGoals: this.homeTeamsGoals,
            awayTeamsGoals: this.awayTeamsGoals,
            injuryTimeFirstHalf: this.injuryTimeFirstHalf,
            injuryTimeSecondHalf: this.injuryTimeSecondHalf,
            minutesPlayed: this.minutesPlayed,
            minutesInfo: this.minutesInfo,
            hasFixtureFinished: this.hasFixtureFinished
        }
    }

    setUpFixture(miscInfo) {
        let goalFactorsSource;

        this.isFirstHalf = true;
        this.hasFixtureFinished = false;
        this.minutesPlayed = 0;
        this.minutesInfo = '';

        this.injuryTimeFirstHalf = Math.floor(Math.random() * EXTRA_MINUTES_FIRST_HALF + 1);
        this.injuryTimeSecondHalf = Math.floor(Math.random() * EXTRA_MINUTES_SECOND_HALF + 1);

        // Goal Factors on admin needs to be a string, and then it is transposed here into an array
        goalFactorsSource = miscInfo.goalFactors.likelihoodOfAGoalDuringASetPeriod;
        goalFactorsSource = goalFactorsSource.replace(/'/g, '"');         //Need to do this otherwise reading the value from local storage causes an error
        this.goalFactors = JSON.parse("[" + goalFactorsSource + "]");

    }

    startFixture(haveFixturesBeenPaused) {
        //Set the scores to zero for the start of the fixture
        if (this.isFirstHalf) {
            this.homeTeamsScore = 0;
            this.awayTeamsScore = 0;
            this.homeTeamsGoals = "";
            this.awayTeamsGoals = "";
        }

        this.statutoryMinutes = (this.isFirstHalf) ? 45 : 90;
        this.minutesPlayed = (this.isFirstHalf) ? 0 : 45;
        this.maxNumberOfMinutes = this.statutoryMinutes + ((this.isFirstHalf) ? this.injuryTimeFirstHalf : this.injuryTimeSecondHalf);
    }

    updateFixture(teams, miscInfo) {
        let i;
        // let updateTable;
        let minutesinMatchFactor;
        let homeTeamUpdate;
        let awayTeamUpdate;

        // updateTable = false;
        homeTeamUpdate = false;
        awayTeamUpdate = false;

        if (this.minutesPlayed < this.maxNumberOfMinutes) {

            minutesinMatchFactor = 0;

            for (i = 0; i < this.goalFactors[0].length; i++) {
                if (this.minutesPlayed <= this.goalFactors[0][i].minutes) {
                    minutesinMatchFactor = this.goalFactors[0][i].factor;
                    break;
                }
            }

            this.minutesPlayed++;

            if (this.minutesPlayed <= this.maxNumberOfMinutes) {
                // if (this.hasTeamScored(teams, miscInfo, "home", minutesinMatchFactor) && !updateTable) updateTable = true;
                // if (this.hasTeamScored(teams, miscInfo, "away", minutesinMatchFactor) && !updateTable) updateTable = true;
                homeTeamUpdate = this.hasTeamScored(teams, miscInfo, "home", minutesinMatchFactor);
                awayTeamUpdate = this.hasTeamScored(teams, miscInfo, "away", minutesinMatchFactor);
            }

            //Check for half time or end of fixtures
            if (this.minutesPlayed === this.maxNumberOfMinutes) {
                if (this.isFirstHalf) {
                    this.minutesInfo = HALF_TIME;
                    this.isFirstHalf = false;
                } else {
                    this.minutesInfo = FULL_TIME;
                    this.hasFixtureFinished = true;
                }
            } else {
                this.minutesInfo = this.minutesPlayed + ((this.minutesPlayed === 1) ? " min" : " mins");
            }

        }

        // if (updateTable) {
            // debugger;
        // }

        return {homeTeamUpdate, awayTeamUpdate};
    }

    hasTeamScored(teams, miscInfo, whichTeam, minutesinMatchFactor) {
        let thisTeam;
        let awayTeamFactor;
        let isNotATopTeamFactor;
        let isItAGoalFactor;

        awayTeamFactor = (whichTeam === "home") ? 1 : miscInfo.goalFactors.isAwayTeam;

        thisTeam = this[whichTeam + "Team"];
        
        isNotATopTeamFactor = (teams[helpers.getPositionInArrayOfObjects(teams, "teamName", thisTeam)].isATopTeam) ? 1 : miscInfo.goalFactors.isNotATopTeam;

        isItAGoalFactor = miscInfo.goalFactors.isItAGoal;

        // Has a goal been scored
        if (Math.floor(Math.random() * miscInfo.goalFactors.baseForRandomMultiplier * minutesinMatchFactor * awayTeamFactor * isNotATopTeamFactor) < isItAGoalFactor) {

            this[whichTeam + "TeamsScore"] += 1;

            if (this.minutesPlayed > this.statutoryMinutes) {
                this[whichTeam + "TeamsGoals"] += this.statutoryMinutes.toString() + "(+" + (this.minutesPlayed - this.statutoryMinutes).toString() + ")  ";
            } else {
                this[whichTeam + "TeamsGoals"] += this.minutesPlayed + "  ";
            }

            return true       // Return true to update table and re-display
        }
        return false;
    }

}