var mycode = function() {
	'use strict';
	//hide-start
	var testTicker = Date.now(),
		testTime = testTicker,
		testNow,
		testMessage = document.getElementById('testmessage');
	//hide-end

	var pad = scrawl.pad.mycanvas,
		canvas = scrawl.canvas.mycanvas,
		group, here,
		pick, drop, stopE,
		entity = false;

	// define groups
	scrawl.makeGroup({
		name: 'drag'
	}).clone({
		name: 'cursor',
		order: 1
	});
	group = scrawl.group.drag;

	// define block entitys
	scrawl.makeBlock({
		width: 50,
		height: 50,
		startX: 'center',
		startY: 'center',
		handleX: 'center',
		handleY: 'center',
		group: 'drag'
	}).clone({
		fillStyle: 'blue',
		width: 20,
		height: 20,
		handleX: 'top',
		handleY: 'left',
		group: 'cursor',
		pivot: 'mouse'
	}).clone({
		fillStyle: 'red',
		handleX: 'bottom',
		handleY: 'right'
	});

	// event listeners
	stopE = function(e) {
		if (e) {
			e.stopPropagation();
			e.preventDefault();
		}
	};
	pick = function(e) {
		stopE(e);
		entity = group.getEntityAt(here);
		if (entity) {
			entity.pickupEntity(here);
		}
	};
	drop = function(e) {
		stopE(e);
		if (entity) {
			entity.dropEntity();
			entity = false;
		}
	};
	scrawl.addListener('down', pick, canvas);
	scrawl.addListener(['up', 'leave'], drop, canvas);

	//animation object
	scrawl.makeAnimation({
		fn: function() {

			here = pad.getMouse();
			scrawl.render();

			//hide-start
			testNow = Date.now();
			testTime = testNow - testTicker;
			testTicker = testNow;
			testMessage.innerHTML = 'Milliseconds per screen refresh: ' + Math.ceil(testTime) + '; fps: ' + Math.floor(1000 / testTime);
			//hide-end
		},
	});
};

scrawl.loadExtensions({
	path: '../source/',
	minified: false,
	extensions: 'block',
	callback: function() {
		window.addEventListener('load', function() {
			scrawl.init();
			mycode();
		}, false);
	},
});
