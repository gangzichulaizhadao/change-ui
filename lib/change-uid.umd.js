(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["change-uid"] = factory();
	else
		root["change-uid"] = factory();
})((typeof self !== 'undefined' ? self : this), function() {
return /******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 34:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var isCallable = __webpack_require__(4901);

module.exports = function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};


/***/ }),

/***/ 81:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var call = __webpack_require__(9565);
var aCallable = __webpack_require__(9306);
var anObject = __webpack_require__(8551);
var tryToString = __webpack_require__(6823);
var getIteratorMethod = __webpack_require__(851);

var $TypeError = TypeError;

module.exports = function (argument, usingIterator) {
  var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
  if (aCallable(iteratorMethod)) return anObject(call(iteratorMethod, argument));
  throw new $TypeError(tryToString(argument) + ' is not iterable');
};


/***/ }),

/***/ 116:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


var $ = __webpack_require__(6518);
var iterate = __webpack_require__(2652);
var aCallable = __webpack_require__(9306);
var anObject = __webpack_require__(8551);
var getIteratorDirect = __webpack_require__(1767);

// `Iterator.prototype.find` method
// https://tc39.es/ecma262/#sec-iterator.prototype.find
$({ target: 'Iterator', proto: true, real: true }, {
  find: function find(predicate) {
    anObject(this);
    aCallable(predicate);
    var record = getIteratorDirect(this);
    var counter = 0;
    return iterate(record, function (value, stop) {
      if (predicate(value, counter++)) return stop(value);
    }, { IS_RECORD: true, INTERRUPTED: true }).result;
  }
});


/***/ }),

/***/ 283:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var uncurryThis = __webpack_require__(9504);
var fails = __webpack_require__(9039);
var isCallable = __webpack_require__(4901);
var hasOwn = __webpack_require__(9297);
var DESCRIPTORS = __webpack_require__(3724);
var CONFIGURABLE_FUNCTION_NAME = (__webpack_require__(350).CONFIGURABLE);
var inspectSource = __webpack_require__(3706);
var InternalStateModule = __webpack_require__(1181);

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var $String = String;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;
var stringSlice = uncurryThis(''.slice);
var replace = uncurryThis(''.replace);
var join = uncurryThis([].join);

var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
  return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
});

var TEMPLATE = String(String).split('String');

var makeBuiltIn = module.exports = function (value, name, options) {
  if (stringSlice($String(name), 0, 7) === 'Symbol(') {
    name = '[' + replace($String(name), /^Symbol\(([^)]*)\).*$/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
    if (DESCRIPTORS) defineProperty(value, 'name', { value: name, configurable: true });
    else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
    defineProperty(value, 'length', { value: options.arity });
  }
  try {
    if (options && hasOwn(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false });
    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) { /* empty */ }
  var state = enforceInternalState(value);
  if (!hasOwn(state, 'source')) {
    state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
  } return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn(function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
}, 'toString');


/***/ }),

/***/ 342:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/**
 * Resize detection strategy that injects objects to elements in order to detect resize events.
 * Heavily inspired by: http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/
 */



var browserDetector = __webpack_require__(5728);
module.exports = function (options) {
  options = options || {};
  var reporter = options.reporter;
  var batchProcessor = options.batchProcessor;
  var getState = options.stateHandler.getState;
  if (!reporter) {
    throw new Error("Missing required dependency: reporter.");
  }

  /**
   * Adds a resize event listener to the element.
   * @public
   * @param {element} element The element that should have the listener added.
   * @param {function} listener The listener callback to be called for each resize event of the element. The element will be given as a parameter to the listener callback.
   */
  function addListener(element, listener) {
    function listenerProxy() {
      listener(element);
    }
    if (browserDetector.isIE(8)) {
      //IE 8 does not support object, but supports the resize event directly on elements.
      getState(element).object = {
        proxy: listenerProxy
      };
      element.attachEvent("onresize", listenerProxy);
    } else {
      var object = getObject(element);
      if (!object) {
        throw new Error("Element is not detectable by this strategy.");
      }
      object.contentDocument.defaultView.addEventListener("resize", listenerProxy);
    }
  }
  function buildCssTextString(rules) {
    var seperator = options.important ? " !important; " : "; ";
    return (rules.join(seperator) + seperator).trim();
  }

  /**
   * Makes an element detectable and ready to be listened for resize events. Will call the callback when the element is ready to be listened for resize changes.
   * @private
   * @param {object} options Optional options object.
   * @param {element} element The element to make detectable
   * @param {function} callback The callback to be called when the element is ready to be listened for resize changes. Will be called with the element as first parameter.
   */
  function makeDetectable(options, element, callback) {
    if (!callback) {
      callback = element;
      element = options;
      options = null;
    }
    options = options || {};
    var debug = options.debug;
    function injectObject(element, callback) {
      var OBJECT_STYLE = buildCssTextString(["display: block", "position: absolute", "top: 0", "left: 0", "width: 100%", "height: 100%", "border: none", "padding: 0", "margin: 0", "opacity: 0", "z-index: -1000", "pointer-events: none"]);

      //The target element needs to be positioned (everything except static) so the absolute positioned object will be positioned relative to the target element.

      // Position altering may be performed directly or on object load, depending on if style resolution is possible directly or not.
      var positionCheckPerformed = false;

      // The element may not yet be attached to the DOM, and therefore the style object may be empty in some browsers.
      // Since the style object is a reference, it will be updated as soon as the element is attached to the DOM.
      var style = window.getComputedStyle(element);
      var width = element.offsetWidth;
      var height = element.offsetHeight;
      getState(element).startSize = {
        width: width,
        height: height
      };
      function mutateDom() {
        function alterPositionStyles() {
          if (style.position === "static") {
            element.style.setProperty("position", "relative", options.important ? "important" : "");
            var removeRelativeStyles = function (reporter, element, style, property) {
              function getNumericalValue(value) {
                return value.replace(/[^-\d\.]/g, "");
              }
              var value = style[property];
              if (value !== "auto" && getNumericalValue(value) !== "0") {
                reporter.warn("An element that is positioned static has style." + property + "=" + value + " which is ignored due to the static positioning. The element will need to be positioned relative, so the style." + property + " will be set to 0. Element: ", element);
                element.style.setProperty(property, "0", options.important ? "important" : "");
              }
            };

            //Check so that there are no accidental styles that will make the element styled differently now that is is relative.
            //If there are any, set them to 0 (this should be okay with the user since the style properties did nothing before [since the element was positioned static] anyway).
            removeRelativeStyles(reporter, element, style, "top");
            removeRelativeStyles(reporter, element, style, "right");
            removeRelativeStyles(reporter, element, style, "bottom");
            removeRelativeStyles(reporter, element, style, "left");
          }
        }
        function onObjectLoad() {
          // The object has been loaded, which means that the element now is guaranteed to be attached to the DOM.
          if (!positionCheckPerformed) {
            alterPositionStyles();
          }

          /*jshint validthis: true */

          function getDocument(element, callback) {
            //Opera 12 seem to call the object.onload before the actual document has been created.
            //So if it is not present, poll it with an timeout until it is present.
            //TODO: Could maybe be handled better with object.onreadystatechange or similar.
            if (!element.contentDocument) {
              var state = getState(element);
              if (state.checkForObjectDocumentTimeoutId) {
                window.clearTimeout(state.checkForObjectDocumentTimeoutId);
              }
              state.checkForObjectDocumentTimeoutId = setTimeout(function checkForObjectDocument() {
                state.checkForObjectDocumentTimeoutId = 0;
                getDocument(element, callback);
              }, 100);
              return;
            }
            callback(element.contentDocument);
          }

          //Mutating the object element here seems to fire another load event.
          //Mutating the inner document of the object element is fine though.
          var objectElement = this;

          //Create the style element to be added to the object.
          getDocument(objectElement, function onObjectDocumentReady(objectDocument) {
            //Notify that the element is ready to be listened to.
            callback(element);
          });
        }

        // The element may be detached from the DOM, and some browsers does not support style resolving of detached elements.
        // The alterPositionStyles needs to be delayed until we know the element has been attached to the DOM (which we are sure of when the onObjectLoad has been fired), if style resolution is not possible.
        if (style.position !== "") {
          alterPositionStyles(style);
          positionCheckPerformed = true;
        }

        //Add an object element as a child to the target element that will be listened to for resize events.
        var object = document.createElement("object");
        object.style.cssText = OBJECT_STYLE;
        object.tabIndex = -1;
        object.type = "text/html";
        object.setAttribute("aria-hidden", "true");
        object.onload = onObjectLoad;

        //Safari: This must occur before adding the object to the DOM.
        //IE: Does not like that this happens before, even if it is also added after.
        if (!browserDetector.isIE()) {
          object.data = "about:blank";
        }
        if (!getState(element)) {
          // The element has been uninstalled before the actual loading happened.
          return;
        }
        element.appendChild(object);
        getState(element).object = object;

        //IE: This must occur after adding the object to the DOM.
        if (browserDetector.isIE()) {
          object.data = "about:blank";
        }
      }
      if (batchProcessor) {
        batchProcessor.add(mutateDom);
      } else {
        mutateDom();
      }
    }
    if (browserDetector.isIE(8)) {
      //IE 8 does not support objects properly. Luckily they do support the resize event.
      //So do not inject the object and notify that the element is already ready to be listened to.
      //The event handler for the resize event is attached in the utils.addListener instead.
      callback(element);
    } else {
      injectObject(element, callback);
    }
  }

  /**
   * Returns the child object of the target element.
   * @private
   * @param {element} element The target element.
   * @returns The object element of the target.
   */
  function getObject(element) {
    return getState(element).object;
  }
  function uninstall(element) {
    if (!getState(element)) {
      return;
    }
    var object = getObject(element);
    if (!object) {
      return;
    }
    if (browserDetector.isIE(8)) {
      element.detachEvent("onresize", object.proxy);
    } else {
      element.removeChild(object);
    }
    if (getState(element).checkForObjectDocumentTimeoutId) {
      window.clearTimeout(getState(element).checkForObjectDocumentTimeoutId);
    }
    delete getState(element).object;
  }
  return {
    makeDetectable: makeDetectable,
    addListener: addListener,
    uninstall: uninstall
  };
};

/***/ }),

/***/ 350:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var DESCRIPTORS = __webpack_require__(3724);
var hasOwn = __webpack_require__(9297);

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};


/***/ }),

/***/ 397:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var getBuiltIn = __webpack_require__(7751);

module.exports = getBuiltIn('document', 'documentElement');


/***/ }),

/***/ 421:
/***/ (function(module) {


module.exports = {};


/***/ }),

/***/ 616:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var fails = __webpack_require__(9039);

module.exports = !fails(function () {
  // eslint-disable-next-line es/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});


/***/ }),

/***/ 679:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var isPrototypeOf = __webpack_require__(1625);

var $TypeError = TypeError;

module.exports = function (it, Prototype) {
  if (isPrototypeOf(Prototype, it)) return it;
  throw new $TypeError('Incorrect invocation');
};


/***/ }),

/***/ 713:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var call = __webpack_require__(9565);
var aCallable = __webpack_require__(9306);
var anObject = __webpack_require__(8551);
var getIteratorDirect = __webpack_require__(1767);
var createIteratorProxy = __webpack_require__(9462);
var callWithSafeIterationClosing = __webpack_require__(6319);

var IteratorProxy = createIteratorProxy(function () {
  var iterator = this.iterator;
  var result = anObject(call(this.next, iterator));
  var done = this.done = !!result.done;
  if (!done) return callWithSafeIterationClosing(iterator, this.mapper, [result.value, this.counter++], true);
});

// `Iterator.prototype.map` method
// https://github.com/tc39/proposal-iterator-helpers
module.exports = function map(mapper) {
  anObject(this);
  aCallable(mapper);
  return new IteratorProxy(getIteratorDirect(this), {
    mapper: mapper
  });
};


/***/ }),

/***/ 741:
/***/ (function(module) {


var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};


/***/ }),

/***/ 757:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var getBuiltIn = __webpack_require__(7751);
var isCallable = __webpack_require__(4901);
var isPrototypeOf = __webpack_require__(1625);
var USE_SYMBOL_AS_UID = __webpack_require__(7040);

var $Object = Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};


/***/ }),

/***/ 851:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var classof = __webpack_require__(6955);
var getMethod = __webpack_require__(5966);
var isNullOrUndefined = __webpack_require__(4117);
var Iterators = __webpack_require__(6269);
var wellKnownSymbol = __webpack_require__(8227);

var ITERATOR = wellKnownSymbol('iterator');

module.exports = function (it) {
  if (!isNullOrUndefined(it)) return getMethod(it, ITERATOR)
    || getMethod(it, '@@iterator')
    || Iterators[classof(it)];
};


/***/ }),

/***/ 1072:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var internalObjectKeys = __webpack_require__(1828);
var enumBugKeys = __webpack_require__(8727);

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


/***/ }),

/***/ 1181:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var NATIVE_WEAK_MAP = __webpack_require__(8622);
var globalThis = __webpack_require__(4576);
var isObject = __webpack_require__(34);
var createNonEnumerableProperty = __webpack_require__(6699);
var hasOwn = __webpack_require__(9297);
var shared = __webpack_require__(7629);
var sharedKey = __webpack_require__(6119);
var hiddenKeys = __webpack_require__(421);

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = globalThis.TypeError;
var WeakMap = globalThis.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw new TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  /* eslint-disable no-self-assign -- prototype methods protection */
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  /* eslint-enable no-self-assign -- prototype methods protection */
  set = function (it, metadata) {
    if (store.has(it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    store.set(it, metadata);
    return metadata;
  };
  get = function (it) {
    return store.get(it) || {};
  };
  has = function (it) {
    return store.has(it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),

/***/ 1291:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var trunc = __webpack_require__(741);

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};


/***/ }),

