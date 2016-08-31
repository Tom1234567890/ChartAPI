function LineChartApi(p_element, p_settings, p_data) {

	// Global Variables with Defaults
	var g_sizeX = 500;
	var g_sizeY = 500;
	var g_size = null;
	var g_margin = null;
	var g_data = null;
	var g_lowerLimit = null;
	var g_upperLimit = null;
	var g_strokeWidth = "2px";
	var g_fontSuffix = "pt";

	// Create Global Elements
	var g_canvas;
	try {
		if (p_element.tagName.toLowerCase() == "svg") {
			// Client has created the correct element
			g_canvas = p_element;
			// Get Width & Height
			var rect = g_canvas.getBoundingClientRect(); // get the bounding rectangle
			g_sizeY = rect.height;
			g_sizeX = rect.width;
		}
		else {
			// Generate the element as a child
			g_canvas = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			if (g_canvas == undefined || g_canvas == null) {
				throw Error("Unable to generate canvas element");
			}
			// Set Height
			g_canvas.setAttributeNS(null, "viewBox", "0 0 " + g_sizeX + " " + g_sizeY);
			g_canvas.setAttributeNS(null, "width", g_sizeX);
			g_canvas.setAttributeNS(null, "height", g_sizeY);
			// Add to document
			p_element.appendChild(g_canvas);
		}
		g_size = g_sizeX < g_sizeY ? g_sizeX : g_sizeY;
	}
	catch (ex) {
		// Error Silently
		console.log("Error Creating Chart Object: " + ex.message);
		return;
	}


	// #### Input Objects ####


	var g_title =
		{
			// This reference is for the text directly, unlike the other references for the parent element.
			reference: null,
			text: "",
			font: "TimesNewRoman",
			background: "#FFFFFF",
			fontSize: null,
			minX: 0,
			minY: 0,
			maxX: 0,
			maxY: 0
		}
	var g_chartArea =
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
	var g_yAxis =
		{
			reference: null,
			text: "",
			fontSize: null,
			baseFontSize: null,
			font: "TimesNewRoman",
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
	var g_xAxis =
		{
			reference: null,
			text: "",
			fontSize: null,
			baseFontSize: null,
			font: "TimesNewRoman",
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
	var g_logo;
	var g_legend;


	// #### Helper Functions ####


	function Group() {
		var group = document.createElementNS("http://www.w3.org/2000/svg", "g");

		return g_canvas.appendChild(group);
	}

	function Rect(p_parent, p_minX, p_minY, p_maxX, p_maxY, p_background, p_lineColor) {
		if (p_background == "Transparent") p_background = null;
		if (p_lineColor == "Transparent") p_background = null;
		if (p_lineColor == null && p_background == null) return;
		if (p_parent == null || p_parent == undefined) {
			p_parent = g_canvas;
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

	function Line(p_parent, p_x1, p_y1, p_x2, p_y2, p_lineColor) {
		if (p_lineColor == "Transparent") p_background = null;
		if (p_lineColor == null) return;
		if (p_parent == null || p_parent == undefined) {
			p_parent = g_canvas;
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

	function TextArea(p_parent, p_font, p_fontSize, p_isVertical, p_x, p_y) {
		if (p_font == null || p_font == undefined) {
			p_font = 'Times New Roman';
		}

		if (p_parent == null || p_parent == undefined) {
			p_parent = g_canvas;
		}

		var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
		text.setAttribute('fill', "#000");
		text.setAttribute('font', p_font);
		text.setAttribute('font-size', p_fontSize + g_fontSuffix);

		if (p_isVertical) {
			text.setAttribute('transform', "rotate(270)");
			text.setAttribute('style', 'transform-origin: ' + p_x + '% ' + p_y + '%')
		}
		return p_parent.appendChild(text);
	}

	function Text(p_parent, p_x, p_y, p_message) {
		if (p_parent == null || p_parent == undefined) {
			p_parent = g_canvas;
		}

		var text = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
		text.setAttribute('x', p_x + '%');
		text.setAttribute('y', p_y + '%');
		text.setAttribute('text-anchor', 'middle');
		text.setAttribute('style', 'pointer-events: none;')

		text.innerHTML = p_message;
		return p_parent.appendChild(text);
	}

	function Circle (p_parent, p_x, p_y, p_radius, p_background, p_lineColor)
	{
		if (p_parent == null || p_parent == undefined) {
			p_parent = g_canvas;
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
		circle.setAttribute('title', '444')

		return p_parent.appendChild(circle);
	}

	/*
	function Truncate(p_value) {
		var truncation = g_chartArea.truncation;

		if (truncation == null) {
			return p_value
		}

		// Bring to just above 0
		var diff = 0;
		while (p_value <= Math.pow(10, truncation)) {
			p_value *= 10;
			diff++;
		}
		while (p_value >= Math.pow(10, truncation + 1)) {
			p_value /= 10;
			diff--;
		}

		// Remove excess digits
		p_value = Math.round(p_value);

		if (!p_isNumeral && diff != 0) {
			// Get to nearest set of three
			while (diff % 3 != 0) {
				if (diff > 0) {
					p_value /= 10;
					diff--;
				} else {
					p_value *= 10;
					diff++;
				}
			}
			switch (diff / 3) {
				case 1:
					p_value += 'K';
					break;
				case 2:
					p_value += 'M';
					break;
				default:
					// Get to 0
					while (diff != 0) {
						if (diff > 0) {
							p_value /= 10;
							diff--;
						} else {
							p_value *= 10;
							diff++;
						}
					}
			}
		}

		return p_value;
	}

	function TruncateAxis(p_value, p_isTop) {
		// Bring to just below 0
		var diff = 0;

		while (p_value < 1) {
			p_value *= 10;
			diff++;
		}
		while (p_value > 1) {
			p_value /= 10;
			diff--;
		}

		if (p_isTop) {
			p_value = Math.ceil(p_value);
		}
		else {
			p_value = Math.floor(p_value);
		}

		while (diff < 0) {
			p_value *= 10;
			diff++;
		}
		while (diff > 0) {
			p_value /= 10;
			diff--;
		}

		return p_value;
	}

	*/

	// #### High level functions ####


	function LoadChartData() {
		if (g_data == null) {
			// First time setup, essentially just error check
			if (p_data == null || p_data == undefined || p_data.Value == undefined || p_data.Category == undefined) {
				throw "Data object not Received";
			}
			if (p_data.Value[0] == undefined) {
				throw "Data not Received";
			}
			if (p_data.Category[0] == undefined) {
				throw "Categories not Received";
			}
			g_data =
				{
					value: p_data.Value,
					category: p_data.Category
				}
		}
		else {
			// TODO: Ajax?
		}
	}

	// Load in details from the input object
	function LoadSettings() {
		console.log("Receiving Settings:");
		if (p_settings.Title != undefined) {
			console.log("Title Received");
			if (p_settings.Title.text != undefined) g_title.text = p_settings.Title.text;
			if (p_settings.Title.font != undefined) g_title.font = p_settings.Title.font;
			if (p_settings.Title.background != undefined) g_title.background = p_settings.Title.background;
		} 
		if (p_settings.ChartArea != undefined) {
			console.log("ChartArea Received");
			if (p_settings.ChartArea.canvasBackground != undefined) g_chartArea.canvasBackground = p_settings.ChartArea.canvasBackground;
			if (p_settings.ChartArea.background != undefined) g_chartArea.background = p_settings.ChartArea.background;
			if (p_settings.ChartArea.color != undefined) g_chartArea.color = p_settings.ChartArea.color;
			if (p_settings.ChartArea.pointBorder != undefined) g_chartArea.pointBorder = p_settings.ChartArea.pointBorder;
			if (p_settings.ChartArea.altBackground != undefined) g_chartArea.altBackground = p_settings.ChartArea.altBackground;
			if (p_settings.ChartArea.yAxisDividers != undefined) g_chartArea.yAxisDividers = p_settings.ChartArea.yAxisDividers;
			if (p_settings.ChartArea.truncation != undefined) g_chartArea.truncation = p_settings.ChartArea.truncation;
		}
		if (p_settings.Legend != undefined) {
			console.log("Legend Received");
			g_legend =
				{
					font: p_settings.Legend.font != undefined ? p_settings.Legend.font : "TimesNewRoman",
					background: p_settings.Legend.background != undefined ? p_settings.Legend.background : "#FFFFFF",
					titleBackground: p_settings.Legend.titleBackground != undefined ? p_settings.Legend.titleBackground : null,
					fontSize: 0,
					minX: 0,
					minY: 0,
					maxX: 0,
					maxY: 0
				}
		}
		if (p_settings.YAxis != undefined) {
			console.log("YAxis Received");
			if (p_settings.YAxis.text != undefined) g_yAxis.text = p_settings.YAxis.text;
			if (p_settings.YAxis.font != undefined) g_yAxis.font = p_settings.YAxis.font;
			if (p_settings.YAxis.min != undefined) g_yAxis.min = p_settings.YAxis.min;
			if (p_settings.YAxis.max != undefined) g_yAxis.max = p_settings.YAxis.max;
			if (p_settings.YAxis.background != undefined) g_yAxis.background = p_settings.YAxis.background;
			if (p_settings.YAxis.fontSize != undefined) g_yAxis.fontSize = p_settings.YAxis.fontSize;
			if (p_settings.YAxis.baseFontSize != undefined) g_yAxis.baseFontSize = p_settings.YAxis.baseFontSize;
			if (p_settings.YAxis.titleBackground != undefined) g_yAxis.titleBackground = p_settings.YAxis.titleBackground;
			if (p_settings.YAxis.spokeColor != undefined) g_yAxis.spokeColor = p_settings.YAxis.spokeColor;
		}
		if (p_settings.XAxis != undefined) {
			console.log("XAXis Received");
			if (p_settings.XAxis.text != undefined) g_xAxis.text = p_settings.XAxis.text;
			if (p_settings.XAxis.font != undefined) g_xAxis.font = p_settings.XAxis.font;
			if (p_settings.XAxis.background != undefined) g_xAxis.background = p_settings.XAxis.background;
			if (p_settings.XAxis.fontSize != undefined) g_xAxis.fontSize = p_settings.XAxis.fontSize;
			if (p_settings.XAxis.baseFontSize != undefined) g_xAxis.baseFontSize = p_settings.XAxis.baseFontSize;
			if (p_settings.XAxis.titleBackground != undefined) g_xAxis.titleBackground = p_settings.XAxis.titleBackground;
			if (p_settings.XAxis.spokeColor != undefined) g_xAxis.spokeColor = p_settings.XAxis.spokeColor;
		}
	}

	function SizeChart() {
		// #### XAxis ####
		g_xAxis.minX = 20;
		g_xAxis.minY = 80;
		g_xAxis.maxX = 60;
		g_xAxis.maxY = 20;
		if (g_legend == undefined) {
			g_xAxis.maxX += 20;
		}

		// #### XAxis ####
		g_chartArea.minX = 23;
		g_chartArea.minY = 23;
		g_chartArea.maxX = 54;
		g_chartArea.maxY = 54;
		if (g_legend == undefined) {
			g_chartArea.maxX += 20;
		}

		// #### YAxis ####
		g_yAxis.minX = 0;
		g_yAxis.minY = 20;
		g_yAxis.maxX = 20;
		g_yAxis.maxY = 60;

		// #### Chart Font Sizes ####
		var baseFontSize = g_size / 100;
		if (g_title.fontSize == null || g_title.fontSize < 0) {
			g_title.fontSize = 5 * baseFontSize;
		}
		if (g_yAxis.fontSize == null || g_yAxis.fontSize < 0) {
			g_yAxis.fontSize = 4 * baseFontSize;
		}
		if (g_xAxis.fontSize == null || g_xAxis.fontSize < 0) {
			g_xAxis.fontSize = 4 * baseFontSize;
		}
		if (g_yAxis.baseFontSize == null || g_yAxis.baseFontSize < 0) {
			g_yAxis.baseFontSize = 3 * baseFontSize;
		}
		if (g_xAxis.baseFontSize == null || g_xAxis.baseFontSize < 0) {
			g_xAxis.baseFontSize = 3 * baseFontSize;
		}
	}

	function SizeData() {
		// #### Y Axis ####
		// Y Axis Min & Max
		var max = Math.max.apply(null, g_data.value);
		var min = Math.min.apply(null, g_data.value);
		if (g_yAxis.max == null || g_yAxis.max < max) {
			g_yAxis.max = max;
		}
		if (g_yAxis.min == null || g_yAxis.min > min) {
			g_yAxis.min = min;
		}
		// Truncate
		g_yAxis.max = g_yAxis.max; //TruncateAxis(g_yAxis.max, true);
		g_yAxis.min = g_yAxis.min; //TruncateAxis(g_yAxis.min, false);
	}

	function DrawChartAreas() {
		// General Setup
		// Currently used for the Background & Title.
		// #### Background ####
		Rect(g_canvas, 0, 0, 100, 100, g_chartArea.canvasBackground, "#000");
		// #### Title ####
		Rect(g_canvas, 0, 0, 100, 20, g_title.background, "#000");
		// Title Text
		var textArea = TextArea(null, g_title.font, g_title.fontSize, false);
		g_chartArea.reference = Text(textArea, 50, 10, g_title.text)
	}

	function DrawYAxis() {
		// #### YAxis ####
		// YAxis Group
		g_yAxis.reference = Group();
		// YAxis Area
		Rect(g_yAxis.reference, g_yAxis.minX, g_yAxis.minY, g_yAxis.maxX, g_yAxis.maxY, g_yAxis.background, "#000");
		// YAxis Alt Background
		Rect(g_yAxis.reference, g_yAxis.minX, g_yAxis.minY, g_yAxis.maxX / 2, g_yAxis.maxY, g_yAxis.titleBackground, "#000");
		// YAxis Text
		var textArea = TextArea(g_yAxis.reference, g_yAxis.font, g_yAxis.fontSize, true, g_yAxis.minX + (g_yAxis.maxX / 4), g_yAxis.minY + (g_yAxis.maxY / 2));
		Text(textArea,
			g_yAxis.minX + (g_yAxis.maxX / 4),
			g_yAxis.minY + (g_yAxis.maxY / 2),
			g_yAxis.text);
		// YAxis Spokes
		var textArea = TextArea(g_yAxis.reference, g_yAxis.font, g_yAxis.baseFontSize, false);
		var increment = (g_yAxis.max - g_yAxis.min) / (g_chartArea.yAxisDividers - 1);

		for (var i = 0; i < (g_chartArea.yAxisDividers) ; i++) {
			var nextY = 1 - (i * increment) / (g_yAxis.max - g_yAxis.min);
			var y = (nextY * g_chartArea.maxY) + g_chartArea.minY;

			// Ensure we only get 5 characters. /,/g replaces all instances of ,
			var text = ((i * increment) + g_yAxis.min).toString().split('', 5).toString().replace(/,/g, '');

			Text(textArea,
				g_yAxis.minX + (g_yAxis.maxX * (3 / 4)),
				y + 1, // TODO: Replace 1 with somthing more sensible
				text);
		}
	}

	function DrawXAxis() {
		// XAxis Reference
		g_xAxis.reference = Group();
		// XAxis Area
		Rect(g_xAxis.reference, g_xAxis.minX, g_xAxis.minY, g_xAxis.maxX, g_xAxis.maxY, g_xAxis.background, "#000");
		// XAxis Alt Background
		Rect(g_xAxis.reference, g_xAxis.minX, g_xAxis.minY + (g_xAxis.maxY / 2), g_xAxis.maxX, g_xAxis.maxY / 2, g_xAxis.titleBackground, "#000");
		// YAxis Text
		var textArea = TextArea(g_xAxis.reference, g_xAxis.font, g_xAxis.fontSize, false);
		// Reverse X & Y when using vertical text, and use negative Y
		Text(textArea,
			g_xAxis.minX + (g_xAxis.maxX / 2),
			g_xAxis.minY + (g_xAxis.maxY * (3 / 4)),
			g_xAxis.text);

		// XAxis Spokes
		var increment = g_chartArea.maxX / (g_data.value.length - 1);
		for (var i = 0; i < g_data.value.length; i++) {
			var x = g_chartArea.minX + (i * increment);

			var textArea = TextArea(g_xAxis.reference,
				g_xAxis.font,
				g_xAxis.baseFontSize,
				true,
				x + 1, // TODO: Replace 1 with somthing more sensible
				g_xAxis.minY + (g_xAxis.maxY / 4));

			Text(textArea,
				x + 1, // TODO: Replace 1 with half the font size
				g_xAxis.minY + (g_xAxis.maxY / 4),
				g_data.category[i]);
		}
	}

	function DrawLegend() {
		// #### Legend ####
		if (g_legend == undefined) return false;
		// Legend Reference
		g_legend.reference = Group();
		// Legend Area
		Rect(g_legend.reference, 80, 20, 20, 80, g_legend.background, "#000");
		// Legend Alt Background
		Rect(g_legend.reference, 80, 20, 20, 10, g_legend.titleBackground, "#000");
		return true
	}

	function DrawChart() {
		// #### Chart Area ####
		// Chart Area Reference
		if (typeof g_chartArea.reference != Element) {
			g_chartArea.reference = Group();
		}
		// Chart Area Background
		Rect(g_chartArea.reference, g_chartArea.minX, g_chartArea.minY, g_chartArea.maxX, g_chartArea.maxY, g_chartArea.background, null);
		// Chart Area Dividers
		// (Both use same code as on their respective axis.)
		// XAxis Spokes
		var increment = g_chartArea.maxX / (g_data.value.length - 1);
		for (var i = 0; i < g_data.value.length; i++) {
			var x = g_chartArea.minX + (i * increment);

			var color = g_xAxis.spokeColor;
			if (i == 0 || i == g_data.value.length - 1)
			{
				color = "#000000";
			}

			Line(g_chartArea.reference,
				x,
				g_chartArea.minY,
				x,
				g_xAxis.minY + 1,
				color);
		}
		// YAxis Spokes
		var increment = (g_yAxis.max - g_yAxis.min) / (g_chartArea.yAxisDividers - 1);

		for (var i = 0; i < (g_chartArea.yAxisDividers) ; i++) {
			var nextY = 1 - (i * increment) / (g_yAxis.max - g_yAxis.min);
			var y = (nextY * g_chartArea.maxY) + g_chartArea.minY;

			var color = g_yAxis.spokeColor;
			if (i == 0 || i == g_chartArea.yAxisDividers - 1)
			{
				color = "#000000";
			}

			Line(g_chartArea.reference,
				g_yAxis.minX + g_yAxis.maxX - 1,
				y,
				g_chartArea.minX + g_chartArea.maxX,
				y,
				color);
		}

		// Chart Area Outline
		Rect(g_chartArea.reference, g_chartArea.minX, g_chartArea.minY, g_chartArea.maxX, g_chartArea.maxY, null, "#000");

		// Points in Graph
		var nextY = 1 - ((g_data.value[0] - g_yAxis.min) / (g_yAxis.max - g_yAxis.min));
		var incrementX = g_chartArea.maxX / (g_data.value.length - 1);
		var pointBorder = g_chartArea.pointBorder == null || g_chartArea.pointBorder[0] == null ? g_chartArea.color[0] : g_chartArea.pointBorder[0];

		for (var i = 0; i < (g_data.value.length - 1) ; i++) {
			var x1 = g_chartArea.minX + (i * incrementX);
			var x2 = g_chartArea.minX + ((i + 1) * incrementX);
			var y1 = (nextY * g_chartArea.maxY) + g_chartArea.minY;
			nextY = 1 - ((g_data.value[i + 1] - g_yAxis.min) / (g_yAxis.max - g_yAxis.min));

			var y2 = (nextY * g_chartArea.maxY) + g_chartArea.minY;
			Line(g_chartArea.reference, x1, y1, x2, y2, g_chartArea.color[0]);


			Circle(g_chartArea.reference, x1, y1, 0.75, g_chartArea.color[0], pointBorder);
			if (i == g_data.value.length - 2)
			{
				var point = Circle(g_chartArea.reference, x2, y2, 0.75, g_chartArea.color[0], pointBorder);
			}
		}
	}

	// #### Public Functions ####

	this.Render = function () {
		console.log("#### Rendering Chart ####");
		try {
			if (g_canvas == null || g_canvas == undefined) {
				console.log("Unable to create chart - no parent element");
			}

			// Order in which the chart is rendered:
			LoadChartData();
			LoadSettings();
			SizeChart();
			SizeData();

			console.log("#### Drawing Chart ####");

			DrawChartAreas();
			DrawYAxis();
			DrawXAxis();
			if (DrawLegend()) console.log("Legend Rendered");
			DrawChart();

			console.log("#### Render Complete ####");

			return true;
		}
		catch (ex) {
			console.log("Stopped Rendering due to exception:")
			console.log(ex.message);

			if (g_canvas != null && g_canvas != undefined) {
				console.log("Removing Canvas");
				this.Remove(true);
				return false;
			}
		}
	}

	this.Remove = function (p_keepParent) {
		console.log("Removing Chart");

		if (p_keepParent) {
			while (g_canvas.hasChildNodes()) {
				g_canvas.removeChild(g_canvas.lastChild);
			}
		}
		else {
			g_canvas.remove();
		}
	}
}
