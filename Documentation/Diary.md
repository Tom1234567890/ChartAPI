###09-Sep-16

Code for the correlation has been completed.

This involves a new object called ChartApiCorrelaitonWidget (I am SOO good at naming things today).

Create the widget with the X Axis and plug in the data for each series of data. It will then return the start and end point of a correlation.

By using the function DrawCorrelation(); on any chart it will draw the correlation of every series it has.

If the chart type dosn't support this (Looking at the perportion charts here) it will throw an exception by default.

A simmilar process is used to create the widget object, CreateCorrelation();, this is of no relation to DrawCorrelation however can be used to get the correlation without drawing it (No idea why you would want this)

VERY importantly these functions return the widget object, which i will be continuing to work on. The user will be able to interact with the widget in order to draw out the correlation coefficient ect.

For now I'll be checking in my changes as the scatter chart is finally polished and complete.

Incidentally there where two changes to the base object, all lines will now be 1px rarther then 2px because it looks better, and there is an additional function to draw out dotted lines.

###05-Sep-16

Alright, Epithany complete.

The last two days hgave been fairly quiet. 

In this I refactored the Git file hierachy to cope with the increased demand, and got Visual Studios to link to github (More hastle than it was worth, but it decided to break when I was adding new files so it became nessisary).

So while I repaired and upgraded VS I thought about my intention for the line chart. The intention was more akain to a scatter graph, where the points have a line of best fit applied. 

This opens the project up to more interesting analysis & features, whereas the line chart only displays what it is given.

So I have created the scatter graph in order to begin this process. This took about 10 min thanks to all the work I've done with templates and the quite handy line chart code.

Next I've bumped the correlation widget upwards in the WorkList™ so that the scatter graph can work with it. At the moment the scatter graph will not be useful without it.

###03-Sep-16

This update took a bit longer than anticipated. Not that it was particularly difficult, I've just been particularly busy. 

Plenty new files have been added, so I'll talk a bit more about the structure of the project.

The base object that contains all the setup code is held in the ChartApi.js. This will need to be included for every chart.

Each parent object has it's own file, shared with all it's children. The file TemplateChartApi.js set's out an empty chart file to be used in the future.

The Proportion chart has been added in order to test out this template. It's not quite finished but can be showcased in ProportionChart.html. All that remains is to work out what is happening with multiple data set's and legends.

The proportion chart has been eye opening. I can now see the limitations of the base object more clearly and will be taking steps to enhance it before making more charts.

Finally I've realized that I've lost my way somewhat. While the base object is well thought out with regards to the future, the line chart and proportion chart's do not lend themselves to the future I'm planning.

Too much time has been spent on this project ad-hoc. I'll be seriously reconsidering the roadmap and how the charts thus far fit into it.

###01-Sep-16

Sleepless but awesome, the refactor is complete.

We now use three 'teirs' of objects.

- Base Tier
- Parent Tier
- Child Tier

The Base tier is a one of a kind object that loads the data and settings, draws the chart header and contains all of the User Interface functions.
This tier is also responsible for the lower level helper functions like "Line" and "Circle".

The Parent tier is responsible for the layout, and some calculation to go with that.
Each of these will be responsible for several charts. For instance the line chart and the bar chart will share many elements (Y axis, X Axis, Legend), so they will have the same parent. However the proportion charts will not contain these elements so they will use a different parent.

The Child teir contains the instructions to render the chart specifically. For instance it will draw out lines for the line chart, or bars for the bar chart.

This change let me review everything I've done so far, and you'll see some comments & redundant fields being stripped out. I also noticed that the error handling was incorrectly set up, so I've re-implemented that more successfully.

The only thing left to do is to separate the files out. Going forwards the base tier is kept separate and the parents are kept in their own files with all their children <3 this reduces what needs to be loaded without getting as cumbersome as it could be.

I'll leave that till tomorrow, right now I need some sleep.

Goodnight, 

###31-Aug-16
Work has now finished on the line graph.

This chart is not directly related to the vision in any meaningful way, however it does serve as a springboard for future development.

Noticed some issues:

-The Y Axis needs tightening up. Currently it parses the Y Value into the first 5 characters. I would like it to select values more intelligently, for instance to select integers or multiples of five or multiples of 10.

That's parked for now, as it's not entirely critical and I need some more time to think that idea through.

- I have allowed users to start new lines of text on the legend. IMO this needs to be limited to two lines and implemented across the whole chart.

I've added these to the todo list, and will work on them when I have time.

In the immediate future I'm looking at how to compartmentalize the code so that different types of chart share the most of the same code. The next update will likely include a lot of refactoring in addition to the new chart, the proportion chart.

The proportion chart is my way of creating a pie chart. The human eye is particularly poor at estimating angles in a pie chart, however estimating linear distance is quite easy.

I would rather use a chart which split the total area of a chart into the proportions of the chart. This seems simpler, more useful and furthermore is a better use of the chart space.

This chart will not use the YAxis and XAxis that the series charts uses, so I will be using a different parent object to create those.

I am very excited to see what comes out of this refactoring, as well as the upcoming filtering widget.
