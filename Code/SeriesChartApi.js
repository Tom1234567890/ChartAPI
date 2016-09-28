// Parent object
// This is required for all series chart's

function SeriesChartApi(p_element, p_settings, p_data) {
	// Setup Inheritence

	this.base = BaseChartApi;
	this.base(p_element, p_settings, p_data);
	var me = this;

	var correlation = null;


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
			me.g_yAxis.borderColor);
		// YAxis Alt Background
		me.Rect(me.g_yAxis.reference,
			me.g_yAxis.minX,
			me.g_yAxis.minY,
			me.g_yAxis.maxX / 2,
			me.g_yAxis.maxY,
			me.g_yAxis.titleBackground,
			me.g_yAxis.borderColor);
		// YAxis Text
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

		for (var i = 0; i < me.g_chartArea.yAxisDividers; i++) {
			var nextY = 1 - (i * increment) / (me.g_yAxis.max - me.g_yAxis.min);
			var y = (nextY * me.g_chartArea.maxY) + me.g_chartArea.minY;

			// Ensure we only get 5 characters. /,/g replaces all instances of ,
			var text = me.Truncate((i * increment) + me.g_yAxis.min);

			me.Text(textArea,
				me.g_yAxis.minX + (me.g_yAxis.maxX * (3 / 4)),
				y + 1, // TODO: Replace 1 with somthing more sensible
				text);
		}
	};

	function DrawXAxis() {
		// XAxis Reference
		me.g_xAxis.reference = me.Group();
		// XAxis Area
		me.Rect(me.g_xAxis.reference,
			me.g_xAxis.minX,
			me.g_xAxis.minY,
			me.g_xAxis.maxX,
			me.g_xAxis.maxY,
			me.g_xAxis.background,
			me.g_xAxis.borderColor);
		// XAxis Alt Background
		me.Rect(me.g_xAxis.reference,
			me.g_xAxis.minX,
			me.g_xAxis.minY + (me.g_xAxis.maxY / 2),
			me.g_xAxis.maxX,
			me.g_xAxis.maxY / 2,
			me.g_xAxis.titleBackground,
			me.g_xAxis.borderColor);
		// XAxis Text
		var textArea = me.TextArea(me.g_xAxis.reference, me.g_xAxis.font, me.g_xAxis.fontSize, false);
		me.Text(textArea,
			me.g_xAxis.minX + (me.g_xAxis.maxX / 2),
			me.g_xAxis.minY + (me.g_xAxis.maxY * (7 / 8)),
			me.g_xAxis.text);

		// XAxis Spokes

		if (typeof (me.g_data[0][0]) == "number" ||
			(typeof (me.g_data[0][0]) == "object" && me.g_data[0][0].toString() != null)) {

			// Variable X Axis
			var isDate = (typeof (me.g_data[0][0]) == "object" && me.g_data[0][0].toString() != null);
			for (var i = 0; i < me.g_data[1].length; i++) {
				var date = me.g_data[0][i];
				var value = isDate ? date : date.valueOf();
				var text = isDate ? me.FormatDate(date, me.g_xAxis.dateFormat) : date.toString();

				var nextX = (value - me.g_xAxis.min) / (me.g_xAxis.max - me.g_xAxis.min);
				var x = (nextX * me.g_chartArea.maxX) + me.g_chartArea.minX;

				var textArea = me.TextArea(me.g_xAxis.reference,
					me.g_xAxis.font,
					me.g_xAxis.baseFontSize,
					true,
					x + 1, // TODO: Replace 1 with somthing more sensible
					me.g_xAxis.minY + (me.g_xAxis.maxY / 4));

				me.Text(textArea,
					x + 1, // TODO: Replace 1 with half the font size
					me.g_xAxis.minY + (me.g_xAxis.maxY / 4),
					text);
			}
		}
		else {

			// String X Axis
			var increment = me.g_chartArea.maxX / (me.g_data[1].length - 1);
			// Draw for e
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
	};

	function DrawChartContainer() {
		// #### Chart Area ####
		// Chart Area Reference
		if (typeof me.g_chartArea.reference != Element) {
			me.g_chartArea.reference = me.Group();
		}
		// Chart alt canvas background
		me.Rect(me.g_chartArea.reference,
			me.g_chartArea.minX - 3,
			me.g_chartArea.minY - 3,
			me.g_chartArea.maxX + 6,
			me.g_chartArea.maxY + 6,
			me.g_chartArea.canvasAltBackground);
		// Chart Area Background
		me.Rect(me.g_chartArea.reference,
			me.g_chartArea.minX,
			me.g_chartArea.minY,
			me.g_chartArea.maxX,
			me.g_chartArea.maxY,
			me.g_chartArea.background,
			null);
		// Chart Area Dividers
		// (Both use same code as on their respective axis.)
		// XAxis Spokes
		var increment = me.g_chartArea.maxX / (me.g_data[1].length - 1);

		var isVariableXAxis = typeof (me.g_data[0][0]) == "number"
			|| (typeof (me.g_data[0][0]) == "object" && me.g_data[0][0].toString() != null);
		var isDate = (typeof (me.g_data[0][0]) == "object" && me.g_data[0][0].toString() != null);

		for (var i = 0; i < me.g_data[1].length; i++) {
			var x;
			if (isVariableXAxis) {
				valueX = isDate ? me.g_data[0][i] : me.g_data[0][i].valueOf();

				var nextX = (valueX - me.g_xAxis.min) / (me.g_xAxis.max - me.g_xAxis.min);
				x = (nextX * me.g_chartArea.maxX) + me.g_chartArea.minX;
			} else {
				x = me.g_chartArea.minX + (i * increment);
			}

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
		me.Rect(me.g_chartArea.reference,
			me.g_chartArea.minX,
			me.g_chartArea.minY,
			me.g_chartArea.maxX,
			me.g_chartArea.maxY,
			null,
			"#000");
	};

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
	};

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
	};

	// Set's out any pre-rendering processing of the data.
	function SizeData() {
		// #### Y Axis ####
		// Y Axis Min & Max

		// Get the initial Min & Max
		var max = Math.max.apply(null, me.g_data[1]);
		var min = Math.min.apply(null, me.g_data[1]);

		// Find the other series max & min
		for (var i = me.g_data.length; i > 1; i--) {

			var max2 = Math.max.apply(null, me.g_data[i]);
			var min2 = Math.min.apply(null, me.g_data[i]);

			// If the max or min are more significant, use them
			if (max < max2) {
				max = max2;
			}
			if (min > min2) {
				min = min2;
			}
		}

		// If the default min & max aren't more relevant, add our derived one in.
		if (me.g_yAxis.max == null || me.g_yAxis.max < max) {
			me.g_yAxis.max = max;
		}
		if (me.g_yAxis.min == null || me.g_yAxis.min > min) {
			me.g_yAxis.min = min;
		}

		// X Axis

		if (typeof (me.g_data[0][0]) == "number") {
			// Get the initial Min & Max
			var max = Math.max.apply(null, me.g_data[0]);
			var min = Math.min.apply(null, me.g_data[0]);

			me.g_xAxis.max = max;
			me.g_xAxis.min = min;
		}
		else if (typeof (me.g_data[0][0]) == "object" && me.g_data[0][0].toString() != null) {

			// We are working with dates
			var seconds = [];
			for (var i = 0; i < me.g_data[0].length; i++) {
				seconds[i] = me.g_data[0][i].valueOf();
			}

			var max = Math.max.apply(null, seconds);
			var min = Math.min.apply(null, seconds);

			me.g_xAxis.max = max;
			me.g_xAxis.min = min;

		}
		else {
			// Standard string X Axis
			me.g_xAxis.max = me.g_data[0].length;
			me.g_xAxis.min = 0;
		}
	};


	// Master Functions


	// Higher level function used by the base object
	this.BaseDrawChart = function () {
		SizeChart();
		SizeData();

		DrawYAxis(); me.Alert("YAxis Rendered", 0);
		DrawXAxis(); me.Alert("XAxis Rendered", 0);
		DrawChartContainer(); me.Alert("Chart Container Rendered", 0);

		// Pass on to lower level function
		this.DrawChart();
	};

	// Delete the chart area and redraw it
	this.RefreshChart = function () {
		this.g_chartArea.reference.remove(); me.Alert("Chart Area Removed", 0);

		DrawChartContainer(); me.Alert("Chart Container Rendered", 0);

		// Pass on to lower level function
		this.DrawChart();
	};

	// Draw out correlation on canvas.
	this.RenderCorrelation = function (p_element, p_settings) {

		var widget = new ChartApiCorrelaitonWidget(this.g_data[0], p_element, p_settings, this);

		me.Alert("### Render Correlation ###", 1);
		for (var i = this.g_data.length - 1; i > 0; i--) {
			DrawCorrelation(widget.GetCorrelation(this.g_data[i]), i - 1);
		}

		correlation = widget;

		return widget;
	};

	this.RefreshCorrelation = function (p_ignore) {
		if (correlation == null) return;

		for (var i = this.g_data.length - 1; i > 0; i--) {
			if (p_ignore != -1 && i != p_ignore) continue;

			DrawCorrelation(correlation.g_results[correlation.g_results.length - i], i - 1);
		};

		correlation.Update(p_ignore);
	};

	// Create correlation without drawing it.
	this.CreateCorrelation = function (p_element, p_settings) {

		var widget = new ChartApiCorrelaitonWidget(this.g_data[0], p_element, p_settings, this);

		me.Alert("### Calculating Correlation ###", 1);

		for (var i = this.g_data.length - 1; i > 0; i--) {
			widget.GetCorrelation(this.g_data[i]);
		}

		return widget;
	};
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
		var isDate = (typeof (me.g_data[0][0]) == "object" && me.g_data[0][0].toString() != null);
		var isVariableXAxis = typeof (me.g_data[0][0]) == "number"
			|| (typeof (me.g_data[0][0]) == "object" && me.g_data[0][0].toString() != null);

		var index = i;
		var index2 = i + 1;
		var sortedArray;
		if (isVariableXAxis) {
			sortedArray = me.g_data[0].sort(function (a, b) { return a - b });
			index = me.g_data[0].indexOf(sortedArray[0]);
			index2 = me.g_data[0].indexOf(sortedArray[1]);
		}

		var nextY = 1 - ((p_data[index] - me.g_yAxis.min) / (me.g_yAxis.max - me.g_yAxis.min));

		var incrementX = me.g_chartArea.maxX / (p_data.length - 1);
		var valueX = isDate ? me.g_data[0][index] : me.g_data[0][index].valueOf();

		var pointBorder = me.g_chartArea.pointBorder == null
			|| me.g_chartArea.pointBorder[p_colorNB] == null
			? me.g_chartArea.color[p_colorNB] : me.g_chartArea.pointBorder[p_colorNB];


		for (var i = 0; i < (p_data.length - 1) ; i++) {
			// Get X
			var x1;
			var x2;

			index = i;
			index2 = i + 1;

			if (!isVariableXAxis) {
				x1 = me.g_chartArea.minX + (index * incrementX);
				x2 = me.g_chartArea.minX + (index2 * incrementX);
			} else {
				index = me.g_data[0].indexOf(sortedArray[i]);
				index2 = me.g_data[0].indexOf(sortedArray[i + 1]);

				var nextX = (valueX - me.g_xAxis.min) / (me.g_xAxis.max - me.g_xAxis.min);
				var x1 = (nextX * me.g_chartArea.maxX) + me.g_chartArea.minX;

				valueX = isDate ? me.g_data[0][index2] : me.g_data[0][index2].valueOf();

				var nextX = (valueX - me.g_xAxis.min) / (me.g_xAxis.max - me.g_xAxis.min);
				var x2 = (nextX * me.g_chartArea.maxX) + me.g_chartArea.minX;
			}

			if (p_data[index2] == undefined || p_data[index2] == null ||
				p_data[index] == undefined || p_data[index] == null) {
				if (!(p_data[index] == undefined || p_data[index] == null)) {
					me.Circle(me.g_chartArea.reference,
						x1,
						y1,
						0.75,
						me.g_chartArea.color[p_colorNB],
						pointBorder);
				}

				nextY = 1 - ((p_data[index2] - me.g_yAxis.min) /
					(me.g_yAxis.max - me.g_yAxis.min));
				continue;
			}

			var y1 = (nextY * me.g_chartArea.maxY) + me.g_chartArea.minY;
			nextY = 1 - ((p_data[index2] - me.g_yAxis.min) / (me.g_yAxis.max - me.g_yAxis.min));

			var y2 = (nextY * me.g_chartArea.maxY) + me.g_chartArea.minY;
			me.Line(me.g_chartArea.reference, x1, y1, x2, y2, me.g_chartArea.color[p_colorNB]);

			var category = isDate ? me.FormatDate(me.g_data[0][index], me.g_xAxis.dateFormat) : me.g_data[0][index];

			var Circle = me.Circle(me.g_chartArea.reference, x1, y1, 0.75, me.g_chartArea.color[p_colorNB], pointBorder);

			me.Event(Circle,
				"mouseover",
				me.HoverText,
				p_data[index] + ', ' + category);

			me.Event(Circle,
				"mouseout",
				me.EndHoverText);

			if (i == p_data.length - 2) {

				var category = isDate ? me.FormatDate(me.g_data[0][index2], me.g_xAxis.dateFormat) : me.g_data[0][index2];

				var point = me.Circle(me.g_chartArea.reference, x2, y2, 0.75, me.g_chartArea.color[p_colorNB], pointBorder);

				me.Event(point,
				"mouseover",
				me.HoverText,
				p_data[index2] + ', ' + category);

				me.Event(point,
					"mouseout",
					me.EndHoverText);
			}
		}

		return true;
	};


	// #### User Interfaces ####


	this.DrawChart = function () {
		for (var i = this.g_data.length - 1; i > 0; i--) {
			if (me.drawSeries != -1 && i != me.drawSeries) continue;

			DrawPoint(i - 1, this.g_data[i]);
		}
	};
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
		var isDate = (typeof (me.g_data[0][0]) == "object" && me.g_data[0][0].toString() != null);

		var isVariableXAxis = typeof (me.g_data[0][0]) == "number"
			|| (typeof (me.g_data[0][0]) == "object" && me.g_data[0][0].toString() != null);

		var nextY = 1 - ((p_data[0] - me.g_yAxis.min) / (me.g_yAxis.max - me.g_yAxis.min));

		var incrementX = me.g_chartArea.maxX / (p_data.length - 1);
		var valueX = isDate ? me.g_data[0][0] : me.g_data[0][0].valueOf();

		var pointBorder = me.g_chartArea.pointBorder == null || me.g_chartArea.pointBorder[p_colorNB] == null ? me.g_chartArea.color[p_colorNB] : me.g_chartArea.pointBorder[p_colorNB];

		for (var i = 0; i < (p_data.length - 1) ; i++) {
			// Get X
			var x1;
			var x2;

			if (!isVariableXAxis) {
				x1 = me.g_chartArea.minX + (i * incrementX);
				x2 = me.g_chartArea.minX + ((i + 1) * incrementX);
			} else {
				var nextX = (valueX - me.g_xAxis.min) / (me.g_xAxis.max - me.g_xAxis.min);
				var x1 = (nextX * me.g_chartArea.maxX) + me.g_chartArea.minX;

				valueX = isDate ? me.g_data[0][i + 1] : me.g_data[0][i + 1].valueOf();

				var nextX = (valueX - me.g_xAxis.min) / (me.g_xAxis.max - me.g_xAxis.min);
				var x2 = (nextX * me.g_chartArea.maxX) + me.g_chartArea.minX;
			}

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

			var category = isDate ? me.FormatDate(me.g_data[0][i], me.g_xAxis.dateFormat) : me.g_data[0][i];

			var Circle = me.Circle(me.g_chartArea.reference, x1, y1, 0.75, me.g_chartArea.color[p_colorNB], pointBorder);
			me.Event(Circle,
				"mouseover",
				me.HoverText,
				p_data[i] + ', ' + category);

			me.Event(Circle,
				"mouseout",
				me.EndHoverText);

			if (i == p_data.length - 2) {
				var point = me.Circle(me.g_chartArea.reference, x2, y2, 0.75, me.g_chartArea.color[p_colorNB], pointBorder);

				var category = isDate ? me.FormatDate(me.g_data[0][i + 1], me.g_xAxis.dateFormat) : me.g_data[0][i + 1];

				me.Event(point,
					"mouseover",
					me.HoverText,
					p_data[i + 1] + ', ' + category);

				me.Event(point,
					"mouseout",
					me.EndHoverText);
			}
		}

		return true;
	};


	// #### User Interfaces ####


	this.DrawChart = function () {
		for (var i = this.g_data.length - 1; i > 0; i--) {
			if (me.drawSeries != -1 && i != me.drawSeries) continue;

			DrawPoint(i - 1, this.g_data[i]);
		}
	};
}