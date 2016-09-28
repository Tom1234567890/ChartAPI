function ChartApiCorrelaitonWidget(p_categories, p_element, p_settings, p_parent) {

	// Setup Inheritence


	this.base = ChartApiWidget;
	this.base(p_element);
	var me = this;

	this.g_results = [];
	var g_categories = p_categories;
	// Used to keep references of the legend background elements for hovering
	var background = new Array();
	var drawSeries = -1;


	// #### Workings objects ####


	this.g_chartArea =
		{
			reference: null,
			color: ["#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000"],
			canvasBackground: "#FFFFFF",
			background: "#FFFFFF",
			pointBorder: null,
			altBackground: null,
			yAxisDividers: 5,
			truncation: 3,
			minX: 0,
			minY: 0,
			maxX: 0,
			maxY: 0,
			borderColor: "#000000"
		}
	this.g_title =
		{
			// This reference is for the text directly, unlike the other references for the parent element.
			reference: null,
			text: "",
			font: null,
			background: "#FFFFFF",
			borderColor: "#000000",
			fontSize: null
		};
	this.g_formula =
		{
			reference: null,
			font: null,
			background: "#FFFFFF",
			borderColor: "#000000",
			fontSize: null,
			minX: 0,
			minY: 0,
			maxX: 0,
			maxY: 0
		};
	this.g_correlation =
		{
			reference: null,
			color: ["#000000"],
			font: null,
			background: "#FFFFFF",
			borderColor: "#000000",
			fontSize: null,
			minX: 0,
			minY: 0,
			maxX: 0,
			maxY: 0
		};
	this.g_legend = null;

	// #### Functions ####


	function LoadSettings() {
		if (p_settings == undefined && p_settings == null) {
			me.Alert("No Settings Received", 3);
			return;
		}
		me.Alert("Receiving Settings:", 1);
		if (p_settings.BaseFont != undefined) {
			me.Alert("Base Font Received", 0);
			me.g_baseFont = p_settings.BaseFont;
		}
		if (p_settings.ChartArea != undefined) {
			me.Alert("ChartArea Received", 0);
			if (p_settings.ChartArea.canvasBackground != undefined) me.g_chartArea.canvasBackground = p_settings.ChartArea.canvasBackground;
			if (p_settings.ChartArea.background != undefined) me.g_chartArea.background = p_settings.ChartArea.background;
			if (p_settings.ChartArea.color != undefined) me.g_chartArea.color = p_settings.ChartArea.color;
			if (p_settings.ChartArea.pointBorder != undefined) me.g_chartArea.pointBorder = p_settings.ChartArea.pointBorder;
			if (p_settings.ChartArea.altBackground != undefined) me.g_chartArea.altBackground = p_settings.ChartArea.altBackground;
			if (p_settings.ChartArea.yAxisDividers != undefined) me.g_chartArea.yAxisDividers = p_settings.ChartArea.yAxisDividers;
			if (p_settings.ChartArea.truncation != undefined) me.g_chartArea.truncation = p_settings.ChartArea.truncation;
			if (p_settings.ChartArea.borderColor != undefined) me.g_chartArea.borderColor = p_settings.ChartArea.borderColor;
		}
		if (p_settings.Title != undefined) {
			me.Alert("Title Received", 0);
			if (p_settings.Title.text != undefined) me.g_title.text = p_settings.Title.text;
			if (p_settings.Title.font != undefined) me.g_title.font = p_settings.Title.font;
			if (p_settings.Title.background != undefined) me.g_title.background = p_settings.Title.background;
			if (p_settings.Title.borderColor != undefined) me.g_title.borderColor = p_settings.Title.borderColor;
		}
		if (p_settings.Formula != undefined) {
			me.Alert("Formula Received", 0);
			if (p_settings.Formula.font != undefined) me.g_formula.font = p_settings.Formula.font;
			if (p_settings.Formula.background != undefined) me.g_formula.background = p_settings.Formula.background;
			if (p_settings.Formula.fontSize != undefined) me.g_formula.fontSize = p_settings.Formula.fontSize;
			if (p_settings.Formula.borderColor != undefined) me.g_formula.borderColor = p_settings.Formula.borderColor;
		}
		if (p_settings.Correlation != undefined) {
			me.Alert("Correlation Received", 0);
			if (p_settings.Correlation.font != undefined) me.g_correlation.font = p_settings.Correlation.font;
			if (p_settings.Correlation.background != undefined) me.g_correlation.background = p_settings.Correlation.background;
			if (p_settings.Correlation.fontSize != undefined) me.g_correlation.fontSize = p_settings.Correlation.fontSize;
			if (p_settings.Correlation.borderColor != undefined) me.g_correlation.borderColor = p_settings.Correlation.borderColor;
		}
		if (p_settings.Legend != undefined && p_settings.Legend.names != undefined) {
			me.Alert("Legend Received", 0);
			me.g_legend =
				{
					text: p_settings.Legend.text != undefined ? p_settings.Legend.text : null,
					font: p_settings.Legend.font != undefined ? p_settings.Legend.font : me.g_baseFont,
					background: p_settings.Legend.background != undefined ? p_settings.Legend.background : "#FFFFFF",
					altBackground: p_settings.Legend.altBackground != undefined ? p_settings.Legend.altBackground : "#666666",
					borderColor: p_settings.Legend.borderColor != undefined ? p_settings.Legend.borderColor : "#000000",
					highlightColor: p_settings.Legend.highlightColor != undefined ? p_settings.Legend.highlightColor : "#888888",
					names: p_settings.Legend.names,
					fontSize: null,
					baseFontSize: null,
					minX: 0,
					minY: 0,
					maxX: 0,
					maxY: 0
				}
		}
	}

	function SizeFonts() {
		// #### Chart Font Sizes ####
		var baseFontSize = me.g_size / 100;
		// Title
		if (me.g_title.fontSize == null || me.g_title.fontSize < 0) {
			me.g_title.fontSize = 5 * baseFontSize;
		}
		// Legend
		if (me.g_legend != undefined && (me.g_legend.fontSize == null || me.g_legend.fontSize < 0)) {
			me.g_legend.fontSize = 3 * baseFontSize;
		}
		if (me.g_legend != undefined && (me.g_legend.baseFontSize == null || me.g_legend.baseFontSize < 0)) {
			me.g_legend.baseFontSize = 2 * baseFontSize;
		}
		// Formula
		if (me.g_formula.fontSize == null || me.g_formula.fontSize < 0) {
			me.g_formula.fontSize = 5 * baseFontSize;
		}
		// Correlation
		if (me.g_correlation.fontSize == null || me.g_correlation.fontSize < 0) {
			me.g_correlation.fontSize = 5 * baseFontSize;
		}
	}

	function SizeWidget() {
		// #### Formula ####
		me.g_formula.minX = 0;
		me.g_formula.minY = 20;
		me.g_formula.maxX = 80;
		me.g_formula.maxY = 40;
		if (me.g_legend == undefined) {
			me.g_formula.maxX += 20;
		}
		// #### Correlation ####
		me.g_correlation.minX = 0;
		me.g_correlation.minY = 60;
		me.g_correlation.maxX = 80;
		me.g_correlation.maxY = 40;
		if (me.g_legend == undefined) {
			me.g_correlation.maxX += 20;
		}
		// #### Legend ####
		if (me.g_legend != undefined) {
			// Dimentions
			me.g_legend.minX = 80;
			me.g_legend.minY = 20;
			me.g_legend.maxX = 20;
			me.g_legend.maxY = 80;
		}
	}

	function DrawBaseAreas() {
		// General Setup
		// Currently used for the Background & Title.
		// #### Background ####
		me.Rect(me.g_canvas, 0, 0, 100, 100,
			me.g_chartArea.canvasBackground, me.g_chartArea.borderColor);
		// #### Title ####
		me.Rect(me.g_canvas, 0, 0, 100, 20,
			me.g_title.background, me.g_title.borderColor);
		// Title me.Text
		var textArea = me.TextArea(null, me.g_title.font, me.g_title.fontSize, false);
		me.g_title.reference = me.Text(textArea, 50, 10, me.g_title.text, 8);
	}

	function DrawLegend() {
		// #### Legend ####
		if (me.g_legend == undefined) return false;
		// Legend event handlers

		// Mouse enter
		var hoveroverFunction = function (e) {
			// Get parameters
			var clickValue = e.target.getAttribute('clickValue');

			// if -1, we mean 0.
			clickValue = clickValue == -1 ? 0 : clickValue;
			background[clickValue].setAttribute('fill-opacity', '1');
		}

		// Mouse leaves
		var hoveroutFunction = function (e) {
			// Get parameters
			var clickValue = e.target.getAttribute('clickValue');
			// Ignore the chosen one
			if (drawSeries == clickValue) return;
			// if -1, we mean 0.
			value = clickValue == -1 ? 0 : clickValue;
			background[value].setAttribute('fill-opacity', '0');
		}
		// Legend Reference
		me.g_legend.reference = me.Group();
		// Legend Area
		me.Rect(me.g_legend.reference,
			me.g_legend.minX,
			me.g_legend.minY,
			me.g_legend.maxX,
			me.g_legend.maxY * ((me.g_results.length + 1) / 8),
			me.g_legend.background,
			me.g_legend.borderColor);
		// Legend Alt Background Hovering Element
		background.push(
			me.Rect(me.g_legend.reference,
				me.g_legend.minX,
				me.g_legend.minY,
				me.g_legend.maxX,
				me.g_legend.maxY / 8,
				me.g_legend.altBackground,
				me.g_legend.borderColor)
			);
		// Starts visible:
		//background[0].setAttribute('fill-opacity', 0);
		// Legend Text
		var textArea = me.TextArea(me.g_legend.reference, me.g_legend.font, me.g_legend.fontSize, false);
		me.Text(textArea,
			me.g_legend.minX + (me.g_legend.maxX / 2),
			me.g_legend.minY + (me.g_legend.maxY / 16),
			me.g_legend.text);
		// Legend Alt Background Mouse Event Handlers
		var Listener = me.Rect(me.g_legend.reference,
			me.g_legend.minX,
			me.g_legend.minY,
			me.g_legend.maxX,
			me.g_legend.maxY / 8,
			null,
			null);

		me.Event(Listener, "click", LegendClick, -1);
		me.Event(Listener, "mouseover", hoveroverFunction);
		me.Event(Listener, "mouseout", hoveroutFunction);

		// Legend Categories
		var i = 0;

		while (i < 7 && me.g_legend.names[i] != undefined && me.g_legend.names[i] != null
			&& me.g_results[i] != undefined && me.g_results[i] != null) {

			background.push(me.Rect(
				me.g_legend.reference,
				me.g_legend.minX,
				me.g_legend.minY + ((i + 1) * (me.g_legend.maxY / 8)),
				me.g_legend.maxX,
				me.g_legend.maxY / 8,
				me.g_legend.highlightColor,
				me.g_legend.borderColor));

			background[i + 1].setAttribute('fill-opacity', 0);

			// Must be in same textarea to prevent layering issues
			var textArea = me.TextArea(me.g_legend.reference, me.g_legend.font, me.g_legend.baseFontSize, false);

			me.Text(textArea,
				me.g_legend.minX + (me.g_legend.maxX / 2),
				me.g_legend.minY + ((i + 1.6) * (me.g_legend.maxY / 8)),
				me.g_legend.names[i]);

			var pointBorder = me.g_chartArea.pointBorder == null || me.g_chartArea.pointBorder[i] == null ? me.g_chartArea.color[i] : me.g_chartArea.pointBorder[i];

			me.Circle(me.g_legend.reference,
				me.g_legend.minX + (me.g_legend.maxX / 2),
				me.g_legend.minY + ((i + 1.2) * (me.g_legend.maxY / 8)),
				0.75,
				me.g_chartArea.color[i],
				pointBorder);

			var Listener = me.Rect(
				me.g_legend.reference,
				me.g_legend.minX,
				me.g_legend.minY + ((i + 1) * (me.g_legend.maxY / 8)),
				me.g_legend.maxX,
				me.g_legend.maxY / 8,
				null,
				null);

			me.Event(Listener,
				"click",
				LegendClick,
				(i + 1));

			me.Event(Listener, "mouseover", hoveroverFunction);
			me.Event(Listener, "mouseout", hoveroutFunction);

			i++;
		}

		return true
	};

	function DrawFormula() {
		if (me.g_formula.reference != null) {
			me.g_formula.reference.remove(); me.Alert("Formula Removed", 0);
		}
		if (drawSeries == -1) return; // Do nothing when title clicked
		// First series are added last
		var series = me.g_results.length - drawSeries;
		// Formula Reference
		me.g_formula.reference = me.Group();
		// Formula Area
		me.Rect(me.g_formula.reference,
			me.g_formula.minX,
			me.g_formula.minY,
			me.g_formula.maxX,
			me.g_formula.maxY,
			me.g_formula.background,
			me.g_formula.borderColor);

		// Formula Text
		var textArea = me.TextArea(me.g_formula.reference, me.g_formula.font, me.g_formula.fontSize, false);
		me.Text(textArea, me.g_formula.minX + (me.g_formula.maxX / 2), me.g_formula.minY + (me.g_formula.maxY / 2), me.g_results[series][2]);
	}

	function DrawCorrelation() {
		if (me.g_correlation.reference != null) {
			me.g_correlation.reference.remove(); me.Alert("Correlation Removed", 0);
		}
		if (drawSeries == -1) return; // Do nothing when title clicked
		// First series are added last
		var series = me.g_results.length - drawSeries;
		// Formula Reference
		me.g_correlation.reference = me.Group();
		// Formula Area
		me.Rect(me.g_correlation.reference,
			me.g_correlation.minX,
			me.g_correlation.minY,
			me.g_correlation.maxX,
			me.g_correlation.maxY,
			me.g_correlation.background,
			me.g_correlation.borderColor);
		// Formula Text
		var text = (Math.abs(me.g_results[series][3]) * 100).toFixed(1) + '%';

		// Idiot's guide to a Switch statement
		var value = Math.abs(me.g_results[series][3]);

		if (value == 1) {
			text += "\nPerfect Correlation";
		} else if (value > 0.8) {
			text += "\nStrong Correlation";
		} else if (value > 0.5) {
			text += "\nCorrelation";
		} else if (value > 0.3) {
			text += "\nWeak Correlation";
		} else if (value >= 0) {
			text += "\nNo Correlation";
		}
		else {
			text = "Error computing\ncorrelation."
		}


		var textArea = me.TextArea(me.g_correlation.reference, me.g_correlation.font, me.g_correlation.fontSize, false);
		me.Text(textArea,
			me.g_correlation.minX + (me.g_correlation.maxX / 2),
			me.g_correlation.minY + (me.g_correlation.maxY / 2),
			text,
			8);
	}

	// #### User Interfaces ####


	function LegendClick (e) {
		var clickValue = e.target.getAttribute('clickValue');

		drawSeries = clickValue

		DrawFormula(); me.Alert("Formula Rendered", 0);
		DrawCorrelation(); me.Alert("Correlation Rendered", 0);

		for (var i = 0; i < background.length; i++) {
			var value = i == 0 ? -1 : i;
			if (value == drawSeries) {
				background[i].setAttribute('fill-opacity', '1');
				background[i].setAttribute('fill', me.g_legend.altBackground);
			}
			else {
				background[i].setAttribute('fill-opacity', '0');
				background[i].setAttribute('fill', me.g_legend.highlightColor);
			}
		}

		p_parent.UpdateLegend(clickValue);
	}

	// Get's the start and end points to draw the line of best fit.
	// Uses simplest technique, OLS
	this.GetCorrelation = function (p_data) {
		if (p_data == undefined || p_data == null) {
			return false;
		}

		// #### X Axis ####

		var isVariableXAxis = typeof (p_categories[0]) == "number"
			|| (typeof (p_categories[0]) == "object" && p_categories[0].toString() != null);
		var isDate = (typeof (p_categories[0]) == "object" && p_categories[0].toString() != null);

		if (isVariableXAxis && isDate) {
			// Convert date to number
			for (var i = 0; i < p_categories.length; i++) {
				p_categories[i] = p_categories[i].valueOf();
			}
		} else if (!isVariableXAxis) {
			// Replace with numeral
			for (var i = 0; i < p_categories.length; i++) {
				p_categories[i] = i;
			}
		}

		var meanX = 0;
		{
			var i = 0;

			while (i < p_categories.length) {
				meanX += p_categories[i];

				i++;
			}
			meanX /= i;
		}

		var maxX = Math.max.apply(null, p_categories);
		var minX = Math.min.apply(null, p_categories);


		var meanY = 0;
		{
			var i = 0;

			while (i < p_data.length) {
				if (p_data[i] == undefined || p_data[i] == null) {
					i++
					continue;
				}
				meanY += p_data[i];
				i++
			}

			meanY /= i;
		};

		var top = 0;
		var bottom = 0;

		for (var i = 0; i < p_data.length; i++) {
			top += (p_categories[i] - meanX) * (p_data[i] - meanY);

			bottom += Math.pow(p_categories[i] - meanX, 2);
		}

		var M = top / bottom;
		var C = meanY - (M * meanX);
		//  Y     =  M   X     + C
		var start = (M * minX) + C;
		var end = (M * maxX) + C;

		// #### Correlation ####
		// Standard Deviation of X
		var deviationX = 0;
		{
			var top = 0;
			var bottom = 0;
			var i = 0;

			while (i < p_categories.length) {
				top += Math.pow(p_categories[i] - meanX, 2);

				i++;
			}
			bottom = i - 1;

			deviationX = Math.sqrt(top / bottom);
		}
		// Standard Deviation of Y
		var deviationY = 0;
		{
			var top = 0;
			var bottom = 0;
			var i = 0;

			while (i < p_data.length) {
				top += Math.pow(p_data[i] - meanY, 2);

				i++;
			}
			bottom = i - 1;

			deviationY = Math.sqrt(top / bottom);
		}
		// Correlation
		var correlation = 0;
		{
			var i = 0;

			while (i < p_categories.length) {
				correlation += ((p_categories[i] - meanX) / deviationX)
					* ((p_data[i] - meanY) / deviationY);

				i++;
			}

			var bottom = i - 1;

			correlation = correlation / bottom;
		}

		// #### Results ####
		// (+ .toFixed(2) truncates to the final 2 and removes the trailing 0's
		this.g_results[this.g_results.length] = [start, end, "y = " + (+M.toFixed(2)) + "X + " + (+C.toFixed(2)), (+correlation.toFixed(5))];

		return [start, end, "y = " + M + " X + " + C, correlation];
	}

	this.Render = function () {
		if (this.DEBUG) {
			console.group();
			console.time("Chart API");
		}
		me.Alert("#### Rendering Widget ####", 1);
		try {
			if (this.g_canvas == null || this.g_canvas == undefined) {
				me.Alert("Unable to create chart - no parent element", 3);
			}

			LoadSettings();
			SizeWidget();
			SizeFonts();

			DrawBaseAreas(); me.Alert("Title Rendered", 0);
			if (DrawLegend()) me.Alert("Legend Rendered", 0);
			DrawFormula(); me.Alert("Formula Rendered", 0);
			DrawCorrelation(); me.Alert("Correlation Rendered", 0);

			me.Alert("#### Render Complete ####", 1);
			if (this.DEBUG) {
				console.timeEnd("Chart API");
				console.groupEnd();
			}
			return true;
		}
		catch (ex) {
			me.Alert("Stopped Rendering due to exception: " + ex.message, 3)
			me.Alert("Line: " + ex.lineNumber, 0);
			me.Alert(ex.stack, 0);
			if (this.DEBUG) {
				console.timeEnd("Chart API");
				console.groupEnd();
			}
			if (this.g_canvas != null && this.g_canvas != undefined) {
				this.Remove(true);
				return false;
			}
		}
		return true;
	}

	this.Remove = function (p_keepParent) {
		me.Alert("Removing Widget", 3);

		if (p_keepParent) {
			while (this.g_canvas.hasChildNodes()) {
				this.g_canvas.removeChild(this.g_canvas.lastChild);
			}
		}
		else {
			this.g_canvas.remove();
		}
	};

	this.Update = function (p_series) {
		drawSeries = p_series;

		DrawFormula(); me.Alert("Formula Rendered", 0);
		DrawCorrelation(); me.Alert("Correlation Rendered", 0);

		//Update legend
		for (var i = 0; i < background.length; i++) {
			var value = i == 0 ? -1 : i;
			if (value == drawSeries) {
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
