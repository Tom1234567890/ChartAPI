// Parent object
// This is required for all ____ chart's

function ____ChartApi(p_element, p_settings, p_data) {
	// Setup Inheritence

	this.base = BaseChartApi;
	this.base(p_element, p_settings, p_data);

	// Drawing Functions

	// Put functions required to draw every ____ chart.

	// Master Functions

	// Set's out proportions of the chart & draws areas around the chart.
	this.SizeChart = function () { };

	// Set's out any pre-rendering processing of the data.
	this.SizeData = function () { };

	// Higher level function used to draw out the chart.
	// Essentially a shell to interact with all of the Drawing functions
	this.BaseDrawChart = function () {
		// Function used by each child chart.
		this.DrawChart();
	};
}

// Child object
// User-Interactable object

function ____ChartApi(p_element, p_settings, p_data) {
	// Setup Inheritence

	this.base = ____ChartApi;
	this.base(p_element, p_settings, p_data);

	// Helper function for DrawChart()
	this.DrawPoint = function (p_colorNB, p_data) { };

	// Function used to plot ____ chart's
	this.DrawChart = function () { };
}