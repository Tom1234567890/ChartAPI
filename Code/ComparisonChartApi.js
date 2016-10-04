// Parent object
// This is required for all Comparison chart's

function ComparisonChartApi(p_element, p_settings, p_data) {
	// Setup Inheritence

	this.base = BaseChartApi;
	this.base(p_element, p_settings, p_data);
	var me = this;


	// Functions


	// Set's out proportions of the chart & draws areas around the chart.
	function SizeChart() {
		// #### YAxis ####
		me.g_yAxis.minX = 00;
		me.g_yAxis.minY = 80;
		me.g_yAxis.maxX = 80;
		me.g_yAxis.maxY = 20;
		if (me.g_legend == undefined) {
			me.g_yAxis.maxX += 20;
		}

		// #### Chart Area ####
		me.g_chartArea.minX = 03;
		me.g_chartArea.minY = 23;
		me.g_chartArea.maxX = 74;
		me.g_chartArea.maxY = 54;
		if (me.g_legend == undefined) {
			me.g_chartArea.maxX += 20;
		}

		// #### Chart Font Sizes ####
		var baseFontSize = me.g_size / 100;

		// #### Legend ####
		if (me.g_legend != undefined) {
			// Dimentions
			me.g_legend.minX = 80;
			me.g_legend.minY = 20;
			me.g_legend.maxX = 20;
			me.g_legend.maxY = 80;
			// Font Sizes
			if (me.g_legend.fontSize == null || me.g_legend.fontSize < 0) {
				me.g_legend.fontSize = 3 * baseFontSize;
			}
			if (me.g_legend.baseFontSize == null || me.g_legend.baseFontSize < 0) {
				me.g_legend.baseFontSize = 2 * baseFontSize;
			}
		}
	};

	function DrawYAxis() {
		// XAxis Reference
		me.g_yAxis.reference = me.Group();
		// XAxis Area
		me.Rect(me.g_yAxis.reference, me.g_yAxis.minX, me.g_yAxis.minY, me.g_yAxis.maxX, me.g_yAxis.maxY, me.g_yAxis.background, me.g_yAxis.borderColor);
		// XAxis Alt Background
		me.Rect(me.g_yAxis.reference, me.g_yAxis.minX, me.g_yAxis.minY + (me.g_yAxis.maxY / 2), me.g_yAxis.maxX, me.g_yAxis.maxY / 2, me.g_yAxis.titleBackground, me.g_yAxis.borderColor);
		// XAxis me.Text
		var textArea = me.TextArea(me.g_yAxis.reference, me.g_yAxis.font, me.g_yAxis.fontSize, false);
		me.Text(textArea,
			me.g_yAxis.minX + (me.g_yAxis.maxX / 2),
			me.g_yAxis.minY + (me.g_yAxis.maxY * (7 / 8)),
			me.g_yAxis.text);
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
			me.g_chartArea.borderColor);
	};


	// Master Functions


	// Legend interactablility
	function LegendClick(e) {
		var clickValue = e.target.getAttribute('clickValue');

		me.drawSeries = clickValue;

		me.RefreshChart();

		for (var i = 0; i < background.length; i++) {
			value = i == 0 ? -1 : i;
			if (value == me.drawSeries) {
				background[i].setAttribute('fill-opacity', '1');
				background[i].setAttribute('fill', me.g_legend.altBackground);
			}
			else {
				background[i].setAttribute('fill-opacity', '0');
				background[i].setAttribute('fill', me.g_legend.highlightColor);
			}
		}
	};


	// Higher level function used to draw out the chart.
	this.BaseDrawChart = function () {
		SizeChart();

		DrawYAxis(); me.Alert("YAxis Rendered", 0);
		DrawChartContainer(); me.Alert("Chart Container Rendered", 0);

		// Function used by each child chart.
		this.DrawChart();
	};

	// Delete the chart area and redraw it
	this.RefreshChart = function () {
		this.g_chartArea.reference.remove(); me.Alert("Chart Area Removed", 0);

		DrawChartContainer(); me.Alert("Chart Container Rendered", 0);

		// Pass on to lower level function
		this.DrawChart();
	};

	this.UpdateLegend = function (p_series) {
		me.drawSeries = p_series;

		me.RefreshChart();
		me.RefreshCorrelation(me.drawSeries);

		for (var i = 0; i < background.length; i++) {
			value = i == 0 ? -1 : i;
			if (value == me.drawSeries) {
				background[i].setAttribute('fill-opacity', '1');
				background[i].setAttribute('fill', me.g_legend.altBackground);
			}
			else {
				background[i].setAttribute('fill-opacity', '0');
				background[i].setAttribute('fill', me.g_legend.highlightColor);
			}
		}
	}
}