/***/ 1625:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var uncurryThis = __webpack_require__(9504);

module.exports = uncurryThis({}.isPrototypeOf);


/***/ }),

/***/ 1701:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


var $ = __webpack_require__(6518);
var map = __webpack_require__(713);
var IS_PURE = __webpack_require__(6395);

// `Iterator.prototype.map` method
// https://tc39.es/ecma262/#sec-iterator.prototype.map
$({ target: 'Iterator', proto: true, real: true, forced: IS_PURE }, {
  map: map
});


/***/ }),

/***/ 1767:
/***/ (function(module) {


// `GetIteratorDirect(obj)` abstract operation
// https://tc39.es/proposal-iterator-helpers/#sec-getiteratordirect
module.exports = function (obj) {
  return {
    iterator: obj,
    next: obj.next,
    done: false
  };
};


/***/ }),

/***/ 1828:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var uncurryThis = __webpack_require__(9504);
var hasOwn = __webpack_require__(9297);
var toIndexedObject = __webpack_require__(5397);
var indexOf = (__webpack_require__(9617).indexOf);
var hiddenKeys = __webpack_require__(421);

var push = uncurryThis([].push);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};


/***/ }),

/***/ 1961:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {



__webpack_require__(8111);
__webpack_require__(7588);
var utils = module.exports = {};

/**
 * Loops through the collection and calls the callback for each element. if the callback returns truthy, the loop is broken and returns the same value.
 * @public
 * @param {*} collection The collection to loop through. Needs to have a length property set and have indices set from 0 to length - 1.
 * @param {function} callback The callback to be called for each element. The element will be given as a parameter to the callback. If this callback returns truthy, the loop is broken and the same value is returned.
 * @returns {*} The value that a callback has returned (if truthy). Otherwise nothing.
 */
utils.forEach = function (collection, callback) {
  for (var i = 0; i < collection.length; i++) {
    var result = callback(collection[i]);
    if (result) {
      return result;
    }
  }
};

/***/ }),

/***/ 2077:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {



__webpack_require__(4114);
__webpack_require__(8111);
__webpack_require__(7588);
var forEach = (__webpack_require__(1961).forEach);
var elementUtilsMaker = __webpack_require__(4921);
var listenerHandlerMaker = __webpack_require__(9244);
var idGeneratorMaker = __webpack_require__(8064);
var idHandlerMaker = __webpack_require__(2177);
var reporterMaker = __webpack_require__(2492);
var browserDetector = __webpack_require__(5728);
var batchProcessorMaker = __webpack_require__(9353);
var stateHandler = __webpack_require__(6113);

//Detection strategies.
var objectStrategyMaker = __webpack_require__(342);
var scrollStrategyMaker = __webpack_require__(6628);
function isCollection(obj) {
  return Array.isArray(obj) || obj.length !== undefined;
}
function toArray(collection) {
  if (!Array.isArray(collection)) {
    var array = [];
    forEach(collection, function (obj) {
      array.push(obj);
    });
    return array;
  } else {
    return collection;
  }
}
function isElement(obj) {
  return obj && obj.nodeType === 1;
}

/**
 * @typedef idHandler
 * @type {object}
 * @property {function} get Gets the resize detector id of the element.
 * @property {function} set Generate and sets the resize detector id of the element.
 */

/**
 * @typedef Options
 * @type {object}
 * @property {boolean} callOnAdd    Determines if listeners should be called when they are getting added.
                                    Default is true. If true, the listener is guaranteed to be called when it has been added.
                                    If false, the listener will not be guarenteed to be called when it has been added (does not prevent it from being called).
 * @property {idHandler} idHandler  A custom id handler that is responsible for generating, setting and retrieving id's for elements.
                                    If not provided, a default id handler will be used.
 * @property {reporter} reporter    A custom reporter that handles reporting logs, warnings and errors.
                                    If not provided, a default id handler will be used.
                                    If set to false, then nothing will be reported.
 * @property {boolean} debug        If set to true, the the system will report debug messages as default for the listenTo method.
 */

/**
 * Creates an element resize detector instance.
 * @public
 * @param {Options?} options Optional global options object that will decide how this instance will work.
 */
module.exports = function (options) {
  options = options || {};

  //idHandler is currently not an option to the listenTo function, so it should not be added to globalOptions.
  var idHandler;
  if (options.idHandler) {
    // To maintain compatability with idHandler.get(element, readonly), make sure to wrap the given idHandler
    // so that readonly flag always is true when it's used here. This may be removed next major version bump.
    idHandler = {
      get: function (element) {
        return options.idHandler.get(element, true);
      },
      set: options.idHandler.set
    };
  } else {
    var idGenerator = idGeneratorMaker();
    var defaultIdHandler = idHandlerMaker({
      idGenerator: idGenerator,
      stateHandler: stateHandler
    });
    idHandler = defaultIdHandler;
  }

  //reporter is currently not an option to the listenTo function, so it should not be added to globalOptions.
  var reporter = options.reporter;
  if (!reporter) {
    //If options.reporter is false, then the reporter should be quiet.
    var quiet = reporter === false;
    reporter = reporterMaker(quiet);
  }

  //batchProcessor is currently not an option to the listenTo function, so it should not be added to globalOptions.
  var batchProcessor = getOption(options, "batchProcessor", batchProcessorMaker({
    reporter: reporter
  }));

  //Options to be used as default for the listenTo function.
  var globalOptions = {};
  globalOptions.callOnAdd = !!getOption(options, "callOnAdd", true);
  globalOptions.debug = !!getOption(options, "debug", false);
  var eventListenerHandler = listenerHandlerMaker(idHandler);
  var elementUtils = elementUtilsMaker({
    stateHandler: stateHandler
  });

  //The detection strategy to be used.
  var detectionStrategy;
  var desiredStrategy = getOption(options, "strategy", "object");
  var importantCssRules = getOption(options, "important", false);
  var strategyOptions = {
    reporter: reporter,
    batchProcessor: batchProcessor,
    stateHandler: stateHandler,
    idHandler: idHandler,
    important: importantCssRules
  };
  if (desiredStrategy === "scroll") {
    if (browserDetector.isLegacyOpera()) {
      reporter.warn("Scroll strategy is not supported on legacy Opera. Changing to object strategy.");
      desiredStrategy = "object";
    } else if (browserDetector.isIE(9)) {
      reporter.warn("Scroll strategy is not supported on IE9. Changing to object strategy.");
      desiredStrategy = "object";
    }
  }
  if (desiredStrategy === "scroll") {
    detectionStrategy = scrollStrategyMaker(strategyOptions);
  } else if (desiredStrategy === "object") {
    detectionStrategy = objectStrategyMaker(strategyOptions);
  } else {
    throw new Error("Invalid strategy name: " + desiredStrategy);
  }

  //Calls can be made to listenTo with elements that are still being installed.
  //Also, same elements can occur in the elements list in the listenTo function.
  //With this map, the ready callbacks can be synchronized between the calls
  //so that the ready callback can always be called when an element is ready - even if
  //it wasn't installed from the function itself.
  var onReadyCallbacks = {};

  /**
   * Makes the given elements resize-detectable and starts listening to resize events on the elements. Calls the event callback for each event for each element.
   * @public
   * @param {Options?} options Optional options object. These options will override the global options. Some options may not be overriden, such as idHandler.
   * @param {element[]|element} elements The given array of elements to detect resize events of. Single element is also valid.
   * @param {function} listener The callback to be executed for each resize event for each element.
   */
  function listenTo(options, elements, listener) {
    function onResizeCallback(element) {
      var listeners = eventListenerHandler.get(element);
      forEach(listeners, function callListenerProxy(listener) {
        listener(element);
      });
    }
    function addListener(callOnAdd, element, listener) {
      eventListenerHandler.add(element, listener);
      if (callOnAdd) {
        listener(element);
      }
    }

    //Options object may be omitted.
    if (!listener) {
      listener = elements;
      elements = options;
      options = {};
    }
    if (!elements) {
      throw new Error("At least one element required.");
    }
    if (!listener) {
      throw new Error("Listener required.");
    }
    if (isElement(elements)) {
      // A single element has been passed in.
      elements = [elements];
    } else if (isCollection(elements)) {
      // Convert collection to array for plugins.
      // TODO: May want to check so that all the elements in the collection are valid elements.
      elements = toArray(elements);
    } else {
      return reporter.error("Invalid arguments. Must be a DOM element or a collection of DOM elements.");
    }
    var elementsReady = 0;
    var callOnAdd = getOption(options, "callOnAdd", globalOptions.callOnAdd);
    var onReadyCallback = getOption(options, "onReady", function noop() {});
    var debug = getOption(options, "debug", globalOptions.debug);
    forEach(elements, function attachListenerToElement(element) {
      if (!stateHandler.getState(element)) {
        stateHandler.initState(element);
        idHandler.set(element);
      }
      var id = idHandler.get(element);
      debug && reporter.log("Attaching listener to element", id, element);
      if (!elementUtils.isDetectable(element)) {
        debug && reporter.log(id, "Not detectable.");
        if (elementUtils.isBusy(element)) {
          debug && reporter.log(id, "System busy making it detectable");

          //The element is being prepared to be detectable. Do not make it detectable.
          //Just add the listener, because the element will soon be detectable.
          addListener(callOnAdd, element, listener);
          onReadyCallbacks[id] = onReadyCallbacks[id] || [];
          onReadyCallbacks[id].push(function onReady() {
            elementsReady++;
            if (elementsReady === elements.length) {
              onReadyCallback();
            }
          });
          return;
        }
        debug && reporter.log(id, "Making detectable...");
        //The element is not prepared to be detectable, so do prepare it and add a listener to it.
        elementUtils.markBusy(element, true);
        return detectionStrategy.makeDetectable({
          debug: debug,
          important: importantCssRules
        }, element, function onElementDetectable(element) {
          debug && reporter.log(id, "onElementDetectable");
          if (stateHandler.getState(element)) {
            elementUtils.markAsDetectable(element);
            elementUtils.markBusy(element, false);
            detectionStrategy.addListener(element, onResizeCallback);
            addListener(callOnAdd, element, listener);

            // Since the element size might have changed since the call to "listenTo", we need to check for this change,
            // so that a resize event may be emitted.
            // Having the startSize object is optional (since it does not make sense in some cases such as unrendered elements), so check for its existance before.
            // Also, check the state existance before since the element may have been uninstalled in the installation process.
            var state = stateHandler.getState(element);
            if (state && state.startSize) {
              var width = element.offsetWidth;
              var height = element.offsetHeight;
              if (state.startSize.width !== width || state.startSize.height !== height) {
                onResizeCallback(element);
              }
            }
            if (onReadyCallbacks[id]) {
              forEach(onReadyCallbacks[id], function (callback) {
                callback();
              });
            }
          } else {
            // The element has been unisntalled before being detectable.
            debug && reporter.log(id, "Element uninstalled before being detectable.");
          }
          delete onReadyCallbacks[id];
          elementsReady++;
          if (elementsReady === elements.length) {
            onReadyCallback();
          }
        });
      }
      debug && reporter.log(id, "Already detecable, adding listener.");

      //The element has been prepared to be detectable and is ready to be listened to.
      addListener(callOnAdd, element, listener);
      elementsReady++;
    });
    if (elementsReady === elements.length) {
      onReadyCallback();
    }
  }
  function uninstall(elements) {
    if (!elements) {
      return reporter.error("At least one element is required.");
    }
    if (isElement(elements)) {
      // A single element has been passed in.
      elements = [elements];
    } else if (isCollection(elements)) {
      // Convert collection to array for plugins.
      // TODO: May want to check so that all the elements in the collection are valid elements.
      elements = toArray(elements);
    } else {
      return reporter.error("Invalid arguments. Must be a DOM element or a collection of DOM elements.");
    }
    forEach(elements, function (element) {
      eventListenerHandler.removeAllListeners(element);
      detectionStrategy.uninstall(element);
      stateHandler.cleanState(element);
    });
  }
  function initDocument(targetDocument) {
    detectionStrategy.initDocument && detectionStrategy.initDocument(targetDocument);
  }
  return {
    listenTo: listenTo,
    removeListener: eventListenerHandler.removeListener,
    removeAllListeners: eventListenerHandler.removeAllListeners,
    uninstall: uninstall,
    initDocument: initDocument
  };
};
function getOption(options, name, defaultValue) {
  var value = options[name];
  if ((value === undefined || value === null) && defaultValue !== undefined) {
    return defaultValue;
  }
  return value;
}

/***/ }),

/***/ 2106:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var makeBuiltIn = __webpack_require__(283);
var defineProperty = __webpack_require__(4913);

module.exports = function (target, name, descriptor) {
  if (descriptor.get) makeBuiltIn(descriptor.get, name, { getter: true });
  if (descriptor.set) makeBuiltIn(descriptor.set, name, { setter: true });
  return defineProperty.f(target, name, descriptor);
};


/***/ }),

/***/ 2140:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var wellKnownSymbol = __webpack_require__(8227);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),

