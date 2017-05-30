function Init() {
	
	Curler_Code_Box = document.getElementById("Curler_Code_Box");
	Compile = document.getElementById("Compile");
	JavaScript_Code_Box = document.getElementById("JavaScript_Code_Box");
	
	Compile.addEventListener("click", function() {
		
		JavaScript_Code_Box.value = JSON_to_Curler(Curl(Curler_Code_Box.value));
		
	});
	
}

function JSON_to_Curler(JSONed) {
	
	var code = JSON.parse(JSONed);
	indentation = 0;
	
	return compile(code);
	
}

function compile(data) {
	
	switch(data[0]) {
		
		case "mini-prog":
			
			indentation++;
			var tabs = "";
			for(var count = 1; count < indentation; count++) {
				
				tabs += "\t";
				
			}
			
			var commands = "";
			for(count = 0; count < data[1].length; count++) {
				
				if(data[1][count][0] != "mini-prog") {
					
					commands += (tabs + compile(data[1][count]) + ";");
					
				} else {
					
					commands += ("(function() {\n" + compile(data[1][count]) + "\n" + tabs + "})();");
					
				}
				
				if(count < (data[1].length - 1)) {
					
					commands += "\n";
					
				}
				
			}
			
			indentation--;
			
			return commands;
		
		case "function-call":
			
			var tabs = "";
			for(var count = 1; count < indentation; count++) {
				
				tabs += "\t";
				
			}
			
			var args = "";
			for(var count = 0; count < data[2].length; count++) {
				
				if(data[2][count][0] != "mini-prog") {
					
					args += compile(data[2][count]);
					
				} else {
					
					args += "(function() {\n" + compile(data[2][count]) + "\n" + tabs + "})()";
					
				}
				
				if(count < (data[2].length - 1)) {
					
					args += ", ";
					
				}
				
			}
			
			return compile(data[1]) + "(" + args + ")";
		
		case "number":
			
			return data[1];
		
		case "string":
			
			return '"' + data[1] + '"';
		
		case "array":
			
			var tabs = "";
			for(var count = 1; count < indentation; count++) {
				
				tabs += "\t";
				
			}
			
			var array = [];
			
			for(var count = 0; count < data[1].length; count++) {
				
				if(data[1][count][0] != "mini-prog") {
					
					array += compile(data[1][count]);
					
				} else {
					
					array += "(function() {\n" + compile(data[1][count]) + "\n" + tabs + "})()";
					
				}
				
				if(count < (data[1].length - 1)) {
					
					array += ", ";
					
				}
				
			}
			
			return "[" + array + "]";
		
		case "name":
			
			return 'Curler["' + data[1] + '"]';
		
		case "sugar":
			
			break;
		
	}
	
}

Init();