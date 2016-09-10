// Parent object
// This is required for all series chart's

function SeriesChartApi(p_element, p_settings, p_data) {
	// Setup Inheritence

	this.base = BaseChartApi;
	this.base(p_element, p_settings, p_data);


	// Drawing Functions


	this.DrawYAxis = function () {
		// #### YAxis ####
		// YAxis Group
		this.g_yAxis.reference = this.Group();
		// YAxis Area
		this.Rect(this.g_yAxis.reference,
			this.g_yAxis.minX,
			this.g_yAxis.minY,
			this.g_yAxis.maxX,
			this.g_yAxis.maxY,
			this.g_yAxis.background,
			"#000");
		// YAxis Alt Background
		this.Rect(this.g_yAxis.reference, this.g_yAxis.minX, this.g_yAxis.minY, this.g_yAxis.maxX / 2, this.g_yAxis.maxY, this.g_yAxis.titleBackground, "#000");
		// YAxis this.Text
		var textArea = this.TextArea(this.g_yAxis.reference,
			this.g_yAxis.font,
			this.g_yAxis.fontSize,
			true,
			this.g_yAxis.minX + (this.g_yAxis.maxX * (3 / 8)),
			this.g_yAxis.minY + (this.g_yAxis.maxY / 2));

		this.Text(textArea,
			this.g_yAxis.minX + (this.g_yAxis.maxX * (3 / 8)),
			this.g_yAxis.minY + (this.g_yAxis.maxY / 2),
			this.g_yAxis.text);
		// YAxis Spokes
		var textArea = this.TextArea(this.g_yAxis.reference,
			this.g_yAxis.font,
			this.g_yAxis.baseFontSize,
			false);

		var increment = (this.g_yAxis.max - this.g_yAxis.min)
			/ (this.g_chartArea.yAxisDividers - 1);

		for (var i = 0; i < (this.g_chartArea.yAxisDividers) ; i++) {
			var nextY = 1 - (i * increment) / (this.g_yAxis.max - this.g_yAxis.min);
			var y = (nextY * this.g_chartArea.maxY) + this.g_chartArea.minY;

			// Ensure we only get 5 characters. /,/g replaces all instances of ,
			var text = ((i * increment) + this.g_yAxis.min).toString().split('', 5).toString().replace(/,/g, '');

			this.Text(textArea,
				this.g_yAxis.minX + (this.g_yAxis.maxX * (3 / 4)),
				y + 1, // TODO: Replace 1 with somthing more sensible
				text);
		}
	}

	this.DrawXAxis = function () {
		// XAxis Reference
		this.g_xAxis.reference = this.Group();
		// XAxis Area
		this.Rect(this.g_xAxis.reference, this.g_xAxis.minX, this.g_xAxis.minY, this.g_xAxis.maxX, this.g_xAxis.maxY, this.g_xAxis.background, "#000");
		// XAxis Alt Background
		this.Rect(this.g_xAxis.reference, this.g_xAxis.minX, this.g_xAxis.minY + (this.g_xAxis.maxY / 2), this.g_xAxis.maxX, this.g_xAxis.maxY / 2, this.g_xAxis.titleBackground, "#000");
		// XAxis this.Text
		var textArea = this.TextArea(this.g_xAxis.reference, this.g_xAxis.font, this.g_xAxis.fontSize, false);
		this.Text(textArea,
			this.g_xAxis.minX + (this.g_xAxis.maxX / 2),
			this.g_xAxis.minY + (this.g_xAxis.maxY * (7 / 8)),
			this.g_xAxis.text);

		// XAxis Spokes
		var increment = this.g_chartArea.maxX / (this.g_data.value.length - 1);
		for (var i = 0; i < this.g_data.value.length; i++) {
			var x = this.g_chartArea.minX + (i * increment);

			var textArea = this.TextArea(this.g_xAxis.reference,
				this.g_xAxis.font,
				this.g_xAxis.baseFontSize,
				true,
				x + 1, // TODO: Replace 1 with somthing more sensible
				this.g_xAxis.minY + (this.g_xAxis.maxY / 4));

			this.Text(textArea,
				x + 1, // TODO: Replace 1 with half the font size
				this.g_xAxis.minY + (this.g_xAxis.maxY / 4),
				this.g_data.category[i]);
		}
	}

	this.DrawChartContainer = function () {
		// #### Chart Area ####
		// Chart Area Reference
		if (typeof this.g_chartArea.reference != Element) {
			this.g_chartArea.reference = this.Group();
		}
		// Chart Area Background
		this.Rect(this.g_chartArea.reference, this.g_chartArea.minX, this.g_chartArea.minY, this.g_chartArea.maxX, this.g_chartArea.maxY, this.g_chartArea.background, null);
		// Chart Area Dividers
		// (Both use same code as on their respective axis.)
		// XAxis Spokes
		var increment = this.g_chartArea.maxX / (this.g_data.value.length - 1);
		for (var i = 0; i < this.g_data.value.length; i++) {
			var x = this.g_chartArea.minX + (i * increment);

			var color = this.g_xAxis.spokeColor;
			if (i == 0 || i == this.g_data.value.length - 1) {
				color = "#000000";
			}

			this.Line(this.g_chartArea.reference,
				x,
				this.g_chartArea.minY,
				x,
				this.g_xAxis.minY + 1,
				color);
		}
		// YAxis Spokes
		var increment = (this.g_yAxis.max - this.g_yAxis.min) / (this.g_chartArea.yAxisDividers - 1);

		for (var i = 0; i < (this.g_chartArea.yAxisDividers) ; i++) {
			var nextY = 1 - (i * increment) / (this.g_yAxis.max - this.g_yAxis.min);
			var y = (nextY * this.g_chartArea.maxY) + this.g_chartArea.minY;

			var color = this.g_yAxis.spokeColor;
			if (i == 0 || i == this.g_chartArea.yAxisDividers - 1) {
				color = "#000000";
			}

			this.Line(this.g_chartArea.reference,
				this.g_yAxis.minX + this.g_yAxis.maxX - 1,
				y,
				this.g_chartArea.minX + this.g_chartArea.maxX,
				y,
				color);
		}

		// Chart Area Outline
		this.Rect(this.g_chartArea.reference, this.g_chartArea.minX, this.g_chartArea.minY, this.g_chartArea.maxX, this.g_chartArea.maxY, null, "#000");
	}

	// Master Functions


	// Set's out proportions of the chart & draws areas around the chart.
	this.SizeChart = function () {
		// #### XAxis ####
		this.g_xAxis.minX = 20;
		this.g_xAxis.minY = 80;
		this.g_xAxis.maxX = 60;
		this.g_xAxis.maxY = 20;
		if (this.g_legend == undefined) {
			this.g_xAxis.maxX += 20;
		}

		// #### Chart Area ####
		this.g_chartArea.minX = 23;
		this.g_chartArea.minY = 23;
		this.g_chartArea.maxX = 54;
		this.g_chartArea.maxY = 54;
		if (this.g_legend == undefined) {
			this.g_chartArea.maxX += 20;
		}

		// #### YAxis ####
		this.g_yAxis.minX = 0;
		this.g_yAxis.minY = 20;
		this.g_yAxis.maxX = 20;
		this.g_yAxis.maxY = 60;
		// #### Legend ####
		if (this.g_legend != undefined) {
			// Dimentions
			this.g_legend.minX = 80;
			this.g_legend.minY = 20;
			this.g_legend.maxX = 20;
			this.g_legend.maxY = 80;
		}
	}

	// Set's out any pre-rendering processing of the data.
	this.SizeData = function () {
		// #### Y Axis ####
		// Y Axis Min & Max

		// Value
		var max = Math.max.apply(null, this.g_data.value);
		var min = Math.min.apply(null, this.g_data.value);
		// Value2
		if (this.g_data.value2 != undefined && this.g_data.value2 != null) {
			var max2 = Math.max.apply(null, this.g_data.value2);
			var min2 = Math.min.apply(null, this.g_data.value2);

			if (max < max2) {
				max = max2;
			}
			if (min > min2) {
				min = min2;
			}
		}
		// Value3
		if (this.g_data.value3 != undefined && this.g_data.value3 != null) {
			var max2 = Math.max.apply(null, this.g_data.value3);
			var min2 = Math.min.apply(null, this.g_data.value3);

			if (max < max2) {
				max = max2;
			}
			if (min > min2) {
				min = min2;
			}
		}
		// Value4
		if (this.g_data.value4 != undefined && this.g_data.value4 != null) {
			var max2 = Math.max.apply(null, this.g_data.value4);
			var min2 = Math.min.apply(null, this.g_data.value4);

			if (max < max2) {
				max = max2;
			}
			if (min > min2) {
				min = min2;
			}
		}
		// Value5
		if (this.g_data.Value5 != undefined && this.g_data.Value5 != null) {
			var max2 = Math.max.apply(null, this.g_data.Value5);
			var min2 = Math.min.apply(null, this.g_data.Value5);

			if (max < max2) {
				max = max2;
			}
			if (min > min2) {
				min = min2;
			}
		}
		// Value6
		if (this.g_data.Value6 != undefined && this.g_data.Value6 != null) {
			var max2 = Math.max.apply(null, this.g_data.Value6);
			var min2 = Math.min.apply(null, this.g_data.Value6);

			if (max < max2) {
				max = max2;
			}
			if (min > min2) {
				min = min2;
			}
		}
		// Value7
		if (this.g_data.Value7 != undefined && this.g_data.Value7 != null) {
			var max2 = Math.max.apply(null, this.g_data.Value7);
			var min2 = Math.min.apply(null, this.g_data.Value7);

			if (max < max2) {
				max = max2;
			}
			if (min > min2) {
				min = min2;
			}
		}

		if (this.g_yAxis.max == null || this.g_yAxis.max < max) {
			this.g_yAxis.max = max;
		}
		if (this.g_yAxis.min == null || this.g_yAxis.min > min) {
			this.g_yAxis.min = min;
		}
	}

	// Higher level function used by the base object
	this.BaseDrawChart = function () {

		this.DrawYAxis();
		this.DrawXAxis();
		if (this.DrawLegend()) console.log("Legend Rendered");
		this.DrawChartContainer();
		this.DrawChart();
	}

	this.processCorrelation = function (p_function, p_colorNB) {
		if (p_function == undefined || p_function == null) {
			return false;
		}

		// Account for Axis
		var startX = 1 - ((p_function[0] - this.g_yAxis.min) / (this.g_yAxis.max - this.g_yAxis.min));
		var endX = 1 - ((p_function[1] - this.g_yAxis.min) / (this.g_yAxis.max - this.g_yAxis.min));

		// Draw line
		this.DottedLine(this.g_chartArea.reference,
			this.g_chartArea.minX,
			this.g_chartArea.minY + (this.g_chartArea.maxY * (startX)),
			this.g_chartArea.minX + this.g_chartArea.maxX,
			this.g_chartArea.minY + (this.g_chartArea.maxY * (endX)),
			this.g_chartArea.color[p_colorNB]);

	}

	// Overwrite base function to prevent error.
	this.DrawCorrelation = function (p_element, p_settings) {
		var widget = new ChartApiCorrelaitonWidget(this.g_data.category, p_element, p_settings);
		console.log("### Render Correlation ###");
		this.processCorrelation(widget.GetCorrelation(this.g_data.value7), 6);
		this.processCorrelation(widget.GetCorrelation(this.g_data.value6), 5);
		this.processCorrelation(widget.GetCorrelation(this.g_data.value5), 4);
		this.processCorrelation(widget.GetCorrelation(this.g_data.value4), 3);
		this.processCorrelation(widget.GetCorrelation(this.g_data.value3), 2);
		this.processCorrelation(widget.GetCorrelation(this.g_data.value2), 1);
		this.processCorrelation(widget.GetCorrelation(this.g_data.value), 0);

		return widget;
	}

	this.CreateCorrelation = function (p_element, p_settings) {
		var widget = new ChartApiCorrelaitonWidget(this.g_data.category, p_element, p_settings);
		console.log("### Calculating Correlation ###");
		widget.GetCorrelation(this.g_data.value7);
		widget.GetCorrelation(this.g_data.value6);
		widget.GetCorrelation(this.g_data.value5);
		widget.GetCorrelation(this.g_data.value4);
		widget.GetCorrelation(this.g_data.value3);
		widget.GetCorrelation(this.g_data.value2);
		widget.GetCorrelation(this.g_data.value);

		return widget;
	}
};

