import constants from '../konstantes.js';
import utils from '../utils.js'


let TRANSITION_DURATION = constants.ZOOM_DURATION || 800;

// The current zoom level (scale)
let level = 1;

let body = window.document.body;

// Timeout before pan is activated
let panEngageTimeout = -1,
		panUpdateInterval = -1;

	// Timeout for callback function
let callbackTimeout = -1;


// Check for transform support so that we can fallback otherwise
let supportsTransforms = 	'WebkitTransform' in body.style ||
              'MozTransform' in body.style ||
              'msTransform' in body.style ||
              'OTransform' in body.style ||
              'transform' in body.style;


function magnify( rect, scale ) {

		// var scrollOffset = getScrollOffset(rect);
		var scrollOffset = getScrollOffset();

		// Ensure a width/height is set
		rect.width = rect.width || 1;
		rect.height = rect.height || 1;

		// Center the rect within the zoomed viewport
		rect.x -= ( window.innerWidth - ( (rect.width )  * scale ) ) / 2 ;
		rect.y -= ( window.innerHeight - ( (rect.height) * scale ) ) / 2;

		if( supportsTransforms ) {
			// Reset
			if( scale === 1 ) {
        utils.styled(body, "transform");
        utils.styled(body, "OTransform");
        utils.styled(body, "msTransform");
        utils.styled(body, "MozTransform");
        utils.styled(body, "WebkitTransform");
			}
			// Scale
			else {
				var origin = scrollOffset.x +'px '+ scrollOffset.y +'px',
					  transform = 'translate('+ -rect.x +'px,'+ -rect.y +'px) scale('+ scale +')';
        utils.styled(body, "transformOrigin", origin);
        utils.styled(body, "OTransformOrigin", origin);
        utils.styled(body, "msTransformOrigin", origin);
        utils.styled(body, "MozTransformOrigin", origin);
        utils.styled(body, "WebkitTransformOrigin", origin);


        utils.styled(body, "transform", transform);
        utils.styled(body, "OTransform", transform);
        utils.styled(body, "msTransform", transform);
        utils.styled(body, "MozTransform", transform);
        utils.styled(body, "WebkitTransform", transform);
			}
		}
		else {
			// Reset
			if( scale === 1 ) {
        utils.styled(body, "position");
        utils.styled(body, "left");
        utils.styled(body, "top");
        utils.styled(body, "width");
        utils.styled(body, "height");
        utils.styled(body, "zoom");
			}
			// Scale
			else {
				utils.styled(body, "position", 'relative');
        utils.styled(body, "left", ( - ( scrollOffset.x + rect.x ) / scale ) + 'px');
        utils.styled(body, "top", ( - ( scrollOffset.y + rect.y ) / scale ) + 'px');
        utils.styled(body, "width", ( scale * 100 ) + '%');
        utils.styled(body, "height", ( scale * 100 ) + '%');
        utils.styled(body, "zoom", scale);
			}
		}

		level = scale;
	}

	/**
	 * Pan the document when the mouse cursor approaches the edges
	 * of the window.
	 */
	function pan() {
    // console.log("IN PANNNNN!")
		var range = 0.12,
			rangeX = window.innerWidth * range,
			rangeY = window.innerHeight * range,
			scrollOffset = getScrollOffset();

		// Up
		if( window.suited.mouseY < rangeY ) {
			window.scroll( scrollOffset.x, scrollOffset.y - ( 1 - ( window.suited.mouseY / rangeY ) ) * ( 14 / level ) );
		}
		// Down
		else if( window.suited.mouseY > window.innerHeight - rangeY ) {
			window.scroll( scrollOffset.x, scrollOffset.y + ( 1 - ( window.innerHeight - window.suited.mouseY ) / rangeY ) * ( 14 / level ) );
		}

		// Left
		if( window.suited.mouseX < rangeX ) {
			window.scroll( scrollOffset.x - ( 1 - ( window.suited.mouseX / rangeX ) ) * ( 14 / level ), scrollOffset.y );
		}
		// Right
		else if( window.suited.mouseX > window.innerWidth - rangeX ) {
			window.scroll( scrollOffset.x + ( 1 - ( window.innerWidth - window.suited.mouseX ) / rangeX ) * ( 14 / level ), scrollOffset.y );
		}
	}

	function getScrollOffset(rect) {
		//allow for fact that body may be skewed relative to viewport
		var bbounds = document.body.getBoundingClientRect();
		var fixupX = bbounds.left;
		var fixupY = bbounds.top;
		var ret = {
			x: -fixupX ,
			y: -fixupY
			// x: window.scrollX !== undefined ? (parseInt(window.scrollX) - fixupX) : (parseInt(window.pageXOffset) - parseInt(bbounds.left)),
			// y: window.scrollY !== undefined ? (parseInt(window.scrollY) - fixupY) : (parseInt(window.pageYOffset) + parseInt(bbounds.top))
		}

		return ret;
	}

