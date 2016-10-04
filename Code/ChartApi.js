// Base Object
// Contains all the interaction with the HTML

function ChartApiWidget(p_element) {
	// Initialisation

	// Global Variables with Defaults
	this.g_canvas;
	this.g_size;
	this.g_data;
	var g_sizeX = 400;
	var g_sizeY = 400;
	var g_strokeWidth = 0.2;
	var g_fontSuffix = "pt";
	this.g_baseFont = "TimesNewRoman";

	this.DEBUG = true //*/ false;

	try {
		if (p_element.tagName.toLowerCase() == "svg") {
			// Client has created the correct element
			this.g_canvas = p_element;
			// Make sure to set the view window!
			this.g_canvas.setAttributeNS(null, "viewBox", "0 0 100 100");
			this.g_canvas.setAttributeNS(null, "preserveAspectRatio", "none");
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
			this.g_canvas.setAttributeNS(null, "viewBox", "0 0 100 100");
			this.g_canvas.setAttributeNS(null, "preserveAspectRatio", "none");
			this.g_canvas.setAttributeNS(null, "width", g_sizeX);
			this.g_canvas.setAttributeNS(null, "height", g_sizeY);
			// Add to document
			p_element.appendChild(this.g_canvas);
		}
		this.g_size = g_sizeX < g_sizeY ? g_sizeX : g_sizeY;
	}
	catch (ex) {
		// Error, but let the processes continue.
		me.Alert("Error Creating Chart Object: " + ex.message, 3);
	}


	// #### Settings Objects ####


	this.g_title =
		{
			// This reference is for the text directly, unlike the other references for the parent element.
			reference: null,
			text: "",
			font: null,
			background: "#FFFFFF",
			fontSize: 5,
			borderColor: "#000000"
		}


	// #### HTML Functions ####


	this.Group = function () {
		var group = document.createElementNS("http://www.w3.org/2000/svg", "g");

		return this.g_canvas.appendChild(group);
	}

	this.Rect = function (p_parent, p_minX, p_minY, p_maxX, p_maxY, p_background, p_lineColor) {
		if (p_background != null && p_background.toLowerCase() == "transparent") p_background = null;
		if (p_lineColor != null && p_lineColor.toLowerCase() == "transparent") p_lineColor = null;
		if (p_parent == null || p_parent == undefined) {
			p_parent = this.g_canvas;
		}

		var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		rect.setAttribute('x', p_minX);
		rect.setAttribute('y', p_minY);
		rect.setAttribute('width', p_maxX);
		rect.setAttribute('height', p_maxY);
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

		// Return a reference of the element.
		return p_parent.appendChild(rect);
	};

	this.Line = function (p_parent, p_x1, p_y1, p_x2, p_y2, p_lineColor) {
		if (p_lineColor == "Transparent") p_background = null;
		if (p_lineColor == null) return;
		if (p_parent == null || p_parent == undefined) {
			p_parent = this.g_canvas;
		}

		// Validation
		if (isNaN(p_x1) || isNaN(p_x2) || isNaN(p_y1) || isNaN(p_y2)) {
			throw Error('Line input is not a number:\nX1 = ' + p_x1 + ',\nX2 = ' + p_x2 + ',\nY1 = ' + p_y1 + ',\nY2 = ' + p_y2);
		}

		var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		line.setAttribute('x1', p_x1);
		line.setAttribute('y1', p_y1);
		line.setAttribute('x2', p_x2);
		line.setAttribute('y2', p_y2);
		line.setAttribute('stroke-width', g_strokeWidth);
		line.setAttribute('stroke', p_lineColor);
		p_parent.appendChild(line);
	};

	this.DottedLine = function (p_parent, p_x1, p_y1, p_x2, p_y2, p_lineColor) {
		if (p_lineColor == "Transparent") p_background = null;
		if (p_lineColor == null) return;
		if (p_parent == null || p_parent == undefined) {
			p_parent = this.g_canvas;
		}

		var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		line.setAttribute('x1', p_x1);
		line.setAttribute('y1', p_y1);
		line.setAttribute('x2', p_x2);
		line.setAttribute('y2', p_y2);
		line.setAttribute('stroke-width', g_strokeWidth);
		line.setAttribute('stroke-dasharray', (g_strokeWidth * 20) + ', ' + (g_strokeWidth * 10));
		line.setAttribute('stroke', p_lineColor);
		p_parent.appendChild(line);
	};

	this.TextArea = function (p_parent, p_font, p_fontSize, p_isVertical, p_x, p_y) {
		if (p_font == undefined || p_font == null) {
			p_font = this.g_baseFont;
		}

		if (p_fontSize == undefined || p_fontSize == null) {
			return;
		}

		if (p_parent == undefined || p_parent == null) {
			p_parent = this.g_canvas;
		}

		var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
		text.setAttribute('fill', "#000");
		text.setAttribute('font-family', p_font);
		text.setAttribute('font-size', p_fontSize + g_fontSuffix);

		if (p_isVertical) {
			text.setAttribute('transform', "rotate(270 " + p_x + ", " + p_y + ")");
		}
		return p_parent.appendChild(text);
	};

	this.Text = function (p_parent, p_x, p_y, p_message, p_spacing) {
		if (p_message == undefined || p_message == null) {
			return;
		}
		if (p_parent == undefined || p_parent == null) {
			p_parent = this.g_canvas;
		}
		if (p_spacing == undefined || p_spacing == null) {
			p_spacing = 3;
		}
		if (typeof (p_message) == "number") {
			p_message = p_message.toString();
		}

		var message = p_message.split('\n');
		// Create a new line at each point
		for (var i = 0; i < message.length; i++) {
			var text = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
			text.setAttribute('x', p_x);
			text.setAttribute('y', p_y + (i * p_spacing));
			text.setAttribute('text-anchor', 'middle');

			text.innerHTML = message[i];
			p_parent.appendChild(text);
		}

		// Cannot return a tspan
		return;
	};

	this.Circle = function (p_parent, p_x, p_y, p_radius, p_background, p_lineColor) {
		if (p_parent == null || p_parent == undefined) {
			p_parent = this.g_canvas;
		}

		var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		circle.setAttribute('cx', p_x);
		circle.setAttribute('cy', p_y);
		circle.setAttribute('r', p_radius);

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
	};

	this.Event = function (p_element, p_eventName, p_eventHandler, p_clickValue) {

		// Clickvalue
		if (p_clickValue != null) {
			p_element.setAttribute('clickValue', p_clickValue);
		}

		//var scopedEventHandler = function (e) { p_eventHandler.apply(this, [e]); };

		if (document.addEventListener) {
			p_element.addEventListener(p_eventName, p_eventHandler, false);
		}
		else if (document.attachEvent) {
			p_element.attachEvent("on" + p_eventName, p_eventHandler);
		}
	}

	// Helper Functions

	this.Alert = function (p_message, p_iority) {

		if (!this.DEBUG) {
			if (p_iority < 3) return; p_iority -= 1;
		}

		switch (p_iority) {
			case 0:
				console.info(p_message);
				break;
			case 1:
				console.log(p_message);
				break;
			case 2:
				console.warn(p_message);
				break;
			case 3:
				console.error(p_message);
			case 4:
				alert(p_message);
			default:
				console.info(p_message);
		}
	};

	this.Truncate = function (p_number, p_isSuffixed) {
		// Get first 5 characters
		var number = (p_number).toString().split('', this.g_chartArea.truncation).toString().replace(/,/g, '');

		// If the final character is a DP, remove it.
		if (number.slice(-1) == '.') {
			number = number.substr(0, number.length - 1);
		}

		return number;
	};

	this.FormatDate = function (p_date, p_format) {
		var day = p_date.getDate();
		var month = p_date.getMonth() + 1;
		var year = p_date.getFullYear();

		var theReturn = p_format;
		theReturn = theReturn.replace(/DD/g, day);
		theReturn = theReturn.replace(/MM/g, month);
		theReturn = theReturn.replace(/YYYY/g, year);

		return theReturn;
	};

	this.TextChain = function (p_textAreas, p_isVertical) {
		var r1 = p_textAreas[0].getBoundingClientRect();

		for (var i = 1; i < p_textAreas.length; i++) {
			var r2 = p_textAreas[i].getBoundingClientRect();
			if (!p_isVertical) {
				if (!(r2.left > r1.right ||
					r2.right < r1.left ||
					r2.top > r1.bottom ||
					r2.bottom < r1.top)) {
					// Overlap detected - remove parent
					p_textAreas[i].remove();
				} else {
					r1 = p_textAreas[i].getBoundingClientRect();
				}
			} else {
				if (!(r2.left > r1.bottom ||
									r2.right < r1.top ||
									r2.top > r1.right ||
									r2.bottom < r1.left)) {
					// Overlap detected - remove parent
					p_textAreas[i].remove();
				} else {
					r1 = p_textAreas[i].getBoundingClientRect();
				}
			}
		}
	};
}


