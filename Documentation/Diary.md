###07-Oct-2016

Next Sprint.

The first feature to go into the new release will be component removal. This is a way to get rid of the part of the chart that are not needed (E.G. The title, the X Axis and Y axis).

Secondly we introduce filtering. This is likely part of a widget, unless I figure out a way to do scrolling in SVG images. This will allow users to group the data up into a filter, for instance grouping T-shirts and shoes under clothing. This can also mean grouping up the different series.

As opposed to the correlation widget, which is only implemented in Series charts, this will be global across all charts.

The dev will be able to assign categories to the different series, and the user will be able to select these categories and filter down through them.

Finally there will be a way for the post information to be read and written out by the chart. This will allow the user to quickly and easily share charts to other people.

While this is only two features, this will change the inner workings of the charts and modify how future charts will interact with the base API. I think this will constitute as a full sprint.

###04-Oct-2016

Release time! Sweet!

Supported browsers are now Edge, Chrome & Firefox on the latest versions. I have no interest in slowing down to accommodate other browsers.

Alright so bug hunting has been completed since the last update. I had to make some surprising changes to get this to work.

Vertical text only worked on Firefox.

This is a strange one. The problem I was experiencing was due to the fact I was drawing the SVG incorrectly. Instead of setting everything to a percent it was better to set the viewbox to 100 by 100, omit the % and allow the graphic to be sized by the browser. Unfortunately this can result in stretching, however this has many more benefits.

Incidentally the process of changing text sizes has become vastly simpler as a result, and I've cut out a function that handled the sizing of text.

Somewhere in rendering the data is modified to be numeral rather than date based. This results in numeral refreshes.

..I'm not proud of this.
There was a function that was added in order to modify the input data. This would turn the arrays into date objects that would then be used throughout the object. Unfortunately this resulted in the core data being overwritten.

Taking this out caused a host of problems. I firstly resolved this by creating the date objects as required, however the code for writing out the charts got complicated very quickly. 

Finally I resolved this by moving all date calculation into a new function GetFilteredData(). This handles turning the arrays into date objects and orders the data is the axis is variable. This is also the more future-proof option, as I intend to start putting in data filters here eventually.
Another handy feature is that it can total all the series up, ready for the comparison chart.

Inconsistent X Axis can result in the first and last spokes not being black.

Easy fix to change what the criteria of changing colour was.

Comparison chart and correlation chart could not take dates.

The comparison chart was fixed while playing with GetFilteredData() and the correlation chart now creates the date objects manually as needed.

Hover-text is not well done on the comparison chart

Essentially the chart would show the hover-text in the centre of the panels. This means that sometimes the mouse would go over it, causing it to flicker between states, and as it was stuck in the same place it was quite ugly.

Hover-text is no longer SVG Drawn, it is now an  divider appended to the body of the document. There is a new event listener for mouse movements that moves the divider to the mouse position.
This divider will only appear when the mouse is over something, so most of the time this will not take up any processing.
This simplifies hover-text usage quite cleanly for the future.

Finally some very minor changes:

Title object is now in the widget API. 
Validation has been added to the Widget's line function. I'll be adding more as they become useful.
I have found issues that I do not think merit a fix right now. This includes problems that occur when the user has a silly input, problems that occur that a user can easily account for and problems on IE 11.

###28-Sep-16

Wow, it's been a while.

Development has stalled while I've been busy with interviews and finishing my course (Four pages of explaining things I know.. it's not a fun part) so other obligations have been taking my attention away.

Wrapping up this sprint has taken up a lot of time, and I'm really proud of what I have achieved. I've solved a lot of the issues that where holding me back technically, and I've done so in a way that allows for future growth.

I've also wrapped up development on the proportion chart in order to bring it in line with the original vision. It's almost complete, only lacking in one or two ways at this point. The correlation chart is however completely finished and I don't think I'll be making any more changes outside of the correlation formula itself.

But I digress, here is the mission statement I gave myself:

The fabulous testing automation

We now have a new file called Testing.html. I introduced this last commit, where it would generate a random amount of information and render it with a settings object that only contains the barest minimum.

This has now been extended to all charts we currently have and the correlation widget. There is also an option to randomize the chart sizes, which hasn't resulted in anything problematic yet but I can imagine it may have some effect on text sizing in the future.

I didn't create this first as I expected, however I have run through a full suite of testing with it as of writing this.

Speaking of, I finally resolved my issue with Edge & IE 11. They cached some broken version of my page and refuse to give it up, as evidenced by the testing page working on both browsers. I still don't know why deleting the cache won't fix my original pages, likely something to do with security? Either way the pages work if I recreate the page using a different file.

So on my local machine I have a duplicated file called FuckMicrosoft.html while that issue is ongoing.

- The grand data refactoring.

Data is now held in a 3D array. This was relatively painless, a lot of the activity was renaming different ways of accessing this data.

The variable X Axis is now in full effect and is in fact in the new testing page. The X Axis now takes either a string, a number or a array of three numbers that will be parsed into a date.

This uses the date object, which is a default JavaScript object. This has a value which is used to plot it along the variable axis, and uses a base function to parse the date into a string. The date format can be set in the settings incidentally.

- The harrowing object encapsulation.

I finished this first, the private functions now reference a variable called me. Me == this. So while this doesn't cut down on the number of global variables to a significant degree, it does at least make it a little shorter.

- The glorious base functionality expansion.

Truncation

Truncation is now handled by a base function on the lowest level object. This uses the system I devised before where it cuts down to a set number of characters.

Text Overlap detection.

We now create a textstring, where we input every text area and it deletes any overlap. This doesn't work with vertical text for whatever reason, however vertical text is due for a re-haul so I won't loose any sleep about it. 

Chart Logging

There is now a base function called Alert which handles any and all notifications to the user.

I've done some fun things with this, we now time how long it takes to render the chart and also get to use indentation in the chart log. Finally to reduce the spam we have a global debug flag. If the flag is inactive almost all chart messages are ignored.

- The beautiful user interaction addition.

Alright, this is where the bulk of the development has gone.

Last time I discussed using a specialised event rectangle function. I've since found a better solution, we use a generic event function that can be applied to any kind of element.

This means applying event listeners to the elements that will call a function from back inside the chart API. We can also pass information by applying a nonsense attribute to the element that can be read in later.

Using this framework I was able to complete the legend intractability that I intended. When you click a series in the single value charts it will switch to just that series. When you click the header it will show all of them again. This also counts for correlation.

The proportion chart will show the total of each series, and then clicking the legend or the relevant series will break down the series from the total to the categories.

Hovering over a value in either chart will bring up hovertext. This is really helpful for pinpointing exact values, however the placement isn't as accurate as I'd like on the proportion chart.

Smaller improvements:

Almost all elements now have a customisable border. I have opted for a transparent one for the demo gallery.

The legend has been moved back into the base chart API, where it will finally be staying. There was a surprising amount of indecision behind this.

Alright, that wraps up my first sprint. There is a host of bug's I'll be working on before I'll consider this finished but all features have been added.

Finally some somewhat arbitrary news. I'll be versioning these once I can figure out how to. Once the bugs have been fixed and a couple new charts are added this'll be version one. Yay!

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
