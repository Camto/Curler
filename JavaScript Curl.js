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
					
					if(data[1][count][0] != "sugar") {
						
						var ender = ";";
						
					} else {
						
						var ender = "";
						
					}
					
					commands += (tabs + compile(data[1][count]) + ender);
					
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
			
			switch(data[1]) {
				
				case "set":
					
					var tabs = "";
					for(var count = 1; count < indentation; count++) {
						
						tabs += "\t";
						
					}
					
					if(data[3][0] != "mini-prog") {
						
						var value = compile(data[3]);
						
					} else {
						
						var value = "(function() {\n" + compile(data[3]) + "\n" + tabs + "})()";
						
					}
					
					return compile(data[2]) + " = " + value + ";";
				
				case "local":
					
					var tabs = "";
					for(var count = 1; count < indentation; count++) {
						
						tabs += "\t";
						
					}
					
					if(data[3][0] != "mini-prog") {
						
						var value = compile(data[3]);
						
					} else {
						
						var value = "(function() {\n" + compile(data[3]) + "\n" + tabs + "})()";
						
					}
					
					return "var " + data[2][1] + " = " + value + ";";
				
				case "g_local":
					
					return data[2][1];
				
				case "class":
					
					var name = compile(data[2]);
					
					var methods = "";
					for(var count = 0; count < data[4].length; count++) {
						
						methods += ("\n" + name + compile(data[4][count]));
						
					}
					
					return name + " = " + compile(data[3]) + methods;
				
				case "arg":
					
					return data[2][1];
				
				case "constructor":
					
					var constructor_arguments = "";
					for(var count = 0; count < data[2].length; count++) {
						
						constructor_arguments += data[2][count][1];
						
						if(count < (data[2].length - 1)) {
							
							constructor_arguments += ", ";
							
						}
						
					}
					
					return "function(" + constructor_arguments + ") {\n" + compile(data[3]) + "\n}";
				
				case "method":
					
					var method_arguments = "";
					for(var count = 0; count < data[3].length; count++) {
						
						method_arguments += data[3][count][1];
						
						if(count < (data[3].length - 1)) {
							
							method_arguments += ", ";
							
						}
						
					}
					
					return '.prototype["' + data[2][1] + '"] = function(' + method_arguments + ") {\n" + compile(data[4]) + "\n}";
				
				case "call":
					
					var tabs = "";
					for(var count = 1; count < indentation; count++) {
						
						tabs += "\t";
						
					}
					
					var call_arguments = "";
					for(var count = 0; count < data[4].length; count++) {
						
						if(data[4][count][0] != "mini-prog") {
							
							call_arguments += compile(data[4][count]);
							
						} else {
							
							call_arguments += "(function() {\n" + compile(data[4][count]) + "\n" + tabs + "})()";
							
						}
						
						if(count < (data[4].length - 1)) {
							
							call_arguments += ", ";
							
						}
						
					}
					
					return compile(data[2]) + '["' + data[3][1] + '"](' + call_arguments + ");";
				
				case "obj":
					
					var tabs = "";
					for(var count = 1; count < indentation; count++) {
						
						tabs += "\t";
						
					}
					
					var obj_arguments = "";
					for(var count = 0; count < data[3].length; count++) {
						
						if(data[3][count][0] != "mini-prog") {
							
							obj_arguments += compile(data[3][count]);
							
						} else {
							
							obj_arguments += "(function() {\n" + compile(data[3][count]) + "\n" + tabs + "})()";
							
						}
						
						if(count < (data[3].length - 1)) {
							
							obj_arguments += ", ";
							
						}
						
					}
					
					return "new " + compile(data[2]) + "(" + obj_arguments + ");";
				
				case "prop":
					
					var tabs = "";
					for(var count = 1; count < indentation; count++) {
						
						tabs += "\t";
						
					}
					
					if(data[3][0] != "mini-prog") {
						
						var value = compile(data[3]);
						
					} else {
						
						var value = "(function() {\n" + compile(data[3]) + "\n" + tabs + "})()";
						
					}
					
					return 'this["' + data[2][1] + '"] = ' + value + ";";
				
				case "g_prop":
					
					return 'this["' + data[2][1] + '"]';
				
				case "f_prop":
					
					return compile(data[2]) + '["' + data[3][1] + '"]';
				
				case "fun":
					
					var fun_arguments = "";
					for(var count = 0; count < data[2].length; count++) {
						
						fun_arguments += data[2][count][1];
						
						if(count < (data[2].length - 1)) {
							
							fun_arguments += ", ";
							
						}
						
					}
					
					return "function(" + fun_arguments + ") {" + compile(data[3]) + "}";
				
				/*case "if":
					
					return;*/
				
			}
		
	}
	
}

Init();