/***/ 2177:
/***/ (function(module) {



module.exports = function (options) {
  var idGenerator = options.idGenerator;
  var getState = options.stateHandler.getState;

  /**
   * Gets the resize detector id of the element.
   * @public
   * @param {element} element The target element to get the id of.
   * @returns {string|number|null} The id of the element. Null if it has no id.
   */
  function getId(element) {
    var state = getState(element);
    if (state && state.id !== undefined) {
      return state.id;
    }
    return null;
  }

  /**
   * Sets the resize detector id of the element. Requires the element to have a resize detector state initialized.
   * @public
   * @param {element} element The target element to set the id of.
   * @returns {string|number|null} The id of the element.
   */
  function setId(element) {
    var state = getState(element);
    if (!state) {
      throw new Error("setId required the element to have a resize detection state.");
    }
    var id = idGenerator.generate();
    state.id = id;
    return id;
  }
  return {
    get: getId,
    set: setId
  };
};

/***/ }),

/***/ 2195:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var uncurryThis = __webpack_require__(9504);

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};


/***/ }),

/***/ 2211:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var fails = __webpack_require__(9039);

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});


/***/ }),

/***/ 2360:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


/* global ActiveXObject -- old IE, WSH */
var anObject = __webpack_require__(8551);
var definePropertiesModule = __webpack_require__(6801);
var enumBugKeys = __webpack_require__(8727);
var hiddenKeys = __webpack_require__(421);
var html = __webpack_require__(397);
var documentCreateElement = __webpack_require__(4055);
var sharedKey = __webpack_require__(6119);

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  // eslint-disable-next-line no-useless-assignment -- avoid memory leak
  activeXDocument = null;
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = typeof document != 'undefined'
    ? document.domain && activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
      : NullProtoObjectViaIFrame()
    : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
// eslint-disable-next-line es/no-object-create -- safe
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
};


/***/ }),

/***/ 2492:
/***/ (function(module) {



/* global console: false */

/**
 * Reporter that handles the reporting of logs, warnings and errors.
 * @public
 * @param {boolean} quiet Tells if the reporter should be quiet or not.
 */
module.exports = function (quiet) {
  function noop() {
    //Does nothing.
  }
  var reporter = {
    log: noop,
    warn: noop,
    error: noop
  };
  if (!quiet && window.console) {
    var attachFunction = function (reporter, name) {
      //The proxy is needed to be able to call the method with the console context,
      //since we cannot use bind.
      reporter[name] = function reporterProxy() {
        var f = console[name];
        if (f.apply) {
          //IE9 does not support console.log.apply :)
          f.apply(console, arguments);
        } else {
          for (var i = 0; i < arguments.length; i++) {
            f(arguments[i]);
          }
        }
      };
    };
    attachFunction(reporter, "log");
    attachFunction(reporter, "warn");
    attachFunction(reporter, "error");
  }
  return reporter;
};

/***/ }),

/***/ 2529:
/***/ (function(module) {


// `CreateIterResultObject` abstract operation
// https://tc39.es/ecma262/#sec-createiterresultobject
module.exports = function (value, done) {
  return { value: value, done: done };
};


/***/ }),

/***/ 2652:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var bind = __webpack_require__(6080);
var call = __webpack_require__(9565);
var anObject = __webpack_require__(8551);
var tryToString = __webpack_require__(6823);
var isArrayIteratorMethod = __webpack_require__(4209);
var lengthOfArrayLike = __webpack_require__(6198);
var isPrototypeOf = __webpack_require__(1625);
var getIterator = __webpack_require__(81);
var getIteratorMethod = __webpack_require__(851);
var iteratorClose = __webpack_require__(9539);

var $TypeError = TypeError;

var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

var ResultPrototype = Result.prototype;

module.exports = function (iterable, unboundFunction, options) {
  var that = options && options.that;
  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
  var IS_RECORD = !!(options && options.IS_RECORD);
  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
  var INTERRUPTED = !!(options && options.INTERRUPTED);
  var fn = bind(unboundFunction, that);
  var iterator, iterFn, index, length, result, next, step;

  var stop = function (condition) {
    if (iterator) iteratorClose(iterator, 'normal', condition);
    return new Result(true, condition);
  };

  var callFn = function (value) {
    if (AS_ENTRIES) {
      anObject(value);
      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
    } return INTERRUPTED ? fn(value, stop) : fn(value);
  };

  if (IS_RECORD) {
    iterator = iterable.iterator;
  } else if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (!iterFn) throw new $TypeError(tryToString(iterable) + ' is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
        result = callFn(iterable[index]);
        if (result && isPrototypeOf(ResultPrototype, result)) return result;
      } return new Result(false);
    }
    iterator = getIterator(iterable, iterFn);
  }

  next = IS_RECORD ? iterable.next : iterator.next;
  while (!(step = call(next, iterator)).done) {
    try {
      result = callFn(step.value);
    } catch (error) {
      iteratorClose(iterator, 'throw', error);
    }
    if (typeof result == 'object' && result && isPrototypeOf(ResultPrototype, result)) return result;
  } return new Result(false);
};


/***/ }),

/***/ 2777:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var call = __webpack_require__(9565);
var isObject = __webpack_require__(34);
var isSymbol = __webpack_require__(757);
var getMethod = __webpack_require__(5966);
var ordinaryToPrimitive = __webpack_require__(4270);
var wellKnownSymbol = __webpack_require__(8227);

var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw new $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};


/***/ }),

/***/ 2787:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var hasOwn = __webpack_require__(9297);
var isCallable = __webpack_require__(4901);
var toObject = __webpack_require__(8981);
var sharedKey = __webpack_require__(6119);
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(2211);

var IE_PROTO = sharedKey('IE_PROTO');
var $Object = Object;
var ObjectPrototype = $Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es/no-object-getprototypeof -- safe
module.exports = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function (O) {
  var object = toObject(O);
  if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
  var constructor = object.constructor;
  if (isCallable(constructor) && object instanceof constructor) {
    return constructor.prototype;
  } return object instanceof $Object ? ObjectPrototype : null;
};


/***/ }),

/***/ 2796:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var fails = __webpack_require__(9039);
var isCallable = __webpack_require__(4901);

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value === POLYFILL ? true
    : value === NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),

/***/ 2839:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var globalThis = __webpack_require__(4576);

var navigator = globalThis.navigator;
var userAgent = navigator && navigator.userAgent;

module.exports = userAgent ? String(userAgent) : '';


/***/ }),

/***/ 3392:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var uncurryThis = __webpack_require__(9504);

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};


/***/ }),

/***/ 3706:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var uncurryThis = __webpack_require__(9504);
var isCallable = __webpack_require__(4901);
var store = __webpack_require__(7629);

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;


/***/ }),

/***/ 3717:
/***/ (function(__unused_webpack_module, exports) {


// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ 3724:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var fails = __webpack_require__(9039);

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] !== 7;
});


/***/ }),

/***/ 4055:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var globalThis = __webpack_require__(4576);
var isObject = __webpack_require__(34);

var document = globalThis.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),

/***/ 4114:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


var $ = __webpack_require__(6518);
var toObject = __webpack_require__(8981);
var lengthOfArrayLike = __webpack_require__(6198);
var setArrayLength = __webpack_require__(4527);
var doesNotExceedSafeInteger = __webpack_require__(6837);
var fails = __webpack_require__(9039);

var INCORRECT_TO_LENGTH = fails(function () {
  return [].push.call({ length: 0x100000000 }, 1) !== 4294967297;
});

// V8 <= 121 and Safari <= 15.4; FF < 23 throws InternalError
// https://bugs.chromium.org/p/v8/issues/detail?id=12681
var properErrorOnNonWritableLength = function () {
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', { writable: false }).push();
  } catch (error) {
    return error instanceof TypeError;
  }
};

var FORCED = INCORRECT_TO_LENGTH || !properErrorOnNonWritableLength();

// `Array.prototype.push` method
// https://tc39.es/ecma262/#sec-array.prototype.push
$({ target: 'Array', proto: true, arity: 1, forced: FORCED }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  push: function push(item) {
    var O = toObject(this);
    var len = lengthOfArrayLike(O);
    var argCount = arguments.length;
    doesNotExceedSafeInteger(len + argCount);
    for (var i = 0; i < argCount; i++) {
      O[len] = arguments[i];
      len++;
    }
    setArrayLength(O, len);
    return len;
  }
});


/***/ }),

/***/ 4117:
/***/ (function(module) {


// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
module.exports = function (it) {
  return it === null || it === undefined;
};


/***/ }),

/***/ 4177:
/***/ (function(module) {



var utils = module.exports = {};
utils.getOption = getOption;
function getOption(options, name, defaultValue) {
  var value = options[name];
  if ((value === undefined || value === null) && defaultValue !== undefined) {
    return defaultValue;
  }
  return value;
}

/***/ }),

/***/ 4209:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var wellKnownSymbol = __webpack_require__(8227);
var Iterators = __webpack_require__(6269);

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};


/***/ }),

/***/ 4270:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var call = __webpack_require__(9565);
var isCallable = __webpack_require__(4901);
var isObject = __webpack_require__(34);

var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw new $TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ 4376:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var classof = __webpack_require__(2195);

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
module.exports = Array.isArray || function isArray(argument) {
  return classof(argument) === 'Array';
};


/***/ }),

/***/ 4495:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(9519);
var fails = __webpack_require__(9039);
var globalThis = __webpack_require__(4576);

var $String = globalThis.String;

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol('symbol detection');
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
  // of course, fail.
  return !$String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});


/***/ }),

/***/ 4527:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var DESCRIPTORS = __webpack_require__(3724);
var isArray = __webpack_require__(4376);

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Safari < 13 does not throw an error in this case
var SILENT_ON_NON_WRITABLE_LENGTH_SET = DESCRIPTORS && !function () {
  // makes no sense without proper strict mode support
  if (this !== undefined) return true;
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', { writable: false }).length = 1;
  } catch (error) {
    return error instanceof TypeError;
  }
}();

module.exports = SILENT_ON_NON_WRITABLE_LENGTH_SET ? function (O, length) {
  if (isArray(O) && !getOwnPropertyDescriptor(O, 'length').writable) {
    throw new $TypeError('Cannot set read only .length');
  } return O.length = length;
} : function (O, length) {
  return O.length = length;
};


/***/ }),

/***/ 4576:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var check = function (it) {
  return it && it.Math === Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) ||
  check(typeof this == 'object' && this) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();


/***/ }),

/***/ 4659:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var DESCRIPTORS = __webpack_require__(3724);
var definePropertyModule = __webpack_require__(4913);
var createPropertyDescriptor = __webpack_require__(6980);

module.exports = function (object, key, value) {
  if (DESCRIPTORS) definePropertyModule.f(object, key, createPropertyDescriptor(0, value));
  else object[key] = value;
};


/***/ }),

/***/ 4901:
/***/ (function(module) {


// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
var documentAll = typeof document == 'object' && document.all;

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
module.exports = typeof documentAll == 'undefined' && documentAll !== undefined ? function (argument) {
  return typeof argument == 'function' || argument === documentAll;
} : function (argument) {
  return typeof argument == 'function';
};


/***/ }),

/***/ 4913:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var DESCRIPTORS = __webpack_require__(3724);
var IE8_DOM_DEFINE = __webpack_require__(5917);
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(8686);
var anObject = __webpack_require__(8551);
var toPropertyKey = __webpack_require__(6969);

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw new $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ 4921:
/***/ (function(module) {



module.exports = function (options) {
  var getState = options.stateHandler.getState;

  /**
   * Tells if the element has been made detectable and ready to be listened for resize events.
   * @public
   * @param {element} The element to check.
   * @returns {boolean} True or false depending on if the element is detectable or not.
   */
  function isDetectable(element) {
    var state = getState(element);
    return state && !!state.isDetectable;
  }

  /**
   * Marks the element that it has been made detectable and ready to be listened for resize events.
   * @public
   * @param {element} The element to mark.
   */
  function markAsDetectable(element) {
    getState(element).isDetectable = true;
  }

  /**
   * Tells if the element is busy or not.
   * @public
   * @param {element} The element to check.
   * @returns {boolean} True or false depending on if the element is busy or not.
   */
  function isBusy(element) {
    return !!getState(element).busy;
  }

  /**
   * Marks the object is busy and should not be made detectable.
   * @public
   * @param {element} element The element to mark.
   * @param {boolean} busy If the element is busy or not.
   */
  function markBusy(element, busy) {
    getState(element).busy = !!busy;
  }
  return {
    isDetectable: isDetectable,
    markAsDetectable: markAsDetectable,
    isBusy: isBusy,
    markBusy: markBusy
  };
};

/***/ }),

/***/ 5031:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var getBuiltIn = __webpack_require__(7751);
var uncurryThis = __webpack_require__(9504);
var getOwnPropertyNamesModule = __webpack_require__(8480);
var getOwnPropertySymbolsModule = __webpack_require__(3717);
var anObject = __webpack_require__(8551);

var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};


/***/ }),

/***/ 5397:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(7055);
var requireObjectCoercible = __webpack_require__(7750);

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),

/***/ 5610:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var toIntegerOrInfinity = __webpack_require__(1291);

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),

/***/ 5728:
/***/ (function(module) {



var detector = module.exports = {};
detector.isIE = function (version) {
  function isAnyIeVersion() {
    var agent = navigator.userAgent.toLowerCase();
    return agent.indexOf("msie") !== -1 || agent.indexOf("trident") !== -1 || agent.indexOf(" edge/") !== -1;
  }
  if (!isAnyIeVersion()) {
    return false;
  }
  if (!version) {
    return true;
  }

  //Shamelessly stolen from https://gist.github.com/padolsey/527683
  var ieVersion = function () {
    var undef,
      v = 3,
      div = document.createElement("div"),
      all = div.getElementsByTagName("i");
    do {
      div.innerHTML = "<!--[if gt IE " + ++v + "]><i></i><![endif]-->";
    } while (all[0]);
    return v > 4 ? v : undef;
  }();
  return version === ieVersion;
};
detector.isLegacyOpera = function () {
  return !!window.opera;
};

/***/ }),

