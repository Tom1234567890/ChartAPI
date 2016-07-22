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
	try
	{
		if (p_element.tagName.toLowerCase() == "canvas")
		{
			// Client has created the correct element
			g_canvas = p_element;
			// set default Width & Height
			g_sizeX = g_canvas.width;
			g_sizeY = g_canvas.height;
		}
		else
		{
			// Generate the element as a child
			var g_canvas = document.createElement("canvas");
			if (g_canvas == undefined)
			{
				throw Error("Unable to generate canvas element");
			}
			var g_canvas = p_element.appendChild(g_canvas);
		}
		// Get the context
		var g_context = g_canvas.getContext("2d");
	}
	catch (ex) {
		console.log("Error Creating Chart Object: " + ex);
		return;
	}
	// Input Objects
	var g_title =
		{
			text: "",
			font: "TimesNewRoman",
			background: "#FFFFFF",
			fontSize: 0,
			y: "0px"
		}
	var g_chartArea =
		{
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
		else
		{
			// TODO: Ajax?
		}
	}

	function LoadSettings()
	{
		if (p_settings.Title != undefined)
		{
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
		if (p_settings.Legend != undefined)
		{
			console.log("ChartArea Received");
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
		// #### Chart ####
		// Chart Border
		g_sizeX -= Math.floor(g_sizeX / 100);
		g_sizeY -= Math.floor(g_sizeX / 100);
		g_size = g_sizeX >= g_sizeY ? g_sizeY : g_sizeX;
		g_canvas.style.border = 'black ' + Math.ceil(g_size / 200) + 'px solid';
		// Chart Canvas
		g_canvas.width = g_sizeX;
		g_canvas.height = g_sizeY;
		// Margin Between elements
		g_margin = Math.floor(g_sizeX / 100);

		// #### Title ####
		// Title Y // Add 0.5 for correct aliasing.
		g_title.y = Math.floor(g_sizeY / 7) + 0.5;
		// Title Font Size
		g_title.fontSize = Math.floor(g_size / 13) + "px";

		// #### Chart Area #### 
		// Chart Area Dimensions - Add 0.5 for correct aliasing.
		g_chartArea.minX = Math.floor(g_sizeX / 6) + 0.5;
		g_chartArea.minY = Math.floor(g_sizeY / 6) + 0.5;
		g_chartArea.maxX = Math.floor(2 * g_sizeX / 3); // 2/3 of the canvas
		g_chartArea.maxY = Math.floor(2 * g_sizeY / 3);

		// #### Legend ####
		if (g_legend != undefined) {
			// Legend Dimensions
			g_legend.minX = (g_chartArea.minX + g_chartArea.maxX) + g_margin;
			g_legend.minY = g_chartArea.minY; // Same as Chart Area
			g_legend.maxX = 0.5 + g_sizeX - (g_margin + g_legend.minX); // Distance between the edge & the start point
			g_legend.maxY = g_chartArea.maxY;
		}
		else {
			// Adjust spacing to take up where it would be drawn
			g_chartArea.maxX = 0.5 + g_sizeX - (g_margin + g_chartArea.minX); // Distance between the edge & the start point
		}

		// #### XAxis ####
		// XAxis Font Size
		g_xAxis.fontSize = Math.floor(g_size / 30) + "px";
		// XAxis Dimensions
		g_xAxis.minX = g_chartArea.minX; // Same as Chart Area
		g_xAxis.minY = g_chartArea.minY + g_chartArea.maxY + g_margin; // From bottom of the Chart
		g_xAxis.maxX = g_chartArea.maxX; // Same as Chart Area
		g_xAxis.maxY = 0.5 + g_sizeY - (g_margin + g_xAxis.minY); // Distance between the edge & the start point
	}

	function DrawChartAreas() {
		// Canvas Background Color
		if (g_chartArea.canvasBackground != "Transparent")
		{
			g_context.fillStyle = g_chartArea.canvasBackground;
			g_context.fillRect(0, 0, g_sizeX, g_sizeY);
		}

		// ##### Title ####
		// Title Background
		if (g_title.background != "Transparent")
		{
			g_context.fillStyle = g_title.background;
			g_context.fillRect(0, 0, g_sizeX, g_title.y);
		}
		// Title Font
		g_context.moveTo(0, 0);
		g_context.fillStyle = "black";
		g_context.font = g_title.fontSize + ' ' + g_title.font;
		g_context.textAlign = "center";
		g_context.fillText(g_title.text, g_sizeX / 2, g_title.y / 2);

		// #### Chart ####
		// Chart Area
		if (g_chartArea.background != "Transparent")
		{
			g_context.fillStyle = g_chartArea.background;
			g_context.fillRect(g_chartArea.minX, g_chartArea.minY, g_chartArea.maxX, g_chartArea.maxY);
		}

		// #### XAxis ####
		// XAxis Area
		g_context.fillStyle = g_xAxis.background;
		g_context.fillRect(g_xAxis.minX, g_xAxis.minY, g_xAxis.maxX, g_xAxis.maxY);
		if (g_xAxis.titleBackground != null) {
			g_context.fillStyle = g_xAxis.titleBackground;
			g_context.fillRect(g_xAxis.minX, g_xAxis.minY, g_xAxis.maxX, g_xAxis.maxY / 2);
		}

		// #### Legend ####
		if (g_legend != undefined) {
			// Legend Area
			g_context.fillStyle = g_legend.background;
			g_context.fillRect(g_legend.minX, g_legend.minY, g_legend.maxX, g_legend.maxY);
			if (g_legend.titleBackground != null) {
				g_context.fillStyle = g_legend.titleBackground;
				g_context.fillRect(g_legend.minX, g_legend.minY, g_legend.maxX, g_legend.maxY / 10);
			}
		}
	}

	function DrawChartLines() {
		// ##### Title ####
		// Title Underline
		g_context.moveTo(0, g_title.y);
		g_context.lineTo(g_sizeX, g_title.y);
		g_context.stroke();

		// #### Chart ####
		// Chart Outline
		g_context.rect(g_chartArea.minX, g_chartArea.minY, g_chartArea.maxX, g_chartArea.maxY);
		g_context.stroke();

		// #### XAxis ####
		// XAxis Outline
		g_context.rect(g_xAxis.minX, g_xAxis.minY, g_xAxis.maxX, g_xAxis.maxY);
		g_context.stroke();
		// XAxis Divider
		g_context.moveTo(g_xAxis.minX, g_xAxis.minY + Math.floor(g_xAxis.maxY / 2));
		g_context.lineTo(g_xAxis.minX + g_xAxis.maxX, g_xAxis.minY + Math.floor(g_xAxis.maxY / 2));
		g_context.stroke();

		// #### Legend ####
		if (g_legend != undefined) {
			// Legend Outline
			g_context.rect(g_legend.minX, g_legend.minY, g_legend.maxX, g_legend.maxY);
			g_context.stroke();
			// Legend Divider
			g_context.moveTo(g_legend.minX, g_legend.minY + Math.floor(g_legend.maxY / 10));
			g_context.lineTo(g_legend.minX + g_legend.maxX, g_legend.minY + Math.floor(g_legend.maxY / 10));
			g_context.stroke();
		}
	}

	function SetupYAxis()
	{
		// Workings variables
		var truncationValue ;
		var yAxisValues = {};
		// #### YAxis ####
		// YAxis Font Size
		g_yAxis.fontSize = Math.floor(g_size / 30) + "px";
		// YAxis Dimensions
		g_yAxis.minX = g_margin + 0.5;
		g_yAxis.minY = g_chartArea.minY; // Same as Chart Area
		g_yAxis.maxX = g_chartArea.minX - (g_margin + g_yAxis.minX); // Distance between Chart Area's & start point
		g_yAxis.maxY = g_chartArea.maxY; // Same as Chart Area
		// YAxis Upper & Lower values
		g_upperLimit = g_lowerLimit = g_data.value[0]; // Reset to somthing we know is within the range.
		
		for (var i = 0; i < g_data.value.length; i++)
		{
			if (g_lowerLimit > g_data.value[i])
			{
				g_lowerLimit = g_data.value[i];
			}
			if (g_upperLimit < g_data.value[i])
			{
				g_upperLimit = g_data.value[i];
			}
		}
		// YAxis Difference
		// YValue value difference between values
		var yDividerDifference = (g_upperLimit - g_lowerLimit) / g_chartArea.yAxisDividers;
		// YAxis Values
		for (var i = 0; i <= g_chartArea.yAxisDividers; i++)
		{
			yAxisValues[i] = g_upperLimit - (i * yDividerDifference);
		}
		// YAxis Truncation
		if (g_chartArea.truncation != undefined && g_chartArea.truncation > 0)
		{
			// Trunciate based on the lower limit.
			truncationValue = g_lowerLimit.toString().split("").length - g_chartArea.truncation;
			// Get the value as a power of 10.
			truncationValue = Math.pow(10, truncationValue);

			for (var i = 0; i < g_chartArea.yAxisDividers; i++) {
				yAxisValues[i] = Math.ceil(yAxisValues[i] / truncationValue) * truncationValue;
			}

			g_lowerLimit = Math.floor(g_lowerLimit / truncationValue) * truncationValue;
			g_upperLimit = Math.ceil(g_upperLimit / truncationValue) * truncationValue;
		}
	}

	function DrawYAxis()
	{
		// #### YAxis ####
		// YAxis Area
		g_context.fillStyle = g_yAxis.background;
		g_context.fillRect(g_yAxis.minX, g_yAxis.minY, g_yAxis.maxX, g_yAxis.maxY);
		if (g_yAxis.titleBackground != null) {
			g_context.fillStyle = g_yAxis.titleBackground;
			g_context.fillRect(g_yAxis.minX, g_yAxis.minY, g_yAxis.maxX / 2, g_yAxis.maxY);
		}
		// YAxis Value Area
		for (i = 0; i <= g_chartArea.yAxisDividers; i++) {
			// Value Area
			g_context.fillStyle = "#ff9900";
			g_context.fillRect(g_yAxis.minX + (g_yAxis.maxX / 2), g_yAxis.minY, g_yAxis.maxX / 2, (g_yAxis.maxY / g_chartArea.yAxisDividers) * i);
			// Value Underline
			g_context.moveTo(g_yAxis.minX + (g_yAxis.maxX / 2), g_yAxis.minY + ((g_yAxis.maxY / g_chartArea.yAxisDividers) * i));
			g_context.lineTo(g_yAxis.minX + g_yAxis.maxX, g_yAxis.minY + ((g_yAxis.maxY / g_chartArea.yAxisDividers) * i));
			g_context.stroke();
		}
		// YAxis Outline
		g_context.rect(g_yAxis.minX, g_yAxis.minY, g_yAxis.maxX, g_yAxis.maxY);
		g_context.stroke();
		// YAxis Vertical Divider
		g_context.moveTo(g_yAxis.minX + (g_yAxis.maxX / 2), g_yAxis.minY);
		g_context.lineTo(g_yAxis.minX + (g_yAxis.maxX / 2), g_yAxis.minY + g_yAxis.maxY);
		g_context.stroke();
	}

	function DrawXAxis()
	{

	}

	function DrawData()
	{
		for(var i = 0; i < p_data.length; i++)
		{

		}
	}

	// Public Functions
	this.Render = function () {
		console.log("Rendering Chart");
		try
		{
			// Order in which the chart is rendered:
			LoadChartData();
			LoadSettings();
			SizeChart();
			SetupYAxis();
			DrawChartAreas();
			DrawChartLines();
			DrawYAxis();
			DrawXAxis();
			DrawData();
			console.log("Render Complete");
			return true;
		}
		catch(ex)
		{
			console.log("Stopped Rendering due to exception:")
			console.log(ex);
			if (g_canvas != null && g_canvas != undefined)
			{
				console.log("Removing Canvas");
				g_canvas.remove;
			}
			if (g_context != null && g_context != undefined)
			{
				g_context.remove;
			}
			return false;
		}
		finally
		{
			this.remove;
		}
	}
}