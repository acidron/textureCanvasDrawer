(function ($) {
	var Config = {
		resolution: 50,
		sameDelta: 10
	};

	$.fn.drawer = function(options) {
		if (options != undefined) {
			switch (options) {
				case 'getData':
					return this.data;
			}
		}

		var actions = {
			drawPoint: function(e) {
				var point = {x: e.offsetX, y: e.offsetY};

				var lastSaved = _.last($this.data);
				if (lastSaved != undefined) {
					if ((Math.abs(point.x - lastSaved.x) < Config.sameDelta) && (Math.abs(point.y - lastSaved.y) < Config.sameDelta)) {
						return null;
					}
				}

				var c = canvas.get(0).getContext('2d');
				c.fillRect(e.offsetX, e.offsetY, 5, 5);
				$this.data.push(point);
				return point;
			},
			trackMouseMoving: function(e) {
				var prevPoint = _.last($this.data);
				if (actions.drawPoint(e) !== null) {
					var c = canvas.get(0).getContext('2d');
					c.beginPath();
					c.moveTo(prevPoint.x, prevPoint.y);
					c.lineTo(e.offsetX, e.offsetY);
					c.stroke();
					isDrawing = true;
				}
			}
		};

		actions.trackMouseMovingThrottled = _.throttle(actions.trackMouseMoving, Config.resolution);

		var $this = this;
		$this.data = [];

		var canvas = $('<canvas>');

		var isDrawing = false;
		canvas.on('mousedown', function(e) {
			actions.drawPoint(e);
			canvas.on('mousemove', actions.trackMouseMovingThrottled);
		});
		canvas.on('mouseup', function(e) {
			canvas.off('mousemove', actions.trackMouseMovingThrottled);
			actions.drawPoint(e);
			isDrawing = false;
		});

		canvas.prop({
			width: this.width(),
			height: this.height()
		});
		this.html('').append(canvas);

		return this;
	};
})(jQuery);