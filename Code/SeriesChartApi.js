// Parent object
// This is required for all series chart's

function SeriesChartApi(p_element, p_settings, p_data) {
	// Setup Inheritence

	this.base = BaseChartApi;
	this.base(p_element, p_settings, p_data);
	var me = this;


	// Functions


	function DrawYAxis() {
		// #### YAxis ####
		// YAxis Group
		me.g_yAxis.reference = me.Group();
		// YAxis Area
		me.Rect(me.g_yAxis.reference,
			me.g_yAxis.minX,
			me.g_yAxis.minY,
			me.g_yAxis.maxX,
			me.g_yAxis.maxY,
			me.g_yAxis.background,
			"#000");
		// YAxis Alt Background
		me.Rect(me.g_yAxis.reference, me.g_yAxis.minX, me.g_yAxis.minY, me.g_yAxis.maxX / 2, me.g_yAxis.maxY, me.g_yAxis.titleBackground, "#000");
		// YAxis me.Text
		var textArea = me.TextArea(me.g_yAxis.reference,
			me.g_yAxis.font,
			me.g_yAxis.fontSize,
			true,
			me.g_yAxis.minX + (me.g_yAxis.maxX * (3 / 8)),
			me.g_yAxis.minY + (me.g_yAxis.maxY / 2));

		me.Text(textArea,
			me.g_yAxis.minX + (me.g_yAxis.maxX * (3 / 8)),
			me.g_yAxis.minY + (me.g_yAxis.maxY / 2),
			me.g_yAxis.text);
		// YAxis Spokes
		var textArea = me.TextArea(me.g_yAxis.reference,
			me.g_yAxis.font,
			me.g_yAxis.baseFontSize,
			false);

		var increment = (me.g_yAxis.max - me.g_yAxis.min)
			/ (me.g_chartArea.yAxisDividers - 1);

		for (var i = 0; i < (me.g_chartArea.yAxisDividers) ; i++) {
			var nextY = 1 - (i * increment) / (me.g_yAxis.max - me.g_yAxis.min);
			var y = (nextY * me.g_chartArea.maxY) + me.g_chartArea.minY;

			// Ensure we only get 5 characters. /,/g replaces all instances of ,
			var text = ((i * increment) + me.g_yAxis.min).toString().split('', 5).toString().replace(/,/g, '');

			me.Text(textArea,
				me.g_yAxis.minX + (me.g_yAxis.maxX * (3 / 4)),
				y + 1, // TODO: Replace 1 with somthing more sensible
				text);
		}
	}

	function DrawXAxis() {
		// XAxis Reference
		me.g_xAxis.reference = me.Group();
		// XAxis Area
		me.Rect(me.g_xAxis.reference, me.g_xAxis.minX, me.g_xAxis.minY, me.g_xAxis.maxX, me.g_xAxis.maxY, me.g_xAxis.background, "#000");
		// XAxis Alt Background
		me.Rect(me.g_xAxis.reference, me.g_xAxis.minX, me.g_xAxis.minY + (me.g_xAxis.maxY / 2), me.g_xAxis.maxX, me.g_xAxis.maxY / 2, me.g_xAxis.titleBackground, "#000");
		// XAxis me.Text
		var textArea = me.TextArea(me.g_xAxis.reference, me.g_xAxis.font, me.g_xAxis.fontSize, false);
		me.Text(textArea,
			me.g_xAxis.minX + (me.g_xAxis.maxX / 2),
			me.g_xAxis.minY + (me.g_xAxis.maxY * (7 / 8)),
			me.g_xAxis.text);

		// XAxis Spokes
		var increment = me.g_chartArea.maxX / (me.g_data[1].length - 1);
		for (var i = 0; i < me.g_data[1].length; i++) {
			var x = me.g_chartArea.minX + (i * increment);

			var textArea = me.TextArea(me.g_xAxis.reference,
				me.g_xAxis.font,
				me.g_xAxis.baseFontSize,
				true,
				x + 1, // TODO: Replace 1 with somthing more sensible
				me.g_xAxis.minY + (me.g_xAxis.maxY / 4));

			me.Text(textArea,
				x + 1, // TODO: Replace 1 with half the font size
				me.g_xAxis.minY + (me.g_xAxis.maxY / 4),
				me.g_data[0][i]);
		}
	}

	function DrawChartContainer() {
		// #### Chart Area ####
		// Chart Area Reference
		if (typeof me.g_chartArea.reference != Element) {
			me.g_chartArea.reference = me.Group();
		}
		// Chart Area Background
		me.Rect(me.g_chartArea.reference, me.g_chartArea.minX, me.g_chartArea.minY, me.g_chartArea.maxX, me.g_chartArea.maxY, me.g_chartArea.background, null);
		// Chart Area Dividers
		// (Both use same code as on their respective axis.)
		// XAxis Spokes
		var increment = me.g_chartArea.maxX / (me.g_data[1].length - 1);
		for (var i = 0; i < me.g_data[1].length; i++) {
			var x = me.g_chartArea.minX + (i * increment);

			var color = me.g_xAxis.spokeColor;
			if (i == 0 || i == me.g_data[1].length - 1) {
				color = "#000000";
			}

			me.Line(me.g_chartArea.reference,
				x,
				me.g_chartArea.minY,
				x,
				me.g_xAxis.minY + 1,
				color);
		}
		// YAxis Spokes
		var increment = (me.g_yAxis.max - me.g_yAxis.min) / (me.g_chartArea.yAxisDividers - 1);

		for (var i = 0; i < (me.g_chartArea.yAxisDividers) ; i++) {
			var nextY = 1 - (i * increment) / (me.g_yAxis.max - me.g_yAxis.min);
			var y = (nextY * me.g_chartArea.maxY) + me.g_chartArea.minY;

			var color = me.g_yAxis.spokeColor;
			if (i == 0 || i == me.g_chartArea.yAxisDividers - 1) {
				color = "#000000";
			}

			me.Line(me.g_chartArea.reference,
				me.g_yAxis.minX + me.g_yAxis.maxX - 1,
				y,
				me.g_chartArea.minX + me.g_chartArea.maxX,
				y,
				color);
		}

		// Chart Area Outline
		me.Rect(me.g_chartArea.reference, me.g_chartArea.minX, me.g_chartArea.minY, me.g_chartArea.maxX, me.g_chartArea.maxY, null, "#000");
	}

	function DrawLegend() {
		// #### Legend ####
		if (me.g_legend == undefined) return false;
		// Legend Reference
		me.g_legend.reference = me.Group();
		// Legend Area
		me.Rect(me.g_legend.reference,
			me.g_legend.minX,
			me.g_legend.minY,
			me.g_legend.maxX,
			me.g_legend.maxY,
			me.g_legend.background,
			"#000");
		// Legend Alt Background
		me.Rect(me.g_legend.reference,
			me.g_legend.minX,
			me.g_legend.minY,
			me.g_legend.maxX,
			me.g_legend.maxY / 8,
			me.g_legend.altBackground,
			"#000");
		// Legend me.Text
		var textArea = me.TextArea(me.g_legend.reference, me.g_legend.font, me.g_legend.fontSize, false);
		me.Text(textArea,
			me.g_legend.minX + (me.g_legend.maxX / 2),
			me.g_legend.minY + (me.g_legend.maxY / 16),
			me.g_legend.text);
		// Legend Categories
		var textArea = me.TextArea(me.g_legend.reference, me.g_legend.font, me.g_legend.baseFontSize, false);
		var i = 0;

		while (i < 7 && me.g_legend.names[i] != undefined && me.g_legend.names[i] != null) {
			var text = me.g_legend.names[i].split('\n');
			for (var i2 = 0; i2 < text.length; i2++) {
				me.Text(textArea,
				me.g_legend.minX + (me.g_legend.maxX / 2),
				me.g_legend.minY + ((i + 1.6) * (me.g_legend.maxY / 8)) + (i2 * 3),
				text[i2]);
			}

			var pointBorder = me.g_chartArea.pointBorder == null || me.g_chartArea.pointBorder[i] == null ? me.g_chartArea.color[i] : me.g_chartArea.pointBorder[i];

			me.Circle(me.g_legend.reference,
				me.g_legend.minX + (me.g_legend.maxX / 2),
				me.g_legend.minY + ((i + 1.2) * (me.g_legend.maxY / 8)),
				0.75,
				me.g_chartArea.color[i],
				pointBorder);

			me.Rect(me.g_legend.reference,
				me.g_legend.minX,
				me.g_legend.minY + ((i + 1) * (me.g_legend.maxY / 8)),
				me.g_legend.maxX,
				me.g_legend.maxY / 8,
				null,
				'#000000');

			i++;
		}
		return true
	}

	function DrawCorrelation(p_correlation, p_colorNB) {
		if (p_correlation == undefined || p_correlation == null) {
			return false;
		}

		// Account for Axis
		var startX = 1 - ((p_correlation[0] - me.g_yAxis.min) / (me.g_yAxis.max - me.g_yAxis.min));
		var endX = 1 - ((p_correlation[1] - me.g_yAxis.min) / (me.g_yAxis.max - me.g_yAxis.min));

		// Draw line
		me.DottedLine(me.g_chartArea.reference,
			me.g_chartArea.minX,
			me.g_chartArea.minY + (me.g_chartArea.maxY * (startX)),
			me.g_chartArea.minX + me.g_chartArea.maxX,
			me.g_chartArea.minY + (me.g_chartArea.maxY * (endX)),
			me.g_chartArea.color[p_colorNB]);
	}

	// Set's out proportions of the chart & draws areas around the chart.
	function SizeChart() {
		// #### XAxis ####
		me.g_xAxis.minX = 20;
		me.g_xAxis.minY = 80;
		me.g_xAxis.maxX = 60;
		me.g_xAxis.maxY = 20;
		if (me.g_legend == undefined) {
			me.g_xAxis.maxX += 20;
		}

		// #### Chart Area ####
		me.g_chartArea.minX = 23;
		me.g_chartArea.minY = 23;
		me.g_chartArea.maxX = 54;
		me.g_chartArea.maxY = 54;
		if (me.g_legend == undefined) {
			me.g_chartArea.maxX += 20;
		}

		// #### YAxis ####
		me.g_yAxis.minX = 0;
		me.g_yAxis.minY = 20;
		me.g_yAxis.maxX = 20;
		me.g_yAxis.maxY = 60;
		// #### Legend ####
		if (me.g_legend != undefined) {
			// Dimentions
			me.g_legend.minX = 80;
			me.g_legend.minY = 20;
			me.g_legend.maxX = 20;
			me.g_legend.maxY = 80;
		}
	}

	// Set's out any pre-rendering processing of the data.
	function SizeData() {
		// #### Y Axis ####
		// Y Axis Min & Max

		// Value
		var max = Math.max.apply(null, me.g_data[1]);
		var min = Math.min.apply(null, me.g_data[1]);
		// Value2
		if (me.g_data[2] != undefined && me.g_data[2] != null) {
			var max2 = Math.max.apply(null, me.g_data[2]);
			var min2 = Math.min.apply(null, me.g_data[2]);

			if (max < max2) {
				max = max2;
			}
			if (min > min2) {
				min = min2;
			}
		}
		// Value3
		if (me.g_data[3] != undefined && me.g_data[3] != null) {
			var max2 = Math.max.apply(null, me.g_data[3]);
			var min2 = Math.min.apply(null, me.g_data[3]);

			if (max < max2) {
				max = max2;
			}
			if (min > min2) {
				min = min2;
			}
		}
		// Value4
		if (me.g_data.value4 != undefined && me.g_data.value4 != null) {
			var max2 = Math.max.apply(null, me.g_data.value4);
			var min2 = Math.min.apply(null, me.g_data.value4);

			if (max < max2) {
				max = max2;
			}
			if (min > min2) {
				min = min2;
			}
		}
		// Value5
		if (me.g_data.Value5 != undefined && me.g_data.Value5 != null) {
			var max2 = Math.max.apply(null, me.g_data.Value5);
			var min2 = Math.min.apply(null, me.g_data.Value5);

			if (max < max2) {
				max = max2;
			}
			if (min > min2) {
				min = min2;
			}
		}
		// Value6
		if (me.g_data.Value6 != undefined && me.g_data.Value6 != null) {
			var max2 = Math.max.apply(null, me.g_data.Value6);
			var min2 = Math.min.apply(null, me.g_data.Value6);

			if (max < max2) {
				max = max2;
			}
			if (min > min2) {
				min = min2;
			}
		}
		// Value7
		if (me.g_data.Value7 != undefined && me.g_data.Value7 != null) {
			var max2 = Math.max.apply(null, me.g_data.Value7);
			var min2 = Math.min.apply(null, me.g_data.Value7);

			if (max < max2) {
				max = max2;
			}
			if (min > min2) {
				min = min2;
			}
		}

		if (me.g_yAxis.max == null || me.g_yAxis.max < max) {
			me.g_yAxis.max = max;
		}
		if (me.g_yAxis.min == null || me.g_yAxis.min > min) {
			me.g_yAxis.min = min;
		}
	}


	// Master Functions


	// Higher level function used by the base object
	this.BaseDrawChart = function () {
		SizeChart();
		SizeData();

		DrawYAxis(); console.log("YAxis Rendered");
		DrawXAxis(); console.log("XAxis Rendered");
		if (DrawLegend()) console.log("Legend Rendered");
		DrawChartContainer(); console.log("Chart Container Rendered");

		// Pass on to lower level function
		this.DrawChart();
	}

	// Draw out correlation on canvas.
	this.RenderCorrelation = function (p_element, p_settings) {

		var widget = new ChartApiCorrelaitonWidget(this.g_data[0], p_element, p_settings);

		console.log("### Render Correlation ###");
		for (var i = this.g_data.length - 1; i > 0; i--) {
			DrawCorrelation(widget.GetCorrelation(this.g_data[i]), i - 1);
		}

		return widget;
	}

	// Create correlation without drawing it.
	this.CreateCorrelation = function (p_element, p_settings) {

		var widget = new ChartApiCorrelaitonWidget(this.g_data[0], p_element, p_settings);

		console.log("### Calculating Correlation ###");

		for (var i = this.g_data.length - 1; i > 0; i--) {
			widget.GetCorrelation(this.g_data[i]);
		}

		return widget;
	}
};

