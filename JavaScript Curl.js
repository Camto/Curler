function Init() {
	
	Curler_Code_Box = document.getElementById("Curler_Code_Box");
	compile = document.getElementById("compile");
	JavaScript_Code_Box = document.getElementById("JavaScript_Code_Box");
	
	compile.addEventListener("click", function() {
		
		JavaScript_Code_Box.value = JSON_to_Curler(Curl(Curler_Code_Box.value));
		
	});
	
}

function JSON_to_Curler(JSONed) {
	
	var code = JSON.parse(JSONed);
	
	var Compiled_Code = Compile("mini-prog", code);
	
	return Commands_Transpiled;
	
}

function Transpile(type, code) {
	
	switch(type) {
		
		case "mini-prog":
			
			break;
		
		case "function-call":
			
			break;
		
		case "number":
			
			break;
		
		case "array":
			
			break;
		
		case "array":
			
			break;
		
		case "name":
			
			break;
		
		case "sugar":
			
			break;
		
	}
	
}

Init();