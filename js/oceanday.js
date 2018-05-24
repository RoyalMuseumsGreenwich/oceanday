$(function() {

	var canvas = document.getElementById('bgCanvas');
	var ctx = canvas.getContext('2d');
	ctx.globalCompositeOperation = 'multiply';
	var panels = [];
	var corners = [];


	var cornerTweenTime = 3000;
	var focusTweenTime = 1000;

	var nudgeRight = { x: 200, y: 0 };
	var nudgeLeft = { x: -200, y: 0 };

	var panels = [
		{
			id: 'panelEncounter',
			focused: true,
			color: '#ef1f57',
			corners: [
				{
					position: { x: 100, y: 500 },
					focus: { x: 0, y: -350 },
					focusMax: { x: 0, y: -350 },
					wobble: { x: -20, y: -15 },
					wobbleA: { x: -20, y: -15 },
					wobbleB: { x: 10, y: 10 },
					timeOffset: 0
				},
				{
					position: { x: 1180, y: 530 },
					focus: { x: 350, y: -350 },
					focusMax: { x: 350, y: -350 },
					wobble: { x: 15, y: -5 },
					wobbleA: { x: 15, y: -5 },
					wobbleB: { x: -10, y: 10 },
					timeOffset: 500
				},
				{
					position: { x: 1220, y: 1700 },
					focus: { x: 350, y: 350 },
					focusMax: { x: 350, y: 350 },
					wobble: { x: 5, y: -15 },
					wobbleA: { x: 5, y: -15 },
					wobbleB: { x: -5, y: -10 },
					timeOffset: 1200
				},
				{
					position: { x: 150, y: 1690 },
					focus: { x: 0, y: 350 },
					focusMax: { x: 0, y: 350 },
					wobble: { x: -5, y: -5 },
					wobbleA: { x: -5, y: -5 },
					wobbleB: { x: 10, y: -15 },
					timeOffset: 1900
				}
			]
		},
		{
			id: 'panelSloop',
			focused: false,
			color: '#a5dcc1',
			corners: [
				{
					position: { x: 1320, y: 450 },
					focus: { x: 0, y: 0 },
					focusMax: { x: -175, y: -350 },
					wobble: { x: -20, y: -20 },
					wobbleA: { x: -20, y: -20 },
					wobbleB: { x: 20, y: 20 },
					nudge: { x: 200, y: 0 },
					timeOffset: 1800
				},
				{
					position: { x: 2525, y: 500 },
					focus: { x: 0, y: 0 },
					focusMax: { x: 175, y: -350 },
					wobble: { x: 30, y: -10 },
					wobbleA: { x: 30, y: -10 },
					wobbleB: { x: -20, y: 20 },
					nudge: { x: 200, y: 0 },
					timeOffset: 100
				},
				{
					position: { x: 2475, y: 1760 },
					focus: { x: 0, y: 0 },
					focusMax: { x: 175, y: 350 },
					wobble: { x: 10, y: -30 },
					wobbleA: { x: 10, y: -30 },
					wobbleB: { x: -10, y: -20 },
					nudge: { x: 200, y: 0 },
					timeOffset: 2900
				},
				{
					position: { x: 1290, y: 1750 },
					focus: { x: 0, y: 0 },
					focusMax: { x: -175, y: 350 },
					wobble: { x: -10, y: -10 },
					wobbleA: { x: -10, y: -10 },
					wobbleB: { x: 20, y: -30 },
					nudge: { x: 200, y: 0 },
					timeOffset: 700
				}
			]
		},
		{
			id: 'panelDavid',
			focused: false,
			color: '#f0b32d',
			corners: [
				{
					position: { x: 2600, y: 600 },
					focus: { x: 0, y: 0 },
					focusMax: { x: -350, y: -350 },
					wobble: { x: -20, y: -20 },
					wobbleA: { x: -20, y: -20 },
					wobbleB: { x: 20, y: 20 },
					timeOffset: 400
				},
				{
					position: { x: 3770, y: 500 },
					focus: { x: 0, y: 0 },
					focusMax: { x: 0, y: -350 },
					wobble: { x: 30, y: -10 },
					wobbleA: { x: 30, y: -10 },
					wobbleB: { x: -20, y: 20 },
					timeOffset: 700
				},
				{
					position: { x: 3755, y: 1800 },
					focus: { x: 0, y: 0 },
					focusMax: { x: 0, y: 350 },
					wobble: { x: 10, y: -30 },
					wobbleA: { x: 10, y: -30 },
					wobbleB: { x: -10, y: -20 },
					timeOffset: 1800
				},
				{
					position: { x: 2600, y: 1720 },
					focus: { x: 0, y: 0 },
					focusMax: { x: -350, y: 350 },
					wobble: { x: -10, y: -10 },
					wobbleA: { x: -10, y: -10 },
					wobbleB: { x: 20, y: -30 },
					timeOffset: 2400
				}
			]
		}
	];


	function drawSquare(panel) {
		ctx.fillStyle = panel.color;
		ctx.beginPath();
		for(var i = 0; i < panel.corners.length; i++) {
			x = panel.corners[i].position.x + panel.corners[i].focus.x + panel.corners[i].wobble.x + panel.corners[i].nudge.x;
			y = panel.corners[i].position.y + panel.corners[i].focus.y + panel.corners[i].wobble.y + panel.corners[i].nudge.y;
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

	function focusCanvas(id) {
		for(var i = 0; i < panels.length; i++) {
			if(panels[i].id === id) {
				if(!panels[i].focused) {
					panels[i].focused = true;
					panels[i].corners.forEach(function(corner) {
						corner.focusTween = new TWEEN.Tween(corner.focus)
							.to(corner.focusMax, focusTweenTime)
							.easing(TWEEN.Easing.Cubic.Out)
							.onComplete(function() { corner.focusTween = undefined })
							.start();
					});
					panels[i].corners.forEach(function(corner) {
						corner.nudgeTween = new TWEEN.Tween(corner.nudge)
							.to({x: 0, y: 0}, focusTweenTime)
							.easing(TWEEN.Easing.Cubic.Out)
							.onComplete(function() { corner.nudgeTween = undefined })
							.start();
					});
				}
			} else {
				if(panels[i].focused) {
					panels[i].focused = false;
					panels[i].corners.forEach(function(corner) {
						corner.focusTween = new TWEEN.Tween(corner.focus)
							.to({x: 0, y: 0}, focusTweenTime)
							.easing(TWEEN.Easing.Cubic.Out)
							.onComplete(function() { corner.focusTween = undefined })
							.start();
					});
				}
				if(i === 1 && id === 'panelEncounter') {
					panels[i].corners.forEach(function(corner) {
						corner.nudgeTween = new TWEEN.Tween(corner.nudge)
							.to(nudgeRight, focusTweenTime)
							.easing(TWEEN.Easing.Cubic.Out)
							.onComplete(function() { corner.nudgeTween = undefined })
							.start();
					});
				} else if(i === 1 && id === 'panelDavid') {
					panels[i].corners.forEach(function(corner) {
						corner.nudgeTween = new TWEEN.Tween(corner.nudge)
							.to(nudgeLeft, focusTweenTime)
							.easing(TWEEN.Easing.Cubic.Out)
							.onComplete(function() { corner.nudgeTween = undefined })
							.start();
					});
				}
			}
		}
	}



	$('.menuPanel').click(function() {
		$('.menuPanel').removeClass('focused');
		$('.menuPanel').addClass('notFocused');
		$(this).addClass('focused');
		$(this).removeClass('notFocused');
		focusCanvas($(this).attr('id'));
	});

	function draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for(var i = 0; i < panels.length; i++) {
			drawSquare(panels[i]);
		}
	}

	function update() {
		TWEEN.update();
	}

	function setup() {
		for(var i = 0; i < panels.length; i++) {
			for(var j = 0; j < panels[i].corners.length; j++) {
				corners.push(panels[i].corners[j]);
			}
		}
		for(var i = 0; i < corners.length; i++) {
			startWobble(corners[i]);
		}
		console.log(corners);
		corners.forEach(function(corner) {
			if(!corner.nudge) {
				corner.nudge = { x: 0, y: 0 }
			}
		});
		focusCanvas('panelEncounter');
		MainLoop.setUpdate(update).setDraw(draw).start();
	}


	// start();
	// draw();
	setup();

});