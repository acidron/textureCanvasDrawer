(function ($) {
	var Config = {
		resolution: 50,
		sameDelta: 10,
		instantRender: true
	};

	$.fn.drawer = function(options) {
		if (options != undefined) {
			switch (options) {
				case 'getData':
					return this.data;
			}
		}

		/*
		 * Data
		 */
		var $this = this;
		$this.data = [];
		$this.tool = 'line';
		/*
		 * Methods
		 */
		var actions = {
			selectTool: function(tool) {
				$this.tool = tool;
			},
			render: function() {
				var c = canvas.get(0);
				var context = c.getContext('2d');
				context.fillStyle="#FFFFFF";
				context.fillRect(0, 0, c.width, c.height);
				context.fillStyle="#000000";
				c = context;
				var prevPoint = null;
				_.each($this.data, function(point) {
					context.fillRect(point.x, point.y, 5, 5);	
					if (point.type == 'line') {
						if (prevPoint !== null) {
							c.beginPath();
							c.moveTo(prevPoint.x, prevPoint.y);
							c.lineTo(point.x, point.y);
							c.stroke();
						}
					} 
					if (point.type == 'rect') {
						context.strokeRect(point.x, point.y, prevPoint.x - point.x, prevPoint.y - point.y);
					}
					prevPoint = point;
				});
				
			},
			drawPoint: function(e, type) {
				var point = {x: e.offsetX, y: e.offsetY, type: type};

				var lastSaved = _.last($this.data);
				if (lastSaved != undefined) {
					if ((Math.abs(point.x - lastSaved.x) < Config.sameDelta) && (Math.abs(point.y - lastSaved.y) < Config.sameDelta)) {
						return null;
					}
				}
				$this.data.push(point);

				if (Config.instantRender) {
					var c = canvas.get(0).getContext('2d');
					c.fillRect(e.offsetX, e.offsetY, 5, 5);	
				}
				return point;
			},
			trackMouseMoving: function(e) {
				if ($this.tool == 'rect') return;
				var prevPoint = _.last($this.data);
				if (prevPoint.type == 'point') prevPoint.type = 'startline';
				if (actions.drawPoint(e, 'line') !== null) {
					var c = canvas.get(0).getContext('2d');
					c.beginPath();
					c.moveTo(prevPoint.x, prevPoint.y);
					c.lineTo(e.offsetX, e.offsetY);
					c.stroke();
					isDrawing = true;
				}
			},
			trackMouseEndMoving: function(e) {
				canvas.off('mousemove', actions.trackMouseMovingThrottled);
				var prevPoint = _.last($this.data);
				var point = actions.drawPoint(e, isDrawing ? 'line' : 'point');
				isDrawing = false;

				if ($this.tool == 'rect') {
					point.type = 'rect';
					actions.render();
				}
			}
		};

		actions.trackMouseMovingThrottled = _.throttle(actions.trackMouseMoving, Config.resolution);

		var canvas = $('<canvas>');

		var isDrawing = false;
		canvas.on('mousedown', function(e) {
			actions.drawPoint(e, 'point');
			canvas.on('mousemove', actions.trackMouseMovingThrottled);
		});
		canvas.on('mouseup', actions.trackMouseEndMoving);

		canvas.prop({
			width: this.width(),
			height: this.height()
		});
		var toolbar = $('<div>');
		toolbar.css({
			position: 'absolute',
			top: '-20px',
			right: 0
		});
		toolbar.append($('<button>Line</button>').click(function() {actions.selectTool('line');}));
		toolbar.append($('<button>Rect</button>').click(function() {actions.selectTool('rect');}));
		toolbar.append($('<button>Render</button>').click(actions.render));
		this.html('').css({position: 'relative'}).append(toolbar).append(canvas);

		return this;
	};
})(jQuery);