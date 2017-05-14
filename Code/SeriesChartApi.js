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
		if (me.g_yAxis == null) return false;
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

		var increment = 1 / (me.g_chartArea.yAxisDividers - 1);

		for (var i = 0; i < me.g_chartArea.yAxisDividers; i++) {
			var nextY = 1 - (i * increment);

			if (nextY < 0) nextY = 0;

			var y = (nextY * me.g_chartArea.maxY) + me.g_chartArea.minY;

			var textY = i * increment;

			if (textY > 1) textY = 1;

			var text = me.Truncate((textY * (me.maxY - me.minY)) + me.minY);

			me.Text(textArea,
				me.g_yAxis.minX + (me.g_yAxis.maxX * (3 / 4)),
				y + 1, // TODO: Replace 1 with somthing more sensible
				text);
		}

		return true;
	};

	function DrawXAxis() {
		// #### XAxis ####
		if (me.g_xAxis == null) return false;
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
			(typeof (me.g_data[0][0]) == "object")) {

			// Variable X Axis
			var isDate = (typeof (me.g_data[0][0]) == "object");
			for (var i = 0; i < me.g_data[1].length; i++) {
				var value;
				var text;
				if (isDate) {
					var d = new Date(me.g_data[0][i][0], me.g_data[0][i][1], me.g_data[0][i][2]);

					value = d.valueOf();

					text = me.FormatDate(d, me.g_xAxis.dateFormat)
				} else {
					value = me.g_data[0][i];

					text = value.toString();
				}
				var nextX = (value - me.minX) / (me.maxX - me.minX);
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

		return true;
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
		if (me.g_xAxis != null) {
			var increment = me.g_chartArea.maxX / (me.g_data[1].length - 1);

			var isVariableXAxis = typeof (me.g_data[0][0]) == "number"
				|| (typeof (me.g_data[0][0]) == "object");
			var isDate = (typeof (me.g_data[0][0]) == "object");

			for (var i = 0; i < me.g_data[1].length; i++) {
				var x;
				var color = me.g_xAxis.spokeColor;

				if (isVariableXAxis) {
					var valueX;
					if (isDate) {
						// Create the date object
						var d = new Date(me.g_data[0][i][0], me.g_data[0][i][1], me.g_data[0][i][2]);
						// Replace the array with the date object
						valueX = d.valueOf();
					} else {
						valueX = me.g_data[0][i];
					}

					var nextX = (valueX - me.minX) / (me.maxX - me.minX);
					x = (nextX * me.g_chartArea.maxX) + me.g_chartArea.minX;

					if (valueX == me.minX || valueX == me.maxX) {
						color = "#000000";
					}
				} else {
					x = me.g_chartArea.minX + (i * increment);

					if (i == 0 || i == me.g_data[1].length - 1) {
						color = "#000000";
					}
				}

				me.Line(me.g_chartArea.reference,
					x,
					me.g_chartArea.minY,
					x,
					me.g_xAxis.minY + 1,
					color);
			}
		}
		// YAxis Spokes
		if (me.g_yAxis) {
			var increment = (me.maxY - me.minY) / (me.g_chartArea.yAxisDividers - 1);

			for (var i = 0; i < (me.g_chartArea.yAxisDividers) ; i++) {
				var nextY = 1 - (i * increment) / (me.maxY - me.minY);

				if (nextY < 0) nextY = 0;

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
		var startX = 1 - ((p_correlation[0] - me.minY) / (me.maxY - me.minY));
		var endX = 1 - ((p_correlation[1] - me.minY) / (me.maxY - me.minY));

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
		// #### Chart Area ####
		me.g_chartArea.minX = 23;
		me.g_chartArea.minY = 23;
		me.g_chartArea.maxX = 54;
		me.g_chartArea.maxY = 54;

		// #### XAxis ####
		if (me.g_xAxis != null) {
			me.g_xAxis.minX = 20;
			me.g_xAxis.minY = 80;
			me.g_xAxis.maxX = 60;
			me.g_xAxis.maxY = 20;
		} else {
			me.g_chartArea.maxY += 20;
		}

		// #### YAxis ####
		if (me.g_yAxis != null) {
			me.g_yAxis.minX = 0;
			me.g_yAxis.minY = 20;
			me.g_yAxis.maxX = 20;
			me.g_yAxis.maxY = 60;
			if (me.g_xAxis == null) {
				me.g_yAxis.maxY += 20;
			}
		} else {
			if (me.g_xAxis != null) {
				me.g_xAxis.minX -= 20;
				me.g_xAxis.maxX += 20;
			}
			me.g_chartArea.minX -= 20;
			me.g_chartArea.maxX += 20;
		}

		// #### Legend ####
		if (me.g_legend != undefined) {
			// Dimentions
			me.g_legend.minX = 80;
			me.g_legend.minY = 20;
			me.g_legend.maxX = 20;
			me.g_legend.maxY = 80;
		} else {
			if (me.g_xAxis != null) me.g_xAxis.maxX += 20;
			me.g_chartArea.maxX += 20;
		}

		if (me.g_title == null) {
			if (me.g_legend != undefined) {
				me.g_legend.minY -= 20;
				me.g_legend.maxY += 20;
			}
			if (me.g_yAxis != null) {
				me.g_yAxis.minY -= 20;
				me.g_yAxis.maxY += 20;
			}
			me.g_chartArea.minY -= 20;
			me.g_chartArea.maxY += 20;
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
		if (me.maxY == null || me.maxY < max) {
			me.maxY = max;
		}
		if (me.minY == null || me.minY > min) {
			me.minY = min;
		}

		// X Axis

		if (typeof (me.g_data[0][0]) == "number") {
			// Get the initial Min & Max
			var max = Math.max.apply(null, me.g_data[0]);
			var min = Math.min.apply(null, me.g_data[0]);

			me.maxX = max;
			me.minX = min;
		}
		else if (typeof (me.g_data[0][0]) == "object") {

			// We are working with dates
			var seconds = [];
			for (var i = 0; i < me.g_data[0].length; i++) {
				var d = new Date(me.g_data[0][i][0], me.g_data[0][i][1], me.g_data[0][i][2]);

				seconds[i] = d.valueOf();
			}

			var max = Math.max.apply(null, seconds);
			var min = Math.min.apply(null, seconds);

			me.maxX = max;
			me.minX = min;

		}
		else {
			// Standard string X Axis
			me.maxX = me.g_data[0].length;
			me.minX = 0;
		}
	};


	// Master Functions


	// Higher level function used by the base object
	this.BaseDrawChart = function () {
		SizeChart();
		SizeData();

		if (DrawYAxis()) me.Alert("YAxis Rendered", 0);
		if (DrawXAxis()) me.Alert("XAxis Rendered", 0);
		DrawChartContainer(); me.Alert("Chart Container Rendered", 0);

		// Pass on to lower level function
		this.DrawChart();
	};

	// Delete the chart area and redraw it
	this.RefreshChart = function () {
		this.g_chartArea.reference.remove(); me.Alert("Chart Area Removed", 0);

		if (DrawChartContainer()) me.Alert("Chart Container Rendered", 0);

		// Pass on to lower level function
		this.DrawChart();
	};

	// Draw out correlation on canvas.
	this.RenderCorrelation = function (p_element, p_settings) {
		var widget = new ChartApiCorrelaitonWidget(this.g_data[0], p_element, p_settings, this);

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
	function DrawPoint(p_series) {
		var TotalData = me.GetFilteredData(p_series);
		if (TotalData[0] == undefined || TotalData[0] == null) {
			return false;
		}

		// ### Variables ###
		var categories = TotalData[0];
		var data = TotalData[1]
		var isVariableXAxis = TotalData[2];
		var isDate = TotalData[3];

		var colorNumber = p_series - 1;
		// Derived values
		var incrementX = me.g_chartArea.maxX / (data.length - 1);
		var valueX = isDate ? categories[0].valueOf() : categories[0];
		var nextY = 1 - ((data[0] - me.minY) / (me.maxY - me.minY));

		var pointBorder = me.g_chartArea.pointBorder == null
			|| me.g_chartArea.pointBorder[colorNumber] == null
			? me.g_chartArea.color[colorNumber] : me.g_chartArea.pointBorder[colorNumber];

		for (var i = 0; i < (data.length - 1) ; i++) {
			// Get X
			var x1;
			var x2;

			if (isVariableXAxis) {
				var nextX = (valueX - me.minX) / (me.maxX - me.minX);
				var x1 = (nextX * me.g_chartArea.maxX) + me.g_chartArea.minX;

				valueX = isDate ? categories[i + 1].valueOf() : categories[i + 1];

				var nextX = (valueX - me.minX) / (me.maxX - me.minX);
				var x2 = (nextX * me.g_chartArea.maxX) + me.g_chartArea.minX;
			} else {
				x1 = me.g_chartArea.minX + (i * incrementX);
				x2 = me.g_chartArea.minX + ((i + 1) * incrementX);
			}
			// Get Y
			var y1 = (nextY * me.g_chartArea.maxY) + me.g_chartArea.minY;
			nextY = 1 - ((data[i + 1] - me.minY) / (me.maxY - me.minY));

			var y2 = (nextY * me.g_chartArea.maxY) + me.g_chartArea.minY;
			// Check if a point is missing
			if (isNaN(y1) || isNaN(y2)) {

				if (!isNaN(y1)) {
					// if this point exists, draw it out
					var category = isDate ? me.FormatDate(categories[i], me.g_xAxis.dateFormat) : categories[i];

					var Circle = me.Circle(me.g_chartArea.reference, x1, y1, 0.75, me.g_chartArea.color[colorNumber], pointBorder);

					me.Event(Circle,
						"mouseover",
						me.HoverText,
						data[i] + ', ' + category);

					me.Event(Circle,
						"mouseout",
						me.EndHoverText);
				}

				if (!isNaN(y2)) {
					// if this point exists, draw it out
					var category = isDate ? me.FormatDate(categories[i + 1], me.g_xAxis.dateFormat) : categories[i + 1];

					var Circle = me.Circle(me.g_chartArea.reference, x2, y2, 0.75, me.g_chartArea.color[colorNumber], pointBorder);

					me.Event(Circle,
						"mouseover",
						me.HoverText,
						data[i + 1] + ', ' + category);

					me.Event(Circle,
						"mouseout",
						me.EndHoverText);
				}

				continue;
			}

			// Draw the line
			me.Line(me.g_chartArea.reference, x1, y1, x2, y2, me.g_chartArea.color[colorNumber]);

			// Draw the point
			var category = isDate ? me.FormatDate(categories[i], me.g_xAxis.dateFormat) : categories[i];

			var Circle = me.Circle(me.g_chartArea.reference, x1, y1, 0.75, me.g_chartArea.color[colorNumber], pointBorder);

			me.Event(Circle,
				"mouseover",
				me.HoverText,
				data[i] + ', ' + category);

			me.Event(Circle,
				"mouseout",
				me.EndHoverText);

			if (i == (data.length - 2)) {
				// this is the last point
				var category = isDate ? me.FormatDate(categories[i + 1], me.g_xAxis.dateFormat) : categories[i + 1];

				var Circle = me.Circle(me.g_chartArea.reference, x2, y2, 0.75, me.g_chartArea.color[colorNumber], pointBorder);

				me.Event(Circle,
					"mouseover",
					me.HoverText,
					data[i + 1] + ', ' + category);

				me.Event(Circle,
					"mouseout",
					me.EndHoverText);
			}
		}

		return true;
	};


	// #### User Interfaces ####


	this.DrawChart = function () {
		if (me.drawSeries == -1) {
			for (var i = 1; i < this.g_data.length; i++) {
				DrawPoint(i);
			}
		}
		else DrawPoint(me.drawSeries);
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
	function DrawPoint(p_series) {
		var TotalData = me.GetFilteredData(p_series);
		if (TotalData[0] == undefined || TotalData[0] == null) {
			return false;
		}

		// ### Variables ###
		var categories = TotalData[0];
		var data = TotalData[1]
		var isVariableXAxis = TotalData[2];
		var isDate = TotalData[3];

		var colorNumber = p_series - 1;
		// Derived values
		var incrementX = me.g_chartArea.maxX / (data.length - 1);
		var valueX = isDate ? categories[0].valueOf() : categories[0];
		var nextY = 1 - ((data[0] - me.minY) / (me.maxY - me.minY));

		var pointBorder = me.g_chartArea.pointBorder == null
			|| me.g_chartArea.pointBorder[colorNumber] == null
			? me.g_chartArea.color[colorNumber] : me.g_chartArea.pointBorder[colorNumber];

		for (var i = 0; i < (data.length - 1) ; i++) {
			// Get X
			var x1;
			var x2;

			if (isVariableXAxis) {
				var nextX = (valueX - me.minX) / (me.maxX - me.minX);
				var x1 = (nextX * me.g_chartArea.maxX) + me.g_chartArea.minX;

				valueX = isDate ? categories[i + 1].valueOf() : categories[i + 1];

				var nextX = (valueX - me.minX) / (me.maxX - me.minX);
				var x2 = (nextX * me.g_chartArea.maxX) + me.g_chartArea.minX;
			} else {
				x1 = me.g_chartArea.minX + (i * incrementX);
				x2 = me.g_chartArea.minX + ((i + 1) * incrementX);
			}
			// Get Y
			var y1 = (nextY * me.g_chartArea.maxY) + me.g_chartArea.minY;
			nextY = 1 - ((data[i + 1] - me.minY) / (me.maxY - me.minY));

			var y2 = (nextY * me.g_chartArea.maxY) + me.g_chartArea.minY;
			// Check if a point is missing
			if (isNaN(y1) || isNaN(y2)) {

				if (!isNaN(y1)) {
					// if this point exists, draw it out
					var category = isDate ? me.FormatDate(categories[i], me.g_xAxis.dateFormat) : categories[i];

					var Circle = me.Circle(me.g_chartArea.reference, x1, y1, 0.75, me.g_chartArea.color[colorNumber], pointBorder);

					me.Event(Circle,
						"mouseover",
						me.HoverText,
						data[i] + ', ' + category);

					me.Event(Circle,
						"mouseout",
						me.EndHoverText);
				}

				if (!isNaN(y2)) {
					// if this point exists, draw it out
					var category = isDate ? me.FormatDate(categories[i + 1], me.g_xAxis.dateFormat) : categories[i + 1];

					var Circle = me.Circle(me.g_chartArea.reference, x2, y2, 0.75, me.g_chartArea.color[colorNumber], pointBorder);

					me.Event(Circle,
						"mouseover",
						me.HoverText,
						data[i + 1] + ', ' + category);

					me.Event(Circle,
						"mouseout",
						me.EndHoverText);
				}

				continue;
			}

			// Draw the line
			//me.Line(me.g_chartArea.reference, x1, y1, x2, y2, me.g_chartArea.color[colorNumber]);

			// Draw the point
			var category = isDate ? me.FormatDate(categories[i], me.g_xAxis.dateFormat) : categories[i];

			var Circle = me.Circle(me.g_chartArea.reference, x1, y1, 0.75, me.g_chartArea.color[colorNumber], pointBorder);

			me.Event(Circle,
				"mouseover",
				me.HoverText,
				data[i] + ', ' + category);

			me.Event(Circle,
				"mouseout",
				me.EndHoverText);

			if (i == (data.length - 2)) {
				// this is the last point
				var category = isDate ? me.FormatDate(categories[i + 1], me.g_xAxis.dateFormat) : categories[i + 1];

				var Circle = me.Circle(me.g_chartArea.reference, x2, y2, 0.75, me.g_chartArea.color[colorNumber], pointBorder);

				me.Event(Circle,
					"mouseover",
					me.HoverText,
					data[i + 1] + ', ' + category);

				me.Event(Circle,
					"mouseout",
					me.EndHoverText);
			}
		}

		return true;
	};


	// #### User Interfaces ####


	this.DrawChart = function () {
		if (me.drawSeries == -1) {
			for (var i = 1; i < this.g_data.length; i++) {
				DrawPoint(i);
			}
		}
		else DrawPoint(me.drawSeries);
	};
}