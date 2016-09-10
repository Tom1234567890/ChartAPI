function ChartApiWidget(p_element) {
	// Initialisation

	// Global Variables with Defaults
	this.g_canvas;
	this.g_size;
	this.g_data;
	var g_sizeX = 500;
	var g_sizeY = 500;
	var g_strokeWidth = "1px";
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

	this.DottedLine = function (p_parent, p_x1, p_y1, p_x2, p_y2, p_lineColor) {
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
		line.setAttribute('stroke-dasharray', "10,5");
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

	// #### User Interfaces ####


	this.Render = function () {
		throw Error("Rendering not implemented for this widget.");
	}

	this.Remove = function (p_keepParent) {
		throw Error("Rendering not implemented for this widget.");
	}
}