/***/ 5745:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var store = __webpack_require__(7629);

module.exports = function (key, value) {
  return store[key] || (store[key] = value || {});
};


/***/ }),

/***/ 5917:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var DESCRIPTORS = __webpack_require__(3724);
var fails = __webpack_require__(9039);
var createElement = __webpack_require__(4055);

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a !== 7;
});


/***/ }),

/***/ 5966:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var aCallable = __webpack_require__(9306);
var isNullOrUndefined = __webpack_require__(4117);

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? undefined : aCallable(func);
};


/***/ }),

/***/ 6080:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var uncurryThis = __webpack_require__(7476);
var aCallable = __webpack_require__(9306);
var NATIVE_BIND = __webpack_require__(616);

var bind = uncurryThis(uncurryThis.bind);

// optional / simple context binding
module.exports = function (fn, that) {
  aCallable(fn);
  return that === undefined ? fn : NATIVE_BIND ? bind(fn, that) : function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ 6113:
/***/ (function(module) {



var prop = "_erd";
function initState(element) {
  element[prop] = {};
  return getState(element);
}
function getState(element) {
  return element[prop];
}
function cleanState(element) {
  delete element[prop];
}
module.exports = {
  initState: initState,
  getState: getState,
  cleanState: cleanState
};

/***/ }),

/***/ 6119:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var shared = __webpack_require__(5745);
var uid = __webpack_require__(3392);

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),

/***/ 6198:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var toLength = __webpack_require__(8014);

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};


/***/ }),

/***/ 6269:
/***/ (function(module) {


module.exports = {};


/***/ }),

/***/ 6279:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var defineBuiltIn = __webpack_require__(6840);

module.exports = function (target, src, options) {
  for (var key in src) defineBuiltIn(target, key, src[key], options);
  return target;
};


/***/ }),

/***/ 6319:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var anObject = __webpack_require__(8551);
var iteratorClose = __webpack_require__(9539);

// call something on iterator step with safe closing on error
module.exports = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  } catch (error) {
    iteratorClose(iterator, 'throw', error);
  }
};


/***/ }),

/***/ 6395:
/***/ (function(module) {


module.exports = false;


/***/ }),

/***/ 6518:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var globalThis = __webpack_require__(4576);
var getOwnPropertyDescriptor = (__webpack_require__(7347).f);
var createNonEnumerableProperty = __webpack_require__(6699);
var defineBuiltIn = __webpack_require__(6840);
var defineGlobalProperty = __webpack_require__(9433);
var copyConstructorProperties = __webpack_require__(7740);
var isForced = __webpack_require__(2796);

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = globalThis;
  } else if (STATIC) {
    target = globalThis[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = globalThis[TARGET] && globalThis[TARGET].prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    defineBuiltIn(target, key, sourceProperty, options);
  }
};


/***/ }),

/***/ 6628:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/**
 * Resize detection strategy that injects divs to elements in order to detect resize events on scroll events.
 * Heavily inspired by: https://github.com/marcj/css-element-queries/blob/master/src/ResizeSensor.js
 */



