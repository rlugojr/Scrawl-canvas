onmessage = function(e) {
	console.log('w2 called with message', typeof e, e, typeof e.data, e.data);
	var d = scrawl.device;
	console.log('trying to capture device object', d);
	var m = 'You said: ' + e.data;
	console.log('w2 responding with message', m);
	postMessage(m);
};
