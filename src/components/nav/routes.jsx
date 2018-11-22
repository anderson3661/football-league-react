import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from '../home/home';
import Fixtures from '../fixtures';
import FixturesLatest from '../fixtures-latest';
import Tables from '../tables';
import TeamStats from '../team-stats/team-stats';
import Administration from '../administration';
import Help from '../help';
import Contact from '../contact';
import About from '../about';

const Routes = () => {
    return (
        <Switch>
            <Route path="/home" component={Home} />
            <Route exact path="/fixtures-latest" render={(props) => <FixturesLatest {...props} />} />
            <Route exact path="/fixtures" render={(props) => <Fixtures {...props.appData} displayRemainingFixtures={true} />} />
            <Route exact path="/fixtures/results" render={(props) => <Fixtures {...props.appData} displayResults={true} />} />
            <Route exact path="/tables" render={(props) => <Tables {...props.appData} />} />
            <Route exact path="/tables/full" render={(props) => <Tables {...props.appData} tableTypeFull={true} />} />
            <Route exact path="/teamstats/:teamName" render={(props) => <TeamStats {...props} />} />
            <Route path="/administration" render={(props) => <Administration appData={props.appData} onNumberOfFixturesForSeasonChange={this.handleNumberOfFixturesForSeasonChange} />} />
            <Route path="/help" component={Help} />
            <Route path="/contact" component={Contact} />
            <Route path="/about" component={About} />
            <Route path="*" component={Home} />
        </Switch>
    );
};

export default Routes;