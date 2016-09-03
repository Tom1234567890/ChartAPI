// Base Object
// This is required to use any given chart

function BaseChartApi(p_element, p_settings, p_data) {
	// Initialisation

	// Global Variables with Defaults
	this.g_canvas;
	this.g_size;
	this.g_data;
	var g_sizeX = 500;
	var g_sizeY = 500;
	var g_strokeWidth = "2px";
	var g_fontSuffix = "pt";
	var g_baseFont = "TimesNewRoman";

	try {
		if (p_element.tagName.toLowerCase() == "svg") {
			// Client has created the correct element
			this.g_canvas = p_element;
			// Get Width & Height
			var rect = this.g_canvas.getBoundingClientRect(); // get the bounding rectangle
			g_sizeY = rect.height;
			g_sizeX = rect.width;
		}
		else {
			// Generate the element as a child
			this.g_canvas = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			if (this.g_canvas == undefined || this.g_canvas == null) {
				throw Error("Unable to generate canvas element");
			}
			// Set Height
			this.g_canvas.setAttributeNS(null, "viewBox", "0 0 " + g_sizeX + " " + g_sizeY);
			this.g_canvas.setAttributeNS(null, "width", g_sizeX);
			this.g_canvas.setAttributeNS(null, "height", g_sizeY);
			// Add to document
			p_element.appendChild(this.g_canvas);
		}
		this.g_size = g_sizeX < g_sizeY ? g_sizeX : g_sizeY;
	}
	catch (ex) {
		// Error, but let the processes continue.
		console.error("Error Creating Chart Object: " + ex.message);
		return;
	}

	// #### Workings Objects ####

	this.g_title =
		{
			// This reference is for the text directly, unlike the other references for the parent element.
			reference: null,
			text: "",
			font: null,
			background: "#FFFFFF",
			fontSize: null,
			minX: 0,
			minY: 0,
			maxX: 0,
			maxY: 0
		}
	this.g_chartArea =
		{
			reference: null,
			color: ["#000000"],
			canvasBackground: "#FFFFFF",
			background: "#FFFFFF",
			pointBorder: null,
			altBackground: null,
			yAxisDividers: 5,
			truncation: 3,
			minX: 0,
			minY: 0,
			maxX: 0,
			maxY: 0
		}
	this.g_yAxis =
		{
			reference: null,
			text: "",
			fontSize: null,
			baseFontSize: null,
			font: null,
			background: "#FFFFFF",
			titleBackground: null,
			spokeColor: "#808080",
			min: 0,
			max: 0,
			minX: 0,
			minY: 0,
			maxX: 0,
			maxY: 0
		}
	this.g_xAxis =
		{
			reference: null,
			text: "",
			fontSize: null,
			baseFontSize: null,
			font: null,
			background: "#FFFFFF",
			titleBackground: null,
			spokeColor: "#808080",
			spacing: 0,
			minX: 0,
			minY: 0,
			maxX: 0,
			maxY: 0
		}
	// Optional Input
	this.g_logo;
	this.g_legend;


	// #### Helper Functions ####


	this.Group = function () {
		var group = document.createElementNS("http://www.w3.org/2000/svg", "g");

		return this.g_canvas.appendChild(group);
	}

	this.Rect = function (p_parent, p_minX, p_minY, p_maxX, p_maxY, p_background, p_lineColor) {
		if (p_background == "Transparent") p_background = null;
		if (p_lineColor == "Transparent") p_background = null;
		if (p_lineColor == null && p_background == null) return;
		if (p_parent == null || p_parent == undefined) {
			p_parent = this.g_canvas;
		}

		var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		rect.setAttribute('x', p_minX + '%');
		rect.setAttribute('y', p_minY + '%');
		rect.setAttribute('width', p_maxX + '%');
		rect.setAttribute('height', p_maxY + '%');
		if (p_background != null) {
			rect.setAttribute('fill', p_background);
		}
		else {
			rect.setAttribute('fill-opacity', 0);
		}
		if (p_lineColor != null) {
			rect.setAttribute('stroke-width', g_strokeWidth);
			rect.setAttribute('stroke', p_lineColor);
		}
		p_parent.appendChild(rect);
		// Return a reference of the element.
		return rect;
	}

	this.Line = function (p_parent, p_x1, p_y1, p_x2, p_y2, p_lineColor) {
		if (p_lineColor == "Transparent") p_background = null;
		if (p_lineColor == null) return;
		if (p_parent == null || p_parent == undefined) {
			p_parent = this.g_canvas;
		}

		var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		line.setAttribute('x1', p_x1 + '%');
		line.setAttribute('y1', p_y1 + '%');
		line.setAttribute('x2', p_x2 + '%');
		line.setAttribute('y2', p_y2 + '%');
		line.setAttribute('stroke-width', g_strokeWidth);
		line.setAttribute('stroke', p_lineColor);
		p_parent.appendChild(line);
	}

	this.TextArea = function (p_parent, p_font, p_fontSize, p_isVertical, p_x, p_y) {
		if (p_font == null || p_font == undefined) {
			p_font = g_baseFont;
		}

		if (p_parent == null || p_parent == undefined) {
			p_parent = this.g_canvas;
		}

		var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
		text.setAttribute('fill', "#000");
		text.setAttribute('font-family', p_font);
		text.setAttribute('font-size', p_fontSize + g_fontSuffix);

		if (p_isVertical) {
			text.setAttribute('transform', "rotate(270)");
			text.setAttribute('style', 'transform-origin: ' + p_x + '% ' + p_y + '%')
		}
		return p_parent.appendChild(text);
	}

	this.Text = function (p_parent, p_x, p_y, p_message) {
		if (p_parent == null || p_parent == undefined) {
			p_parent = this.g_canvas;
		}

		var text = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
		text.setAttribute('x', p_x + '%');
		text.setAttribute('y', p_y + '%');
		text.setAttribute('text-anchor', 'middle');

		text.innerHTML = p_message;
		return p_parent.appendChild(text);
	}

	this.Circle = function (p_parent, p_x, p_y, p_radius, p_background, p_lineColor) {
		if (p_parent == null || p_parent == undefined) {
			p_parent = this.g_canvas;
		}

		var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		circle.setAttribute('cx', p_x + '%');
		circle.setAttribute('cy', p_y + '%');
		circle.setAttribute('r', p_radius + '%');

		if (p_background != null) {
			circle.setAttribute('fill', p_background);
		}
		else {
			circle.setAttribute('fill-opacity', 0);
		}
		if (p_lineColor != null) {
			circle.setAttribute('stroke-width', g_strokeWidth);
			circle.setAttribute('stroke', p_lineColor);
		}

		return p_parent.appendChild(circle);
	}


	// #### Functions ####


	this.LoadChartData = function () {
		if (this.g_data == null) {
			// First time setup, essentially just error check
			if (p_data == null || p_data == undefined || p_data.Value == undefined || p_data.Category == undefined) {
				throw Error("Data object not Received");
			}
			if (p_data.Value[0] == undefined) {
				throw Error("Data not Received");
			}
			if (p_data.Category[0] == undefined) {
				throw Error("Categories not Received");
			}
			this.g_data =
				{
					category: p_data.Category,
					value: p_data.Value,
					value2: p_data.Value2,
					value3: p_data.Value3,
					value4: p_data.Value4,
					value5: p_data.Value5,
					value6: p_data.Value6,
					value7: p_data.Value7
				}
		}
		else {
			// TODO: Ajax?
		}
	}

	// Load in details from the input object
	this.LoadSettings = function () {
		console.log("Receiving Settings:");
		if (p_settings.BaseFont != undefined) {
			console.log("Base Font Received");
			g_baseFont = p_settings.BaseFont;
		}
		if (p_settings.Title != undefined) {
			console.log("Title Received");
			if (p_settings.Title.text != undefined) this.g_title.text = p_settings.Title.text;
			if (p_settings.Title.font != undefined) this.g_title.font = p_settings.Title.font;
			if (p_settings.Title.background != undefined) this.g_title.background = p_settings.Title.background;
		}
		if (p_settings.ChartArea != undefined) {
			console.log("ChartArea Received");
			if (p_settings.ChartArea.canvasBackground != undefined) this.g_chartArea.canvasBackground = p_settings.ChartArea.canvasBackground;
			if (p_settings.ChartArea.background != undefined) this.g_chartArea.background = p_settings.ChartArea.background;
			if (p_settings.ChartArea.color != undefined) this.g_chartArea.color = p_settings.ChartArea.color;
			if (p_settings.ChartArea.pointBorder != undefined) this.g_chartArea.pointBorder = p_settings.ChartArea.pointBorder;
			if (p_settings.ChartArea.altBackground != undefined) this.g_chartArea.altBackground = p_settings.ChartArea.altBackground;
			if (p_settings.ChartArea.yAxisDividers != undefined) this.g_chartArea.yAxisDividers = p_settings.ChartArea.yAxisDividers;
			if (p_settings.ChartArea.truncation != undefined) this.g_chartArea.truncation = p_settings.ChartArea.truncation;
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
		if (p_settings.YAxis != undefined) {
			console.log("YAxis Received");
			if (p_settings.YAxis.text != undefined) this.g_yAxis.text = p_settings.YAxis.text;
			if (p_settings.YAxis.font != undefined) this.g_yAxis.font = p_settings.YAxis.font;
			if (p_settings.YAxis.min != undefined) this.g_yAxis.min = p_settings.YAxis.min;
			if (p_settings.YAxis.max != undefined) this.g_yAxis.max = p_settings.YAxis.max;
			if (p_settings.YAxis.background != undefined) this.g_yAxis.background = p_settings.YAxis.background;
			if (p_settings.YAxis.fontSize != undefined) this.g_yAxis.fontSize = p_settings.YAxis.fontSize;
			if (p_settings.YAxis.baseFontSize != undefined) this.g_yAxis.baseFontSize = p_settings.YAxis.baseFontSize;
			if (p_settings.YAxis.titleBackground != undefined) this.g_yAxis.titleBackground = p_settings.YAxis.titleBackground;
			if (p_settings.YAxis.spokeColor != undefined) this.g_yAxis.spokeColor = p_settings.YAxis.spokeColor;
		}
		if (p_settings.XAxis != undefined) {
			console.log("XAxis Received");
			if (p_settings.XAxis.text != undefined) this.g_xAxis.text = p_settings.XAxis.text;
			if (p_settings.XAxis.font != undefined) this.g_xAxis.font = p_settings.XAxis.font;
			if (p_settings.XAxis.background != undefined) this.g_xAxis.background = p_settings.XAxis.background;
			if (p_settings.XAxis.fontSize != undefined) this.g_xAxis.fontSize = p_settings.XAxis.fontSize;
			if (p_settings.XAxis.baseFontSize != undefined) this.g_xAxis.baseFontSize = p_settings.XAxis.baseFontSize;
			if (p_settings.XAxis.titleBackground != undefined) this.g_xAxis.titleBackground = p_settings.XAxis.titleBackground;
			if (p_settings.XAxis.spokeColor != undefined) this.g_xAxis.spokeColor = p_settings.XAxis.spokeColor;
		}
	}

	this.DrawChartAreas = function() {
		// General Setup
		// Currently used for the Background & Title.
		// #### Background ####
		this.Rect(this.g_canvas, 0, 0, 100, 100, this.g_chartArea.canvasBackground, "#000");
		// #### Title ####
		this.Rect(this.g_canvas, 0, 0, 100, 20, this.g_title.background, "#000");
		// Title this.Text
		var textArea = this.TextArea(null, this.g_title.font, this.g_title.fontSize, false);
		this.g_chartArea.reference = this.Text(textArea, 50, 10, this.g_title.text)
	}

	this.SizeFonts = function () {
		// #### Chart Font Sizes ####
		var baseFontSize = this.g_size / 100;
		// Title
		if (this.g_title.fontSize == null || this.g_title.fontSize < 0) {
			this.g_title.fontSize = 5 * baseFontSize;
		}
		// YAxis
		if (this.g_yAxis.fontSize == null || this.g_yAxis.fontSize < 0) {
			this.g_yAxis.fontSize = 4 * baseFontSize;
		}
		if (this.g_yAxis.baseFontSize == null || this.g_yAxis.baseFontSize < 0) {
			this.g_yAxis.baseFontSize = 3 * baseFontSize;
		}
		// XAxis
		if (this.g_xAxis.fontSize == null || this.g_xAxis.fontSize < 0) {
			this.g_xAxis.fontSize = 4 * baseFontSize;
		}
		if (this.g_xAxis.baseFontSize == null || this.g_xAxis.baseFontSize < 0) {
			this.g_xAxis.baseFontSize = 3 * baseFontSize;
		}
		// Legend
		if (this.g_legend.fontSize == null || this.g_legend.fontSize < 0) {
			this.g_legend.fontSize = 3 * baseFontSize;
		}
		if (this.g_legend.baseFontSize == null || this.g_legend.baseFontSize < 0) {
			this.g_legend.baseFontSize = 2 * baseFontSize;
		}
	}
	// #### User Interfaces ####

	this.Render = function () {
		console.log("#### Rendering Chart ####");
		try {
			if (this.g_canvas == null || this.g_canvas == undefined) {
				console.log("Unable to create chart - no parent element");
			}

			// Order in which the chart is rendered:
			this.LoadChartData();
			this.LoadSettings();
			this.SizeChart();
			this.SizeData();
			this.SizeFonts();

			console.log("#### Drawing Chart ####");

			this.DrawChartAreas();
			this.BaseDrawChart();

			console.log("#### Render Complete ####");

			return true;
		}
		catch (ex) {
			console.error("Stopped Rendering due to exception:")
			console.error(ex.message);

			if (this.g_canvas != null && this.g_canvas != undefined) {
				console.log("Removing Canvas");
				this.Remove(true);
				return false;
			}
		}
		return true;
	}

	this.Remove = function (p_keepParent) {
		console.log("Removing Chart");

		if (p_keepParent) {
			while (this.g_canvas.hasChildNodes()) {
				this.g_canvas.removeChild(this.g_canvas.lastChild);
			}
		}
		else {
			this.g_canvas.remove();
		}
	}
};

