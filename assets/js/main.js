$(document).ready(function() {
    draw();
	// Header Scroll
    $("#header-background").height($("#innerbanner").height())

//    
//	$(window).on('scroll', function() {
//		var scroll = $(window).scrollTop();
//
//		if (scroll >= 50) {
//			$('#header').addClass('fixed');
//		} else {
//			$('#header').removeClass('fixed');
//		}
//	});

	// Waypoints
	$('.work').waypoint(function() {
		$('.work').addClass('animated fadeIn');
	}, {
		offset: '75%'
	});
	$('.download').waypoint(function() {
		$('.download .btn').addClass('animated tada');
	}, {
		offset: '75%'
	});

	// Fancybox
	$('.work-box').fancybox();

	
	// Page Scroll
	var sections = $('section')
		nav = $('nav[role="navigation"]');

	$(window).on('scroll', function () {
	  	var cur_pos = $(this).scrollTop();
	  	sections.each(function() {
	    	var top = $(this).offset().top - 76
	        	bottom = top + $(this).outerHeight();
	    	if (cur_pos >= top && cur_pos <= bottom) {
	      		nav.find('a').removeClass('active');
	      		nav.find('a[href="#'+$(this).attr('id')+'"]').addClass('active');
	    	}
	  	});
	});
	nav.find('a').on('click', function () {
	  	var $el = $(this)
	    	id = $el.attr('href');
		$('html, body').animate({
			scrollTop: $(id).offset().top - 75
		}, 500);
	  return false;
	});

	// Mobile Navigation
	$('.nav-toggle').on('click', function() {
		$(this).toggleClass('close-nav');
		nav.toggleClass('open');
		return false;
	});	
	nav.find('a').on('click', function() {
		$('.nav-toggle').toggleClass('close-nav');
		nav.toggleClass('open');
	});
});

    var nodes = null;
    var edges = null;
    var network = null;

    // Called when the Visualization API is loaded.
    function draw() {
      // create people.
      // value corresponds with the age of the person
        
      nodes = [
        {id: 1,  shape: 'circularImage', image: '/images/me.jpg'},
        {id: 2,  shape: 'circularImage', image: '/images/html5.png'}, // html5
        {id: 3,  shape: 'circularImage', image: '/images/css3.png'}, //css3
        {id: 4,  shape: 'circularImage', image: '/images/JS.png'}, ///js
        {id: 5,  shape: 'circularImage', image: '/images/PHP.png'}, //php
        {id: 6,  shape: 'circularImage', image: '/images/mysql.svg'}, //mysql
        {id: 7,  shape: 'circularImage', image: '/images/laravel.png'}, // laravel
        {id: 8,  shape: 'circularImage', image: '/images/bootstrap.png'}, // bootstarp
        {id: 9,  shape: 'circularImage', image: '/images/codeigniter.svg'}, // codeigniter
        {id: 10,  shape: 'circularImage', image: '/images/nodejs.jpg'}, // nodejs
        {id: 11,  shape: 'circularImage', image: '/images/cakephp.svg'}, ///cakephp
        {id: 12,  shape: 'circularImage', image: '/images/vue.jpg'}, // vue
        {id: 13,  shape: 'circularImage', image: '/images/redis.svg'}, // resis
        {id: 14,  shape: 'circularImage', image: '/images/react.svg'}, // react
        {id: 15,  shape: 'circularImage', image: '/images/jquery.jpg'}, // jquery
        {id: 16,  shape: 'circularImage', image: '/images/mongo-db.jpeg'}, // mongodb
        {id: 17,  shape: 'circularImage', image: '/images/electron.png'}, // mongodb
      ];

      // create connections between people
      // value corresponds with the amount of contact between two people
      edges = [
        {from: 2, to: 1}, 
        {from: 3, to: 1}, 
        {from: 4, to: 1}, 
        {from: 5, to: 1}, 
        {from: 6, to: 1},
        {from: 5, to: 7},
        {from: 3, to: 8},
        {from: 2, to: 8},
        {from: 4, to: 8},
        {from: 5, to: 9},
        {from: 4, to: 10},
        {from: 14, to: 4},
        {from: 13, to: 1},
        {from: 11, to: 5},
        {from: 12, to: 4},
        {from: 15, to: 4},
        {from: 16, to: 1},
        {from: 17, to: 4},
      ];

      // create a network
      var container = document.getElementById('my-skills');
      var data = {
        nodes: nodes,
        edges: edges
      };
      var options = {
         interaction:{
          zoomView: false
         },
        nodes: {
          borderWidth:3,
          size:38,
	      color: {
            border: '#3273dc',
            background: '#fff'
          },
          font:{color:'#000'},
            shadow:true
        },
        edges: {
          color: '#3273dc'
        }
      };
      network = new vis.Network(container, data, options);
        
         network.on("afterDrawing", function (ctx) {
            var nodeId = 1;
            var nodePosition = network.getPositions([nodeId]);
             network.selectNodes([nodeId]);
                        ctx.strokeStyle = '#3273dc';
                      
                        ctx.circle(nodePosition[nodeId].x, nodePosition[nodeId].y,48);
                        
                        ctx.stroke();

                 
             
             
          });
    }