let zoom = {
  "setup": function() {
    if( supportsTransforms ) {
      // The easing that will be applied when we zoom in/out
      utils.styled(body, "transition", 'transform '+ TRANSITION_DURATION +'ms ease');
      utils.styled(body, "OTransition", '-o-transform '+ TRANSITION_DURATION +'ms ease');
      utils.styled(body, "msTransition", '-ms-transform '+ TRANSITION_DURATION +'ms ease');
      utils.styled(body, "MozTransition", '-moz-transform '+ TRANSITION_DURATION +'ms ease');
      utils.styled(body, "WebkitTransition", '-webkit-transform '+ TRANSITION_DURATION +'ms ease');
    }
  },

  "teardown": function() {
    if( supportsTransforms ) {
      // remove inline style
      utils.styled(body, "transition");
      utils.styled(body, "OTransition");
      utils.styled(body, "msTransition");
      utils.styled(body, "MozTransition");
      utils.styled(body, "WebkitTransition");
    }
  },

  /**
		 * Zooms in on either a rectangle or HTML element.
		 *
		 * @param {Object} options
		 *
		 *   (required)
		 *   - element: HTML element to zoom in on
		 *   OR
		 *   - x/y: coordinates in non-transformed space to zoom in on
		 *   - width/height: the portion of the screen to zoom in on
		 *   - scale: can be used instead of width/height to explicitly set scale
		 *
		 *   (optional)
		 *   - callback: call back when zooming in ends
		 *   - padding: spacing around the zoomed in element
		 */
		to: function( options ) {

			// Due to an implementation limitation we can't zoom in
			// to another element without zooming out first
			if( level !== 1 ) {
				zoom.out();
			}
			else {
				options.x = options.x || 0;
				options.y = options.y || 0;

				// If an element is set, that takes precedence
				if( !!options.element ) {
					// Space around the zoomed in element to leave on screen
					var padding = typeof options.padding === 'number' ? options.padding : 20;
					var bounds = options.element.getBoundingClientRect();
					var bbounds = document.body.getBoundingClientRect();

					options.x = bounds.left - padding;
					options.y = bounds.top - padding;
					options.width = bounds.width + ( padding * 2 );
					options.height = bounds.height + ( padding * 2 );
				}

				// If width/height values are set, calculate scale from those values
				if( options.width !== undefined && options.height !== undefined ) {
					// options.scale = Math.max( Math.min( document.body.clientWidth / options.width, document.body.clientHeight / options.height ), 1 );
					options.scale = Math.max( Math.min( window.innerWidth / options.width, window.innerHeight / options.height ), 1 );
				}

				if( options.scale > 1 ) {
					options.x *= options.scale;
					options.y *= options.scale;

					options.x = Math.max( options.x, 0 );
					options.y = Math.max( options.y, 0 );

					magnify( options, options.scale );

					if( options.pan !== false ) {
              console.log("PANNING IT!!!!!!!!")
						// Wait with engaging panning as it may conflict with the
						// zoom transition
						panEngageTimeout = setTimeout( function() {
							panUpdateInterval = setInterval( pan, 1000 / 60 );
						}, TRANSITION_DURATION );

					}

					if( typeof options.callback === 'function' ) {
						callbackTimeout = setTimeout( options.callback, TRANSITION_DURATION );
					}
				}
			}
		},

		/**
		 * Resets the document zoom state to its default.
		 *
		 * @param {Object} options
		 *   - callback: call back when zooming out ends
		 */
		out: function( options ) {
			clearTimeout( panEngageTimeout );
			clearInterval( panUpdateInterval );
			clearTimeout( callbackTimeout );

			magnify( { x: 0, y: 0 }, 1 );

			if( options && typeof options.callback === 'function' ) {
				setTimeout( options.callback, TRANSITION_DURATION );
			}

			level = 1;
		},

		// Alias
		magnify: function( options ) { this.to( options ) },
		reset: function() { this.out() },

		zoomLevel: function() {
			return level;
		}
};


export default zoom;
