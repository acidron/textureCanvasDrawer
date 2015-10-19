(function ($) {
	var Config = {
		resolution: 50
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
				var c = canvas.get(0).getContext('2d');
				c.fillRect(e.offsetX, e.offsetY, 5, 5);
				$this.data.push({x: e.offsetX, y: e.offsetY});
			},
			trackMouseMoving: function(e) {
				var prevPoint = _.last($this.data);
				actions.drawPoint(e);
				var c = canvas.get(0).getContext('2d');
				c.beginPath();
				c.moveTo(prevPoint.x, prevPoint.y);
				c.lineTo(e.offsetX, e.offsetY);
				c.stroke();
				isDrawing = true;
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