__webpack_require__(4114);
__webpack_require__(8111);
__webpack_require__(7588);
var forEach = (__webpack_require__(1961).forEach);
module.exports = function (options) {
  options = options || {};
  var reporter = options.reporter;
  var batchProcessor = options.batchProcessor;
  var getState = options.stateHandler.getState;
  var hasState = options.stateHandler.hasState;
  var idHandler = options.idHandler;
  if (!batchProcessor) {
    throw new Error("Missing required dependency: batchProcessor");
  }
  if (!reporter) {
    throw new Error("Missing required dependency: reporter.");
  }

  //TODO: Could this perhaps be done at installation time?
  var scrollbarSizes = getScrollbarSizes();
  var styleId = "erd_scroll_detection_scrollbar_style";
  var detectionContainerClass = "erd_scroll_detection_container";
  function initDocument(targetDocument) {
    // Inject the scrollbar styling that prevents them from appearing sometimes in Chrome.
    // The injected container needs to have a class, so that it may be styled with CSS (pseudo elements).
    injectScrollStyle(targetDocument, styleId, detectionContainerClass);
  }
  initDocument(window.document);
  function buildCssTextString(rules) {
    var seperator = options.important ? " !important; " : "; ";
    return (rules.join(seperator) + seperator).trim();
  }
  function getScrollbarSizes() {
    var width = 500;
    var height = 500;
    var child = document.createElement("div");
    child.style.cssText = buildCssTextString(["position: absolute", "width: " + width * 2 + "px", "height: " + height * 2 + "px", "visibility: hidden", "margin: 0", "padding: 0"]);
    var container = document.createElement("div");
    container.style.cssText = buildCssTextString(["position: absolute", "width: " + width + "px", "height: " + height + "px", "overflow: scroll", "visibility: none", "top: " + -width * 3 + "px", "left: " + -height * 3 + "px", "visibility: hidden", "margin: 0", "padding: 0"]);
    container.appendChild(child);
    document.body.insertBefore(container, document.body.firstChild);
    var widthSize = width - container.clientWidth;
    var heightSize = height - container.clientHeight;
    document.body.removeChild(container);
    return {
      width: widthSize,
      height: heightSize
    };
  }
  function injectScrollStyle(targetDocument, styleId, containerClass) {
    function injectStyle(style, method) {
      method = method || function (element) {
        targetDocument.head.appendChild(element);
      };
      var styleElement = targetDocument.createElement("style");
      styleElement.innerHTML = style;
      styleElement.id = styleId;
      method(styleElement);
      return styleElement;
    }
    if (!targetDocument.getElementById(styleId)) {
      var containerAnimationClass = containerClass + "_animation";
      var containerAnimationActiveClass = containerClass + "_animation_active";
      var style = "/* Created by the element-resize-detector library. */\n";
      style += "." + containerClass + " > div::-webkit-scrollbar { " + buildCssTextString(["display: none"]) + " }\n\n";
      style += "." + containerAnimationActiveClass + " { " + buildCssTextString(["-webkit-animation-duration: 0.1s", "animation-duration: 0.1s", "-webkit-animation-name: " + containerAnimationClass, "animation-name: " + containerAnimationClass]) + " }\n";
      style += "@-webkit-keyframes " + containerAnimationClass + " { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }\n";
      style += "@keyframes " + containerAnimationClass + " { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }";
      injectStyle(style);
    }
  }
  function addAnimationClass(element) {
    element.className += " " + detectionContainerClass + "_animation_active";
  }
  function addEvent(el, name, cb) {
    if (el.addEventListener) {
      el.addEventListener(name, cb);
    } else if (el.attachEvent) {
      el.attachEvent("on" + name, cb);
    } else {
      return reporter.error("[scroll] Don't know how to add event listeners.");
    }
  }
  function removeEvent(el, name, cb) {
    if (el.removeEventListener) {
      el.removeEventListener(name, cb);
    } else if (el.detachEvent) {
      el.detachEvent("on" + name, cb);
    } else {
      return reporter.error("[scroll] Don't know how to remove event listeners.");
    }
  }
  function getExpandElement(element) {
    return getState(element).container.childNodes[0].childNodes[0].childNodes[0];
  }
  function getShrinkElement(element) {
    return getState(element).container.childNodes[0].childNodes[0].childNodes[1];
  }

  /**
   * Adds a resize event listener to the element.
   * @public
   * @param {element} element The element that should have the listener added.
   * @param {function} listener The listener callback to be called for each resize event of the element. The element will be given as a parameter to the listener callback.
   */
  function addListener(element, listener) {
    var listeners = getState(element).listeners;
    if (!listeners.push) {
      throw new Error("Cannot add listener to an element that is not detectable.");
    }
    getState(element).listeners.push(listener);
  }

  /**
   * Makes an element detectable and ready to be listened for resize events. Will call the callback when the element is ready to be listened for resize changes.
   * @private
   * @param {object} options Optional options object.
   * @param {element} element The element to make detectable
   * @param {function} callback The callback to be called when the element is ready to be listened for resize changes. Will be called with the element as first parameter.
   */
  function makeDetectable(options, element, callback) {
    if (!callback) {
      callback = element;
      element = options;
      options = null;
    }
    options = options || {};
    function debug() {
      if (options.debug) {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(idHandler.get(element), "Scroll: ");
        if (reporter.log.apply) {
          reporter.log.apply(null, args);
        } else {
          for (var i = 0; i < args.length; i++) {
            reporter.log(args[i]);
          }
        }
      }
    }
    function isDetached(element) {
      function isInDocument(element) {
        var isInShadowRoot = element.getRootNode && element.getRootNode().contains(element);
        return element === element.ownerDocument.body || element.ownerDocument.body.contains(element) || isInShadowRoot;
      }
      if (!isInDocument(element)) {
        return true;
      }

      // FireFox returns null style in hidden iframes. See https://github.com/wnr/element-resize-detector/issues/68 and https://bugzilla.mozilla.org/show_bug.cgi?id=795520
      if (window.getComputedStyle(element) === null) {
        return true;
      }
      return false;
    }
    function isUnrendered(element) {
      // Check the absolute positioned container since the top level container is display: inline.
      var container = getState(element).container.childNodes[0];
      var style = window.getComputedStyle(container);
      return !style.width || style.width.indexOf("px") === -1; //Can only compute pixel value when rendered.
    }
    function getStyle() {
      // Some browsers only force layouts when actually reading the style properties of the style object, so make sure that they are all read here,
      // so that the user of the function can be sure that it will perform the layout here, instead of later (important for batching).
      var elementStyle = window.getComputedStyle(element);
      var style = {};
      style.position = elementStyle.position;
      style.width = element.offsetWidth;
      style.height = element.offsetHeight;
      style.top = elementStyle.top;
      style.right = elementStyle.right;
      style.bottom = elementStyle.bottom;
      style.left = elementStyle.left;
      style.widthCSS = elementStyle.width;
      style.heightCSS = elementStyle.height;
      return style;
    }
    function storeStartSize() {
      var style = getStyle();
      getState(element).startSize = {
        width: style.width,
        height: style.height
      };
      debug("Element start size", getState(element).startSize);
    }
    function initListeners() {
      getState(element).listeners = [];
    }
    function storeStyle() {
      debug("storeStyle invoked.");
      if (!getState(element)) {
        debug("Aborting because element has been uninstalled");
        return;
      }
      var style = getStyle();
      getState(element).style = style;
    }
    function storeCurrentSize(element, width, height) {
      getState(element).lastWidth = width;
      getState(element).lastHeight = height;
    }
    function getExpandChildElement(element) {
      return getExpandElement(element).childNodes[0];
    }
    function getWidthOffset() {
      return 2 * scrollbarSizes.width + 1;
    }
    function getHeightOffset() {
      return 2 * scrollbarSizes.height + 1;
    }
    function getExpandWidth(width) {
      return width + 10 + getWidthOffset();
    }
    function getExpandHeight(height) {
      return height + 10 + getHeightOffset();
    }
    function getShrinkWidth(width) {
      return width * 2 + getWidthOffset();
    }
    function getShrinkHeight(height) {
      return height * 2 + getHeightOffset();
    }
    function positionScrollbars(element, width, height) {
      var expand = getExpandElement(element);
      var shrink = getShrinkElement(element);
      var expandWidth = getExpandWidth(width);
      var expandHeight = getExpandHeight(height);
      var shrinkWidth = getShrinkWidth(width);
      var shrinkHeight = getShrinkHeight(height);
      expand.scrollLeft = expandWidth;
      expand.scrollTop = expandHeight;
      shrink.scrollLeft = shrinkWidth;
      shrink.scrollTop = shrinkHeight;
    }
    function injectContainerElement() {
      var container = getState(element).container;
      if (!container) {
        container = document.createElement("div");
        container.className = detectionContainerClass;
        container.style.cssText = buildCssTextString(["visibility: hidden", "display: inline", "width: 0px", "height: 0px", "z-index: -1", "overflow: hidden", "margin: 0", "padding: 0"]);
        getState(element).container = container;
        addAnimationClass(container);
        element.appendChild(container);
        var onAnimationStart = function () {
          getState(element).onRendered && getState(element).onRendered();
        };
        addEvent(container, "animationstart", onAnimationStart);

        // Store the event handler here so that they may be removed when uninstall is called.
        // See uninstall function for an explanation why it is needed.
        getState(element).onAnimationStart = onAnimationStart;
      }
      return container;
    }
    function injectScrollElements() {
      function alterPositionStyles() {
        var style = getState(element).style;
        if (style.position === "static") {
          element.style.setProperty("position", "relative", options.important ? "important" : "");
          var removeRelativeStyles = function (reporter, element, style, property) {
            function getNumericalValue(value) {
              return value.replace(/[^-\d\.]/g, "");
            }
            var value = style[property];
            if (value !== "auto" && getNumericalValue(value) !== "0") {
              reporter.warn("An element that is positioned static has style." + property + "=" + value + " which is ignored due to the static positioning. The element will need to be positioned relative, so the style." + property + " will be set to 0. Element: ", element);
              element.style[property] = 0;
            }
          };

          //Check so that there are no accidental styles that will make the element styled differently now that is is relative.
          //If there are any, set them to 0 (this should be okay with the user since the style properties did nothing before [since the element was positioned static] anyway).
          removeRelativeStyles(reporter, element, style, "top");
          removeRelativeStyles(reporter, element, style, "right");
          removeRelativeStyles(reporter, element, style, "bottom");
          removeRelativeStyles(reporter, element, style, "left");
        }
      }
      function getLeftTopBottomRightCssText(left, top, bottom, right) {
        left = !left ? "0" : left + "px";
        top = !top ? "0" : top + "px";
        bottom = !bottom ? "0" : bottom + "px";
        right = !right ? "0" : right + "px";
        return ["left: " + left, "top: " + top, "right: " + right, "bottom: " + bottom];
      }
      debug("Injecting elements");
      if (!getState(element)) {
        debug("Aborting because element has been uninstalled");
        return;
      }
      alterPositionStyles();
      var rootContainer = getState(element).container;
      if (!rootContainer) {
        rootContainer = injectContainerElement();
      }

      // Due to this WebKit bug https://bugs.webkit.org/show_bug.cgi?id=80808 (currently fixed in Blink, but still present in WebKit browsers such as Safari),
      // we need to inject two containers, one that is width/height 100% and another that is left/top -1px so that the final container always is 1x1 pixels bigger than
      // the targeted element.
      // When the bug is resolved, "containerContainer" may be removed.

      // The outer container can occasionally be less wide than the targeted when inside inline elements element in WebKit (see https://bugs.webkit.org/show_bug.cgi?id=152980).
      // This should be no problem since the inner container either way makes sure the injected scroll elements are at least 1x1 px.

      var scrollbarWidth = scrollbarSizes.width;
      var scrollbarHeight = scrollbarSizes.height;
      var containerContainerStyle = buildCssTextString(["position: absolute", "flex: none", "overflow: hidden", "z-index: -1", "visibility: hidden", "width: 100%", "height: 100%", "left: 0px", "top: 0px"]);
      var containerStyle = buildCssTextString(["position: absolute", "flex: none", "overflow: hidden", "z-index: -1", "visibility: hidden"].concat(getLeftTopBottomRightCssText(-(1 + scrollbarWidth), -(1 + scrollbarHeight), -scrollbarHeight, -scrollbarWidth)));
      var expandStyle = buildCssTextString(["position: absolute", "flex: none", "overflow: scroll", "z-index: -1", "visibility: hidden", "width: 100%", "height: 100%"]);
      var shrinkStyle = buildCssTextString(["position: absolute", "flex: none", "overflow: scroll", "z-index: -1", "visibility: hidden", "width: 100%", "height: 100%"]);
      var expandChildStyle = buildCssTextString(["position: absolute", "left: 0", "top: 0"]);
      var shrinkChildStyle = buildCssTextString(["position: absolute", "width: 200%", "height: 200%"]);
      var containerContainer = document.createElement("div");
      var container = document.createElement("div");
      var expand = document.createElement("div");
      var expandChild = document.createElement("div");
      var shrink = document.createElement("div");
      var shrinkChild = document.createElement("div");

      // Some browsers choke on the resize system being rtl, so force it to ltr. https://github.com/wnr/element-resize-detector/issues/56
      // However, dir should not be set on the top level container as it alters the dimensions of the target element in some browsers.
      containerContainer.dir = "ltr";
      containerContainer.style.cssText = containerContainerStyle;
      containerContainer.className = detectionContainerClass;
      container.className = detectionContainerClass;
      container.style.cssText = containerStyle;
      expand.style.cssText = expandStyle;
      expandChild.style.cssText = expandChildStyle;
      shrink.style.cssText = shrinkStyle;
      shrinkChild.style.cssText = shrinkChildStyle;
      expand.appendChild(expandChild);
      shrink.appendChild(shrinkChild);
      container.appendChild(expand);
      container.appendChild(shrink);
      containerContainer.appendChild(container);
      rootContainer.appendChild(containerContainer);
      function onExpandScroll() {
        var state = getState(element);
        if (state && state.onExpand) {
          state.onExpand();
        } else {
          debug("Aborting expand scroll handler: element has been uninstalled");
        }
      }
      function onShrinkScroll() {
        var state = getState(element);
        if (state && state.onShrink) {
          state.onShrink();
        } else {
          debug("Aborting shrink scroll handler: element has been uninstalled");
        }
      }
      addEvent(expand, "scroll", onExpandScroll);
      addEvent(shrink, "scroll", onShrinkScroll);

      // Store the event handlers here so that they may be removed when uninstall is called.
      // See uninstall function for an explanation why it is needed.
      getState(element).onExpandScroll = onExpandScroll;
      getState(element).onShrinkScroll = onShrinkScroll;
    }
    function registerListenersAndPositionElements() {
      function updateChildSizes(element, width, height) {
        var expandChild = getExpandChildElement(element);
        var expandWidth = getExpandWidth(width);
        var expandHeight = getExpandHeight(height);
        expandChild.style.setProperty("width", expandWidth + "px", options.important ? "important" : "");
        expandChild.style.setProperty("height", expandHeight + "px", options.important ? "important" : "");
      }
      function updateDetectorElements(done) {
        var width = element.offsetWidth;
        var height = element.offsetHeight;

        // Check whether the size has actually changed since last time the algorithm ran. If not, some steps may be skipped.
        var sizeChanged = width !== getState(element).lastWidth || height !== getState(element).lastHeight;
        debug("Storing current size", width, height);

        // Store the size of the element sync here, so that multiple scroll events may be ignored in the event listeners.
        // Otherwise the if-check in handleScroll is useless.
        storeCurrentSize(element, width, height);

        // Since we delay the processing of the batch, there is a risk that uninstall has been called before the batch gets to execute.
        // Since there is no way to cancel the fn executions, we need to add an uninstall guard to all fns of the batch.

        batchProcessor.add(0, function performUpdateChildSizes() {
          if (!sizeChanged) {
            return;
          }
          if (!getState(element)) {
            debug("Aborting because element has been uninstalled");
            return;
          }
          if (!areElementsInjected()) {
            debug("Aborting because element container has not been initialized");
            return;
          }
          if (options.debug) {
            var w = element.offsetWidth;
            var h = element.offsetHeight;
            if (w !== width || h !== height) {
              reporter.warn(idHandler.get(element), "Scroll: Size changed before updating detector elements.");
            }
          }
          updateChildSizes(element, width, height);
        });
        batchProcessor.add(1, function updateScrollbars() {
          // This function needs to be invoked event though the size is unchanged. The element could have been resized very quickly and then
          // been restored to the original size, which will have changed the scrollbar positions.

          if (!getState(element)) {
            debug("Aborting because element has been uninstalled");
            return;
          }
          if (!areElementsInjected()) {
            debug("Aborting because element container has not been initialized");
            return;
          }
          positionScrollbars(element, width, height);
        });
        if (sizeChanged && done) {
          batchProcessor.add(2, function () {
            if (!getState(element)) {
              debug("Aborting because element has been uninstalled");
              return;
            }
            if (!areElementsInjected()) {
              debug("Aborting because element container has not been initialized");
              return;
            }
            done();
          });
        }
      }
      function areElementsInjected() {
        return !!getState(element).container;
      }
      function notifyListenersIfNeeded() {
        function isFirstNotify() {
          return getState(element).lastNotifiedWidth === undefined;
        }
        debug("notifyListenersIfNeeded invoked");
        var state = getState(element);

        // Don't notify if the current size is the start size, and this is the first notification.
        if (isFirstNotify() && state.lastWidth === state.startSize.width && state.lastHeight === state.startSize.height) {
          return debug("Not notifying: Size is the same as the start size, and there has been no notification yet.");
        }

        // Don't notify if the size already has been notified.
        if (state.lastWidth === state.lastNotifiedWidth && state.lastHeight === state.lastNotifiedHeight) {
          return debug("Not notifying: Size already notified");
        }
        debug("Current size not notified, notifying...");
        state.lastNotifiedWidth = state.lastWidth;
        state.lastNotifiedHeight = state.lastHeight;
        forEach(getState(element).listeners, function (listener) {
          listener(element);
        });
      }
      function handleRender() {
        debug("startanimation triggered.");
        if (isUnrendered(element)) {
          debug("Ignoring since element is still unrendered...");
          return;
        }
        debug("Element rendered.");
        var expand = getExpandElement(element);
        var shrink = getShrinkElement(element);
        if (expand.scrollLeft === 0 || expand.scrollTop === 0 || shrink.scrollLeft === 0 || shrink.scrollTop === 0) {
          debug("Scrollbars out of sync. Updating detector elements...");
          updateDetectorElements(notifyListenersIfNeeded);
        }
      }
      function handleScroll() {
        debug("Scroll detected.");
        if (isUnrendered(element)) {
          // Element is still unrendered. Skip this scroll event.
          debug("Scroll event fired while unrendered. Ignoring...");
          return;
        }
        updateDetectorElements(notifyListenersIfNeeded);
      }
      debug("registerListenersAndPositionElements invoked.");
      if (!getState(element)) {
        debug("Aborting because element has been uninstalled");
        return;
      }
      getState(element).onRendered = handleRender;
      getState(element).onExpand = handleScroll;
      getState(element).onShrink = handleScroll;
      var style = getState(element).style;
      updateChildSizes(element, style.width, style.height);
    }
    function finalizeDomMutation() {
      debug("finalizeDomMutation invoked.");
      if (!getState(element)) {
        debug("Aborting because element has been uninstalled");
        return;
      }
      var style = getState(element).style;
      storeCurrentSize(element, style.width, style.height);
      positionScrollbars(element, style.width, style.height);
    }
    function ready() {
      callback(element);
    }
    function install() {
      debug("Installing...");
      initListeners();
      storeStartSize();
      batchProcessor.add(0, storeStyle);
      batchProcessor.add(1, injectScrollElements);
      batchProcessor.add(2, registerListenersAndPositionElements);
      batchProcessor.add(3, finalizeDomMutation);
      batchProcessor.add(4, ready);
    }
    debug("Making detectable...");
    if (isDetached(element)) {
      debug("Element is detached");
      injectContainerElement();
      debug("Waiting until element is attached...");
      getState(element).onRendered = function () {
        debug("Element is now attached");
        install();
      };
    } else {
      install();
    }
  }
  function uninstall(element) {
    var state = getState(element);
    if (!state) {
      // Uninstall has been called on a non-erd element.
      return;
    }

    // Uninstall may have been called in the following scenarios:
    // (1) Right between the sync code and async batch (here state.busy = true, but nothing have been registered or injected).
    // (2) In the ready callback of the last level of the batch by another element (here, state.busy = true, but all the stuff has been injected).
    // (3) After the installation process (here, state.busy = false and all the stuff has been injected).
    // So to be on the safe side, let's check for each thing before removing.

    // We need to remove the event listeners, because otherwise the event might fire on an uninstall element which results in an error when trying to get the state of the element.
    state.onExpandScroll && removeEvent(getExpandElement(element), "scroll", state.onExpandScroll);
    state.onShrinkScroll && removeEvent(getShrinkElement(element), "scroll", state.onShrinkScroll);
    state.onAnimationStart && removeEvent(state.container, "animationstart", state.onAnimationStart);
    state.container && element.removeChild(state.container);
  }
  return {
    makeDetectable: makeDetectable,
    addListener: addListener,
    uninstall: uninstall,
    initDocument: initDocument
  };
};

/***/ }),

/***/ 6699:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var DESCRIPTORS = __webpack_require__(3724);
var definePropertyModule = __webpack_require__(4913);
var createPropertyDescriptor = __webpack_require__(6980);

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ 6801:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var DESCRIPTORS = __webpack_require__(3724);
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(8686);
var definePropertyModule = __webpack_require__(4913);
var anObject = __webpack_require__(8551);
var toIndexedObject = __webpack_require__(5397);
var objectKeys = __webpack_require__(1072);

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
exports.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var props = toIndexedObject(Properties);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
  return O;
};


/***/ }),

/***/ 6823:
/***/ (function(module) {


var $String = String;

module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};


/***/ }),

/***/ 6837:
/***/ (function(module) {


var $TypeError = TypeError;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF; // 2 ** 53 - 1 == 9007199254740991

module.exports = function (it) {
  if (it > MAX_SAFE_INTEGER) throw $TypeError('Maximum allowed index exceeded');
  return it;
};


/***/ }),

/***/ 6840:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var isCallable = __webpack_require__(4901);
var definePropertyModule = __webpack_require__(4913);
var makeBuiltIn = __webpack_require__(283);
var defineGlobalProperty = __webpack_require__(9433);

module.exports = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable(value)) makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;
    else defineGlobalProperty(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];
      else if (O[key]) simple = true;
    } catch (error) { /* empty */ }
    if (simple) O[key] = value;
    else definePropertyModule.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  } return O;
};


/***/ }),

/***/ 6955:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var TO_STRING_TAG_SUPPORT = __webpack_require__(2140);
var isCallable = __webpack_require__(4901);
var classofRaw = __webpack_require__(2195);
var wellKnownSymbol = __webpack_require__(8227);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Object = Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) === 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) === 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};


/***/ }),

/***/ 6969:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var toPrimitive = __webpack_require__(2777);
var isSymbol = __webpack_require__(757);

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};


/***/ }),

/***/ 6980:
/***/ (function(module) {


module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ 7040:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(4495);

module.exports = NATIVE_SYMBOL &&
  !Symbol.sham &&
  typeof Symbol.iterator == 'symbol';


/***/ }),

/***/ 7055:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var uncurryThis = __webpack_require__(9504);
var fails = __webpack_require__(9039);
var classof = __webpack_require__(2195);

var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) === 'String' ? split(it, '') : $Object(it);
} : $Object;


/***/ }),

/***/ 7347:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var DESCRIPTORS = __webpack_require__(3724);
var call = __webpack_require__(9565);
var propertyIsEnumerableModule = __webpack_require__(8773);
var createPropertyDescriptor = __webpack_require__(6980);
var toIndexedObject = __webpack_require__(5397);
var toPropertyKey = __webpack_require__(6969);
var hasOwn = __webpack_require__(9297);
var IE8_DOM_DEFINE = __webpack_require__(5917);

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};