// Child object
// Object that is interacted with

function LineChartApi(p_element, p_settings, p_data) {
	this.base = SeriesChartApi;
	this.base(p_element, p_settings, p_data);
	var me = this;

	// Helper function for DrawChart()
	function DrawPoint(p_colorNB, p_data) {
		if (p_data == undefined || p_data == null) {
			return false;
		}
		// Points in Graph
		var nextY = 1 - ((p_data[0] - me.g_yAxis.min) / (me.g_yAxis.max - me.g_yAxis.min));
		var incrementX = me.g_chartArea.maxX / (p_data.length - 1);
		var pointBorder = me.g_chartArea.pointBorder == null || me.g_chartArea.pointBorder[p_colorNB] == null ? me.g_chartArea.color[p_colorNB] : me.g_chartArea.pointBorder[p_colorNB];

		for (var i = 0; i < (p_data.length - 1) ; i++) {
			var x1 = me.g_chartArea.minX + (i * incrementX);
			var x2 = me.g_chartArea.minX + ((i + 1) * incrementX);

			if (p_data[i + 1] == undefined || p_data[i + 1] == null ||
				p_data[i] == undefined || p_data[i] == null) {
				if (!(p_data[i] == undefined || p_data[i] == null)) {
					me.Circle(me.g_chartArea.reference, x1, y1, 0.75, me.g_chartArea.color[p_colorNB], pointBorder);
				}

				nextY = 1 - ((p_data[i + 1] - me.g_yAxis.min) / (me.g_yAxis.max - me.g_yAxis.min));
				continue;
			}

			var y1 = (nextY * me.g_chartArea.maxY) + me.g_chartArea.minY;
			nextY = 1 - ((p_data[i + 1] - me.g_yAxis.min) / (me.g_yAxis.max - me.g_yAxis.min));

			var y2 = (nextY * me.g_chartArea.maxY) + me.g_chartArea.minY;
			me.Line(me.g_chartArea.reference, x1, y1, x2, y2, me.g_chartArea.color[p_colorNB]);


			me.Circle(me.g_chartArea.reference, x1, y1, 0.75, me.g_chartArea.color[p_colorNB], pointBorder);
			if (i == p_data.length - 2) {
				var point = me.Circle(me.g_chartArea.reference, x2, y2, 0.75, me.g_chartArea.color[p_colorNB], pointBorder);
			}
		}

		return true;
	}

	// Function used to plot Line Chart's
	this.DrawChart = function () {
		for (var i = this.g_data.length - 1; i > 0; i--) {
			DrawPoint(i - 1, this.g_data[i]);
		}
	}
};

