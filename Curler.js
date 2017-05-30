function Curl(program) {
	
	prog = "(" + program + ")";
	prog_c = 0;
	
	return JSON.stringify(expect("mini-prog"), null, 4); // Uses JSON as an intermediary between this and the actual compiler.
	
}

function expect(type, extra) { // When you expect some data to come up.
	
	switch(type) {
		
		case "value": // If you expect anything, just find out what's coming next to see what to expect.
			
			switch(prog[prog_c]) {
				
				case "(":
					
					return expect("mini-prog");
				
				case "{":
					
					return expect("function-call");
				
				case "0":
				case "1":
				case "2":
				case "3":
				case "4":
				case "5":
				case "6":
				case "7":
				case "8":
				case "9":
				case "-":
					
					return expect("number");
				
				case '"':
					
					return expect("string");
				
				case "[":
					
					return expect("array");
				
				default:
					
					return expect("name");
				
			}
			
			break;
		
		case "mini-prog": // 'mini-prog' is a block of code.
			
			prog_c++;
			skip();
			
			var values = [];
			
			while(prog[prog_c] != ")") {
				
				values.push(expect("value"));
				
			}
			
			prog_c++;
			skip();
			
			return ["mini-prog", values];
		
		case "function-call": // 'function-call' can be just calling a function that you made or a standard library function...
			
			prog_c++;
			skip();
			
			var function_name = expect("name");
			
			switch(function_name[1]) { // ...or it could be syntactic 'sugar' in deguise!
				
				case "set":
				case "local":
				case "g_local":
				case "class":
				case "arg":
				case "obj":
				case "call":
				case "prop":
				case "g_prop":
				case "f_prop":
				case "fun":
				case "if":
				case "loop":
				case "give":
					
					return expect("sugar", function_name[1]);
				
				default:
					
					break;
				
			}
			
			var args = [];
			
			while(prog[prog_c] != "}") {
				
				args.push(expect("value"));
				
			}
			
			prog_c++;
			skip();
			
			return ["function-call", function_name, args];
		
		case "number": // A 'number' is what it sounds like: any positive or negative number, it can also have decimals.
			
			var number = "";
			if(prog[prog_c] == "-") {
				
				var neg = true;
				prog_c++;
				
			} else {
				
				var neg = false;
				
			}
			
			while(/[\d\.]/.test(prog[prog_c])) {
				
				number += prog[prog_c];
				prog_c++;
				
			}
			
			if(neg) {
				
				number *= -1;
				
			}
			
			skip();
			
			return ["number", number];
		
		case "string":
			
			prog_c++;
			
			var string = "";
			
			while(prog[prog_c] != '"') {
				
				if(prog[prog_c] != "\\") {
					
					string += prog[prog_c];
					
				} else {
					
					prog_c++;
					
					switch(prog[prog_c]) {
						
						case '"':
							
							string += '"';
							
							break;
						
						case "\\":
							
							string += "\\";
							
							break;
						
						case "n":
							
							string += "\n";
							
							break;
						
						case "t":
							
							string += "\t";
							
							break;
						
					}
					
				}
				
				prog_c++;
				
			}
			
			prog_c++;
			skip();
			
			return ["string", string];
		
		case "array": // An 'array' is just a list.
			
			var array = [];
			
			prog_c++;
			skip();
			
			while(prog[prog_c] != "]") {
				
				array.push(expect("value"));
				
			}
			
			prog_c++;
			skip();
			
			return ["array", array];
		
		case "name": // 'name's are used for naming stuff, say variables.
			
			var name = "";
			
			while(!/[\s\{\}\(\)\[\]"]/.test(prog[prog_c])) {
				
				name += prog[prog_c];
				prog_c++;
				
			}
			
			skip();
			
			return ["name", name];
		
		case "sugar": // Syntactic 'sugar' are exceptions to normal syntax, to "sweeten" the code.
			
			switch(extra) {
				
				case "set":
					
					var name = expect("name");
					var data = expect("value");
					
					prog_c++;
					skip();
					
					return ["sugar", "set", name, data];
				
				case "local":
					
					var name = expect("name");
					var data = expect("value");
					
					prog_c++;
					skip();
					
					return ["sugar", "local", name, data];
				
				case "g_local":
					
					var name = expect("name");
					
					prog_c++;
					skip();
					
					return ["sugar", "g_local", name];
				
				case "class":
					
					var name = expect("name");
					
					var class_constructor = expect("sugar", "constructor");
					
					methods = [];
					
					while(prog[prog_c] != "}") {
						
						methods.push(expect("sugar", "method"));
						
					}
					
					prog_c++;
					skip();
					
					return ["sugar", "class", name, class_constructor, methods];
				
				case "arg":
					
					var arg = expect("name");
					
					prog_c++;
					skip();
					
					return ["sugar", "arg", arg];
				
				case "constructor":
					
					prog_c++;
					skip();
					
					var constructor_arguments = [];
					
					while(prog[prog_c] != "}") {
						
						constructor_arguments.push(expect("value"));
						
					}
					
					var definition = constructor_arguments.pop();
					
					prog_c++;
					skip();
					
					return ["sugar", "constructor", constructor_arguments, definition];
				
				case "method":
					
					prog_c++;
					skip();
					
					var name = expect("name");
					
					method_arguments = [];
					
					while(prog[prog_c] != "}") {
						
						method_arguments.push(expect("value"));
						
					}
					
					var definition = method_arguments.pop();
					
					prog_c++;
					skip();
					
					return ["sugar", "method", name, method_arguments, definition];
				
				case "call":
					
					var name = expect("name");
					
					var method = expect("name");
					
					var call_arguments = [];
					
					while(prog[prog_c] != "}") {
						
						call_arguments.push(expect("value"));
						
					}
					
					prog_c++;
					skip();
					
					return ["sugar", "call", name, method, call_arguments];
				
				case "obj":
					
					var object = expect("name");
					
					var obj_arguments = [];
					
					while(prog[prog_c] != "}") {
						
						obj_arguments.push(expect("value"));
						
					}
					
					prog_c++;
					skip();
					
					return ["sugar", "obj", object, obj_arguments];
				
				case "prop":
					
					var property = expect("name");
					
					var data = expect("value");
					
					prog_c++;
					skip();
					
					return ["sugar", "prop", property, data];
				
				case "g_prop":
					
					var property = expect("name");
					
					prog_c++;
					skip();
					
					return ["sugar", "g_prop", property];
				
				case "f_prop":
					
					var name = expect("value");
					
					var property = expect("name");
					
					prog_c++;
					skip();
					
					return ["sugar", "f_prop", name, property];
				
				case "fun":
					
					var fun_arguments = [];
					
					while(prog[prog_c] != "}") {
						
						fun_arguments.push(expect("value"));
						
					}
					
					var definition = fun_arguments.pop();
					
					prog_c++;
					skip();
					
					return ["sugar", "fun", fun_arguments, definition];
				
				case "if":
					
					var condition = expect("value");
					var if_code = expect("mini-prog");
					var else_code = expect("mini-prog");
					
					prog_c++;
					skip();
					
					return ["sugar", "if", condition, if_code, else_code];
				
				case "loop":
					
					var condition = expect("value");
					var looped_block = expect("mini-prog");
					
					prog_c++;
					skip();
					
					return ["sugar", "loop", condition, looped_block];
				
				case "give":
					
					var value = expect("value");
					
					prog_c++;
					skip();
					
					return ["sugar", "give", value];
				
			}
		
	}
	
}

function skip() { // Skip over whitespace!
	
	while(/\s/.test(prog[prog_c])) {
		
		prog_c++;
		
	}
	
}

/*

"this is example code for a factorial!"

"comments can just be strings that float around"

{set fact {fun x (
	
	{if {= x 0} (
		
		{give 1}
		
	) (
		
		{give {* x {fact {- x 1}}}}
		
	)}
	
)}}

{print {fact 5}} "outputs `120`"

*/