/***/ }),

/***/ 7476:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var classofRaw = __webpack_require__(2195);
var uncurryThis = __webpack_require__(9504);

module.exports = function (fn) {
  // Nashorn bug:
  //   https://github.com/zloirock/core-js/issues/1128
  //   https://github.com/zloirock/core-js/issues/1130
  if (classofRaw(fn) === 'Function') return uncurryThis(fn);
};


/***/ }),

/***/ 7588:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


var $ = __webpack_require__(6518);
var iterate = __webpack_require__(2652);
var aCallable = __webpack_require__(9306);
var anObject = __webpack_require__(8551);
var getIteratorDirect = __webpack_require__(1767);

// `Iterator.prototype.forEach` method
// https://tc39.es/ecma262/#sec-iterator.prototype.foreach
$({ target: 'Iterator', proto: true, real: true }, {
  forEach: function forEach(fn) {
    anObject(this);
    aCallable(fn);
    var record = getIteratorDirect(this);
    var counter = 0;
    iterate(record, function (value) {
      fn(value, counter++);
    }, { IS_RECORD: true });
  }
});


/***/ }),

/***/ 7629:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var IS_PURE = __webpack_require__(6395);
var globalThis = __webpack_require__(4576);
var defineGlobalProperty = __webpack_require__(9433);

var SHARED = '__core-js_shared__';
var store = module.exports = globalThis[SHARED] || defineGlobalProperty(SHARED, {});

(store.versions || (store.versions = [])).push({
  version: '3.40.0',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2025 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.40.0/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});


/***/ }),

/***/ 7657:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var fails = __webpack_require__(9039);
var isCallable = __webpack_require__(4901);
var isObject = __webpack_require__(34);
var create = __webpack_require__(2360);
var getPrototypeOf = __webpack_require__(2787);
var defineBuiltIn = __webpack_require__(6840);
var wellKnownSymbol = __webpack_require__(8227);
var IS_PURE = __webpack_require__(6395);

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

/* eslint-disable es/no-array-prototype-keys -- safe */
if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

var NEW_ITERATOR_PROTOTYPE = !isObject(IteratorPrototype) || fails(function () {
  var test = {};
  // FF44- legacy iterators case
  return IteratorPrototype[ITERATOR].call(test) !== test;
});

if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};
else if (IS_PURE) IteratorPrototype = create(IteratorPrototype);

// `%IteratorPrototype%[@@iterator]()` method
// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
if (!isCallable(IteratorPrototype[ITERATOR])) {
  defineBuiltIn(IteratorPrototype, ITERATOR, function () {
    return this;
  });
}

module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};


/***/ }),

/***/ 7740:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var hasOwn = __webpack_require__(9297);
var ownKeys = __webpack_require__(5031);
var getOwnPropertyDescriptorModule = __webpack_require__(7347);
var definePropertyModule = __webpack_require__(4913);

module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};


/***/ }),

/***/ 7750:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var isNullOrUndefined = __webpack_require__(4117);

var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (isNullOrUndefined(it)) throw new $TypeError("Can't call method on " + it);
  return it;
};


/***/ }),

/***/ 7751:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var globalThis = __webpack_require__(4576);
var isCallable = __webpack_require__(4901);

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(globalThis[namespace]) : globalThis[namespace] && globalThis[namespace][method];
};


/***/ }),

/***/ 8014:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var toIntegerOrInfinity = __webpack_require__(1291);

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  var len = toIntegerOrInfinity(argument);
  return len > 0 ? min(len, 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),

/***/ 8064:
/***/ (function(module) {



module.exports = function () {
  var idCount = 1;

  /**
   * Generates a new unique id in the context.
   * @public
   * @returns {number} A unique id in the context.
   */
  function generate() {
    return idCount++;
  }
  return {
    generate: generate
  };
};

/***/ }),

/***/ 8111:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


var $ = __webpack_require__(6518);
var globalThis = __webpack_require__(4576);
var anInstance = __webpack_require__(679);
var anObject = __webpack_require__(8551);
var isCallable = __webpack_require__(4901);
var getPrototypeOf = __webpack_require__(2787);
var defineBuiltInAccessor = __webpack_require__(2106);
var createProperty = __webpack_require__(4659);
var fails = __webpack_require__(9039);
var hasOwn = __webpack_require__(9297);
var wellKnownSymbol = __webpack_require__(8227);
var IteratorPrototype = (__webpack_require__(7657).IteratorPrototype);
var DESCRIPTORS = __webpack_require__(3724);
var IS_PURE = __webpack_require__(6395);

var CONSTRUCTOR = 'constructor';
var ITERATOR = 'Iterator';
var TO_STRING_TAG = wellKnownSymbol('toStringTag');

var $TypeError = TypeError;
var NativeIterator = globalThis[ITERATOR];

// FF56- have non-standard global helper `Iterator`
var FORCED = IS_PURE
  || !isCallable(NativeIterator)
  || NativeIterator.prototype !== IteratorPrototype
  // FF44- non-standard `Iterator` passes previous tests
  || !fails(function () { NativeIterator({}); });

var IteratorConstructor = function Iterator() {
  anInstance(this, IteratorPrototype);
  if (getPrototypeOf(this) === IteratorPrototype) throw new $TypeError('Abstract class Iterator not directly constructable');
};

var defineIteratorPrototypeAccessor = function (key, value) {
  if (DESCRIPTORS) {
    defineBuiltInAccessor(IteratorPrototype, key, {
      configurable: true,
      get: function () {
        return value;
      },
      set: function (replacement) {
        anObject(this);
        if (this === IteratorPrototype) throw new $TypeError("You can't redefine this property");
        if (hasOwn(this, key)) this[key] = replacement;
        else createProperty(this, key, replacement);
      }
    });
  } else IteratorPrototype[key] = value;
};

if (!hasOwn(IteratorPrototype, TO_STRING_TAG)) defineIteratorPrototypeAccessor(TO_STRING_TAG, ITERATOR);

if (FORCED || !hasOwn(IteratorPrototype, CONSTRUCTOR) || IteratorPrototype[CONSTRUCTOR] === Object) {
  defineIteratorPrototypeAccessor(CONSTRUCTOR, IteratorConstructor);
}

IteratorConstructor.prototype = IteratorPrototype;

// `Iterator` constructor
// https://tc39.es/ecma262/#sec-iterator
$({ global: true, constructor: true, forced: FORCED }, {
  Iterator: IteratorConstructor
});


/***/ }),

/***/ 8227:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var globalThis = __webpack_require__(4576);
var shared = __webpack_require__(5745);
var hasOwn = __webpack_require__(9297);
var uid = __webpack_require__(3392);
var NATIVE_SYMBOL = __webpack_require__(4495);
var USE_SYMBOL_AS_UID = __webpack_require__(7040);

var Symbol = globalThis.Symbol;
var WellKnownSymbolsStore = shared('wks');
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol['for'] || Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name)) {
    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name)
      ? Symbol[name]
      : createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};


/***/ }),

/***/ 8480:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var internalObjectKeys = __webpack_require__(1828);
var enumBugKeys = __webpack_require__(8727);

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),

/***/ 8551:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var isObject = __webpack_require__(34);

var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw new $TypeError($String(argument) + ' is not an object');
};


/***/ }),

/***/ 8622:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var globalThis = __webpack_require__(4576);
var isCallable = __webpack_require__(4901);

var WeakMap = globalThis.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));


/***/ }),

/***/ 8686:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var DESCRIPTORS = __webpack_require__(3724);
var fails = __webpack_require__(9039);

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype !== 42;
});


/***/ }),

/***/ 8727:
/***/ (function(module) {


// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),

/***/ 8773:
/***/ (function(__unused_webpack_module, exports) {


var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;


/***/ }),

/***/ 8981:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var requireObjectCoercible = __webpack_require__(7750);

var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};


/***/ }),

/***/ 9039:
/***/ (function(module) {


module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),

/***/ 9244:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {



__webpack_require__(4114);
module.exports = function (idHandler) {
  var eventListeners = {};

  /**
   * Gets all listeners for the given element.
   * @public
   * @param {element} element The element to get all listeners for.
   * @returns All listeners for the given element.
   */
  function getListeners(element) {
    var id = idHandler.get(element);
    if (id === undefined) {
      return [];
    }
    return eventListeners[id] || [];
  }

  /**
   * Stores the given listener for the given element. Will not actually add the listener to the element.
   * @public
   * @param {element} element The element that should have the listener added.
   * @param {function} listener The callback that the element has added.
   */
  function addListener(element, listener) {
    var id = idHandler.get(element);
    if (!eventListeners[id]) {
      eventListeners[id] = [];
    }
    eventListeners[id].push(listener);
  }
  function removeListener(element, listener) {
    var listeners = getListeners(element);
    for (var i = 0, len = listeners.length; i < len; ++i) {
      if (listeners[i] === listener) {
        listeners.splice(i, 1);
        break;
      }
    }
  }
  function removeAllListeners(element) {
    var listeners = getListeners(element);
    if (!listeners) {
      return;
    }
    listeners.length = 0;
  }
  return {
    get: getListeners,
    add: addListener,
    removeListener: removeListener,
    removeAllListeners: removeAllListeners
  };
};

/***/ }),

/***/ 9297:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var uncurryThis = __webpack_require__(9504);
var toObject = __webpack_require__(8981);

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};


/***/ }),

/***/ 9306:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var isCallable = __webpack_require__(4901);
var tryToString = __webpack_require__(6823);

var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw new $TypeError(tryToString(argument) + ' is not a function');
};


/***/ }),

/***/ 9353:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {



__webpack_require__(4114);
var utils = __webpack_require__(4177);
module.exports = function batchProcessorMaker(options) {
  options = options || {};
  var reporter = options.reporter;
  var asyncProcess = utils.getOption(options, "async", true);
  var autoProcess = utils.getOption(options, "auto", true);
  if (autoProcess && !asyncProcess) {
    reporter && reporter.warn("Invalid options combination. auto=true and async=false is invalid. Setting async=true.");
    asyncProcess = true;
  }
  var batch = Batch();
  var asyncFrameHandler;
  var isProcessing = false;
  function addFunction(level, fn) {
    if (!isProcessing && autoProcess && asyncProcess && batch.size() === 0) {
      // Since this is async, it is guaranteed to be executed after that the fn is added to the batch.
      // This needs to be done before, since we're checking the size of the batch to be 0.
      processBatchAsync();
    }
    batch.add(level, fn);
  }
  function processBatch() {
    // Save the current batch, and create a new batch so that incoming functions are not added into the currently processing batch.
    // Continue processing until the top-level batch is empty (functions may be added to the new batch while processing, and so on).
    isProcessing = true;
    while (batch.size()) {
      var processingBatch = batch;
      batch = Batch();
      processingBatch.process();
    }
    isProcessing = false;
  }
  function forceProcessBatch(localAsyncProcess) {
    if (isProcessing) {
      return;
    }
    if (localAsyncProcess === undefined) {
      localAsyncProcess = asyncProcess;
    }
    if (asyncFrameHandler) {
      cancelFrame(asyncFrameHandler);
      asyncFrameHandler = null;
    }
    if (localAsyncProcess) {
      processBatchAsync();
    } else {
      processBatch();
    }
  }
  function processBatchAsync() {
    asyncFrameHandler = requestFrame(processBatch);
  }
  function clearBatch() {
    batch = {};
    batchSize = 0;
    topLevel = 0;
    bottomLevel = 0;
  }
  function cancelFrame(listener) {
    // var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.clearTimeout;
    var cancel = clearTimeout;
    return cancel(listener);
  }
  function requestFrame(callback) {
    // var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function(fn) { return window.setTimeout(fn, 20); };
    var raf = function (fn) {
      return setTimeout(fn, 0);
    };
    return raf(callback);
  }
  return {
    add: addFunction,
    force: forceProcessBatch
  };
};
function Batch() {
  var batch = {};
  var size = 0;
  var topLevel = 0;
  var bottomLevel = 0;
  function add(level, fn) {
    if (!fn) {
      fn = level;
      level = 0;
    }
    if (level > topLevel) {
      topLevel = level;
    } else if (level < bottomLevel) {
      bottomLevel = level;
    }
    if (!batch[level]) {
      batch[level] = [];
    }
    batch[level].push(fn);
    size++;
  }
  function process() {
    for (var level = bottomLevel; level <= topLevel; level++) {
      var fns = batch[level];
      for (var i = 0; i < fns.length; i++) {
        var fn = fns[i];
        fn();
      }
    }
  }
  function getSize() {
    return size;
  }
  return {
    add: add,
    process: process,
    size: getSize
  };
}

/***/ }),

/***/ 9433:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var globalThis = __webpack_require__(4576);

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(globalThis, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    globalThis[key] = value;
  } return value;
};


/***/ }),

/***/ 9462:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var call = __webpack_require__(9565);
var create = __webpack_require__(2360);
var createNonEnumerableProperty = __webpack_require__(6699);
var defineBuiltIns = __webpack_require__(6279);
var wellKnownSymbol = __webpack_require__(8227);
var InternalStateModule = __webpack_require__(1181);
var getMethod = __webpack_require__(5966);
var IteratorPrototype = (__webpack_require__(7657).IteratorPrototype);
var createIterResultObject = __webpack_require__(2529);
var iteratorClose = __webpack_require__(9539);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var ITERATOR_HELPER = 'IteratorHelper';
var WRAP_FOR_VALID_ITERATOR = 'WrapForValidIterator';
var setInternalState = InternalStateModule.set;

