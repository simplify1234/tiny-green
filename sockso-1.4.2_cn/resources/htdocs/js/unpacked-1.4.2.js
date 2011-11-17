/***
 * jQuery JavaScript Library v1.3.1
 * http://jquery.com/
 *
 * Copyright (c) 2009 John Resig
 * Dual licensed under the MIT and GPL licenses.
 * http://docs.jquery.com/License
 *
 * Date: 2009-01-21 20:42:16 -0500 (Wed, 21 Jan 2009)
 * Revision: 6158
 */
(function(){

var 
	// Will speed up references to window, and allows munging its name.
	window = this,
	// Will speed up references to undefined, and allows munging its name.
	undefined,
	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,
	// Map over the $ in case of overwrite
	_$ = window.$,

	jQuery = window.jQuery = window.$ = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context );
	},

	// A simple way to check for HTML strings or ID strings
	// (both of which we optimize for)
	quickExpr = /^[^<]*(<(.|\s)+>)[^>]*$|^#([\w-]+)$/,
	// Is it a simple selector
	isSimple = /^.[^:#\[\.,]*$/;

jQuery.fn = jQuery.prototype = {
	init: function( selector, context ) {
		// Make sure that a selection was provided
		selector = selector || document;

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this[0] = selector;
			this.length = 1;
			this.context = selector;
			return this;
		}
		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			var match = quickExpr.exec( selector );

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] )
					selector = jQuery.clean( [ match[1] ], context );

				// HANDLE: $("#id")
				else {
					var elem = document.getElementById( match[3] );

					// Handle the case where IE and Opera return items
					// by name instead of ID
					if ( elem && elem.id != match[3] )
						return jQuery().find( selector );

					// Otherwise, we inject the element directly into the jQuery object
					var ret = jQuery( elem || [] );
					ret.context = document;
					ret.selector = selector;
					return ret;
				}

			// HANDLE: $(expr, [context])
			// (which is just equivalent to: $(content).find(expr)
			} else
				return jQuery( context ).find( selector );

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) )
			return jQuery( document ).ready( selector );

		// Make sure that old selector state is passed along
		if ( selector.selector && selector.context ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return this.setArray(jQuery.makeArray(selector));
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.3.1",

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num === undefined ?

			// Return a 'clean' array
			jQuery.makeArray( this ) :

			// Return just the object
			this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = jQuery( elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" )
			ret.selector = this.selector + (this.selector ? " " : "") + selector;
		else if ( name )
			ret.selector = this.selector + "." + name + "(" + selector + ")";

		// Return the newly-formed element set
		return ret;
	},

	// Force the current matched set of elements to become
	// the specified array of elements (destroying the stack in the process)
	// You should use pushStack() in order to do this, but maintain the stack
	setArray: function( elems ) {
		// Resetting the length to 0, then using the native Array push
		// is a super-fast way to populate an object with array-like properties
		this.length = 0;
		Array.prototype.push.apply( this, elems );

		return this;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {
		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem && elem.jquery ? elem[0] : elem
		, this );
	},

	attr: function( name, value, type ) {
		var options = name;

		// Look for the case where we're accessing a style value
		if ( typeof name === "string" )
			if ( value === undefined )
				return this[0] && jQuery[ type || "attr" ]( this[0], name );

			else {
				options = {};
				options[ name ] = value;
			}

		// Check to see if we're setting style values
		return this.each(function(i){
			// Set all the styles
			for ( name in options )
				jQuery.attr(
					type ?
						this.style :
						this,
					name, jQuery.prop( this, options[ name ], type, i, name )
				);
		});
	},

	css: function( key, value ) {
		// ignore negative width and height values
		if ( (key == 'width' || key == 'height') && parseFloat(value) < 0 )
			value = undefined;
		return this.attr( key, value, "curCSS" );
	},

	text: function( text ) {
		if ( typeof text !== "object" && text != null )
			return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );

		var ret = "";

		jQuery.each( text || this, function(){
			jQuery.each( this.childNodes, function(){
				if ( this.nodeType != 8 )
					ret += this.nodeType != 1 ?
						this.nodeValue :
						jQuery.fn.text( [ this ] );
			});
		});

		return ret;
	},

	wrapAll: function( html ) {
		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).clone();

			if ( this[0].parentNode )
				wrap.insertBefore( this[0] );

			wrap.map(function(){
				var elem = this;

				while ( elem.firstChild )
					elem = elem.firstChild;

				return elem;
			}).append(this);
		}

		return this;
	},

	wrapInner: function( html ) {
		return this.each(function(){
			jQuery( this ).contents().wrapAll( html );
		});
	},

	wrap: function( html ) {
		return this.each(function(){
			jQuery( this ).wrapAll( html );
		});
	},

	append: function() {
		return this.domManip(arguments, true, function(elem){
			if (this.nodeType == 1)
				this.appendChild( elem );
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function(elem){
			if (this.nodeType == 1)
				this.insertBefore( elem, this.firstChild );
		});
	},

	before: function() {
		return this.domManip(arguments, false, function(elem){
			this.parentNode.insertBefore( elem, this );
		});
	},

	after: function() {
		return this.domManip(arguments, false, function(elem){
			this.parentNode.insertBefore( elem, this.nextSibling );
		});
	},

	end: function() {
		return this.prevObject || jQuery( [] );
	},

	// For internal use only.
	// Behaves like an Array's .push method, not like a jQuery method.
	push: [].push,

	find: function( selector ) {
		if ( this.length === 1 && !/,/.test(selector) ) {
			var ret = this.pushStack( [], "find", selector );
			ret.length = 0;
			jQuery.find( selector, this[0], ret );
			return ret;
		} else {
			var elems = jQuery.map(this, function(elem){
				return jQuery.find( selector, elem );
			});

			return this.pushStack( /[^+>] [^+>]/.test( selector ) ?
				jQuery.unique( elems ) :
				elems, "find", selector );
		}
	},

	clone: function( events ) {
		// Do the clone
		var ret = this.map(function(){
			if ( !jQuery.support.noCloneEvent && !jQuery.isXMLDoc(this) ) {
				// IE copies events bound via attachEvent when
				// using cloneNode. Calling detachEvent on the
				// clone will also remove the events from the orignal
				// In order to get around this, we use innerHTML.
				// Unfortunately, this means some modifications to
				// attributes in IE that are actually only stored
				// as properties will not be copied (such as the
				// the name attribute on an input).
				var clone = this.cloneNode(true),
					container = document.createElement("div");
				container.appendChild(clone);
				return jQuery.clean([container.innerHTML])[0];
			} else
				return this.cloneNode(true);
		});

		// Need to set the expando to null on the cloned set if it exists
		// removeData doesn't work here, IE removes it from the original as well
		// this is primarily for IE but the data expando shouldn't be copied over in any browser
		var clone = ret.find("*").andSelf().each(function(){
			if ( this[ expando ] !== undefined )
				this[ expando ] = null;
		});

		// Copy the events from the original to the clone
		if ( events === true )
			this.find("*").andSelf().each(function(i){
				if (this.nodeType == 3)
					return;
				var events = jQuery.data( this, "events" );

				for ( var type in events )
					for ( var handler in events[ type ] )
						jQuery.event.add( clone[ i ], type, events[ type ][ handler ], events[ type ][ handler ].data );
			});

		// Return the cloned set
		return ret;
	},

	filter: function( selector ) {
		return this.pushStack(
			jQuery.isFunction( selector ) &&
			jQuery.grep(this, function(elem, i){
				return selector.call( elem, i );
			}) ||

			jQuery.multiFilter( selector, jQuery.grep(this, function(elem){
				return elem.nodeType === 1;
			}) ), "filter", selector );
	},

	closest: function( selector ) {
		var pos = jQuery.expr.match.POS.test( selector ) ? jQuery(selector) : null;

		return this.map(function(){
			var cur = this;
			while ( cur && cur.ownerDocument ) {
				if ( pos ? pos.index(cur) > -1 : jQuery(cur).is(selector) )
					return cur;
				cur = cur.parentNode;
			}
		});
	},

	not: function( selector ) {
		if ( typeof selector === "string" )
			// test special case where just one selector is passed in
			if ( isSimple.test( selector ) )
				return this.pushStack( jQuery.multiFilter( selector, this, true ), "not", selector );
			else
				selector = jQuery.multiFilter( selector, this );

		var isArrayLike = selector.length && selector[selector.length - 1] !== undefined && !selector.nodeType;
		return this.filter(function() {
			return isArrayLike ? jQuery.inArray( this, selector ) < 0 : this != selector;
		});
	},

	add: function( selector ) {
		return this.pushStack( jQuery.unique( jQuery.merge(
			this.get(),
			typeof selector === "string" ?
				jQuery( selector ) :
				jQuery.makeArray( selector )
		)));
	},

	is: function( selector ) {
		return !!selector && jQuery.multiFilter( selector, this ).length > 0;
	},

	hasClass: function( selector ) {
		return !!selector && this.is( "." + selector );
	},

	val: function( value ) {
		if ( value === undefined ) {			
			var elem = this[0];

			if ( elem ) {
				if( jQuery.nodeName( elem, 'option' ) )
					return (elem.attributes.value || {}).specified ? elem.value : elem.text;
				
				// We need to handle select boxes special
				if ( jQuery.nodeName( elem, "select" ) ) {
					var index = elem.selectedIndex,
						values = [],
						options = elem.options,
						one = elem.type == "select-one";

					// Nothing was selected
					if ( index < 0 )
						return null;

					// Loop through all the selected options
					for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
						var option = options[ i ];

						if ( option.selected ) {
							// Get the specifc value for the option
							value = jQuery(option).val();

							// We don't need an array for one selects
							if ( one )
								return value;

							// Multi-Selects return an array
							values.push( value );
						}
					}

					return values;				
				}

				// Everything else, we just grab the value
				return (elem.value || "").replace(/\r/g, "");

			}

			return undefined;
		}

		if ( typeof value === "number" )
			value += '';

		return this.each(function(){
			if ( this.nodeType != 1 )
				return;

			if ( jQuery.isArray(value) && /radio|checkbox/.test( this.type ) )
				this.checked = (jQuery.inArray(this.value, value) >= 0 ||
					jQuery.inArray(this.name, value) >= 0);

			else if ( jQuery.nodeName( this, "select" ) ) {
				var values = jQuery.makeArray(value);

				jQuery( "option", this ).each(function(){
					this.selected = (jQuery.inArray( this.value, values ) >= 0 ||
						jQuery.inArray( this.text, values ) >= 0);
				});

				if ( !values.length )
					this.selectedIndex = -1;

			} else
				this.value = value;
		});
	},

	html: function( value ) {
		return value === undefined ?
			(this[0] ?
				this[0].innerHTML :
				null) :
			this.empty().append( value );
	},

	replaceWith: function( value ) {
		return this.after( value ).remove();
	},

	eq: function( i ) {
		return this.slice( i, +i + 1 );
	},

	slice: function() {
		return this.pushStack( Array.prototype.slice.apply( this, arguments ),
			"slice", Array.prototype.slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function(elem, i){
			return callback.call( elem, i, elem );
		}));
	},

	andSelf: function() {
		return this.add( this.prevObject );
	},

	domManip: function( args, table, callback ) {
		if ( this[0] ) {
			var fragment = (this[0].ownerDocument || this[0]).createDocumentFragment(),
				scripts = jQuery.clean( args, (this[0].ownerDocument || this[0]), fragment ),
				first = fragment.firstChild,
				extra = this.length > 1 ? fragment.cloneNode(true) : fragment;

			if ( first )
				for ( var i = 0, l = this.length; i < l; i++ )
					callback.call( root(this[i], first), i > 0 ? extra.cloneNode(true) : fragment );
			
			if ( scripts )
				jQuery.each( scripts, evalScript );
		}

		return this;
		
		function root( elem, cur ) {
			return table && jQuery.nodeName(elem, "table") && jQuery.nodeName(cur, "tr") ?
				(elem.getElementsByTagName("tbody")[0] ||
				elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
				elem;
		}
	}
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

function evalScript( i, elem ) {
	if ( elem.src )
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});

	else
		jQuery.globalEval( elem.text || elem.textContent || elem.innerHTML || "" );

	if ( elem.parentNode )
		elem.parentNode.removeChild( elem );
}

function now(){
	return +new Date;
}

jQuery.extend = jQuery.fn.extend = function() {
	// copy reference to target object
	var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) )
		target = {};

	// extend jQuery itself if only one argument is passed
	if ( length == i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ )
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null )
			// Extend the base object
			for ( var name in options ) {
				var src = target[ name ], copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy )
					continue;

				// Recurse if we're merging object values
				if ( deep && copy && typeof copy === "object" && !copy.nodeType )
					target[ name ] = jQuery.extend( deep, 
						// Never move original objects, clone them
						src || ( copy.length != null ? [ ] : { } )
					, copy );

				// Don't bring in undefined values
				else if ( copy !== undefined )
					target[ name ] = copy;

			}

	// Return the modified object
	return target;
};

// exclude the following css properties to add px
var	exclude = /z-?index|font-?weight|opacity|zoom|line-?height/i,
	// cache defaultView
	defaultView = document.defaultView || {},
	toString = Object.prototype.toString;

jQuery.extend({
	noConflict: function( deep ) {
		window.$ = _$;

		if ( deep )
			window.jQuery = _jQuery;

		return jQuery;
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return toString.call(obj) === "[object Function]";
	},

	isArray: function( obj ) {
		return toString.call(obj) === "[object Array]";
	},

	// check if an element is in a (or is an) XML document
	isXMLDoc: function( elem ) {
		return elem.nodeType === 9 && elem.documentElement.nodeName !== "HTML" ||
			!!elem.ownerDocument && jQuery.isXMLDoc( elem.ownerDocument );
	},

	// Evalulates a script in a global context
	globalEval: function( data ) {
		data = jQuery.trim( data );

		if ( data ) {
			// Inspired by code by Andrea Giammarchi
			// http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html
			var head = document.getElementsByTagName("head")[0] || document.documentElement,
				script = document.createElement("script");

			script.type = "text/javascript";
			if ( jQuery.support.scriptEval )
				script.appendChild( document.createTextNode( data ) );
			else
				script.text = data;

			// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
			// This arises when a base node is used (#2709).
			head.insertBefore( script, head.firstChild );
			head.removeChild( script );
		}
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() == name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0, length = object.length;

		if ( args ) {
			if ( length === undefined ) {
				for ( name in object )
					if ( callback.apply( object[ name ], args ) === false )
						break;
			} else
				for ( ; i < length; )
					if ( callback.apply( object[ i++ ], args ) === false )
						break;

		// A special, fast, case for the most common use of each
		} else {
			if ( length === undefined ) {
				for ( name in object )
					if ( callback.call( object[ name ], name, object[ name ] ) === false )
						break;
			} else
				for ( var value = object[0];
					i < length && callback.call( value, i, value ) !== false; value = object[++i] ){}
		}

		return object;
	},

	prop: function( elem, value, type, i, name ) {
		// Handle executable functions
		if ( jQuery.isFunction( value ) )
			value = value.call( elem, i );

		// Handle passing in a number to a CSS property
		return typeof value === "number" && type == "curCSS" && !exclude.test( name ) ?
			value + "px" :
			value;
	},

	className: {
		// internal only, use addClass("class")
		add: function( elem, classNames ) {
			jQuery.each((classNames || "").split(/\s+/), function(i, className){
				if ( elem.nodeType == 1 && !jQuery.className.has( elem.className, className ) )
					elem.className += (elem.className ? " " : "") + className;
			});
		},

		// internal only, use removeClass("class")
		remove: function( elem, classNames ) {
			if (elem.nodeType == 1)
				elem.className = classNames !== undefined ?
					jQuery.grep(elem.className.split(/\s+/), function(className){
						return !jQuery.className.has( classNames, className );
					}).join(" ") :
					"";
		},

		// internal only, use hasClass("class")
		has: function( elem, className ) {
			return elem && jQuery.inArray( className, (elem.className || elem).toString().split(/\s+/) ) > -1;
		}
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {};
		// Remember the old values, and insert the new ones
		for ( var name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		// Revert the old values
		for ( var name in options )
			elem.style[ name ] = old[ name ];
	},

	css: function( elem, name, force ) {
		if ( name == "width" || name == "height" ) {
			var val, props = { position: "absolute", visibility: "hidden", display:"block" }, which = name == "width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ];

			function getWH() {
				val = name == "width" ? elem.offsetWidth : elem.offsetHeight;
				var padding = 0, border = 0;
				jQuery.each( which, function() {
					padding += parseFloat(jQuery.curCSS( elem, "padding" + this, true)) || 0;
					border += parseFloat(jQuery.curCSS( elem, "border" + this + "Width", true)) || 0;
				});
				val -= Math.round(padding + border);
			}

			if ( jQuery(elem).is(":visible") )
				getWH();
			else
				jQuery.swap( elem, props, getWH );

			return Math.max(0, val);
		}

		return jQuery.curCSS( elem, name, force );
	},

	curCSS: function( elem, name, force ) {
		var ret, style = elem.style;

		// We need to handle opacity special in IE
		if ( name == "opacity" && !jQuery.support.opacity ) {
			ret = jQuery.attr( style, "opacity" );

			return ret == "" ?
				"1" :
				ret;
		}

		// Make sure we're using the right name for getting the float value
		if ( name.match( /float/i ) )
			name = styleFloat;

		if ( !force && style && style[ name ] )
			ret = style[ name ];

		else if ( defaultView.getComputedStyle ) {

			// Only "float" is needed here
			if ( name.match( /float/i ) )
				name = "float";

			name = name.replace( /([A-Z])/g, "-$1" ).toLowerCase();

			var computedStyle = defaultView.getComputedStyle( elem, null );

			if ( computedStyle )
				ret = computedStyle.getPropertyValue( name );

			// We should always get a number back from opacity
			if ( name == "opacity" && ret == "" )
				ret = "1";

		} else if ( elem.currentStyle ) {
			var camelCase = name.replace(/\-(\w)/g, function(all, letter){
				return letter.toUpperCase();
			});

			ret = elem.currentStyle[ name ] || elem.currentStyle[ camelCase ];

			// From the awesome hack by Dean Edwards
			// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

			// If we're not dealing with a regular pixel number
			// but a number that has a weird ending, we need to convert it to pixels
			if ( !/^\d+(px)?$/i.test( ret ) && /^\d/.test( ret ) ) {
				// Remember the original values
				var left = style.left, rsLeft = elem.runtimeStyle.left;

				// Put in the new values to get a computed value out
				elem.runtimeStyle.left = elem.currentStyle.left;
				style.left = ret || 0;
				ret = style.pixelLeft + "px";

				// Revert the changed values
				style.left = left;
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret;
	},

	clean: function( elems, context, fragment ) {
		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" )
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;

		// If a single string is passed in and it's a single tag
		// just do a createElement and skip the rest
		if ( !fragment && elems.length === 1 && typeof elems[0] === "string" ) {
			var match = /^<(\w+)\s*\/?>$/.exec(elems[0]);
			if ( match )
				return [ context.createElement( match[1] ) ];
		}

		var ret = [], scripts = [], div = context.createElement("div");

		jQuery.each(elems, function(i, elem){
			if ( typeof elem === "number" )
				elem += '';

			if ( !elem )
				return;

			// Convert html string into DOM nodes
			if ( typeof elem === "string" ) {
				// Fix "XHTML"-style tags in all browsers
				elem = elem.replace(/(<(\w+)[^>]*?)\/>/g, function(all, front, tag){
					return tag.match(/^(abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i) ?
						all :
						front + "></" + tag + ">";
				});

				// Trim whitespace, otherwise indexOf won't work as expected
				var tags = jQuery.trim( elem ).toLowerCase();

				var wrap =
					// option or optgroup
					!tags.indexOf("<opt") &&
					[ 1, "<select multiple='multiple'>", "</select>" ] ||

					!tags.indexOf("<leg") &&
					[ 1, "<fieldset>", "</fieldset>" ] ||

					tags.match(/^<(thead|tbody|tfoot|colg|cap)/) &&
					[ 1, "<table>", "</table>" ] ||

					!tags.indexOf("<tr") &&
					[ 2, "<table><tbody>", "</tbody></table>" ] ||

				 	// <thead> matched above
					(!tags.indexOf("<td") || !tags.indexOf("<th")) &&
					[ 3, "<table><tbody><tr>", "</tr></tbody></table>" ] ||

					!tags.indexOf("<col") &&
					[ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ] ||

					// IE can't serialize <link> and <script> tags normally
					!jQuery.support.htmlSerialize &&
					[ 1, "div<div>", "</div>" ] ||

					[ 0, "", "" ];

				// Go to html and back, then peel off extra wrappers
				div.innerHTML = wrap[1] + elem + wrap[2];

				// Move to the right depth
				while ( wrap[0]-- )
					div = div.lastChild;

				// Remove IE's autoinserted <tbody> from table fragments
				if ( !jQuery.support.tbody ) {

					// String was a <table>, *may* have spurious <tbody>
					var tbody = !tags.indexOf("<table") && tags.indexOf("<tbody") < 0 ?
						div.firstChild && div.firstChild.childNodes :

						// String was a bare <thead> or <tfoot>
						wrap[1] == "<table>" && tags.indexOf("<tbody") < 0 ?
							div.childNodes :
							[];

					for ( var j = tbody.length - 1; j >= 0 ; --j )
						if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length )
							tbody[ j ].parentNode.removeChild( tbody[ j ] );

					}

				// IE completely kills leading whitespace when innerHTML is used
				if ( !jQuery.support.leadingWhitespace && /^\s/.test( elem ) )
					div.insertBefore( context.createTextNode( elem.match(/^\s*/)[0] ), div.firstChild );
				
				elem = jQuery.makeArray( div.childNodes );
			}

			if ( elem.nodeType )
				ret.push( elem );
			else
				ret = jQuery.merge( ret, elem );

		});

		if ( fragment ) {
			for ( var i = 0; ret[i]; i++ ) {
				if ( jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
					scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );
				} else {
					if ( ret[i].nodeType === 1 )
						ret.splice.apply( ret, [i + 1, 0].concat(jQuery.makeArray(ret[i].getElementsByTagName("script"))) );
					fragment.appendChild( ret[i] );
				}
			}
			
			return scripts;
		}

		return ret;
	},

	attr: function( elem, name, value ) {
		// don't set attributes on text and comment nodes
		if (!elem || elem.nodeType == 3 || elem.nodeType == 8)
			return undefined;

		var notxml = !jQuery.isXMLDoc( elem ),
			// Whether we are setting (or getting)
			set = value !== undefined;

		// Try to normalize/fix the name
		name = notxml && jQuery.props[ name ] || name;

		// Only do all the following if this is a node (faster for style)
		// IE elem.getAttribute passes even for style
		if ( elem.tagName ) {

			// These attributes require special treatment
			var special = /href|src|style/.test( name );

			// Safari mis-reports the default selected property of a hidden option
			// Accessing the parent's selectedIndex property fixes it
			if ( name == "selected" && elem.parentNode )
				elem.parentNode.selectedIndex;

			// If applicable, access the attribute via the DOM 0 way
			if ( name in elem && notxml && !special ) {
				if ( set ){
					// We can't allow the type property to be changed (since it causes problems in IE)
					if ( name == "type" && jQuery.nodeName( elem, "input" ) && elem.parentNode )
						throw "type property can't be changed";

					elem[ name ] = value;
				}

				// browsers index elements by id/name on forms, give priority to attributes.
				if( jQuery.nodeName( elem, "form" ) && elem.getAttributeNode(name) )
					return elem.getAttributeNode( name ).nodeValue;

				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				if ( name == "tabIndex" ) {
					var attributeNode = elem.getAttributeNode( "tabIndex" );
					return attributeNode && attributeNode.specified
						? attributeNode.value
						: elem.nodeName.match(/(button|input|object|select|textarea)/i)
							? 0
							: elem.nodeName.match(/^(a|area)$/i) && elem.href
								? 0
								: undefined;
				}

				return elem[ name ];
			}

			if ( !jQuery.support.style && notxml &&  name == "style" )
				return jQuery.attr( elem.style, "cssText", value );

			if ( set )
				// convert the value to a string (all browsers do this but IE) see #1070
				elem.setAttribute( name, "" + value );

			var attr = !jQuery.support.hrefNormalized && notxml && special
					// Some attributes require a special call on IE
					? elem.getAttribute( name, 2 )
					: elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return attr === null ? undefined : attr;
		}

		// elem is actually elem.style ... set the style

		// IE uses filters for opacity
		if ( !jQuery.support.opacity && name == "opacity" ) {
			if ( set ) {
				// IE has trouble with opacity if it does not have layout
				// Force it by setting the zoom level
				elem.zoom = 1;

				// Set the alpha filter to set the opacity
				elem.filter = (elem.filter || "").replace( /alpha\([^)]*\)/, "" ) +
					(parseInt( value ) + '' == "NaN" ? "" : "alpha(opacity=" + value * 100 + ")");
			}

			return elem.filter && elem.filter.indexOf("opacity=") >= 0 ?
				(parseFloat( elem.filter.match(/opacity=([^)]*)/)[1] ) / 100) + '':
				"";
		}

		name = name.replace(/-([a-z])/ig, function(all, letter){
			return letter.toUpperCase();
		});

		if ( set )
			elem[ name ] = value;

		return elem[ name ];
	},

	trim: function( text ) {
		return (text || "").replace( /^\s+|\s+$/g, "" );
	},

	makeArray: function( array ) {
		var ret = [];

		if( array != null ){
			var i = array.length;
			// The window, strings (and functions) also have 'length'
			if( i == null || typeof array === "string" || jQuery.isFunction(array) || array.setInterval )
				ret[0] = array;
			else
				while( i )
					ret[--i] = array[i];
		}

		return ret;
	},

	inArray: function( elem, array ) {
		for ( var i = 0, length = array.length; i < length; i++ )
		// Use === because on IE, window == document
			if ( array[ i ] === elem )
				return i;

		return -1;
	},

	merge: function( first, second ) {
		// We have to loop this way because IE & Opera overwrite the length
		// expando of getElementsByTagName
		var i = 0, elem, pos = first.length;
		// Also, we need to make sure that the correct elements are being returned
		// (IE returns comment nodes in a '*' query)
		if ( !jQuery.support.getAll ) {
			while ( (elem = second[ i++ ]) != null )
				if ( elem.nodeType != 8 )
					first[ pos++ ] = elem;

		} else
			while ( (elem = second[ i++ ]) != null )
				first[ pos++ ] = elem;

		return first;
	},

	unique: function( array ) {
		var ret = [], done = {};

		try {

			for ( var i = 0, length = array.length; i < length; i++ ) {
				var id = jQuery.data( array[ i ] );

				if ( !done[ id ] ) {
					done[ id ] = true;
					ret.push( array[ i ] );
				}
			}

		} catch( e ) {
			ret = array;
		}

		return ret;
	},

	grep: function( elems, callback, inv ) {
		var ret = [];

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ )
			if ( !inv != !callback( elems[ i ], i ) )
				ret.push( elems[ i ] );

		return ret;
	},

	map: function( elems, callback ) {
		var ret = [];

		// Go through the array, translating each of the items to their
		// new value (or values).
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			var value = callback( elems[ i ], i );

			if ( value != null )
				ret[ ret.length ] = value;
		}

		return ret.concat.apply( [], ret );
	}
});

