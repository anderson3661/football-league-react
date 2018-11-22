import { APP_LOAD_INITIAL_DATA, ADMIN_UPDATE, ADMIN_CREATE_FIXTURES, ADMIN_RESET_APP, LATEST_FIXTURES_UPDATE_AFTER_RESULTS, LATEST_FIXTURES_SEASON_HAS_FINISHED } from './actions';
import * as helpers from '../utilities/helper-functions/helpers';

const initialState = {
    //Load new data for the app in the App component rather than in this reducer because error/confirmation messages can be displayed easier in the App component
    // appData: new Data().getAppData()
};

export function updateAdminReducer(state = initialState, action) {
    let newState;
    switch (action.type) {

        case APP_LOAD_INITIAL_DATA :
        case ADMIN_CREATE_FIXTURES :
        case ADMIN_RESET_APP :
            // console.log('state: ', state);
            // console.log('action.data: ', action.data);
            newState = Object.assign({}, state, action.data);
            // console.log('newState: ', newState);

            return newState;

        case ADMIN_UPDATE :
            // console.log('ADMIN_UPDATE: ', action);
            newState = Object.assign({}, state);

            newState.appData.teamsForSeason = action.data.teams;

            //Loop through the object, i.e. miscInfo
            Object.keys(action.data.miscInfo).forEach(e => {

                if (typeof(action.data.miscInfo[e]) === 'object') {
                    
                    //Loop through the sub-object, i.e. miscInfo.goalFactors
                    Object.keys(action.data.miscInfo.goalFactors).forEach(e => {
                        newState.appData.miscInfo.goalFactors[e] = action.data.miscInfo.goalFactors[e];
                        // console.log(`key=${e}  value=${action.data.goalFactors[e]}`)
                    })
                } else {
                    newState.appData.miscInfo[e] = action.data.miscInfo[e];
                }
            });

            return newState;

        case LATEST_FIXTURES_UPDATE_AFTER_RESULTS :
            // console.log('state: ', state);
            // console.log('action.data: ', action.data);
            const indexSetOfFixtures = helpers.getPositionInArrayOfObjects(state.appData.setsOfFixtures, "dateOfSetOfFixtures", action.data.dateOfSetOfFixtures);
            // console.log('indexSetOfFixtures: ', indexSetOfFixtures);

            newState = Object.assign({}, state, {
                appData: {
                    miscInfo: Object.assign({}, state.appData.miscInfo, {
                            hasSeasonStarted: action.data.hasSeasonStarted,
                            dateOfLastSetOfFixtures: action.data.dateOfSetOfFixtures }),
                    setsOfFixtures: (indexSetOfFixtures === 0) ?
                            [{fixtures: action.data.fixtures, dateOfSetOfFixtures: action.data.dateOfSetOfFixtures}, ...state.appData.setsOfFixtures.slice(1)] :
                            [...state.appData.setsOfFixtures.slice(0, indexSetOfFixtures), {fixtures: action.data.fixtures, dateOfSetOfFixtures: action.data.dateOfSetOfFixtures}, ...state.appData.setsOfFixtures.slice(indexSetOfFixtures + 1)],
                    latestTable: [...action.data.table],
                    teamsForSeason: [...state.appData.teamsForSeason]
                }
            });
            // console.log('newState: ', newState);

            return newState;

        case LATEST_FIXTURES_SEASON_HAS_FINISHED :
            // console.log('state: ', state);
            // console.log('action.data: ', action.data);
            newState = Object.assign({}, state, {
                appData: {
                    miscInfo: Object.assign({}, state.appData.miscInfo, { hasSeasonFinished: action.data.hasSeasonFinished }),
                    setsOfFixtures: [...state.appData.setsOfFixtures],
                    latestTable: [...state.appData.latestTable],
                    teamsForSeason: [...state.appData.teamsForSeason]
                }
            });
            // console.log('newState: ', newState);

            return newState;

        default:
            return state;
    }
}
