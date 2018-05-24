$(function() {

	var canvas = document.getElementById('bgCanvas');
	var ctx = canvas.getContext('2d');
	ctx.globalCompositeOperation = 'multiply';
	var panels = [];
	var corners = [];

	var cornerTweenTime = 3000;
	var focusTweenTime = 1000;
	var pngFrames = 126;
	var rotateTime = 5000;

	var nudgeRight = { x: 200, y: 0 };
	var nudgeLeft = { x: -200, y: 0 };

	var focusedPanel;

	var cycleHandler;

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
			],
			pngPrefix: 'encounter/SHIP1_1'
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
			],
			pngPrefix: 'sloop/SHIP2_1'
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
			],
			pngPrefix: 'david/SHIP3_1'
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

	function setFocus(id) {
		$('.menuPanel').removeClass('focused');
		$('.menuPanel').addClass('notFocused');
		$('#' + id).addClass('focused');
		$('#' + id).removeClass('notFocused');
		focusPanel(id);
	}

	function focusPanel(id) {
		//	Set up tweens for changes to canvas shapes
		for(var i = 0; i < panels.length; i++) {
			if(panels[i].id === id) {
				if(!panels[i].focused) {
					panels[i].focused = true;
					focusedPanel = panels[i];
					focusedPanel.animStart = performance.now();
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
		setFocus($(this).attr('id'));
	});

	function draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for(var i = 0; i < panels.length; i++) {
			drawSquare(panels[i]);
		}
	}

	function update() {
		TWEEN.update();
		var timeDiff = performance.now() - focusedPanel.animStart;
		while(timeDiff > rotateTime) {
			timeDiff -= rotateTime;
		}
		var pointInAnimLoop = timeDiff / rotateTime;
		var animFrame = Math.floor(pointInAnimLoop * pngFrames);
		var leadZeroes;
		if(animFrame < 10) {
			leadZeroes = '00';
		} else if(animFrame < 100) {
			leadZeroes = '0';
		} else {
			leadZeroes = '';
		}
		var filename = 'img/' + focusedPanel.pngPrefix + leadZeroes + animFrame + '.png';
		$('#' + focusedPanel.id + ' img').attr('src', filename);
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
		panels.forEach(function(panel) {
			bufferPngs(panel);
		});
		focusedPanel = panels[0];
		focusedPanel.animStart = performance.now();
		setFocus(panels[0].id);
		cycleMenu();
		MainLoop.setUpdate(update).setDraw(draw).start();
	}

	function bufferPngs(panel) {
		for(var i = 0; i < pngFrames; i++) {
			var leadZeroes;
			if(i < 10) {
				leadZeroes = '00';
			} else if(i < 100) {
				leadZeroes = '0';
			} else {
				leadZeroes = '';
			}
			var filename = 'img/' + panel.pngPrefix + leadZeroes + i + '.png';
			$('#' + panel.id + ' img').attr('src', filename);
		}
	}

	function cycleMenu() {
		cycleHandler = setTimeout(function() {
			changeFocus();
			cycleMenu();
		// }, rotateTime * 2);
		}, rotateTime);
	}

	function changeFocus() {
		if(focusedPanel === panels[0]) {
			setFocus(panels[1].id);
		} else if(focusedPanel === panels[1]) {
			setFocus(panels[2].id);
		} else {
			setFocus(panels[0].id);
		}
	}


	// start();
	// draw();
	setup();

});