window.onload = function() {
	var color = {
		r: 255,
		g: 255,
		b: 255,
		h: 100,
		s: 100,
		l: 100,
		string: "#ffffff"
	}

	var controller = {
		model: color,
		init: function() {
			var inputs = document.getElementsByTagName('input');
			for (var i = 0; i < inputs.length; i++) {
				inputs[i].oninput = this.update.bind(this, inputs[i]);
			}
			var r, g, b;
			var URI = document.documentURI;
			if (URI.indexOf("rgb=") > -1) {
				var start = URI.search("rgb=")+4;
				var rgb = URI.slice(start).split(",");
				r = Number(rgb[0]);
				g = Number(rgb[1]);
				b = Number(rgb[2]);
			} else {
				r = Math.floor(Math.random()*255 +1);
				g = Math.floor(Math.random()*255 +1);
				b = Math.floor(Math.random()*255 +1);
			}
			this.updateColor(this.RGBtoHSL(r,g,b));
			this.updateView();
		},
		update: function(element) {
			var i_type = element.id.substring(0,1);
			this.updateModelFromInput(element, i_type);
			this.updateView(i_type);
		},
		updateModelFromInput: function(element, i_type) {
			// update corresponding view input (either range or number)
			
			if (element.type == "range") {
				document.getElementById(i_type+"-number").value = element.value;
			} else {
				document.getElementById(i_type+"-range").value = element.value;
			}
			
			
			// update color object
			var rgbhslObject;
			if (("hsl").indexOf(i_type) > -1) {
				var h = document.getElementById("h-range").value/360;
				var s = document.getElementById("s-range").value/100;
				var l = document.getElementById("l-range").value/100;
				rgbhslObject = this.HSLtoRGB(h,s,l);
			} else {
				var r = document.getElementById("r-range").value;
				var g = document.getElementById("g-range").value;
				var b = document.getElementById("b-range").value;
				rgbhslObject = this.RGBtoHSL(r,g,b);
			}
			this.updateColor(rgbhslObject);
		},
		updateColor: function(colorObject) {
			this.model.r = colorObject.r;
			this.model.g = colorObject.g;
			this.model.b = colorObject.b;
			this.model.h = colorObject.h;
			this.model.s = colorObject.s;
			this.model.l = colorObject.l;
			this.model.string = this.rgbToHex(this.model.r, this.model.g, this.model.b);
		},
		updateView: function() {
			
			// update background 
			document.body.style.backgroundColor = this.model.string;
			document.getElementById("hexrep").innerHTML = 
			'<a href="?rgb='+this.model.r+','
			+this.model.g + ',' 
			+this.model.b 
			+'" >' +this.model.string + "</a>";
			
			document.getElementById("r-range").value = this.model.r;
			document.getElementById("r-number").value = this.model.r;
			document.getElementById("g-range").value = this.model.g;
			document.getElementById("g-number").value = this.model.g;
			document.getElementById("b-range").value = this.model.b;
			document.getElementById("b-number").value = this.model.b;

			document.getElementById("h-range").value = this.model.h;
			document.getElementById("h-number").value = this.model.h;
			document.getElementById("s-range").value = this.model.s;
			document.getElementById("s-number").value = this.model.s;
			document.getElementById("l-range").value = this.model.l;
			document.getElementById("l-number").value = this.model.l;

			
			
		},
		// These two functions are borrowed from http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
		RGBtoHSL: function(r, g, b) {
			
			r /= 255, g /= 255, b /= 255;
		    var max = Math.max(r, g, b), min = Math.min(r, g, b);
		    var h, s, l = (max + min) / 2;

		    if(max == min){
		        h = s = 0; // achromatic
		    }else{
		        var d = max - min;
		        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		        switch(max){
		            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
		            case g: h = (b - r) / d + 2; break;
		            case b: h = (r - g) / d + 4; break;
		        }
		        h /= 6;
		    }
			r *= 255;
			g *= 255;
			b *= 255;
			h = Math.floor(h*360);
			s = Math.floor(s*100);
			l = Math.floor(l*100);
			return {r: r, g: g, b: b, h: h, s: s, l: l};
		},
		HSLtoRGB: function(h,s,l) {
			
			var r, g, b;

		    if(s == 0){
		        r = g = b = l; // achromatic
		    }else{
		        function hue2rgb(p, q, t){
		            if(t < 0) t += 1;
		            if(t > 1) t -= 1;
		            if(t < 1/6) return p + (q - p) * 6 * t;
		            if(t < 1/2) return q;
		            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
		            return p;
		        }

		        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		        var p = 2 * l - q;
		        r = hue2rgb(p, q, h + 1/3);
		        g = hue2rgb(p, q, h);
		        b = hue2rgb(p, q, h - 1/3);
		    }

		    r = Math.round(r * 255);
			g = Math.round(g * 255);
			b = Math.round(b * 255);
			h = h*360;
			s = s*100;
			l = l*100;
			
			return {r: r, g: g, b: b, h: h, s: s, l: l};
		},
		rgbToHex: function(r,g,b) {
			return "#"+this.toHex(r)+this.toHex(g)+this.toHex(b); 
		},
		toHex: function(n) {
			n = parseInt(n,10);
			if (isNaN(n)) return "00";
			n = Math.max(0,Math.min(n,255));
			return "0123456789ABCDEF".charAt((n-n%16)/16)
			  + "0123456789ABCDEF".charAt(n%16);
		}
	};

	controller.init();
};