// Child object
// Object that is interacted with

function LineChartApi(p_element, p_settings, p_data) {
	this.base = SeriesChartApi;
	this.base(p_element, p_settings, p_data);

	// Helper function for DrawChart()
	this.DrawPoint = function (p_colorNB, p_data) {
		if (p_data == undefined || p_data == null) {
			return false;
		}
		// Points in Graph
		var nextY = 1 - ((p_data[0] - this.g_yAxis.min) / (this.g_yAxis.max - this.g_yAxis.min));
		var incrementX = this.g_chartArea.maxX / (p_data.length - 1);
		var pointBorder = this.g_chartArea.pointBorder == null || this.g_chartArea.pointBorder[p_colorNB] == null ? this.g_chartArea.color[p_colorNB] : this.g_chartArea.pointBorder[p_colorNB];

		for (var i = 0; i < (p_data.length - 1) ; i++) {
			var x1 = this.g_chartArea.minX + (i * incrementX);
			var x2 = this.g_chartArea.minX + ((i + 1) * incrementX);

			if (p_data[i + 1] == undefined || p_data[i + 1] == null ||
				p_data[i] == undefined || p_data[i] == null) {
				if (!(p_data[i] == undefined || p_data[i] == null)) {
					this.Circle(this.g_chartArea.reference, x1, y1, 0.75, this.g_chartArea.color[p_colorNB], pointBorder);
				}

				nextY = 1 - ((p_data[i + 1] - this.g_yAxis.min) / (this.g_yAxis.max - this.g_yAxis.min));
				continue;
			}

			var y1 = (nextY * this.g_chartArea.maxY) + this.g_chartArea.minY;
			nextY = 1 - ((p_data[i + 1] - this.g_yAxis.min) / (this.g_yAxis.max - this.g_yAxis.min));

			var y2 = (nextY * this.g_chartArea.maxY) + this.g_chartArea.minY;
			this.Line(this.g_chartArea.reference, x1, y1, x2, y2, this.g_chartArea.color[p_colorNB]);


			this.Circle(this.g_chartArea.reference, x1, y1, 0.75, this.g_chartArea.color[p_colorNB], pointBorder);
			if (i == p_data.length - 2) {
				var point = this.Circle(this.g_chartArea.reference, x2, y2, 0.75, this.g_chartArea.color[p_colorNB], pointBorder);
			}
		}

		return true;
	}

	// Function used to plot Line Chart's
	this.DrawChart = function () {
		this.DrawPoint(6, this.g_data.value7);
		this.DrawPoint(5, this.g_data.value6);
		this.DrawPoint(4, this.g_data.value5);
		this.DrawPoint(3, this.g_data.value4);
		this.DrawPoint(2, this.g_data.value3);
		this.DrawPoint(1, this.g_data.value2);
		this.DrawPoint(0, this.g_data.value);
	}
};

