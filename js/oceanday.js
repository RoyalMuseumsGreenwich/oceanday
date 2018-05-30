$(function() {

	var canvas = document.getElementById('bgCanvas');
	var ctx = canvas.getContext('2d');
	ctx.globalCompositeOperation = 'multiply';
	var panels = [];
	var corners = [];

	var cornerTweenTime = 3000;
	var focusTweenTime = 1000;
	var zoomTweenTime = 300;
	var backTweenTime = 200;
	var pngFrames = 175;
	var rotateTime = 10000;
	var rotationsPerFocus = 1;

	var nudgeRight = { x: 200, y: 0 };
	var nudgeLeft = { x: -200, y: 0 };

	var focusedPanel, shownPanel;

	//	SetTimeout handler for cycling of 'focused' panel in menu screen
	var cycleHandler;

	// Raphael.js SVG canvas for animating vessel journeys
	var raphCanvas = new Raphael('shownContent', 3840, 2160);

	var showingContent;

	//	Content data
	var panels = [
		{
			id: 'encounter',
			color: '#ef1f57',
			shadowColor: '#b90e2a',
			corners: [
				{
					position: { x: 100, y: 500 },
					focus: { x: 0, y: -350 },
					focusMax: { x: 0, y: -350 },
					wobble: { x: -20, y: -15 },
					wobbleA: { x: -20, y: -15 },
					wobbleB: { x: 10, y: 10 },
					zoom: { x: 0, y: 0 },
					zoomMax: { x: -50, y: -440 },
					timeOffset: 0
				},
				{
					position: { x: 1180, y: 510 },
					focus: { x: 350, y: -350 },
					focusMax: { x: 350, y: -350 },
					wobble: { x: 15, y: -5 },
					wobbleA: { x: 15, y: -5 },
					wobbleB: { x: -10, y: 10 },
					zoom: { x: 0, y: 0 },
					zoomMax: { x: 1000, y: -440 },
					timeOffset: 500
				},
				{
					position: { x: 1220, y: 1520 },
					focus: { x: 350, y: 450 },
					focusMax: { x: 350, y: 450 },
					wobble: { x: 5, y: -15 },
					wobbleA: { x: 5, y: -15 },
					wobbleB: { x: -5, y: -10 },
					zoom: { x: 0, y: 0 },
					zoomMax: { x: 940, y: 540 },
					timeOffset: 1200
				},
				{
					position: { x: 150, y: 1540 },
					focus: { x: 0, y: 450 },
					focusMax: { x: 0, y: 450 },
					wobble: { x: -5, y: -5 },
					wobbleA: { x: -5, y: -5 },
					wobbleB: { x: 10, y: -15 },
					zoom: { x: 0, y: 0 },
					zoomMax: { x: -50, y: 540 },
					timeOffset: 1900
				}
			],
			opacity: 1,
			vesselPath: "m 2161.7264,1716.99156 c 365.6753,-30.30458 587.6,-293.06178 549.523,-549.52299 -38.0769,-256.461202 -51.292,-626.29398 80.5672,-705.28953 227.2741,-136.15775 415.0003,-203.38481 606.7427,61.46341 117.0972,161.74307 -22.57,582.07556 329.7506,633.07339",
			pathColor: '#ef1f57',
			pngPrefix: 'encounter/ship1',
			content: {
				type: 'Container ship',
				weight: '27,835 gross tonnage',
				year: '1969',
				length: '227m',
				status: 'Decommissioned',
				svg: 'encounter.svg',
				name: 'Encounter Bay',
				p1: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
				p2: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.',
				p3: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod	tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
				p4: 'Blah blah blah dfglkj;sdf gkljsdgksdhf gkjlsdfg klsdfh gsdhfg dfg',
				mapImg: 'Map.png'
			}
		},
		{
			id: 'sloop',
			color: '#a5dcc1',
			shadowColor: '#5aa9a4',
			corners: [
				{
					position: { x: 1320, y: 450 },
					focus: { x: 0, y: 0 },
					focusMax: { x: -175, y: -350 },
					wobble: { x: -20, y: -20 },
					wobbleA: { x: -20, y: -20 },
					wobbleB: { x: 20, y: 20 },
					zoom: { x: 0, y: 0 },
					zoomMax: { x: -1230, y: -380 },
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
					zoom: { x: 0, y: 0 },
					zoomMax: { x: -350, y: -400 },
					nudge: { x: 200, y: 0 },
					timeOffset: 100
				},
				{
					position: { x: 2475, y: 1510 },
					focus: { x: 0, y: 0 },
					focusMax: { x: 175, y: 550 },
					wobble: { x: 10, y: -30 },
					wobbleA: { x: 10, y: -30 },
					wobbleB: { x: -10, y: -20 },
					zoom: { x: 0, y: 0 },
					zoomMax: { x: -290, y: 540 },
					nudge: { x: 200, y: 0 },
					timeOffset: 2900
				},
				{
					position: { x: 1290, y: 1550 },
					focus: { x: 0, y: 0 },
					focusMax: { x: -175, y: 550 },
					wobble: { x: -10, y: -10 },
					wobbleA: { x: -10, y: -10 },
					wobbleB: { x: 20, y: -30 },
					zoom: { x: 0, y: 0 },
					zoomMax: { x: -1230, y: 520 },
					nudge: { x: 200, y: 0 },
					timeOffset: 700
				}
			],
			opacity: 1,
			vesselPath: "m 2161.7264,1716.99156 c 365.6753,-30.30458 587.6,-293.06178 549.523,-549.52299 -38.0769,-256.461202 -51.292,-626.29398 80.5672,-705.28953 227.2741,-136.15775 415.0003,-203.38481 606.7427,61.46341 117.0972,161.74307 -22.57,582.07556 329.7506,633.07339",
			pathColor: '#ef1f57',
			pngPrefix: 'sloop/ship2',
			content: {
				type: 'Kil-class sloop',
				weight: '895 gross tonnage',
				year: '1917-1919',
				length: '55m',
				svg: 'sloop.svg',
				name: 'Kil-class sloop',
				p1: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
				p2: 'Blah blah blah dfglkj;sdf gkljsdgksdhf gkjlsdfg klsdfh gsdhfg dfg',
				p3: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.',
				p4: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod	tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
				mapImg: 'Map.png'
			}
		},
		{
			id: 'david',
			color: '#f0b32d',
			shadowColor: '#ca8419',
			corners: [
				{
					position: { x: 2620, y: 600 },
					focus: { x: 0, y: 0 },
					focusMax: { x: -350, y: -350 },
					wobble: { x: -20, y: -20 },
					wobbleA: { x: -20, y: -20 },
					wobbleB: { x: 20, y: 20 },
					zoom: { x: 0, y: 0 },
					zoomMax: { x: -2520, y: -520 },
					timeOffset: 400
				},
				{
					position: { x: 3770, y: 500 },
					focus: { x: 0, y: 0 },
					focusMax: { x: 0, y: -350 },
					wobble: { x: 30, y: -10 },
					wobbleA: { x: 30, y: -10 },
					wobbleB: { x: -20, y: 20 },
					zoom: { x: 0, y: 0 },
					zoomMax: { x: -1600, y: -440 },
					timeOffset: 700
				},
				{
					position: { x: 3755, y: 1580 },
					focus: { x: 0, y: 0 },
					focusMax: { x: 0, y: 550 },
					wobble: { x: 10, y: -30 },
					wobbleA: { x: 10, y: -30 },
					wobbleB: { x: -10, y: -20 },
					zoom: { x: 0, y: 0 },
					zoomMax: { x: -1600, y: 550 },
					timeOffset: 1800
				},
				{
					position: { x: 2620, y: 1540 },
					focus: { x: 0, y: 0 },
					focusMax: { x: -350, y: 550 },
					wobble: { x: -10, y: -10 },
					wobbleA: { x: -10, y: -10 },
					wobbleB: { x: 20, y: -30 },
					zoom: { x: 0, y: 0 },
					zoomMax: { x: -2520, y: 550 },
					timeOffset: 2400
				}
			],
			opacity: 1,
			vesselPath: "m 2161.7264,1716.99156 c 365.6753,-30.30458 587.6,-293.06178 549.523,-549.52299 -38.0769,-256.461202 -51.292,-626.29398 80.5672,-705.28953 227.2741,-136.15775 415.0003,-203.38481 606.7427,61.46341 117.0972,161.74307 -22.57,582.07556 329.7506,633.07339",
			pathColor: '#ef1f57',
			pngPrefix: 'david/ship3',
			content: {
				type: 'RRS Sir David Attenborough',
				weight: '15,000 gross tonnage',
				year: 'Construction started in 2016',
				length: '128m',
				status: 'Operational in 2019',
				svg: 'david.svg',
				name: 'RRS Sir David Attenborough',
				p1: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
				p2: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.',
				p3: 'Blah blah blah dfglkj;sdf gkljsdgksdhf gkjlsdfg klsdfh gsdhfg dfg',
				mapImg: 'Map.png'
			}
		}
	];


	//	Canvas drawing
	function drawSquare(panel) {
		ctx.fillStyle = panel.color;
		ctx.beginPath();
		for(var i = 0; i < panel.corners.length; i++) {
			x = panel.corners[i].position.x + panel.corners[i].focus.x + panel.corners[i].wobble.x + panel.corners[i].nudge.x + panel.corners[i].zoom.x;
			y = panel.corners[i].position.y + panel.corners[i].focus.y + panel.corners[i].wobble.y + panel.corners[i].nudge.y + panel.corners[i].zoom.y;
			if(i === 0) {
				ctx.moveTo(x, y);
			} else {
				ctx.lineTo(x, y);
			}
		}
		ctx.globalAlpha = panel.opacity;
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

	function setFocus(id, tweenTime) {
		var panel = getPanel(id);
		focusedPanel = panel;
		$('.menuPanel').removeClass('focused');
		$('.menuPanel').addClass('notFocused');
		$('#' + id).addClass('focused');
		$('#' + id).removeClass('notFocused');
		focusPanel(id, tweenTime);
		startRotating(panel);
	}

	function focusPanel(id, tweenTime) {
		//	Set up tweens for changes to canvas shapes
		if(!tweenTime) {
			tweenTime = focusTweenTime;
		}
		console.log("Focusing " + id);
		for(var i = 0; i < panels.length; i++) {
			if(panels[i].id === id) {
				if(panels[i] === focusedPanel) {
					panels[i].corners.forEach(function(corner) {
						corner.focusTween = new TWEEN.Tween(corner.focus)
						.to(corner.focusMax, tweenTime)
						.easing(TWEEN.Easing.Cubic.Out)
						.onComplete(function() { corner.focusTween = undefined })
						.start();
					});
					panels[i].corners.forEach(function(corner) {
						corner.nudgeTween = new TWEEN.Tween(corner.nudge)
						.to({x: 0, y: 0}, tweenTime)
						.easing(TWEEN.Easing.Cubic.Out)
						.onComplete(function() { corner.nudgeTween = undefined })
						.start();
					});
				}
			} else {
				panels[i].corners.forEach(function(corner) {
					corner.focusTween = new TWEEN.Tween(corner.focus)
					.to({x: 0, y: 0}, tweenTime)
					.easing(TWEEN.Easing.Cubic.Out)
					.onComplete(function() { corner.focusTween = undefined })
					.start();
				});
				if(i === 1 && id === 'encounter') {
					panels[i].corners.forEach(function(corner) {
						corner.nudgeTween = new TWEEN.Tween(corner.nudge)
						.to(nudgeRight, tweenTime)
						.easing(TWEEN.Easing.Cubic.Out)
						.onComplete(function() { corner.nudgeTween = undefined })
						.start();
					});
				} else if(i === 1 && id === 'david') {
					panels[i].corners.forEach(function(corner) {
						corner.nudgeTween = new TWEEN.Tween(corner.nudge)
						.to(nudgeLeft, tweenTime)
						.easing(TWEEN.Easing.Cubic.Out)
						.onComplete(function() { corner.nudgeTween = undefined })
						.start();
					});
				}
			}
		}
	}


	//	First load and setup
	function setup() {
		for(var i = 0; i < panels.length; i++) {
			for(var j = 0; j < panels[i].corners.length; j++) {
				corners.push(panels[i].corners[j]);
			}
		}
		for(var i = 0; i < corners.length; i++) {
			startWobble(corners[i]);
		}
		corners.forEach(function(corner) {
			if(!corner.nudge) {
				corner.nudge = { x: 0, y: 0 }
			}
		});
		panels.forEach(function(panel) {
			bufferPngs(panel);
		});
		setFocus(panels[0].id);
		cycleMenu();
		MainLoop.setUpdate(update).setDraw(draw).start();
	}

	function draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for(var i = 0; i < panels.length; i++) {
			drawSquare(panels[i]);
		}
	}

	function update() {
		TWEEN.update();
		animatePngs();
	}

	function startRotating(panel) {
		panel.animStart = performance.now();
	}

	function animatePngs() {
		panels.forEach(function(panel) {
			if(!showingContent && panel === focusedPanel) {
				var timeDiff = performance.now() - panel.animStart;
				while(timeDiff > rotateTime) {
					timeDiff -= rotateTime;
				}
				var pointInAnimLoop = timeDiff / rotateTime;
				var animFrame = Math.floor(pointInAnimLoop * pngFrames) + 5;
				if(animFrame >= pngFrames) { 
					animFrame -= pngFrames;
				};
				var leadZeroes;
				if(animFrame < 10) {
					leadZeroes = '00';
				} else if(animFrame < 100) {
					leadZeroes = '0';
				} else {
					leadZeroes = '';
				}
				panel.currentPng = 'img/' + panel.pngPrefix + leadZeroes + animFrame + '.png';
			} else {
				panel.currentPng = 'img/' + panel.pngPrefix + '005.png';
			}
			if($('#' + panel.id + ' img').attr('src') !== panel.currentPng) {
				$('#' + panel.id + ' img').attr('src', panel.currentPng);
			}
		});
	}

	function resetPngs() {
		panels.forEach(function(panel) {
			panel.currentPng = 'img/' + panel.pngPrefix + '005.png';
		});
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
	

	//	Menu 'cycling' animation
	function cycleMenu() {
		clearTimeout(cycleHandler);
		cycleHandler = undefined;
		cycleHandler = setTimeout(function() {
			changeFocus();
			cycleMenu();
		// }, rotateTime * 2);
		}, rotateTime * rotationsPerFocus);
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


	//	Click to show content
	$('.menuPanel').click(function() {
		showContent($(this).attr('id'));
	});

	function showContent(id) {
		var panel = getPanel(id);
		shownPanel = panel;
		$('#menuContent').fadeOut('fast', function() {
			resetPngs();
		});
		zoomCanvases(id);
		zoomPanelBar(id)
		animateLine(raphCanvas, panel.pathColor, panel.vesselPath);
	}

	function zoomPanelBar(id) {
		var $parentBar = $('#' + id + ' .panelBar');
		$parentBar.clone().attr('id', 'newPanelBar').appendTo('body');
		$('#newPanelBar').show();
		$('#newPanelBar').offset($parentBar.offset());
		$('#newPanelBar').width($parentBar.width());
		$('#newPanelBar').height($parentBar.height());
		var css = {
			'left': '500px',
			'top': ($('#contentText').offset().top - 120) + 'px',
			'width': '350px'
		}
		setTimeout(function() {
			$('#newPanelBar').animate(css, zoomTweenTime, 'easeOutCubic', function() {
				console.log("Done!");
			});
		}, zoomTweenTime);
	}

	function getPanel(id) {
		for(var i = 0; i < panels.length; i++) {
			if(panels[i].id === id) {
				return panels[i];
			}
		}
	}

	function zoomCanvases(id) {
		clearTimeout(cycleHandler);
		cycleHandler = undefined;
		panels.forEach(function(panel) {
			if(panel.id === id) {
				panel.corners.forEach(function(corner) {
					corner.focusTween = new TWEEN.Tween(corner.focus)
					.to({x: 0, y: 0}, zoomTweenTime)
					.easing(TWEEN.Easing.Cubic.In)
					.onComplete(function() { 
						corner.focusTween = undefined; 
						if(!showingContent) {
							showingContent = true;
							$('#shownContent').removeClass('hidden');
							$('#mapDiv').removeClass('hidden');
							$('#mapDiv').one('transitionend', function() {
								showingContent = false;
							});
						}
						corner.zoomTween = new TWEEN.Tween(corner.zoom)
						.to(corner.zoomMax, zoomTweenTime)
						.easing(TWEEN.Easing.Cubic.Out)
						.onComplete(function() {
							corner.zoomTween = undefined;	
						})
						.start();
						if(corner.nudge !== { x:0, y:0 }) {
							corner.nudgeTween = new TWEEN.Tween(corner.nudge)
							.to({ x: 0, y: 0 }, zoomTweenTime)
							.easing(TWEEN.Easing.Cubic.Out)
							.onComplete(function() {
								corner.nudgeTween = undefined;
							})
							.start();
						}
					})
					.start();
				});
				loadZoomContent(panel);
			} else {
				panel.opacityTween = new TWEEN.Tween(panel)
				.to({opacity: 0}, zoomTweenTime)
				.easing(TWEEN.Easing.Cubic.Out)
				.onComplete(function() { panel.opacityTween = undefined; })
				.start();
			}
		});
	}

	function loadZoomContent(panel) {
		$('#pType').text(panel.content.type);
		$('#pWeight').text(panel.content.weight);
		if(panel.content.status) {
			$('#labelStatus').show();
			$('#pStatus').text(panel.content.status);
		} else {
			$('#labelStatus').hide();
		}
		$('#pYear').text(panel.content.year);
		$('#pLength').text(panel.content.length);
		var path = 'img/' + panel.content.svg;
		$('#topPanelRight img').attr('src', path);
		$('#shownContent h1').text(panel.content.name);
		$('#contentP1').text(panel.content.p1);
		$('#contentP2').text(panel.content.p2);
		$('#contentP3').text(panel.content.p3);
		$('#contentP4').text(panel.content.p4);
		path = 'img/' + panel.content.mapImg;
		$('#mapDiv img').attr('src', path);
	}


	//	Raphael canvas animation from http://jsfiddle.net/kaska/yFJ4e/
	function animateLine(raphCanvas, colorNumber, pathString) {
		var line = raphCanvas.path(pathString).attr({
			stroke: colorNumber
		});

		var length = line.getTotalLength();

		$('path[fill*="none"]').animate({
			'to': 1
		}, {
			duration: 5000,
			step: function(pos, fx) {
				var offset = length * fx.pos;
				var subpath = line.getSubpath(0, offset);
				raphCanvas.clear();
				raphCanvas.path(subpath).attr({
					stroke: colorNumber,
					"stroke-dasharray":"- ",
					"stroke-width": '10',
					"stroke-linecap": 'round'
				});
			}
		});
	};


	function backToMenu() {
		$('#mapDiv').addClass('hidden');
		$('#shownContent').addClass('hidden');
		$('#shownContent').one('transitionend', function() {
			$('#menuContent').fadeIn('fast');
		});
		$('#newPanelBar').fadeOut('fast', function() {
			$('#newPanelBar').remove();
		});
		panels.forEach(function(panel) {
			if(panel === shownPanel) {
				panel.corners.forEach(function(corner) {
					corner.zoomTween = new TWEEN.Tween(corner.zoom)
					.to({ x: 0, y: 0 }, zoomTweenTime)
					.easing(TWEEN.Easing.Cubic.Out)
					.onComplete(function() { 
						corner.zoomTween = undefined; 
					})
					.start();
					setFocus(shownPanel.id, zoomTweenTime);
					cycleMenu();
				});
			} else {
				panel.opacityTween = new TWEEN.Tween(panel)
				.to({opacity: 1}, zoomTweenTime)
				.easing(TWEEN.Easing.Cubic.Out)
				.onComplete(function() { panel.opacityTween = undefined; })
				.start();
			}
		});
	}


	$('#backBtn').click(function() {
		backToMenu();
	});









	setup();

});