// Use of jQuery.browser is deprecated.
// It's included for backwards compatibility and plugins,
// although they should work to migrate away.

var userAgent = navigator.userAgent.toLowerCase();

// Figure out what browser is being used
jQuery.browser = {
	version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1],
	safari: /webkit/.test( userAgent ),
	opera: /opera/.test( userAgent ),
	msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),
	mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent )
};

jQuery.each({
	parent: function(elem){return elem.parentNode;},
	parents: function(elem){return jQuery.dir(elem,"parentNode");},
	next: function(elem){return jQuery.nth(elem,2,"nextSibling");},
	prev: function(elem){return jQuery.nth(elem,2,"previousSibling");},
	nextAll: function(elem){return jQuery.dir(elem,"nextSibling");},
	prevAll: function(elem){return jQuery.dir(elem,"previousSibling");},
	siblings: function(elem){return jQuery.sibling(elem.parentNode.firstChild,elem);},
	children: function(elem){return jQuery.sibling(elem.firstChild);},
	contents: function(elem){return jQuery.nodeName(elem,"iframe")?elem.contentDocument||elem.contentWindow.document:jQuery.makeArray(elem.childNodes);}
}, function(name, fn){
	jQuery.fn[ name ] = function( selector ) {
		var ret = jQuery.map( this, fn );

		if ( selector && typeof selector == "string" )
			ret = jQuery.multiFilter( selector, ret );

		return this.pushStack( jQuery.unique( ret ), name, selector );
	};
});

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function(name, original){
	jQuery.fn[ name ] = function() {
		var args = arguments;

		return this.each(function(){
			for ( var i = 0, length = args.length; i < length; i++ )
				jQuery( args[ i ] )[ original ]( this );
		});
	};
});

jQuery.each({
	removeAttr: function( name ) {
		jQuery.attr( this, name, "" );
		if (this.nodeType == 1)
			this.removeAttribute( name );
	},

	addClass: function( classNames ) {
		jQuery.className.add( this, classNames );
	},

	removeClass: function( classNames ) {
		jQuery.className.remove( this, classNames );
	},

	toggleClass: function( classNames, state ) {
		if( typeof state !== "boolean" )
			state = !jQuery.className.has( this, classNames );
		jQuery.className[ state ? "add" : "remove" ]( this, classNames );
	},

	remove: function( selector ) {
		if ( !selector || jQuery.filter( selector, [ this ] ).length ) {
			// Prevent memory leaks
			jQuery( "*", this ).add([this]).each(function(){
				jQuery.event.remove(this);
				jQuery.removeData(this);
			});
			if (this.parentNode)
				this.parentNode.removeChild( this );
		}
	},

	empty: function() {
		// Remove element nodes and prevent memory leaks
		jQuery( ">*", this ).remove();

		// Remove any remaining nodes
		while ( this.firstChild )
			this.removeChild( this.firstChild );
	}
}, function(name, fn){
	jQuery.fn[ name ] = function(){
		return this.each( fn, arguments );
	};
});

// Helper function used by the dimensions and offset modules
function num(elem, prop) {
	return elem[0] && parseInt( jQuery.curCSS(elem[0], prop, true), 10 ) || 0;
}
var expando = "jQuery" + now(), uuid = 0, windowData = {};

jQuery.extend({
	cache: {},

	data: function( elem, name, data ) {
		elem = elem == window ?
			windowData :
			elem;

		var id = elem[ expando ];

		// Compute a unique ID for the element
		if ( !id )
			id = elem[ expando ] = ++uuid;

		// Only generate the data cache if we're
		// trying to access or manipulate it
		if ( name && !jQuery.cache[ id ] )
			jQuery.cache[ id ] = {};

		// Prevent overriding the named cache with undefined values
		if ( data !== undefined )
			jQuery.cache[ id ][ name ] = data;

		// Return the named cache data, or the ID for the element
		return name ?
			jQuery.cache[ id ][ name ] :
			id;
	},

	removeData: function( elem, name ) {
		elem = elem == window ?
			windowData :
			elem;

		var id = elem[ expando ];

		// If we want to remove a specific section of the element's data
		if ( name ) {
			if ( jQuery.cache[ id ] ) {
				// Remove the section of cache data
				delete jQuery.cache[ id ][ name ];

				// If we've removed all the data, remove the element's cache
				name = "";

				for ( name in jQuery.cache[ id ] )
					break;

				if ( !name )
					jQuery.removeData( elem );
			}

		// Otherwise, we want to remove all of the element's data
		} else {
			// Clean up the element expando
			try {
				delete elem[ expando ];
			} catch(e){
				// IE has trouble directly removing the expando
				// but it's ok with using removeAttribute
				if ( elem.removeAttribute )
					elem.removeAttribute( expando );
			}

			// Completely remove the data cache
			delete jQuery.cache[ id ];
		}
	},
	queue: function( elem, type, data ) {
		if ( elem ){
	
			type = (type || "fx") + "queue";
	
			var q = jQuery.data( elem, type );
	
			if ( !q || jQuery.isArray(data) )
				q = jQuery.data( elem, type, jQuery.makeArray(data) );
			else if( data )
				q.push( data );
	
		}
		return q;
	},

	dequeue: function( elem, type ){
		var queue = jQuery.queue( elem, type ),
			fn = queue.shift();
		
		if( !type || type === "fx" )
			fn = queue[0];
			
		if( fn !== undefined )
			fn.call(elem);
	}
});

