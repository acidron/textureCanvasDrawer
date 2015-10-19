(function () {
	$.fn.drawer = function() {
		var canvas = $('<canvas>');
		canvas.click(function(e) {
			var c = canvas.get(0).getContext('2d');
			c.fillRect(e.offsetX, e.offsetY, 5, 5);
		});

		canvas.prop({
			width: this.width(),
			height: this.height()
		});
		this.html('').append(canvas);
	};
})();