###12-Sep-16

Halfway!

Yesterday I started work on the testing page, and so far I've got it set up to create a barely valid settings object and plug in a large amount of random data. I'll be expanding upon this later.

I then went on to complete the data refactor. I'm using a simple 2d array where the first array contains the category names. So far this has been more successful, making a lot of operations much easier. This required a lot of work to keep successful however I can already see it making the process easier.

Next the Encapsulation. This was a pain, as the private functions has a different identity to the public functions (?!?!?!?!) however I created a workaround where the object would create a reference to itself that could be accessed by the private functions (Javascript is such a weird language). Of the functions used in creating a chart, 10 of the 18 are now hidden. The remaining are the two used for correlation, the three used in rendering, one used in removing and the over writable LoadChartData function.

The Widget was a huge success, as there is only one public function, everything else has been made private. In total I have removed 683 “this.” to replace them with the identifier “me.”.

So I've looked at the testing page to find absolutely nothing's changed. Yay. 

The nature of making architectural changes is that there is depressingly nothing afterwards to show off.

###10-Sep-16

Spellchecked yesterdays entry... whoops.

Following on from yesterday's work I've refactored the code again.

All the HTML interaction (I.E: setting up the SVG element and the low level functions that create the SVG elements) have been moved out of the base chart object and into the widget object. 

The widget object will be used to render the correlation widget, and any other future widgets. I could have duplicated the code, however this is a much neater method that will stand the test of time.

I have made two changes to the base API while working at this.

There is a new function called EventRect(). It took a lot of work to do this, so I'm  pretty proud.

This function will create a rectangle that will call an event to be handled on the API object. This allows for hover effects and clicking functionality, finally making the API interact-able.

One of the earliest design decisions I made, before even making my second commit, was to switch from using the HTML5 Canvas element to the HTML5 SVG element. While this has also created a host of other improvements, the key deciding point is this functionality. I'm glad to be able to say I've made the correct decision today, when I am finally able to take advantage of this.

A change I made last night but failed to document is the DottedLine() function on the base object. This is identical to Line(), with an additional attribute to bring in some dashes. The series charts will be using this to draw out the correlated lines, and I imagine it will be useful in the future.

The final change is to the text function. This now splits the text into different lines (Denoted by '\n') and draws them underneath each other. It also takes an additional, but not required, number that defines the line spacing. I feel this line spacing needs improvement however I don't see a good method for this just yet. (Perhaps using bounding boxes & increments?)

This don't currently support vertical text, as additional development will be needed, however I see that coming in use in the immediate future.

With regards to the correlation widget, the calculation has now been made to test the level of correlation. I have been using online resources in order to obtain the calculations required, however I don't think that I am using the best method at the moment. If you look at the example charts, the purple line on the scatter graph is seems exceedingly uncorrelated, whereas I would  expect about 80% correlation.

Since this is my first foray into statistical analysis I will be fact checking this thoroughly,  and intend to visit the library tomorrow.

However, regardless of the method, it's safe to say the technology works. We can plot several different correlations and support them with a function and a coefficient.

So that is what has been done. What has yet to be worked on is also extremely interesting:

- The fabulous testing automation

Simply put, this will use JavaScript to input a verity of data, settings and to stretch and squash the chart to obtain various results. This will speed up testing, and lend itself to future automation. This will need to be done before the rest of the changes to ensure the product is fully functional as exists.

- The grand data refactoring.

Data held as arrays in named objects really doesn't make much sense. If this project is to be taken seriously it needs to use a greater standard. This is most parts research and background development.

This also ties into two other interesting ideas, the idea of an inconsistent X Axis and the idea of using dates for the X Axis.

An inconsistent X Axis would mean significant changes, however I feel it will be useful in many scientific situations. This will mean recreating the X Axis similar to the Y Axis in many cases.

An date based axis is also very interesting when considering 

- The harrowing object encapsulation.

This is simply a tasks to reduce the technical debt currently in the system. At the moment the project has a large amount of public variables, leading to writing out this. before an absurdly large amount of objects. This needs to be cut down where possible, perhaps by using local copies effectively.

This is also a good chance to review the code so far, something I haven't done properly since splitting the project into three tiers of objects.

Finally the naming of a large amount of variables will be called into question thanks to the new base widget object.

- The glorious base functionality expansion.

While working with the base API thanks to the proportion chart I've listed a couple of improvements that could be made in order to speed up future development:

Truncation

We need to truncate the Y Axis in the base object, in a similar style to the low level HTML functions.

Text Overlap detection.

Used to prevent X & Y axis text from overlapping. This is currently implemented in the proportion chart's Y axis, however needs to become universal.

Also this doesn't quite work with vertical text.

Chart Logging

The amount of chart messages is getting absurd. There needs to be a debug mode or similar.

This is also a good time to make sure everything that should have a message, does have a message.

- The beautiful user interaction addition.

As a result of the recent breakthrough with the legend intractability, the older charts need to be brought up to speed with hover text (If possible), hover effects and legend interactivity.

Legend interactivity is a normal industry standard, where pressing on the legend will hide / show the relevant series.

I'm not entirely sold on this method â€“ I can see the removal of disagreeing data becoming prevalent if we allow for this, however there is also the need to focus on the data that matters. Hopefully I will make my mind up before coming to this task.


All these changes will take a long time to complete, some more so than others, but by paying this technological debt now we can make a huge saving in the future. 

###09-Sep-16

Code for the correlation widget has been completed.

This involves a new object called ChartApiCorrelaitonWidget (I am SOO good at naming things today).

Create the widget with the X Axis and plug in the data for each series of data. It will then return the start and end point of a correlation.

By using the function DrawCorrelation() on any chart it will draw the correlation of every series it has.

If the chart type doesn't support this (Looking at the proportion charts here) it will throw an exception by default.

A similar process is used to create the widget object, CreateCorrelation(), this is of no relation to DrawCorrelation however can be used to get the correlation without drawing it (No idea why you would want this)

VERY importantly these functions return the widget object, which I will be continuing to work on. The user will be able to interact with the widget in order to draw out the correlation coefficient ect.

For now I'll be checking in my changes as the scatter chart is finally polished and complete.

Incidentally there where two changes to the base object, all lines will now be 1px rather then 2px because it looks better, and there is an additional function to draw out dotted lines.

###05-Sep-16

Alright, Epithany complete.

The last two days hgave been fairly quiet. 

In this I refactored the Git file hierachy to cope with the increased demand, and got Visual Studios to link to github (More hastle than it was worth, but it decided to break when I was adding new files so it became nessisary).

So while I repaired and upgraded VS I thought about my intention for the line chart. The intention was more akain to a scatter graph, where the points have a line of best fit applied. 

This opens the project up to more interesting analysis & features, whereas the line chart only displays what it is given.

So I have created the scatter graph in order to begin this process. This took about 10 min thanks to all the work I've done with templates and the quite handy line chart code.

Next I've bumped the correlation widget upwards in the WorkListâ„¢ so that the scatter graph can work with it. At the moment the scatter graph will not be useful without it.

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
