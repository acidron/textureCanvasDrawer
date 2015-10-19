(function () {
	$.fn.drawer = function() {
		var data = [];
		var canvas = $('<canvas>');
		canvas.click(function(e) {
			var c = canvas.get(0).getContext('2d');
			c.fillRect(e.offsetX, e.offsetY, 5, 5);
			data.push({x: e.offsetX, y: e.offsetY});
		});

		canvas.prop({
			width: this.width(),
			height: this.height()
		});
		this.html('').append(canvas);
	};
})();