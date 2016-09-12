function ChartApiCorrelaitonWidget(p_categories, p_element, p_settings) {

	// Setup Inheritence


	this.base = ChartApiWidget;
	this.base(p_element);
	var me = this;

	var g_results = [];
	var g_categories = p_categories;


	// #### Workings objects ####


	this.g_ChartArea =
		{
			reference: null,
			color: ["#000000"],
			canvasBackground: "#FFFFFF",
			background: "#FFFFFF"
		}
	this.g_title =
		{
			// This reference is for the text directly, unlike the other references for the parent element.
			reference: null,
			text: "",
			font: null,
			background: "#FFFFFF",
			fontSize: null
		}
	this.g_formula =
		{
			reference: null,
			color: ["#000000"],
			font: null,
			background: "#FFFFFF",
			fontSize: null,
			minX: 0,
			minY: 0,
			maxX: 0,
			maxY: 0
		}
	this.g_correlation =
		{
			reference: null,
			color: ["#000000"],
			font: null,
			background: "#FFFFFF",
			fontSize: null,
			minX: 0,
			minY: 0,
			maxX: 0,
			maxY: 0
		}

	// #### Functions ####


	var LoadSettings = function () {
		console.log("Receiving Settings:");
		if (p_settings.BaseFont != undefined) {
			console.log("Base Font Received");
			g_baseFont = p_settings.BaseFont;
		}
		if (p_settings.ChartArea != undefined) {
			console.log("ChartArea Received");
			if (p_settings.ChartArea.canvasBackground != undefined) me.g_ChartArea.canvasBackground = p_settings.ChartArea.canvasBackground;
			if (p_settings.ChartArea.background != undefined) me.g_ChartArea.background = p_settings.ChartArea.background;
			if (p_settings.ChartArea.color != undefined) me.g_ChartArea.color = p_settings.ChartArea.color;
		}
		if (p_settings.Title != undefined) {
			console.log("Title Received");
			if (p_settings.Title.text != undefined) me.g_title.text = p_settings.Title.text;
			if (p_settings.Title.font != undefined) me.g_title.font = p_settings.Title.font;
			if (p_settings.Title.background != undefined) me.g_title.background = p_settings.Title.background;
		}
		if (p_settings.Legend != undefined && p_settings.Legend.names != undefined) {
			console.log("Legend Received");
			me.g_legend =
				{
					text: p_settings.Legend.text != undefined ? p_settings.Legend.text : null,
					font: p_settings.Legend.font != undefined ? p_settings.Legend.font : g_baseFont,
					background: p_settings.Legend.background != undefined ? p_settings.Legend.background : "#FFFFFF",
					altBackground: p_settings.Legend.altBackground != undefined ? p_settings.Legend.altBackground : null,
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

	var SizeFonts = function () {
		// #### Chart Font Sizes ####
		var baseFontSize = me.g_size / 100;
		// Title
		if (me.g_title.fontSize == null || me.g_title.fontSize < 0) {
			me.g_title.fontSize = 5 * baseFontSize;
		}
		// Legend
		if (me.g_legend.fontSize == null || me.g_legend.fontSize < 0) {
			me.g_legend.fontSize = 3 * baseFontSize;
		}
		if (me.g_legend.baseFontSize == null || me.g_legend.baseFontSize < 0) {
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

	var SizeWidget = function () {
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

	var DrawBaseAreas = function () {
		// General Setup
		// Currently used for the Background & Title.
		// #### Background ####
		me.Rect(me.g_canvas, 0, 0, 100, 100, me.g_ChartArea.canvasBackground, "#000");
		// #### Title ####
		me.Rect(me.g_canvas, 0, 0, 100, 20, me.g_title.background, "#000");
		// Title Text
		var textArea = me.TextArea(null, me.g_title.font, me.g_title.fontSize, false);
		me.g_title.reference = me.Text(textArea, 50, 10, me.g_title.text, 8);
	}

	var DrawLegend = function () {
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
			me.Text(textArea,
				me.g_legend.minX + (me.g_legend.maxX / 2),
				me.g_legend.minY + ((i + 1.6) * (me.g_legend.maxY / 8)),
				me.g_legend.names[i]);
			

			var pointBorder = me.g_ChartArea.pointBorder == null || me.g_ChartArea.pointBorder[i] == null ? me.g_ChartArea.color[i] : me.g_ChartArea.pointBorder[i];

			me.Circle(me.g_legend.reference,
				me.g_legend.minX + (me.g_legend.maxX / 2),
				me.g_legend.minY + ((i + 1.2) * (me.g_legend.maxY / 8)),
				0.75,
				me.g_ChartArea.color[i],
				pointBorder);

			me.EventRect(me.g_legend.reference,
				me.g_legend.minX,
				me.g_legend.minY + ((i + 1) * (me.g_legend.maxY / 8)),
				me.g_legend.maxX,
				me.g_legend.maxY / 8,
				"click",
				me.LegendClick,
				this,
				(i + 1));

			i++;
		}
		return true
	}

	var DrawFormula = function (p_series) {
		// First series are added last
		var series = g_results.length - p_series;
		// Formula Reference
		me.g_formula.reference = me.Group();
		// Formula Area
		me.Rect(me.g_formula.reference,
			me.g_formula.minX,
			me.g_formula.minY,
			me.g_formula.maxX,
			me.g_formula.maxY,
			me.g_formula.background,
			"#000");

		// Formula Text
		var textArea = me.TextArea(me.g_formula.reference, me.g_formula.font, me.g_formula.fontSize, false);
		me.Text(textArea, me.g_formula.minX + (me.g_formula.maxX / 2), me.g_formula.minY + (me.g_formula.maxY / 2), g_results[series][2]);
	}

	var DrawCorrelation = function (p_series) {
		// First series are added last
		var series = g_results.length - p_series;
		// Formula Reference
		me.g_correlation.reference = me.Group();
		// Formula Area
		me.Rect(me.g_correlation.reference,
			me.g_correlation.minX,
			me.g_correlation.minY,
			me.g_correlation.maxX,
			me.g_correlation.maxY,
			me.g_correlation.background,
			"#000");
		// Formula Text
		var text = (Math.abs(g_results[series][3]) * 100).toFixed(1) + '%';

		// Idiot's guide to a Switch statement
		var value = Math.abs(g_results[series][3]);

		if (value == 1) {
			text += "\nPerfect Correlation";
		} else if (value > 0.8) {
			text += "\nStrong Correlation";
		} else if (value > 0.5){
			text += "\nCorrelation";
		} else if (value > 0.3) {
			text += "\nWeak Correlation";
		} else if (value >= 0) {
			text += "\nNo Correlation";
		}
		else {
			text = "Error computing correlation."
		}

		
		var textArea = me.TextArea(null, me.g_correlation.font, me.g_correlation.fontSize, false);
		me.Text(textArea,
			me.g_correlation.minX + (me.g_correlation.maxX / 2),
			me.g_correlation.minY + (me.g_correlation.maxY / 2),
			text,
			8);
	}

	// #### User Interfaces ####


	this.LegendClick = function (e) {
		var clickValue = e.target.getAttribute('clickValue');
		DrawFormula(clickValue);
		DrawCorrelation(clickValue);
	}

	// Get's the start and end points to draw the line of best fit.
	// Uses simplest technique, OLS
	this.GetCorrelation = function (p_data) {
		if (p_data == undefined || p_data == null) {
			return false;
		}

		// #### X Axis ####

		// Assume X is linear.
		// TODO: DO NOT assume X is linear
		var meanX = 0;
		{
			var i = 0;

			while (i < p_categories.length) {
				meanX += i;

				i++;
			}
			meanX /= i;
		}

		var maxX = 11;//Math.max.apply(null, p_categories);
		var minX = 0;//Math.min.apply(null, p_categories);


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
			top += (i - meanX) * (p_data[i] - meanY);

			bottom += Math.pow(i - meanX, 2);
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
				top += Math.pow(i - meanX, 2);

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
				correlation += ((i - meanX) / deviationX)
					* ((p_data[i] - meanY) / deviationY);

				i++;
			}

			var bottom = i - 1;

			correlation = correlation / bottom;
		}

		// #### Results ####
		// (+ .toFixed(2) truncates to the final 2 and removes the trailing 0's
		g_results[g_results.length] = [start, end, "y = " + (+M.toFixed(2)) + "X + " + (+C.toFixed(2)), (+correlation.toFixed(5))];

		return [start, end, "y = " + M + " X + " + C, correlation];
	}

	this.Render = function () {
		console.log("#### Rendering Widget ####");
		try {
			if (this.g_canvas == null || this.g_canvas == undefined) {
				console.log("Unable to create chart - no parent element");
			}

			LoadSettings();
			SizeWidget();
			SizeFonts();
			DrawBaseAreas();

			DrawFormula(1);
			DrawCorrelation(1);
			DrawLegend();

			console.log("#### Render Complete ####");

			return true;
		}
		catch (ex) {
			console.error("Stopped Rendering due to exception:")
			console.error(ex.message);

			if (this.g_canvas != null && this.g_canvas != undefined) {
				this.Remove(true);
				return false;
			}
		}
		return true;
	}

	this.Remove = function (p_keepParent) {
		console.log("Removing Widget");

		if (p_keepParent) {
			while (this.g_canvas.hasChildNodes()) {
				this.g_canvas.removeChild(this.g_canvas.lastChild);
			}
		}
		else {
			this.g_canvas.remove();
		}
	}
}
