var AUDIO = AUDIO || {};

var Simple1DNoise = function() {
    var MAX_VERTICES = 256;
    var MAX_VERTICES_MASK = MAX_VERTICES -1;
    var amplitude = 1;
    var scale = 1;

    var r = [];

    for ( var i = 0; i < MAX_VERTICES; ++i ) {
        r.push(Math.random());
    }

    var getVal = function( x ){
        var scaledX = x * scale;
        var xFloor = Math.floor(scaledX);
        var t = scaledX - xFloor;
        var tRemapSmoothstep = t * t * ( 3 - 2 * t );

        /// Modulo using &
        var xMin = xFloor & MAX_VERTICES_MASK;
        var xMax = ( xMin + 1 ) & MAX_VERTICES_MASK;

        var y = lerp( r[ xMin ], r[ xMax ], tRemapSmoothstep );

        return y * amplitude;
    };

    /**
    * Linear interpolation function.
    * @param a The lower integer value
    * @param b The upper integer value
    * @param t The value between the two
    * @returns {number}
    */
    var lerp = function(a, b, t ) {
        return a * ( 1 - t ) + b * t;
    };

    // return the API
    return {
        getVal: getVal,
        setAmplitude: function(newAmplitude) {
            amplitude = newAmplitude;
        },
        setScale: function(newScale) {
            scale = newScale;
        }
    };
};

