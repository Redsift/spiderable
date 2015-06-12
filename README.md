`meteor add redsift:spiderable`

#Spiderable

Forked from ongoworks:spiderable and includes console logs from Phantom, Iron Router support for data and fixes.

##UI Helper to check if rendering is in PhantomJS

	{{#if isPhantom}}
	Rendered in PhantomJS
	{{else}}
	Not rendered in PhantomJS
	{{/if}}
	

## Iron Router

When used with Iron Router it will wait on data subscriptions.