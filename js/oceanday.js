$(function() {

	var canvas = document.getElementById('bgCanvas');
	var ctx = canvas.getContext('2d');
	ctx.globalCompositeOperation = 'multiply';
	var cornerTweenTime = 3000;
	var corners = [];

	var panelEncounter = {
		focused: true,
		color: '#ef1f57',
		corners: [
			{
				position: { x: 100, y: 500 },
				focus: { x: 0, y: -250 },
				focusMax: { x: 0, y: -250 },
				wobble: { x: -10, y: -10 },
				wobbleA: { x: -10, y: -10 },
				wobbleB: { x: 10, y: 10 },
				timeOffset: 0,
				tweenEnd: 0
			},
			{
				position: { x: 1140, y: 500 },
				focus: { x: 350, y: -250 },
				focusMax: { x: 350, y: -250 },
				wobble: { x: 15, y: -5 },
				wobbleA: { x: 15, y: -5 },
				wobbleB: { x: -10, y: 10 },
				timeOffset: 500,
				tweenEnd: 0
			},
			{
				position: { x: 1220, y: 1800 },
				focus: { x: 350, y: 250 },
				focusMax: { x: 350, y: 250 },
				wobble: { x: 5, y: -15 },
				wobbleA: { x: 5, y: -15 },
				wobbleB: { x: -5, y: -10 },
				timeOffset: 1200,
				tweenEnd: 0
			},
			{
				position: { x: 150, y: 1790 },
				focus: { x: 0, y: 250 },
				focusMax: { x: 0, y: 250 },
				wobble: { x: -5, y: -5 },
				wobbleA: { x: -5, y: -5 },
				wobbleB: { x: 10, y: -15 },
				timeOffset: 1900,
				tweenEnd: 0
			}
		]
	}

	var panelSloop = {
		focused: false,
		color: '#a5dcc1',
		corners: [
			{
				position: { x: 1500, y: 450 },
				focus: { x: 0, y: 0 },
				focusMax: { x: 0, y: -250 },
				wobble: { x: -20, y: -20 },
				wobbleA: { x: -20, y: -20 },
				wobbleB: { x: 20, y: 20 },
				timeOffset: 1800,
				tweenEnd: 0
			},
			{
				position: { x: 2725, y: 500 },
				focus: { x: 0, y: 0 },
				focusMax: { x: 350, y: -250 },
				wobble: { x: 30, y: -10 },
				wobbleA: { x: 30, y: -10 },
				wobbleB: { x: -20, y: 20 },
				timeOffset: 100,
				tweenEnd: 0
			},
			{
				position: { x: 2675, y: 1800 },
				focus: { x: 0, y: 0 },
				focusMax: { x: 350, y: 250 },
				wobble: { x: 10, y: -30 },
				wobbleA: { x: 10, y: -30 },
				wobbleB: { x: -10, y: -20 },
				timeOffset: 2900,
				tweenEnd: 0
			},
			{
				position: { x: 1500, y: 1800 },
				focus: { x: 0, y: 0 },
				focusMax: { x: 0, y: 250 },
				wobble: { x: -10, y: -10 },
				wobbleA: { x: -10, y: -10 },
				wobbleB: { x: 20, y: -30 },
				timeOffset: 700,
				tweenEnd: 0
			}
		]
	}

	var panelDavid = {
		focused: false,
		color: '#f0b32d',
		corners: [
			{
				position: { x: 2600, y: 600 },
				focus: { x: 0, y: 0 },
				focusMax: { x: 0, y: -250 },
				wobble: { x: -20, y: -20 },
				wobbleA: { x: -20, y: -20 },
				wobbleB: { x: 20, y: 20 },
				timeOffset: 400,
				tweenEnd: 0
			},
			{
				position: { x: 3770, y: 500 },
				focus: { x: 0, y: 0 },
				focusMax: { x: 350, y: -250 },
				wobble: { x: 30, y: -10 },
				wobbleA: { x: 30, y: -10 },
				wobbleB: { x: -20, y: 20 },
				timeOffset: 700,
				tweenEnd: 0
			},
			{
				position: { x: 3755, y: 1800 },
				focus: { x: 0, y: 0 },
				focusMax: { x: 350, y: 250 },
				wobble: { x: 10, y: -30 },
				wobbleA: { x: 10, y: -30 },
				wobbleB: { x: -10, y: -20 },
				timeOffset: 1800,
				tweenEnd: 0
			},
			{
				position: { x: 2600, y: 1720 },
				focus: { x: 0, y: 0 },
				focusMax: { x: 0, y: 250 },
				wobble: { x: -10, y: -10 },
				wobbleA: { x: -10, y: -10 },
				wobbleB: { x: 20, y: -30 },
				timeOffset: 2400,
				tweenEnd: 0
			}
		]
	}




	function drawSquare(panel) {
		ctx.fillStyle = panel.color;
		ctx.beginPath();
		for(var i = 0; i < panel.corners.length; i++) {
			x = panel.corners[i].position.x + panel.corners[i].focus.x + panel.corners[i].wobble.x;
			y = panel.corners[i].position.y + panel.corners[i].focus.y + panel.corners[i].wobble.y;
			if(i === 0) {
				ctx.moveTo(x, y);
			} else {
				ctx.lineTo(x, y);
			}
		}	
		ctx.fill();
		// debugger;
	}

	function startWobble(corner) {
		var tweenTo;
		if(corner.nextWobble === corner.wobbleA) {
			tweenTo = corner.wobbleA;
			corner.nextWobble = corner.wobbleB;
		} else {
			tweenTo = corner.wobbleB;
			corner.nextWobble = corner.wobbleA;
		}
		corner.wobbleTween = new TWEEN.Tween(corner.wobble)
			.to(tweenTo, cornerTweenTime)
			.easing(TWEEN.Easing.Cubic.InOut)
			.delay(corner.timeOffset)
			.onComplete(function() { startWobble(corner) })
			.start();
	}



	function start() {
		for(var i = 0; i < panelEncounter.corners.length; i++) {
			corners.push(panelEncounter.corners[i]);
		}
		for(var i = 0; i < panelSloop.corners.length; i++) {
			corners.push(panelSloop.corners[i]);
		}
		for(var i = 0; i < panelDavid.corners.length; i++) {
			corners.push(panelDavid.corners[i]);
		}
		for(var i = 0; i < corners.length; i++) {
			startWobble(corners[i]);
		}
		console.log(corners);
	}

	$('#panelSloop').click(function() {
		console.log("SDFGSDFSDF");
		$('#panelSloop').addClass('focused');
		$('#panelDavid').addClass('notFocused');
		$('#panelEncounter').addClass('notFocused');
		$('#panelSloop').removeClass('notFocused');
		$('#panelDavid').removeClass('focused');
		$('#panelEncounter').removeClass('focused');
	});

	function draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawSquare(panelEncounter);
		drawSquare(panelSloop);
		drawSquare(panelDavid);
	}

	function update() {
		TWEEN.update();
	}

	MainLoop.setUpdate(update).setDraw(draw).start();

	start();
	draw();


});