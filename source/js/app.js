(function ($) {
	$.fn.drawer = function(options) {
		if (options != undefined) {
			switch (options) {
				case 'getData':
					return this.data;
			}
		}
		var $this = this;
		$this.data = [];

		var canvas = $('<canvas>');
		canvas.click(function(e) {
			var c = canvas.get(0).getContext('2d');
			c.fillRect(e.offsetX, e.offsetY, 5, 5);
			$this.data.push({x: e.offsetX, y: e.offsetY});
		});

		canvas.prop({
			width: this.width(),
			height: this.height()
		});
		this.html('').append(canvas);

		return this;
	};
})(jQuery);