// Child object
// User-Interactable object

function ScatterChartApi(p_element, p_settings, p_data) {
	// Setup Inheritence

	this.base = SeriesChartApi;
	this.base(p_element, p_settings, p_data);

	// Helper function for DrawChart()
	this.DrawPoint = function (p_colorNB, p_data) {
		if (p_data == undefined || p_data == null) {
			return false
		}
		// Points in Graph
		var nextY = 1 - ((p_data[0] - this.g_yAxis.min) / (this.g_yAxis.max - this.g_yAxis.min));
		var incrementX = this.g_chartArea.maxX / (p_data.length - 1);
		var pointBorder = this.g_chartArea.pointBorder == null || this.g_chartArea.pointBorder[p_colorNB] == null ? this.g_chartArea.color[p_colorNB] : this.g_chartArea.pointBorder[p_colorNB];

		for (var i = 0; i < (p_data.length - 1) ; i++) {
			var x1 = this.g_chartArea.minX + (i * incrementX);
			var x2 = this.g_chartArea.minX + ((i + 1) * incrementX);

			if (p_data[i + 1] == undefined || p_data[i + 1] == null ||
				p_data[i] == undefined || p_data[i] == null) {
				if (!(p_data[i] == undefined || p_data[i] == null)) {
					this.Circle(this.g_chartArea.reference, x1, y1, 0.75, this.g_chartArea.color[p_colorNB], pointBorder);
				}

				nextY = 1 - ((p_data[i + 1] - this.g_yAxis.min) / (this.g_yAxis.max - this.g_yAxis.min));
				continue;
			}

			var y1 = (nextY * this.g_chartArea.maxY) + this.g_chartArea.minY;
			nextY = 1 - ((p_data[i + 1] - this.g_yAxis.min) / (this.g_yAxis.max - this.g_yAxis.min));

			var y2 = (nextY * this.g_chartArea.maxY) + this.g_chartArea.minY;


			this.Circle(this.g_chartArea.reference, x1, y1, 0.75, this.g_chartArea.color[p_colorNB], pointBorder);
			if (i == p_data.length - 2) {
				var point = this.Circle(this.g_chartArea.reference, x2, y2, 0.75, this.g_chartArea.color[p_colorNB], pointBorder);
			}
		}

		return true;
	};

	// Function used to plot Scatter chart's
	this.DrawChart = function () {
		this.DrawPoint(6, this.g_data.value7);
		this.DrawPoint(5, this.g_data.value6);
		this.DrawPoint(4, this.g_data.value5);
		this.DrawPoint(3, this.g_data.value4);
		this.DrawPoint(2, this.g_data.value3);
		this.DrawPoint(1, this.g_data.value2);
		this.DrawPoint(0, this.g_data.value);
	};
}