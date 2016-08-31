// Parent Object

function ChartApi(p_element, p_settings, p_data) {
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

// Secondry Parent object

function SeriesChartApi(p_element, p_settings, p_data) {
	// Setup Inheritence

	this.base = ChartApi;
	this.base(p_element, p_settings, p_data);

	// Functions

	this.SizeChart = function () {
		// #### XAxis ####
		this.g_xAxis.minX = 20;
		this.g_xAxis.minY = 80;
		this.g_xAxis.maxX = 60;
		this.g_xAxis.maxY = 20;
		if (this.g_legend == undefined) {
			this.g_xAxis.maxX += 20;
		}

		// #### XAxis ####
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

		// #### Chart Font Sizes ####
		var baseFontSize = this.g_size / 100;
		if (this.g_title.fontSize == null || this.g_title.fontSize < 0) {
			this.g_title.fontSize = 5 * baseFontSize;
		}
		if (this.g_yAxis.fontSize == null || this.g_yAxis.fontSize < 0) {
			this.g_yAxis.fontSize = 4 * baseFontSize;
		}
		if (this.g_xAxis.fontSize == null || this.g_xAxis.fontSize < 0) {
			this.g_xAxis.fontSize = 4 * baseFontSize;
		}
		if (this.g_yAxis.baseFontSize == null || this.g_yAxis.baseFontSize < 0) {
			this.g_yAxis.baseFontSize = 3 * baseFontSize;
		}
		if (this.g_xAxis.baseFontSize == null || this.g_xAxis.baseFontSize < 0) {
			this.g_xAxis.baseFontSize = 3 * baseFontSize;
		}
		// #### Legend ####
		if (this.g_legend != undefined) {
			// Dimentions
			this.g_legend.minX = 80;
			this.g_legend.minY = 20;
			this.g_legend.maxX = 20;
			this.g_legend.maxY = 80;
			// Font Sizes
			if (this.g_legend.fontSize == null || this.g_legend.fontSize < 0) {
				this.g_legend.fontSize = 3 * baseFontSize;
			}
			if (this.g_legend.baseFontSize == null || this.g_legend.baseFontSize < 0) {
				this.g_legend.baseFontSize = 2 * baseFontSize;
			}
		}
	}

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

	this.DrawYAxis = function() {
		// #### YAxis ####
		// YAxis Group
		this.g_yAxis.reference = this.Group();
		// YAxis Area
		this.Rect(this.g_yAxis.reference, this.g_yAxis.minX, this.g_yAxis.minY, this.g_yAxis.maxX, this.g_yAxis.maxY, this.g_yAxis.background, "#000");
		// YAxis Alt Background
		this.Rect(this.g_yAxis.reference, this.g_yAxis.minX, this.g_yAxis.minY, this.g_yAxis.maxX / 2, this.g_yAxis.maxY, this.g_yAxis.titleBackground, "#000");
		// YAxis this.Text
		var textArea = this.TextArea(this.g_yAxis.reference, this.g_yAxis.font, this.g_yAxis.fontSize, true, this.g_yAxis.minX + (this.g_yAxis.maxX / 4), this.g_yAxis.minY + (this.g_yAxis.maxY / 2));
		this.Text(textArea,
			this.g_yAxis.minX + (this.g_yAxis.maxX / 4),
			this.g_yAxis.minY + (this.g_yAxis.maxY / 2),
			this.g_yAxis.text);
		// YAxis Spokes
		var textArea = this.TextArea(this.g_yAxis.reference, this.g_yAxis.font, this.g_yAxis.baseFontSize, false);
		var increment = (this.g_yAxis.max - this.g_yAxis.min) / (this.g_chartArea.yAxisDividers - 1);

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

	this.DrawXAxis = function() {
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
			this.g_xAxis.minY + (this.g_xAxis.maxY * (3 / 4)),
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

	this.DrawLegend = function() {
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

			var pointBorder = this.g_chartArea.pointBorder == null || this.g_chartArea.pointBorder[i] == null ? this.g_chartArea.color[i] : this.g_chartArea.pointBorder[i];

			this.Circle(this.g_legend.reference,
				this.g_legend.minX + (this.g_legend.maxX / 2),
				this.g_legend.minY + ((i + 1.2) * (this.g_legend.maxY / 8)),
				0.75,
				this.g_chartArea.color[i],
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

	// Higher level function used by the base object
	this.BaseDrawChart = function()
	{

		this.DrawYAxis();
		this.DrawXAxis();
		if (this.DrawLegend()) console.log("Legend Rendered");
		this.DrawChart();
	}
};

// Tersary interactable object

function LineChartApi(p_element, p_settings, p_data) {
	this.base = SeriesChartApi;
	this.base(p_element, p_settings, p_data);

	// Helper function for DrawChart()
	this.DrawLine = function(p_colorNB, p_data) {
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
			this.Line(this.g_chartArea.reference, x1, y1, x2, y2, this.g_chartArea.color[p_colorNB]);


			this.Circle(this.g_chartArea.reference, x1, y1, 0.75, this.g_chartArea.color[p_colorNB], pointBorder);
			if (i == p_data.length - 2) {
				var point = this.Circle(this.g_chartArea.reference, x2, y2, 0.75, this.g_chartArea.color[p_colorNB], pointBorder);
			}
		}

		return true;
	}

	this.DrawChart = function() {
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

		this.DrawLine(6, this.g_data.value7);
		this.DrawLine(5, this.g_data.value6);
		this.DrawLine(4, this.g_data.value5);
		this.DrawLine(3, this.g_data.value4);
		this.DrawLine(2, this.g_data.value3);
		this.DrawLine(1, this.g_data.value2);
		this.DrawLine(0, this.g_data.value);
	}
};