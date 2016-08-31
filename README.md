#The ChartAPI Vision
This project aims to provide a way for the public to prove and disprove assertions using their own facts.

This will be done by taking large amounts of data (E.G. The UK's census) and allowing users to filter down this data into what matters. Once the user has the data they are interested they need to be able to analyze the data. This means applying statistical analysis to the data in order to obtain a particular fact.
#Current Features:
- Line chart. (First single-series / multi-series chart)
  This chart allows for the exposure of trends over the course of several different data points.
  While this is not directly related to the vision, it serves as a good starting point to get working.
- ...

##Actively worked on
- Create proportion chart. (Single-series chart)

##The Wishlist
- Create Filtering Widget. (Way to split grouped data into it's components. E.G: Split "Total population by year" into "Population by year and age")
- Allow for the sharing of filtered results.
- Create Scatter Graph.
- User guide for the API :(
- Implement Variable X Axis into all charts.
- Create Correlation Widget
- Create Testing website
- Allow for Ajax calls to be made for live data.

#The Story
I personally found Brexit to be the most infuriating politics I have had ever witnessed.

Both sides of the argument used blatant misinformation and fear in order to muscle the public into a decision they may have not understood fully.

I disagree with this type of politics to the extent I am willing to fight it here. I want the truth, the whole truth and nothing but the truth.

This is a tool that will be used to prevent misinformation being provided. This is a tool that can be used to make your own mind about difficult issues and enable you to share the facts that lead to your opinions.

Hopefully this is also a tool that will allow for users to challenge their assertions. By providing statistical analysis we can challenge illogical beliefs.

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
