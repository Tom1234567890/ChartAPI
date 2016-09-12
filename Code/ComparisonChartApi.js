// Parent object
// This is required for all Comparison chart's

function ComparisonChartApi(p_element, p_settings, p_data) {
	// Setup Inheritence

	this.base = BaseChartApi;
	this.base(p_element, p_settings, p_data);
	var me = this;


	// Functions


	function DrawYAxis() {
		// XAxis Reference
		me.g_yAxis.reference = me.Group();
		// XAxis Area
		me.Rect(me.g_yAxis.reference, me.g_yAxis.minX, me.g_yAxis.minY, me.g_yAxis.maxX, me.g_yAxis.maxY, me.g_yAxis.background, "#000");
		// XAxis Alt Background
		me.Rect(me.g_yAxis.reference, me.g_yAxis.minX, me.g_yAxis.minY + (me.g_yAxis.maxY / 2), me.g_yAxis.maxX, me.g_yAxis.maxY / 2, me.g_yAxis.titleBackground, "#000");
		// XAxis me.Text
		var textArea = me.TextArea(me.g_yAxis.reference, me.g_yAxis.font, me.g_yAxis.fontSize, false);
		me.Text(textArea,
			me.g_yAxis.minX + (me.g_yAxis.maxX / 2),
			me.g_yAxis.minY + (me.g_yAxis.maxY * (7 / 8)),
			me.g_yAxis.text);
	}

	function DrawLegend() {
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
			var text = me.g_legend.names[i].split('\n');
			for (var i2 = 0; i2 < text.length; i2++) {
				me.Text(textArea,
				me.g_legend.minX + (me.g_legend.maxX / 2),
				me.g_legend.minY + ((i + 1.6) * (me.g_legend.maxY / 8)) + (i2 * 3),
				text[i2]);
			}

			var pointBorder = me.g_chartArea.pointBorder == null || me.g_chartArea.pointBorder[i] == null ? me.g_chartArea.color[i] : me.g_chartArea.pointBorder[i];

			me.Circle(me.g_legend.reference,
				me.g_legend.minX + (me.g_legend.maxX / 2),
				me.g_legend.minY + ((i + 1.2) * (me.g_legend.maxY / 8)),
				0.75,
				me.g_chartArea.color[i],
				pointBorder);

			me.Rect(me.g_legend.reference,
				me.g_legend.minX,
				me.g_legend.minY + ((i + 1) * (me.g_legend.maxY / 8)),
				me.g_legend.maxX,
				me.g_legend.maxY / 8,
				null,
				'#000000');

			i++;
		}
		return true
	}

	function DrawChartContainer() {
		// #### Chart Area ####
		// Chart Area Reference
		if (typeof me.g_chartArea.reference != Element) {
			me.g_chartArea.reference = me.Group();
		}
		// Chart Area Background
		me.Rect(me.g_chartArea.reference,
			me.g_chartArea.minX,
			me.g_chartArea.minY,
			me.g_chartArea.maxX,
			me.g_chartArea.maxY,
			me.g_chartArea.background,
			null);
		// Chart Area Outline
		me.Rect(me.g_chartArea.reference,
			me.g_chartArea.minX,
			me.g_chartArea.minY,
			me.g_chartArea.maxX,
			me.g_chartArea.maxY,
			null,
			"#000");
	}

	// Set's out proportions of the chart & draws areas around the chart.
	function SizeChart() {
		// #### YAxis ####
		me.g_yAxis.minX = 00;
		me.g_yAxis.minY = 80;
		me.g_yAxis.maxX = 80;
		me.g_yAxis.maxY = 20;
		if (me.g_legend == undefined) {
			me.g_yAxis.maxX += 20;
		}

		// #### Chart Area ####
		me.g_chartArea.minX = 3;
		me.g_chartArea.minY = 23;
		me.g_chartArea.maxX = 74;
		me.g_chartArea.maxY = 54;
		if (me.g_legend == undefined) {
			me.g_chartArea.maxX += 20;
		}

		// #### Chart Font Sizes ####
		var baseFontSize = me.g_size / 100;

		// #### Legend ####
		if (me.g_legend != undefined) {
			// Dimentions
			me.g_legend.minX = 80;
			me.g_legend.minY = 20;
			me.g_legend.maxX = 20;
			me.g_legend.maxY = 80;
			// Font Sizes
			if (me.g_legend.fontSize == null || me.g_legend.fontSize < 0) {
				me.g_legend.fontSize = 3 * baseFontSize;
			}
			if (me.g_legend.baseFontSize == null || me.g_legend.baseFontSize < 0) {
				me.g_legend.baseFontSize = 2 * baseFontSize;
			}
		}
	};

	// Set's out any pre-rendering processing of the data.
	function SizeData() { // #### Y Axis ####
		// Y Axis Max
		// Get the total number
		var max = 0;
		for (var i = me.g_data.length - 1; i > 0; i--) {
			max = +me.g_data[1].reduce((pv, cv) => pv + cv, 0);
		}

		if (me.g_yAxis.max == null || me.g_yAxis.max < max) {
			me.g_yAxis.max = max;
		}
	};


	// Master Functions


	// Higher level function used to draw out the chart.
	this.BaseDrawChart = function () {
		SizeChart();
		SizeData();

		DrawYAxis(); console.log("YAxis Rendered");
		if (DrawLegend()) console.log("Legend Rendered");
		DrawChartContainer(); console.log("Chart Container Rendered");

		// Function used by each child chart.
		this.DrawChart();
	};
}

