function SeriesChartApi(p_element, p_settings, p_data) {

	// Global Variables with Defaults
	var g_sizeX = 500;
	var g_sizeY = 500;
	var g_size = null;
	var g_margin = null;
	var g_data = null;
	var g_lowerLimit = null;
	var g_upperLimit = null;
	var g_strokeWidth = "2px";//"0.25%";

	// Create Global Elements
	var g_canvas;
	try {
		if (p_element.tagName.toLowerCase() == "svg") {
			// Client has created the correct element
			g_canvas = p_element;
			// Get Width & Height
			g_sizeY = g_canvas.height;
			g_sizeX = g_canvas.width;
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
	}
	catch (ex) {
		// Error Silently
		console.log("Error Creating Chart Object: " + ex);
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
			fontSize: 0,
			minX: 0,
			minY: 0,
			maxX: 0,
			maxY: 0
		}
	var g_chartArea =
		{
			reference: null,
			canvasBackground: "#FFFFFF",
			background: "#FFFFFF",
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
			fontSize: 0,
			font: "TimesNewRoman",
			background: "#FFFFFF",
			titleBackground: null,
			spacing: 0,
			minX: 0,
			minY: 0,
			maxX: 0,
			maxY: 0
		}
	var g_xAxis =
		{
			reference: null,
			fontSize: 0,
			font: "TimesNewRoman",
			background: "#FFFFFF",
			titleBackground: null,
			spokeColor: "#000000",
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

	function Rect(parent, p_minX, p_minY, p_maxX, p_maxY, p_background, p_lineColor) {
		if (p_background == "Transparent") p_background = null;
		if (p_lineColor == "Transparent") p_background = null;
		if (p_lineColor == null && p_background == null) return;
		if (parent == null || parent == undefined) {
			parent = g_canvas;
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
		parent.appendChild(rect);
		// Return a reference of the element.
		return rect;
	}

	function Line(parent, p_x1, p_y1, p_x2, p_y2, p_lineColor) {
		if (p_lineColor == "Transparent") p_background = null;
		if (p_lineColor == null) return;
		if (parent == null || parent == undefined) {
			parent = g_canvas;
		}

		var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		line.setAttribute('x1', p_x1 + '%');
		line.setAttribute('y1', p_y1 + '%');
		line.setAttribute('x2', p_x2 + '%');
		line.setAttribute('y2', p_y2 + '%');
		line.setAttribute('stroke-width', g_strokeWidth);
		line.setAttribute('stroke', p_lineColor);
		parent.appendChild(line);
	}


	// #### High level functions ####


	function LoadChartData() {
		if (g_data == null) {
			// First time setup, essentially just error check
			if (p_data == null || p_data == undefined || p_data.Value == undefined || p_data.Category == undefined) {
				throw DataError("Data object not Received");
			}
			if (p_data.Value[0] == undefined) {
				throw DataError("Data not Received");
			}
			if (p_data.Category[0] == undefined) {
				throw DataError("Categories not Received");
			}
			if (p_data.Category[p_data.Value.length] == null
				|| p_data.Category[p_data.Value.length] == undefined)
			{
				throw DataError("Not every data point has a category");
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
		g_chartArea.minX = 25;
		g_chartArea.minY = 25;
		g_chartArea.maxX = 50;
		g_chartArea.maxY = 50;
		if (g_legend == undefined) {
			g_chartArea.maxX += 20;
		}

		// #### YAxis ####
		g_yAxis.minX = 0;
		g_yAxis.minY = 20;
		g_yAxis.maxX = 20;
		g_yAxis.maxY = 60;
	}

	function SizeData()
	{
		// #### X Axis ####
		// Spacing
		g_xAxis.spacing = g_chartArea.maxX / g_data.value.length;
		// #### Y Axis ####
		// Spacing
		g_yAxis.spacing = g_chartArea.maxY / (g_chartArea.yAxisDividers - 1);
	}

	function DrawChartAreas() {
		// General Setup
		// Currently used for the background & Title.
		// NOT for anything that could potentially need refreshing.
		// #### Background ####
		Rect(g_canvas, 0, 0, 100, 100, g_chartArea.canvasBackground, "#000");
		// #### Title ####
		Rect(g_canvas, 0, 0, 100, 20, g_title.background, "#000");
	}

	function DrawYAxis() {
		// #### YAxis ####
		// YAxis Group
		g_yAxis.reference = Group();
		// YAxis Area
		Rect(g_yAxis.reference, g_yAxis.minX, g_yAxis.minY, g_yAxis.maxX, g_yAxis.maxY, g_yAxis.background, "#000");
		// YAxis Alt Background
		Rect(g_yAxis.reference, g_yAxis.minX, g_yAxis.minY, g_yAxis.maxX / 2, g_yAxis.maxY, g_yAxis.titleBackground, "#000");
		// YAxis Spokes
		for (var i = 0; i < g_chartArea.yAxisDividers; i++) {
			var y = Math.floor(g_chartArea.minY + (i * g_yAxis.spacing));
			Line(g_yAxis.reference, g_yAxis.minX + g_yAxis.maxX - 1, y, g_chartArea.minX, y, g_xAxis.spokeColor);
		}
	}

	function DrawXAxis() {
		// XAxis Reference
		g_xAxis.reference = Group();
		// XAxis Area
		Rect(g_xAxis.reference, g_xAxis.minX, g_xAxis.minY, g_xAxis.maxX, g_xAxis.maxY, g_xAxis.background, "#000");
		// XAxis Alt Background
		Rect(g_xAxis.reference, g_xAxis.minX, g_xAxis.minY, g_xAxis.maxX, g_xAxis.maxY / 2, g_xAxis.titleBackground, "#000");
		// XAxis Spokes
		for (var i = 0; i <= g_data.value.length; i++) {
			var x = Math.floor(g_chartArea.minX + (i * g_xAxis.spacing));
			Line(g_xAxis.reference, x, g_chartArea.minY + g_chartArea.maxY, x, g_xAxis.minY + 1, g_xAxis.spokeColor);
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
		g_chartArea.reference = Group();
		// Chart Area Background
		Rect(g_chartArea.reference, g_chartArea.minX, g_chartArea.minY, g_chartArea.maxX, g_chartArea.maxY, g_chartArea.background, "#000");
		// 

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