var createIteratorProxyPrototype = function (IS_ITERATOR) {
  var getInternalState = InternalStateModule.getterFor(IS_ITERATOR ? WRAP_FOR_VALID_ITERATOR : ITERATOR_HELPER);

  return defineBuiltIns(create(IteratorPrototype), {
    next: function next() {
      var state = getInternalState(this);
      // for simplification:
      //   for `%WrapForValidIteratorPrototype%.next` or with `state.returnHandlerResult` our `nextHandler` returns `IterResultObject`
      //   for `%IteratorHelperPrototype%.next` - just a value
      if (IS_ITERATOR) return state.nextHandler();
      if (state.done) return createIterResultObject(undefined, true);
      try {
        var result = state.nextHandler();
        return state.returnHandlerResult ? result : createIterResultObject(result, state.done);
      } catch (error) {
        state.done = true;
        throw error;
      }
    },
    'return': function () {
      var state = getInternalState(this);
      var iterator = state.iterator;
      state.done = true;
      if (IS_ITERATOR) {
        var returnMethod = getMethod(iterator, 'return');
        return returnMethod ? call(returnMethod, iterator) : createIterResultObject(undefined, true);
      }
      if (state.inner) try {
        iteratorClose(state.inner.iterator, 'normal');
      } catch (error) {
        return iteratorClose(iterator, 'throw', error);
      }
      if (iterator) iteratorClose(iterator, 'normal');
      return createIterResultObject(undefined, true);
    }
  });
};

var WrapForValidIteratorPrototype = createIteratorProxyPrototype(true);
var IteratorHelperPrototype = createIteratorProxyPrototype(false);

createNonEnumerableProperty(IteratorHelperPrototype, TO_STRING_TAG, 'Iterator Helper');

module.exports = function (nextHandler, IS_ITERATOR, RETURN_HANDLER_RESULT) {
  var IteratorProxy = function Iterator(record, state) {
    if (state) {
      state.iterator = record.iterator;
      state.next = record.next;
    } else state = record;
    state.type = IS_ITERATOR ? WRAP_FOR_VALID_ITERATOR : ITERATOR_HELPER;
    state.returnHandlerResult = !!RETURN_HANDLER_RESULT;
    state.nextHandler = nextHandler;
    state.counter = 0;
    state.done = false;
    setInternalState(this, state);
  };

  IteratorProxy.prototype = IS_ITERATOR ? WrapForValidIteratorPrototype : IteratorHelperPrototype;

  return IteratorProxy;
};


/***/ }),

/***/ 9504:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var NATIVE_BIND = __webpack_require__(616);

var FunctionPrototype = Function.prototype;
var call = FunctionPrototype.call;
// eslint-disable-next-line es/no-function-prototype-bind -- safe
var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);

module.exports = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
  return function () {
    return call.apply(fn, arguments);
  };
};


/***/ }),

/***/ 9519:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var globalThis = __webpack_require__(4576);
var userAgent = __webpack_require__(2839);

var process = globalThis.process;
var Deno = globalThis.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;


/***/ }),

/***/ 9539:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var call = __webpack_require__(9565);
var anObject = __webpack_require__(8551);
var getMethod = __webpack_require__(5966);

module.exports = function (iterator, kind, value) {
  var innerResult, innerError;
  anObject(iterator);
  try {
    innerResult = getMethod(iterator, 'return');
    if (!innerResult) {
      if (kind === 'throw') throw value;
      return value;
    }
    innerResult = call(innerResult, iterator);
  } catch (error) {
    innerError = true;
    innerResult = error;
  }
  if (kind === 'throw') throw value;
  if (innerError) throw innerResult;
  anObject(innerResult);
  return value;
};


/***/ }),

/***/ 9565:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var NATIVE_BIND = __webpack_require__(616);

var call = Function.prototype.call;
// eslint-disable-next-line es/no-function-prototype-bind -- safe
module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};


/***/ }),

/***/ 9617:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var toIndexedObject = __webpack_require__(5397);
var toAbsoluteIndex = __webpack_require__(5610);
var lengthOfArrayLike = __webpack_require__(6198);

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    if (length === 0) return !IS_INCLUDES && -1;
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el !== el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value !== value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	!function() {
/******/ 		__webpack_require__.p = "";
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  BasicForm: function() { return /* reexport */ Form; },
  BasicPagination: function() { return /* reexport */ Pagination; },
  BasicTable: function() { return /* reexport */ Table; },
  "default": function() { return /* binding */ entry_lib; }
});

;// ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
/* eslint-disable no-var */
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var currentScript = window.document.currentScript
  if (false) { var getCurrentScript; }

  var src = currentScript && currentScript.src.match(/(.+\/)[^/]+\.js(\?.*)?$/)
  if (src) {
    __webpack_require__.p = src[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-82.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./packages/Form/src/BasicForm.vue?vue&type=template&id=e36e8cca&scoped=true
var render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('el-form', _vm._g(_vm._b({
    ref: "formRef",
    attrs: {
      "model": _vm.formData,
      "rules": _vm.rules
    }
  }, 'el-form', _vm.$attrs, false), _vm.$listeners), [_c('el-row', {
    attrs: {
      "gutter": 20,
      "type": "flex"
    }
  }, [_vm._l(_vm.formList, function (item, index) {
    return [item.slot ? _c('FormSlot', {
      key: index,
      attrs: {
        "form-item": item
      }
    }, [_vm._t(item.slot)], 2) : _c('FormItem', {
      key: index,
      attrs: {
        "form-item": item
      },
      model: {
        value: _vm.formData[item.formItemAttrs.prop],
        callback: function ($$v) {
          _vm.$set(_vm.formData, item.formItemAttrs.prop, $$v);
        },
        expression: "formData[item.formItemAttrs.prop]"
      }
    })];
  }), _vm.$listeners.ok || _vm.$listeners.reset ? _c('el-col', {
    staticClass: "form-btn"
  }, [_vm.$listeners.ok ? _c('el-button', {
    attrs: {
      "type": "primary",
      "icon": "el-icon-search"
    },
    on: {
      "click": function ($event) {
        return _vm.$emit('ok');
      }
    }
  }, [_vm._v(_vm._s(_vm.okText))]) : _vm._e(), _vm.$listeners.reset ? _c('el-button', {
    attrs: {
      "icon": "el-icon-refresh-right"
    },
    on: {
      "click": function ($event) {
        return _vm.$emit('reset');
      }
    }
  }, [_vm._v(_vm._s(_vm.resetText))]) : _vm._e(), _vm._t("afterBtn")], 2) : _vm._e(), _vm._t("button")], 2)], 1);
};
var staticRenderFns = [];

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.iterator.constructor.js
var es_iterator_constructor = __webpack_require__(8111);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.iterator.for-each.js
var es_iterator_for_each = __webpack_require__(7588);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.iterator.map.js
var es_iterator_map = __webpack_require__(1701);
;// ./packages/Form/src/const.js
const dateFormatMap = {
  year: 'yyyy',
  month: '',
  date: 'yyyy-MM-dd',
  dates: 'yyyy-MM-dd',
  months: '',
  years: 'yyyy',
  week: 'yyyy 第 WW 周',
  datetime: 'yyyy-MM-dd HH:mm:ss',
  datetimerange: 'yyyy-MM-dd HH:mm:ss',
  daterange: 'yyyy-MM-dd',
  monthrange: ''
};
const dateTypes = Object.keys(dateFormatMap);
;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-82.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./packages/Form/src/FormItem.vue?vue&type=template&id=75f43a2f
var FormItemvue_type_template_id_75f43a2f_render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('el-col', _vm._b({}, 'el-col', _vm.colAttrs, false), [_c('el-form-item', _vm._b({}, 'el-form-item', _vm.formItemAttrs, false), [_vm.isShow('input') ? _c('MyInput', _vm._g(_vm._b({}, 'MyInput', _vm.Attrs, false), _vm.Listeners)) : _vm.isShow('select') ? _c('MySelect', _vm._g(_vm._b({}, 'MySelect', _vm.Attrs, false), _vm.Listeners)) : _vm.isShow(_vm.dateTypes) ? _c('MyDate', _vm._g(_vm._b({}, 'MyDate', _vm.Attrs, false), _vm.Listeners)) : _vm._e()], 1)], 1);
};
var FormItemvue_type_template_id_75f43a2f_staticRenderFns = [];

;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-82.use[1]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./packages/Form/src/components/Input.vue?vue&type=script&lang=js


/* harmony default export */ var Inputvue_type_script_lang_js = ({
  name: 'MyInput',
  props: {
    slots: {
      type: Object,
      default: () => {}
    }
  },
  render(h) {
    return h("el-input", {
      "attrs": {
        ...this.$attrs
      },
      "on": {
        ...this.$listeners
      }
    }, [Object.keys(this.slots).map(key => h("template", {
      "slot": key
    }, [this.slots[key](h)]))]);
  }
});
;// ./packages/Form/src/components/Input.vue?vue&type=script&lang=js
 /* harmony default export */ var components_Inputvue_type_script_lang_js = (Inputvue_type_script_lang_js); 
;// ./node_modules/@vue/vue-loader-v15/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent(
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */,
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options =
    typeof scriptExports === 'function' ? scriptExports.options : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) {
    // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
          injectStyles.call(
            this,
            (options.functional ? this.parent : this).$root.$options.shadowRoot
          )
        }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

;// ./packages/Form/src/components/Input.vue
var Input_render, Input_staticRenderFns
;



