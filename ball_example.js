Curler = {};

Curler["print"] = function(a) {console.log(a); return a;};
Curler["true"] = true;
Curler["false"] = false;

Curler["+"] = function(a, b) {return a + b;};
Curler["-"] = function(a, b) {return a - b;};
Curler["*"] = function(a, b) {return a * b;};
Curler["/"] = function(a, b) {return a / b;};

Curler["^"] = function(a, b) {return a**b;};
Curler["v"] = function(a) {return Math.sqrt(a);};

Curler["="] = function(a, b) {return a === b;}
Curler["!="] = function(a, b) {return a !== b;}
Curler["<"] = function(a, b) {return a < b;}
Curler[">"] = function(a, b) {return a > b;}
Curler["<="] = function(a, b) {return a <= b;}
Curler[">="] = function(a, b) {return a >= b;}

screen = document.createElement("canvas");
screen.width = 400;
screen.height = 400;
draw = screen.getContext("2d");
draw.textAlign = "center";
screen.style.position = "absolute";
screen.style.margin = "auto";
screen.style.top = "0px";
screen.style.left = "0px";
screen.style.bottom = "0px";
screen.style.right = "0px";
document.body.appendChild(screen);

Curler["circle"] = function(x, y, r, style) {
	
	draw.beginPath();
	
	draw.arc(x, y, r, 0, Math.PI * 2);
	
	if(style[0]) {
		
		screen.fillStyle = style[0];
		draw.fill();
		
	}
	
	if(style[1]) {
		
		screen.strokeStyle = style[1][0];
		screen.lineWidth = style[1][1];
		draw.stroke();
		
	}
	
}



Curler["ball"] = function(x, y, r) {
	this["x"] = x;
	this["y"] = y;
	this["r"] = r;
}
Curler["ball"].prototype["reset_pos"] = function() {
	this["x"] = 0;
	this["y"] = 0;
}
Curler["ball"].prototype["move"] = function(x, y) {
	this["x"] = Curler["+"](this["x"], x);
	this["y"] = Curler["+"](this["y"], y);
}
Curler["ball"].prototype["collide"] = function(ball_2) {
	var dist = Curler["v"](Curler["+"](Curler["^"](Curler["-"](this["x"], ball_2["x"]), 2), Curler["^"](Curler["-"](this["y"], ball_2["y"]), 2)));
	if(Curler[">="](Curler["+"](this["r"], ball_2["r"]), dist)) {
		return Curler["true"];
	} else {
		return Curler["false"];
	}
}
Curler["ball"].prototype["render"] = function() {
	Curler["circle"](this["x"], this["y"], this["r"], ["black", Curler["false"]]);
}
"to use this, the ball class MUST be defined";
"to use this, the ball class MUST be defined";
Curler["ball_1"] = new Curler["ball"](10, 10, 10);
Curler["ball_2"] = new Curler["ball"](15, 15, 10);
Curler["ball_3"] = new Curler["ball"](40, 12.5, 10);
Curler["ball_1"]["render"]()
Curler["ball_2"]["render"]()
Curler["ball_3"]["render"]()
Curler["print"](Curler["ball_1"]["collide"](Curler["ball_2"]));
"prints `true`";
Curler["print"](Curler["ball_1"]["collide"](Curler["ball_3"]));
"prints `false`";