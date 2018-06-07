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
	var pngFrames = 250;
	var rotateTime = 10000;
	var rotationsPerFocus = 1;

	var nudgeRight = { x: 100, y: 0 };
	var nudgeLeft = { x: -100, y: 0 };

	var focusedPanel, shownPanel;

	//	SetTimeout handler for cycling of 'focused' panel in menu screen
	var cycleHandler;
	var	counterHideTime = 5000;
	var counterHideHandler;

	var idleTimeoutMax = 180000;		//	3	mins
	var idleTimeoutHandler;

	// Raphael.js SVG canvas for animating vessel journeys
	var raphCanvas = new Raphael('shownContent', 1920, 1080);

	var showingContent;

	var disableContextMenu = false;

	//	Content data
	var panels = [
		{
			id: 'encounter',
			color: '#ef1f57',
			shadowColor: '#b90e2a',
			corners: [
				{
					position: { x: 50, y: 250 },
					focus: { x: 0, y: -175 },
					focusMax: { x: 0, y: -175 },
					wobble: { x: -10, y: -8 },
					wobbleA: { x: -10, y: -8 },
					wobbleB: { x: 5, y: 5 },
					zoom: { x: 0, y: 0 },
					zoomMax: { x: -25, y: -220 },
					timeOffset: 0
				},
				{
					position: { x: 590, y: 255 },
					focus: { x: 175, y: -175 },
					focusMax: { x: 175, y: -175 },
					wobble: { x: 8, y: -3 },
					wobbleA: { x: 8, y: -3 },
					wobbleB: { x: -5, y: 5 },
					zoom: { x: 0, y: 0 },
					zoomMax: { x: 500, y: -220 },
					timeOffset: 500
				},
				{
					position: { x: 610, y: 760 },
					focus: { x: 175, y: 225 },
					focusMax: { x: 175, y: 225 },
					wobble: { x: 3, y: -8 },
					wobbleA: { x: 3, y: -8 },
					wobbleB: { x: -3, y: -5 },
					zoom: { x: 0, y: 0 },
					zoomMax: { x: 470, y: 270 },
					timeOffset: 1200
				},
				{
					position: { x: 75, y: 770 },
					focus: { x: 0, y: 225 },
					focusMax: { x: 0, y: 225 },
					wobble: { x: -3, y: -3 },
					wobbleA: { x: -3, y: -3 },
					wobbleB: { x: 5, y: -8 },
					zoom: { x: 0, y: 0 },
					zoomMax: { x: -25, y: 270 },
					timeOffset: 1900
				}
			],
			opacity: 1,
			vesselPath: "m 1065,890 c 0,0 315.17857,56.47322 359.46428,-147.8125 c 44.28572,-204.28571 -32.99811,-248.03008 14.19643,-332.14285 c 64.6591,-115.23908 261.16321,-193.75234 290.08929,-176.91965 c 156.57382,91.11356 -39.76455,266.03773 104.82143,296.875 c 142.6802,30.4308 282.85714,-24.28571 282.85714,-24.28571",
			pathColor: '#ef1f57',
			pngPrefix: 'encounter/ship1',
			content: {
				type: 'Container ship',
				weight: '26,756 gross tonnage',
				year: '1968',
				length: '227m',
				status: 'Demolished in 1999',
				speed: '21.5 knots',
				svg: 'encounter.svg',
				name: 'Encounter Bay',
				p1: 'Encounter Bay was a German-built, UK-registered early container ship that set the benchmark for the container ship revolution. Its first trade route was UK to and from Australia, and then later UK to and from the Far East.',
				p2: 'During the late 1960s international standardisation of shipping containers meant that containers could be moved seamlessly between ships, trucks and trains - first on the busiest shipping routes, and then eventually globally.',
				p3: 'The two most important container sizes are the 20-foot and the 40-foot lengths, the latter being the most frequently used today, so much so that cargo volume and vessel capacity are commonly measured in Forty-foot Equivalent Unit (FEU). With a standardised container size and corner fittings, container ships, trains, trucks, and cranes could be specifically built to a single size specification all around the world.',
				p4: '',
				p5: 'Every container in the world has its own unique unit number to identify who owns the container, who is using the container, and to track its whereabouts anywhere in the world.',
				p6: "Containerisation has arguably been the single largest driver in globalisation over the last 60 years. About 90% of world trade is carried by the international shipping industry, and at any point in time there are about 6,000 large container ships active on the world's seas.",
				p7: 'Shipping is statistically the most carbon efficient and the least environmentally damaging form of commercial transport, however ships use fuels which produce greater levels of emissions than for example road diesel.',
				p8: '',
				p9: '',
				mapImg: 'Map.png'
			}
		},
		{
			id: 'sloop',
			color: '#a5dcc1',
			shadowColor: '#5aa9a4',
			corners: [
				{
					position: { x: 660, y: 225 },
					focus: { x: 0, y: 0 },
					focusMax: { x: -88, y: -175 },
					wobble: { x: -10, y: -10 },
					wobbleA: { x: -10, y: -10 },
					wobbleB: { x: 10, y: 10 },
					zoom: { x: 0, y: 0 },
					zoomMax: { x: -615, y: -190 },
					nudge: { x: 100, y: 0 },
					timeOffset: 1800
				},
				{
					position: { x: 1263, y: 250 },
					focus: { x: 0, y: 0 },
					focusMax: { x: 88, y: -175 },
					wobble: { x: 15, y: -5 },
					wobbleA: { x: 15, y: -5 },
					wobbleB: { x: -10, y: 10 },
					zoom: { x: 0, y: 0 },
					zoomMax: { x: -175, y: -200 },
					nudge: { x: 100, y: 0 },
					timeOffset: 100
				},
				{
					position: { x: 1240, y: 755 },
					focus: { x: 0, y: 0 },
					focusMax: { x: 88, y: 275 },
					wobble: { x: 5, y: -15 },
					wobbleA: { x: 5, y: -15 },
					wobbleB: { x: -5, y: -10 },
					zoom: { x: 0, y: 0 },
					zoomMax: { x: -145, y: 270 },
					nudge: { x: 100, y: 0 },
					timeOffset: 2900
				},
				{
					position: { x: 645, y: 775 },
					focus: { x: 0, y: 0 },
					focusMax: { x: -88, y: 275 },
					wobble: { x: -5, y: -5 },
					wobbleA: { x: -5, y: -5 },
					wobbleB: { x: 10, y: -15 },
					zoom: { x: 0, y: 0 },
					zoomMax: { x: -615, y: 260 },
					nudge: { x: 100, y: 0 },
					timeOffset: 700
				}
			],
			opacity: 1,
			vesselPath: "m 1065,890 c 0,0 315.17857,56.47322 359.46428,-147.8125 c 44.28572,-204.28571 -32.99811,-248.03008 14.19643,-332.14285 c 64.6591,-115.23908 261.16321,-193.75234 290.08929,-176.91965 c 156.57382,91.11356 -39.76455,266.03773 104.82143,296.875 c 142.6802,30.4308 282.85714,-24.28571 282.85714,-24.28571",
			pathColor: '#ef1f57',
			pngPrefix: 'sloop/ship2',
			content: {
				type: 'Royal Navy anti-submarine ship',
				weight: '895 gross tonnage',
				operational: 'August 1918 - July 1919',
				length: '55m',
				speed: '13 knots',
				propulsion: 'Single shaft steam engine',
				svg: 'sloop.svg',
				name: 'HMS Kildangan',
				p1: 'Named after Scottish and Irish towns beginning with "Kil", 55 Kil-class sloops were completed between 1917 and 1919, double-ended and painted in a way that made them not less but more visible, albeit optically distorted.',
				p2: 'The ships were equipped with hydrophones and depth charges to detect and destroy enemy submarines before they posed a threat to allied convoys, however the sloops were completed too late in the war to be used exclusively in that role.',
				p3: 'Between March and December 1917, British ships of all kinds were sunk at a rate of 23 a week. How to disguise ships at sea was an important question during World War I.',
				p4: 'Royal Naval Volunteer Reserve and marine artist Norman Wilkinson is credited for having invented the dazzle aesthetic. (Picasso allegedly said that cubists like himself had invented it.)',
				p5: 'Wilkinson arrived at the idea that a ship should be painted, "not for low visibility, but in such a way as to break up her form and thus confuse a submarine officer as to the course on which she was heading."',
				p6: "Whether dazzle camouflage worked as intended is still debated. Nevertheless, dazzle camouflage was used extensively during World War I in part because it boosted morale among crew.",
				p7: '',
				p8: '',
				p9: '',
				mapImg: 'Map.png'
			}
		},
		{
			id: 'david',
			color: '#f0b32d',
			shadowColor: '#ca8419',
			corners: [
				{
					position: { x: 1310, y: 300 },
					focus: { x: 0, y: 0 },
					focusMax: { x: -175, y: -175 },
					wobble: { x: -10, y: -10 },
					wobbleA: { x: -10, y: -10 },
					wobbleB: { x: 10, y: 10 },
					zoom: { x: 0, y: 0 },
					zoomMax: { x: -1260, y: -260 },
					timeOffset: 400
				},
				{
					position: { x: 1885, y: 250 },
					focus: { x: 0, y: 0 },
					focusMax: { x: 0, y: -175 },
					wobble: { x: 15, y: -5 },
					wobbleA: { x: 15, y: -5 },
					wobbleB: { x: -10, y: 10 },
					zoom: { x: 0, y: 0 },
					zoomMax: { x: -800, y: -210 },
					timeOffset: 700
				},
				{
					position: { x: 1875, y: 790 },
					focus: { x: 0, y: 0 },
					focusMax: { x: 0, y: 275 },
					wobble: { x: 5, y: -15 },
					wobbleA: { x: 5, y: -15 },
					wobbleB: { x: -5, y: -10 },
					zoom: { x: 0, y: 0 },
					zoomMax: { x: -800, y: 265 },
					timeOffset: 1800
				},
				{
					position: { x: 1310, y: 770 },
					focus: { x: 0, y: 0 },
					focusMax: { x: -175, y: 275 },
					wobble: { x: -5, y: -5 },
					wobbleA: { x: -5, y: -5 },
					wobbleB: { x: 10, y: -15 },
					zoom: { x: 0, y: 0 },
					zoomMax: { x: -1260, y: 290 },
					timeOffset: 2400
				}
			],
			opacity: 1,
			vesselPath: "m 1065,890 c 0,0 315.17857,56.47322 359.46428,-147.8125 c 44.28572,-204.28571 -32.99811,-248.03008 14.19643,-332.14285 c 64.6591,-115.23908 261.16321,-193.75234 290.08929,-176.91965 c 156.57382,91.11356 -39.76455,266.03773 104.82143,296.875 c 142.6802,30.4308 282.85714,-24.28571 282.85714,-24.28571",
			pathColor: '#ef1f57',
			pngPrefix: 'david/ship3',
			content: {
				type: 'Research vessel',
				weight: '15,000 gross tonnage',
				year: 'Construction began in 2016',
				length: '128m',
				range: '19,000 nautical miles',
				status: 'Launch planned in 2019',
				svg: 'david.svg',
				name: 'RRS Sir David Attenborough',
				p1: 'Conforming to stringent environmental regulations, the British Antarctic Survey (BAS) operated RRS Sir David Attenborough will be able to spend 60 days unsupported at sea, and will be deployed to the Arctic during the northern summer and to the Antarctic during the austral summer (in the Southern Hemisphere).',
				p2: 'With cabins, a scientific hangar with laboratory and office spaces, laundry facilities and social areas including a mess and gym, the ship will operate year-round, and be home to about 30 crew and 60 science and support staff.',
				p3: 'The RRS Sir David Attenborough will support multi-disciplinary science cruises, studying environmental change from the atmosphere to the sea-bed.',
				p4: "Onboard state-of-the-art facilities include:",
				p5: '<ul><li>Helideck and hangar for two helicopters</li><li>Special quiet engines</li><li>Remotely piloted aerial and deep-sea instruments</li><li>Enhanced science winch system with 12,000m of wire</li><li>Moon pool to deploy and recover instruments including "Boaty" submersible</li><li>Accurate positioning system to keep the ship still with instruments deployed</li><li>750m<sup>2</sup> of built-in laboratory space and additional containerised laboratories</li></ul>',
				p6: '',
				p7: '',
				p8: '',
				p9: '',
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
			if(panel === focusedPanel) {
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
		saveClick($(this).attr('id'));
		showContent($(this).attr('id'));
	});

	function showContent(id) {
		var panel = getPanel(id);
		shownPanel = panel;
		$('#menuContent').fadeOut('fast', function() {
			resetPngs();
		});
		zoomCanvases(id);
		zoomPanelBar(id);
		animateLine(raphCanvas, panel.pathColor, panel.vesselPath);
		startIdleTimeout();
	}

	function startIdleTimeout() {
		console.log("Starting Idle Timeout");
		idleTimeoutHandler = setTimeout(function() {
			backToMenu();
		}, idleTimeoutMax);
	}

	function clearIdleTimeout() {
		console.log("Clearing Idle Timeout");
		clearTimeout(idleTimeoutHandler);
		idleTimeoutHandler = null;
	}

	function zoomPanelBar(id) {
		var $parentBar = $('#' + id + ' .panelBar');
		$parentBar.clone().attr('id', 'newPanelBar').appendTo('body');
		$('#newPanelBar').show();
		$('#newPanelBar').offset($parentBar.offset());
		$('#newPanelBar').width($parentBar.width());
		$('#newPanelBar').height($parentBar.height());
		setTimeout(function() {
			$('#newPanelBar').addClass('animPanelBar');
			$('#newPanelBar').addClass(id);
			// var css = {
			// 	'left': '200px',
			// 	'top': ($('#contentText').offset().top - 55) + 'px',
			// 	'width': '175px'
			// }
			// $('#newPanelBar').animate(css, zoomTweenTime, 'easeOutCubic', function() {

			// });
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
		clearCountHandler();
		$('#count').addClass('hidden');
		cycleHandler = undefined;
		panels.forEach(function(panel) {
			if(panel.id === id) {
				loadZoomContent(panel);
				panel.corners.forEach(function(corner) {
					corner.focusTween = new TWEEN.Tween(corner.focus)
					.to({x: 0, y: 0}, zoomTweenTime)
					.easing(TWEEN.Easing.Cubic.In)
					.onComplete(function() { 
						corner.focusTween = undefined; 
						if(!showingContent) {
							showingContent = true;
							$('#shownContent').removeClass('hidden');
							$('#shownContent').removeClass('encounter david sloop');
							$('#shownContent').addClass(id);
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
			$('#labelStatus .labelText').text('Status');
			$('#pStatus').text(panel.content.status);
		} else {
			$('#labelStatus .labelText').text('Operational');
			$('#pStatus').text(panel.content.operational);
		}
		if(panel.content.range) {
			$('#speedRangeLabel').text('Range');
			$('#pSpeed').text(panel.content.range);
		} else {
			$('#speedRangeLabel').text('Speed');
			$('#pSpeed').text(panel.content.speed);
		}
		if(panel.content.year) {
			$('#pYear').text(panel.content.year);
			$('#labelYear .labelText').text('Year built');
		} else {
			$('#pYear').text(panel.content.propulsion);
			$('#labelYear .labelText').text('Propulsion');
		}
		$('#pLength').text(panel.content.length);
		var path = 'img/' + panel.content.svg;
		$('#topPanelRight img').attr('src', path);
		$('#shownContent h1').text(panel.content.name);
		$('#contentP1').html(panel.content.p1);
		$('#contentP2').html(panel.content.p2);
		$('#contentP3').html(panel.content.p3);
		$('#contentP4').html(panel.content.p4);
		$('#contentP5').html(panel.content.p5);
		$('#contentP6').html(panel.content.p6);
		$('#contentP7').html(panel.content.p7);
		$('#contentP8').html(panel.content.p8);
		$('#contentP9').html(panel.content.p9);
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
					"stroke-width": '5',
					"stroke-linecap": 'round'
				});
			}
		});
	};


	function backToMenu() {
		clearIdleTimeout();
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


	$('#counterBtn').click(function() {
		updateClickCounterDisplay();
		if($('#count').hasClass('hidden')) {
			$('#count').removeClass('hidden');
			counterHideHandler = setTimeout(function() {
				$('#count').addClass('hidden');
				clearCountHandler();
			}, counterHideTime);
		} else {
			$('#count').addClass('hidden');
		}
	});

	function setupLocalStorage() {
		var responses = {
			'encounter': 0,
			'sloop': 0,
			'david': 0
		}
		return responses;
	}

	function clearLocalStorage() {
		localStorage.removeItem('responses');
	}

	function saveClick(id) {
		var newResponseObj = {};
		if(localStorage.getItem('responses')) {
			// console.log(JSON.parse(localStorage.getItem('responses')));
			newResponseObj = JSON.parse(localStorage.getItem('responses'));
			newResponseObj[id]++;
		} else {
			newResponseObj = setupLocalStorage();
			newResponseObj[id]++;
		}
		console.log(newResponseObj);
		updateClickCounterDisplay();
		localStorage.setItem('responses', JSON.stringify(newResponseObj, null, 2));
	}

	function updateClickCounterDisplay() {
		var responseCount = JSON.parse(localStorage.getItem('responses'));
		$('#count_encounter').text(responseCount['encounter']);
		$('#count_sloop').text(responseCount['sloop']);
		$('#count_david').text(responseCount['david']);
	}

	function clearCountHandler() {
		clearTimeout(counterHideHandler);
		counterHideHandler = undefined;
	}

	//	Prevent accessing of context menu in production
	$(document).on("contextmenu", function(e){
		if(disableContextMenu) {
			e.preventDefault();
		}
	});


	// clearLocalStorage();
	setup();

});