// Child object
// User-Interactable object

function ProportionChartApi(p_element, p_settings, p_data) {
	// Setup Inheritence

	this.base = ComparisonChartApi;
	this.base(p_element, p_settings, p_data);
	var me = this;

	// Helper function for DrawChart()
	function DrawSeries(p_data) {
		if (p_data == undefined || p_data == null) {
			return false;
		}

		var x = me.g_chartArea.minX;
		var prevText = null;

		for (var i = 0; i < p_data.length; i++) {
			// Draw Area
			var x2 = (p_data[i] / me.g_yAxis.max) * me.g_chartArea.maxX;
			var spokeX = x + (x2 / 2);

			me.Rect(me.g_chartArea.reference,
					x,
					me.g_chartArea.minY,
					x2,
					me.g_chartArea.maxY,
					me.g_chartArea.color[i],
					"#000000");

			var textArea = me.TextArea(me.g_yAxis.reference,
				me.g_yAxis.font,
				me.g_yAxis.baseFontSize,
				true,
				spokeX + 1, // TODO: Replace 1 with somthing more sensible
				me.g_yAxis.minY + (me.g_yAxis.maxY / 4));

			// Ensure we only get 5 characters. /,/g replaces all instances of ,
			var text = ((p_data[i] / me.g_yAxis.max) * 100).toString().split('', 2).toString().replace(/,/g, '');
			text += '%';

			text = me.Text(textArea,
				spokeX + 1, // TODO: Replace 1 with somthing more sensible
				me.g_yAxis.minY + (me.g_yAxis.maxY / 4),
				text);

			x = x + x2;

			// Check for overlap
			if (prevText != null) {
				var r1 = textArea.getBoundingClientRect();
				var r2 = prevText.getBoundingClientRect();
				if (!(r2.left > r1.right ||
					r2.right < r1.left ||
					r2.top > r1.bottom ||
					r2.bottom < r1.top)) {
					// Overlap detected - remove parent
					textArea.remove();
					continue;
				}
			}

			me.Line(me.g_chartArea.reference,
				spokeX,
				me.g_chartArea.minY + me.g_chartArea.maxY - 1,
				spokeX,
				me.g_yAxis.minY + 1,
				me.g_yAxis.spokeColor);

			prevText = textArea;
		}
	};

	// Function used to plot Proportion chart's
	this.DrawChart = function () {
		DrawSeries(this.g_data[1]);
	};
}