AUDIO.VISUALIZER = (function () {
    'use strict';

    var INTERVAL = null;
    var FFT_SIZE = 512;
    var TYPE = {
            'lounge': 'renderLounge'
        };

    /**
     * @description
     * Visualizer constructor.
     *
     * @param {Object} cfg
     */

    function Visualizer (cfg) {
        this.isPlaying = false;
        this.autoplay = cfg.autoplay || false;
        this.loop = cfg.loop || false;
        this.audio = document.getElementById(cfg.audio) || {};
        this.canvas = document.getElementById(cfg.canvas) || {};
        this.canvasCtx = this.canvas.getContext('2d') || null;
        this.author = this.audio.getAttribute('data-author') || '';
        this.title = this.audio.getAttribute('data-title') || '';
        this.ctx = null;
        this.analyser = null;
        this.sourceNode = null;
        this.frequencyData = [];
        this.audioSrc = null;
        this.duration = 0;
        this.minutes = '00';
        this.seconds = '00';
        this.style = cfg.style || 'lounge';
        this.barWidth = cfg.barWidth || 2;
        this.barHeight = cfg.barHeight || 2;
        this.barSpacing = cfg.barSpacing || 5;
        this.barColor = cfg.barColor || '#ffffff';
        this.shadowBlur = cfg.shadowBlur || 10;
        this.shadowColor = cfg.shadowColor || '#ffffff';
        this.font = cfg.font || ['12px', 'Helvetica'];
        this.gradient = null;
        
        //extension
        
        this.imageURL = this.audio.getAttribute('data-image') || '';
        this.image = null;
        this.radius = cfg.radius || 75;
        
    }

    /**
     * @description
     * Set current audio context.
     *
     * @return {Object}
     */
    Visualizer.prototype.setContext = function () {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new window.AudioContext();
            return this;
        } catch (e) {
            console.info('Web Audio API is not supported.', e);
        }
    };

    /**
     * @description
     * Set buffer analyser.
     *
     * @return {Object}
     */
    Visualizer.prototype.setAnalyser = function () {
        this.analyser = this.ctx.createAnalyser();
        this.analyser.smoothingTimeConstant = 0.6;
        this.analyser.fftSize = FFT_SIZE;
        return this;
    };
    
    Visualizer.prototype.getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * @description
     * Set frequency data.
     *
     * @return {Object}
     */
    Visualizer.prototype.setFrequencyData = function () {
        this.frequencyData = window.crypto.getRandomValues(new Uint8Array(256));
        return this;
    };

    
    /**
     * @description
     * Set source buffer and connect processor and analyser.
     *
     * @return {Object}
     */
    Visualizer.prototype.setBufferSourceNode = function () {
        this.sourceNode = this.ctx.createBufferSource();
        
        this.gainNode = this.ctx.createGain();
        this.gainNode.connect(this.ctx.destination)
        this.gainNode.gain.value = 0;
        
        this.sourceNode.loop = this.loop;
        // Create a gain node.
        
        
        
        this.sourceNode.connect(this.analyser);
        this.sourceNode.connect(this.ctx.destination);
        this.sourceNode.connect(this.gainNode);
    
        
        // Reduce the volume.
        

        this.sourceNode.onended = function () {
            clearInterval(INTERVAL);
            this.sourceNode.disconnect();
            this.resetTimer();
            this.isPlaying = false;
            this.sourceNode = this.ctx.createBufferSource();
        }.bind(this);

        return this;
    };

    /**
     * @description
     * Set current media source url.
     *
     * @return {Object}
     */
    Visualizer.prototype.setMediaSource = function () {
        this.audioSrc = this.audio.getAttribute('src');
        return this;
    };

    /**
     * @description
     * Set canvas gradient color.
     *
     * @return {Object}
     */
    Visualizer.prototype.setCanvasStyles = function () {
        this.gradient = this.canvasCtx.createLinearGradient(0, 0, 0, 300);
        this.gradient.addColorStop(1, this.barColor);
        this.canvasCtx.fillStyle = this.gradient;
        this.canvasCtx.shadowBlur = this.shadowBlur;
        this.canvasCtx.shadowColor = this.shadowColor;
        this.canvasCtx.font = this.font.join(' ');
        this.canvasCtx.textAlign = 'center';
        return this;
    };

    /**
     * @description
     * Bind click events.
     *
     * @return {Object}
     */
    Visualizer.prototype.bindEvents = function () {
        var _this = this;

        document.addEventListener('click', function (e) {
            if (e.target === _this.canvas) {
                e.stopPropagation();
                if (!_this.isPlaying) {
                    return (_this.ctx.state === 'suspended') ? _this.playSound() : _this.loadSound();
                } else {
                    return _this.pauseSound();
                }
            }
        });

        if (_this.autoplay) {
            _this.loadSound();
        }

        return this;
    };

    /**
     * @description
     * Load sound file.
     */
    Visualizer.prototype.loadSound = function () {
        var req = new XMLHttpRequest();
        req.open('GET', this.audioSrc, true);
        req.responseType = 'arraybuffer';
        this.canvasCtx.fillText('Loading...', this.canvas.width / 2 + 10, this.canvas.height / 2);
        var img = new Image();
        req.onload = function () {
            var _this = this;
            img.onload = function(){
                _this.image = img;
                _this.ctx.decodeAudioData(req.response, _this.playSound.bind(_this), _this.onError.bind(_this));
            }
            
            img.src = this.imageURL;
            
        }.bind(this);

        req.send();
    };

    /**
     * @description
     * Play sound from the given buffer.
     *
     * @param  {Object} buffer
     */
    Visualizer.prototype.playSound = function (buffer) {
        this.isPlaying = true;

        if (this.ctx.state === 'suspended') {
            return this.ctx.resume();
        }

        this.sourceNode.buffer = buffer;
        this.sourceNode.start(0);
        this.resetTimer();
        this.startTimer();
        this.renderFrame();
    };

    /**
     * @description
     * Pause current sound.
     */
    Visualizer.prototype.pauseSound = function () {
        this.ctx.suspend();
        this.isPlaying = false;
    };

    /**
     * @description
     * Start playing timer.
     */
    Visualizer.prototype.startTimer = function () {
        var _this = this;
        INTERVAL = setInterval(function () {
            if (_this.isPlaying) {
                var now = new Date(_this.duration);
                var min = now.getHours();
                var sec = now.getMinutes();
                _this.minutes = (min < 10) ? '0' + min : min;
                _this.seconds = (sec < 10) ? '0' + sec : sec;
                _this.duration = now.setMinutes(sec + 1);
            }
        }, 1000);
    };

    /**
     * @description
     * Reset time counter.
     */
    Visualizer.prototype.resetTimer = function () {
        var time =  new Date(0, 0);
        this.duration = time.getTime();
    };

    /**
     * @description
     * On audio data stream error fn.
     *
     * @param  {Object} e
     */
    Visualizer.prototype.onError = function (e) {
        console.info('Error decoding audio file. -- ', e);
    };

    /**
     * @description
     * Render frame on canvas.
     */
    Visualizer.prototype.renderFrame = function () {
        requestAnimationFrame(this.renderFrame.bind(this));
        this.analyser.getByteFrequencyData(this.frequencyData);

        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.renderTime();
        this.renderText();
        this.renderByStyleType();
    };

    /**
     * @description
     * Render audio author and title.
     */
    Visualizer.prototype.renderText = function () {
        var cx = this.canvas.width / 2;
        var cy = this.canvas.height / 2;
        var correction = 10;
        this.canvasCtx.textBaseline = 'top';
        this.canvasCtx.fillText('by ' + this.author, cx + correction, cy);
        this.canvasCtx.font = parseInt(this.font[0], 10) + 8 + 'px ' + this.font[1];
        this.canvasCtx.textBaseline = 'bottom';
        this.canvasCtx.fillText(this.title, cx + correction, cy);
        this.canvasCtx.font = this.font.join(' ');
        
        
    };

    /**
     * @description
     * Render audio time.
     */
    Visualizer.prototype.renderTime = function () {
        var time = this.minutes + ':' + this.seconds;
        this.canvasCtx.fillText(time, this.canvas.width / 2 + 10, this.canvas.height / 2 + 40);
    };

    /**
     * @description
     * Render frame by style type.
     *
     * @return {Function}
     */
    Visualizer.prototype.renderByStyleType = function () {
        return this[TYPE[this.style]]();
    };

    /**
     * @description
     * Render lounge style type.
     */
    Visualizer.prototype.renderLounge = function () {
        var cx = this.canvas.width / 2;
        var cy = this.canvas.height / 2;
        var radius = this.radius;
        var maxBarNum = Math.floor((radius * 2 * Math.PI) / (this.barWidth + this.barSpacing));
        var slicedPercent = Math.floor((maxBarNum * 0) / 100);
        var barNum = maxBarNum - slicedPercent;
        var freqJump = Math.floor(this.frequencyData.length / maxBarNum);
        //console.log(this.frequencyData);
      

     
        for (var i = 0; i < barNum; i++) {
            var amplitude = this.frequencyData[i]; //changed
            var alfa = (i * 2 * Math.PI ) / maxBarNum;
            var beta = (3 * 45 - this.barWidth) * Math.PI / 180;
            var x = 0;
            var y = radius - (amplitude / 12 - this.barHeight);
          
            var w = this.barWidth;
             var generator = new Simple1DNoise();
            var h = amplitude / 6 + this.barHeight + (generator.getVal(x) * 10);
            
             

            this.canvasCtx.save();
            this.canvasCtx.translate(cx + this.barSpacing, cy + this.barSpacing);
            this.canvasCtx.rotate(alfa - beta);
            this.canvasCtx.fillRect(x, y, w, h);
            this.canvasCtx.restore();
        }
        
                
        this.canvasCtx.save();
        this.canvasCtx.translate(-radius+2, -radius+2);
        this.canvasCtx.beginPath();
        this.canvasCtx.arc((cx+radius), (cy+radius), radius, 0, Math.PI * 2, true);
        this.canvasCtx.closePath();
        this.canvasCtx.clip();

        this.canvasCtx.drawImage(this.image, cx, cy, 2*radius, 2*radius);

        this.canvasCtx.beginPath();
        this.canvasCtx.arc(cx, cy, radius, 0, Math.PI * 2, true);
        this.canvasCtx.clip();
        this.canvasCtx.closePath();
        this.canvasCtx.restore();
    };

    /**
     * @description
     * Create visualizer object instance.
     *
     * @param  {Object} cfg
     * {
     *     autoplay: <Bool>,
     *     loop: <Bool>,
     *     audio: <String>,
     *     canvas: <String>,
     *     style: <String>,
     *     barWidth: <Integer>,
     *     barHeight: <Integer>,
     *     barSpacing: <Integer>,
     *     barColor: <String>,
     *     shadowBlur: <Integer>,
     *     shadowColor: <String>,
     *     font: <Array>
     * }
     * @return {Function}
     * @private
     */
    function _createVisualizer (cfg) {
        var visualizer = new Visualizer(cfg);

        return function () {
            visualizer
                .setContext()
                .setAnalyser()
                .setFrequencyData()
                .setBufferSourceNode()
                .setMediaSource()
                .setCanvasStyles()
                .bindEvents();

            return visualizer;
        };
    }

    /**
     * @description
     * Get visualizer instance.
     *
     * @param  {Object} cfg
     * @return {Object}
     * @public
     */
    function getInstance (cfg) {
        return _createVisualizer(cfg)();
    }

    /**
     * @description
     * Visualizer module API.
     *
     * @public
     */
    return {
        getInstance: getInstance
    };
})();

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    AUDIO.VISUALIZER.getInstance({
        autoplay: true,
        loop: true,
        audio: 'myAudio',
        canvas: 'myCanvas',
        style: 'lounge',
        barWidth: 2,
        barHeight: 2,
        barSpacing: 2,
        barColor: 'rgba(255,255,255,1)',
        shadowBlur: 20,
        shadowColor: 'rgba(255,255,255,0.3)',
        font: ['12px', 'Helvetica'],
        radius : 75
    });
}, false);