jQuery.fn.extend({
	data: function( key, value ){
		var parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			var data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			if ( data === undefined && this.length )
				data = jQuery.data( this[0], key );

			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;
		} else
			return this.trigger("setData" + parts[1] + "!", [parts[0], value]).each(function(){
				jQuery.data( this, key, value );
			});
	},

	removeData: function( key ){
		return this.each(function(){
			jQuery.removeData( this, key );
		});
	},
	queue: function(type, data){
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined )
			return jQuery.queue( this[0], type );

		return this.each(function(){
			var queue = jQuery.queue( this, type, data );
			
			 if( type == "fx" && queue.length == 1 )
				queue[0].call(this);
		});
	},
	dequeue: function(type){
		return this.each(function(){
			jQuery.dequeue( this, type );
		});
	}
});/*!
 * Sizzle CSS Selector Engine - v0.9.3
 *  Copyright 2009, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]+['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[]+)+|[>+~])(\s*,\s*)?/g,
	done = 0,
	toString = Object.prototype.toString;

var Sizzle = function(selector, context, results, seed) {
	results = results || [];
	context = context || document;

	if ( context.nodeType !== 1 && context.nodeType !== 9 )
		return [];
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var parts = [], m, set, checkSet, check, mode, extra, prune = true;
	
	// Reset the position of the chunker regexp (start from head)
	chunker.lastIndex = 0;
	
	while ( (m = chunker.exec(selector)) !== null ) {
		parts.push( m[1] );
		
		if ( m[2] ) {
			extra = RegExp.rightContext;
			break;
		}
	}

	if ( parts.length > 1 && origPOS.exec( selector ) ) {
		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context );
		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] )
					selector += parts.shift();

				set = posProcess( selector, set );
			}
		}
	} else {
		var ret = seed ?
			{ expr: parts.pop(), set: makeArray(seed) } :
			Sizzle.find( parts.pop(), parts.length === 1 && context.parentNode ? context.parentNode : context, isXML(context) );
		set = Sizzle.filter( ret.expr, ret.set );

		if ( parts.length > 0 ) {
			checkSet = makeArray(set);
		} else {
			prune = false;
		}

		while ( parts.length ) {
			var cur = parts.pop(), pop = cur;

			if ( !Expr.relative[ cur ] ) {
				cur = "";
			} else {
				pop = parts.pop();
			}

			if ( pop == null ) {
				pop = context;
			}

			Expr.relative[ cur ]( checkSet, pop, isXML(context) );
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		throw "Syntax error, unrecognized expression: " + (cur || selector);
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );
		} else if ( context.nodeType === 1 ) {
			for ( var i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}
		} else {
			for ( var i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}
	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, context, results, seed );
	}

	return results;
};

Sizzle.matches = function(expr, set){
	return Sizzle(expr, null, null, set);
};

Sizzle.find = function(expr, context, isXML){
	var set, match;

	if ( !expr ) {
		return [];
	}

	for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
		var type = Expr.order[i], match;
		
		if ( (match = Expr.match[ type ].exec( expr )) ) {
			var left = RegExp.leftContext;

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace(/\\/g, "");
				set = Expr.find[ type ]( match, context, isXML );
				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = context.getElementsByTagName("*");
	}

	return {set: set, expr: expr};
};

Sizzle.filter = function(expr, set, inplace, not){
	var old = expr, result = [], curLoop = set, match, anyFound;

	while ( expr && set.length ) {
		for ( var type in Expr.filter ) {
			if ( (match = Expr.match[ type ].exec( expr )) != null ) {
				var filter = Expr.filter[ type ], found, item;
				anyFound = false;

				if ( curLoop == result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not );

					if ( !match ) {
						anyFound = found = true;
					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							var pass = not ^ !!found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;
								} else {
									curLoop[i] = false;
								}
							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		expr = expr.replace(/\s*,\s*/, "");

		// Improper expression
		if ( expr == old ) {
			if ( anyFound == null ) {
				throw "Syntax error, unrecognized expression: " + expr;
			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],
	match: {
		ID: /#((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF_-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF_-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*_-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF_-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/
	},
	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},
	attrHandle: {
		href: function(elem){
			return elem.getAttribute("href");
		}
	},
	relative: {
		"+": function(checkSet, part){
			for ( var i = 0, l = checkSet.length; i < l; i++ ) {
				var elem = checkSet[i];
				if ( elem ) {
					var cur = elem.previousSibling;
					while ( cur && cur.nodeType !== 1 ) {
						cur = cur.previousSibling;
					}
					checkSet[i] = typeof part === "string" ?
						cur || false :
						cur === part;
				}
			}

			if ( typeof part === "string" ) {
				Sizzle.filter( part, checkSet, true );
			}
		},
		">": function(checkSet, part, isXML){
			if ( typeof part === "string" && !/\W/.test(part) ) {
				part = isXML ? part : part.toUpperCase();

				for ( var i = 0, l = checkSet.length; i < l; i++ ) {
					var elem = checkSet[i];
					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName === part ? parent : false;
					}
				}
			} else {
				for ( var i = 0, l = checkSet.length; i < l; i++ ) {
					var elem = checkSet[i];
					if ( elem ) {
						checkSet[i] = typeof part === "string" ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( typeof part === "string" ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},
		"": function(checkSet, part, isXML){
			var doneName = "done" + (done++), checkFn = dirCheck;

			if ( !part.match(/\W/) ) {
				var nodeCheck = part = isXML ? part : part.toUpperCase();
				checkFn = dirNodeCheck;
			}

			checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
		},
		"~": function(checkSet, part, isXML){
			var doneName = "done" + (done++), checkFn = dirCheck;

			if ( typeof part === "string" && !part.match(/\W/) ) {
				var nodeCheck = part = isXML ? part : part.toUpperCase();
				checkFn = dirNodeCheck;
			}

			checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
		}
	},
	find: {
		ID: function(match, context, isXML){
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				return m ? [m] : [];
			}
		},
		NAME: function(match, context, isXML){
			if ( typeof context.getElementsByName !== "undefined" && !isXML ) {
				return context.getElementsByName(match[1]);
			}
		},
		TAG: function(match, context){
			return context.getElementsByTagName(match[1]);
		}
	},
	preFilter: {
		CLASS: function(match, curLoop, inplace, result, not){
			match = " " + match[1].replace(/\\/g, "") + " ";

			var elem;
			for ( var i = 0; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (" " + elem.className + " ").indexOf(match) >= 0 ) {
						if ( !inplace )
							result.push( elem );
					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},
		ID: function(match){
			return match[1].replace(/\\/g, "");
		},
		TAG: function(match, curLoop){
			for ( var i = 0; curLoop[i] === false; i++ ){}
			return curLoop[i] && isXML(curLoop[i]) ? match[1] : match[1].toUpperCase();
		},
		CHILD: function(match){
			if ( match[1] == "nth" ) {
				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(
					match[2] == "even" && "2n" || match[2] == "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}

			// TODO: Move to normal caching system
			match[0] = "done" + (done++);

			return match;
		},
		ATTR: function(match){
			var name = match[1].replace(/\\/g, "");
			
			if ( Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},
		PSEUDO: function(match, curLoop, inplace, result, not){
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( match[3].match(chunker).length > 1 ) {
					match[3] = Sizzle(match[3], null, null, curLoop);
				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);
					if ( !inplace ) {
						result.push.apply( result, ret );
					}
					return false;
				}
			} else if ( Expr.match.POS.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},
		POS: function(match){
			match.unshift( true );
			return match;
		}
	},
	filters: {
		enabled: function(elem){
			return elem.disabled === false && elem.type !== "hidden";
		},
		disabled: function(elem){
			return elem.disabled === true;
		},
		checked: function(elem){
			return elem.checked === true;
		},
		selected: function(elem){
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			elem.parentNode.selectedIndex;
			return elem.selected === true;
		},
		parent: function(elem){
			return !!elem.firstChild;
		},
		empty: function(elem){
			return !elem.firstChild;
		},
		has: function(elem, i, match){
			return !!Sizzle( match[3], elem ).length;
		},
		header: function(elem){
			return /h\d/i.test( elem.nodeName );
		},
		text: function(elem){
			return "text" === elem.type;
		},
		radio: function(elem){
			return "radio" === elem.type;
		},
		checkbox: function(elem){
			return "checkbox" === elem.type;
		},
		file: function(elem){
			return "file" === elem.type;
		},
		password: function(elem){
			return "password" === elem.type;
		},
		submit: function(elem){
			return "submit" === elem.type;
		},
		image: function(elem){
			return "image" === elem.type;
		},
		reset: function(elem){
			return "reset" === elem.type;
		},
		button: function(elem){
			return "button" === elem.type || elem.nodeName.toUpperCase() === "BUTTON";
		},
		input: function(elem){
			return /input|select|textarea|button/i.test(elem.nodeName);
		}
	},
	setFilters: {
		first: function(elem, i){
			return i === 0;
		},
		last: function(elem, i, match, array){
			return i === array.length - 1;
		},
		even: function(elem, i){
			return i % 2 === 0;
		},
		odd: function(elem, i){
			return i % 2 === 1;
		},
		lt: function(elem, i, match){
			return i < match[3] - 0;
		},
		gt: function(elem, i, match){
			return i > match[3] - 0;
		},
		nth: function(elem, i, match){
			return match[3] - 0 == i;
		},
		eq: function(elem, i, match){
			return match[3] - 0 == i;
		}
	},
	filter: {
		CHILD: function(elem, match){
			var type = match[1], parent = elem.parentNode;

			var doneName = match[0];
			
			if ( parent && (!parent[ doneName ] || !elem.nodeIndex) ) {
				var count = 1;

				for ( var node = parent.firstChild; node; node = node.nextSibling ) {
					if ( node.nodeType == 1 ) {
						node.nodeIndex = count++;
					}
				}

				parent[ doneName ] = count - 1;
			}

			if ( type == "first" ) {
				return elem.nodeIndex == 1;
			} else if ( type == "last" ) {
				return elem.nodeIndex == parent[ doneName ];
			} else if ( type == "only" ) {
				return parent[ doneName ] == 1;
			} else if ( type == "nth" ) {
				var add = false, first = match[2], last = match[3];

				if ( first == 1 && last == 0 ) {
					return true;
				}

				if ( first == 0 ) {
					if ( elem.nodeIndex == last ) {
						add = true;
					}
				} else if ( (elem.nodeIndex - last) % first == 0 && (elem.nodeIndex - last) / first >= 0 ) {
					add = true;
				}

				return add;
			}
		},
		PSEUDO: function(elem, match, i, array){
			var name = match[1], filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || "").indexOf(match[3]) >= 0;
			} else if ( name === "not" ) {
				var not = match[3];

				for ( var i = 0, l = not.length; i < l; i++ ) {
					if ( not[i] === elem ) {
						return false;
					}
				}

				return true;
			}
		},
		ID: function(elem, match){
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},
		TAG: function(elem, match){
			return (match === "*" && elem.nodeType === 1) || elem.nodeName === match;
		},
		CLASS: function(elem, match){
			return match.test( elem.className );
		},
		ATTR: function(elem, match){
			var result = Expr.attrHandle[ match[1] ] ? Expr.attrHandle[ match[1] ]( elem ) : elem[ match[1] ] || elem.getAttribute( match[1] ), value = result + "", type = match[2], check = match[4];
			return result == null ?
				type === "!=" :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!match[4] ?
				result :
				type === "!=" ?
				value != check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},
		POS: function(elem, match, i, array){
			var name = match[2], filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS;

for ( var type in Expr.match ) {
	Expr.match[ type ] = RegExp( Expr.match[ type ].source + /(?![^\[]*\])(?![^\(]*\))/.source );
}

var makeArray = function(array, results) {
	array = Array.prototype.slice.call( array );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
try {
	Array.prototype.slice.call( document.documentElement.childNodes );

// Provide a fallback method if it does not work
} catch(e){
	makeArray = function(array, results) {
		var ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );
		} else {
			if ( typeof array.length === "number" ) {
				for ( var i = 0, l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}
			} else {
				for ( var i = 0; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("form"),
		id = "script" + (new Date).getTime();
	form.innerHTML = "<input name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	var root = document.documentElement;
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( !!document.getElementById( id ) ) {
		Expr.find.ID = function(match, context, isXML){
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				return m ? m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ? [m] : undefined : [];
			}
		};

		Expr.filter.ID = function(elem, match){
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function(match, context){
			var results = context.getElementsByTagName(match[1]);

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";
	if ( div.firstChild && div.firstChild.getAttribute("href") !== "#" ) {
		Expr.attrHandle.href = function(elem){
			return elem.getAttribute("href", 2);
		};
	}
})();

if ( document.querySelectorAll ) (function(){
	var oldSizzle = Sizzle, div = document.createElement("div");
	div.innerHTML = "<p class='TEST'></p>";

	// Safari can't handle uppercase or unicode characters when
	// in quirks mode.
	if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
		return;
	}
	
	Sizzle = function(query, context, extra, seed){
		context = context || document;

		// Only use querySelectorAll on non-XML documents
		// (ID selectors don't work in non-HTML documents)
		if ( !seed && context.nodeType === 9 && !isXML(context) ) {
			try {
				return makeArray( context.querySelectorAll(query), extra );
			} catch(e){}
		}
		
		return oldSizzle(query, context, extra, seed);
	};

	Sizzle.find = oldSizzle.find;
	Sizzle.filter = oldSizzle.filter;
	Sizzle.selectors = oldSizzle.selectors;
	Sizzle.matches = oldSizzle.matches;
})();

if ( document.getElementsByClassName && document.documentElement.getElementsByClassName ) {
	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function(match, context) {
		return context.getElementsByClassName(match[1]);
	};
}

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];
		if ( elem ) {
			elem = elem[dir];
			var match = false;

			while ( elem && elem.nodeType ) {
				var done = elem[doneName];
				if ( done ) {
					match = checkSet[ done ];
					break;
				}

				if ( elem.nodeType === 1 && !isXML )
					elem[doneName] = i;

				if ( elem.nodeName === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];
		if ( elem ) {
			elem = elem[dir];
			var match = false;

			while ( elem && elem.nodeType ) {
				if ( elem[doneName] ) {
					match = checkSet[ elem[doneName] ];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML )
						elem[doneName] = i;

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

var contains = document.compareDocumentPosition ?  function(a, b){
	return a.compareDocumentPosition(b) & 16;
} : function(a, b){
	return a !== b && (a.contains ? a.contains(b) : true);
};

var isXML = function(elem){
	return elem.nodeType === 9 && elem.documentElement.nodeName !== "HTML" ||
		!!elem.ownerDocument && isXML( elem.ownerDocument );
};

var posProcess = function(selector, context){
	var tmpSet = [], later = "", match,
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
jQuery.find = Sizzle;
jQuery.filter = Sizzle.filter;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;

Sizzle.selectors.filters.hidden = function(elem){
	return "hidden" === elem.type ||
		jQuery.css(elem, "display") === "none" ||
		jQuery.css(elem, "visibility") === "hidden";
};

Sizzle.selectors.filters.visible = function(elem){
	return "hidden" !== elem.type &&
		jQuery.css(elem, "display") !== "none" &&
		jQuery.css(elem, "visibility") !== "hidden";
};

Sizzle.selectors.filters.animated = function(elem){
	return jQuery.grep(jQuery.timers, function(fn){
		return elem === fn.elem;
	}).length;
};

jQuery.multiFilter = function( expr, elems, not ) {
	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return Sizzle.matches(expr, elems);
};

jQuery.dir = function( elem, dir ){
	var matched = [], cur = elem[dir];
	while ( cur && cur != document ) {
		if ( cur.nodeType == 1 )
			matched.push( cur );
		cur = cur[dir];
	}
	return matched;
};

jQuery.nth = function(cur, result, dir, elem){
	result = result || 1;
	var num = 0;

	for ( ; cur; cur = cur[dir] )
		if ( cur.nodeType == 1 && ++num == result )
			break;

	return cur;
};

jQuery.sibling = function(n, elem){
	var r = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType == 1 && n != elem )
			r.push( n );
	}

	return r;
};

return;

window.Sizzle = Sizzle;

})();
/*
 * A number of helper functions used for managing events.
 * Many of the ideas behind this code originated from
 * Dean Edwards' addEvent library.
 */
jQuery.event = {

	// Bind an event to an element
	// Original by Dean Edwards
	add: function(elem, types, handler, data) {
		if ( elem.nodeType == 3 || elem.nodeType == 8 )
			return;

		// For whatever reason, IE has trouble passing the window object
		// around, causing it to be cloned in the process
		if ( elem.setInterval && elem != window )
			elem = window;

		// Make sure that the function being executed has a unique ID
		if ( !handler.guid )
			handler.guid = this.guid++;

		// if data is passed, bind to handler
		if ( data !== undefined ) {
			// Create temporary function pointer to original handler
			var fn = handler;

			// Create unique handler function, wrapped around original handler
			handler = this.proxy( fn );

			// Store data in unique handler
			handler.data = data;
		}

		// Init the element's event structure
		var events = jQuery.data(elem, "events") || jQuery.data(elem, "events", {}),
			handle = jQuery.data(elem, "handle") || jQuery.data(elem, "handle", function(){
				// Handle the second event of a trigger and when
				// an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && !jQuery.event.triggered ?
					jQuery.event.handle.apply(arguments.callee.elem, arguments) :
					undefined;
			});
		// Add elem as a property of the handle function
		// This is to prevent a memory leak with non-native
		// event in IE.
		handle.elem = elem;

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		jQuery.each(types.split(/\s+/), function(index, type) {
			// Namespaced event handlers
			var namespaces = type.split(".");
			type = namespaces.shift();
			handler.type = namespaces.slice().sort().join(".");

			// Get the current list of functions bound to this event
			var handlers = events[type];
			
			if ( jQuery.event.specialAll[type] )
				jQuery.event.specialAll[type].setup.call(elem, data, namespaces);

			// Init the event handler queue
			if (!handlers) {
				handlers = events[type] = {};

				// Check for a special event handler
				// Only use addEventListener/attachEvent if the special
				// events handler returns false
				if ( !jQuery.event.special[type] || jQuery.event.special[type].setup.call(elem, data, namespaces) === false ) {
					// Bind the global event handler to the element
					if (elem.addEventListener)
						elem.addEventListener(type, handle, false);
					else if (elem.attachEvent)
						elem.attachEvent("on" + type, handle);
				}
			}

			// Add the function to the element's handler list
			handlers[handler.guid] = handler;

			// Keep track of which events have been used, for global triggering
			jQuery.event.global[type] = true;
		});

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	guid: 1,
	global: {},

	// Detach an event or set of events from an element
	remove: function(elem, types, handler) {
		// don't do events on text and comment nodes
		if ( elem.nodeType == 3 || elem.nodeType == 8 )
			return;

		var events = jQuery.data(elem, "events"), ret, index;

		if ( events ) {
			// Unbind all events for the element
			if ( types === undefined || (typeof types === "string" && types.charAt(0) == ".") )
				for ( var type in events )
					this.remove( elem, type + (types || "") );
			else {
				// types is actually an event object here
				if ( types.type ) {
					handler = types.handler;
					types = types.type;
				}

				// Handle multiple events seperated by a space
				// jQuery(...).unbind("mouseover mouseout", fn);
				jQuery.each(types.split(/\s+/), function(index, type){
					// Namespaced event handlers
					var namespaces = type.split(".");
					type = namespaces.shift();
					var namespace = RegExp("(^|\\.)" + namespaces.slice().sort().join(".*\\.") + "(\\.|$)");

					if ( events[type] ) {
						// remove the given handler for the given type
						if ( handler )
							delete events[type][handler.guid];

						// remove all handlers for the given type
						else
							for ( var handle in events[type] )
								// Handle the removal of namespaced events
								if ( namespace.test(events[type][handle].type) )
									delete events[type][handle];
									
						if ( jQuery.event.specialAll[type] )
							jQuery.event.specialAll[type].teardown.call(elem, namespaces);

						// remove generic event handler if no more handlers exist
						for ( ret in events[type] ) break;
						if ( !ret ) {
							if ( !jQuery.event.special[type] || jQuery.event.special[type].teardown.call(elem, namespaces) === false ) {
								if (elem.removeEventListener)
									elem.removeEventListener(type, jQuery.data(elem, "handle"), false);
								else if (elem.detachEvent)
									elem.detachEvent("on" + type, jQuery.data(elem, "handle"));
							}
							ret = null;
							delete events[type];
						}
					}
				});
			}

			// Remove the expando if it's no longer used
			for ( ret in events ) break;
			if ( !ret ) {
				var handle = jQuery.data( elem, "handle" );
				if ( handle ) handle.elem = null;
				jQuery.removeData( elem, "events" );
				jQuery.removeData( elem, "handle" );
			}
		}
	},

	// bubbling is internal
	trigger: function( event, data, elem, bubbling ) {
		// Event object or event type
		var type = event.type || event;

		if( !bubbling ){
			event = typeof event === "object" ?
				// jQuery.Event object
				event[expando] ? event :
				// Object literal
				jQuery.extend( jQuery.Event(type), event ) :
				// Just the event type (string)
				jQuery.Event(type);

			if ( type.indexOf("!") >= 0 ) {
				event.type = type = type.slice(0, -1);
				event.exclusive = true;
			}

			// Handle a global trigger
			if ( !elem ) {
				// Don't bubble custom events when global (to avoid too much overhead)
				event.stopPropagation();
				// Only trigger if we've ever bound an event for it
				if ( this.global[type] )
					jQuery.each( jQuery.cache, function(){
						if ( this.events && this.events[type] )
							jQuery.event.trigger( event, data, this.handle.elem );
					});
			}

			// Handle triggering a single element

			// don't do events on text and comment nodes
			if ( !elem || elem.nodeType == 3 || elem.nodeType == 8 )
				return undefined;
			
			// Clean up in case it is reused
			event.result = undefined;
			event.target = elem;
			
			// Clone the incoming data, if any
			data = jQuery.makeArray(data);
			data.unshift( event );
		}

		event.currentTarget = elem;

		// Trigger the event, it is assumed that "handle" is a function
		var handle = jQuery.data(elem, "handle");
		if ( handle )
			handle.apply( elem, data );

		// Handle triggering native .onfoo handlers (and on links since we don't call .click() for links)
		if ( (!elem[type] || (jQuery.nodeName(elem, 'a') && type == "click")) && elem["on"+type] && elem["on"+type].apply( elem, data ) === false )
			event.result = false;

		// Trigger the native events (except for clicks on links)
		if ( !bubbling && elem[type] && !event.isDefaultPrevented() && !(jQuery.nodeName(elem, 'a') && type == "click") ) {
			this.triggered = true;
			try {
				elem[ type ]();
			// prevent IE from throwing an error for some hidden elements
			} catch (e) {}
		}

		this.triggered = false;

		if ( !event.isPropagationStopped() ) {
			var parent = elem.parentNode || elem.ownerDocument;
			if ( parent )
				jQuery.event.trigger(event, data, parent, true);
		}
	},

	handle: function(event) {
		// returned undefined or false
		var all, handlers;

		event = arguments[0] = jQuery.event.fix( event || window.event );

		// Namespaced event handlers
		var namespaces = event.type.split(".");
		event.type = namespaces.shift();

		// Cache this now, all = true means, any handler
		all = !namespaces.length && !event.exclusive;
		
		var namespace = RegExp("(^|\\.)" + namespaces.slice().sort().join(".*\\.") + "(\\.|$)");

		handlers = ( jQuery.data(this, "events") || {} )[event.type];

		for ( var j in handlers ) {
			var handler = handlers[j];

			// Filter the functions by class
			if ( all || namespace.test(handler.type) ) {
				// Pass in a reference to the handler function itself
				// So that we can later remove it
				event.handler = handler;
				event.data = handler.data;

				var ret = handler.apply(this, arguments);

				if( ret !== undefined ){
					event.result = ret;
					if ( ret === false ) {
						event.preventDefault();
						event.stopPropagation();
					}
				}

				if( event.isImmediatePropagationStopped() )
					break;

			}
		}
	},

	props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode metaKey newValue originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),

	fix: function(event) {
		if ( event[expando] )
			return event;

		// store a copy of the original event object
		// and "clone" to set read-only properties
		var originalEvent = event;
		event = jQuery.Event( originalEvent );

		for ( var i = this.props.length, prop; i; ){
			prop = this.props[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary
		if ( !event.target )
			event.target = event.srcElement || document; // Fixes #1925 where srcElement might not be defined either

		// check if target is a textnode (safari)
		if ( event.target.nodeType == 3 )
			event.target = event.target.parentNode;

		// Add relatedTarget, if necessary
		if ( !event.relatedTarget && event.fromElement )
			event.relatedTarget = event.fromElement == event.target ? event.toElement : event.fromElement;

		// Calculate pageX/Y if missing and clientX/Y available
		if ( event.pageX == null && event.clientX != null ) {
			var doc = document.documentElement, body = document.body;
			event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0);
			event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0);
		}

		// Add which for key events
		if ( !event.which && ((event.charCode || event.charCode === 0) ? event.charCode : event.keyCode) )
			event.which = event.charCode || event.keyCode;

		// Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
		if ( !event.metaKey && event.ctrlKey )
			event.metaKey = event.ctrlKey;

		// Add which for click: 1 == left; 2 == middle; 3 == right
		// Note: button is not normalized, so don't use it
		if ( !event.which && event.button )
			event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));

		return event;
	},

	proxy: function( fn, proxy ){
		proxy = proxy || function(){ return fn.apply(this, arguments); };
		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || proxy.guid || this.guid++;
		// So proxy can be declared as an argument
		return proxy;
	},

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: bindReady,
			teardown: function() {}
		}
	},
	
	specialAll: {
		live: {
			setup: function( selector, namespaces ){
				jQuery.event.add( this, namespaces[0], liveHandler );
			},
			teardown:  function( namespaces ){
				if ( namespaces.length ) {
					var remove = 0, name = RegExp("(^|\\.)" + namespaces[0] + "(\\.|$)");
					
					jQuery.each( (jQuery.data(this, "events").live || {}), function(){
						if ( name.test(this.type) )
							remove++;
					});
					
					if ( remove < 1 )
						jQuery.event.remove( this, namespaces[0], liveHandler );
				}
			}
		}
	}
};

jQuery.Event = function( src ){
	// Allow instantiation without the 'new' keyword
	if( !this.preventDefault )
		return new jQuery.Event(src);
	
	// Event object
	if( src && src.type ){
		this.originalEvent = src;
		this.type = src.type;
	// Event type
	}else
		this.type = src;

	// timeStamp is buggy for some events on Firefox(#3843)
	// So we won't rely on the native value
	this.timeStamp = now();
	
	// Mark it as fixed
	this[expando] = true;
};

function returnFalse(){
	return false;
}
function returnTrue(){
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if( !e )
			return;
		// if preventDefault exists run it on the original event
		if (e.preventDefault)
			e.preventDefault();
		// otherwise set the returnValue property of the original event to false (IE)
		e.returnValue = false;
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if( !e )
			return;
		// if stopPropagation exists run it on the original event
		if (e.stopPropagation)
			e.stopPropagation();
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation:function(){
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};
// Checks if an event happened on an element within another element
// Used in jQuery.event.special.mouseenter and mouseleave handlers
var withinElement = function(event) {
	// Check if mouse(over|out) are still within the same parent element
	var parent = event.relatedTarget;
	// Traverse up the tree
	while ( parent && parent != this )
		try { parent = parent.parentNode; }
		catch(e) { parent = this; }
	
	if( parent != this ){
		// set the correct event type
		event.type = event.data;
		// handle event if we actually just moused on to a non sub-element
		jQuery.event.handle.apply( this, arguments );
	}
};
	
jQuery.each({ 
	mouseover: 'mouseenter', 
	mouseout: 'mouseleave'
}, function( orig, fix ){
	jQuery.event.special[ fix ] = {
		setup: function(){
			jQuery.event.add( this, orig, withinElement, fix );
		},
		teardown: function(){
			jQuery.event.remove( this, orig, withinElement );
		}
	};			   
});

jQuery.fn.extend({
	bind: function( type, data, fn ) {
		return type == "unload" ? this.one(type, data, fn) : this.each(function(){
			jQuery.event.add( this, type, fn || data, fn && data );
		});
	},

	one: function( type, data, fn ) {
		var one = jQuery.event.proxy( fn || data, function(event) {
			jQuery(this).unbind(event, one);
			return (fn || data).apply( this, arguments );
		});
		return this.each(function(){
			jQuery.event.add( this, type, one, fn && data);
		});
	},

	unbind: function( type, fn ) {
		return this.each(function(){
			jQuery.event.remove( this, type, fn );
		});
	},

	trigger: function( type, data ) {
		return this.each(function(){
			jQuery.event.trigger( type, data, this );
		});
	},

	triggerHandler: function( type, data ) {
		if( this[0] ){
			var event = jQuery.Event(type);
			event.preventDefault();
			event.stopPropagation();
			jQuery.event.trigger( event, data, this[0] );
			return event.result;
		}		
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments, i = 1;

		// link all the functions, so any of them can unbind this click handler
		while( i < args.length )
			jQuery.event.proxy( fn, args[i++] );

		return this.click( jQuery.event.proxy( fn, function(event) {
			// Figure out which function to execute
			this.lastToggle = ( this.lastToggle || 0 ) % i;

			// Make sure that clicks stop
			event.preventDefault();

			// and execute the function
			return args[ this.lastToggle++ ].apply( this, arguments ) || false;
		}));
	},

	hover: function(fnOver, fnOut) {
		return this.mouseenter(fnOver).mouseleave(fnOut);
	},

	ready: function(fn) {
		// Attach the listeners
		bindReady();

		// If the DOM is already ready
		if ( jQuery.isReady )
			// Execute the function immediately
			fn.call( document, jQuery );

		// Otherwise, remember the function for later
		else
			// Add the function to the wait list
			jQuery.readyList.push( fn );

		return this;
	},
	
	live: function( type, fn ){
		var proxy = jQuery.event.proxy( fn );
		proxy.guid += this.selector + type;

		jQuery(document).bind( liveConvert(type, this.selector), this.selector, proxy );

		return this;
	},
	
	die: function( type, fn ){
		jQuery(document).unbind( liveConvert(type, this.selector), fn ? { guid: fn.guid + this.selector + type } : null );
		return this;
	}
});

function liveHandler( event ){
	var check = RegExp("(^|\\.)" + event.type + "(\\.|$)"),
		stop = true,
		elems = [];

	jQuery.each(jQuery.data(this, "events").live || [], function(i, fn){
		if ( check.test(fn.type) ) {
			var elem = jQuery(event.target).closest(fn.data)[0];
			if ( elem )
				elems.push({ elem: elem, fn: fn });
		}
	});

	jQuery.each(elems, function(){
		if ( this.fn.call(this.elem, event, this.fn.data) === false )
			stop = false;
	});

	return stop;
}

function liveConvert(type, selector){
	return ["live", type, selector.replace(/\./g, "`").replace(/ /g, "|")].join(".");
}

jQuery.extend({
	isReady: false,
	readyList: [],
	// Handle when the DOM is ready
	ready: function() {
		// Make sure that the DOM is not already loaded
		if ( !jQuery.isReady ) {
			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If there are functions bound, to execute
			if ( jQuery.readyList ) {
				// Execute all of them
				jQuery.each( jQuery.readyList, function(){
					this.call( document, jQuery );
				});

				// Reset the list of functions
				jQuery.readyList = null;
			}

			// Trigger any bound ready events
			jQuery(document).triggerHandler("ready");
		}
	}
});

var readyBound = false;

function bindReady(){
	if ( readyBound ) return;
	readyBound = true;

	// Mozilla, Opera and webkit nightlies currently support this event
	if ( document.addEventListener ) {
		// Use the handy event callback
		document.addEventListener( "DOMContentLoaded", function(){
			document.removeEventListener( "DOMContentLoaded", arguments.callee, false );
			jQuery.ready();
		}, false );

	// If IE event model is used
	} else if ( document.attachEvent ) {
		// ensure firing before onload,
		// maybe late but safe also for iframes
		document.attachEvent("onreadystatechange", function(){
			if ( document.readyState === "complete" ) {
				document.detachEvent( "onreadystatechange", arguments.callee );
				jQuery.ready();
			}
		});

		// If IE and not an iframe
		// continually check to see if the document is ready
		if ( document.documentElement.doScroll && typeof window.frameElement === "undefined" ) (function(){
			if ( jQuery.isReady ) return;

			try {
				// If IE is used, use the trick by Diego Perini
				// http://javascript.nwbox.com/IEContentLoaded/
				document.documentElement.doScroll("left");
			} catch( error ) {
				setTimeout( arguments.callee, 0 );
				return;
			}

			// and execute any waiting functions
			jQuery.ready();
		})();
	}

	// A fallback to window.onload, that will always work
	jQuery.event.add( window, "load", jQuery.ready );
}

jQuery.each( ("blur,focus,load,resize,scroll,unload,click,dblclick," +
	"mousedown,mouseup,mousemove,mouseover,mouseout,mouseenter,mouseleave," +
	"change,select,submit,keydown,keypress,keyup,error").split(","), function(i, name){

	// Handle event binding
	jQuery.fn[name] = function(fn){
		return fn ? this.bind(name, fn) : this.trigger(name);
	};
});

// Prevent memory leaks in IE
// And prevent errors on refresh with events like mouseover in other browsers
// Window isn't included so as not to unbind existing unload events
jQuery( window ).bind( 'unload', function(){ 
	for ( var id in jQuery.cache )
		// Skip the window
		if ( id != 1 && jQuery.cache[ id ].handle )
			jQuery.event.remove( jQuery.cache[ id ].handle.elem );
}); 
(function(){

	jQuery.support = {};

	var root = document.documentElement,
		script = document.createElement("script"),
		div = document.createElement("div"),
		id = "script" + (new Date).getTime();

	div.style.display = "none";
	div.innerHTML = '   <link/><table></table><a href="/a" style="color:red;float:left;opacity:.5;">a</a><select><option>text</option></select><object><param/></object>';

	var all = div.getElementsByTagName("*"),
		a = div.getElementsByTagName("a")[0];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return;
	}

	jQuery.support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: div.firstChild.nodeType == 3,
		
		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,
		
		// Make sure that you can get all elements in an <object> element
		// IE 7 always returns no results
		objectAll: !!div.getElementsByTagName("object")[0]
			.getElementsByTagName("*").length,
		
		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,
		
		// Get the style information from getAttribute
		// (IE uses .cssText insted)
		style: /red/.test( a.getAttribute("style") ),
		
		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: a.getAttribute("href") === "/a",
		
		// Make sure that element opacity exists
		// (IE uses filter instead)
		opacity: a.style.opacity === "0.5",
		
		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Will be defined later
		scriptEval: false,
		noCloneEvent: true,
		boxModel: null
	};
	
	script.type = "text/javascript";
	try {
		script.appendChild( document.createTextNode( "window." + id + "=1;" ) );
	} catch(e){}

	root.insertBefore( script, root.firstChild );
	
	// Make sure that the execution of code works by injecting a script
	// tag with appendChild/createTextNode
	// (IE doesn't support this, fails, and uses .text instead)
	if ( window[ id ] ) {
		jQuery.support.scriptEval = true;
		delete window[ id ];
	}

	root.removeChild( script );

	if ( div.attachEvent && div.fireEvent ) {
		div.attachEvent("onclick", function(){
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			jQuery.support.noCloneEvent = false;
			div.detachEvent("onclick", arguments.callee);
		});
		div.cloneNode(true).fireEvent("onclick");
	}

	// Figure out if the W3C box model works as expected
	// document.body must exist before we can do this
	jQuery(function(){
		var div = document.createElement("div");
		div.style.width = "1px";
		div.style.paddingLeft = "1px";

		document.body.appendChild( div );
		jQuery.boxModel = jQuery.support.boxModel = div.offsetWidth === 2;
		document.body.removeChild( div );
	});
})();

var styleFloat = jQuery.support.cssFloat ? "cssFloat" : "styleFloat";

jQuery.props = {
	"for": "htmlFor",
	"class": "className",
	"float": styleFloat,
	cssFloat: styleFloat,
	styleFloat: styleFloat,
	readonly: "readOnly",
	maxlength: "maxLength",
	cellspacing: "cellSpacing",
	rowspan: "rowSpan",
	tabindex: "tabIndex"
};
jQuery.fn.extend({
	// Keep a copy of the old load
	_load: jQuery.fn.load,

	load: function( url, params, callback ) {
		if ( typeof url !== "string" )
			return this._load( url );

		var off = url.indexOf(" ");
		if ( off >= 0 ) {
			var selector = url.slice(off, url.length);
			url = url.slice(0, off);
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params )
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = null;

			// Otherwise, build a param string
			} else if( typeof params === "object" ) {
				params = jQuery.param( params );
				type = "POST";
			}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			complete: function(res, status){
				// If successful, inject the HTML into all the matched elements
				if ( status == "success" || status == "notmodified" )
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div/>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(res.responseText.replace(/<script(.|\s)*?\/script>/g, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						res.responseText );

				if( callback )
					self.each( callback, [res.responseText, status, res] );
			}
		});
		return this;
	},

	serialize: function() {
		return jQuery.param(this.serializeArray());
	},
	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray(this.elements) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				(this.checked || /select|textarea/i.test(this.nodeName) ||
					/text|hidden|password/i.test(this.type));
		})
		.map(function(i, elem){
			var val = jQuery(this).val();
			return val == null ? null :
				jQuery.isArray(val) ?
					jQuery.map( val, function(val, i){
						return {name: elem.name, value: val};
					}) :
					{name: elem.name, value: val};
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart,ajaxStop,ajaxComplete,ajaxError,ajaxSuccess,ajaxSend".split(","), function(i,o){
	jQuery.fn[o] = function(f){
		return this.bind(o, f);
	};
});

var jsc = now();

jQuery.extend({
  
	get: function( url, data, callback, type ) {
		// shift arguments if data argument was ommited
		if ( jQuery.isFunction( data ) ) {
			callback = data;
			data = null;
		}

		return jQuery.ajax({
			type: "GET",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},

	getScript: function( url, callback ) {
		return jQuery.get(url, null, callback, "script");
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get(url, data, callback, "json");
	},

	post: function( url, data, callback, type ) {
		if ( jQuery.isFunction( data ) ) {
			callback = data;
			data = {};
		}

		return jQuery.ajax({
			type: "POST",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},

	ajaxSetup: function( settings ) {
		jQuery.extend( jQuery.ajaxSettings, settings );
	},

	ajaxSettings: {
		url: location.href,
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		username: null,
		password: null,
		*/
		// Create the request object; Microsoft failed to properly
		// implement the XMLHttpRequest in IE7, so we use the ActiveXObject when it is available
		// This function can be overriden by calling jQuery.ajaxSetup
		xhr:function(){
			return window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
		},
		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			script: "text/javascript, application/javascript",
			json: "application/json, text/javascript",
			text: "text/plain",
			_default: "*/*"
		}
	},

	// Last-Modified header cache for next request
	lastModified: {},

	ajax: function( s ) {
		// Extend the settings, but re-extend 's' so that it can be
		// checked again later (in the test suite, specifically)
		s = jQuery.extend(true, s, jQuery.extend(true, {}, jQuery.ajaxSettings, s));

		var jsonp, jsre = /=\?(&|$)/g, status, data,
			type = s.type.toUpperCase();

		// convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" )
			s.data = jQuery.param(s.data);

		// Handle JSONP Parameter Callbacks
		if ( s.dataType == "jsonp" ) {
			if ( type == "GET" ) {
				if ( !s.url.match(jsre) )
					s.url += (s.url.match(/\?/) ? "&" : "?") + (s.jsonp || "callback") + "=?";
			} else if ( !s.data || !s.data.match(jsre) )
				s.data = (s.data ? s.data + "&" : "") + (s.jsonp || "callback") + "=?";
			s.dataType = "json";
		}

		// Build temporary JSONP function
		if ( s.dataType == "json" && (s.data && s.data.match(jsre) || s.url.match(jsre)) ) {
			jsonp = "jsonp" + jsc++;

			// Replace the =? sequence both in the query string and the data
			if ( s.data )
				s.data = (s.data + "").replace(jsre, "=" + jsonp + "$1");
			s.url = s.url.replace(jsre, "=" + jsonp + "$1");

			// We need to make sure
			// that a JSONP style response is executed properly
			s.dataType = "script";

			// Handle JSONP-style loading
			window[ jsonp ] = function(tmp){
				data = tmp;
				success();
				complete();
				// Garbage collect
				window[ jsonp ] = undefined;
				try{ delete window[ jsonp ]; } catch(e){}
				if ( head )
					head.removeChild( script );
			};
		}

		if ( s.dataType == "script" && s.cache == null )
			s.cache = false;

		if ( s.cache === false && type == "GET" ) {
			var ts = now();
			// try replacing _= if it is there
			var ret = s.url.replace(/(\?|&)_=.*?(&|$)/, "$1_=" + ts + "$2");
			// if nothing was replaced, add timestamp to the end
			s.url = ret + ((ret == s.url) ? (s.url.match(/\?/) ? "&" : "?") + "_=" + ts : "");
		}

		// If data is available, append data to url for get requests
		if ( s.data && type == "GET" ) {
			s.url += (s.url.match(/\?/) ? "&" : "?") + s.data;

			// IE likes to send both get and post data, prevent this
			s.data = null;
		}

		// Watch for a new set of requests
		if ( s.global && ! jQuery.active++ )
			jQuery.event.trigger( "ajaxStart" );

		// Matches an absolute URL, and saves the domain
		var parts = /^(\w+:)?\/\/([^\/?#]+)/.exec( s.url );

		// If we're requesting a remote document
		// and trying to load JSON or Script with a GET
		if ( s.dataType == "script" && type == "GET" && parts
			&& ( parts[1] && parts[1] != location.protocol || parts[2] != location.host )){

			var head = document.getElementsByTagName("head")[0];
			var script = document.createElement("script");
			script.src = s.url;
			if (s.scriptCharset)
				script.charset = s.scriptCharset;

			// Handle Script loading
			if ( !jsonp ) {
				var done = false;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function(){
					if ( !done && (!this.readyState ||
							this.readyState == "loaded" || this.readyState == "complete") ) {
						done = true;
						success();
						complete();
						head.removeChild( script );
					}
				};
			}

			head.appendChild(script);

			// We handle everything using the script element injection
			return undefined;
		}

		var requestDone = false;

		// Create the request object
		var xhr = s.xhr();

		// Open the socket
		// Passing null username, generates a login popup on Opera (#2865)
		if( s.username )
			xhr.open(type, s.url, s.async, s.username, s.password);
		else
			xhr.open(type, s.url, s.async);

		// Need an extra try/catch for cross domain requests in Firefox 3
		try {
			// Set the correct header, if data is being sent
			if ( s.data )
				xhr.setRequestHeader("Content-Type", s.contentType);

			// Set the If-Modified-Since header, if ifModified mode.
			if ( s.ifModified )
				xhr.setRequestHeader("If-Modified-Since",
					jQuery.lastModified[s.url] || "Thu, 01 Jan 1970 00:00:00 GMT" );

			// Set header so the called script knows that it's an XMLHttpRequest
			xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

			// Set the Accepts header for the server, depending on the dataType
			xhr.setRequestHeader("Accept", s.dataType && s.accepts[ s.dataType ] ?
				s.accepts[ s.dataType ] + ", */*" :
				s.accepts._default );
		} catch(e){}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && s.beforeSend(xhr, s) === false ) {
			// Handle the global AJAX counter
			if ( s.global && ! --jQuery.active )
				jQuery.event.trigger( "ajaxStop" );
			// close opended socket
			xhr.abort();
			return false;
		}

		if ( s.global )
			jQuery.event.trigger("ajaxSend", [xhr, s]);

		// Wait for a response to come back
		var onreadystatechange = function(isTimeout){
			// The request was aborted, clear the interval and decrement jQuery.active
			if (xhr.readyState == 0) {
				if (ival) {
					// clear poll interval
					clearInterval(ival);
					ival = null;
					// Handle the global AJAX counter
					if ( s.global && ! --jQuery.active )
						jQuery.event.trigger( "ajaxStop" );
				}
			// The transfer is complete and the data is available, or the request timed out
			} else if ( !requestDone && xhr && (xhr.readyState == 4 || isTimeout == "timeout") ) {
				requestDone = true;

				// clear poll interval
				if (ival) {
					clearInterval(ival);
					ival = null;
				}

				status = isTimeout == "timeout" ? "timeout" :
					!jQuery.httpSuccess( xhr ) ? "error" :
					s.ifModified && jQuery.httpNotModified( xhr, s.url ) ? "notmodified" :
					"success";

				if ( status == "success" ) {
					// Watch for, and catch, XML document parse errors
					try {
						// process the data (runs the xml through httpData regardless of callback)
						data = jQuery.httpData( xhr, s.dataType, s );
					} catch(e) {
						status = "parsererror";
					}
				}

				// Make sure that the request was successful or notmodified
				if ( status == "success" ) {
					// Cache Last-Modified header, if ifModified mode.
					var modRes;
					try {
						modRes = xhr.getResponseHeader("Last-Modified");
					} catch(e) {} // swallow exception thrown by FF if header is not available

					if ( s.ifModified && modRes )
						jQuery.lastModified[s.url] = modRes;

					// JSONP handles its own success callback
					if ( !jsonp )
						success();
				} else
					jQuery.handleError(s, xhr, status);

				// Fire the complete handlers
				complete();

				if ( isTimeout )
					xhr.abort();

				// Stop memory leaks
				if ( s.async )
					xhr = null;
			}
		};

		if ( s.async ) {
			// don't attach the handler to the request, just poll it instead
			var ival = setInterval(onreadystatechange, 13);

			// Timeout checker
			if ( s.timeout > 0 )
				setTimeout(function(){
					// Check to see if the request is still happening
					if ( xhr && !requestDone )
						onreadystatechange( "timeout" );
				}, s.timeout);
		}

		// Send the data
		try {
			xhr.send(s.data);
		} catch(e) {
			jQuery.handleError(s, xhr, null, e);
		}

		// firefox 1.5 doesn't fire statechange for sync requests
		if ( !s.async )
			onreadystatechange();

		function success(){
			// If a local callback was specified, fire it and pass it the data
			if ( s.success )
				s.success( data, status );

			// Fire the global callback
			if ( s.global )
				jQuery.event.trigger( "ajaxSuccess", [xhr, s] );
		}

		function complete(){
			// Process result
			if ( s.complete )
				s.complete(xhr, status);

			// The request was completed
			if ( s.global )
				jQuery.event.trigger( "ajaxComplete", [xhr, s] );

			// Handle the global AJAX counter
			if ( s.global && ! --jQuery.active )
				jQuery.event.trigger( "ajaxStop" );
		}

		// return XMLHttpRequest to allow aborting the request etc.
		return xhr;
	},

	handleError: function( s, xhr, status, e ) {
		// If a local callback was specified, fire it
		if ( s.error ) s.error( xhr, status, e );

		// Fire the global callback
		if ( s.global )
			jQuery.event.trigger( "ajaxError", [xhr, s, e] );
	},

	// Counter for holding the number of active queries
	active: 0,

	// Determines if an XMLHttpRequest was successful or not
	httpSuccess: function( xhr ) {
		try {
			// IE error sometimes returns 1223 when it should be 204 so treat it as success, see #1450
			return !xhr.status && location.protocol == "file:" ||
				( xhr.status >= 200 && xhr.status < 300 ) || xhr.status == 304 || xhr.status == 1223;
		} catch(e){}
		return false;
	},

	// Determines if an XMLHttpRequest returns NotModified
	httpNotModified: function( xhr, url ) {
		try {
			var xhrRes = xhr.getResponseHeader("Last-Modified");

			// Firefox always returns 200. check Last-Modified date
			return xhr.status == 304 || xhrRes == jQuery.lastModified[url];
		} catch(e){}
		return false;
	},

	httpData: function( xhr, type, s ) {
		var ct = xhr.getResponseHeader("content-type"),
			xml = type == "xml" || !type && ct && ct.indexOf("xml") >= 0,
			data = xml ? xhr.responseXML : xhr.responseText;

		if ( xml && data.documentElement.tagName == "parsererror" )
			throw "parsererror";
			
		// Allow a pre-filtering function to sanitize the response
		// s != null is checked to keep backwards compatibility
		if( s && s.dataFilter )
			data = s.dataFilter( data, type );

		// The filter can actually parse the response
		if( typeof data === "string" ){

			// If the type is "script", eval it in global context
			if ( type == "script" )
				jQuery.globalEval( data );

			// Get the JavaScript object, if JSON is used.
			if ( type == "json" )
				data = window["eval"]("(" + data + ")");
		}
		
		return data;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a ) {
		var s = [ ];

		function add( key, value ){
			s[ s.length ] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
		};

		// If an array was passed in, assume that it is an array
		// of form elements
		if ( jQuery.isArray(a) || a.jquery )
			// Serialize the form elements
			jQuery.each( a, function(){
				add( this.name, this.value );
			});

		// Otherwise, assume that it's an object of key/value pairs
		else
			// Serialize the key/values
			for ( var j in a )
				// If the value is an array then the key names need to be repeated
				if ( jQuery.isArray(a[j]) )
					jQuery.each( a[j], function(){
						add( j, this );
					});
				else
					add( j, jQuery.isFunction(a[j]) ? a[j]() : a[j] );

		// Return the resulting serialization
		return s.join("&").replace(/%20/g, "+");
	}

});
var elemdisplay = {},
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	];

function genFx( type, num ){
	var obj = {};
	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice(0,num)), function(){
		obj[ this ] = type;
	});
	return obj;
}

jQuery.fn.extend({
	show: function(speed,callback){
		if ( speed ) {
			return this.animate( genFx("show", 3), speed, callback);
		} else {
			for ( var i = 0, l = this.length; i < l; i++ ){
				var old = jQuery.data(this[i], "olddisplay");
				
				this[i].style.display = old || "";
				
				if ( jQuery.css(this[i], "display") === "none" ) {
					var tagName = this[i].tagName, display;
					
					if ( elemdisplay[ tagName ] ) {
						display = elemdisplay[ tagName ];
					} else {
						var elem = jQuery("<" + tagName + " />").appendTo("body");
						
						display = elem.css("display");
						if ( display === "none" )
							display = "block";
						
						elem.remove();
						
						elemdisplay[ tagName ] = display;
					}
					
					this[i].style.display = jQuery.data(this[i], "olddisplay", display);
				}
			}
			
			return this;
		}
	},

	hide: function(speed,callback){
		if ( speed ) {
			return this.animate( genFx("hide", 3), speed, callback);
		} else {
			for ( var i = 0, l = this.length; i < l; i++ ){
				var old = jQuery.data(this[i], "olddisplay");
				if ( !old && old !== "none" )
					jQuery.data(this[i], "olddisplay", jQuery.css(this[i], "display"));
				this[i].style.display = "none";
			}
			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2 ){
		var bool = typeof fn === "boolean";

		return jQuery.isFunction(fn) && jQuery.isFunction(fn2) ?
			this._toggle.apply( this, arguments ) :
			fn == null || bool ?
				this.each(function(){
					var state = bool ? fn : jQuery(this).is(":hidden");
					jQuery(this)[ state ? "show" : "hide" ]();
				}) :
				this.animate(genFx("toggle", 3), fn, fn2);
	},

	fadeTo: function(speed,to,callback){
		return this.animate({opacity: to}, speed, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed(speed, easing, callback);

		return this[ optall.queue === false ? "each" : "queue" ](function(){
		
			var opt = jQuery.extend({}, optall), p,
				hidden = this.nodeType == 1 && jQuery(this).is(":hidden"),
				self = this;
	
			for ( p in prop ) {
				if ( prop[p] == "hide" && hidden || prop[p] == "show" && !hidden )
					return opt.complete.call(this);

				if ( ( p == "height" || p == "width" ) && this.style ) {
					// Store display property
					opt.display = jQuery.css(this, "display");

					// Make sure that nothing sneaks out
					opt.overflow = this.style.overflow;
				}
			}

			if ( opt.overflow != null )
				this.style.overflow = "hidden";

			opt.curAnim = jQuery.extend({}, prop);

			jQuery.each( prop, function(name, val){
				var e = new jQuery.fx( self, opt, name );

				if ( /toggle|show|hide/.test(val) )
					e[ val == "toggle" ? hidden ? "show" : "hide" : val ]( prop );
				else {
					var parts = val.toString().match(/^([+-]=)?([\d+-.]+)(.*)$/),
						start = e.cur(true) || 0;

					if ( parts ) {
						var end = parseFloat(parts[2]),
							unit = parts[3] || "px";

						// We need to compute starting value
						if ( unit != "px" ) {
							self.style[ name ] = (end || 1) + unit;
							start = ((end || 1) / e.cur(true)) * start;
							self.style[ name ] = start + unit;
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] )
							end = ((parts[1] == "-=" ? -1 : 1) * end) + start;

						e.custom( start, end, unit );
					} else
						e.custom( start, val, "" );
				}
			});

			// For JS strict compliance
			return true;
		});
	},

	stop: function(clearQueue, gotoEnd){
		var timers = jQuery.timers;

		if (clearQueue)
			this.queue([]);

		this.each(function(){
			// go in reverse order so anything added to the queue during the loop is ignored
			for ( var i = timers.length - 1; i >= 0; i-- )
				if ( timers[i].elem == this ) {
					if (gotoEnd)
						// force the next step to be the last
						timers[i](true);
					timers.splice(i, 1);
				}
		});

		// start the next in the queue if the last step wasn't forced
		if (!gotoEnd)
			this.dequeue();

		return this;
	}

});

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show", 1),
	slideUp: genFx("hide", 1),
	slideToggle: genFx("toggle", 1),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" }
}, function( name, props ){
	jQuery.fn[ name ] = function( speed, callback ){
		return this.animate( props, speed, callback );
	};
});

jQuery.extend({

	speed: function(speed, easing, fn) {
		var opt = typeof speed === "object" ? speed : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			jQuery.fx.speeds[opt.duration] || jQuery.fx.speeds._default;

		// Queueing
		opt.old = opt.complete;
		opt.complete = function(){
			if ( opt.queue !== false )
				jQuery(this).dequeue();
			if ( jQuery.isFunction( opt.old ) )
				opt.old.call( this );
		};

		return opt;
	},

	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
		}
	},

	timers: [],

	fx: function( elem, options, prop ){
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		if ( !options.orig )
			options.orig = {};
	}

});