/* normalize component */
;
var component = normalizeComponent(
  components_Inputvue_type_script_lang_js,
  Input_render,
  Input_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var Input = (component.exports);
;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-82.use[1]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./packages/Form/src/components/Select.vue?vue&type=script&lang=js


/* harmony default export */ var Selectvue_type_script_lang_js = ({
  name: 'MySelect',
  props: {
    slots: {
      type: Object,
      default: () => {}
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  render(h) {
    return h("el-select", {
      "attrs": {
        ...this.$attrs
      },
      "on": {
        ...this.$listeners
      }
    }, [Object.keys(this.slots).map(key => h("template", {
      "slot": key
    }, [this.slots[key](h)])), this.options.map(item => h("el-option", {
      "key": item.value,
      "attrs": {
        "label": item.label,
        "value": item.value
      }
    }))]);
  }
});
;// ./packages/Form/src/components/Select.vue?vue&type=script&lang=js
 /* harmony default export */ var components_Selectvue_type_script_lang_js = (Selectvue_type_script_lang_js); 
;// ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-54.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-54.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-54.use[2]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./packages/Form/src/components/Select.vue?vue&type=style&index=0&id=28437e23&prod&scoped=true&lang=css
// extracted by mini-css-extract-plugin

;// ./packages/Form/src/components/Select.vue?vue&type=style&index=0&id=28437e23&prod&scoped=true&lang=css

;// ./packages/Form/src/components/Select.vue
var Select_render, Select_staticRenderFns
;

;


/* normalize component */

var Select_component = normalizeComponent(
  components_Selectvue_type_script_lang_js,
  Select_render,
  Select_staticRenderFns,
  false,
  null,
  "28437e23",
  null
  
)

/* harmony default export */ var Select = (Select_component.exports);
;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-82.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./packages/Form/src/components/Date.vue?vue&type=template&id=7d076e70&scoped=true
var Datevue_type_template_id_7d076e70_scoped_true_render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('el-date-picker', _vm._g(_vm._b({
    staticStyle: {
      "width": "100%"
    }
  }, 'el-date-picker', _vm.Attrs, false), _vm.$listeners));
};
var Datevue_type_template_id_7d076e70_scoped_true_staticRenderFns = [];

;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-82.use[1]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./packages/Form/src/components/Date.vue?vue&type=script&lang=js

/* harmony default export */ var Datevue_type_script_lang_js = ({
  name: 'MyDate',
  computed: {
    Attrs() {
      return {
        'value-format': dateFormatMap[this.$attrs.type] || '',
        ...this.$attrs
      };
    }
  }
});
;// ./packages/Form/src/components/Date.vue?vue&type=script&lang=js
 /* harmony default export */ var components_Datevue_type_script_lang_js = (Datevue_type_script_lang_js); 
;// ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-54.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-54.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-54.use[2]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./packages/Form/src/components/Date.vue?vue&type=style&index=0&id=7d076e70&prod&scoped=true&lang=css
// extracted by mini-css-extract-plugin

;// ./packages/Form/src/components/Date.vue?vue&type=style&index=0&id=7d076e70&prod&scoped=true&lang=css

;// ./packages/Form/src/components/Date.vue



;


/* normalize component */

var Date_component = normalizeComponent(
  components_Datevue_type_script_lang_js,
  Datevue_type_template_id_7d076e70_scoped_true_render,
  Datevue_type_template_id_7d076e70_scoped_true_staticRenderFns,
  false,
  null,
  "7d076e70",
  null
  
)

/* harmony default export */ var components_Date = (Date_component.exports);
;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-82.use[1]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./packages/Form/src/FormItem.vue?vue&type=script&lang=js




/* harmony default export */ var FormItemvue_type_script_lang_js = ({
  name: 'FormItem',
  components: {
    MyInput: Input,
    MySelect: Select,
    MyDate: components_Date
  },
  props: {
    formItem: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dateTypes: dateTypes
    };
  },
  computed: {
    colAttrs() {
      const col = this.formItem.colAttrs;
      const obj = col && col.span ? {} : {
        lg: 6,
        md: 8,
        sm: 12
      };
      return {
        ...obj,
        ...col
      };
    },
    formItemAttrs() {
      return {
        label: '',
        ...this.formItem.formItemAttrs
      };
    },
    Attrs() {
      return {
        ...this.placeholder,
        ...this.$attrs,
        ...this.formItem.attrs,
        type: this.formItem.type,
        slots: this.formItem.slots || {}
      };
    },
    Listeners() {
      return {
        ...this.$listeners,
        ...this.formItem.listeners
      };
    },
    // 提示语
    placeholder() {
      const frontMsg = this.formItem.type === 'input' ? '请输入' : '请选择';
      const label = this.formItemAttrs.label;
      return {
        placeholder: frontMsg + label
      };
    }
  },
  methods: {
    isShow(val) {
      if (Array.isArray(val)) {
        return val.includes(this.formItem.type);
      }
      return this.formItem.type === val;
    }
  }
});
;// ./packages/Form/src/FormItem.vue?vue&type=script&lang=js
 /* harmony default export */ var src_FormItemvue_type_script_lang_js = (FormItemvue_type_script_lang_js); 
;// ./packages/Form/src/FormItem.vue





/* normalize component */
;
var FormItem_component = normalizeComponent(
  src_FormItemvue_type_script_lang_js,
  FormItemvue_type_template_id_75f43a2f_render,
  FormItemvue_type_template_id_75f43a2f_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var FormItem = (FormItem_component.exports);
;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-82.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./packages/Form/src/FormSlot.vue?vue&type=template&id=7cf5f0b8
var FormSlotvue_type_template_id_7cf5f0b8_render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('el-col', _vm._b({}, 'el-col', _vm.colAttrs, false), [_c('el-form-item', _vm._b({}, 'el-form-item', _vm.formItemAttrs, false), [_vm._t("default")], 2)], 1);
};
var FormSlotvue_type_template_id_7cf5f0b8_staticRenderFns = [];

;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-82.use[1]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./packages/Form/src/FormSlot.vue?vue&type=script&lang=js
/* harmony default export */ var FormSlotvue_type_script_lang_js = ({
  name: 'FormSlot',
  props: {
    formItem: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    colAttrs() {
      const col = this.formItem.colAttrs;
      const obj = col && col.span ? {} : {
        lg: 6,
        md: 8,
        sm: 12
      };
      return {
        ...obj,
        ...col
      };
    },
    formItemAttrs() {
      return {
        label: '',
        ...this.formItem.formItemAttrs
      };
    }
  }
});
;// ./packages/Form/src/FormSlot.vue?vue&type=script&lang=js
 /* harmony default export */ var src_FormSlotvue_type_script_lang_js = (FormSlotvue_type_script_lang_js); 
;// ./packages/Form/src/FormSlot.vue





/* normalize component */
;
var FormSlot_component = normalizeComponent(
  src_FormSlotvue_type_script_lang_js,
  FormSlotvue_type_template_id_7cf5f0b8_render,
  FormSlotvue_type_template_id_7cf5f0b8_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var FormSlot = (FormSlot_component.exports);
;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-82.use[1]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./packages/Form/src/BasicForm.vue?vue&type=script&lang=js






/* harmony default export */ var BasicFormvue_type_script_lang_js = ({
  name: 'BasicForm',
  components: {
    FormItem: FormItem,
    FormSlot: FormSlot
  },
  props: {
    okText: {
      type: String,
      default: '查询'
    },
    resetText: {
      type: String,
      default: '重置'
    },
    slotParams: {
      type: Object,
      default: () => ({})
    },
    formList: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    slotParams: {
      handler(val) {
        this.formData = {
          ...this.formData,
          ...val
        };
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      formData: {},
      rules: {}
    };
  },
  created() {
    this.initRules();
  },
  methods: {
    // 初始化校验规则
    initRules() {
      const typeList = ['input'];
      const trigger = ['blur', 'change'];
      this.formList.forEach(item => {
        // 解构赋值
        const {
          type,
          formItemAttrs: {
            required,
            prop,
            label
          }
        } = item;
        // 初始化字段
        if (type) {
          this.$set(this.formData, prop, '');
        }
        // 初始化校验规则
        if (required) {
          const frontMsg = typeList.includes(item.type) ? '请输入' : '请选择';
          const message = frontMsg + label;
          // this.$set(this.rules, prop, [{ required: true, message, trigger }])
          this.rules[prop] = [{
            required: true,
            message,
            trigger
          }];
        }
      });
    },
    // 校验整个表单
    validate() {
      // eslint-disable-next-line
      return new Promise(async (resolve, reject) => {
        try {
          await this.$refs.formRef.validate();
          resolve(this.formData);
        } catch (error) {
          reject(error);
        }
      });
    },
    // 重置表单
    resetFields() {
      this.$refs.formRef.resetFields();
      // 这里需要处理时间表单的重置
      this.formList.map(item => dateTypes.includes(item.type) ? item.formItemAttrs.prop : false).forEach(item => item && (this.formData[item] = null));
    },
    // 获取表单数据
    getFormData() {
      return this.formData;
    }
  }
});
;// ./packages/Form/src/BasicForm.vue?vue&type=script&lang=js
 /* harmony default export */ var src_BasicFormvue_type_script_lang_js = (BasicFormvue_type_script_lang_js); 
;// ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-54.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-54.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-54.use[2]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./packages/Form/src/BasicForm.vue?vue&type=style&index=0&id=e36e8cca&prod&scoped=true&lang=css
// extracted by mini-css-extract-plugin

;// ./packages/Form/src/BasicForm.vue?vue&type=style&index=0&id=e36e8cca&prod&scoped=true&lang=css

;// ./packages/Form/src/BasicForm.vue



;


/* normalize component */

var BasicForm_component = normalizeComponent(
  src_BasicFormvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  "e36e8cca",
  null
  
)

/* harmony default export */ var BasicForm = (BasicForm_component.exports);
;// ./packages/Form/index.js

/* harmony default export */ var Form = (BasicForm);
;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-82.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./packages/Pagination/src/BasicPagination.vue?vue&type=template&id=2432ce63&scoped=true
var BasicPaginationvue_type_template_id_2432ce63_scoped_true_render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('el-pagination', _vm._b({
    attrs: {
      "current-page": _vm.currentPage,
      "page-size": _vm.pageSize,
      "total": _vm.total,
      "layout": _vm.layout,
      "page-sizes": _vm.pageSizes,
      "background": _vm.background
    },
    on: {
      "update:currentPage": function ($event) {
        _vm.currentPage = $event;
      },
      "update:current-page": function ($event) {
        _vm.currentPage = $event;
      },
      "update:pageSize": function ($event) {
        _vm.pageSize = $event;
      },
      "update:page-size": function ($event) {
        _vm.pageSize = $event;
      },
      "size-change": _vm.handleSizeChange,
      "current-change": _vm.handleCurrentChange
    }
  }, 'el-pagination', _vm.$attrs, false));
};
var BasicPaginationvue_type_template_id_2432ce63_scoped_true_staticRenderFns = [];

;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-82.use[1]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./packages/Pagination/src/BasicPagination.vue?vue&type=script&lang=js
/* harmony default export */ var BasicPaginationvue_type_script_lang_js = ({
  name: 'BasicPagination',
  props: {
    current: {
      type: Number,
      default: 1
    },
    size: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      required: true
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    pageSizes: {
      type: Array,
      default: () => [10, 50, 100, 500]
    },
    background: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.current;
      },
      set(val) {
        this.$emit('update:current', val);
      }
    },
    pageSize: {
      get() {
        return this.size;
      },
      set(val) {
        this.$emit('update:size', val);
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('pagination', {
        current: this.currentPage,
        size: val
      });
    },
    handleCurrentChange(val) {
      this.$emit('pagination', {
        current: val,
        size: this.pageSize
      });
    }
  }
});
;// ./packages/Pagination/src/BasicPagination.vue?vue&type=script&lang=js
 /* harmony default export */ var src_BasicPaginationvue_type_script_lang_js = (BasicPaginationvue_type_script_lang_js); 
;// ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-54.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-54.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-54.use[2]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./packages/Pagination/src/BasicPagination.vue?vue&type=style&index=0&id=2432ce63&prod&scoped=true&lang=css
// extracted by mini-css-extract-plugin

;// ./packages/Pagination/src/BasicPagination.vue?vue&type=style&index=0&id=2432ce63&prod&scoped=true&lang=css

;// ./packages/Pagination/src/BasicPagination.vue



;


/* normalize component */

var BasicPagination_component = normalizeComponent(
  src_BasicPaginationvue_type_script_lang_js,
  BasicPaginationvue_type_template_id_2432ce63_scoped_true_render,
  BasicPaginationvue_type_template_id_2432ce63_scoped_true_staticRenderFns,
  false,
  null,
  "2432ce63",
  null
  
)

/* harmony default export */ var BasicPagination = (BasicPagination_component.exports);
;// ./packages/Pagination/index.js

/* harmony default export */ var Pagination = (BasicPagination);
;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-82.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/templateLoader.js??ruleSet[1].rules[3]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./packages/Table/src/BasicTable.vue?vue&type=template&id=419e6a8e&scoped=true
var BasicTablevue_type_template_id_419e6a8e_scoped_true_render = function render() {
  var _vm = this,
    _c = _vm._self._c;
  return _c('div', {
    ref: "basicTableRef",
    staticClass: "basicTable"
  }, [_vm.showTable ? _c('el-table', _vm._g(_vm._b({
    ref: "tableRef"
  }, 'el-table', _vm.tableAttrs, false), _vm.$listeners), [_vm._l(_vm.renderColumns, function (column, i) {
    return [column.slot ? _vm._t(column.slot) : _c('el-table-column', _vm._b({
      key: column.prop || i
    }, 'el-table-column', _vm.columnAttrs(column), false))];
  })], 2) : _vm._e(), _vm.showPagination ? _c('BasicPagination', _vm._g(_vm._b({}, 'BasicPagination', _vm.pagination, false), _vm.pagination.events)) : _vm._e()], 1);
};
var BasicTablevue_type_template_id_419e6a8e_scoped_true_staticRenderFns = [];

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.iterator.find.js
var es_iterator_find = __webpack_require__(116);
// EXTERNAL MODULE: ./node_modules/element-resize-detector/src/element-resize-detector.js
var element_resize_detector = __webpack_require__(2077);
var element_resize_detector_default = /*#__PURE__*/__webpack_require__.n(element_resize_detector);
;// ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-82.use[1]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./packages/Table/src/BasicTable.vue?vue&type=script&lang=js





/* harmony default export */ var BasicTablevue_type_script_lang_js = ({
  name: 'BasicTable',
  components: {
    BasicPagination: Pagination
  },
  props: {
    columns: {
      type: Array,
      required: true,
      default: () => []
    },
    // 是否自动撑开, false 时需要设置高度height属性
    autoHeight: {
      type: Boolean,
      default: true
    },
    pagination: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      THeight: 0 // table 高度
    };
  },
  computed: {
    showTable() {
      if (this.autoHeight) return this.THeight > 0;
      return true;
    },
    tableAttrs() {
      return {
        height: this.tableHeight,
        border: true,
        ...this.$attrs
      };
    },
    tableHeight() {
      return this.autoHeight ? this.THeight : undefined;
    },
    showPagination() {
      return this.pagination && this.pagination.total >= 0;
    },
    renderColumns() {
      return this.columns.map(column => {
        if (column.options) {
          column.formatter = this.formatterFn(column.options);
        }
        return column;
      });
    }
  },
  mounted() {
    this.initHeight();
  },
  methods: {
    // 初始化高度
    initHeight() {
      const basicTableRef = this.resetHeight();
      element_resize_detector_default()().listenTo(basicTableRef, this.resetHeight); // 监听变化
    },
    // 重置高度
    resetHeight() {
      const dom = this.$refs.basicTableRef;
      const pageHeight = this.showPagination ? 50 : 0;
      this.THeight = dom.clientHeight - pageHeight;
      return dom;
    },
    columnAttrs(column) {
      return {
        align: 'center',
        ...column
      };
    },
    // 格式化函数
    formatterFn(options = []) {
      return (_, __, cellValue) => {
        const cont = options.find(item => item.value == cellValue);
        if (cont) return cont.label;
        return '';
      };
    }
  }
});
;// ./packages/Table/src/BasicTable.vue?vue&type=script&lang=js
 /* harmony default export */ var src_BasicTablevue_type_script_lang_js = (BasicTablevue_type_script_lang_js); 
;// ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-54.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-54.use[1]!./node_modules/@vue/vue-loader-v15/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-54.use[2]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./packages/Table/src/BasicTable.vue?vue&type=style&index=0&id=419e6a8e&prod&scoped=true&lang=css
// extracted by mini-css-extract-plugin

;// ./packages/Table/src/BasicTable.vue?vue&type=style&index=0&id=419e6a8e&prod&scoped=true&lang=css

;// ./packages/Table/src/BasicTable.vue



;


/* normalize component */

var BasicTable_component = normalizeComponent(
  src_BasicTablevue_type_script_lang_js,
  BasicTablevue_type_template_id_419e6a8e_scoped_true_render,
  BasicTablevue_type_template_id_419e6a8e_scoped_true_staticRenderFns,
  false,
  null,
  "419e6a8e",
  null
  
)

/* harmony default export */ var BasicTable = (BasicTable_component.exports);
;// ./packages/Table/index.js

/* harmony default export */ var Table = (BasicTable);
;// ./packages/index.js
// import { message } from './message.js'




/* harmony default export */ var packages_0 = ({
  install(Vue) {
    // 在此处添加自定义的全局组件
    Vue.component('BasicForm', Form);
    Vue.component('BasicPagination', Pagination);
    Vue.component('BasicTable', Table);
    //在此处添加自定义的全局方法
    // Vue.prototype.$message = message
  }
});
;// ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = (packages_0);


/******/ 	return __webpack_exports__;
/******/ })()
;
});