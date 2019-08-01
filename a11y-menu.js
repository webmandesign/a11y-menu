/**
 * @package      A11y Menu
 * @description  A keyboard accessible navigational menu script.
 * @version      0.0.9
 * @author       WebMan Design, Oliver Juhas, https://www.webmandesign.eu
 * @copyright    2019 WebMan Design, Oliver Juhas
 * @license      GPL-3.0-or-later, https://www.gnu.org/licenses/gpl-3.0-standalone.html
 * @link         https://github.com/webmandesign/a11y-menu
 */

/* global window, document, a11yMenuConfig */

( function( options ) {

	const a11yMenu = {

		// Initialization

			/**
			 * Initializes the functionality on DOM load.
			 *
			 * @param  {Object} options={}  Configuration options.
			 *
			 * @return  {Void}
			 */
			init: function( options = {} ) {
				const _ = this;

				// Set options first.
				_.setOptions( options );

				// Load required polyfills first (already used in getMenus()).
				_.polyfill();

				// No point if there is no menu to process.
				if ( ! _.getMenus().length || ! _.getOption( 'expanded_class' ) ) {
					return;
				}

				// Iterate over each menu.
				_.getMenus().forEach( ( menu ) => {

					// Get child menus.
					const childMenus = menu.querySelectorAll( _.getOption( 'child_menu_selector' ) );

					// No point if there is no child menu in the menu.
					if ( ! Object.keys( childMenus ).length ) {
						return;
					}

					// Get child menu toggle button from configured attributes object.
					const button = _.getButton( _.getOption( 'button_attributes' ) );

					// Iterate over each child menu in the menu.
					childMenus.forEach( ( childMenu ) => {
						const
							menuItem    = childMenu.parentNode,
							childButton = button.cloneNode( true );

						// Set `aria-haspopup` to indicate we have a child menu within the menu item.
						menuItem.setAttribute( 'aria-haspopup', 'true' );

						// Prepend child menu with toggle button.
						menuItem.insertBefore( childButton, childMenu );

						// Watch for touch event on a link within.
						const link = menuItem.querySelector( 'a[href]' );
						if ( null != link ) {
							link.addEventListener( 'touchstart', ( event ) => _.onTouch( event ), true );
						}
					} );

					// Watch for focus events within the menu, but don't bubble up.
					menu.addEventListener( 'focusin', ( event ) => _.onFocus( event ), true );
					menu.addEventListener( 'focusout', ( event ) => _.onFocus( event ), true );

					// Watch for click/touch event on toggle buttons within the menu.
					const selectorButton = _.getOption( 'button_selector' );
					if ( selectorButton ) {
						menu.querySelectorAll( selectorButton ).forEach( ( button ) => {
							button.addEventListener( 'mousedown', ( event ) => _.onClick( event ) );
						} );
					}

					// Watch for keydown event (checking for ESC key).
					document.addEventListener( 'keydown', ( event ) => _.onKeydown( event ) );

				} );
			},

		// Events

			/**
			 * Action on focus/blur event within the menu.
			 *
			 * @param  {Event} event
			 *
			 * @return  {Void}
			 */
			onFocus: function( event ) {
				const
					_ = this,
					parents = _.getParents( event );

				if ( 'focusin' === event.type ) {
					parents.map( ( menuItem ) => menuItem.classList.add( _.getOption( 'expanded_class' ) ) );
				} else {
					parents.map( ( menuItem ) => menuItem.classList.remove( _.getOption( 'expanded_class' ) ) );
				}

				// Toggle button attributes.
				_.changeButtonAttributes( event );
				parents.map( ( menuItem ) => _.changeButtonAttributes( menuItem ) );
			},

			/**
			 * Action on click/touch event on the toggle button.
			 *
			 * @param  {Event} event
			 *
			 * @return  {Void}
			 */
			onClick: function( event ) {
				const
					_ = this,
					classExpanded = _.getOption( 'expanded_class' ),
					menuItem      = event.target.parentNode,
					isExpanded    = menuItem.classList.contains( classExpanded );

				// Remove the class from siblings.
				let siblings = _.getSiblings( menuItem );
				siblings.map( ( sibling ) => sibling.classList.remove( classExpanded ) );

				// Toggle the class on direct parent menu item only.
				if ( isExpanded ) {
					menuItem.classList.remove( classExpanded );
				} else {
					menuItem.classList.add( classExpanded );
				}

				// Toggle button attributes.
				_.changeButtonAttributes( event );
			},

			/**
			 * Action on touch event on the link within the expandable menu item.
			 *
			 * @param  {Event} event
			 *
			 * @return  {Void}
			 */
			onTouch: function( event ) {
				const
					_ = this,
					link     = event.target,
					menuItem = link.parentNode;

				if ( ! menuItem.classList.contains( _.getOption( 'expanded_class' ) ) ) {
					// Touched once, child menu is collapsed - expanded child menu (toggle focus).
					event.preventDefault();
					link.focus();
				} else if ( link !== document.activeElement ) {
					// Touched once, child menu is expanded - collapse child menu.
					event.preventDefault();
					menuItem.classList.remove( _.getOption( 'expanded_class' ) );

					// Toggle button attributes.
					_.changeButtonAttributes( event );
				}
			},

			/**
			 * Action on a keyboard key press.
			 *
			 * @param  {Event} event
			 *
			 * @return  {Void}
			 */
			onKeydown: function( event ) {
				// ESC key.
				if ( 27 === event.keyCode ) {
					const
						_ = this,
						classExpanded = _.getOption( 'expanded_class' );

					_.getMenus().forEach( ( menu ) => {
						menu.querySelectorAll( '.' + classExpanded ).forEach( ( menuItem ) => {
							menuItem.classList.remove( classExpanded );

							// Toggle button attributes.
							_.changeButtonAttributes( menuItem );
						} );
					} );
				}
			},

		// Elements

			/**
			 * Sets and returns an array of all accessible menu containers we are processing.
			 *
			 * @return  {Object} Array of menu container nodes, or an empty array.
			 */
			getMenus: function() {
				const
					_ = this,
					selector = _.getOption( 'menu_selector' );

				if ( ! _.menus.length && selector ) {
					document.querySelectorAll( selector ).forEach( ( menu ) => _.menus.push( menu ) );
				}

				return _.menus;
			},

			/**
			 * Returns an array of sibling nodes (expandable menu items by default).
			 *
			 * @param  {node} node  DOM node to get siblings for.
			 *
			 * @return  {Object} Array of nodes, or an empty array.
			 */
			getSiblings: function( node, selector = '[aria-haspopup="true"]' ) {
				let
					siblings = [],
					sibling  = node.parentNode.firstChild;

				// Iterate over all siblings, but return valid nodes only.
				for (; sibling; sibling = sibling.nextElementSibling ) {
					if ( 1 !== sibling.nodeType || ! sibling.matches( selector ) || node === sibling ) {
						continue;
					}
					siblings.push( sibling );
				}

				return siblings;
			},

			/**
			 * Returns an array of matched parent nodes.
			 *
			 * @param  {Event/node} eventOrNode  An event object or a DOM node to get parents for.
			 * @param  {String}     selector     Returned array is filtered to match these nodes only.
			 *
			 * @return  {Object} Array of (filtered) nodes, or an empty array.
			 */
			getParents: function( eventOrNode, selector = '[aria-haspopup="true"]' ) {
				const _ = this;
				let parents = [];

				if ( null != eventOrNode.path ) {
					// Oh great! We have parents set in event.path array.
					parents = eventOrNode.path;

					// We don't need parents outside our menu container.
					const menus = _.getMenus();
					let spliceId;
					for ( let i = 0, max = menus.length; i < max; i++ ) {
						spliceId = parents.indexOf( menus[ i ] );
						if ( -1 !== spliceId ) {
							break;
						}
					}
					parents.splice( spliceId );

					// Finally, remove event.target from the array (first node).
					parents.shift();
				} else {
					// Get the actual current node.
					let node = ( 1 === eventOrNode.nodeType ) ? ( eventOrNode ) : ( eventOrNode.target );

					// Unfortunately, we need to iterate through DOM,
					// but we don't need parents outside the menu container.
					const menus = _.getMenus();
					while ( -1 === menus.indexOf( node ) ) {
						parents.push( node );
						node = node.parentNode;
					}
				}

				// Remove parents not matching `selector` function attribute.
				if ( selector ) {
					parents = parents.filter( ( parent ) => parent.matches( selector ) );
				}

				return parents;
			},

			/**
			 * Returns a toggle button element.
			 *
			 * @param  {Object} atts  HTML attributes the button should have.
			 *
			 * @return  {node} A button DOM node.
			 */
			getButton: function( atts ) {
				atts = atts || {};

				// No button when its attributes are empty.
				const attrKeys = Object.keys( atts );
				if ( ! attrKeys.length ) {
					return;
				}

				// Create a button element and set allowed attributes.
				const
					button      = document.createElement( 'button' ),
					allowedAtts = [
						'class',
						'tabindex',
						'title',
					];

				// Set `aria-expanded` as it's mandatory attribute.
				button.setAttribute( 'aria-expanded', 'false' );

				// Set allowed attributes only.
				attrKeys.forEach( ( name ) => {
					if (
						-1 !== allowedAtts.indexOf( name )
						|| 0 === name.indexOf( 'aria-' )
						|| 0 === name.indexOf( 'data-' )
					) {
						// The value is secured by Element.setAttribute() directly.
						button.setAttribute( name.toLowerCase(), atts[ name ] );
					}
				} );

				// Preset dynamic `aria-label` attribute.
				if ( null != atts['aria-label'] && null != atts['aria-label'].expand ) {
					button.setAttribute( 'aria-label', atts['aria-label'].expand );
				}

				return button;
			},

			/**
			 * Modifies the button HTML attributes based on the child menu expansion state.
			 *
			 * @param  {Event/node} eventOrNode  An event object or a DOM node of button parent.
			 *
			 * @return  {Void}
			 */
			changeButtonAttributes: function( eventOrNode ) {
				const
					_ = this,
					menuItem = ( 1 === eventOrNode.nodeType ) ? ( eventOrNode ) : ( eventOrNode.target.parentNode );

				let button;

				if ( null != menuItem ) {
					button = menuItem.querySelector( _.getOption( 'button_selector' ) );
				}

				// Don't bother if no button.
				if ( null == button || 1 !== button.nodeType ) {
					return;
				}

				const
					isExpanded  = menuItem.classList.contains( _.getOption( 'expanded_class' ) ),
					buttonLabel = _.getOption( 'button_attributes', 'aria-label' );

				// Change `aria-label` value dynamically, if we should.
				if ( 'string' !== typeof buttonLabel && null != buttonLabel ) {
					if ( isExpanded && null != buttonLabel.collapse ) {
						// Sub menu is open, label the button as ready for collapse.
						button.setAttribute( 'aria-label', buttonLabel.collapse );
					} else if ( ! isExpanded && null != buttonLabel.expand ) {
						// Sub menu is closed, label the button as ready for expand.
						button.setAttribute( 'aria-label', buttonLabel.expand );
					}
				}

				// Change `aria-expanded` value.
				button.setAttribute( 'aria-expanded', isExpanded.toString() );
			},

		// Options

			/**
			 * Sets options.
			 *
			 * @param  {Object} config  Optional configuration options.
			 *
			 * @return  {Void}
			 */
			setOptions: function( config ) {
				const
					_ = this,
					options = {
					// Setting default values.
						// {Object/empty} Empty value bypasses the button creation.
						'button_attributes': {
							// {String} Default button class.
							'class': 'button-toggle-sub-menu',
							// {Object/String} If object, attribute value dynamically changes. If string, value is static.
							'aria-label': {
								'collapse': 'Collapse child menu',
								'expand': 'Expand child menu',
							},
						},
						// {String} Button element in the menu to watch. Empty value bypasses the button functionality.
						'button_selector': 'button[aria-expanded]',
						// {String} Required. No child menu bypasses the functionality for a specific menu only.
						'child_menu_selector': '.sub-menu',
						// {String/empty} Required. Empty value bypasses the whole functionality.
						'expanded_class': 'has-expanded-sub-menu',
						// {String} Required. No menu(s) bypasses the whole functionality.
						'menu_selector': 'nav .menu',
					};

				// If we have a custom option, override the default value.
				for ( let id in config ) {
					if ( options.hasOwnProperty( id ) ) {
						// Make sure to sanitize a class name.
						if ( 'expanded_class' === id ) {
							options[ id ] = config[ id ].replace( /[^a-zA-Z0-9\-_]/g, '' );
						} else {
							options[ id ] = config[ id ];
						}
					}
				}

				// Set actual options.
				_.options = options;

				// Also preset the array of menu containers.
				_.menus = [];
			},

			/**
			 * Get an option value.
			 *
			 * A function argument stand for an option label to retrieve the value for.
			 * Multiple function arguments (labels) dive deep into options object hierarchy.
			 * No function argument (label) provided returns the whole options object.
			 *
			 * @return  {Mixed}
			 */
			getOption: function() {
				let val = this.options;
				const
					args    = arguments,
					argsLen = args.length;

				if ( 1 === argsLen ) {
					val = ( null != val[ args[0] ] ) ? ( val[ args[0] ] ) : ( false );
				} else {
					for ( let i = 0; i < argsLen; i++ ) {
						val = ( null != val[ args[ i ] ] ) ? ( val[ args[ i ] ] ) : ( false );
					}
				}

				return val;
			},

		// Polyfills

			/**
			 * Polyfills for NodeList.forEach() and Element.matches().
			 *
			 * @return  {Void}
			 */
			polyfill: function() {
				// @see  https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach#Polyfill
				if ( window.NodeList && ! NodeList.prototype.forEach ) {
					NodeList.prototype.forEach = Array.prototype.forEach;
				}

				// @see  https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
				if ( ! Element.prototype.matches ) {
					Element.prototype.matches = Element.prototype.msMatchesSelector ||
					                            Element.prototype.webkitMatchesSelector;
				}
			},

	};

	// We're all set, load the functionality now.
	if ( 'loading' === document.readyState ) {
		// The DOM has not yet been loaded.
		document.addEventListener( 'DOMContentLoaded', () => a11yMenu.init( options ) );
	} else {
		// The DOM has already been loaded.
		a11yMenu.init( options );
	}

} )( window.a11yMenuConfig || {} );