jQuery.fx.prototype = {

	// Simple function for setting a style value
	update: function(){
		if ( this.options.step )
			this.options.step.call( this.elem, this.now, this );

		(jQuery.fx.step[this.prop] || jQuery.fx.step._default)( this );

		// Set display property to block for height/width animations
		if ( ( this.prop == "height" || this.prop == "width" ) && this.elem.style )
			this.elem.style.display = "block";
	},

	// Get the current size
	cur: function(force){
		if ( this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null) )
			return this.elem[ this.prop ];

		var r = parseFloat(jQuery.css(this.elem, this.prop, force));
		return r && r > -10000 ? r : parseFloat(jQuery.curCSS(this.elem, this.prop)) || 0;
	},

	// Start an animation from one number to another
	custom: function(from, to, unit){
		this.startTime = now();
		this.start = from;
		this.end = to;
		this.unit = unit || this.unit || "px";
		this.now = this.start;
		this.pos = this.state = 0;

		var self = this;
		function t(gotoEnd){
			return self.step(gotoEnd);
		}

		t.elem = this.elem;

		if ( t() && jQuery.timers.push(t) == 1 ) {
			timerId = setInterval(function(){
				var timers = jQuery.timers;

				for ( var i = 0; i < timers.length; i++ )
					if ( !timers[i]() )
						timers.splice(i--, 1);

				if ( !timers.length ) {
					clearInterval( timerId );
				}
			}, 13);
		}
	},

	// Simple 'show' function
	show: function(){
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.attr( this.elem.style, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any
		// flash of content
		this.custom(this.prop == "width" || this.prop == "height" ? 1 : 0, this.cur());

		// Start by showing the element
		jQuery(this.elem).show();
	},

	// Simple 'hide' function
	hide: function(){
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.attr( this.elem.style, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom(this.cur(), 0);
	},

	// Each step of an animation
	step: function(gotoEnd){
		var t = now();

		if ( gotoEnd || t >= this.options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			this.options.curAnim[ this.prop ] = true;

			var done = true;
			for ( var i in this.options.curAnim )
				if ( this.options.curAnim[i] !== true )
					done = false;

			if ( done ) {
				if ( this.options.display != null ) {
					// Reset the overflow
					this.elem.style.overflow = this.options.overflow;

					// Reset the display
					this.elem.style.display = this.options.display;
					if ( jQuery.css(this.elem, "display") == "none" )
						this.elem.style.display = "block";
				}

				// Hide the element if the "hide" operation was done
				if ( this.options.hide )
					jQuery(this.elem).hide();

				// Reset the properties, if the item has been hidden or shown
				if ( this.options.hide || this.options.show )
					for ( var p in this.options.curAnim )
						jQuery.attr(this.elem.style, p, this.options.orig[p]);
					
				// Execute the complete function
				this.options.complete.call( this.elem );
			}

			return false;
		} else {
			var n = t - this.startTime;
			this.state = n / this.options.duration;

			// Perform the easing function, defaults to swing
			this.pos = jQuery.easing[this.options.easing || (jQuery.easing.swing ? "swing" : "linear")](this.state, n, 0, 1, this.options.duration);
			this.now = this.start + ((this.end - this.start) * this.pos);

			// Perform the next step of the animation
			this.update();
		}

		return true;
	}

};

jQuery.extend( jQuery.fx, {
	speeds:{
		slow: 600,
 		fast: 200,
 		// Default speed
 		_default: 400
	},
	step: {

		opacity: function(fx){
			jQuery.attr(fx.elem.style, "opacity", fx.now);
		},

		_default: function(fx){
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null )
				fx.elem.style[ fx.prop ] = fx.now + fx.unit;
			else
				fx.elem[ fx.prop ] = fx.now;
		}
	}
});
if ( document.documentElement["getBoundingClientRect"] )
	jQuery.fn.offset = function() {
		if ( !this[0] ) return { top: 0, left: 0 };
		if ( this[0] === this[0].ownerDocument.body ) return jQuery.offset.bodyOffset( this[0] );
		var box  = this[0].getBoundingClientRect(), doc = this[0].ownerDocument, body = doc.body, docElem = doc.documentElement,
			clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0,
			top  = box.top  + (self.pageYOffset || jQuery.boxModel && docElem.scrollTop  || body.scrollTop ) - clientTop,
			left = box.left + (self.pageXOffset || jQuery.boxModel && docElem.scrollLeft || body.scrollLeft) - clientLeft;
		return { top: top, left: left };
	};
else 
	jQuery.fn.offset = function() {
		if ( !this[0] ) return { top: 0, left: 0 };
		if ( this[0] === this[0].ownerDocument.body ) return jQuery.offset.bodyOffset( this[0] );
		jQuery.offset.initialized || jQuery.offset.initialize();

		var elem = this[0], offsetParent = elem.offsetParent, prevOffsetParent = elem,
			doc = elem.ownerDocument, computedStyle, docElem = doc.documentElement,
			body = doc.body, defaultView = doc.defaultView,
			prevComputedStyle = defaultView.getComputedStyle(elem, null),
			top = elem.offsetTop, left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			computedStyle = defaultView.getComputedStyle(elem, null);
			top -= elem.scrollTop, left -= elem.scrollLeft;
			if ( elem === offsetParent ) {
				top += elem.offsetTop, left += elem.offsetLeft;
				if ( jQuery.offset.doesNotAddBorder && !(jQuery.offset.doesAddBorderForTableAndCells && /^t(able|d|h)$/i.test(elem.tagName)) )
					top  += parseInt( computedStyle.borderTopWidth,  10) || 0,
					left += parseInt( computedStyle.borderLeftWidth, 10) || 0;
				prevOffsetParent = offsetParent, offsetParent = elem.offsetParent;
			}
			if ( jQuery.offset.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" )
				top  += parseInt( computedStyle.borderTopWidth,  10) || 0,
				left += parseInt( computedStyle.borderLeftWidth, 10) || 0;
			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" )
			top  += body.offsetTop,
			left += body.offsetLeft;

		if ( prevComputedStyle.position === "fixed" )
			top  += Math.max(docElem.scrollTop, body.scrollTop),
			left += Math.max(docElem.scrollLeft, body.scrollLeft);

		return { top: top, left: left };
	};

jQuery.offset = {
	initialize: function() {
		if ( this.initialized ) return;
		var body = document.body, container = document.createElement('div'), innerDiv, checkDiv, table, td, rules, prop, bodyMarginTop = body.style.marginTop,
			html = '<div style="position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;"><div></div></div><table style="position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;" cellpadding="0" cellspacing="0"><tr><td></td></tr></table>';

		rules = { position: 'absolute', top: 0, left: 0, margin: 0, border: 0, width: '1px', height: '1px', visibility: 'hidden' };
		for ( prop in rules ) container.style[prop] = rules[prop];

		container.innerHTML = html;
		body.insertBefore(container, body.firstChild);
		innerDiv = container.firstChild, checkDiv = innerDiv.firstChild, td = innerDiv.nextSibling.firstChild.firstChild;

		this.doesNotAddBorder = (checkDiv.offsetTop !== 5);
		this.doesAddBorderForTableAndCells = (td.offsetTop === 5);

		innerDiv.style.overflow = 'hidden', innerDiv.style.position = 'relative';
		this.subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);

		body.style.marginTop = '1px';
		this.doesNotIncludeMarginInBodyOffset = (body.offsetTop === 0);
		body.style.marginTop = bodyMarginTop;

		body.removeChild(container);
		this.initialized = true;
	},

	bodyOffset: function(body) {
		jQuery.offset.initialized || jQuery.offset.initialize();
		var top = body.offsetTop, left = body.offsetLeft;
		if ( jQuery.offset.doesNotIncludeMarginInBodyOffset )
			top  += parseInt( jQuery.curCSS(body, 'marginTop',  true), 10 ) || 0,
			left += parseInt( jQuery.curCSS(body, 'marginLeft', true), 10 ) || 0;
		return { top: top, left: left };
	}
};


jQuery.fn.extend({
	position: function() {
		var left = 0, top = 0, results;

		if ( this[0] ) {
			// Get *real* offsetParent
			var offsetParent = this.offsetParent(),

			// Get correct offsets
			offset       = this.offset(),
			parentOffset = /^body|html$/i.test(offsetParent[0].tagName) ? { top: 0, left: 0 } : offsetParent.offset();

			// Subtract element margins
			// note: when an element has margin: auto the offsetLeft and marginLeft 
			// are the same in Safari causing offset.left to incorrectly be 0
			offset.top  -= num( this, 'marginTop'  );
			offset.left -= num( this, 'marginLeft' );

			// Add offsetParent borders
			parentOffset.top  += num( offsetParent, 'borderTopWidth'  );
			parentOffset.left += num( offsetParent, 'borderLeftWidth' );

			// Subtract the two offsets
			results = {
				top:  offset.top  - parentOffset.top,
				left: offset.left - parentOffset.left
			};
		}

		return results;
	},

	offsetParent: function() {
		var offsetParent = this[0].offsetParent || document.body;
		while ( offsetParent && (!/^body|html$/i.test(offsetParent.tagName) && jQuery.css(offsetParent, 'position') == 'static') )
			offsetParent = offsetParent.offsetParent;
		return jQuery(offsetParent);
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( ['Left', 'Top'], function(i, name) {
	var method = 'scroll' + name;
	
	jQuery.fn[ method ] = function(val) {
		if (!this[0]) return null;

		return val !== undefined ?

			// Set the scroll offset
			this.each(function() {
				this == window || this == document ?
					window.scrollTo(
						!i ? val : jQuery(window).scrollLeft(),
						 i ? val : jQuery(window).scrollTop()
					) :
					this[ method ] = val;
			}) :

			// Return the scroll offset
			this[0] == window || this[0] == document ?
				self[ i ? 'pageYOffset' : 'pageXOffset' ] ||
					jQuery.boxModel && document.documentElement[ method ] ||
					document.body[ method ] :
				this[0][ method ];
	};
});
// Create innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each([ "Height", "Width" ], function(i, name){

	var tl = i ? "Left"  : "Top",  // top or left
		br = i ? "Right" : "Bottom"; // bottom or right

	// innerHeight and innerWidth
	jQuery.fn["inner" + name] = function(){
		return this[ name.toLowerCase() ]() +
			num(this, "padding" + tl) +
			num(this, "padding" + br);
	};

	// outerHeight and outerWidth
	jQuery.fn["outer" + name] = function(margin) {
		return this["inner" + name]() +
			num(this, "border" + tl + "Width") +
			num(this, "border" + br + "Width") +
			(margin ?
				num(this, "margin" + tl) + num(this, "margin" + br) : 0);
	};
	
	var type = name.toLowerCase();

	jQuery.fn[ type ] = function( size ) {
		// Get window width or height
		return this[0] == window ?
			// Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
			document.compatMode == "CSS1Compat" && document.documentElement[ "client" + name ] ||
			document.body[ "client" + name ] :

			// Get document width or height
			this[0] == document ?
				// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
				Math.max(
					document.documentElement["client" + name],
					document.body["scroll" + name], document.documentElement["scroll" + name],
					document.body["offset" + name], document.documentElement["offset" + name]
				) :

				// Get or set width or height on the element
				size === undefined ?
					// Get width or height on the element
					(this.length ? jQuery.css( this[0], type ) : null) :

					// Set the width or height on the element (default to pixels if value is unitless)
					this.css( type, typeof size === "string" ? size : size + "px" );
	};

});})();

if ( !window.sockso ) {
    sockso = {
        util: {}
    };
}

/**
 *  represents a music item
 *
 *  @param id the item id
 *  @param name the item name
 *  @param playlistId
 *
 */

function MusicItem( id, name, playlistId ) {

    this.id = id;
    this.name = name;
    this.playlistId = playlistId;

    var type = id.substring( 0, 2 );

    this.getTypeName = function() {
        switch ( type ) {
            case 'tr': return 'track';
            case 'ar': return 'artist';
            case 'al': return 'album';
            case 'pl': return 'playlist';
        }
    };

}

sockso.MusicItem = MusicItem;

/**
 *  returns an image wrapped in an achor, the image with the
 *  icon src, and the anchor with href set to the action
 *
 *  @param icon the image icon
 *  @param action the anchor action
 *  @param title the anchor title
 *
 *  @return jQuery
 *
 */

sockso.util.getActionNode = function( icon, action, title ) {

    return $( '<a></a>' )
        .attr( 'href', action )
        .attr( 'title', title )
        .append( $('<img />').attr('src',Properties.getUrl('/<skin>/images/' + icon +'.png')) )
        .append( '<span>&nbsp;</span>' );

};

/**
 *  returns an LI element for a MusicItem
 *
 *  @param item a MusicItem object
 *  @param includePlaylistLink
 *
 *  @return jQuery
 *
 */

sockso.util.getMusicElement = function getMusicElement( item, includePlaylistLink ) {

    var type = item.getTypeName();
    var doRemove = ( item.playlistId != null );
    var name = item.name.replace( /'/, '\\\'' );

    var remove = doRemove
        ? sockso.util.getActionNode('remove','javascript:playlist.remove('+item.playlistId+');','Remove')
        : null;

    var addToPlaylist = ( includePlaylistLink == true )
        ? sockso.util.getActionNode( 'add', 'javascript:playlist.add(new sockso.MusicItem(\'' +item.id+ '\',\'' +name+ '\'));', 'Add to playlist' )
        : null;

    var play = sockso.util.getActionNode('play','javascript:player.play(\''+item.id+'\')','Play \''+name+'\'');

    var link = ( type == 'track' )
        ? $( '<span>' + item.name + '</span>' )
        : $( '<a></a>' )
            .attr( 'href', Properties.getUrl('/browse/' + type + '/' + item.id.substring(2)))
            .append( item.name );

    var element = $( '<li></li>' )
        .attr( 'id', doRemove ? 'playlist-item-' + item.playlistId : '' )
        .addClass( type )
        .append( play )
        .append( addToPlaylist )
        .append( remove );

    if ( Properties.get('www.disableDownloads') != 'yes' ) {
        sockso.util.getActionNode('download',Properties.getUrl('/download/'+item.id),'Download \''+name+'\'')
                   .addClass( 'noajax' )
                   .appendTo( element );
    }

    element.append( link );

    return element;

};

/**
 * Bind the function to be called with the specified scope.  The original scope
 * the function would have called in is set on the new scope by using the
 * property "originalScope".  This can be useful when binding to events with
 * jQuery.
 *
 * @param scope Object
 *
 * @return Function
 */
Function.prototype.bind = function( scope ) {

    var self = this;

    return function() {
        scope.originalScope = this;
        return self.apply( scope, arguments );
    };
    
};

/**
 *  Indicates if the string starts with the specified substring
 *
 *  @param prefix
 *
 *  @return boolean
 *
 */

String.prototype.startsWith = function(prefix) {

    return this.indexOf(prefix) === 0;

};

/**
 *  Indicates if the string ends with the specified substring
 *
 *  @param prefix
 *
 *  @return boolean
 *
 */

String.prototype.endsWith = function(suffix) {

    return this.match(suffix + "$") == suffix;

};

/***
 * jQuery corner plugin
 *
 * version 1.7 (1/26/2007)
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

/**
 * The corner() method provides a simple way of styling DOM elements.  
 *
 * corner() takes a single string argument:  $().corner("effect corners width")
 *
 *   effect:  The name of the effect to apply, such as round or bevel. 
 *            If you don't specify an effect, rounding is used.
 *
 *   corners: The corners can be one or more of top, bottom, tr, tl, br, or bl. 
 *            By default, all four corners are adorned. 
 *
 *   width:   The width specifies the width of the effect; in the case of rounded corners this 
 *            will be the radius of the width. 
 *            Specify this value using the px suffix such as 10px, and yes it must be pixels.
 *
 * For more details see: http://methvin.com/jquery/jq-corner.html
 * For a full demo see:  http://malsup.com/jquery/corner/
 *
 *
 * @example $('.adorn').corner();
 * @desc Create round, 10px corners 
 *
 * @example $('.adorn').corner("25px");
 * @desc Create round, 25px corners 
 *
 * @example $('.adorn').corner("notch bottom");
 * @desc Create notched, 10px corners on bottom only
 *
 * @example $('.adorn').corner("tr dog 25px");
 * @desc Create dogeared, 25px corner on the top-right corner only
 *
 * @example $('.adorn').corner("round 8px").parent().css('padding', '4px').corner("round 10px");
 * @desc Create a rounded border effect by styling both the element and its parent
 * 
 * @name corner
 * @type jQuery
 * @param String options Options which control the corner style
 * @cat Plugins/Corner
 * @return jQuery
 * @author Dave Methvin (dave.methvin@gmail.com)
 * @author Mike Alsup (malsup@gmail.com)
 */
