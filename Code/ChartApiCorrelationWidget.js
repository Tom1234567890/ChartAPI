function ChartApiCorrelaitonWidget(p_categories) {
	var g_categories = p_categories;

	// Assume X is linear.
	// TODO: Do not assume X is linear
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


	// #### Helper Functions ####




	// #### Functions ####




	// #### User Interfaces ####

	// Get's the start and end points to draw the line of best fit.
	// Uses simplest technique, OLS
	this.GetCorrelation = function (p_data) {
		if (p_data == undefined || p_data == null) {
			return false;
		}

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

		//console.warn(meanY + "," + meanX);

		var top = 0;
		var bottom = 0;

		for (var i = 0; i < p_data.length; i++) {

			// (X - meanX) (y - meanY
			top += (i - meanX) * (p_data[i] - meanY);
			bottom += Math.pow(i - meanX, 2);
		}

		//console.warn(top + "/" + bottom);
		var M = top / bottom;
		var C = meanY - (M * meanX);
		//console.warn("y = " + M + " X + " + C);
		// Y   =  M   X     + C
		var start = (M * minX) + C;
		var end = (M * maxX) + C;
		console.warn(start + "," + end);
		return [start, end, "y = " + M + " X + " + C];
	}
}