import React from 'react';

import { MAIN_BACKGROUND_IMAGE } from '../../utilities/constants';

import './home.css';


const Home = () => {

    return (

        <div className="container-home">
            <img className="full-screen-background-image" src={MAIN_BACKGROUND_IMAGE} alt=""></img>

            <div className="container-card">

                <header>
                    <h1>Premier League Football App</h1>
                </header>

                <p>This app allows you to play through a season's fixtures for a football league (e.g. English Premier League).</p>
                <p>The way it works is that for each minute of each fixture a random number is generated and if that number is within a certain tolerance then a goal is scored.</p>
                <p>You start by entering teams and various factors on the <span>Administration</span> page.</p>
                <p>Once teams and factors have been entered (or the defaults used) then click on the <span>Create Season's Fixtures</span> to create the fixtures for the season.</p>
                <p>This will populate the <span>Remaining Fixtures</span> page.</p>
                <p>Then click on the <span>Latest Fixtures</span> page to start the first set of fixtures.</p>
                <p>Once a set of fixtures has been completed the <span>Results, Table and Table(Full)</span> pages will be updated.</p>
                <p>&nbsp;</p>
                <p>You can specify:</p>
                <ul>
                    <li>which teams make up the league</li>
                    <li>the top teams, and whether they have a slight advantage</li>
                    <li>whether the home teams have a slight advantage</li>
                    <li>the periods during a match which are more likely to produce goals</li>
                    <li>whether you want high-scoring or low-scoring matches</li>
                    <li>the number of fixtures that each team plays (i.e. allowing you to quickly run through a whole season)</li>
                    <li>the speed at which the fixtures are updated</li>
                </ul>
            </div>
        </div>
    );
}
 
export default Home;