jQuery.fn.corner = function(o) {
    function hex2(s) {
        var s = parseInt(s).toString(16);
        return ( s.length < 2 ) ? '0'+s : s;
    };
    function gpc(node) {
        for ( ; node && node.nodeName.toLowerCase() != 'html'; node = node.parentNode  ) {
            var v = jQuery.css(node,'backgroundColor');
            if ( v.indexOf('rgb') >= 0 ) { 
                rgb = v.match(/\d+/g); 
                return '#'+ hex2(rgb[0]) + hex2(rgb[1]) + hex2(rgb[2]);
            }
            if ( v && v != 'transparent' )
                return v;
        }
        return '#ffffff';
    };
    function getW(i) {
        switch(fx) {
        case 'round':  return Math.round(width*(1-Math.cos(Math.asin(i/width))));
        case 'cool':   return Math.round(width*(1+Math.cos(Math.asin(i/width))));
        case 'sharp':  return Math.round(width*(1-Math.cos(Math.acos(i/width))));
        case 'bite':   return Math.round(width*(Math.cos(Math.asin((width-i-1)/width))));
        case 'slide':  return Math.round(width*(Math.atan2(i,width/i)));
        case 'jut':    return Math.round(width*(Math.atan2(width,(width-i-1))));
        case 'curl':   return Math.round(width*(Math.atan(i)));
        case 'tear':   return Math.round(width*(Math.cos(i)));
        case 'wicked': return Math.round(width*(Math.tan(i)));
        case 'long':   return Math.round(width*(Math.sqrt(i)));
        case 'sculpt': return Math.round(width*(Math.log((width-i-1),width)));
        case 'dog':    return (i&1) ? (i+1) : width;
        case 'dog2':   return (i&2) ? (i+1) : width;
        case 'dog3':   return (i&3) ? (i+1) : width;
        case 'fray':   return (i%2)*width;
        case 'notch':  return width; 
        case 'bevel':  return i+1;
        }
    };
    o = (o||"").toLowerCase();
    var keep = /keep/.test(o);                       // keep borders?
    var cc = ((o.match(/cc:(#[0-9a-f]+)/)||[])[1]);  // corner color
    var sc = ((o.match(/sc:(#[0-9a-f]+)/)||[])[1]);  // strip color
    var width = parseInt((o.match(/(\d+)px/)||[])[1]) || 10; // corner width
    var re = /round|bevel|notch|bite|cool|sharp|slide|jut|curl|tear|fray|wicked|sculpt|long|dog3|dog2|dog/;
    var fx = ((o.match(re)||['round'])[0]);
    var edges = { T:0, B:1 };
    var opts = {
        TL:  /top|tl/.test(o),       TR:  /top|tr/.test(o),
        BL:  /bottom|bl/.test(o),    BR:  /bottom|br/.test(o)
    };
    if ( !opts.TL && !opts.TR && !opts.BL && !opts.BR )
        opts = { TL:1, TR:1, BL:1, BR:1 };
    var strip = document.createElement('div');
    strip.style.overflow = 'hidden';
    strip.style.height = '1px';
    strip.style.backgroundColor = sc || 'transparent';
    strip.style.borderStyle = 'solid';
    return this.each(function(index){
        var pad = {
            T: parseInt(jQuery.css(this,'paddingTop'))||0,     R: parseInt(jQuery.css(this,'paddingRight'))||0,
            B: parseInt(jQuery.css(this,'paddingBottom'))||0,  L: parseInt(jQuery.css(this,'paddingLeft'))||0
        };

        if (jQuery.browser.msie) this.style.zoom = 1; // force 'hasLayout' in IE
        if (!keep) this.style.border = 'none';
        strip.style.borderColor = cc || gpc(this.parentNode);
        var cssHeight = jQuery.curCSS(this, 'height');

        for (var j in edges) {
            var bot = edges[j];
            strip.style.borderStyle = 'none '+(opts[j+'R']?'solid':'none')+' none '+(opts[j+'L']?'solid':'none');
            var d = document.createElement('div');
            var ds = d.style;

            bot ? this.appendChild(d) : this.insertBefore(d, this.firstChild);

            if (bot && cssHeight != 'auto') {
                if (jQuery.css(this,'position') == 'static')
                    this.style.position = 'relative';
                ds.position = 'absolute';
                ds.bottom = ds.left = ds.padding = ds.margin = '0';
                if (jQuery.browser.msie)
                    ds.setExpression('width', 'this.parentNode.offsetWidth');
                else
                    ds.width = '100%';
            }
            else {
                ds.margin = !bot ? '-'+pad.T+'px -'+pad.R+'px '+(pad.T-width)+'px -'+pad.L+'px' : 
                                    (pad.B-width)+'px -'+pad.R+'px -'+pad.B+'px -'+pad.L+'px';                
            }

            for (var i=0; i < width; i++) {
                var w = Math.max(0,getW(i));
                var e = strip.cloneNode(false);
                e.style.borderWidth = '0 '+(opts[j+'R']?w:0)+'px 0 '+(opts[j+'L']?w:0)+'px';
                bot ? d.appendChild(e) : d.insertBefore(e, d.firstChild);
            }
        }
    });
};
/***
 * Copyright (c) 2008, 2009 Paul Duncan (paul@pablotron.org)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/*
 * The contents of gears_init.js; we need this because Chrome supports
 * Gears out of the box, but still requires this constructor.  Note that
 * if you include gears_init.js then this function does nothing.
 */
(function() {
  // We are already defined. Hooray!
  if (window.google && google.gears){
      return;
  }

  // factory
  var F = null;

  // Firefox
  if (typeof GearsFactory != 'undefined') {
    F = new GearsFactory();
  } else {
    // IE
    try {
      F = new ActiveXObject('Gears.Factory');
      // privateSetGlobalObject is only required and supported on WinCE.
      if (F.getBuildInfo().indexOf('ie_mobile') != -1){
          F.privateSetGlobalObject(this);
      }

    } catch (e) {
      // Safari
      if ((typeof navigator.mimeTypes != 'undefined') && navigator.mimeTypes["application/x-googlegears"]) {
        F = document.createElement("object");
        F.style.display = "none";
        F.width = 0;
        F.height = 0;
        F.type = "application/x-googlegears";
        document.documentElement.appendChild(F);
      }
    }
  }

  // *Do not* define any objects if Gears is not installed. This mimics the
  // behavior of Gears defining the objects in the future.
  if (!F){
      return;
  }


  // Now set up the objects, being careful not to overwrite anything.
  //
  // Note: In Internet Explorer for Windows Mobile, you can't add properties to
  // the window object. However, global objects are automatically added as
  // properties of the window object in all browsers.
  if (!window.google){
      google = {};
  }

  if (!google.gears){
      google.gears = {factory: F};
  }

})();

/**
 * Persist - top-level namespace for Persist library.
 * @namespace
 */
Persist = (function() {
  var VERSION = '0.2.0', P, B, esc, init, empty, ec;

  ec = (function() {
    var EPOCH = 'Thu, 01-Jan-1970 00:00:01 GMT',
        // milliseconds per day
        RATIO = 1000 * 60 * 60 * 24,
        // keys to encode
        KEYS = ['expires', 'path', 'domain'],
        // wrappers for common globals
        esc = escape, un = unescape, doc = document,
        me;

    // private methods

    /*
     * Get the current time.
     *
     * This method is private.
     */
    var get_now = function() {
      var r = new Date();
      r.setTime(r.getTime());
      return r;
    };

    /*
     * Convert the given key/value pair to a cookie.
     *
     * This method is private.
     */
    var cookify = function(c_key, c_val /*, opt */) {
       var i, key, val, r = [],
           opt = (arguments.length > 2) ? arguments[2] : {};

      // add key and value
      r.push(esc(c_key) + '=' + esc(c_val));

      // iterate over option keys and check each one
      for (var idx = 0; idx < KEYS.length; idx++) {
        key = KEYS[idx];
        val = opt[key];
        if (val){
            r.push(key + '=' + val);
        }

      }

      // append secure (if specified)
      if (opt.secure){
          r.push('secure');
      }

      // build and return result string
      return r.join('; ');
    };

    /*
     * Check to see if cookies are enabled.
     *
     * This method is private.
     */
    var alive = function() {
      var k = '__EC_TEST__',
          v = new Date();

      // generate test value
      v = v.toGMTString();

      // set test value
      this.set(k, v);

      // return cookie test
      this.enabled = (this.remove(k) == v);
      return this.enabled;
    };

    // public methods

    // build return object
    me = {
      /*
       * Set a cookie value.
       *
       * Examples:
       *
       *   // simplest-case
       *   EasyCookie.set('test_cookie', 'test_value');
       *
       *   // more complex example
       *   EasyCookie.set('test_cookie', 'test_value', {
       *     // expires in 13 days
       *     expires: 13,
       *
       *     // restrict to given domain
       *     domain: 'foo.example.com',
       *
       *     // restrict to given path
       *     path: '/some/path',
       *
       *     // secure cookie only
       *     secure: true
       *   });
       *
       */
      set: function(key, val /*, opt */) {
        var opt = (arguments.length > 2) ? arguments[2] : {},
            now = get_now(),
            expire_at,
            cfg = {};

        // if expires is set, convert it from days to milliseconds
        if (opt.expires) {
          // Needed to assign to a temporary variable because of pass by reference issues
          var expires = opt.expires * RATIO;

          // set cookie expiration date
          cfg.expires = new Date(now.getTime() + expires);
          cfg.expires = cfg.expires.toGMTString();
        }

        // set remaining keys
        var keys = ['path', 'domain', 'secure'];
        for (var i = 0; i < keys.length; i++){
          if (opt[keys[i]]){
              cfg[keys[i]] = opt[keys[i]];
          }
        }

        var r = cookify(key, val, cfg);
        doc.cookie = r;

        return val;
      },

      /*
       * Check to see if the given cookie exists.
       *
       * Example:
       *
       *   val = EasyCookie.get('test_cookie');
       *
       */
      has: function(key) {
        key = esc(key);

        var c = doc.cookie,
            ofs = c.indexOf(key + '='),
            len = ofs + key.length + 1,
            sub = c.substring(0, key.length);

        // check to see if key exists
        return ((!ofs && key != sub) || ofs < 0) ? false : true;
      },

      /*
       * Get a cookie value.
       *
       * Example:
       *
       *   val = EasyCookie.get('test_cookie');
       *
       */
      get: function(key) {
        key = esc(key);

        var c = doc.cookie,
            ofs = c.indexOf(key + '='),
            len = ofs + key.length + 1,
            sub = c.substring(0, key.length),
            end;

        // check to see if key exists
        if ((!ofs && key != sub) || ofs < 0) {
            return null;
        }

        // grab end of value
        end = c.indexOf(';', len);
        if (end < 0) {
            end = c.length;
        }

        // return unescaped value
        return un(c.substring(len, end));
      },

      /*
       * Remove a preset cookie.  If the cookie is already set, then
       * return the value of the cookie.
       *
       * Example:
       *
       *   old_val = EasyCookie.remove('test_cookie');
       *
       */
      remove: function(k) {
        var r = me.get(k),
            opt = { expires: EPOCH };

        // delete cookie
        doc.cookie = cookify(k, '', opt);

        // return value
        return r;
      },

      /*
       * Get a list of cookie names.
       *
       * Example:
       *
       *   // get all cookie names
       *   cookie_keys = EasyCookie.keys();
       *
       */
      keys: function() {
        var c = doc.cookie,
            ps = c.split('; '),
            i, p, r = [];

        // iterate over each key=val pair and grab the key
        for (var idx = 0; idx < ps.length; idx++) {
          p = ps[idx].split('=');
          r.push(un(p[0]));
        }

        // return results
        return r;
      },

      /*
       * Get an array of all cookie key/value pairs.
       *
       * Example:
       *
       *   // get all cookies
       *   all_cookies = EasyCookie.all();
       *
       */
      all: function() {
        var c = doc.cookie,
            ps = c.split('; '),
            i, p, r = [];

        // iterate over each key=val pair and grab the key
        for (var idx = 0; idx < ps.length; idx++) {
          p = ps[idx].split('=');
          r.push([un(p[0]), un(p[1])]);
        }

        // return results
        return r;
      },

      /*
       * Version of EasyCookie
       */
      version: '0.2.1',

      /*
       * Are cookies enabled?
       *
       * Example:
       *
       *   have_cookies = EasyCookie.enabled
       *
       */
      enabled: false
    };

    // set enabled attribute
    me.enabled = alive.call(me);

    // return self
    return me;
  }());

  // wrapper for Array.prototype.indexOf, since IE doesn't have it
  var index_of = (function() {
    if (Array.prototype.indexOf){
      return function(ary, val) {
        return Array.prototype.indexOf.call(ary, val);
      };
    } else {
      return function(ary, val) {
        var i, l;

        for (var idx = 0, len = ary.length; idx < len; idx++){
          if (ary[idx] == val){
              return idx;
          }
        }

        return -1;
      };
    }
  })();


  // empty function
  empty = function() { };

  /**
   * Escape spaces and underscores in name.  Used to generate a "safe"
   * key from a name.
   *
   * @private
   */
  esc = function(str) {
    return 'PS' + str.replace(/_/g, '__').replace(/ /g, '_s');
  };

  var C = {
    /*
     * Backend search order.
     *
     * Note that the search order is significant; the backends are
     * listed in order of capacity, and many browsers
     * support multiple backends, so changing the search order could
     * result in a browser choosing a less capable backend.
     */
    search_order: [
      // TODO: air
      'localstorage',
      'globalstorage',
      'gears',
      'whatwg_db',
      'cookie',
      'ie',
      'flash'
    ],

    // valid name regular expression
    name_re: /^[a-z][a-z0-9_ \-]+$/i,

    // list of backend methods
    methods: [
      'init',
      'get',
      'set',
      'remove',
      'load',
      'save'
      // TODO: clear method?
    ],

    // sql for db backends (gears and db)
    sql: {
      version:  '1', // db schema version

      // XXX: the "IF NOT EXISTS" is a sqlite-ism; fortunately all the
      // known DB implementations (safari and gears) use sqlite
      create:   "CREATE TABLE IF NOT EXISTS persist_data (k TEXT UNIQUE NOT NULL PRIMARY KEY, v TEXT NOT NULL)",
      get:      "SELECT v FROM persist_data WHERE k = ?",
      set:      "INSERT INTO persist_data(k, v) VALUES (?, ?)",
      remove:   "DELETE FROM persist_data WHERE k = ?"
    },

    // default flash configuration
    flash: {
      // ID of wrapper element
      div_id:   '_persist_flash_wrap',

      // id of flash object/embed
      id:       '_persist_flash',

      // default path to flash object
      path: 'persist.swf',
      size: { w:1, h:1 },

      // arguments passed to flash object
      args: {
        autostart: true
      }
    }
  };

  // built-in backends
  B = {
    // gears db backend
    // (src: http://code.google.com/apis/gears/api_database.html)
    gears: {
      // no known limit
      size:   -1,

      test: function() {
        // test for gears
        return (window.google && window.google.gears) ? true : false;
      },

      methods: {
        transaction: function(fn) {
          var db = this.db;

          // begin transaction
          db.execute('BEGIN').close();

          // call callback fn
          fn.call(this, db);

          // commit changes
          db.execute('COMMIT').close();
        },

        init: function() {
          var db;

          // create database handle (TODO: add schema version?)
          db = this.db = google.gears.factory.create('beta.database');

          // open database
          // from gears ref:
          //
          // Currently the name, if supplied and of length greater than
          // zero, must consist only of visible ASCII characters
          // excluding the following characters:
          //
          //   / \ : * ? " < > | ; ,
          //
          // (this constraint is enforced in the Store constructor)
          db.open(esc(this.name));

          // create table
          db.execute(C.sql.create).close();
        },

        get: function(key, fn, scope) {
          var r, sql = C.sql.get;

          // if callback isn't defined, then return
          if (!fn){
              return;
          }

          // begin transaction
          this.transaction(function (t) {
            var is_valid, val;
            // exec query
            r = t.execute(sql, [key]);

            // check result and get value
            is_valid = r.isValidRow();
            val = is_valid ? r.field(0) : null;

            // close result set
            r.close();

            // call callback
            fn.call(scope || this, is_valid, val);
          });
        },

        set: function(key, val, fn, scope) {
          var rm_sql = C.sql.remove,
              sql    = C.sql.set, r;

          // begin set transaction
          this.transaction(function(t) {
            // exec remove query
            t.execute(rm_sql, [key]).close();

            // exec set query
            t.execute(sql, [key, val]).close();

            // run callback (TODO: get old value)
            if (fn){
                fn.call(scope || this, true, val);
            }
          });
        },

        remove: function(key, fn, scope) {
          var get_sql = C.sql.get, sql = C.sql.remove, r, val = null, is_valid = false;

          // begin remove transaction
          this.transaction(function(t) {
            // if a callback was defined, then get the old
            // value before removing it
            if (fn) {
              // exec get query
              r = t.execute(get_sql, [key]);

              // check validity and get value
              is_valid = r.isValidRow();
              val = is_valid ? r.field(0) : null;

              // close result set
              r.close();
            }

            // exec remove query if no callback was defined, or if a
            // callback was defined and there was an existing value
            if (!fn || is_valid) {
              // exec remove query
              t.execute(sql, [key]).close();
            }

            // exec callback
            if (fn){
                fn.call(scope || this, is_valid, val);
            }
          });
        }
      }
    },

    // whatwg db backend (webkit, Safari 3.1+)
    // (src: whatwg and http://webkit.org/misc/DatabaseExample.html)
    whatwg_db: {
      // size based on DatabaseExample from above (should I increase
      // this?)
      size:   200 * 1024,

      test: function() {
        var name = 'PersistJS Test',
            desc = 'Persistent database test.';

        // test for openDatabase
        if (!window.openDatabase){
            return false;
        }

        // make sure openDatabase works
        // XXX: will this leak a db handle and/or waste space?
        if (!window.openDatabase(name, C.sql.version, desc, B.whatwg_db.size)){
            return false;
        }

        // return true
        return true;
      },

      methods: {
        transaction: function(fn) {
          // lazy create database table;
          // this is done here because there is no way to
          // prevent a race condition if the table is created in init()
          if (!this.db_created) {
            this.db.transaction(function(t) {
              // create table
              t.executeSql(C.sql.create, [], function() {
                this.db_created = true;
              });
            }, empty); // trap exception
          }

          // execute transaction
          this.db.transaction(fn);
        },

        init: function() {
          // create database handle
          this.db = openDatabase(
            this.name,
            C.sql.version,
            this.o.about || ("Persistent storage for " + this.name),
            this.o.size || (B.whatwg_db.size)
          );
        },

        get: function(key, fn, scope) {
          var sql = C.sql.get;

          // if callback isn't defined, then return
          if (!fn){
              return;
          }

          // get callback scope
          scope = scope || this;

          // begin transaction
          this.transaction(function (t) {
            t.executeSql(sql, [key], function(t, r) {
              if (r.rows.length > 0){
                  fn.call(scope, true, r.rows.item(0).v);
              } else {
                  fn.call(scope, false, null);
              }
            });
          });
        },

        set: function(key, val, fn, scope) {
          var rm_sql = C.sql.remove,
              sql    = C.sql.set;

          // begin set transaction
          this.transaction(function(t) {
            // exec remove query
            t.executeSql(rm_sql, [key], function() {
              // exec set query
              t.executeSql(sql, [key, val], function(t, r) {
                // run callback
                if (fn){
                    fn.call(scope || this, true, val);
                }
              });
            });
          });

          return val;
        },

        // begin remove transaction
        remove: function(key, fn, scope) {
          var get_sql = C.sql.get;
              sql = C.sql.remove;

          this.transaction(function(t) {
            // if a callback was defined, then get the old
            // value before removing it
            if (fn) {
              // exec get query
              t.executeSql(get_sql, [key], function(t, r) {
                if (r.rows.length > 0) {
                  // key exists, get value
                  var val = r.rows.item(0).v;

                  // exec remove query
                  t.executeSql(sql, [key], function(t, r) {
                    // exec callback
                    fn.call(scope || this, true, val);
                  });
                } else {
                  // key does not exist, exec callback
                  fn.call(scope || this, false, null);
                }
              });
            } else {
              // no callback was defined, so just remove the
              // data without checking the old value

              // exec remove query
              t.executeSql(sql, [key]);
            }
          });
        }
      }
    },

    // globalstorage backend (globalStorage, FF2+, IE8+)
    // (src: http://developer.mozilla.org/en/docs/DOM:Storage#globalStorage)
    // https://developer.mozilla.org/En/DOM/Storage
    //
    // TODO: test to see if IE8 uses object literal semantics or
    // getItem/setItem/removeItem semantics
    globalstorage: {
      // (5 meg limit, src: http://ejohn.org/blog/dom-storage-answers/)
      size: 5 * 1024 * 1024,

      test: function() {
          if (window.globalStorage) {
              var domain = '127.0.0.1';
              if (this.o && this.o.domain) {
                  domain = this.o.domain;
              }
              try{
                  var dontcare = globalStorage[domain];
                  return true;
              } catch(e) {
                  if (window.console && window.console.warn) {
                      console.warn("globalStorage exists, but couldn't use it because your browser is running on domain:", domain);
                  }
                  return false;
              }
          } else {
              return false;
          }
      },

      methods: {
        key: function(key) {
          return esc(this.name) + esc(key);
        },

        init: function() {
          this.store = globalStorage[this.o.domain];
        },

        get: function(key, fn, scope) {
          // expand key
          key = this.key(key);

          if (fn){
              fn.call(scope || this, true, this.store.getItem(key));
          }
        },

        set: function(key, val, fn, scope) {
          // expand key
          key = this.key(key);

          // set value
          this.store.setItem(key, val);

          if (fn){
              fn.call(scope || this, true, val);
          }
        },

        remove: function(key, fn, scope) {
          var val;

          // expand key
          key = this.key(key);

          // get value
          val = this.store.getItem[key];

          // delete value
          this.store.removeItem(key);

          if (fn){
              fn.call(scope || this, (val !== null), val);
          }
        }
      }
    },

    // localstorage backend (globalStorage, FF2+, IE8+)
    // (src: http://www.whatwg.org/specs/web-apps/current-work/#the-localstorage)
    // also http://msdn.microsoft.com/en-us/library/cc197062(VS.85).aspx#_global
    localstorage: {
      // (unknown?)
      // ie has the remainingSpace property, see:
      // http://msdn.microsoft.com/en-us/library/cc197016(VS.85).aspx
      size: -1,

      test: function() {
        return window.localStorage ? true : false;
      },

      methods: {
        key: function(key) {
          return esc(this.name) + esc(key);
        },

        init: function() {
          this.store = localStorage;
        },

        get: function(key, fn, scope) {
          // expand key
          key = this.key(key);

          if (fn){
              fn.call(scope || this, true, this.store.getItem(key));
          }
        },

        set: function(key, val, fn, scope) {
          // expand key
          key = this.key(key);

          // set value
          this.store.setItem(key, val);

          if (fn){
              fn.call(scope || this, true, val);
          }
        },

        remove: function(key, fn, scope) {
          var val;

          // expand key
          key = this.key(key);

          // get value
          val = this.getItem(key);

          // delete value
          this.store.removeItem(key);

          if (fn){
              fn.call(scope || this, (val !== null), val);
          }
        }
      }
    },

    // IE backend
    ie: {
      prefix:   '_persist_data-',
      // style:    'display:none; behavior:url(#default#userdata);',

      // 64k limit
      size:     64 * 1024,

      test: function() {
        // make sure we're dealing with IE
        // (src: http://javariet.dk/shared/browser_dom.htm)
        return window.ActiveXObject ? true : false;
      },

      make_userdata: function(id) {
        var el = document.createElement('div');

        // set element properties
        // http://msdn.microsoft.com/en-us/library/ms531424(VS.85).aspx
        // http://www.webreference.com/js/column24/userdata.html
        el.id = id;
        el.style.display = 'none';
        el.addBehavior('#default#userdata');

        // append element to body
        document.body.appendChild(el);

        // return element
        return el;
      },

      methods: {
        init: function() {
          var id = B.ie.prefix + esc(this.name);

          // save element
          this.el = B.ie.make_userdata(id);

          // load data
          if (this.o.defer){
              this.load();
          }
        },

        get: function(key, fn, scope) {
          var val;

          // expand key
          key = esc(key);

          // load data
          if (!this.o.defer){
              this.load();
          }

          // get value
          val = this.el.getAttribute(key);

          // call fn
          if (fn){
              fn.call(scope || this, val ? true : false, val);
          }
        },

        set: function(key, val, fn, scope) {
          // expand key
          key = esc(key);

          // set attribute
          this.el.setAttribute(key, val);

          // save data
          if (!this.o.defer){
              this.save();
          }

          // call fn
          if (fn){
              fn.call(scope || this, true, val);
          }
        },

        remove: function(key, fn, scope) {
          var val;

          // expand key
          key = esc(key);

          // load data
          if (!this.o.defer){
              this.load();
          }

          // get old value and remove attribute
          val = this.el.getAttribute(key);
          this.el.removeAttribute(key);

          // save data
          if (!this.o.defer){
              this.save();
          }

          // call fn
          if (fn){
              fn.call(scope || this, val ? true : false, val);
          }
        },

        load: function() {
          this.el.load(esc(this.name));
        },

        save: function() {
          this.el.save(esc(this.name));
        }
      }
    },

    // cookie backend
    // uses easycookie: http://pablotron.org/software/easy_cookie/
    cookie: {
      delim: ':',

      // 4k limit (low-ball this limit to handle browser weirdness, and
      // so we don't hose session cookies)
      size: 4000,

      test: function() {
        // XXX: use easycookie to test if cookies are enabled
        return P.Cookie.enabled ? true : false;
      },

      methods: {
        key: function(key) {
          return this.name + B.cookie.delim + key;
        },

        get: function(key, fn, scope) {
          var val;

          // expand key
          key = this.key(key);

          // get value
          val = ec.get(key);

          // call fn
          if (fn){
              fn.call(scope || this, val !== null, val);
          }
        },

        set: function(key, val, fn, scope) {
          // expand key
          key = this.key(key);

          // save value
          ec.set(key, val, this.o);

          // call fn
          if (fn){
              fn.call(scope || this, true, val);
          }
        },

        remove: function(key, val, fn, scope) {

          // expand key
          key = this.key(key);

          // remove cookie
          val = ec.remove(key);

          // call fn
          if (fn){
              fn.call(scope || this, val !== null, val);
          }
        }
      }
    },

    // flash backend (requires flash 8 or newer)
    // http://kb.adobe.com/selfservice/viewContent.do?externalId=tn_16194&sliceId=1
    // http://livedocs.adobe.com/flash/8/main/wwhelp/wwhimpl/common/html/wwhelp.htm?context=LiveDocs_Parts&file=00002200.html
    flash: {
      test: function() {
        // TODO: better flash detection
        if (!deconcept || !deconcept.SWFObjectUtil){
            return false;
        }

        // get the major version
        var major = deconcept.SWFObjectUtil.getPlayerVersion().major;

        // check flash version (require 8.0 or newer)
        return (major >= 8) ? true : false;
      },

      methods: {
        init: function() {
          if (!B.flash.el) {
            var o, key, el, cfg = C.flash;

            // create wrapper element
            el = document.createElement('div');
            el.id = cfg.div_id;

            // FIXME: hide flash element
            // el.style.display = 'none';

            // append element to body
            document.body.appendChild(el);

            // create new swf object
            o = new deconcept.SWFObject(this.o.swf_path || cfg.path, cfg.id, cfg.size.w, cfg.size.h, '8');

            // set parameters
            for (key in cfg.args){
                if (cfg.args[key] != 'function') {
                    o.addVariable(key, cfg.args[key]);
                }
            }

            // write flash object
            o.write(el);

            // save flash element
            B.flash.el = document.getElementById(cfg.id);
          }

          // use singleton flash element
          this.el = B.flash.el;
        },

        get: function(key, fn, scope) {
          var val;

          // escape key
          key = esc(key);

          // get value
          val = this.el.get(this.name, key);

          // call handler
          if (fn){
              fn.call(scope || this, val !== null, val);
          }
        },

        set: function(key, val, fn, scope) {
          var old_val;

          // escape key
          key = esc(key);

          // set value
          old_val = this.el.set(this.name, key, val);

          // call handler
          if (fn){
              fn.call(scope || this, true, val);
          }
        },

        remove: function(key, fn, scope) {
          var val;

          // get key
          key = esc(key);

          // remove old value
          val = this.el.remove(this.name, key);

          // call handler
          if (fn){
              fn.call(scope || this, true, val);
          }
        }
      }
    }
  };

  /**
   * Test for available backends and pick the best one.
   * @private
   */
  init = function() {
    var i, l, b, key, fns = C.methods, keys = C.search_order;

    // set all functions to the empty function
    for (var idx = 0, len = fns.length; idx < len; idx++) {
        P.Store.prototype[fns[idx]] = empty;
    }

    // clear type and size
    P.type = null;
    P.size = -1;

    // loop over all backends and test for each one
    for (var idx2 = 0, len2 = keys.length; !P.type && idx2 < len2; idx2++) {
      b = B[keys[idx2]];

      // test for backend
      if (b.test()) {
        // found backend, save type and size
        P.type = keys[idx2];
        P.size = b.size;

        // extend store prototype with backend methods
        for (key in b.methods) {
            P.Store.prototype[key] = b.methods[key];
        }
      }
    }

    // mark library as initialized
    P._init = true;
  };

  // create top-level namespace
  P = {
    // version of persist library
    VERSION: VERSION,

    // backend type and size limit
    type: null,
    size: 0,

    // XXX: expose init function?
    // init: init,

    add: function(o) {
      // add to backend hash
      B[o.id] = o;

      // add backend to front of search order
      C.search_order = [o.id].concat(C.search_order);

      // re-initialize library
      init();
    },

    remove: function(id) {
      var ofs = index_of(C.search_order, id);
      if (ofs < 0){
          return;
      }

      // remove from search order
      C.search_order.splice(ofs, 1);

      // delete from lut
      delete B[id];

      // re-initialize library
      init();
    },

    // expose easycookie API
    Cookie: ec,

    // store API
    Store: function(name, o) {
      // verify name
      if (!C.name_re.exec(name)){
          throw new Error("Invalid name");
      }

      // XXX: should we lazy-load type?
      // if (!P._init)
      //   init();

      if (!P.type){
          throw new Error("No suitable storage found");
      }

      o = o || {};
      this.name = name;

      // get domain (XXX: does this localdomain fix work?)
      o.domain = o.domain || location.host || 'localhost';

      // strip port from domain (XXX: will this break ipv6?)
      o.domain = o.domain.replace(/:\d+$/, '');

      // Specifically for IE6 and localhost
      o.domain = (o.domain == 'localhost') ? '' : o.domain;

      // append localdomain to domains w/o '."
      // (see https://bugzilla.mozilla.org/show_bug.cgi?id=357323)
      // (file://localhost/ works, see:
      // https://bugzilla.mozilla.org/show_bug.cgi?id=469192)
/*
 *       if (!o.domain.match(/\./))
 *         o.domain += '.localdomain';
 */

      this.o = o;

      // expires in 2 years
      o.expires = o.expires || 365 * 2;

      // set path to root
      o.path = o.path || '/';

      // call init function
      this.init();
    }
  };

  // init persist
  init();

  // return top-level namespace
  return P;
})();
sockso.AdminConsole = function() {};

sockso.AdminConsole.prototype = {

    /**
     * Output element
     */
    output: null,
    
    /**
     * Input field
     */
    input: null,

    /**
     * Initialise the console and any links to it
     * 
     */
    init: function() {
        
        this.ajax = $.ajax;

        this.initConsoleLinks();
        this.initConsole();

    },

    /**
     * Inits any links to open the admin console
     *
     */
    initConsoleLinks: function() {

        $( '.admin-console-link' ).click(function() {
            window.open(
                Properties.getUrl('/admin/console'),
                'AdminConsole',
                'width=800,height=600,toolbars=no'
            ).focus();
            return false;
        });

    },

    /**
     * Inits the admin console interface
     *
     */
    initConsole: function() {

        var self = this;

        $( 'body.admin-console' ).each(function() {
            self.initInterface();
        });

    },

    /**
     * Init the console interface
     * 
     */
    initInterface: function() {

        this.input = $( '.admin-console-input' );
        this.output = $( '<pre></pre>' )
                            .addClass( 'admin-console-output' )
                            .prependTo( 'form' );

        $( 'form' ).submit(
            this.onSubmit.bind( this )
        );

    },

    /**
     * Handler for when the console form is submitted
     *
     */
    onSubmit: function() {

        this.ajax({
            method: 'POST',
            url: Properties.getUrl('/admin/console/send'),
            data: {
                command: this.input.val()
            },
            success: this.onCommandResult.bind( this )
        });

        this.input.val( '' );

        return false;

    },

    /**
     * Handles the return of an executed command
     *
     * @param text String The command output
     *
     */
    onCommandResult: function( text ) {

        this.output.append( text + "\n" );

        this.output[0].scrollTop = this.output[0].scrollHeight;

    }

};

/**
 * Hijacks anchor links to load them via ajax
 *
 * @param options
 */
sockso.Ajaxer = function( options ) {

    this.page = options.page;
    this.loadingClass = 'content-loading';

};

/**
 * Hijack all standard js links in the container
 *
 */
sockso.Ajaxer.prototype.init = function() {

    if ( this.isSupported() ) {
        this.attach();
        $( window ).bind(
            'popstate',
            this.onPopState.bind( this )
        );
    }

};

/**
 * Indicates if pushState is supported
 *
 * @return boolean
 */
sockso.Ajaxer.prototype.isSupported = function() {

    return history && history.pushState;

};

/**
 * Handler for when a window history state has been popped
 *
 * @param evt
 */
sockso.Ajaxer.prototype.onPopState = function( evt ) {

    var state = evt.originalEvent.state;

    if ( state ) {
        this.loadUrl( state.url );
    }

};

/**
 * Attach the ajaxer to the anchors in the specified container
 *
 * @param container
 */
sockso.Ajaxer.prototype.attach = function( container ) {

    if ( this.isSupported() ) {
        $( 'a', container )
            .not( '[href^=javascript]' )
            .not( '.noajax' )
            .click( this.onClick.bind(this) );
    }

};

/**
 * A link has been clicked
 *
 */
sockso.Ajaxer.prototype.onClick = function( evt ) {

    var link = $( this.originalScope );
    var href = link.attr( 'href' );

    this.loadUrl( href );

    history.pushState( {url:href}, '', href );

    return false;

};

/**
 * Load a new URL into the page
 *
 * @param href
 *
 */
sockso.Ajaxer.prototype.loadUrl = function( href ) {

    $( '#content' ).addClass( this.loadingClass );

    $.ajax({
        method: 'GET',
        url: href,
        success: this.onLoadUrl.bind( this )
    });

};

/**
 * A URL has been loaded, render it
 *
 * @param html
 */
sockso.Ajaxer.prototype.onLoadUrl = function( html ) {

    var newContent = $( '#content', html );
    var newTitle = html.match( new RegExp('<title>(.*?)</title>') )[ 1 ];

    $( '#content' ).replaceWith( newContent );

    this.attach( newContent );
    this.page.initContent();
    this.setTitle( newTitle );

    $( '#content' ).removeClass( this.loadingClass );

};

/**
 * Sets the page title
 *
 * @param title
 */
sockso.Ajaxer.prototype.setTitle = function( title ) {

    document.title = title;

};

/**
 *  Base class for all sockso objects
 *
 */

sockso.Base = function( options ) {
    
    $.extend( this, options );

};

$.extend( sockso.Base.prototype, {

    /**
     * Returns the current user
     *
     */
    getUser: function() {

        return this.user;

    },
    
    /**
     * Returns the specified handler bound to this object
     * 
     */
    bind: function( handler, options ) {
        
        var self = this;
        
        return function() {
            return self[ handler ].apply(
                self,
                options || arguments
            );
        }
        
    },

    /**
     * Provide the jquery ajax method (this can then be overridden)
     * 
     */
    ajax: $.ajax

});

/**
 *  represents a folder.  the name should have unicode entity encoded, and
 *  the path should be URL encoded.
 *  
 */

function Folder( name, path ) {
    this.name = name;
    this.path = decodeURIComponent(path);
    this.isFolder = true;
}

/**
 *  represents a file.  the name should have unicode entity encoded, and
 *  the path should be URL encoded.
 *  
 */

function File( name, path ) {
    this.name = name;
    this.path = decodeURIComponent(path).replace( /\\/g, '/' );
    this.isFolder = false;
}

/**
 * Folder browsing object
 *
 * @param player sockso.Player
 * @param playlist sockso.Playlist
 */
sockso.FolderBrowsing = function( player, playlist ) {

    this.player = player;
    this.playlist = playlist;

};

/**
 *  plays a file for a path
 *
 *  @param path path of file to play
 *
 */
sockso.FolderBrowsing.prototype.playFile = function( path ) {
    
    this.resolvePath(
        path,
        this.onPlayPathResolved.bind( this ),
        Locale.getString( 'www.error.trackNotFound' )
    );

};

/**
 * Handler to play some music after paths have been resolved
 *
 * @param responseText String
 */
sockso.FolderBrowsing.prototype.onPlayPathResolved = function( responseText ) {
    
    eval( 'var track = ' +responseText );
    
    this.player.play( 'tr' +track['id'] );
    
};

/**
 *  takes a string with encoded named entities (eg. &amp;) and turns
 *  them back into their normal characters
 *
 *  @param str
 *
 */
sockso.FolderBrowsing.prototype.decodeEntities = function( str ) {

    var entities = new Array(
        '&amp;', '&',
        '&lt;', '<',
        '&gt;', '>',
        '&quot;', '"',
        '&apos;', "'"
    );

    for ( var i=0; i<entities.length; i+=2 ) {
        str = str.replace( eval('/'+entities[i]+'/g'), entities[i+1] );
    }

    return str;

};

/**
 *  traverses up the DOM to work out our current path, the path returned
 *  already has it's components properly URI encoded.
 *
 */
sockso.FolderBrowsing.prototype.getPath = function( folder ) {

    var link = $( 'a', folder )[ 0 ];
    var id = folder.attr( 'id' );
    var name = encodeURIComponent(this.decodeEntities( link.firstChild.nodeValue ));

    return id.match( /^collection-\d+$/ )
        ? ''
        : this.getPath(folder.parent().parent()) + '/' + name;

};

/**
 *  traverses up the DOM to find the collection we're in
 *
 *  @param elem current element
 *
 */
sockso.FolderBrowsing.prototype.getCollectionId = function( elem ) {

    var id = elem.attr( 'id' );
    var matches = id != null
        ? id.match( /^collection-(\d+)$/ )
        : null;

    return ( matches )
        ? matches[ 1 ]
        : this.getCollectionId( elem.parent() );

};

/**
 *  makes an ajax call to resolve a path to a track id and then passes
 *  control to the specified handler function
 *
 *  @param path
 *  @param handler
 *  @param errorMessage
 *
 */
sockso.FolderBrowsing.prototype.resolvePath = function( path, handler, errorMessage ) {

    this.ajax({
        type: 'POST',
        url: Properties.getUrl('/json/resolvePath'),
        data: {
            path: path
        },
        success: handler,
        error: function(){ alert(errorMessage); }
    });

};

/**
 *  tries to resolve a path to a track then add it to the playlist
 *
 *  @param path
 *
 */
sockso.FolderBrowsing.prototype.addFileToPlaylist = function( path ) {

    this.resolvePath(
        path,
        this.onAddFileToPlaylist.bind( this ),
        Locale.getString('www.error.trackNotFound')
    );

};

/**
 * Handler for when we've resolved a track path to add to the playlist
 *
 * @param responseText String
 */
sockso.FolderBrowsing.prototype.onAddFileToPlaylist = function( responseText ) {

    eval( 'var track = ' +responseText );

    var item = new MusicItem( 'tr' + track.id, track.name );

    this.playlist.add( item );
    
};

/**
 *  looks at a files path and decides if this is a media file (mp3,
 *  ogg or wma)
 *
 *  @param file File object
 *
 *  @return boolean
 *
 */
sockso.FolderBrowsing.prototype.isMediaFile = function( file ) {

    var exts = new Array( 'mp3', 'ogg', 'wma', 'flac', 'aac' );
    var ext = file.path.toLowerCase().substring( file.path.lastIndexOf('.') + 1 );

    for ( var i=0; i<exts.length; i++ ) {
        if ( exts[i] == ext ) {
            return true;
        }
    }

    return false;

};

/**
 *  creates a folder node for the tree
 *
 *  @param folder folder object
 *
 */
sockso.FolderBrowsing.prototype.getFolderItem = function( folder ) {

    var self = this;
    var link = $( '<a></a>' )
            .attr({
                href: 'javascript:;'
            })
            .click( this.onToggleClicked.bind(this) )
            .html( folder.name );

    var play = this.getTrackAction( 'play', function() {
        var extraArgs = 'path=' +folder.path;
        self.player.play( '', extraArgs );
        return false;
    }, 'Play folder' );

    var download = null;
    if ( Properties.get('www.disableDownloads') != 'yes' )
        download = this.getTrackAction( 'download', function() {
            self.getTracksForFolder( folder, self.downloadFolder.bind(self) );
        }, 'Download folder' );

    var actions = $( '<span></span>' )
        .addClass( 'actions' )
        .append( play )
        .append( download );
        
    link.append( actions );

    return $( '<li></li>' )
        .addClass( 'folder' )
        .append( link )
        .append( $('<ul></ul>') );

};

/**
 *  creates an image wrapped in an anchor for use when playing tracks
 *
 *  @param icon
 *  @param action
 *  @param title
 *
 */
sockso.FolderBrowsing.prototype.getTrackAction = function( icon, action, title ) {

    return $( '<a></a>' )
        .attr({
            href: 'javascript:;',
            title: title
        })
        .click( action )
        .append( $('<img />').attr('src',Properties.getUrl('<skin>/images/' + icon +'.png') ))
        .append( '<span>&nbsp;</span>' );

};

/**
 *  tries to resolve a path to a tarck and then download it
 *
 *  @param path
 *
 */
sockso.FolderBrowsing.prototype.downloadFile = function( path ) {

    this.resolvePath( path, function( responseText ) {
        eval( 'var track = ' +responseText );
        self.location.href = Properties.getUrl('/download/tr' +track['id']);
    });

};

/**
 *  creates a track node for a file (assumed to be a media file)
 *
 *  @param file
 *
 *  @return LI
 *
 */
sockso.FolderBrowsing.prototype.getTrackItem = function( file ) {

    var self = this;

    var play = this.getTrackAction(
        'play',
        function() { self.playFile(file.path); },
        file.name
    );

    var playlist = this.getTrackAction(
        'add',
        function() { self.addFileToPlaylist( file.path ); },
        file.name
    );

    var download = ( Properties.get('www.disableDownloads') != 'yes' )
        ? this.getTrackAction( 'download', function() {
              self.downloadFile( file.path );
          }, 'Download: ' +file.name )
        : null;

    return $( '<li></li>' )
        .addClass( 'audioFile' )
        .append( play )
        .append( playlist )
        .append( download )
        .append( file.name );

};

/**
 *  works out the path and collection for a folder and makes an ajax request
 *  to find the tracks in it to play
 *
 *  the playUrlAction should be a function to handle the play url that will
 *  be constructed from the data in the response
 *
 *  @param folder
 *  @param handler
 *
 */
sockso.FolderBrowsing.prototype.getTracksForFolder = function( folder, handler ) {

    var url = Properties.getUrl('/json/tracksForPath?path=' +encodeURIComponent(folder.path));

    this.ajax({
        url: url,
        success: function( responseText ) {
            eval( 'var tracks = ' +responseText );
            var playUrl = '';
            $.each( tracks, function(i,track) {
                playUrl += 'tr' +track+ '/';
            });
            handler( playUrl );
        }
    });

};

/**
 *  takes a play url to download
 *
 *  @param playUrl
 *
 */
sockso.FolderBrowsing.prototype.downloadFolder = function( playUrl ) {

    self.location.href = Properties.getUrl('/download/' +playUrl);

};

/**
 *  given an array of files and folders, will return just the files that
 *  look like media files
 *
 *  @param results array of File and Folder objects
 *
 *  @return Array
 *
 */
sockso.FolderBrowsing.prototype.getTracks = function( results ) {

    var self = this;
    var files = [];

    $.each( results, function(i,result){
        if ( !result.isFolder && self.isMediaFile(result) ) {
            files.push( result );
        }
    });

    return files;

};

/**
 *  given an array of files and folders, will return just the folders
 *
 *  @param results array of File and Folder objects
 *
 *  @return Array
 *
 */
sockso.FolderBrowsing.prototype.getFolders = function( results ) {

    var folders = [];

    $.each( results, function(i,result){
        if ( result.isFolder ) {
            folders.push( result );
        }
    });

    return folders;

};

/**
 *  handles the return of the query to load a folder
 *
 *  @param folder the element we're loading
 *  @param responseText
 *
 */
sockso.FolderBrowsing.prototype.handleLoadFolder = function( folder, responseText ) {

    eval( 'var results = ' + responseText );

    var self = this;
    var children = $( $('ul',folder)[0] );
    var tracks = this.getTracks( results );
    var folders = this.getFolders( results );

    children.empty();

    // add files and folders if we have them
    if ( (tracks.length + folders.length) > 0 ) {

        // add sub folders, then files
        $.each( folders, function(i,subFolder) {
            children.append( self.getFolderItem(subFolder) );
        });
        $.each( tracks, function(i,track) {
            children.append( self.getTrackItem(track) );
        });

    }
    // otherwise mark as empty
    else children.append( $('<li></li>').addClass('empty').html('...') );

    folder.addClass( 'loaded folderOpen' );

};

/**
 * Initialise folder browsing
 *
 */
sockso.FolderBrowsing.prototype.init = function() {

    var self = this;

    $( '#folders li' ).each(function(i,folder) {

       var elem = $( folder );
       var link = $( '<a></a>' )
                    .attr({
                        href: 'javascript:;'
                    })
                    .click( self.onToggleClicked.bind(self) )
                    .html( elem.html().replace(/\\/g,'/') );
       var children = $('<ul></ul>');

       elem.empty()
            .append( link )
            .append( children );


    });

};

/**
 *  loads a folder with it's contents
 *
 *  @param folder the element to load
 *
 */
sockso.FolderBrowsing.prototype.loadFolder = function( folder ) {

    var self = this;
    var path = this.getPath( folder );
    var collectionId = this.getCollectionId( folder );
    var url = Properties.getUrl('/json/folder' +
        path+ // already URI encoded
        '?collectionId=' +encodeURIComponent(collectionId));

    // show loading gif
    $( 'ul', folder ).append(
        $( '<img />' )
            .attr({ src: Properties.getUrl('/<skin>/images/loading.gif') })
    );

    // set a small timeout so the page can refresh with the loading
    // gif before we make the ajax request (which could take a lil bit)
    setTimeout(
        function() {
            self.ajax({
                url: url,
                success: function( responseText ) {
                    self.handleLoadFolder( folder, responseText )
                }
            });
        },
        100
    );

};

/**
 * Toggles a folders expanded/collapses state, loading it's
 * children if it needs it.
 *
 * @param event jQuery.Event
 */
sockso.FolderBrowsing.prototype.onToggleClicked = function( event ) {

    var elem = $( event.target );
    var folder = elem.parent();

    if ( !folder.hasClass('loaded') ) {
        this.loadFolder( folder );
    }

    else {
        var children = $( 'ul', folder )[ 0 ];
        folder.toggleClass( 'folderOpen' );
        $( children ).toggleClass( 'collapsed' );
    }
    
    return false;

};

/**
 * For intercepting in tests
 * 
 */
sockso.FolderBrowsing.prototype.ajax = $.ajax;

/**
 *  Implements a basic hash table.
 *
 */

sockso.Hashtable = function() {

    var items = [];

    /**
     *  Gets a named property, using the default if it's not set
     *
     *  @param name
     *  @param defaultValue
     *
     *  @return Object
     *
     */

    this.get = function( name, defaultValue ) {

        var value = items[ name ];

        return value
            ? value
            : ( defaultValue ? defaultValue : '' );

    };

    /**
     *  Sets a property to a value
     *
     *  @param name
     *  @param value
     *
     */

    this.set = function( name, value ) {

        items[ name ] = value;

    };

    /**
     *  Sets the data to be used for properties
     *
     *  p.setData({ foo: 'bar' });
     *
     *  @param data
     *
     */

    this.setData = function( data ) {

        items = data;

    };

};

var html5player = null;

var HTML5PLAYER_MODE_NORMAL = 1;
var HTML5PLAYER_MODE_RANDOM = 2;

var HTML5PLAYER_VOLUME_STEPS = [0, .1, .2, .3, .4, .5, .6, .7, .8, .9, 1];

/**
 *  A javascript player using the HTML 5 <audio> tag.
 *  Playlist management is similar to the JS player
 *  
 *
 */
sockso.Html5Player = function() {

    this.playlist = [];
    this.mode = false;
    this.playing = null;
    this.artworkDiv = null;
    this.controlsDiv = null;
    this.playlistDiv = null;
    this.infoDiv = null;
    this.audioElt = null;
    this.volumeIndex = HTML5PLAYER_VOLUME_STEPS.length-1;

};

sockso.Html5Player.prototype = new sockso.Base();

$.extend( sockso.Html5Player.prototype, {
    
    /**
     *  selects the specified item as being the current playing
     *
     *  @param item
     *
     */

    selectItem: function( index, item ) {

        // set playlist styling
        $( 'li', this.playlistDiv ).removeClass( 'current' );
        $( '#item' +item.id ).addClass( 'current' );

        this.artworkDiv
            .empty()
            .append(
                $( '<img></img>' )
                    .attr({
                        src: Properties.getUrl('/file/cover/al' +item.album.id)
                    })
            );

        this.infoDiv.html( item.artist.name+ ' - ' +item.name );
        document.title = (index+1) + '/' + this.playlist.length + ' : ' + item.artist.name + ' - ' + item.name;
        
        document.location = '#item'+item.id;

    },

    /**
     *  redraws the playlist on the page
     *
     */
    
    refresh: function() {

        var self = this;

        this.playlistDiv.empty();

        $.each( this.playlist, function(i,item) {

            $( '<li></li>' )
                .attr({ id: 'item' +item.id })
                .append(
                    $( '<a></a>' )
                        .html( item.artist.name+ ' - ' +item.name )
                        .attr({ href: 'javascript:;' })
                        .click( self.bind('playItem',[i]) )
                )
                .appendTo( self.playlistDiv );

        });

    },

    /**
     *  plays the item in the playlist at the specified index
     *
     *  @param index
     *
     */

    playItem: function( index ) {

        var item = this.playlist[ index ];

        if ( item ) {

            this.selectItem( index, item );
            this.audioElt.attr('src', Properties.getUrl('/stream/' + item.id));
            this.playing = index;

        }

    },

    /**
     *  Returns the index of the currently playing item
     * 
     *  @return int
     *   
     */

    getCurrentItem: function() {
        
        return this.playing;

    },

    /**
     *  plays the previous item
     *
     */

    playPrevItem: function() {

        if ( this.isPrevItem() ) {
            this.playItem( this.playing - 1 );
        }
        
    },

    /**
     *  plays the next item
     *
     */

    playNextItem: function() {

        if ( this.isNextItem() ) {
            this.playItem( this.playing + 1 );
        }
        
        else if ( this.mode == HTML5PLAYER_MODE_RANDOM ) {
            window.location.reload();
        }

    },

    /**
     * Indicates if there is a next item to play
     * 
     */
    isNextItem: function() {
        
        return this.playing != -1 &&
            this.playing < this.playlist.length - 1;

    },
    
    /**
     * Indicates if there is a previous item to play
     * 
     */
    isPrevItem: function() {
        
        return this.playing != -1
            && this.playing > 0;
        
    },

    /**
     *  stops anything currently playing
     *
     */

    stopPlaying: function() {

        this.audioElt.get(0).pause();
        $( '#playlist li' ).removeClass( 'current' );
        this.playing = -1;

    },

    /**
     * toggle pause/play mode
     * 
     */

    togglePause: function() {
        if (this.audioElt.get(0).paused) {
            this.audioElt.get(0).play();
        } else {
            this.audioElt.get(0).pause();
        }
    },

    /**
     * increases volume, one step
     */
    volumeUp: function() {

        if (this.volumeIndex < HTML5PLAYER_VOLUME_STEPS.length-1 ) {
            this.audioElt.get(0).volume = HTML5PLAYER_VOLUME_STEPS[++this.volumeIndex];
        }

    },
    
    /**
     * decreases volume, one step
     */
    volumeDown: function() {

        if (this.volumeIndex > 0 ) {
            this.audioElt.get(0).volume = HTML5PLAYER_VOLUME_STEPS[--this.volumeIndex];
        }

    },
    
    /**
     *  Adds a track to the playlist
     *
     *  @param track The track to add
     *
     */

    addTrack: function( track ) {

        this.playlist.push( track );

    },

    /**
     *  Creates and returns a control for the controls panel
     *  
     *  @param onClick Click handler
     *  @param imgName name of image for control
     *  
     *  @return jQuery
     *  
     */

    makeControl: function( onClick, imgName ) {

        return $( '<a></a>' )
                    .click( onClick.bind(this) )
                    .attr({ href: 'javascript:;' })
                    .append(
                        $( '<img></img>')
                            .attr({ src: Properties.getUrl('/<skin>/images/html5player/' +imgName+ '.png') })
                    );

    },

    /**
     *  handle key events.
     *  keys are in a ASDW fashion:
     *    A, D : prev, next
     *    S, W : vol up, down
     *    
     *  using ASCII letters seems to be the only
     *  reliable cross-browser way.
     */

    keyHandler: function ( event ) {

        var keyCode = event.keyCode || event.which;
        var key = String.fromCharCode( keyCode )
                        .toLowerCase();

        switch ( key ) {
        
        case ' ':
            this.togglePause();
            break;
        
        case 'd':
            this.playNextItem();
            break;
        
        case 'a':
            this.playPrevItem();
            break;
        
        case 'w':
            this.volumeUp();
            break;
        
        case 's':
            this.volumeDown();
            break;
        }

    },

    /**
     *  Initializes the player using the specified element id
     *  
     *  @param playerDivId Container DIV id
     *  @param skin String for skin
     *  @param mode HTML5PLAYER_MODE_*
     */

    init: function( playerDivId, skin, mode ) {

        var self = this;

        skin = skin || 'original';
        mode = mode || HTML5PLAYER_MODE_NORMAL;

        this.audioElt = $('<audio></audio>')
                        .attr( 'controls', 'controls')
                        .attr( 'autoplay', 'autoplay')
                        .text( 'Your browser doesn\'t support HTML 5 <audio> element.' )
                        .error ( this.bind('playNextItem') )
                        .bind ( 'ended', this.bind('playNextItem') )

        var audioDiv = $( '<div></div>' )
            .addClass( 'audio' )
            .append( this.audioElt );

        this.artworkDiv = $( '<div></div>' )
                        .addClass( 'artwork' );

        this.playlistDiv = $( '<div></div>' )
                        .addClass( 'playlist' );

        this.controlsDiv = $( '<div></div>' )
                        .addClass( 'controls' )
                        .append( this.makeControl( self.playPrevItem, 'prev' ) )
                        .append( this.makeControl( self.stopPlaying, 'stop' ) )
                        .append( this.makeControl( self.playNextItem, 'next' ) );

        this.infoDiv = $( '<div></div>' )
                    .addClass( 'info' )
                    .html( 'Click a track to start playing!' );
        
        
        $( '#' + playerDivId )
            .addClass( 'html5player' )
            .append( this.artworkDiv )
            .append( this.playlistDiv )
            .append( this.controlsDiv )
            .append( this.infoDiv )
            .append( audioDiv );
        
        $( document ).bind(
            'keypress', {}, this.bind( 'keyHandler' )
        );
        
    },
    
    /**
     * Starts pkaying, once tracks have been
     * added
     */
    
    start: function () {
        
        this.refresh();
        this.playItem( 0 );
        
    },

    /**
     *  Updates the player playlist with the specified tracks
     *  
     *  @param tracks
     *  
     */

    update: function( tracks ) {

        var self = this;
        var currentItem = null;

        // if we're playing something store it
        if ( this.playing != -1 ) {
            currentItem = this.playlist[ this.playing ];
        }

        // refresh playlist
        this.playlist = tracks;
        this.refresh();

        // if we have a saved item try and reload it
        if ( currentItem != null ) {
            $.each( this.playlist, function(i,item) {
                if ( currentItem.id == item.id ) {
                    self.selectItem( item ); // found!
                    self.playing = i;
                    return false;
                }
            });
        }

    }

});


/**
 *  attach reloader function to window
 *
 */

window.html5player_reload = function( playUrl ) {

    var url = Properties.getUrl( '/json/tracks/' +playUrl );

    $.getJSON( url, {}, html5player.update.bind(html5player) );

};
/***
 *	ImageFlow 0.8
 *
 *	This code is based on Michael L. Perrys Cover flow in Javascript.
 *	For he wrote that "You can take this code and use it as your own" [1]
 *	this is my attempt to improve some things. Feel free to use it! If
 *	you have any questions on it leave me a message in my shoutbox [2].
 *
 *	The reflection is generated server-sided by a slightly hacked
 *	version of Richard Daveys easyreflections [3] written in PHP.
 *
 *	The mouse wheel support is an implementation of Adomas Paltanavicius
 *	JavaScript mouse wheel code [4].
 *
 *	Thanks to Stephan Droste ImageFlow is now compatible with Safari 1.x.
 *
 *	[1] http://www.adventuresinsoftware.com/blog/?p=104#comment-1981
 *	[2] http://shoutbox.finnrudolph.de/
 *	[3] http://reflection.corephp.co.uk/v2.php
 *	[4] http://adomas.org/javascript-mouse-wheel/
 *
 *      NOTE: This script has been modified for use in Sockso.
 *
 */
sockso.ImageFlow = function( options ) {

    this.ajaxer = options.ajaxer;

};

/**
 * Initialise imageflow for this page
 *
 */
sockso.ImageFlow.prototype.init = function() {

    var self = this;

    // Configuration variables
    var conf_reflection_p = 0.5;         // Sets the height of the reflection in % of the source image
    var conf_focus = 4;                  // Sets the numbers of images on each side of the focussed one
    var conf_slider_width = 14;          // Sets the px width of the slider div
    var conf_images_cursor = 'pointer';  // Sets the cursor type for all images default is 'default'
    var conf_slider_cursor = 'default';  // Sets the slider cursor type: try "e-resize" default is 'default'

    // Id names used in the HTML
    var conf_imageflow = 'imageflow';    // Default is 'imageflow'
    var conf_loading = 'loading';        // Default is 'loading'
    var conf_images = 'images';          // Default is 'images'
    var conf_captions = 'captions';      // Default is 'captions'
    var conf_scrollbar = 'scrollbar';    // Default is 'scrollbar'
    var conf_slider = 'slider';          // Default is 'slider'

    // Define global variables
    var caption_id = 0;
    var new_caption_id = 0;
    var current = 0;
    var target = 0;
    var mem_target = 0;
    var timer = 0;
    var array_images = new Array();
    var new_slider_pos = 0;
    var dragging = false;
    var dragobject = null;
    var dragx = 0;
    var posx = 0;
    var new_posx = 0;
    var xstep = 150;

    function step()
    {
            switch (target < current-1 || target > current+1)
            {
                    case true:
                            moveTo(current + (target-current)/3);
                            window.setTimeout(step, 50);
                            timer = 1;
                            break;

                    default:
                            timer = 0;
                            break;
            }
    }

    function glideTo(x, new_caption_id)
    {
            // Animate gliding to new x position
            target = x;
            mem_target = x;
            if (timer == 0)
            {
                    window.setTimeout(step, 50);
                    timer = 1;
            }

            // Display new caption
            caption_id = new_caption_id;
             var imgItem = img_div.childNodes.item( array_images[caption_id] );
            captionText = imgItem.getAttribute( 'alt' );
             var id = imgItem.getAttribute( 'src' ).match( /^.*\/(.*?)$/ )[ 1 ];
            if (captionText == '') captionText = '&nbsp;';
            caption_div.innerHTML = captionText;

             sockso.util.getMusicElement( new MusicItem(id,captionText), true )
                .appendTo( $(caption_div).empty() );

            // Set scrollbar slider to new position
            if (dragging == false)
            {
                    new_slider_pos = (scrollbar_width * (-(x*100/((max-1)*xstep))) / 100) - new_posx;
                    slider_div.style.marginLeft = (new_slider_pos - conf_slider_width) + 'px';
            }
    }

    function moveTo(x)
    {
            current = x;
            var zIndex = max;

            // Main loop
            for (var index = 0; index < max; index++)
            {
                    var image = img_div.childNodes.item(array_images[index]);
                    var current_image = index * -xstep;

                    // Don't display images that are not conf_focussed
                    if ((current_image+max_conf_focus) < mem_target || (current_image-max_conf_focus) > mem_target)
                    {
                            image.style.visibility = 'hidden';
                            image.style.display = 'none';
                    }
                    else
                    {
                            var z = Math.sqrt(10000 + x * x) + 100;
                            var xs = x / z * size + size;

                            // Still hide images until they are processed, but set display style to block
                            image.style.display = 'block';

                            // Process new image height and image width
                            var new_img_h = (image.h / image.w * image.pc) / z * size;
                            switch ( new_img_h > max_height )
                            {
                                    case false:
                                            var new_img_w = image.pc / z * size;
                                            break;

                                    default:
                                            new_img_h = max_height;
                                            var new_img_w = image.w * new_img_h / image.h;
                                            break;
                            }
                            var new_img_top = (images_width * 0.34 - new_img_h) + images_top + ((new_img_h / (conf_reflection_p + 1)) * conf_reflection_p);

                            // Set new image properties
                            image.style.left = xs - (image.pc / 2) / z * size + images_left + 'px';
                            image.style.height = new_img_h + 'px';
                            image.style.width = new_img_w + 'px';
                            image.style.top = (new_img_top - 90) + 'px';
                            image.style.visibility = 'visible';

                            // Set image layer through zIndex
                            switch ( x < 0 )
                            {
                                    case true:
                                            zIndex++;
                                            break;

                                    default:
                                            zIndex = zIndex - 1;
                                            break;
                            }

                            // Change zIndex and onclick function of the focussed image
                            switch ( image.i == caption_id )
                            {
                                    case false:
                                            image.onclick = function() { glideTo(this.x_pos, this.i); };
                                            break;

                                    default:
                                            zIndex = zIndex + 1;
                                            image.onclick = function() {
                                                $( '#imageflow a' ).click();
                                            };
                                            break;
                            }
                            image.style.zIndex = zIndex;
                    }
                    x += xstep;
            }
    }

    // Main function
    function refresh(onload)
    {
            // Cache document objects in global variables
            imageflow_div = document.getElementById(conf_imageflow);
            img_div = document.getElementById(conf_images);
            scrollbar_div = document.getElementById(conf_scrollbar);
            slider_div = document.getElementById(conf_slider);
            caption_div = document.getElementById(conf_captions);

            // Cache global variables, that only change on refresh
            images_width = img_div.offsetWidth;
            images_top = imageflow_div.offsetTop;
            images_left = imageflow_div.offsetLeft;
            max_conf_focus = conf_focus * xstep;
            size = images_width * 0.5;
            scrollbar_width = images_width * 0.6;
            conf_slider_width = conf_slider_width * 0.5;
            max_height = images_width * 0.51;

            // Change imageflow div properties
            imageflow_div.style.height = (max_height - 20) + 'px';

            // Change images div properties
            img_div.style.height = images_width * 0.338 + 'px';

            // Change captions div properties
            caption_div.style.width = images_width + 'px';
            caption_div.style.marginTop = images_width * 0.03 + 'px';

            // Change scrollbar div properties
            scrollbar_div.style.marginTop = images_width * 0.02 + 'px';
            scrollbar_div.style.marginLeft = images_width * 0.2 + 'px';
            scrollbar_div.style.width = scrollbar_width + 'px';

            // Set slider attributes
            slider_div.onmousedown = function () { dragstart(this); };
            slider_div.style.cursor = conf_slider_cursor;

            // Cache EVERYTHING!
            max = img_div.childNodes.length;
            var i = 0;
            for (var index = 0; index < max; index++)
            {
                    var image = img_div.childNodes.item(index);
                    if (image.nodeType == 1)
                    {
                            array_images[i] = index;

                            // Set image onclick by adding i and x_pos as attributes!
                            image.onclick = function() { glideTo(this.x_pos, this.i); };
                            image.x_pos = (-i * xstep);
                            image.i = i;

                            // Add width and height as attributes ONLY once onload
                            if(onload == true)
                            {
                                    image.w = image.width;
                                    image.h = image.height;
                            }

                            // Check source image format. Get image height minus reflection height!
                            switch ((image.w + 1) > (image.h / (conf_reflection_p + 1)))
                            {
                                    // Landscape format
                                    case true:
                                            image.pc = 118;
                                            break;

                                    // Portrait and square format
                                    default:
                                            image.pc = 100;
                                            break;
                            }

                            // Set ondblclick event
                            image.url = image.getAttribute('longdesc');

                            // Set image cursor type
                            image.style.cursor = conf_images_cursor;

                            i++;
                    }
            }
            max = array_images.length;

            // Display images in current order
            moveTo(current);
            glideTo(current, caption_id);
    }

    // Show/hide element functions
    function show(id)
    {
            var element = document.getElementById(id);
            element.style.visibility = 'visible';
    }
    function hide(id)
    {
            var element = document.getElementById(id);
            element.style.visibility = 'hidden';
            element.style.display = 'none';
    }

    // Refresh ImageFlow on window resize
    window.onresize = function()
    {
            if(document.getElementById(conf_imageflow)) refresh();
    };

    // Handle the wheel angle change (delta) of the mouse wheel
    function handle(delta)
    {
            var change = false;
            switch (delta > 0)
            {
                    case true:
                            if(caption_id >= 1)
                            {
                                    target = target + xstep;
                                    new_caption_id = caption_id - 1;
                                    change = true;
                            }
                            break;

                    default:
                            if(caption_id < (max-1))
                            {
                                    target = target - xstep;
                                    new_caption_id = caption_id + 1;
                                    change = true;
                            }
                            break;
            }

            // Glide to next (mouse wheel down) / previous (mouse wheel up) image
            if (change == true)
            {
                    glideTo(target, new_caption_id);
            }
    }

    // Event handler for mouse wheel event
    function wheel(event)
    {
            var delta = 0;
            if (!event) event = window.event;
            if (event.wheelDelta)
            {
                    delta = event.wheelDelta / 120;
            }
            else if (event.detail)
            {
                    delta = -event.detail / 3;
            }
            if (delta) handle(delta);
            if (event.preventDefault) event.preventDefault();
            event.returnValue = false;
    }

    // Initialize mouse wheel event listener
    function initMouseWheel()
    {
            if(window.addEventListener) imageflow_div.addEventListener('DOMMouseScroll', wheel, false);
            imageflow_div.onmousewheel = wheel;
    }

    // This function is called to drag an object (= slider div)
    function dragstart(element)
    {
            dragobject = element;
            dragx = posx - dragobject.offsetLeft + new_slider_pos;
    }

    // This function is called to stop dragging an object
    function dragstop()
    {
            self.ajaxer.attach( '#imageflow' );
            dragobject = null;
            dragging = false;
    }

    // This function is called on mouse movement and moves an object (= slider div) on user action
    function drag(e)
    {
            posx = document.all ? window.event.clientX : e.pageX;
            if(dragobject != null)
            {
                    dragging = true;
                    new_posx = (posx - dragx) + conf_slider_width;

                    // Make sure, that the slider is moved in proper relation to previous movements by the glideTo function
                    if(new_posx < ( - new_slider_pos)) new_posx = - new_slider_pos;
                    if(new_posx > (scrollbar_width - new_slider_pos)) new_posx = scrollbar_width - new_slider_pos;

                    var slider_pos = (new_posx + new_slider_pos);
                    var step_width = slider_pos / ((scrollbar_width) / (max-1));
                    var image_number = Math.round(step_width);
                    var new_target = (image_number) * -xstep;
                    var new_caption_id = image_number;

                    dragobject.style.left = new_posx + "px";
                    glideTo(new_target, new_caption_id);
            }
    }

    // Initialize mouse event listener
    function initMouseDrag()
    {
            document.onmousemove = drag;
            document.onmouseup = dragstop;
    }

    function getKeyCode(event)
    {
            event = event || window.event;
            return event.keyCode;
    }

    document.onkeydown = function(event)
    {
            var charCode  = getKeyCode(event);
            switch (charCode)
            {
                    // Right arrow key
                    case 39:
                            handle(-1);
                            break;

                    // Left arrow key
                    case 37:
                            handle(1);
                            break;
            }
    };

    /**
     *  creates an imageflow display for a music list, the musiclist
     *  is then hidden (so it can be displayed again)
     *
     *  show content and initialize mouse event listening after loading
     *
     */

    function imageflow_init()
    {
            if(document.getElementById(conf_imageflow))
            {
                    refresh(true);
                    show(conf_images);
                    show(conf_scrollbar);
                    initMouseWheel();
                    initMouseDrag();
            }
    }

    /**
     *  sets up image flow for a music list
     *
     *  @param musiclist
     *
     */

    function if_createImageFlow( musiclist ) {

        // destroy any other image flows
        $( '#imageflow' ).remove();

        var imageflow = $( '<div></div>' ).attr( 'id', 'imageflow' );
        var images = $( '<div></div>' ).attr( 'id', 'images' );

        $( 'ul li.musicitem' ).each( function(i,item){

            var anchors = $( 'a', item );
            var itemData = $( item ).attr( 'id' );
            $( '<img />' )
                .addClass( 'cover' )
                .attr({
                    src: Properties.getUrl('file/cover/' + itemData),
                    alt: $(anchors[anchors.length-1]).html()
                })
                .appendTo( images );

        });

        images.appendTo( imageflow );
        $( '<div id="scrollbar"><div id="slider"></div></div><div id="captions"></div>' )
            .appendTo( imageflow );
        $( musiclist )
            .css({
                margin: '0px',
                padding: '0px'
            })
            .append( imageflow );

        imageflow_init();

    }

    /**
     *  looks for any musiclists on the page and adds imageflow
     *  links to them
     *
     */

    function if_addLinks() {

        $( 'ul.imageflow-list' ).each(function(i,musiclist) {

            if ( $('li',musiclist).length > 1 ) {

                var wrap = $( '<div></div>' );
                var link = $( '<a></a>' )
                    .html( 'ImageFlow' )
                    .addClass( 'toggler' )
                    .attr( 'href', 'javascript:;' )
                    .click(function(){
                        var imageflow = $( '#imageflow' );
                        if ( imageflow.length > 0 ) {
                            $.each(imageflow,function(){
                                $(this).remove();
                            });
                        }
                        else if_createImageFlow( wrap );
                        $( this )
                            .blur()
                            .toggleClass( 'togglerHide' );
                    });

               var newDiv = $( '<div></div>' )
                                .addClass( 'imageflow_toggler' )
                                .append( link )
                                .append( wrap )

               newDiv.insertBefore( musiclist );

            }

        });

    }

    if_addLinks();

};

/**
 *  An object for storing and accessing locale data
 *
 */

sockso.Locale = function() {

    var data = {};

    /**
     *  Sets the locale text data to use
     *  
     *  l.setData({ foo: 'bar', baz: 'bazzle' });
     *  
     *  @param newData
     *  
     */

    this.setData = function( newData ) {

        data = newData;

    };

    /**
     *  Returns a locale string, optionally with some replacements made
     *  
     *  @param key
     *  @param reps
     *  
     */

    this.getString = function( key, reps ){

        var text = data[ key ] || '';

        if ( reps ) {
            $.each(reps,function(i,rep){
                text = text.replace( '%'+(i+1), rep, 'g' );
            });
        }
        
        return text;
        
    };

};

/**
 * Encapsulates different kind of page functionality
 *
 */
sockso.Page = function() {
};

/**
 * Initialise and wire up all the objects
 *
 */
sockso.Page.prototype.init = function() {

    this.session = new sockso.Session();

    // ajax loading pages

    this.ajaxer = new sockso.Ajaxer({
        page: this
    });

    this.search = new sockso.SearchBox({
        ajaxer: this.ajaxer
    });

    this.player = new sockso.Player({
        session: this.session
    });

    this.playlist = new sockso.Playlist({
        parentId: 'playlist',
        player: this.player,
        session: this.session,
        ajaxer: this.ajaxer,
        user: user
    });

    this.console = new sockso.AdminConsole();

    this.uploadForm = new sockso.UploadForm( 'uploadForm' );

    this.related = new sockso.RelatedArtists({
        properties: Properties,
        ajaxer: this.ajaxer
    });

    this.imageflow = new sockso.ImageFlow({
        ajaxer: this.ajaxer
    });

    this.folders = new sockso.FolderBrowsing( this.player, this.playlist );

};

/**
 * Initializes global sockso stuff in the page layout
 *
 */
sockso.Page.prototype.initLayout = function() {

    /**
     *  does init for the "bold" skin
     *
     */

    function initBoldSkin() {

        $( '#header' ).corner( 'top' );
        $( '#footer' ).corner( 'bottom' );
        $( '#sidebar' ).corner();
        $( '#login-info' ).corner( 'bottom' );
        $( '#sidebar h2' ).corner( 'top' );

    }

    // add confirmation to logout link

    $( 'a#logoutLink' ).click(function() {
        return confirm( Locale.getString('www.text.confirmLogout') );
    });

    // add confirmation to scrobble log link

    $( 'a#scrobbleLogLink' ).click(function() {
        return confirm( Locale.getString('www.text.confirmScrobbleLog') );
    });

    // check skin to see if we need to do any init

    var skin = Properties.get( 'www.skin', 'original' );
    if ( skin === 'bold' ) {
        initBoldSkin();
    }

    this.ajaxer.init();

    // create the search box

    this.search.init( '#nav' );

    // create the player selection control
    // needs to be accessed globally

    this.player.init( '#nav' );

    // create playlist control

    this.playlist.init();
    this.playlist.load();
    this.playlist.refresh();

    // Admin console

    this.console.init();

    // global objects

    window.player = this.player;
    window.playlist = this.playlist;

};

/**
 * Initializes things in the #content area
 * 
 */
sockso.Page.prototype.initContent = function() {

    this.uploadForm.init();

    // Related/similair artists

    this.related.init();

    // Sharing links

    $( '.share-music' ).each(function() {
        var popup = new sockso.Sharer( $(this) );
        popup.init();
        popup.addStandardLinks();

    });

    // Imageflow

    if ( Properties.get("www.imageflow.disable") !== 'yes' && Properties.get("www.covers.disable") !== 'yes' ) {
        this.imageflow.init();
    }

    // Folder browsing

    this.folders.init();

};

/**
 *  Creates a control for selecting the type of player to use to play music,
 *  and a play() method for getting the selected player to activate and
 *  play the music.
 *
 *  var player = new sockso.Player();
 *  player.init( '#nav' );
 *  player.play( 'tr123' );
 *
 */

sockso.Player = function( options ) {

    options = options || {};

    var self = this;
    var session = options.session;
    var playType = null;
    var playOptions = null;
    var PLAY_COOKIE = 'play-type';

    this.PLAY_FLASH_POPUP = 'flash';
    this.PLAY_FLASH_EMBED = 'flash-embed';
    this.PLAY_FLEX = 'flash-flex';
    this.PLAY_M3U = 'm3u';
    this.PLAY_XSPF = 'xspf';
    this.PLAY_PLS = 'pls';
    this.PLAY_HTML5PLAYER = 'html5';

    /**
     *  creates a play option element
     *
     */

    function createPlayOption( playType, text ) {

        return $( '<option></option>' )
            .append( text )
            .attr({ value: playType });

    }

    /**
     *  sets the play type the user wants to use
     *
     */

    this.setPlayType = function( newPlayType ) {
        
        self.playType = ( newPlayType === null || newPlayType === undefined || newPlayType === 'null' )
            ? self.PLAY_FLASH_POPUP
            : newPlayType;

        $( 'option', playOptions )
            .attr({ selected: false })
            .filter( "option[value='" +self.playType+ "']" )
            .attr({ selected: true });

        session.set( PLAY_COOKIE, self.playType );

    };

    /**
     *  Use the embedded XSPF player
     *
     *  @param playUrl
     *  @param trackFilter
     *
     */
    
    this.playFlashEmbed = function( playUrl, trackFilter ) {

        var xspfUrl = Properties.getUrl('/file/flash/xspf_player.swf' +
            '?playlist_url=' + escape(Properties.getUrl('/xspf/' +playUrl + trackFilter))+
            '&autoplay=1');
        var toggle = $( '<a></a>' )
                            .html( '-' )
                            .click(function() {
                                var newText = '-';
                                var newHeight = 150;
                                if ( toggle.html() == '-' ) {
                                    newText = '+';
                                    newHeight = 15;
                                }
                                toggle.html( newText )
                                $( '#flash-player object' )
                                    .attr( 'height', newHeight );
                            });

        $( '#flash-player' )
            .empty()
            .append( toggle )
            .append($(
                '<object type="application/x-shockwave-flash" width="400" height="150" data="' + xspfUrl +'">' +
                    '<param name="movie" value="' +xspfUrl+ '" />' +
                '</object>'
            ))
            .fadeIn();

    };

    /**
     *  Plays using the HTML 5 Player
     *
     *  @param playUrl
     *
     */
    this.playHtml5Player = function( playUrl ) {

        var w = window.open( '', 'PlayerWin', 'width=590,height=310,toolbars=no' );
        
        // load window first time
        if ( !options.jspAllowReload || w.location.href == 'about:blank' ) {
            w.location.href = Properties.getUrl('/player/html5/' +playUrl);
        }
        // reload contents dynamically
        else {
            w.html5player_reload( playUrl );
        }
        
        w.focus();

    };

    /**
     *  Plays using the popup flash/flex player
     *
     *  @param playUrl
     *
     */
    
    this.playFlashPopup = function( playUrl ) {

        // default with and height for xspf player
        var width = 410;
        var height = 180;
        // adjust dimensions for different players...
        if ( self.playType == self.PLAY_FLEX ) {
            width = 610;
            height = 310;
            playUrl += '&player=flexPlayer';
        }
        // now we can open the window...
        var w = window.open( Properties.getUrl('/player/xspf/' + playUrl), 'PlayerWin', 'width=' +width+ ',height=' +height+ ',toolbars=no' );
        w.focus();

    };

    /**
     *  plays a track/artist/etc with the correct play type the user is using
     *
     */

    this.play = function( playUrl, extraArgs, options ) {

        if ( !options ) options = {};

        playUrl += "?" + ( extraArgs != undefined && extraArgs != null ? extraArgs : '' );

        var trackFilter = ( Properties.get('www.flashPlayer.dontFilterMp3s') == 'yes' )
                              ? '' : '&trackType=mp3';

        switch ( self.playType ) {

            case self.PLAY_PLS:
            case self.PLAY_M3U:
            case self.PLAY_XSPF:
                location.href = Properties.getUrl(self.playType+ '/' + playUrl);
                break;

            case self.PLAY_FLASH_EMBED:
                this.playFlashEmbed( playUrl, trackFilter );
                break;
                
            case self.PLAY_HTML5PLAYER:
            	this.playHtml5Player( playUrl );
            	break;

            case self.PLAY_FLEX:
            case self.PLAY_FLASH_POPUP:
            default:
                this.playFlashPopup( playUrl );
                break;

        }

    };

    /**
     *  initializes the player selection box
     *
     */

    this.init = function( parentId ) {

        playOptions = $( '<select></select>' )
                        .addClass( 'play-options' )
                        .append( createPlayOption(self.PLAY_FLASH_EMBED,'Embedded Flash Player') )
                        .append( createPlayOption(self.PLAY_FLASH_POPUP,'Popup Flash Player') )
                        .append( createPlayOption(self.PLAY_FLEX,'Flex Player') )
                        .append( createPlayOption(self.PLAY_M3U,'M3U (iTunes,WMP,etc...)') )
                        .append( createPlayOption(self.PLAY_PLS,'Pls (Winamp,Shoutcast,etc...)') )
                        .append( createPlayOption(self.PLAY_XSPF,'XSPF') )
                        .append( createPlayOption(self.PLAY_HTML5PLAYER,'HTML 5 Player') );

        $( parentId ).append(
            $( '<div></div>' )
                .attr( 'id', 'play-options' )
                .append( 'Play using: ' )
                .change(function() {
                    self.setPlayType( playOptions.val() );
                })
                .append( playOptions )
            );

        $( '<div></div>')
            .attr({ id: 'flash-player' })
            .appendTo( $('body') )
            .hide();

        session.get( PLAY_COOKIE, function(playType) {
            self.setPlayType( playType );
        });

    };

};

// strings used to keep our cookie data apart
var SPLIT_PLITEM = '_:__:_';
var SPLIT_PLVARS = ':_::_:';

/**
 *  saves a playlist
 *
 */
 
function savePlaylist( options ) {

    options = options || {};

    var url = options.url || getPlaylistAsUrl();

    if ( url == '' )
        alert( Locale.getString('www.error.nothingToPlay') );

    else {
    
        var trackCount = $( '#PlaylistContents .playlistItem' ).length;
        var name = prompt( Locale.getString('www.confirm.playlistName') );
        if ( name == '' || name == null ) return;

        $.ajax({
            url: Properties.getUrl('/json/savePlaylist/' + encodeURIComponent(name) + '/'+url),
            success: function( responseText ) {
                eval( 'var result = ' + responseText );
                if ( result.match(/^\d+$/) ) {

                    var li = sockso.util.getMusicElement(
                        new MusicItem('pl'+result,name), true
                    );

                    // need to add number of tracks in playlist, and
                    // a delete link to the list item
                    li.attr({ id: 'userPlaylist' +result })
                        .append( ' by <b>you</b> (' +trackCount+ ' tracks)' )
                        .append( $('<a/>')
                                  .attr({ href: 'javascript:;' })
                                  .addClass( 'delete' )
                                  .click(function(){ deletePlaylist(result); })
                                  .append( ' ' )
                                  .append( $('<img/>').attr({ src: Properties.getUrl('<skin>/images/remove.png') }))
                        )
                        .css({ display: 'none' });

                    // clear any empty item, then add the new one
                    $( '#userPlaylists li.empty' )
                        .remove();
                    $( '#userPlaylists' )
                        .append( li );
                    li.fadeIn();

                }
                else
                    alert( 'Error: ' + result );
            }
        });

    }
    
}

/**
 *  the user has asked to delete one of their saved playlists
 * 
 *  @param playlistId
 *   
 */

function deletePlaylist( playlistId ) {
    
    if ( confirm(Locale.getString("www.confirm.deletePlaylist")) ) {
        
        $.ajax({
            url: Properties.getUrl('/json/deletePlaylist/' +playlistId),
            success: deletePlaylistHandler
        });

    }
    
}

/**
 *  handles the return of the call to delete a playlist
 *  
 *  @param result
 *  
 */

function deletePlaylistHandler( result ) {

    eval( 'result = ' +result );
    if ( result.match(/^\d+$/) ) {

        // fadeOut the item, then remove it
        $( '#userPlaylist' +result )
          .fadeOut(function(){

              $( this ).remove();

              // if it's now empty, add an empty marker item
              if ( $('#userPlaylists li').length == 0 ) {
                  $( '#userPlaylists' ).append(
                      $( '<li/>' )
                        .addClass( 'empty' )
                        .html( Locale.getString("www.text.noResults") )
                  );
              }

          });

    }

}

/**
 *  A playlist control that can be added to/downloaded/played/etc...  Just give it
 *  the ID of the parent element to attach itself to.
 *
 *  The 'player' parameter should be the sockso.Player object used for playing music
 *  
 *  @param options
 *  
 */

sockso.Playlist = function( options ) {

    var self = new sockso.Base( options ),
        parentId = options.parentId,
        player = options.player,
        session = options.session,
        ajaxer = options.ajaxer,
        items = [],
        contents = null,
        empty = null,
        nextPlaylistId = 0,
        sharer = null;

    /**
     *  Adds an item to the playlist and draws it on the page
     *  
     *  @param item
     *  
     */

    self.add = function( item ) {

        item.playlistId = nextPlaylistId++;
        items.push( item );

        if ( contents ) {
            empty.remove();
            var elem = self.getMusicElement( item ).hide();
            ajaxer.attach( elem );
            contents.append( elem );
            elem.fadeIn( 'slow' );
        }

        self.save();

    };

    /**
     *  Returns a DOM element for the music item
     *  
     *  @return jQuery
     *  
     */

    self.getMusicElement = function( item ) {

        var element = sockso.util.getMusicElement( item, false );

        return element;

    };

    /**
     *  Removes an item from the playlist using the specified playlist id
     *  
     *  @param playlistId
     *
     */

    self.remove = function( playlistId ) {

        $.each( items, function(i,item) {
            if ( item.playlistId == playlistId ) {
                items.splice( i, 1 );
                return false;
            }
        });

        $( '#playlist-item-' + playlistId )
            .slideUp( 'slow', function() {
                if ( items.length == 0 ) {
                    self.showEmpty();
                }
            });

        self.save();

    };

    /**
     *  Clears the playlist of items
     *
     */

    self.clear = function() {

        items = [];
        $( 'li', contents )
            .slideUp(function() {
                contents.empty();
                self.showEmpty();
            });

        self.save();

    };

    /**
     *  Sets the items in the playlist (no redraw is done)
     *  
     *  @param newItems
     *  
     */

    self.setItems = function( newItems ) {

        self.clear();

        $.each( newItems, function(i,item) {
            self.add( item );
        });

    };

    /**
     *  Returns the items currently in the playlist
     *
     *  @return array
     *
     */

    self.getItems = function() {

        return items;

    };

    /**
     *  Downloads the items from the playlist
     *  
     */

    self.download = function() {

        var url = self.getAsUrl();

        if ( url == '' ) {
            alert( Locale.getString('www.error.nothingToDownload') );
        }
        else {
            location.href = Properties.getUrl('/download/' + url);
        }

    };

    /**
     *  Plays the playlist with the configured player
     *  
     */

    self.play = function() {

        player.play( self.getAsUrl() );

    };

    /**
     *  Opens a popup with some code to embed a player with this playlist
     *  
     */

    self.share = function( evt ) {

        if ( !sharer ) {
            sharer = new sockso.Sharer( $(evt.target) );
            sharer.init();
            sharer.addStandardLinks();
        }
        
        sharer.setData( self.getAsUrl() );
        sharer.show();

    };

    /**
     *  Returns a string of all the playlist items that can be used in a URL
     *  back to Sockso, eg. '/tr123/ar456/al789'
     *
     *  @return String
     *
     */

    self.getAsUrl = function() {

        var url = '';

        for ( var i=0; i<items.length; i++ )
            url += '/' + items[ i ].id;

        return url.substring( 1 );

    };

    /**
     *  Loads the playlist from the users session
     *
     *  @param onLoad Function
     *
     */

    self.load = function( onLoad ) {

        session.get( 'playlist', function(data) {
            
            if ( data ) {
                var sessionItems = data.split( SPLIT_PLITEM );
                for ( var i=0; i<sessionItems.length; i++ ) {
                    var item = sessionItems[ i ];
                    var parts = item.split( SPLIT_PLVARS );
                    if ( parts.length == 3 ) {
                        items.push( new sockso.MusicItem(parts[0],parts[1],parts[2]) );
                    }
                }
            }

            if ( onLoad ) { onLoad(); }

        });

    };

    /**
     *  Saves the playlist to the session
     *  
     */

    self.save = function() {

        var data = '';

        for ( var i=0; i<items.length; i++ ) {
            var item = items[ i ];
            var s = item.id + SPLIT_PLVARS + item.name + SPLIT_PLVARS + item.playlistId;
            data += ( data == '' ? s : SPLIT_PLITEM + s );
        }

        session.set( 'playlist', data );

    };

    /**
     *  Shows the empty playlist item
     *
     */

    self.showEmpty = function() {

        empty.slideUp();
        contents.append( empty );
        empty.slideDown( 'slow' );

    };

    /**
     *  Does a complete refresh of the playlist contents.  Clears all the nodes
     *  that have been drawn then adds them again.
     *  
     */

    self.refresh = function() {

        contents.empty();

        if ( items.length == 0 ) {
            self.showEmpty();
        }
        
        else {
            $.each( items, function(i,item) {
                var elem = self.getMusicElement( item );
                ajaxer.attach( elem );
                contents.append( elem );
            });
        }

    };

    /**
     *  Initialized the control on the page, creating elements, etc...
     *  
     */

    self.init = function() {

        var skin = Properties.get( 'www.skin', 'original' );

        function makeLink( action, callback ) {

            callback = callback || self[ action ];
            
            var localeKey = 'www.link.' + action;

            return $( '<a></a>' )
                    .addClass( action )
                    .html( Locale.getString(localeKey) )
                    .attr({ href: 'javascript:;' })
                    .click( callback );

        }

        var heading = $( '<h2></h2>' )
                            .addClass( 'bg2' )
                            .html( Locale.getString('www.title.playlist') );

        var stdControls = $( '<div></div>' )
                            .addClass( 'controls' )
                            .append( makeLink('clear') )
                            .append( makeLink('play') );

        if ( Properties.get('www.disableDownloads') != 'yes' ) {
            stdControls.append( makeLink('download') );
        }

        stdControls.append( makeLink('share') );

        empty = $( '<li></li>' )
                .append( Locale.getString('www.text.emptyPlaylist',[skin]) );

        contents = $( '<ul></ul>' )
                        .addClass( 'contents' )
                        .append( empty );

        var div = $( '#' +parentId );

        div.empty()
            .addClass( 'playlist' )
            .append( heading )
            .append( stdControls )
            .append( contents );

        var user = self.getUser();

        if ( user != null ) {
            div.append(
                $( '<div></div>' )
                    .addClass( 'controls user-controls' )
                    .append( makeLink('save',function() {
                        savePlaylist({
                            url: self.getAsUrl()
                        });
                    }))
            );
        }

    };

    return self;

};

/**
 *  Allows access to key/value based properties
 *
 *  example:
 *  var p = new sockso.Properties();
 *  p.set( 'foo', 'bar' );
 *  p.get( 'baz' );
 *  p.get( 'something', 'default value' );
 *
 */

sockso.Properties = sockso.Hashtable;

/**
 *  Fetches a url with base path and skin resolved
 *
 *  @param url
 *
 *  @return String
 *
 */

sockso.Properties.prototype.getUrl = function(url) {
    
    var basepath = this.get("server.basepath","/");

    if ( url.startsWith("http://") || url.startsWith("https://") ) {
        return url;
    }
    
    if ( url.startsWith("/") ) {
        url = url.substring(1);
    }

    if ( url.startsWith("<skin>/") ) {
        url = url.replace("<skin>", "file/skins/"+this.get("www.skin", "original" ));
    }
    
    if ( !basepath.endsWith("/") ) {
        basepath += "/";
    }

    if ( !basepath.startsWith("/") && !basepath.startsWith("http://") && !basepath.startsWith("https://") ) {
        basepath = "/" + basepath;
    }

    return basepath + url;

};

sockso.RelatedArtists = function( options ) {

    var self = new sockso.Base( options );
    var properties = options.properties;
    var currentRequest = null;

    /**
     * Runs the widget
     *
     */
    self.init = function() {

        if ( self.isEnabled() ) {

            $.each( self.getArtistIds(), function(i,artistId) {
                self.getRelatedArtists( artistId, function(relatedArtists) {
                    self.updateArtist( artistId, relatedArtists );
                });
            });

        }

    };

    /**
     * loads similar artists, and executes the callback when done
     *
     * @param artistId
     * @param callback
     */
    self.getRelatedArtists = function( artistId, callback ) {

        if ( currentRequest ) {
            currentRequest.abort();
        }

        currentRequest = $.ajax({
            type: 'GET',
            url: Properties.getUrl('/json/similarArtists/' +artistId),
            success: function( responseText ) {
                currentRequest = null;
                var artists = null;
                eval( 'artists = ' +responseText );
                callback( artists );
            }
        });

    };

    /**
     * Updates the artist with the array of related artists
     *
     * @param artistId
     * @param relatedArtists Array
     */
    self.updateArtist = function( artistId, relatedArtists ) {

        var list = $( '<ul></ul>' );

        $.each( relatedArtists, function(i,related) {

            var relatedId = related.id.substring(2);

            $( '<li/>' )
               .addClass( 'related-artist related-artist-' +relatedId )
               .append(
                   $( '<a/>' )
                       .attr({ href: Properties.getUrl('/browse/artist/' +relatedId) })
                       .html( related.name )
               )
               .appendTo( list );

        });

        $( '.artist-' +artistId )
            .empty()
            .append( list );

        options.ajaxer.attach( list );

        self.addPlayLink( list, relatedArtists );

    };

    /**
     *  Adds a link which allows playing all related artists
     *
     *  @param list
     *  @param relatedArtists
     */
    self.addPlayLink = function( list, relatedArtists ) {

        if ( relatedArtists.length == 0 ) return;

        var url = '';
        var img = $( '<img></img>' )
                        .attr({ src: Properties.getUrl('/<skin>/images/play.png') });

        $.each( relatedArtists, function(i,related) {
            url += related.id + '/';
        });

        var link = $( '<a></a>' )
            .addClass( 'play-related' )
            .attr({
                href: 'javascript:player.play("' +url+ '","orderBy=random");',
                title: 'Play similar artists'
            })
            .append( img );

        $( '<li></li>' )
            .append( link )
            .prependTo( list );

    };

    /**
     * Returns an array of the artist IDs found on the page
     *
     * @return Array
     */
    self.getArtistIds = function() {

        var found = {};
        var ids = [];

        $( '.related' ).each(function(){

            var classes = $( this ).attr('class').split( ' ' );

            for ( var i=0; i<classes.length; i++ ) {
                var name = classes[ i ];
                var info = name.match( /artist-(\d+)/ );
                if ( info ) {
                    var id = info[ 1 ];
                    if ( !found[id] ) {
                        ids.push( id );
                        found[ id ] = true;
                    }
                }
            }

        });

        return ids;

    };

    /**
     * Indicates if the related artist functionality is enabled or not
     *
     * @return boolean
     */
    self.isEnabled = function() {

        return properties.get( 'www.similarArtists.disable' ) != 'yes';

    };

    return self;

};

/**
 *  An input box which will search the collection and display the results
 *  below it in a drop down list
 *
 *  var search = new sockso.SearchBox();
 *  search.init( '#parentElement' );
 *
 */

sockso.SearchBox = function( options ) {

    var self = this;
    var results = null;
    var input = null;
    var searchInputTimeoutId = null;
    var keepFocusTimeoutId = null;
    var ajaxer = options.ajaxer;

    var onInputKeyUp = function() {

        // wait till there's a pause in typing before doing the search
        if ( searchInputTimeoutId != null ) {
            clearTimeout( searchInputTimeoutId );
        }

        searchInputTimeoutId = setTimeout( function() {
            self.makeQuery( input.attr('value') );
        }, '1000' );

    };

    var onInputBlur = function() {

        keepFocusTimeoutId = setTimeout(function() {
            results.hide();
        }, 500 );

    };

    var onInputFocus = function() {

        // if there's something in the search field, and we have results...
        if ( $(this).attr('value') != undefined && $('li',results).length > 0 ) {
            results.show();
        }

    };

    /**
     *  initiates the query for whatever is in the search input field
     *
     */

    this.makeQuery = function( query ) {

        if ( query == undefined || query == '' )
            results.hide();

        else {
            $.getJSON(
                Properties.getUrl('/json/search/' + encodeURIComponent(query)),
                {},
                function( data ) {
                    self.showResults( data );
                }
            );
        }

    };

    /**
     *  Makes a MusicItem object from a result object
     * 
     *  @return MusicItem
     *  
     */
    
    this.makeMusicItem = function( item ) {

        return new MusicItem(
            item.id,
            item.name
        );
        
    };

    /**
     *  updates the search results with those specified and then
     *  shows the search drop-down box
     *
     */

    this.showResults = function( items ) {

        results.empty();

        if ( items.length > 0 ) {
            for ( var i=0; i<items.length; i++ ) {
                var item = this.makeMusicItem( items[i] );
                results.append( sockso.util.getMusicElement(item,true) );
            }
        }

        else {
            $( '<li></li>' )
                .append( 'Nothing found sorry...' )
                .appendTo( results );
        }

        // show element
        results.show();

        ajaxer.attach( results );

    };

    /**
     *  Takes a parent ID to attach the search box functionality to and
     *  creates all the required elements, etc...
     *
     *  @param parentId
     *
     */

    this.init = function( parentId ) {

        input = $( '<input type="text" />' )
                        .addClass( 'input search-input' )
                        .attr({ id: 'search-input' }) // @TODO move to class css
                        .appendTo( parentId );
        var pos = input.offset();

        results = $( '<ul></ul>' )
                        .css({
                            top: (pos.top + 13) + 'px',
                            left: pos.left + 'px'
                        })
                        .addClass( 'search-results' )
                        .attr({ id: 'search-results' }) // @TODO - move to class css
                        .hide()
                        .click(function() {
                            // if there's a timeout waiting to hide the results,
                            // then we want to clear it.
                            if ( keepFocusTimeoutId != null ) {
                                clearTimeout( keepFocusTimeoutId );
                            }
                            input.focus();
                        })
                        .appendTo( 'body' );

        // add handlers to search input

        input.keyup( onInputKeyUp )
             .blur( onInputBlur )
             .focus( onInputFocus );

    };

};

/**
 *  Allows storing name/value pairs in the users session via persistsjs.
 *
 *  var sess = new sockso.Session();
 *
 *  sess.get( 'name', function(data) { ... } );
 *  sess.set( 'name', 'value' );
 *
 */

sockso.Session = function() {

    var store = new Persist.Store( 'Sockso' );

    /**
     *  Sets a named piece of information in the users session
     *  
     *  @param key
     *  @param value
     *  
     */

    this.set = function( key, value ) {

        store.set( key, value );

    };

    /**
     *  Tried to fetch a named value from the users session.  If the value is
     *  not found then null is returned.
     *
     *  @return String
     *
     */

    this.get = function( key, callback ) {

        return store.get( key, function(ok,data) {
            callback( data );
        });

    };

};

/**
 * Adds a popup menu to links for sharing music
 *
 * @param source jQuery
 */
sockso.Sharer = function( source ) {

    this.source = source;
    this.data = null;
    this.elem = null;
    this.timeout = null;

};

/**
 * Initialise the link to share some music
 *
 */
sockso.Sharer.prototype.init = function() {

    // check not needed as source needs to be provided?
    if ( this.source ) {
        this.source.click( this.show.bind(this) );
        this.setDataFromClasses( this.source.attr('class') );
    }

    this.elem = $( '<div></div>' )
        .addClass( 'popup' )
        .appendTo( 'body' )
        .hide();

};

/**
 * Tries to set the data property from a class on the source element
 *
 * @param classes String
 */
sockso.Sharer.prototype.setDataFromClasses = function( classes ) {

    var parts = classes.split( /\s+/ );
    
    for ( var i=0; i<parts.length; i++ ) {
        var part = parts[i];
        var matches = part.match( /share-music-(\w+\d+)/ );
        if ( matches ) {
            this.setData( matches[1] );
        }
    }

};

/**
 * Sets the share data (eg. tr123)
 *
 * @param data String
 */
sockso.Sharer.prototype.setData = function( data ) {
    
    this.data = data;
    
};

/**
 * Returns the current share data (eg. tr123)
 *
 * @return String
 */
sockso.Sharer.prototype.getData = function() {
    
    return this.data;
    
};

/**
 * Adds a link to the share popup
 *
 * @param text String
 * @param icon String
 * @param onClick Function
 */
sockso.Sharer.prototype.add = function( text, icon, onClick ) {

    var self = this;

    $( '<a></a>' )
        .attr( 'href', 'javascript:;' )
        .click(function() { self.hide(); onClick(); return false; })
        .mouseover( this.cancelHide.bind(this) )
        .mouseout( this.setHideDelay.bind(this) )
        .append( $('<img />').attr('src',Properties.getUrl('<skin>/images/' + icon)) )
        .append( text )
        .appendTo( this.elem );

};

/**
 * Adds standard links to this share popup
 *
 */
sockso.Sharer.prototype.addStandardLinks = function() {

    this.add( 'Show HTML code for player', 'embed.png', this.onShowHtml.bind(this) );

//    this.add( 'Add to Streamfinder', 'streamfinder.png', function() {
//        var url = '';
//        alert( 'URL: ' + url );
//    });

};

/**
 * Handler for showing HTML code to share music
 *
 */
sockso.Sharer.prototype.onShowHtml = function() {

    var w = window.open(
        Properties.getUrl('/share/' + this.getData()),
        'ShareWindow',
        'width=500,height=250,toolbars=no'
    );

    w.focus();

};

/**
 * Show the share popup from the source element
 *
 */
sockso.Sharer.prototype.show = function() {

    var pos = this.source.position();
    this.elem.css({
        top: (pos.top + 10) + 'px',
        left: pos.left + 'px'
    })
    .show();

    this.setHideDelay();

};

/**
 * Hide the share popup
 *
 */
sockso.Sharer.prototype.hide = function() {

    this.elem.fadeOut( 'slow' );

};

/**
 * Cancel any timeout that has been set to hide the element
 *
 */
sockso.Sharer.prototype.cancelHide = function() {

    if ( this.timeout != null ) {
        clearTimeout( this.timeout );
    }

};

/**
 * Set up a small timeout to hide the share popup
 *
 */
sockso.Sharer.prototype.setHideDelay = function( delay ) {

    this.cancelHide();

    this.timeout = setTimeout(
        this.hide.bind(this),
        1000
    );

};

/**
 *  Allows adding validation to an upload form
 * 
 *  var form = new sockso.UploadForm( 'formId' );
 *  form.init();
 *   
 */

sockso.UploadForm = function( formId ) {

    var self = this;

    /**
     *  An error has occurred, do something
     *
     *  @param message
     *
     */

    self.error = function( message ) {

        alert( message );

    };

    /**
     *  validates the upload form to make sure all is ok
     *
     *  @return boolean true if all ok, false otherwise
     *
     */

    self.validate = function() {

        var isValid = true;

        // check required fields
        $( '#' +formId+ ' input[type=text]' ).each(function(i,oField) {
            if ( isValid && oField.value == '' ) {
                self.error( 'You missed a field' );
                isValid = false;
                return false;
            }
        });

        return isValid;

    };

    /**
     *  Initializes the form with validation
     *  
     */

    self.init = function() {

        $( '#uploadForm :input[type=submit]' )
            .click( self.validate );

    };

    return self;

};

sockso.User = function( options ) {

    var self = new sockso.Base( options );
    var id = options.id;
    var name = options.name;

    /**
     *  Returns the users id
     *  
     *  @return int
     *  
     */

    self.getId = function() {
        
        return id;

    };

    /**
     *  Returns the users name
     *  
     *  @return String
     *  
     */

    self.getName = function() {
        
        return name;

    };

    return self;

};
/***
 * SWFObject v1.5: Flash Player detection and embed - http://blog.deconcept.com/swfobject/
 *
 * SWFObject is (c) 2007 Geoff Stearns and is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */
if(typeof deconcept=="undefined"){var deconcept=new Object();}if(typeof deconcept.util=="undefined"){deconcept.util=new Object();}if(typeof deconcept.SWFObjectUtil=="undefined"){deconcept.SWFObjectUtil=new Object();}deconcept.SWFObject=function(_1,id,w,h,_5,c,_7,_8,_9,_a){if(!document.getElementById){return;}this.DETECT_KEY=_a?_a:"detectflash";this.skipDetect=deconcept.util.getRequestParameter(this.DETECT_KEY);this.params=new Object();this.variables=new Object();this.attributes=new Array();if(_1){this.setAttribute("swf",_1);}if(id){this.setAttribute("id",id);}if(w){this.setAttribute("width",w);}if(h){this.setAttribute("height",h);}if(_5){this.setAttribute("version",new deconcept.PlayerVersion(_5.toString().split(".")));}this.installedVer=deconcept.SWFObjectUtil.getPlayerVersion();if(!window.opera&&document.all&&this.installedVer.major>7){deconcept.SWFObject.doPrepUnload=true;}if(c){this.addParam("bgcolor",c);}var q=_7?_7:"high";this.addParam("quality",q);this.setAttribute("useExpressInstall",false);this.setAttribute("doExpressInstall",false);var _c=(_8)?_8:window.location;this.setAttribute("xiRedirectUrl",_c);this.setAttribute("redirectUrl","");if(_9){this.setAttribute("redirectUrl",_9);}};deconcept.SWFObject.prototype={useExpressInstall:function(_d){this.xiSWFPath=!_d?"expressinstall.swf":_d;this.setAttribute("useExpressInstall",true);},setAttribute:function(_e,_f){this.attributes[_e]=_f;},getAttribute:function(_10){return this.attributes[_10];},addParam:function(_11,_12){this.params[_11]=_12;},getParams:function(){return this.params;},addVariable:function(_13,_14){this.variables[_13]=_14;},getVariable:function(_15){return this.variables[_15];},getVariables:function(){return this.variables;},getVariablePairs:function(){var _16=new Array();var key;var _18=this.getVariables();for(key in _18){_16[_16.length]=key+"="+_18[key];}return _16;},getSWFHTML:function(){var _19="";if(navigator.plugins&&navigator.mimeTypes&&navigator.mimeTypes.length){if(this.getAttribute("doExpressInstall")){this.addVariable("MMplayerType","PlugIn");this.setAttribute("swf",this.xiSWFPath);}_19="<embed type=\"application/x-shockwave-flash\" src=\""+this.getAttribute("swf")+"\" width=\""+this.getAttribute("width")+"\" height=\""+this.getAttribute("height")+"\" style=\""+this.getAttribute("style")+"\"";_19+=" id=\""+this.getAttribute("id")+"\" name=\""+this.getAttribute("id")+"\" ";var _1a=this.getParams();for(var key in _1a){_19+=[key]+"=\""+_1a[key]+"\" ";}var _1c=this.getVariablePairs().join("&");if(_1c.length>0){_19+="flashvars=\""+_1c+"\"";}_19+="/>";}else{if(this.getAttribute("doExpressInstall")){this.addVariable("MMplayerType","ActiveX");this.setAttribute("swf",this.xiSWFPath);}_19="<object id=\""+this.getAttribute("id")+"\" classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" width=\""+this.getAttribute("width")+"\" height=\""+this.getAttribute("height")+"\" style=\""+this.getAttribute("style")+"\">";_19+="<param name=\"movie\" value=\""+this.getAttribute("swf")+"\" />";var _1d=this.getParams();for(var key in _1d){_19+="<param name=\""+key+"\" value=\""+_1d[key]+"\" />";}var _1f=this.getVariablePairs().join("&");if(_1f.length>0){_19+="<param name=\"flashvars\" value=\""+_1f+"\" />";}_19+="</object>";}return _19;},write:function(_20){if(this.getAttribute("useExpressInstall")){var _21=new deconcept.PlayerVersion([6,0,65]);if(this.installedVer.versionIsValid(_21)&&!this.installedVer.versionIsValid(this.getAttribute("version"))){this.setAttribute("doExpressInstall",true);this.addVariable("MMredirectURL",escape(this.getAttribute("xiRedirectUrl")));document.title=document.title.slice(0,47)+" - Flash Player Installation";this.addVariable("MMdoctitle",document.title);}}if(this.skipDetect||this.getAttribute("doExpressInstall")||this.installedVer.versionIsValid(this.getAttribute("version"))){var n=(typeof _20=="string")?document.getElementById(_20):_20;n.innerHTML=this.getSWFHTML();return true;}else{if(this.getAttribute("redirectUrl")!=""){document.location.replace(this.getAttribute("redirectUrl"));}}return false;}};deconcept.SWFObjectUtil.getPlayerVersion=function(){var _23=new deconcept.PlayerVersion([0,0,0]);if(navigator.plugins&&navigator.mimeTypes.length){var x=navigator.plugins["Shockwave Flash"];if(x&&x.description){_23=new deconcept.PlayerVersion(x.description.replace(/([a-zA-Z]|\s)+/,"").replace(/(\s+r|\s+b[0-9]+)/,".").split("."));}}else{if(navigator.userAgent&&navigator.userAgent.indexOf("Windows CE")>=0){var axo=1;var _26=3;while(axo){try{_26++;axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+_26);_23=new deconcept.PlayerVersion([_26,0,0]);}catch(e){axo=null;}}}else{try{var axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");}catch(e){try{var axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");_23=new deconcept.PlayerVersion([6,0,21]);axo.AllowScriptAccess="always";}catch(e){if(_23.major==6){return _23;}}try{axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");}catch(e){}}if(axo!=null){_23=new deconcept.PlayerVersion(axo.GetVariable("$version").split(" ")[1].split(","));}}}return _23;};deconcept.PlayerVersion=function(_29){this.major=_29[0]!=null?parseInt(_29[0]):0;this.minor=_29[1]!=null?parseInt(_29[1]):0;this.rev=_29[2]!=null?parseInt(_29[2]):0;};deconcept.PlayerVersion.prototype.versionIsValid=function(fv){if(this.major<fv.major){return false;}if(this.major>fv.major){return true;}if(this.minor<fv.minor){return false;}if(this.minor>fv.minor){return true;}if(this.rev<fv.rev){return false;}return true;};deconcept.util={getRequestParameter:function(_2b){var q=document.location.search||document.location.hash;if(_2b==null){return q;}if(q){var _2d=q.substring(1).split("&");for(var i=0;i<_2d.length;i++){if(_2d[i].substring(0,_2d[i].indexOf("="))==_2b){return _2d[i].substring((_2d[i].indexOf("=")+1));}}}return "";}};deconcept.SWFObjectUtil.cleanupSWFs=function(){var _2f=document.getElementsByTagName("OBJECT");for(var i=_2f.length-1;i>=0;i--){_2f[i].style.display="none";for(var x in _2f[i]){if(typeof _2f[i][x]=="function"){_2f[i][x]=function(){};}}}};if(deconcept.SWFObject.doPrepUnload){if(!deconcept.unloadSet){deconcept.SWFObjectUtil.prepUnload=function(){__flash_unloadHandler=function(){};__flash_savedUnloadHandler=function(){};window.attachEvent("onunload",deconcept.SWFObjectUtil.cleanupSWFs);};window.attachEvent("onbeforeunload",deconcept.SWFObjectUtil.prepUnload);deconcept.unloadSet=true;}}if(!document.getElementById&&document.all){document.getElementById=function(id){return document.all[id];};}var getQueryParamValue=deconcept.util.getRequestParameter;var FlashObject=deconcept.SWFObject;var SWFObject=deconcept.SWFObject;
if ( !window.Properties ) {
    Properties = new sockso.Properties();
}

$(function() {

    var page = new sockso.Page();

    page.init();
    page.initLayout();
    page.initContent();

});
