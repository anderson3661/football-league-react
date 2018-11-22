## What does this app do

This app was inspired by my love of web development, football and statistics.

It is written using React 16.4 and uses React Router and Redux.

It allows you to play through a season's fixtures for a football league (e.g. English Premier League).
The way it works is that for each minute of each fixture a random number is generated and if that number is within a certain tolerance then a goal is scored.
You start by entering teams and various factors on the <span>Administration</span> page.
Once teams and factors have been entered (or the defaults used) then click on the <span>Create Season's Fixtures</span> to create the fixtures for the season.
This will populate the <span>Remaining Fixtures</span> page.
Then click on the <span>Latest Fixtures</span> page to start the first set of fixtures.
Once a set of fixtures has been completed the <span>Results, Table and Table(Full)</span> pages will be updated.

You can specify:
* which teams make up the league
* the top teams, and whether they have a slight advantage
* whether the home teams have a slight advantage
* the periods during a match which are more likely to produce goals
* whether you want high-scoring or low-scoring matches
* the number of fixtures that each team plays (i.e. allowing you to quickly run through a whole season)
* the speed at which the fixtures are updated