// Child object
// User-Interactable object

function ProportionChartApi(p_element, p_settings, p_data) {
	// Setup Inheritence

	this.base = ComparisonChartApi;
	this.base(p_element, p_settings, p_data);
	var me = this;

	// Helper function for DrawChart()
	function DrawSeries(p_series) {
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

		var x = me.g_chartArea.minX;
		var prevText = null;

		var textChain = [];

		for (var i = 0; i < categories.length; i++) {
			// Draw Area
			var x2 = (data[i] / me.g_yAxis.max) * me.g_chartArea.maxX;
			var spokeX = x + (x2 / 2);

			var theColor;
			if (me.drawSeries == -1) {
				theColor = me.g_chartArea.color[i];
			} else {
				theColor = me.g_chartArea.color[colorNumber];
			}

			var rect = me.Rect(
				me.g_chartArea.reference,
				x,
				me.g_chartArea.minY,
				x2,
				me.g_chartArea.maxY,
				theColor,
				me.g_chartArea.borderColor);

			var category = isDate ? me.FormatDate(categories[i], me.g_xAxis.dateFormat) : categories[i];
			me.Event(rect,
				"mouseover",
				me.HoverText,
				data[i] + ',\n' + category);
			me.Event(rect,
				"mouseout",
				me.EndHoverText);
			if (me.drawSeries == -1) {
				me.Event(rect,
					"click",
					me.LegendClick);
				rect.setAttribute('legendValue', i + 1);
			}

			var textArea = textChain[textChain.length] = me.TextArea(
				me.g_chartArea.reference, // Use g_chartArea reference for the refresh
				me.g_yAxis.font,
				me.g_yAxis.baseFontSize,
				false,
				spokeX + 1, // TODO: Replace 1 with somthing more sensible
				me.g_yAxis.minY + (me.g_yAxis.maxY / 4));

			// Ensure we only get 5 characters. /,/g replaces all instances of ,
			var text = +((data[i] / me.g_yAxis.max) * 100).toFixed(0);
			text += '%';

			text = me.Text(textArea,
				spokeX + 1, // TODO: Replace 1 with somthing more sensible
				me.g_yAxis.minY + (me.g_yAxis.maxY / 4),
				text);

			me.Line(me.g_chartArea.reference,
				spokeX,
				me.g_chartArea.minY + me.g_chartArea.maxY - 1,
				spokeX,
				me.g_yAxis.minY + 1,
				me.g_yAxis.spokeColor);

			x = x + x2;
			prevText = textArea;
		}

		me.TextChain(textChain, false);
	};

	// Function used to plot Proportion chart's
	this.DrawChart = function () {
		// Modify the Max


		var data = new Array();

		if (this.drawSeries == -1) {
			for (var i = 1; i < this.g_data.length; i++) {
				var sum = this.g_data[i].reduce(function (a, b) { return a + b });
				data.push(sum);
			}
		}
		else {
			data = this.g_data[this.drawSeries];
		}

		var max = data.reduce((pv, cv) => pv + cv, 0);
		me.g_yAxis.max = max;


		DrawSeries(this.drawSeries);
	};
}