// Child object
// User-Interactable object

function ScatterChartApi(p_element, p_settings, p_data) {
	// Setup Inheritence

	this.base = SeriesChartApi;
	this.base(p_element, p_settings, p_data);
	var me = this;

	// Helper function for DrawChart()
	function DrawPoint(p_colorNB, p_data) {
		if (p_data == undefined || p_data == null) {
			return false
		}
		// Points in Graph
		var nextY = 1 - ((p_data[0] - me.g_yAxis.min) / (me.g_yAxis.max - me.g_yAxis.min));
		var incrementX = me.g_chartArea.maxX / (p_data.length - 1);
		var pointBorder = me.g_chartArea.pointBorder == null || me.g_chartArea.pointBorder[p_colorNB] == null ? me.g_chartArea.color[p_colorNB] : me.g_chartArea.pointBorder[p_colorNB];

		for (var i = 0; i < (p_data.length - 1) ; i++) {
			var x1 = me.g_chartArea.minX + (i * incrementX);
			var x2 = me.g_chartArea.minX + ((i + 1) * incrementX);

			if (p_data[i + 1] == undefined || p_data[i + 1] == null ||
				p_data[i] == undefined || p_data[i] == null) {
				if (!(p_data[i] == undefined || p_data[i] == null)) {
					me.Circle(me.g_chartArea.reference, x1, y1, 0.75, me.g_chartArea.color[p_colorNB], pointBorder);
				}

				nextY = 1 - ((p_data[i + 1] - me.g_yAxis.min) / (me.g_yAxis.max - me.g_yAxis.min));
				continue;
			}

			var y1 = (nextY * me.g_chartArea.maxY) + me.g_chartArea.minY;
			nextY = 1 - ((p_data[i + 1] - me.g_yAxis.min) / (me.g_yAxis.max - me.g_yAxis.min));

			var y2 = (nextY * me.g_chartArea.maxY) + me.g_chartArea.minY;


			me.Circle(me.g_chartArea.reference, x1, y1, 0.75, me.g_chartArea.color[p_colorNB], pointBorder);
			if (i == p_data.length - 2) {
				var point = me.Circle(me.g_chartArea.reference, x2, y2, 0.75, me.g_chartArea.color[p_colorNB], pointBorder);
			}
		}

		return true;
	};

	// Function used to plot Scatter chart's
	this.DrawChart = function () {
		for (var i = this.g_data.length - 1; i > 0; i--) {
			DrawPoint(i - 1, this.g_data[i]);
		}
	};
}