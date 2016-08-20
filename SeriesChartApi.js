function ChartApi(p_element, p_settings, p_data) {

	// Global Variables with Defaults
	var g_sizeX = 500;
	var g_sizeY = 500;
	var g_size = null;
	var g_margin = null;
	var g_data = null;
	var g_lowerLimit = null;
	var g_upperLimit = null;

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
			truncation: null,
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
			minX: 0,
			minY: 0,
			maxX: 0,
			maxY: 0
		}
	// Optional Input
	var g_logo;
	var g_legend;


	// #### Helper Functions ####

	function Rect(p_minX, p_minY, p_maxX, p_maxY, p_background, p_lineColor) {
		if (p_background == "Transparent") p_background = null;
		if (p_lineColor == "Transparent") p_background = null;
		if (p_lineColor == null && p_background == null) return;

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
			rect.setAttribute('stroke-width', '0.25%');
			rect.setAttribute('stroke', p_lineColor);
		}
		// Return a reference of the element.
		return g_canvas.appendChild(rect);
	}

	function Line(p_x1, p_y1, p_x2, p_y2, p_lineColor) {
		if (p_lineColor == "Transparent") p_background = null;
		if (p_lineColor == null) return;

		var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		line.setAttribute('x1', p_x1 + '%');
		line.setAttribute('y1', p_y1 + '%');
		line.setAttribute('x2', p_x2 + '%');
		line.setAttribute('y2', p_y2 + '%');
		line.setAttribute('stroke-width', '0.25%');
		line.setAttribute('stroke', p_lineColor);
		g_canvas.appendChild(line);
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
			if (p_settings.ChartArea.yAxisDividers != undefined) g_chartArea.yAxisDividers = p_settings.ChartArea.yAxisDividers + 1;
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

	function SizeChart()
	{
		// #### XAxis ####
		g_xAxis.minX = 20;
		g_xAxis.minY = 80;
		g_xAxis.maxX = 60;
		g_xAxis.maxY = 20;
		if (g_legend == undefined)
		{
			g_xAxis.maxX += 20;
		}
	}

	function DrawChartAreas() {
		// General Setup
		// Currently used for the background & Title.
		// NOT for anything that could potentially need refreshing.
		// #### Background ####
		Rect(0, 0, 100, 100, g_chartArea.canvasBackground, "#000");
		// #### Title ####
		Rect(0, 0, 100, 20, g_title.background, "#000");
	}

	function DrawYAxis() {
		// #### YAxis ####
		// YAxis Area
		g_yAxis =
            Rect(0, 20, 20, 60, g_yAxis.background, "#000");
		// YAxis Alt Background
		Rect(0, 20, 10, 60, g_yAxis.titleBackground, "#000");
	}

	function DrawXAxis() {
		// XAxis Area
		g_xAxis =
            Rect(g_xAxis.minX, g_xAxis.minY, g_xAxis.maxX, g_xAxis.maxY, g_xAxis.background, "#000");
		// XAxis Alt Background
		Rect(g_xAxis.minX, g_xAxis.minY, g_xAxis.maxX, g_xAxis.maxY / 2, g_xAxis.titleBackground, "#000");
	}

	function DrawLegend() {
		// #### Legend ####
		if (g_legend == undefined) return false;
		// Legend Area
		g_legend.reference =
            Rect(80, 20, 20, 80, g_legend.background, "#000");
		// Legend Alt Background
		Rect(80, 20, 20, 10, g_legend.titleBackground, "#000");
		return true
	}

	function DrawChart() {
		// Chart Area
		g_chartArea =
            Rect(minX, minY, maxX, maxY, g_chartArea.background, "#000");
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
			//SizeChart();
			console.log("#### Drawing Chart ####");
			SizeChart();
			DrawChartAreas();
			DrawYAxis();
			DrawXAxis();
			if (DrawLegend()) console.log("Legend Rendered");
			console.log("#### Render Complete ####");
			return true;
		}
		catch (ex) {
			console.log("Stopped Rendering due to exception:")
			console.log(ex);
			if (g_canvas != null && g_canvas != undefined) {
				console.log("Removing Canvas");
				this.Remove(true);
			}
		}
		finally {
			this.Remove;
			return false;
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