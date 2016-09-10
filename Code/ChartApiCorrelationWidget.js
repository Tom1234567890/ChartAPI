function ChartApiCorrelaitonWidget(p_categories, p_element, p_settings) {

	// Setup Inheritence


	this.base = ChartApiWidget;
	this.base(p_element);

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


	this.LoadSettings = function () {
		console.log("Receiving Settings:");
		if (p_settings.BaseFont != undefined) {
			console.log("Base Font Received");
			g_baseFont = p_settings.BaseFont;
		}
		if (p_settings.ChartArea != undefined) {
			console.log("ChartArea Received");
			if (p_settings.ChartArea.canvasBackground != undefined) this.g_ChartArea.canvasBackground = p_settings.ChartArea.canvasBackground;
			if (p_settings.ChartArea.background != undefined) this.g_ChartArea.background = p_settings.ChartArea.background;
			if (p_settings.ChartArea.color != undefined) this.g_ChartArea.color = p_settings.ChartArea.color;
		}
		if (p_settings.Title != undefined) {
			console.log("Title Received");
			if (p_settings.Title.text != undefined) this.g_title.text = p_settings.Title.text;
			if (p_settings.Title.font != undefined) this.g_title.font = p_settings.Title.font;
			if (p_settings.Title.background != undefined) this.g_title.background = p_settings.Title.background;
		}
		if (p_settings.Legend != undefined && p_settings.Legend.names != undefined) {
			console.log("Legend Received");
			this.g_legend =
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

	this.SizeFonts = function () {
		// #### Chart Font Sizes ####
		var baseFontSize = this.g_size / 100;
		// Title
		if (this.g_title.fontSize == null || this.g_title.fontSize < 0) {
			this.g_title.fontSize = 5 * baseFontSize;
		}
		// Legend
		if (this.g_legend.fontSize == null || this.g_legend.fontSize < 0) {
			this.g_legend.fontSize = 3 * baseFontSize;
		}
		if (this.g_legend.baseFontSize == null || this.g_legend.baseFontSize < 0) {
			this.g_legend.baseFontSize = 2 * baseFontSize;
		}
		// Formula
		if (this.g_formula.fontSize == null || this.g_formula.fontSize < 0) {
			this.g_formula.fontSize = 5 * baseFontSize;
		}
		// Correlation
		if (this.g_correlation.fontSize == null || this.g_correlation.fontSize < 0) {
			this.g_correlation.fontSize = 5 * baseFontSize;
		}
	}

	this.SizeWidget = function () {
		// #### Formula ####
		this.g_formula.minX = 0;
		this.g_formula.minY = 20;
		this.g_formula.maxX = 80;
		this.g_formula.maxY = 40;
		if (this.g_legend == undefined) {
			this.g_formula.maxX += 20;
		}
		// #### Correlation ####
		this.g_correlation.minX = 0;
		this.g_correlation.minY = 60;
		this.g_correlation.maxX = 80;
		this.g_correlation.maxY = 40;
		if (this.g_legend == undefined) {
			this.g_correlation.maxX += 20;
		}
		// #### Legend ####
		if (this.g_legend != undefined) {
			// Dimentions
			this.g_legend.minX = 80;
			this.g_legend.minY = 20;
			this.g_legend.maxX = 20;
			this.g_legend.maxY = 80;
		}
	}

	this.DrawBaseAreas = function() {
		// General Setup
		// Currently used for the Background & Title.
		// #### Background ####
		this.Rect(this.g_canvas, 0, 0, 100, 100, this.g_ChartArea.canvasBackground, "#000");
		// #### Title ####
		this.Rect(this.g_canvas, 0, 0, 100, 20, this.g_title.background, "#000");
		// Title Text
		var textArea = this.TextArea(null, this.g_title.font, this.g_title.fontSize, false);
		this.g_title.reference = this.Text(textArea, 50, 10, this.g_title.text);
	}

	this.DrawLegend = function () {
		// #### Legend ####
		if (this.g_legend == undefined) return false;
		// Legend Reference
		this.g_legend.reference = this.Group();
		// Legend Area
		this.Rect(this.g_legend.reference,
			this.g_legend.minX,
			this.g_legend.minY,
			this.g_legend.maxX,
			this.g_legend.maxY,
			this.g_legend.background,
			"#000");
		// Legend Alt Background
		this.Rect(this.g_legend.reference,
			this.g_legend.minX,
			this.g_legend.minY,
			this.g_legend.maxX,
			this.g_legend.maxY / 8,
			this.g_legend.altBackground,
			"#000");
		// Legend this.Text
		var textArea = this.TextArea(this.g_legend.reference, this.g_legend.font, this.g_legend.fontSize, false);
		this.Text(textArea,
			this.g_legend.minX + (this.g_legend.maxX / 2),
			this.g_legend.minY + (this.g_legend.maxY / 16),
			this.g_legend.text);
		// Legend Categories
		var textArea = this.TextArea(this.g_legend.reference, this.g_legend.font, this.g_legend.baseFontSize, false);
		var i = 0;

		while (i < 7 && this.g_legend.names[i] != undefined && this.g_legend.names[i] != null) {
			var text = this.g_legend.names[i].split('\n');
			for (var i2 = 0; i2 < text.length; i2++) {
				this.Text(textArea,
				this.g_legend.minX + (this.g_legend.maxX / 2),
				this.g_legend.minY + ((i + 1.6) * (this.g_legend.maxY / 8)) + (i2 * 3),
				text[i2]);
			}

			var pointBorder = this.g_ChartArea.pointBorder == null || this.g_ChartArea.pointBorder[i] == null ? this.g_ChartArea.color[i] : this.g_ChartArea.pointBorder[i];

			this.Circle(this.g_legend.reference,
				this.g_legend.minX + (this.g_legend.maxX / 2),
				this.g_legend.minY + ((i + 1.2) * (this.g_legend.maxY / 8)),
				0.75,
				this.g_ChartArea.color[i],
				pointBorder);

			this.Rect(this.g_legend.reference,
				this.g_legend.minX,
				this.g_legend.minY + ((i + 1) * (this.g_legend.maxY / 8)),
				this.g_legend.maxX,
				this.g_legend.maxY / 8,
				null,
				'#000000');

			i++;
		}
		return true
	}

	this.DrawFormula = function (p_series) {
		// First series are added last
		var series = g_results.length - 1 - p_series;
		// Formula Reference
		this.g_formula.reference = this.Group();
		// Formula Area
		this.Rect(this.g_formula.reference,
			this.g_formula.minX,
			this.g_formula.minY,
			this.g_formula.maxX,
			this.g_formula.maxY,
			this.g_formula.background,
			"#000");

		// Formula Text
		var textArea = this.TextArea(this.g_formula.reference, this.g_formula.font, this.g_formula.fontSize, false);
		this.Text(textArea, this.g_formula.minX + (this.g_formula.maxX / 2), this.g_formula.minY + (this.g_formula.maxY / 2), g_results[series][2]);
	}

	this.DrawCorrelation = function (p_series) {
		// First series are added last
		var series = g_results.length - 1 - p_series;
		// Formula Reference
		this.g_correlation.reference = this.Group();
		// Formula Area
		this.Rect(this.g_correlation.reference,
			this.g_correlation.minX,
			this.g_correlation.minY,
			this.g_correlation.maxX,
			this.g_correlation.maxY,
			this.g_correlation.background,
			"#000");

		// Formula Text
		var textArea = this.TextArea(null, this.g_correlation.font, this.g_correlation.fontSize, false);
		this.Text(textArea, this.g_correlation.minX + (this.g_correlation.maxX / 2), this.g_correlation.minY + (this.g_correlation.maxY / 2), g_results[series][3]);
	}

	// #### User Interfaces ####


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

		// #### Y Axis ####

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

		// Get correlation
		var correlation = Math.random(); //TODO: Exactly the opposite of this

		// Add to results
		// (+ .toFixed(2) truncates to the final 2 and removes the trailing 0's
		g_results[g_results.length] = [start, end, "y = " + (+M.toFixed(2)) + "X + " + (+C.toFixed(2)), (+ correlation.toFixed(5))];

		return [start, end, "y = " + M + " X + " + C, correlation];
	}

	this.Render = function () {
		console.log("#### Rendering Widget ####");
		try {
			if (this.g_canvas == null || this.g_canvas == undefined) {
				console.log("Unable to create chart - no parent element");
			}

			this.LoadSettings();
			this.SizeWidget();
			this.SizeFonts();
			this.DrawBaseAreas();

			this.DrawFormula(0);
			this.DrawCorrelation(0);
			this.DrawLegend();

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