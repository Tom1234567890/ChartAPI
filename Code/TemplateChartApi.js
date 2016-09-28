// Parent object
// This is required for all ____ chart's

function ____ChartApi(p_element, p_settings, p_data) {
	// Setup Inheritence

	this.base = BaseChartApi;
	this.base(p_element, p_settings, p_data);
	var me = this;

	// Drawing Functions

	function DrawLegend() {
		// #### Legend ####
		if (me.g_legend == undefined) return false;

		return true;
	};

	function DrawChartContainer() { };

	// Set's out proportions of the chart & draws areas around the chart.
	function SizeChart() { };

	// Set's out any pre-rendering processing of the data.
	function SizeData() { };


	// Master Functions


	// Higher level function used to draw out the chart.
	// Essentially a shell to interact with all of the Drawing functions
	this.BaseDrawChart = function () {
		SizeChart();
		SizeData();


		if (DrawLegend()) me.Alert("Legend Rendered", 0);
		DrawChartContainer(); me.Alert("Chart Container Rendered", 0);

		// Function used by each child chart.
		this.DrawChart();
	};

	/*
	// Draw out correlation on canvas.
	this.RenderCorrelation = function (p_element, p_settings) {

		var widget = new ChartApiCorrelaitonWidget(this.g_data[0], p_element, p_settings);

		me.Alert("### Render Correlation ###", 1);
		for (var i = this.g_data.length - 1; i > 0; i--) {
			DrawCorrelation(widget.GetCorrelation(this.g_data[i]), i - 1);
		};

		return widget;
	}

	// Create correlation without drawing it.
	this.CreateCorrelation = function (p_element, p_settings) {

		var widget = new ChartApiCorrelaitonWidget(this.g_data[0], p_element, p_settings);

		me.Alert("### Calculating Correlation ###", 0);

		for (var i = this.g_data.length - 1; i > 0; i--) {
			widget.GetCorrelation(this.g_data[i]);
		};

		return widget;
	};
	*/
}

// Child object
// User-Interactable object

function ____ChartApi(p_element, p_settings, p_data) {
	// Setup Inheritence

	this.base = ____ChartApi;
	this.base(p_element, p_settings, p_data);

	// Helper function for DrawChart()
	DrawPoint = function (p_colorNB, p_data) { };

	// Function used to plot ____ chart's
	this.DrawChart = function () { };
}