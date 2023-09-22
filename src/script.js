// function to be injected into web page's scope
const rewriter = function() {
	// change own attributes, if this fails then we know the script failed to load, probably CSP
	document.currentScript.setAttribute("data-itworked", true);

	/*********************************************************
	 ***  Your code goes goes here to run in pages scope  ***
	 *********************************************************/

	// example code to dump all arguments to document.write
	document.write = new Proxy(document.write, {
		apply: function(_func, _doc, args) {
			console.group(`[**] document.write.apply arguments`);
				for (const arg of args) {
					console.dir(arg);
				}
			console.groupEnd();
			return Reflect.apply(...arguments);
		}
	});

	// example code
	console.log(`script executing in ${location.href}`);
}


// The below code has direct access to the DOM of the visited page, but not the
// scope.
// So we add our own script into the DOM

const inject = `(${rewriter.toString()})();`;
const s = document.createElement('script');
s.type = "text/javascript";
s.onload = () => this.remove();
s.innerHTML = inject;
document.documentElement.appendChild(s);

if (!("data-itworked" in s.attributes)) {
	console.error(`Content script failed to inject into ${location.href}`);
}
s.remove();
