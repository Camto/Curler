# Curler
Lisp inspired PL w/ curly brackets.

<pre>
"this is example code for a factorial!"

"comments can just be strings that float around"

{<b>set</b> <i>fact</i> {<b>fun</b> <i>x</i> (
	
	{<b>if</b> {<i>= x</i> 0} (
		
		{<b>give</b> 1}
		
	) (
		
		{<b>give</b> {<i>* x</i> {<i>fact</i> {<i>- x</i> 1}}}}
		
	)}
	
)}}

{<i>print</i> {<i>fact</i> 5}} "outputs `120`"
</pre>