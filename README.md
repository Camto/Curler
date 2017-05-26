# Curler
Lisp inspired PL w/ curly brackets.

<pre>
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
</pre>
