// Parent object
// This is required for all Comparison chart's

function ComparisonChartApi(p_element, p_settings, p_data) {
	// Setup Inheritence

	this.base = BaseChartApi;
	this.base(p_element, p_settings, p_data);

	// Drawing Functions

	this.DrawYAxis = function () {
		// XAxis Reference
		this.g_yAxis.reference = this.Group();
		// XAxis Area
		this.Rect(this.g_yAxis.reference, this.g_yAxis.minX, this.g_yAxis.minY, this.g_yAxis.maxX, this.g_yAxis.maxY, this.g_yAxis.background, "#000");
		// XAxis Alt Background
		this.Rect(this.g_yAxis.reference, this.g_yAxis.minX, this.g_yAxis.minY + (this.g_yAxis.maxY / 2), this.g_yAxis.maxX, this.g_yAxis.maxY / 2, this.g_yAxis.titleBackground, "#000");
		// XAxis this.Text
		var textArea = this.TextArea(this.g_yAxis.reference, this.g_yAxis.font, this.g_yAxis.fontSize, false);
		this.Text(textArea,
			this.g_yAxis.minX + (this.g_yAxis.maxX / 2),
			this.g_yAxis.minY + (this.g_yAxis.maxY * (7 / 8)),
			this.g_yAxis.text);
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

	this.DrawChartContainer = function () {
		// #### Chart Area ####
		// Chart Area Reference
		if (typeof this.g_chartArea.reference != Element) {
			this.g_chartArea.reference = this.Group();
		}
		// Chart Area Background
		this.Rect(this.g_chartArea.reference,
			this.g_chartArea.minX,
			this.g_chartArea.minY,
			this.g_chartArea.maxX,
			this.g_chartArea.maxY,
			this.g_chartArea.background,
			null);
		// Chart Area Outline
		this.Rect(this.g_chartArea.reference,
			this.g_chartArea.minX,
			this.g_chartArea.minY,
			this.g_chartArea.maxX,
			this.g_chartArea.maxY,
			null,
			"#000");
	}

	// Master Functions

	// Set's out proportions of the chart & draws areas around the chart.
	this.SizeChart = function () {
		// #### YAxis ####
		this.g_yAxis.minX = 00;
		this.g_yAxis.minY = 80;
		this.g_yAxis.maxX = 80;
		this.g_yAxis.maxY = 20;
		if (this.g_legend == undefined) {
			this.g_yAxis.maxX += 20;
		}

		// #### Chart Area ####
		this.g_chartArea.minX = 3;
		this.g_chartArea.minY = 23;
		this.g_chartArea.maxX = 74;
		this.g_chartArea.maxY = 54;
		if (this.g_legend == undefined) {
			this.g_chartArea.maxX += 20;
		}

		// #### Chart Font Sizes ####
		var baseFontSize = this.g_size / 100;

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
	};

	// Set's out any pre-rendering processing of the data.
	this.SizeData = function () { // #### Y Axis ####
		// Y Axis Max
		// Get the total number

		// Value
		var max = this.g_data.value.reduce((pv, cv) => pv + cv, 0);
		// Value2
		if (this.g_data.value2 != undefined && this.g_data.value2 != null) {
			max = +this.g_data.value2.reduce((pv, cv) => pv + cv, 0);
		}
		// Value3
		if (this.g_data.value3 != undefined && this.g_data.value3 != null) {
			max = +this.g_data.value3.reduce((pv, cv) => pv + cv, 0);
		}
		// Value4
		if (this.g_data.value4 != undefined && this.g_data.value4 != null) {
			max = +this.g_data.value4.reduce((pv, cv) => pv + cv, 0);
		}
		// Value5
		if (this.g_data.value5 != undefined && this.g_data.value5 != null) {
			max = +this.g_data.value5.reduce((pv, cv) => pv + cv, 0);
		}
		// Value6
		if (this.g_data.value6 != undefined && this.g_data.value6 != null) {
			max = +this.g_data.value6.reduce((pv, cv) => pv + cv, 0);
		}
		// Value7
		if (this.g_data.value7 != undefined && this.g_data.value7 != null) {
			max = +this.g_data.value7.reduce((pv, cv) => pv + cv, 0);
		}

		if (this.g_yAxis.max == null || this.g_yAxis.max < max) {
			this.g_yAxis.max = max;
		}
	};

	// Higher level function used to draw out the chart.
	// Essentially a shell to interact with all of the Drawing functions
	this.BaseDrawChart = function () {
		this.DrawYAxis();
		this.DrawLegend();
		this.DrawChartContainer();
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

	// Helper function for DrawChart()
	this.DrawPoint = function (p_colorNB, p_data) {
		if (p_data == undefined || p_data == null) {
			return false
		}

		var x = this.g_chartArea.minX;
		var prevText = null;
		for (var i = 0; i < p_data.length; i++) {
			// Draw Area
			var x2 = (p_data[i] / this.g_yAxis.max) * this.g_chartArea.maxX;
			this.Rect(this.g_chartArea.reference,
					x,
					this.g_chartArea.minY,
					x2,
					this.g_chartArea.maxY,
					this.g_chartArea.color[i],
					"#000000");

			// YAxis Spokes

			var spokeX = x + (x2 / 2);

			var textArea = this.TextArea(this.g_yAxis.reference,
				this.g_yAxis.font,
				this.g_yAxis.baseFontSize,
				true,
				spokeX + 1, // TODO: Replace 1 with somthing more sensible
				this.g_yAxis.minY + (this.g_yAxis.maxY / 4));

			// Ensure we only get 5 characters. /,/g replaces all instances of ,
			var text = p_data[i].toString().split('', 5).toString().replace(/,/g, '');

			text = this.Text(textArea,
				spokeX + 1, // TODO: Replace 1 with somthing more sensible
				this.g_yAxis.minY + (this.g_yAxis.maxY / 4),
				text);

			var x = x + x2;

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
			this.Line(this.g_chartArea.reference,
				spokeX,
				this.g_chartArea.minY + this.g_chartArea.maxY - 1,
				spokeX,
				this.g_yAxis.minY + 1,
				this.g_yAxis.spokeColor);

			prevText = textArea;
		}
	};

	// Function used to plot Proportion chart's
	this.DrawChart = function () {
		this.DrawPoint(6, this.g_data.value7);
		this.DrawPoint(5, this.g_data.value6);
		this.DrawPoint(4, this.g_data.value5);
		this.DrawPoint(3, this.g_data.value4);
		this.DrawPoint(2, this.g_data.value3);
		this.DrawPoint(1, this.g_data.value2);
		this.DrawPoint(0, this.g_data.value);
	};
}