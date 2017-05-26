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
				case "class":
				case "obj":
				case "fun":
				case "if":
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
			
			while(!/[\s\{\}\(\)]/.test(prog[prog_c])) {
				
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
				
				case "class":
					
					return ["sugar", "class", class_arguments, class_constructor, methods];
				
				case "method":
					
					return [name, method_arguments, definition];
				
				case "obj":
					
					return ["sugar", "obj", name, obj_arguments];
				
				case "prop":
					
					return ["sugar", "property", name, property, data];
				
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
		
		{give {* x {fib {- x 1}}}}
		
	)}
	
)}}

{print {fact 5}} "outputs `120`"

*/