// Base chart object
// This is required to use any given chart


function BaseChartApi(p_element, p_settings, p_data) {
	// Setup Inheritence


	this.base = ChartApiWidget;
	this.base(p_element);
	var me = this;

	// Holds a reference to the hovertext.
	var hovertext = null;
	// The series we are drawing
	this.drawSeries = -1;
	// Used to keep references of the legend background elements for hovering
	var background = new Array();

	// Get function to move 
	var mousemove = function (e) {
		if (hovertext == null) return;

		var X = e.clientX + 12;
		var Y = e.clientY;
		hovertext.setAttribute("style", "position: fixed; top: " + Y + "px; left: " + X + "px; border: 1px solid black; background-color: white;");
	}

	me.Event(document, "mousemove", mousemove);

	// #### Settings Objects ####

	this.g_chartArea =
		{
			reference: null,
			color: ["#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000"],
			canvasBackground: "#FFFFFF",
			background: "#FFFFFF",
			pointBorder: null,
			altBackground: null,
			yAxisDividers: 5,
			truncation: 4,
			minX: 0,
			minY: 0,
			maxX: 0,
			maxY: 0,
			borderColor: "#000000"
		}
	this.g_yAxis =
		{
			reference: null,
			text: "",
			fontSize: 4,
			baseFontSize: 3,
			font: null,
			background: "#FFFFFF",
			titleBackground: null,
			spokeColor: "#808080",
			min: 0,
			max: 0,
			minX: 0,
			minY: 0,
			maxX: 0,
			maxY: 0,
			borderColor: "#000000"
		}
	this.g_xAxis =
		{
			reference: null,
			text: "",
			fontSize: 4,
			baseFontSize: 3,
			font: null,
			background: "#FFFFFF",
			titleBackground: null,
			spokeColor: "#808080",
			spacing: 0,
			dateFormat: "DD-MM-YYYY",
			min: null,
			max: null,
			minX: 0,
			minY: 0,
			maxX: 0,
			maxY: 0,
			borderColor: "#000000"
		}
	this.g_legend = undefined;// Optional Input


	// #### Functions ####


	// Load in details from the input object
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
		if (p_settings.Title != undefined) {
			me.Alert("Title Received", 0);
			if (p_settings.Title.text != undefined) me.g_title.text = p_settings.Title.text;
			if (p_settings.Title.font != undefined) me.g_title.font = p_settings.Title.font;
			if (p_settings.Title.background != undefined) me.g_title.background = p_settings.Title.background;
			if (p_settings.Title.borderColor != undefined) me.g_title.borderColor = p_settings.Title.borderColor;
		}
		if (p_settings.ChartArea != undefined) {
			me.Alert("ChartArea Received", 0);
			if (p_settings.ChartArea.canvasBackground != undefined) me.g_chartArea.canvasBackground = p_settings.ChartArea.canvasBackground;
			if (p_settings.ChartArea.canvasAltBackground != undefined) me.g_chartArea.canvasAltBackground = p_settings.ChartArea.canvasAltBackground;
			if (p_settings.ChartArea.background != undefined) me.g_chartArea.background = p_settings.ChartArea.background;
			if (p_settings.ChartArea.color != undefined) me.g_chartArea.color = p_settings.ChartArea.color;
			if (p_settings.ChartArea.pointBorder != undefined) me.g_chartArea.pointBorder = p_settings.ChartArea.pointBorder;
			if (p_settings.ChartArea.altBackground != undefined) me.g_chartArea.altBackground = p_settings.ChartArea.altBackground;
			if (p_settings.ChartArea.yAxisDividers != undefined) me.g_chartArea.yAxisDividers = p_settings.ChartArea.yAxisDividers;
			if (p_settings.ChartArea.truncation != undefined) me.g_chartArea.truncation = p_settings.ChartArea.truncation;
			if (p_settings.ChartArea.borderColor != undefined) me.g_chartArea.borderColor = p_settings.ChartArea.borderColor;
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
					fontSize: p_settings.Legend.fontSize != undefined ? p_settings.Legend.fontSize : 3,
					names: p_settings.Legend.names,
					baseFontSize: p_settings.Legend.baseFontSize != undefined ? p_settings.Legend.baseFontSize : 2,
					minX: 0,
					minY: 0,
					maxX: 0,
					maxY: 0
				}
		}
		if (p_settings.YAxis != undefined) {
			me.Alert("YAxis Received", 0);
			if (p_settings.YAxis.text != undefined) me.g_yAxis.text = p_settings.YAxis.text;
			if (p_settings.YAxis.font != undefined) me.g_yAxis.font = p_settings.YAxis.font;
			if (p_settings.YAxis.min != undefined) me.g_yAxis.min = p_settings.YAxis.min;
			if (p_settings.YAxis.max != undefined) me.g_yAxis.max = p_settings.YAxis.max;
			if (p_settings.YAxis.background != undefined) me.g_yAxis.background = p_settings.YAxis.background;
			if (p_settings.YAxis.fontSize != undefined) me.g_yAxis.fontSize = p_settings.YAxis.fontSize;
			if (p_settings.YAxis.baseFontSize != undefined) me.g_yAxis.baseFontSize = p_settings.YAxis.baseFontSize;
			if (p_settings.YAxis.titleBackground != undefined) me.g_yAxis.titleBackground = p_settings.YAxis.titleBackground;
			if (p_settings.YAxis.spokeColor != undefined) me.g_yAxis.spokeColor = p_settings.YAxis.spokeColor;
			if (p_settings.YAxis.borderColor != undefined) me.g_yAxis.borderColor = p_settings.YAxis.borderColor;
		}
		if (p_settings.XAxis != undefined) {
			me.Alert("XAxis Received", 0);
			if (p_settings.XAxis.text != undefined) me.g_xAxis.text = p_settings.XAxis.text;
			if (p_settings.XAxis.font != undefined) me.g_xAxis.font = p_settings.XAxis.font;
			if (p_settings.XAxis.dateFormat != undefined) me.g_xAxis.dateFormat = p_settings.XAxis.dateFormat;
			if (p_settings.XAxis.background != undefined) me.g_xAxis.background = p_settings.XAxis.background;
			if (p_settings.XAxis.fontSize != undefined) me.g_xAxis.fontSize = p_settings.XAxis.fontSize;
			if (p_settings.XAxis.baseFontSize != undefined) me.g_xAxis.baseFontSize = p_settings.XAxis.baseFontSize;
			if (p_settings.XAxis.titleBackground != undefined) me.g_xAxis.titleBackground = p_settings.XAxis.titleBackground;
			if (p_settings.XAxis.spokeColor != undefined) me.g_xAxis.spokeColor = p_settings.XAxis.spokeColor;
			if (p_settings.XAxis.borderColor != undefined) me.g_xAxis.borderColor = p_settings.XAxis.borderColor;
		}
	}

	// Draw out the title & background
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
			var clickValue = e.target.getAttribute('legendValue');

			// if -1, we mean 0.
			clickValue = clickValue == -1 ? 0 : clickValue;
			background[clickValue].setAttribute('fill-opacity', '1');
		}

		// Mouse leaves
		var hoveroutFunction = function (e) {
			// Get parameters
			var clickValue = e.target.getAttribute('legendValue');
			// Ignore the chosen one
			if (me.drawSeries == clickValue) return;
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
			me.g_legend.maxY * (me.g_data.length / 8),
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

		Listener.setAttribute('legendValue', -1);
		me.Event(Listener, "click", me.LegendClick);
		me.Event(Listener, "mouseover", hoveroverFunction);
		me.Event(Listener, "mouseout", hoveroutFunction);

		// Legend Categories
		var i = 0;

		while (i < 7 && me.g_legend.names[i] != undefined && me.g_legend.names[i] != null
			&& me.g_data[i + 1] != undefined && me.g_data[i + 1] != null) {

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

			Listener.setAttribute('legendValue', (i + 1));
			me.Event(Listener,
				"click",
				me.LegendClick);
			me.Event(Listener, "mouseover", hoveroverFunction);
			me.Event(Listener, "mouseout", hoveroutFunction);

			i++;
		}

		return true
	};


	// #### User Interfaces ####


	// Load in the data. Exposed so it can be overwritten for an ajax call.
	this.LoadChartData = function () {
		// First time setup, essentially just error check
		if (p_data == null || p_data == undefined) {
			throw Error("Data object not Received");
		}
		if (p_data[0] == undefined || p_data[0][0] == undefined) {
			throw Error("Categories not Received");
		}
		if (p_data[1] == undefined || p_data[1][0] == undefined) {
			throw Error("Data not Received");
		}
		this.g_data = p_data;
	};

	// Create the chart
	this.Render = function () {
		console.group(); // Indent console
		// End timing
		if (this.DEBUG) console.time("Chart API");
		
		me.Alert("#### Rendering Chart ####", 1);
		try {
			if (this.g_canvas == null || this.g_canvas == undefined) {
				me.Alert("Unable to create chart - no parent element", 3);
			}

			// Order in which the chart is rendered:
			this.LoadChartData();
			//CheckData();
			LoadSettings();

			me.Alert("#### Drawing Chart ####", 1);

			DrawBaseAreas();
			this.BaseDrawChart();
			if (DrawLegend()) me.Alert("Legend Rendered", 0);

			me.Alert("#### Render Complete ####", 1);

			// End timing
			if (this.DEBUG) console.timeEnd("Chart API");
			console.groupEnd(); // End indentation
			return true;
		}
		catch (ex) {
			me.Alert("Stopped Rendering due to exception: " + ex.message, 4);
			me.Alert(ex.stack, 0);

			// End timing
			if (this.DEBUG) console.timeEnd("Chart API");
			console.groupEnd(); // End indentation

			if (this.g_canvas != null && this.g_canvas != undefined) {
				this.Remove(true);
				return false;
			}
		}
		return true;
	};

	// Delete the chart
	this.Remove = function (p_keepParent) {
		me.Alert("Removing Chart", 2);

		if (p_keepParent) {
			while (this.g_canvas.hasChildNodes()) {
				this.g_canvas.removeChild(this.g_canvas.lastChild);
			}
		}
		else {
			this.g_canvas.remove();
		}
	};

	// Hovertext handler
	this.HoverText = function (e) {
		// Get parameters
		var clickValue = e.target.getAttribute('clickValue');
		var X = e.clientX + 12;
		var Y = e.clientY;

		// If the hovertext already exists, remove the outdated one
		if (hovertext != null) {
			hovertext.remove();
			hovertext = null;
		}

		// Create our hovertext
		hovertext = document.createElement('div');
		// Use CSS to position it ect
		hovertext.setAttribute("style", "position: fixed; top: " + Y + "px; left: " + X + "px; border: 1px solid black; background-color: white;");
		// Set text
		hovertext.innerText = clickValue;

		document.body.appendChild(hovertext);
	};

	// Hovertext finisher
	this.EndHoverText = function (e) {
		if (hovertext != null) {
			hovertext.remove();
			hovertext = null;
		}
	};

	// Respond to outside widgets settings the legend value
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
	};

	// Legend interactablility
	this.LegendClick = function (e) {
		var clickValue = e.target.getAttribute('legendValue');

		me.drawSeries = clickValue;

		me.LoadChartData();
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
	};

	this.RefreshCorrelation = function () {
		//Placeholder for chart types that do not support correlation
		return false;
	};

	// Presents a neat data table for use by us
	this.GetFilteredData = function (p_series) {
		var categories = [];
		var isVariableXAxis = typeof (me.g_data[0][0]) == "number" || (typeof (me.g_data[0][0]) == "object");
		var isDate = (typeof (me.g_data[0][0]) == "object");
		var sortedCategories = [];
		var returningCategories = [];
		var returningData = [];

		if (isDate) {
			var dateValues = [];

			for (var i = 0; i < me.g_data[0].length; i++) {
				// Create the date object
				var d = new Date(me.g_data[0][i][0], me.g_data[0][i][1], me.g_data[0][i][2]);
				dateValues[i] = d.valueOf();

				categories[i] = d;
			}

			sortedCategories = dateValues.sort(function (a, b) { return a - b });
		} else {
			for (var i = 0; i < me.g_data[0].length; i++) {
				categories[i] = me.g_data[0][i];
			}

			sortedCategories = categories.sort(function (a, b) { return a - b });
		}

		var data = new Array();
		if (p_series == -1)
		{
			// Get the totals
			for (var i = 1; i < this.g_data.length; i++) {
				var sum = this.g_data[i].reduce(function (a, b) { return a + b });
				data.push(sum);
			}

			categories = me.g_legend.names;
			sortedCategories = me.g_legend.names;
			var isVariableXAxis = typeof (sortedCategories[0]) == "number" || (typeof (sortedCategories[0]) == "object");
			var isDate = (typeof (sortedCategories[0]) == "object");
		}
		else {
			data = me.g_data[p_series];
		}
		
		// TODO: Filtering

		// Order the data
		if (isVariableXAxis) {
			for (var i = 0; i < sortedCategories.length; i++) {
				var index = sortedCategories.indexOf(categories[i].valueOf());

				returningCategories[i] = categories[index];

				returningData[i] = data[index];
			}
		} else {
			for (var i = 0; i < categories.length; i++) {
				returningCategories[i] = categories[i];

				returningData[i] = data[i];
			}
		}
		returningCategories[0];
		return [returningCategories, returningData, isVariableXAxis, isDate]
	}
};

