// ACTION TYPE CONSTANTS

export const APP_LOAD_INITIAL_DATA = 'APP_LOAD_INITIAL_DATA';
export const ADMIN_UPDATE = 'ADMIN_UPDATE';
export const ADMIN_CREATE_FIXTURES = 'ADMIN_CREATE_FIXTURES';
export const ADMIN_RESET_APP = 'ADMIN_RESET_APP';
export const LATEST_FIXTURES_UPDATE_AFTER_RESULTS = 'LATEST_FIXTURES_UPDATE_AFTER_RESULTS';
export const LATEST_FIXTURES_SEASON_HAS_FINISHED = 'LATEST_FIXTURES_SEASON_HAS_FINISHED';


// ACTION CREATORS

export function appLoadInitialData(data) {
    return {
        type: APP_LOAD_INITIAL_DATA,
        data
    }
}

export function adminUpdate(data) {
    return {
        type: ADMIN_UPDATE,
        data
    }
}

export function adminCreateFixtures(data) {
    return {
        type: ADMIN_CREATE_FIXTURES,
        data
    }
}

export function adminResetApp(data) {
    return {
        type: ADMIN_RESET_APP,
        data
    }
}

export function latestFixturesUpdateAfterResults(data) {
    return {
        type: LATEST_FIXTURES_UPDATE_AFTER_RESULTS,
        data
    }
}

export function latestFixturesSeasonHasFinished(data) {
    return {
        type: LATEST_FIXTURES_SEASON_HAS_FINISHED,
        data
    }
}
