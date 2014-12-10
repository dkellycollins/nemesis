define('eventObject',["require", "exports"], function (require, exports) {
    /**
     * An object that can emit events.
     */
    var eventObject = (function () {
        /**
         * Default constructor.
         */
        function eventObject() {
            this._events = {};
        }
        /**
         * Registers a new event. An event should be registered before emit for that event is called.
         * @param eventName The name of the event.
         */
        eventObject.prototype.registerEvent = function (eventName) {
            this._events[eventName] = [];
        };
        /**
         * Registers an event handler. When the given event is emitted, the given handler will be called.
         * @param eventName The name of the event.
         * @param handler The function to call when the event is emitted.
         */
        eventObject.prototype.on = function (eventName, handler) {
            this._events[eventName].push(handler);
        };
        /**
         * Emits the given event. Only objects that inherite eventObject should call this method.
         * @param eventName The name of the event.
         * @param args The arguments to pass to the event handlers.
         */
        eventObject.prototype.emit = function (eventName) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this._events[eventName].forEach(function (handler) {
                handler(args);
            });
        };
        return eventObject;
    })();
    return eventObject;
});

///<reference path="./logger.d.ts" />
define('util/logger/consoleLogger',["require", "exports"], function (require, exports) {
    /**
     * Logs messages to the console.
     */
    var consoleLogger;
    (function (consoleLogger) {
        /**
         * The maximum number of error that can be logged before the logger is disabled.
         * @type {number}
         * @private
         */
        var _MAX_ERRORS_REPORTED = 500;
        /**
         * The total number of errors reported.
         * @type {number}
         * @private
         */
        var _errorsReported = 0;
        /**
         * Logs a standard message to the console
         * @param msg The message to log
         */
        function log(msg) {
            if (_errorsReported > _MAX_ERRORS_REPORTED) {
                return;
            }
            console.log(msg);
        }
        consoleLogger.log = log;
        /**
         * Logs an error message to the console
         * @param msg The message to log
         * @param e Error information
         */
        function logError(msg, e) {
            if (_errorsReported > _MAX_ERRORS_REPORTED) {
                return;
            }
            console.error(msg);
            if (!!e) {
                console.error(e.toString());
            }
            _errorsReported++;
            if (_errorsReported > _MAX_ERRORS_REPORTED) {
                log("Max errors reached. Disabling log.");
            }
        }
        consoleLogger.logError = logError;
    })(consoleLogger || (consoleLogger = {}));
    return consoleLogger;
});

///<reference path="../../lib/lodash/lodash.d.ts" />
define('canvas',["require", "exports", "util/logger/consoleLogger"], function (require, exports, logger) {
    /**
     * The canvas element on the page.
     * Will retrieve any element with a nemesis attribute or just the first canvas element on the page.
     */
    var elements = document.getElementsByTagName('canvas');
    var canvas;
    if (elements.length == 0) {
        logger.logError('No canvas elements found.');
    }
    else {
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].hasAttribute('nemesis')) {
                canvas = elements[i];
                break;
            }
        }
        canvas = canvas || elements[0];
        //Fullscreen option must be handled here
        if (canvas.getAttribute("fullscreen") == "true") {
            canvas.height = window.innerHeight;
            canvas.width = window.innerWidth;
        }
    }
    return canvas;
});

define('input/keyboard',["require", "exports", '../canvas'], function (require, exports, canvas) {
    /**
     * Keeps track of the current state of the keyboard.
     */
    var keyboard;
    (function (keyboard) {
        /**
         * The state of all keys on the keyboard.
         * True indicates that the key is pressed.
         * @type {{}}
         * @private
         */
        var _state = {};
        /**
         * Gets the current state of a key.
         * @param keyName The name of the key as defined by
         * @returns {boolean}
         */
        function getKey(keyName) {
            return !!_state[keyName];
        }
        keyboard.getKey = getKey;
        /**
         * Handles the key up event.
         * @param event
         */
        function keyUp(event) {
            _state[event.code] = false;
        }
        /**
         * Handles the key down event.
         * @param event
         */
        function keyDown(event) {
            _state[event.code] = true;
        }
        //Setup event listeners
        canvas.addEventListener("keyup", keyUp, false);
        canvas.addEventListener("keydown", keyDown, false);
    })(keyboard || (keyboard = {}));
    return keyboard;
});

define('input/mouse',["require", "exports", '../canvas'], function (require, exports, canvas) {
    /**
     * Keeps track of the current state of the mouse.
     */
    var mouse;
    (function (mouse) {
        /**
         * The current x position of the mouse on the screen relative to the canvas.
         * @type {number}
         */
        mouse.posX = 0;
        /**
         * The current y position of the mouse on the screen relative to the canvas.
         * @type {number}
         */
        mouse.posY = 0;
        /**
         * The current state of the buttons on the mouse.
         * True indicates the button is pressed.
         * @type {{}}
         * @private
         */
        var _state = {};
        /**
         * Gets the current states of a button on the mouse.
         * @param b The button to check. The value should be a value from mouseButtons.
         * @returns {boolean} True if the button is currently pressed. False otherwise.
         */
        function getButton(b) {
            return _state[b];
        }
        mouse.getButton = getButton;
        /**
         * Handles the mouse down event.
         * @param e
         * @private
         */
        function _mouseDown(e) {
            _state[e.button] = true;
        }
        /**
         * Handles the mouse up event.
         * @param e
         * @private
         */
        function _mouseUp(e) {
            _state[e.button] = false;
        }
        /**
         * Handles the mouse leave event. Clears the state of the mouse.
         * @param e
         * @private
         */
        function _mouseLeave(e) {
            mouse.posX = 0;
            mouse.posY = 0;
            for (var button in _state) {
                _state[button] = false;
            }
        }
        /**
         * Handles the mouse enter event.
         * @param e
         * @private
         */
        function _mouseEnter(e) {
            mouse.posX = e.clientX;
            mouse.posY = e.clientY;
            for (var button in e.buttons) {
                _state[button] = true;
            }
        }
        /**
         * Handles the mouse move event.
         * @param e
         * @private
         */
        function _mouseMove(e) {
            mouse.posX = e.clientX;
            mouse.posY = e.clientY;
        }
        //Setup event listeners.
        canvas.addEventListener("mousedown", _mouseDown, false);
        canvas.addEventListener("mouseup", _mouseUp, false);
        canvas.addEventListener("mouseout", _mouseLeave, false);
        canvas.addEventListener("mouseenter", _mouseEnter, false);
        canvas.addEventListener("mousemove", _mouseMove, false);
    })(mouse || (mouse = {}));
    return mouse;
});

define('input/mouseButtons',["require", "exports"], function (require, exports) {
    /**
     * Enum for all the possible mouse buttons.
     */
    var mouseButtons;
    (function (mouseButtons) {
        /**
         * The left mouse button.
         * @type {number}
         */
        mouseButtons.LEFT = 0;
        /**
         * The middle button or scroll wheel.
         * @type {number}
         */
        mouseButtons.MIDDLE = 1;
        /**
         * The right button.
         * @type {number}
         */
        mouseButtons.RIGHT = 2;
    })(mouseButtons || (mouseButtons = {}));
    return mouseButtons;
});

define('input/index',["require", "exports", './keyboard', './mouse', './mouseButtons'], function (require, exports, keyboard_file, mouse_file, mouseButtons_file) {
    exports.keyboard = keyboard_file; ///ts:export:generated
    exports.mouse = mouse_file; ///ts:export:generated
    exports.mouseButtons = mouseButtons_file; ///ts:export:generated
});

/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

 Redistribution and use in source and binary forms, with or without modification,
 are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this
 list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */
define('math/glMatrix',["require", "exports"], function (require, exports) {
    /**
     * @class Common utilities
     * @name glMatrix
     */
    var glMatrix;
    (function (glMatrix) {
        glMatrix.GLMAT_EPSILON = 0.000001;
        glMatrix.GLMAT_ARRAY_TYPE = (typeof (Float32Array) !== 'undefined') ? Float32Array : Array;
        glMatrix.GLMAT_RANDOM = Math.random;
        var _degree = Math.PI / 180;
        /**
         * Sets the type of array used when creating new vectors and matrices
         *
         * @param {Type} type Array type, such as Float32Array or Array
         */
        function setMarixArrayType(type) {
            this.GLMAT_ARRAY_TYPE = type;
        }
        glMatrix.setMarixArrayType = setMarixArrayType;
        /**
         * Convert Degree To Radian
         *
         * @param {Number} Angle in Degrees
         */
        function toRadian(a) {
            return a * _degree;
        }
        glMatrix.toRadian = toRadian;
    })(glMatrix || (glMatrix = {}));
    return glMatrix;
});

/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

 Redistribution and use in source and binary forms, with or without modification,
 are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this
 list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */
define('math/mat2',["require", "exports", "./glMatrix"], function (require, exports, glMatrix) {
    /**
     * @class 2x2 Matrix
     * @name mat2
     */
    var mat2;
    (function (mat2) {
        /**
         * Creates a new identity mat2
         *
         * @returns {mat2} a new 2x2 matrix
         */
        function create() {
            var out = new glMatrix.GLMAT_ARRAY_TYPE(4);
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            return out;
        }
        mat2.create = create;
        /**
         * Creates a new mat2 initialized with values from an existing matrix
         *
         * @param {mat2} a matrix to clone
         * @returns {mat2} a new 2x2 matrix
         */
        function clone(a) {
            var out = new glMatrix.GLMAT_ARRAY_TYPE(4);
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            return out;
        }
        mat2.clone = clone;
        /**
         * Copy the values from one mat2 to another
         *
         * @param {mat2} out the receiving matrix
         * @param {mat2} a the source matrix
         * @returns {mat2} out
         */
        function copy(out, a) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            return out;
        }
        mat2.copy = copy;
        /**
         * Set a mat2 to the identity matrix
         *
         * @param {mat2} out the receiving matrix
         * @returns {mat2} out
         */
        function identity(out) {
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            return out;
        }
        mat2.identity = identity;
        /**
         * Transpose the values of a mat2
         *
         * @param {mat2} out the receiving matrix
         * @param {mat2} a the source matrix
         * @returns {mat2} out
         */
        function transpose(out, a) {
            // If we are transposing ourselves we can skip a few steps but have to cache some values
            if (out === a) {
                var a1 = a[1];
                out[1] = a[2];
                out[2] = a1;
            }
            else {
                out[0] = a[0];
                out[1] = a[2];
                out[2] = a[1];
                out[3] = a[3];
            }
            return out;
        }
        mat2.transpose = transpose;
        /**
         * Inverts a mat2
         *
         * @param {mat2} out the receiving matrix
         * @param {mat2} a the source matrix
         * @returns {mat2} out
         */
        function invert(out, a) {
            var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], 
            // Calculate the determinant
            det = a0 * a3 - a2 * a1;
            if (!det) {
                return null;
            }
            det = 1.0 / det;
            out[0] = a3 * det;
            out[1] = -a1 * det;
            out[2] = -a2 * det;
            out[3] = a0 * det;
            return out;
        }
        mat2.invert = invert;
        /**
         * Calculates the adjugate of a mat2
         *
         * @param {mat2} out the receiving matrix
         * @param {mat2} a the source matrix
         * @returns {mat2} out
         */
        function adjoint(out, a) {
            // Caching this value is nessecary if out == a
            var a0 = a[0];
            out[0] = a[3];
            out[1] = -a[1];
            out[2] = -a[2];
            out[3] = a0;
            return out;
        }
        mat2.adjoint = adjoint;
        /**
         * Calculates the determinant of a mat2
         *
         * @param {mat2} a the source matrix
         * @returns {Number} determinant of a
         */
        function determinant(a) {
            return a[0] * a[3] - a[2] * a[1];
        }
        mat2.determinant = determinant;
        /**
         * Multiplies two mat2's
         *
         * @param {mat2} out the receiving matrix
         * @param {mat2} a the first operand
         * @param {mat2} b the second operand
         * @returns {mat2} out
         */
        function multiply(out, a, b) {
            var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
            var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
            out[0] = a0 * b0 + a2 * b1;
            out[1] = a1 * b0 + a3 * b1;
            out[2] = a0 * b2 + a2 * b3;
            out[3] = a1 * b2 + a3 * b3;
            return out;
        }
        mat2.multiply = multiply;
        /**
         * Alias for {@link mat2.multiply}
         * @function
         */
        mat2.mul = mat2.multiply;
        /**
         * Rotates a mat2 by the given angle
         *
         * @param {mat2} out the receiving matrix
         * @param {mat2} a the matrix to rotate
         * @param {Number} rad the angle to rotate the matrix by
         * @returns {mat2} out
         */
        function rotate(out, a, rad) {
            var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], s = Math.sin(rad), c = Math.cos(rad);
            out[0] = a0 * c + a2 * s;
            out[1] = a1 * c + a3 * s;
            out[2] = a0 * -s + a2 * c;
            out[3] = a1 * -s + a3 * c;
            return out;
        }
        mat2.rotate = rotate;
        /**
         * Scales the mat2 by the dimensions in the given vec2
         *
         * @param {mat2} out the receiving matrix
         * @param {mat2} a the matrix to rotate
         * @param {vec2} v the vec2 to scale the matrix by
         * @returns {mat2} out
         **/
        function scale(out, a, v) {
            var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], v0 = v[0], v1 = v[1];
            out[0] = a0 * v0;
            out[1] = a1 * v0;
            out[2] = a2 * v1;
            out[3] = a3 * v1;
            return out;
        }
        mat2.scale = scale;
        /**
         * Returns a string representation of a mat2
         *
         * @param {mat2} mat matrix to represent as a string
         * @returns {String} string representation of the matrix
         */
        function str(a) {
            return 'mat2(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
        }
        mat2.str = str;
        /**
         * Returns Frobenius norm of a mat2
         *
         * @param {mat2} a the matrix to calculate Frobenius norm of
         * @returns {Number} Frobenius norm
         */
        function frob(a) {
            return (Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2)));
        }
        mat2.frob = frob;
        /**
         * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
         * @param {mat2} L the lower triangular matrix
         * @param {mat2} D the diagonal matrix
         * @param {mat2} U the upper triangular matrix
         * @param {mat2} a the input matrix to factorize
         */
        function LDU(L, D, U, a) {
            L[2] = a[2] / a[0];
            U[0] = a[0];
            U[1] = a[1];
            U[3] = a[3] - L[2] * U[1];
            return [L, D, U];
        }
        mat2.LDU = LDU;
    })(mat2 || (mat2 = {}));
    return mat2;
});

/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

 Redistribution and use in source and binary forms, with or without modification,
 are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this
 list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */
define('math/mat2d',["require", "exports", "./glMatrix"], function (require, exports, glMatrix) {
    /**
     * @class 2x3 Matrix
     * @name mat2d
     *
     * @description
     * A mat2d contains six elements defined as:
     * <pre>
     * [a, c, tx,
     *  b, d, ty]
     * </pre>
     * This is a short form for the 3x3 matrix:
     * <pre>
     * [a, c, tx,
     *  b, d, ty,
     *  0, 0, 1]
     * </pre>
     * The last row is ignored so the array is shorter and operations are faster.
     */
    var mat2d;
    (function (mat2d) {
        /**
         * Creates a new identity mat2d
         *
         * @returns {mat2d} a new 2x3 matrix
         */
        function create() {
            var out = new glMatrix.GLMAT_ARRAY_TYPE(6);
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            out[4] = 0;
            out[5] = 0;
            return out;
        }
        mat2d.create = create;
        /**
         * Creates a new mat2d initialized with values from an existing matrix
         *
         * @param {mat2d} a matrix to clone
         * @returns {mat2d} a new 2x3 matrix
         */
        function clone(a) {
            var out = new glMatrix.GLMAT_ARRAY_TYPE(6);
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            out[4] = a[4];
            out[5] = a[5];
            return out;
        }
        mat2d.clone = clone;
        /**
         * Copy the values from one mat2d to another
         *
         * @param {mat2d} out the receiving matrix
         * @param {mat2d} a the source matrix
         * @returns {mat2d} out
         */
        function copy(out, a) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            out[4] = a[4];
            out[5] = a[5];
            return out;
        }
        mat2d.copy = copy;
        /**
         * Set a mat2d to the identity matrix
         *
         * @param {mat2d} out the receiving matrix
         * @returns {mat2d} out
         */
        function identity(out) {
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            out[4] = 0;
            out[5] = 0;
            return out;
        }
        mat2d.identity = identity;
        /**
         * Inverts a mat2d
         *
         * @param {mat2d} out the receiving matrix
         * @param {mat2d} a the source matrix
         * @returns {mat2d} out
         */
        function invert(out, a) {
            var aa = a[0], ab = a[1], ac = a[2], ad = a[3], atx = a[4], aty = a[5];
            var det = aa * ad - ab * ac;
            if (!det) {
                return null;
            }
            det = 1.0 / det;
            out[0] = ad * det;
            out[1] = -ab * det;
            out[2] = -ac * det;
            out[3] = aa * det;
            out[4] = (ac * aty - ad * atx) * det;
            out[5] = (ab * atx - aa * aty) * det;
            return out;
        }
        mat2d.invert = invert;
        /**
         * Calculates the determinant of a mat2d
         *
         * @param {mat2d} a the source matrix
         * @returns {Number} determinant of a
         */
        function determinant(a) {
            return a[0] * a[3] - a[1] * a[2];
        }
        mat2d.determinant = determinant;
        /**
         * Multiplies two mat2d's
         *
         * @param {mat2d} out the receiving matrix
         * @param {mat2d} a the first operand
         * @param {mat2d} b the second operand
         * @returns {mat2d} out
         */
        function multiply(out, a, b) {
            var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
            out[0] = a0 * b0 + a2 * b1;
            out[1] = a1 * b0 + a3 * b1;
            out[2] = a0 * b2 + a2 * b3;
            out[3] = a1 * b2 + a3 * b3;
            out[4] = a0 * b4 + a2 * b5 + a4;
            out[5] = a1 * b4 + a3 * b5 + a5;
            return out;
        }
        mat2d.multiply = multiply;
        /**
         * Alias for {@link mat2d.multiply}
         * @function
         */
        mat2d.mul = mat2d.multiply;
        /**
         * Rotates a mat2d by the given angle
         *
         * @param {mat2d} out the receiving matrix
         * @param {mat2d} a the matrix to rotate
         * @param {Number} rad the angle to rotate the matrix by
         * @returns {mat2d} out
         */
        function rotate(out, a, rad) {
            var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], s = Math.sin(rad), c = Math.cos(rad);
            out[0] = a0 * c + a2 * s;
            out[1] = a1 * c + a3 * s;
            out[2] = a0 * -s + a2 * c;
            out[3] = a1 * -s + a3 * c;
            out[4] = a4;
            out[5] = a5;
            return out;
        }
        mat2d.rotate = rotate;
        /**
         * Scales the mat2d by the dimensions in the given vec2
         *
         * @param {mat2d} out the receiving matrix
         * @param {mat2d} a the matrix to translate
         * @param {vec2} v the vec2 to scale the matrix by
         * @returns {mat2d} out
         **/
        function scale(out, a, v) {
            var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], v0 = v[0], v1 = v[1];
            out[0] = a0 * v0;
            out[1] = a1 * v0;
            out[2] = a2 * v1;
            out[3] = a3 * v1;
            out[4] = a4;
            out[5] = a5;
            return out;
        }
        mat2d.scale = scale;
        /**
         * Translates the mat2d by the dimensions in the given vec2
         *
         * @param {mat2d} out the receiving matrix
         * @param {mat2d} a the matrix to translate
         * @param {vec2} v the vec2 to translate the matrix by
         * @returns {mat2d} out
         **/
        function translate(out, a, v) {
            var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], v0 = v[0], v1 = v[1];
            out[0] = a0;
            out[1] = a1;
            out[2] = a2;
            out[3] = a3;
            out[4] = a0 * v0 + a2 * v1 + a4;
            out[5] = a1 * v0 + a3 * v1 + a5;
            return out;
        }
        mat2d.translate = translate;
        /**
         * Returns a string representation of a mat2d
         *
         * @param {mat2d} a matrix to represent as a string
         * @returns {String} string representation of the matrix
         */
        function str(a) {
            return 'mat2d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' + a[4] + ', ' + a[5] + ')';
        }
        mat2d.str = str;
        /**
         * Returns Frobenius norm of a mat2d
         *
         * @param {mat2d} a the matrix to calculate Frobenius norm of
         * @returns {Number} Frobenius norm
         */
        function frob(a) {
            return (Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + 1));
        }
        mat2d.frob = frob;
    })(mat2d || (mat2d = {}));
    return mat2d;
});

/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

 Redistribution and use in source and binary forms, with or without modification,
 are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this
 list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */
define('math/mat3',["require", "exports", "./glMatrix"], function (require, exports, glMatrix) {
    /**
     * @class 3x3 Matrix
     * @name mat3
     */
    var mat3;
    (function (mat3) {
        /**
         * Creates a new identity mat3
         *
         * @returns {mat3} a new 3x3 matrix
         */
        function create() {
            var out = new glMatrix.GLMAT_ARRAY_TYPE(9);
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 1;
            out[5] = 0;
            out[6] = 0;
            out[7] = 0;
            out[8] = 1;
            return out;
        }
        mat3.create = create;
        /**
         * Copies the upper-left 3x3 values into the given mat3.
         *
         * @param {mat3} out the receiving 3x3 matrix
         * @param {mat4} a   the source 4x4 matrix
         * @returns {mat3} out
         */
        function fromMat4(out, a) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[4];
            out[4] = a[5];
            out[5] = a[6];
            out[6] = a[8];
            out[7] = a[9];
            out[8] = a[10];
            return out;
        }
        mat3.fromMat4 = fromMat4;
        /**
         * Creates a new mat3 initialized with values from an existing matrix
         *
         * @param {mat3} a matrix to clone
         * @returns {mat3} a new 3x3 matrix
         */
        function clone(a) {
            var out = new glMatrix.GLMAT_ARRAY_TYPE(9);
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            out[4] = a[4];
            out[5] = a[5];
            out[6] = a[6];
            out[7] = a[7];
            out[8] = a[8];
            return out;
        }
        mat3.clone = clone;
        /**
         * Copy the values from one mat3 to another
         *
         * @param {mat3} out the receiving matrix
         * @param {mat3} a the source matrix
         * @returns {mat3} out
         */
        function copy(out, a) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            out[4] = a[4];
            out[5] = a[5];
            out[6] = a[6];
            out[7] = a[7];
            out[8] = a[8];
            return out;
        }
        mat3.copy = copy;
        /**
         * Set a mat3 to the identity matrix
         *
         * @param {mat3} out the receiving matrix
         * @returns {mat3} out
         */
        function identity(out) {
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 1;
            out[5] = 0;
            out[6] = 0;
            out[7] = 0;
            out[8] = 1;
            return out;
        }
        mat3.identity = identity;
        /**
         * Transpose the values of a mat3
         *
         * @param {mat3} out the receiving matrix
         * @param {mat3} a the source matrix
         * @returns {mat3} out
         */
        function transpose(out, a) {
            // If we are transposing ourselves we can skip a few steps but have to cache some values
            if (out === a) {
                var a01 = a[1], a02 = a[2], a12 = a[5];
                out[1] = a[3];
                out[2] = a[6];
                out[3] = a01;
                out[5] = a[7];
                out[6] = a02;
                out[7] = a12;
            }
            else {
                out[0] = a[0];
                out[1] = a[3];
                out[2] = a[6];
                out[3] = a[1];
                out[4] = a[4];
                out[5] = a[7];
                out[6] = a[2];
                out[7] = a[5];
                out[8] = a[8];
            }
            return out;
        }
        mat3.transpose = transpose;
        /**
         * Inverts a mat3
         *
         * @param {mat3} out the receiving matrix
         * @param {mat3} a the source matrix
         * @returns {mat3} out
         */
        function invert(out, a) {
            var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], b01 = a22 * a11 - a12 * a21, b11 = -a22 * a10 + a12 * a20, b21 = a21 * a10 - a11 * a20, 
            // Calculate the determinant
            det = a00 * b01 + a01 * b11 + a02 * b21;
            if (!det) {
                return null;
            }
            det = 1.0 / det;
            out[0] = b01 * det;
            out[1] = (-a22 * a01 + a02 * a21) * det;
            out[2] = (a12 * a01 - a02 * a11) * det;
            out[3] = b11 * det;
            out[4] = (a22 * a00 - a02 * a20) * det;
            out[5] = (-a12 * a00 + a02 * a10) * det;
            out[6] = b21 * det;
            out[7] = (-a21 * a00 + a01 * a20) * det;
            out[8] = (a11 * a00 - a01 * a10) * det;
            return out;
        }
        mat3.invert = invert;
        /**
         * Calculates the adjugate of a mat3
         *
         * @param {mat3} out the receiving matrix
         * @param {mat3} a the source matrix
         * @returns {mat3} out
         */
        function adjoint(out, a) {
            var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8];
            out[0] = (a11 * a22 - a12 * a21);
            out[1] = (a02 * a21 - a01 * a22);
            out[2] = (a01 * a12 - a02 * a11);
            out[3] = (a12 * a20 - a10 * a22);
            out[4] = (a00 * a22 - a02 * a20);
            out[5] = (a02 * a10 - a00 * a12);
            out[6] = (a10 * a21 - a11 * a20);
            out[7] = (a01 * a20 - a00 * a21);
            out[8] = (a00 * a11 - a01 * a10);
            return out;
        }
        mat3.adjoint = adjoint;
        /**
         * Calculates the determinant of a mat3
         *
         * @param {mat3} a the source matrix
         * @returns {Number} determinant of a
         */
        function determinant(a) {
            var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8];
            return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
        }
        mat3.determinant = determinant;
        /**
         * Multiplies two mat3's
         *
         * @param {mat3} out the receiving matrix
         * @param {mat3} a the first operand
         * @param {mat3} b the second operand
         * @returns {mat3} out
         */
        function multiply(out, a, b) {
            var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], b00 = b[0], b01 = b[1], b02 = b[2], b10 = b[3], b11 = b[4], b12 = b[5], b20 = b[6], b21 = b[7], b22 = b[8];
            out[0] = b00 * a00 + b01 * a10 + b02 * a20;
            out[1] = b00 * a01 + b01 * a11 + b02 * a21;
            out[2] = b00 * a02 + b01 * a12 + b02 * a22;
            out[3] = b10 * a00 + b11 * a10 + b12 * a20;
            out[4] = b10 * a01 + b11 * a11 + b12 * a21;
            out[5] = b10 * a02 + b11 * a12 + b12 * a22;
            out[6] = b20 * a00 + b21 * a10 + b22 * a20;
            out[7] = b20 * a01 + b21 * a11 + b22 * a21;
            out[8] = b20 * a02 + b21 * a12 + b22 * a22;
            return out;
        }
        mat3.multiply = multiply;
        /**
         * Alias for {@link mat3.multiply}
         * @function
         */
        mat3.mul = mat3.multiply;
        /**
         * Translate a mat3 by the given vector
         *
         * @param {mat3} out the receiving matrix
         * @param {mat3} a the matrix to translate
         * @param {vec2} v vector to translate by
         * @returns {mat3} out
         */
        function translate(out, a, v) {
            var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], x = v[0], y = v[1];
            out[0] = a00;
            out[1] = a01;
            out[2] = a02;
            out[3] = a10;
            out[4] = a11;
            out[5] = a12;
            out[6] = x * a00 + y * a10 + a20;
            out[7] = x * a01 + y * a11 + a21;
            out[8] = x * a02 + y * a12 + a22;
            return out;
        }
        mat3.translate = translate;
        /**
         * Rotates a mat3 by the given angle
         *
         * @param {mat3} out the receiving matrix
         * @param {mat3} a the matrix to rotate
         * @param {Number} rad the angle to rotate the matrix by
         * @returns {mat3} out
         */
        function rotate(out, a, rad) {
            var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], s = Math.sin(rad), c = Math.cos(rad);
            out[0] = c * a00 + s * a10;
            out[1] = c * a01 + s * a11;
            out[2] = c * a02 + s * a12;
            out[3] = c * a10 - s * a00;
            out[4] = c * a11 - s * a01;
            out[5] = c * a12 - s * a02;
            out[6] = a20;
            out[7] = a21;
            out[8] = a22;
            return out;
        }
        mat3.rotate = rotate;
        /**
         * Scales the mat3 by the dimensions in the given vec2
         *
         * @param {mat3} out the receiving matrix
         * @param {mat3} a the matrix to rotate
         * @param {vec2} v the vec2 to scale the matrix by
         * @returns {mat3} out
         **/
        function scale(out, a, v) {
            var x = v[0], y = v[1];
            out[0] = x * a[0];
            out[1] = x * a[1];
            out[2] = x * a[2];
            out[3] = y * a[3];
            out[4] = y * a[4];
            out[5] = y * a[5];
            out[6] = a[6];
            out[7] = a[7];
            out[8] = a[8];
            return out;
        }
        mat3.scale = scale;
        /**
         * Copies the values from a mat2d into a mat3
         *
         * @param {mat3} out the receiving matrix
         * @param {mat2d} a the matrix to copy
         * @returns {mat3} out
         **/
        function fromMat2d(out, a) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = 0;
            out[3] = a[2];
            out[4] = a[3];
            out[5] = 0;
            out[6] = a[4];
            out[7] = a[5];
            out[8] = 1;
            return out;
        }
        mat3.fromMat2d = fromMat2d;
        /**
         * Calculates a 3x3 matrix from the given quaternion
         *
         * @param {mat3} out mat3 receiving operation result
         * @param {quat} q Quaternion to create matrix from
         *
         * @returns {mat3} out
         */
        function fromQuat(out, q) {
            var x = q[0], y = q[1], z = q[2], w = q[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, yx = y * x2, yy = y * y2, zx = z * x2, zy = z * y2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
            out[0] = 1 - yy - zz;
            out[3] = yx - wz;
            out[6] = zx + wy;
            out[1] = yx + wz;
            out[4] = 1 - xx - zz;
            out[7] = zy - wx;
            out[2] = zx - wy;
            out[5] = zy + wx;
            out[8] = 1 - xx - yy;
            return out;
        }
        mat3.fromQuat = fromQuat;
        /**
         * Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
         *
         * @param {mat3} out mat3 receiving operation result
         * @param {mat4} a Mat4 to derive the normal matrix from
         *
         * @returns {mat3} out
         */
        function normalFromMat4(out, a) {
            var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32, 
            // Calculate the determinant
            det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
            if (!det) {
                return null;
            }
            det = 1.0 / det;
            out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
            out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
            out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
            out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
            out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
            out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
            out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
            out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
            out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
            return out;
        }
        mat3.normalFromMat4 = normalFromMat4;
        /**
         * Returns a string representation of a mat3
         *
         * @param {mat3} mat matrix to represent as a string
         * @returns {String} string representation of the matrix
         */
        function str(a) {
            return 'mat3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' + a[8] + ')';
        }
        mat3.str = str;
        /**
         * Returns Frobenius norm of a mat3
         *
         * @param {mat3} a the matrix to calculate Frobenius norm of
         * @returns {Number} Frobenius norm
         */
        function frob(a) {
            return (Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2)));
        }
        mat3.frob = frob;
    })(mat3 || (mat3 = {}));
    return mat3;
});

/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

 Redistribution and use in source and binary forms, with or without modification,
 are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this
 list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */
define('math/mat4',["require", "exports", "./glMatrix"], function (require, exports, glMatrix) {
    /**
     * @class 4x4 Matrix
     * @name mat4
     */
    var mat4;
    (function (mat4) {
        /**
         * Creates a new identity mat4
         *
         * @returns {mat4} a new 4x4 matrix
         */
        function create() {
            var out = new glMatrix.GLMAT_ARRAY_TYPE(16);
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = 1;
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = 1;
            out[11] = 0;
            out[12] = 0;
            out[13] = 0;
            out[14] = 0;
            out[15] = 1;
            return out;
        }
        mat4.create = create;
        /**
         * Creates a new mat4 initialized with values from an existing matrix
         *
         * @param {mat4} a matrix to clone
         * @returns {mat4} a new 4x4 matrix
         */
        function clone(a) {
            var out = new glMatrix.GLMAT_ARRAY_TYPE(16);
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            out[4] = a[4];
            out[5] = a[5];
            out[6] = a[6];
            out[7] = a[7];
            out[8] = a[8];
            out[9] = a[9];
            out[10] = a[10];
            out[11] = a[11];
            out[12] = a[12];
            out[13] = a[13];
            out[14] = a[14];
            out[15] = a[15];
            return out;
        }
        mat4.clone = clone;
        /**
         * Copy the values from one mat4 to another
         *
         * @param {mat4} out the receiving matrix
         * @param {mat4} a the source matrix
         * @returns {mat4} out
         */
        function copy(out, a) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            out[4] = a[4];
            out[5] = a[5];
            out[6] = a[6];
            out[7] = a[7];
            out[8] = a[8];
            out[9] = a[9];
            out[10] = a[10];
            out[11] = a[11];
            out[12] = a[12];
            out[13] = a[13];
            out[14] = a[14];
            out[15] = a[15];
            return out;
        }
        mat4.copy = copy;
        /**
         * Set a mat4 to the identity matrix
         *
         * @param {mat4} out the receiving matrix
         * @returns {mat4} out
         */
        function identity(out) {
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = 1;
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = 1;
            out[11] = 0;
            out[12] = 0;
            out[13] = 0;
            out[14] = 0;
            out[15] = 1;
            return out;
        }
        mat4.identity = identity;
        /**
         * Transpose the values of a mat4
         *
         * @param {mat4} out the receiving matrix
         * @param {mat4} a the source matrix
         * @returns {mat4} out
         */
        function transpose(out, a) {
            // If we are transposing ourselves we can skip a few steps but have to cache some values
            if (out === a) {
                var a01 = a[1], a02 = a[2], a03 = a[3], a12 = a[6], a13 = a[7], a23 = a[11];
                out[1] = a[4];
                out[2] = a[8];
                out[3] = a[12];
                out[4] = a01;
                out[6] = a[9];
                out[7] = a[13];
                out[8] = a02;
                out[9] = a12;
                out[11] = a[14];
                out[12] = a03;
                out[13] = a13;
                out[14] = a23;
            }
            else {
                out[0] = a[0];
                out[1] = a[4];
                out[2] = a[8];
                out[3] = a[12];
                out[4] = a[1];
                out[5] = a[5];
                out[6] = a[9];
                out[7] = a[13];
                out[8] = a[2];
                out[9] = a[6];
                out[10] = a[10];
                out[11] = a[14];
                out[12] = a[3];
                out[13] = a[7];
                out[14] = a[11];
                out[15] = a[15];
            }
            return out;
        }
        mat4.transpose = transpose;
        /**
         * Inverts a mat4
         *
         * @param {mat4} out the receiving matrix
         * @param {mat4} a the source matrix
         * @returns {mat4} out
         */
        function invert(out, a) {
            var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32, 
            // Calculate the determinant
            det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
            if (!det) {
                return null;
            }
            det = 1.0 / det;
            out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
            out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
            out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
            out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
            out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
            out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
            out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
            out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
            out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
            out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
            out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
            out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
            out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
            out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
            out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
            out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
            return out;
        }
        mat4.invert = invert;
        /**
         * Calculates the adjugate of a mat4
         *
         * @param {mat4} out the receiving matrix
         * @param {mat4} a the source matrix
         * @returns {mat4} out
         */
        function adjoint(out, a) {
            var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
            out[0] = (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
            out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
            out[2] = (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
            out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
            out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
            out[5] = (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
            out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
            out[7] = (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
            out[8] = (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
            out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
            out[10] = (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
            out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
            out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
            out[13] = (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
            out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
            out[15] = (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
            return out;
        }
        mat4.adjoint = adjoint;
        /**
         * Calculates the determinant of a mat4
         *
         * @param {mat4} a the source matrix
         * @returns {Number} determinant of a
         */
        function determinant(a) {
            var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
            // Calculate the determinant
            return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        }
        mat4.determinant = determinant;
        /**
         * Multiplies two mat4's
         *
         * @param {mat4} out the receiving matrix
         * @param {mat4} a the first operand
         * @param {mat4} b the second operand
         * @returns {mat4} out
         */
        function multiply(out, a, b) {
            var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
            // Cache only the current line of the second matrix
            var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
            out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
            b0 = b[4];
            b1 = b[5];
            b2 = b[6];
            b3 = b[7];
            out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
            b0 = b[8];
            b1 = b[9];
            b2 = b[10];
            b3 = b[11];
            out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
            b0 = b[12];
            b1 = b[13];
            b2 = b[14];
            b3 = b[15];
            out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
            return out;
        }
        mat4.multiply = multiply;
        /**
         * Alias for {@link mat4.multiply}
         * @function
         */
        mat4.mul = mat4.multiply;
        /**
         * Translate a mat4 by the given vector
         *
         * @param {mat4} out the receiving matrix
         * @param {mat4} a the matrix to translate
         * @param {vec3} v vector to translate by
         * @returns {mat4} out
         */
        function translate(out, a, v) {
            var x = v[0], y = v[1], z = v[2], a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23;
            if (a === out) {
                out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
                out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
                out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
                out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
            }
            else {
                a00 = a[0];
                a01 = a[1];
                a02 = a[2];
                a03 = a[3];
                a10 = a[4];
                a11 = a[5];
                a12 = a[6];
                a13 = a[7];
                a20 = a[8];
                a21 = a[9];
                a22 = a[10];
                a23 = a[11];
                out[0] = a00;
                out[1] = a01;
                out[2] = a02;
                out[3] = a03;
                out[4] = a10;
                out[5] = a11;
                out[6] = a12;
                out[7] = a13;
                out[8] = a20;
                out[9] = a21;
                out[10] = a22;
                out[11] = a23;
                out[12] = a00 * x + a10 * y + a20 * z + a[12];
                out[13] = a01 * x + a11 * y + a21 * z + a[13];
                out[14] = a02 * x + a12 * y + a22 * z + a[14];
                out[15] = a03 * x + a13 * y + a23 * z + a[15];
            }
            return out;
        }
        mat4.translate = translate;
        /**
         * Scales the mat4 by the dimensions in the given vec3
         *
         * @param {mat4} out the receiving matrix
         * @param {mat4} a the matrix to scale
         * @param {vec3} v the vec3 to scale the matrix by
         * @returns {mat4} out
         **/
        function scale(out, a, v) {
            var x = v[0], y = v[1], z = v[2];
            out[0] = a[0] * x;
            out[1] = a[1] * x;
            out[2] = a[2] * x;
            out[3] = a[3] * x;
            out[4] = a[4] * y;
            out[5] = a[5] * y;
            out[6] = a[6] * y;
            out[7] = a[7] * y;
            out[8] = a[8] * z;
            out[9] = a[9] * z;
            out[10] = a[10] * z;
            out[11] = a[11] * z;
            out[12] = a[12];
            out[13] = a[13];
            out[14] = a[14];
            out[15] = a[15];
            return out;
        }
        mat4.scale = scale;
        /**
         * Rotates a mat4 by the given angle
         *
         * @param {mat4} out the receiving matrix
         * @param {mat4} a the matrix to rotate
         * @param {Number} rad the angle to rotate the matrix by
         * @param {vec3} axis the axis to rotate around
         * @returns {mat4} out
         */
        function rotate(out, a, rad, axis) {
            var x = axis[0], y = axis[1], z = axis[2], len = Math.sqrt(x * x + y * y + z * z), s, c, t, a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, b00, b01, b02, b10, b11, b12, b20, b21, b22;
            if (Math.abs(len) < glMatrix.GLMAT_EPSILON) {
                return null;
            }
            len = 1 / len;
            x *= len;
            y *= len;
            z *= len;
            s = Math.sin(rad);
            c = Math.cos(rad);
            t = 1 - c;
            a00 = a[0];
            a01 = a[1];
            a02 = a[2];
            a03 = a[3];
            a10 = a[4];
            a11 = a[5];
            a12 = a[6];
            a13 = a[7];
            a20 = a[8];
            a21 = a[9];
            a22 = a[10];
            a23 = a[11];
            // Construct the elements of the rotation matrix
            b00 = x * x * t + c;
            b01 = y * x * t + z * s;
            b02 = z * x * t - y * s;
            b10 = x * y * t - z * s;
            b11 = y * y * t + c;
            b12 = z * y * t + x * s;
            b20 = x * z * t + y * s;
            b21 = y * z * t - x * s;
            b22 = z * z * t + c;
            // Perform rotation-specific matrix multiplication
            out[0] = a00 * b00 + a10 * b01 + a20 * b02;
            out[1] = a01 * b00 + a11 * b01 + a21 * b02;
            out[2] = a02 * b00 + a12 * b01 + a22 * b02;
            out[3] = a03 * b00 + a13 * b01 + a23 * b02;
            out[4] = a00 * b10 + a10 * b11 + a20 * b12;
            out[5] = a01 * b10 + a11 * b11 + a21 * b12;
            out[6] = a02 * b10 + a12 * b11 + a22 * b12;
            out[7] = a03 * b10 + a13 * b11 + a23 * b12;
            out[8] = a00 * b20 + a10 * b21 + a20 * b22;
            out[9] = a01 * b20 + a11 * b21 + a21 * b22;
            out[10] = a02 * b20 + a12 * b21 + a22 * b22;
            out[11] = a03 * b20 + a13 * b21 + a23 * b22;
            if (a !== out) {
                out[12] = a[12];
                out[13] = a[13];
                out[14] = a[14];
                out[15] = a[15];
            }
            return out;
        }
        mat4.rotate = rotate;
        /**
         * Rotates a matrix by the given angle around the X axis
         *
         * @param {mat4} out the receiving matrix
         * @param {mat4} a the matrix to rotate
         * @param {Number} rad the angle to rotate the matrix by
         * @returns {mat4} out
         */
        function rotateX(out, a, rad) {
            var s = Math.sin(rad), c = Math.cos(rad), a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
            if (a !== out) {
                out[0] = a[0];
                out[1] = a[1];
                out[2] = a[2];
                out[3] = a[3];
                out[12] = a[12];
                out[13] = a[13];
                out[14] = a[14];
                out[15] = a[15];
            }
            // Perform axis-specific matrix multiplication
            out[4] = a10 * c + a20 * s;
            out[5] = a11 * c + a21 * s;
            out[6] = a12 * c + a22 * s;
            out[7] = a13 * c + a23 * s;
            out[8] = a20 * c - a10 * s;
            out[9] = a21 * c - a11 * s;
            out[10] = a22 * c - a12 * s;
            out[11] = a23 * c - a13 * s;
            return out;
        }
        mat4.rotateX = rotateX;
        /**
         * Rotates a matrix by the given angle around the Y axis
         *
         * @param {mat4} out the receiving matrix
         * @param {mat4} a the matrix to rotate
         * @param {Number} rad the angle to rotate the matrix by
         * @returns {mat4} out
         */
        function rotateY(out, a, rad) {
            var s = Math.sin(rad), c = Math.cos(rad), a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
            if (a !== out) {
                out[4] = a[4];
                out[5] = a[5];
                out[6] = a[6];
                out[7] = a[7];
                out[12] = a[12];
                out[13] = a[13];
                out[14] = a[14];
                out[15] = a[15];
            }
            // Perform axis-specific matrix multiplication
            out[0] = a00 * c - a20 * s;
            out[1] = a01 * c - a21 * s;
            out[2] = a02 * c - a22 * s;
            out[3] = a03 * c - a23 * s;
            out[8] = a00 * s + a20 * c;
            out[9] = a01 * s + a21 * c;
            out[10] = a02 * s + a22 * c;
            out[11] = a03 * s + a23 * c;
            return out;
        }
        mat4.rotateY = rotateY;
        /**
         * Rotates a matrix by the given angle around the Z axis
         *
         * @param {mat4} out the receiving matrix
         * @param {mat4} a the matrix to rotate
         * @param {Number} rad the angle to rotate the matrix by
         * @returns {mat4} out
         */
        function rotateZ(out, a, rad) {
            var s = Math.sin(rad), c = Math.cos(rad), a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
            if (a !== out) {
                out[8] = a[8];
                out[9] = a[9];
                out[10] = a[10];
                out[11] = a[11];
                out[12] = a[12];
                out[13] = a[13];
                out[14] = a[14];
                out[15] = a[15];
            }
            // Perform axis-specific matrix multiplication
            out[0] = a00 * c + a10 * s;
            out[1] = a01 * c + a11 * s;
            out[2] = a02 * c + a12 * s;
            out[3] = a03 * c + a13 * s;
            out[4] = a10 * c - a00 * s;
            out[5] = a11 * c - a01 * s;
            out[6] = a12 * c - a02 * s;
            out[7] = a13 * c - a03 * s;
            return out;
        }
        mat4.rotateZ = rotateZ;
        /**
         * Creates a matrix from a quaternion rotation and vector translation
         * This is equivalent to (but much faster than):
         *
         *     mat4.identity(dest);
         *     mat4.translate(dest, vec);
         *     var quatMat = mat4.create();
         *     quat4.toMat4(quat, quatMat);
         *     mat4.multiply(dest, quatMat);
         *
         * @param {mat4} out mat4 receiving operation result
         * @param {quat4} q Rotation quaternion
         * @param {vec3} v Translation vector
         * @returns {mat4} out
         */
        function fromRotationTranslation(out, q, v) {
            // Quaternion math
            var x = q[0], y = q[1], z = q[2], w = q[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
            out[0] = 1 - (yy + zz);
            out[1] = xy + wz;
            out[2] = xz - wy;
            out[3] = 0;
            out[4] = xy - wz;
            out[5] = 1 - (xx + zz);
            out[6] = yz + wx;
            out[7] = 0;
            out[8] = xz + wy;
            out[9] = yz - wx;
            out[10] = 1 - (xx + yy);
            out[11] = 0;
            out[12] = v[0];
            out[13] = v[1];
            out[14] = v[2];
            out[15] = 1;
            return out;
        }
        mat4.fromRotationTranslation = fromRotationTranslation;
        function fromQuat(out, q) {
            var x = q[0], y = q[1], z = q[2], w = q[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, yx = y * x2, yy = y * y2, zx = z * x2, zy = z * y2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
            out[0] = 1 - yy - zz;
            out[1] = yx + wz;
            out[2] = zx - wy;
            out[3] = 0;
            out[4] = yx - wz;
            out[5] = 1 - xx - zz;
            out[6] = zy + wx;
            out[7] = 0;
            out[8] = zx + wy;
            out[9] = zy - wx;
            out[10] = 1 - xx - yy;
            out[11] = 0;
            out[12] = 0;
            out[13] = 0;
            out[14] = 0;
            out[15] = 1;
            return out;
        }
        mat4.fromQuat = fromQuat;
        /**
         * Generates a frustum matrix with the given bounds
         *
         * @param {mat4} out mat4 frustum matrix will be written into
         * @param {Number} left Left bound of the frustum
         * @param {Number} right Right bound of the frustum
         * @param {Number} bottom Bottom bound of the frustum
         * @param {Number} top Top bound of the frustum
         * @param {Number} near Near bound of the frustum
         * @param {Number} far Far bound of the frustum
         * @returns {mat4} out
         */
        function frustum(out, left, right, bottom, top, near, far) {
            var rl = 1 / (right - left), tb = 1 / (top - bottom), nf = 1 / (near - far);
            out[0] = (near * 2) * rl;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = (near * 2) * tb;
            out[6] = 0;
            out[7] = 0;
            out[8] = (right + left) * rl;
            out[9] = (top + bottom) * tb;
            out[10] = (far + near) * nf;
            out[11] = -1;
            out[12] = 0;
            out[13] = 0;
            out[14] = (far * near * 2) * nf;
            out[15] = 0;
            return out;
        }
        mat4.frustum = frustum;
        /**
         * Generates a perspective projection matrix with the given bounds
         *
         * @param {mat4} out mat4 frustum matrix will be written into
         * @param {number} fovy Vertical field of view in radians
         * @param {number} aspect Aspect ratio. typically viewport width/height
         * @param {number} near Near bound of the frustum
         * @param {number} far Far bound of the frustum
         * @returns {mat4} out
         */
        function perspective(out, fovy, aspect, near, far) {
            var f = 1.0 / Math.tan(fovy / 2), nf = 1 / (near - far);
            out[0] = f / aspect;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = f;
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = (far + near) * nf;
            out[11] = -1;
            out[12] = 0;
            out[13] = 0;
            out[14] = (2 * far * near) * nf;
            out[15] = 0;
            return out;
        }
        mat4.perspective = perspective;
        /**
         * Generates a perspective projection matrix with the given field of view.
         * This is primarily useful for generating projection matrices to be used
         * with the still experiemental WebVR API.
         *
         * @param {mat4} out mat4 frustum matrix will be written into
         * @param {number} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
         * @param {number} near Near bound of the frustum
         * @param {number} far Far bound of the frustum
         * @returns {mat4} out
         */
        function perspectiveFromFieldOfView(out, fov, near, far) {
            var upTan = Math.tan(fov.upDegrees * Math.PI / 180.0), downTan = Math.tan(fov.downDegrees * Math.PI / 180.0), leftTan = Math.tan(fov.leftDegrees * Math.PI / 180.0), rightTan = Math.tan(fov.rightDegrees * Math.PI / 180.0), xScale = 2.0 / (leftTan + rightTan), yScale = 2.0 / (upTan + downTan);
            out[0] = xScale;
            out[1] = 0.0;
            out[2] = 0.0;
            out[3] = 0.0;
            out[4] = 0.0;
            out[5] = yScale;
            out[6] = 0.0;
            out[7] = 0.0;
            out[8] = -((leftTan - rightTan) * xScale * 0.5);
            out[9] = ((upTan - downTan) * yScale * 0.5);
            out[10] = far / (near - far);
            out[11] = -1.0;
            out[12] = 0.0;
            out[13] = 0.0;
            out[14] = (far * near) / (near - far);
            out[15] = 0.0;
            return out;
        }
        mat4.perspectiveFromFieldOfView = perspectiveFromFieldOfView;
        /**
         * Generates a orthogonal projection matrix with the given bounds
         *
         * @param {mat4} out mat4 frustum matrix will be written into
         * @param {number} left Left bound of the frustum
         * @param {number} right Right bound of the frustum
         * @param {number} bottom Bottom bound of the frustum
         * @param {number} top Top bound of the frustum
         * @param {number} near Near bound of the frustum
         * @param {number} far Far bound of the frustum
         * @returns {mat4} out
         */
        function ortho(out, left, right, bottom, top, near, far) {
            var lr = 1 / (left - right), bt = 1 / (bottom - top), nf = 1 / (near - far);
            out[0] = -2 * lr;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = -2 * bt;
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = 2 * nf;
            out[11] = 0;
            out[12] = (left + right) * lr;
            out[13] = (top + bottom) * bt;
            out[14] = (far + near) * nf;
            out[15] = 1;
            return out;
        }
        mat4.ortho = ortho;
        /**
         * Generates a look-at matrix with the given eye position, focal point, and up axis
         *
         * @param {mat4} out mat4 frustum matrix will be written into
         * @param {vec3} eye Position of the viewer
         * @param {vec3} center Point the viewer is looking at
         * @param {vec3} up vec3 pointing up
         * @returns {mat4} out
         */
        function lookAt(out, eye, center, up) {
            var x0, x1, x2, y0, y1, y2, z0, z1, z2, len, eyex = eye[0], eyey = eye[1], eyez = eye[2], upx = up[0], upy = up[1], upz = up[2], centerx = center[0], centery = center[1], centerz = center[2];
            if (Math.abs(eyex - centerx) < glMatrix.GLMAT_EPSILON && Math.abs(eyey - centery) < glMatrix.GLMAT_EPSILON && Math.abs(eyez - centerz) < glMatrix.GLMAT_EPSILON) {
                return mat4.identity(out);
            }
            z0 = eyex - centerx;
            z1 = eyey - centery;
            z2 = eyez - centerz;
            len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
            z0 *= len;
            z1 *= len;
            z2 *= len;
            x0 = upy * z2 - upz * z1;
            x1 = upz * z0 - upx * z2;
            x2 = upx * z1 - upy * z0;
            len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
            if (!len) {
                x0 = 0;
                x1 = 0;
                x2 = 0;
            }
            else {
                len = 1 / len;
                x0 *= len;
                x1 *= len;
                x2 *= len;
            }
            y0 = z1 * x2 - z2 * x1;
            y1 = z2 * x0 - z0 * x2;
            y2 = z0 * x1 - z1 * x0;
            len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
            if (!len) {
                y0 = 0;
                y1 = 0;
                y2 = 0;
            }
            else {
                len = 1 / len;
                y0 *= len;
                y1 *= len;
                y2 *= len;
            }
            out[0] = x0;
            out[1] = y0;
            out[2] = z0;
            out[3] = 0;
            out[4] = x1;
            out[5] = y1;
            out[6] = z1;
            out[7] = 0;
            out[8] = x2;
            out[9] = y2;
            out[10] = z2;
            out[11] = 0;
            out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
            out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
            out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
            out[15] = 1;
            return out;
        }
        mat4.lookAt = lookAt;
        /**
         * Returns a string representation of a mat4
         *
         * @param {mat4} mat matrix to represent as a string
         * @returns {String} string representation of the matrix
         */
        function str(a) {
            return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' + a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
        }
        mat4.str = str;
        /**
         * Returns Frobenius norm of a mat4
         *
         * @param {mat4} a the matrix to calculate Frobenius norm of
         * @returns {Number} Frobenius norm
         */
        function frob(a) {
            return (Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2)));
        }
        mat4.frob = frob;
        /**
         * A static identity matrix.
         * @type {mat4}
         */
        mat4.IDENTITY = create();
    })(mat4 || (mat4 = {}));
    return mat4;
});

/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

 Redistribution and use in source and binary forms, with or without modification,
 are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this
 list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */
define('math/vec3',["require", "exports", "./glMatrix"], function (require, exports, glMatrix) {
    /**
     * @class 3 Dimensional Vector
     * @name vec3
     */
    var vec3;
    (function (vec3) {
        /**
         * Creates a new, empty vec3
         *
         * @returns {vec3} a new 3D vector
         */
        function create() {
            var out = new glMatrix.GLMAT_ARRAY_TYPE(3);
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
            return out;
        }
        vec3.create = create;
        /**
         * Creates a new vec3 initialized with values from an existing vector
         *
         * @param {vec3} a vector to clone
         * @returns {vec3} a new 3D vector
         */
        function clone(a) {
            var out = new glMatrix.GLMAT_ARRAY_TYPE(3);
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            return out;
        }
        vec3.clone = clone;
        /**
         * Creates a new vec3 initialized with the given values
         *
         * @param {Number} x X component
         * @param {Number} y Y component
         * @param {Number} z Z component
         * @returns {vec3} a new 3D vector
         */
        function fromValues(x, y, z) {
            var out = new glMatrix.GLMAT_ARRAY_TYPE(3);
            out[0] = x;
            out[1] = y;
            out[2] = z;
            return out;
        }
        vec3.fromValues = fromValues;
        /**
         * Copy the values from one vec3 to another
         *
         * @param {vec3} out the receiving vector
         * @param {vec3} a the source vector
         * @returns {vec3} out
         */
        function copy(out, a) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            return out;
        }
        vec3.copy = copy;
        /**
         * Set the components of a vec3 to the given values
         *
         * @param {vec3} out the receiving vector
         * @param {Number} x X component
         * @param {Number} y Y component
         * @param {Number} z Z component
         * @returns {vec3} out
         */
        function set(out, x, y, z) {
            out[0] = x;
            out[1] = y;
            out[2] = z;
            return out;
        }
        vec3.set = set;
        /**
         * Adds two vec3's
         *
         * @param {vec3} out the receiving vector
         * @param {vec3} a the first operand
         * @param {vec3} b the second operand
         * @returns {vec3} out
         */
        function add(out, a, b) {
            out[0] = a[0] + b[0];
            out[1] = a[1] + b[1];
            out[2] = a[2] + b[2];
            return out;
        }
        vec3.add = add;
        /**
         * Subtracts vector b from vector a
         *
         * @param {vec3} out the receiving vector
         * @param {vec3} a the first operand
         * @param {vec3} b the second operand
         * @returns {vec3} out
         */
        function subtract(out, a, b) {
            out[0] = a[0] - b[0];
            out[1] = a[1] - b[1];
            out[2] = a[2] - b[2];
            return out;
        }
        vec3.subtract = subtract;
        /**
         * Multiplies two vec3's
         *
         * @param {vec3} out the receiving vector
         * @param {vec3} a the first operand
         * @param {vec3} b the second operand
         * @returns {vec3} out
         */
        function multiply(out, a, b) {
            out[0] = a[0] * b[0];
            out[1] = a[1] * b[1];
            out[2] = a[2] * b[2];
            return out;
        }
        vec3.multiply = multiply;
        /**
         * Divides two vec3's
         *
         * @param {vec3} out the receiving vector
         * @param {vec3} a the first operand
         * @param {vec3} b the second operand
         * @returns {vec3} out
         */
        function divide(out, a, b) {
            out[0] = a[0] / b[0];
            out[1] = a[1] / b[1];
            out[2] = a[2] / b[2];
            return out;
        }
        vec3.divide = divide;
        /**
         * Returns the minimum of two vec3's
         *
         * @param {vec3} out the receiving vector
         * @param {vec3} a the first operand
         * @param {vec3} b the second operand
         * @returns {vec3} out
         */
        function min(out, a, b) {
            out[0] = Math.min(a[0], b[0]);
            out[1] = Math.min(a[1], b[1]);
            out[2] = Math.min(a[2], b[2]);
            return out;
        }
        vec3.min = min;
        /**
         * Returns the maximum of two vec3's
         *
         * @param {vec3} out the receiving vector
         * @param {vec3} a the first operand
         * @param {vec3} b the second operand
         * @returns {vec3} out
         */
        function max(out, a, b) {
            out[0] = Math.max(a[0], b[0]);
            out[1] = Math.max(a[1], b[1]);
            out[2] = Math.max(a[2], b[2]);
            return out;
        }
        vec3.max = max;
        /**
         * Scales a vec3 by a scalar number
         *
         * @param {vec3} out the receiving vector
         * @param {vec3} a the vector to scale
         * @param {Number} b amount to scale the vector by
         * @returns {vec3} out
         */
        function scale(out, a, b) {
            out[0] = a[0] * b;
            out[1] = a[1] * b;
            out[2] = a[2] * b;
            return out;
        }
        vec3.scale = scale;
        /**
         * Adds two vec3's after scaling the second operand by a scalar value
         *
         * @param {vec3} out the receiving vector
         * @param {vec3} a the first operand
         * @param {vec3} b the second operand
         * @param {Number} scale the amount to scale b by before adding
         * @returns {vec3} out
         */
        function scaleAndAdd(out, a, b, scale) {
            out[0] = a[0] + (b[0] * scale);
            out[1] = a[1] + (b[1] * scale);
            out[2] = a[2] + (b[2] * scale);
            return out;
        }
        vec3.scaleAndAdd = scaleAndAdd;
        /**
         * Calculates the euclidian distance between two vec3's
         *
         * @param {vec3} a the first operand
         * @param {vec3} b the second operand
         * @returns {Number} distance between a and b
         */
        function distance(a, b) {
            var x = b[0] - a[0], y = b[1] - a[1], z = b[2] - a[2];
            return Math.sqrt(x * x + y * y + z * z);
        }
        vec3.distance = distance;
        /**
         * Calculates the squared euclidian distance between two vec3's
         *
         * @param {vec3} a the first operand
         * @param {vec3} b the second operand
         * @returns {Number} squared distance between a and b
         */
        function squaredDistance(a, b) {
            var x = b[0] - a[0], y = b[1] - a[1], z = b[2] - a[2];
            return x * x + y * y + z * z;
        }
        vec3.squaredDistance = squaredDistance;
        /**
         * Calculates the length of a vec3
         *
         * @param {vec3} a vector to calculate length of
         * @returns {Number} length of a
         */
        function length(a) {
            var x = a[0], y = a[1], z = a[2];
            return Math.sqrt(x * x + y * y + z * z);
        }
        vec3.length = length;
        /**
         * Alias for {@link vec3.length}
         * @function
         */
        vec3.len = vec3.length;
        /**
         * Calculates the squared length of a vec3
         *
         * @param {vec3} a vector to calculate squared length of
         * @returns {Number} squared length of a
         */
        function squaredLength(a) {
            var x = a[0], y = a[1], z = a[2];
            return x * x + y * y + z * z;
        }
        vec3.squaredLength = squaredLength;
        /**
         * Alias for {@link vec3.squaredLength}
         * @function
         */
        vec3.sqrLen = vec3.squaredLength;
        /**
         * Negates the components of a vec3
         *
         * @param {vec3} out the receiving vector
         * @param {vec3} a vector to negate
         * @returns {vec3} out
         */
        function negate(out, a) {
            out[0] = -a[0];
            out[1] = -a[1];
            out[2] = -a[2];
            return out;
        }
        vec3.negate = negate;
        /**
         * Returns the inverse of the components of a vec3
         *
         * @param {vec3} out the receiving vector
         * @param {vec3} a vector to invert
         * @returns {vec3} out
         */
        function inverse(out, a) {
            out[0] = 1.0 / a[0];
            out[1] = 1.0 / a[1];
            out[2] = 1.0 / a[2];
            return out;
        }
        vec3.inverse = inverse;
        /**
         * Normalize a vec3
         *
         * @param {vec3} out the receiving vector
         * @param {vec3} a vector to normalize
         * @returns {vec3} out
         */
        function normalize(out, a) {
            var x = a[0], y = a[1], z = a[2];
            var len = x * x + y * y + z * z;
            if (len > 0) {
                //TODO: evaluate use of glm_invsqrt here?
                len = 1 / Math.sqrt(len);
                out[0] = a[0] * len;
                out[1] = a[1] * len;
                out[2] = a[2] * len;
            }
            return out;
        }
        vec3.normalize = normalize;
        /**
         * Calculates the dot product of two vec3's
         *
         * @param {vec3} a the first operand
         * @param {vec3} b the second operand
         * @returns {Number} dot product of a and b
         */
        function dot(a, b) {
            return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
        }
        vec3.dot = dot;
        /**
         * Computes the cross product of two vec3's
         *
         * @param {vec3} out the receiving vector
         * @param {vec3} a the first operand
         * @param {vec3} b the second operand
         * @returns {vec3} out
         */
        function cross(out, a, b) {
            var ax = a[0], ay = a[1], az = a[2], bx = b[0], by = b[1], bz = b[2];
            out[0] = ay * bz - az * by;
            out[1] = az * bx - ax * bz;
            out[2] = ax * by - ay * bx;
            return out;
        }
        vec3.cross = cross;
        /**
         * Performs a linear interpolation between two vec3's
         *
         * @param {vec3} out the receiving vector
         * @param {vec3} a the first operand
         * @param {vec3} b the second operand
         * @param {Number} t interpolation amount between the two inputs
         * @returns {vec3} out
         */
        function lerp(out, a, b, t) {
            var ax = a[0], ay = a[1], az = a[2];
            out[0] = ax + t * (b[0] - ax);
            out[1] = ay + t * (b[1] - ay);
            out[2] = az + t * (b[2] - az);
            return out;
        }
        vec3.lerp = lerp;
        /**
         * Generates a random vector with the given scale
         *
         * @param {vec3} out the receiving vector
         * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
         * @returns {vec3} out
         */
        function random(out, scale) {
            scale = scale || 1.0;
            var r = glMatrix.GLMAT_RANDOM() * 2.0 * Math.PI;
            var z = (glMatrix.GLMAT_RANDOM() * 2.0) - 1.0;
            var zScale = Math.sqrt(1.0 - z * z) * scale;
            out[0] = Math.cos(r) * zScale;
            out[1] = Math.sin(r) * zScale;
            out[2] = z * scale;
            return out;
        }
        vec3.random = random;
        /**
         * Transforms the vec3 with a mat4.
         * 4th vector component is implicitly '1'
         *
         * @param {vec3} out the receiving vector
         * @param {vec3} a the vector to transform
         * @param {mat4} m matrix to transform with
         * @returns {vec3} out
         */
        function transformMat4(out, a, m) {
            var x = a[0], y = a[1], z = a[2], w = m[3] * x + m[7] * y + m[11] * z + m[15];
            w = w || 1.0;
            out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
            out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
            out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
            return out;
        }
        vec3.transformMat4 = transformMat4;
        /**
         * Transforms the vec3 with a mat3.
         *
         * @param {vec3} out the receiving vector
         * @param {vec3} a the vector to transform
         * @param {mat4} m the 3x3 matrix to transform with
         * @returns {vec3} out
         */
        function transformMat3(out, a, m) {
            var x = a[0], y = a[1], z = a[2];
            out[0] = x * m[0] + y * m[3] + z * m[6];
            out[1] = x * m[1] + y * m[4] + z * m[7];
            out[2] = x * m[2] + y * m[5] + z * m[8];
            return out;
        }
        vec3.transformMat3 = transformMat3;
        /**
         * Transforms the vec3 with a quat
         *
         * @param {vec3} out the receiving vector
         * @param {vec3} a the vector to transform
         * @param {quat} q quaternion to transform with
         * @returns {vec3} out
         */
        function transformQuat(out, a, q) {
            // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations
            var x = a[0], y = a[1], z = a[2], qx = q[0], qy = q[1], qz = q[2], qw = q[3], 
            // calculate quat * vec
            ix = qw * x + qy * z - qz * y, iy = qw * y + qz * x - qx * z, iz = qw * z + qx * y - qy * x, iw = -qx * x - qy * y - qz * z;
            // calculate result * inverse quat
            out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
            out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
            out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
            return out;
        }
        vec3.transformQuat = transformQuat;
        /**
         * Rotate a 3D vector around the x-axis
         * @param {vec3} out The receiving vec3
         * @param {vec3} a The vec3 point to rotate
         * @param {vec3} b The origin of the rotation
         * @param {Number} c The angle of rotation
         * @returns {vec3} out
         */
        function rotateX(out, a, b, c) {
            var p = [], r = [];
            //Translate point to the origin
            p[0] = a[0] - b[0];
            p[1] = a[1] - b[1];
            p[2] = a[2] - b[2];
            //perform rotation
            r[0] = p[0];
            r[1] = p[1] * Math.cos(c) - p[2] * Math.sin(c);
            r[2] = p[1] * Math.sin(c) + p[2] * Math.cos(c);
            //translate to correct position
            out[0] = r[0] + b[0];
            out[1] = r[1] + b[1];
            out[2] = r[2] + b[2];
            return out;
        }
        vec3.rotateX = rotateX;
        /**
         * Rotate a 3D vector around the y-axis
         * @param {vec3} out The receiving vec3
         * @param {vec3} a The vec3 point to rotate
         * @param {vec3} b The origin of the rotation
         * @param {Number} c The angle of rotation
         * @returns {vec3} out
         */
        function rotateY(out, a, b, c) {
            var p = [], r = [];
            //Translate point to the origin
            p[0] = a[0] - b[0];
            p[1] = a[1] - b[1];
            p[2] = a[2] - b[2];
            //perform rotation
            r[0] = p[2] * Math.sin(c) + p[0] * Math.cos(c);
            r[1] = p[1];
            r[2] = p[2] * Math.cos(c) - p[0] * Math.sin(c);
            //translate to correct position
            out[0] = r[0] + b[0];
            out[1] = r[1] + b[1];
            out[2] = r[2] + b[2];
            return out;
        }
        vec3.rotateY = rotateY;
        /**
         * Rotate a 3D vector around the z-axis
         * @param {vec3} out The receiving vec3
         * @param {vec3} a The vec3 point to rotate
         * @param {vec3} b The origin of the rotation
         * @param {Number} c The angle of rotation
         * @returns {vec3} out
         */
        function rotateZ(out, a, b, c) {
            var p = [], r = [];
            //Translate point to the origin
            p[0] = a[0] - b[0];
            p[1] = a[1] - b[1];
            p[2] = a[2] - b[2];
            //perform rotation
            r[0] = p[0] * Math.cos(c) - p[1] * Math.sin(c);
            r[1] = p[0] * Math.sin(c) + p[1] * Math.cos(c);
            r[2] = p[2];
            //translate to correct position
            out[0] = r[0] + b[0];
            out[1] = r[1] + b[1];
            out[2] = r[2] + b[2];
            return out;
        }
        vec3.rotateZ = rotateZ;
        /**
         * Perform some operation over an array of vec3s.
         *
         * @param {Array} a the array of vectors to iterate over
         * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
         * @param {Number} offset Number of elements to skip at the beginning of the array
         * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
         * @param {Function} fn Function to call for each vector in the array
         * @param {Object} [arg] additional argument to pass to fn
         * @returns {Array} a
         * @function
         */
        vec3.forEach = (function () {
            var vec = vec3.create();
            return function (a, stride, offset, count, fn, arg) {
                var i, l;
                if (!stride) {
                    stride = 3;
                }
                if (!offset) {
                    offset = 0;
                }
                if (count) {
                    l = Math.min((count * stride) + offset, a.length);
                }
                else {
                    l = a.length;
                }
                for (i = offset; i < l; i += stride) {
                    vec[0] = a[i];
                    vec[1] = a[i + 1];
                    vec[2] = a[i + 2];
                    fn(vec, vec, arg);
                    a[i] = vec[0];
                    a[i + 1] = vec[1];
                    a[i + 2] = vec[2];
                }
                return a;
            };
        })();
        /**
         * Returns a string representation of a vector
         *
         * @param {vec3} vec vector to represent as a string
         * @returns {String} string representation of the vector
         */
        function str(a) {
            return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';
        }
        vec3.str = str;
        vec3.UNIT_X = vec3.fromValues(1, 0, 0);
        vec3.UNIT_Y = vec3.fromValues(0, 1, 0);
        vec3.UNIT_Z = vec3.fromValues(0, 0, 1);
    })(vec3 || (vec3 = {}));
    return vec3;
});

/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

 Redistribution and use in source and binary forms, with or without modification,
 are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this
 list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */
define('math/vec4',["require", "exports", "./glMatrix"], function (require, exports, glMatrix) {
    /**
     * @class 4 Dimensional Vector
     * @name vec4
     */
    var vec4;
    (function (vec4) {
        /**
         * Creates a new, empty vec4
         *
         * @returns {vec4} a new 4D vector
         */
        function create() {
            var out = new glMatrix.GLMAT_ARRAY_TYPE(4);
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            return out;
        }
        vec4.create = create;
        /**
         * Creates a new vec4 initialized with values from an existing vector
         *
         * @param {vec4} a vector to clone
         * @returns {vec4} a new 4D vector
         */
        function clone(a) {
            var out = new glMatrix.GLMAT_ARRAY_TYPE(4);
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            return out;
        }
        vec4.clone = clone;
        /**
         * Creates a new vec4 initialized with the given values
         *
         * @param {Number} x X component
         * @param {Number} y Y component
         * @param {Number} z Z component
         * @param {Number} w W component
         * @returns {vec4} a new 4D vector
         */
        function fromValues(x, y, z, w) {
            var out = new glMatrix.GLMAT_ARRAY_TYPE(4);
            out[0] = x;
            out[1] = y;
            out[2] = z;
            out[3] = w;
            return out;
        }
        vec4.fromValues = fromValues;
        /**
         * Copy the values from one vec4 to another
         *
         * @param {vec4} out the receiving vector
         * @param {vec4} a the source vector
         * @returns {vec4} out
         */
        function copy(out, a) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            return out;
        }
        vec4.copy = copy;
        /**
         * Set the components of a vec4 to the given values
         *
         * @param {vec4} out the receiving vector
         * @param {Number} x X component
         * @param {Number} y Y component
         * @param {Number} z Z component
         * @param {Number} w W component
         * @returns {vec4} out
         */
        function set(out, x, y, z, w) {
            out[0] = x;
            out[1] = y;
            out[2] = z;
            out[3] = w;
            return out;
        }
        vec4.set = set;
        /**
         * Adds two vec4's
         *
         * @param {vec4} out the receiving vector
         * @param {vec4} a the first operand
         * @param {vec4} b the second operand
         * @returns {vec4} out
         */
        function add(out, a, b) {
            out[0] = a[0] + b[0];
            out[1] = a[1] + b[1];
            out[2] = a[2] + b[2];
            out[3] = a[3] + b[3];
            return out;
        }
        vec4.add = add;
        /**
         * Subtracts vector b from vector a
         *
         * @param {vec4} out the receiving vector
         * @param {vec4} a the first operand
         * @param {vec4} b the second operand
         * @returns {vec4} out
         */
        function subtract(out, a, b) {
            out[0] = a[0] - b[0];
            out[1] = a[1] - b[1];
            out[2] = a[2] - b[2];
            out[3] = a[3] - b[3];
            return out;
        }
        vec4.subtract = subtract;
        /**
         * Alias for {@link vec4.subtract}
         * @function
         */
        vec4.sub = vec4.subtract;
        /**
         * Multiplies two vec4's
         *
         * @param {vec4} out the receiving vector
         * @param {vec4} a the first operand
         * @param {vec4} b the second operand
         * @returns {vec4} out
         */
        function multiply(out, a, b) {
            out[0] = a[0] * b[0];
            out[1] = a[1] * b[1];
            out[2] = a[2] * b[2];
            out[3] = a[3] * b[3];
            return out;
        }
        vec4.multiply = multiply;
        /**
         * Alias for {@link vec4.multiply}
         * @function
         */
        vec4.mul = vec4.multiply;
        /**
         * Divides two vec4's
         *
         * @param {vec4} out the receiving vector
         * @param {vec4} a the first operand
         * @param {vec4} b the second operand
         * @returns {vec4} out
         */
        function divide(out, a, b) {
            out[0] = a[0] / b[0];
            out[1] = a[1] / b[1];
            out[2] = a[2] / b[2];
            out[3] = a[3] / b[3];
            return out;
        }
        vec4.divide = divide;
        /**
         * Alias for {@link vec4.divide}
         * @function
         */
        vec4.div = vec4.divide;
        /**
         * Returns the minimum of two vec4's
         *
         * @param {vec4} out the receiving vector
         * @param {vec4} a the first operand
         * @param {vec4} b the second operand
         * @returns {vec4} out
         */
        function min(out, a, b) {
            out[0] = Math.min(a[0], b[0]);
            out[1] = Math.min(a[1], b[1]);
            out[2] = Math.min(a[2], b[2]);
            out[3] = Math.min(a[3], b[3]);
            return out;
        }
        vec4.min = min;
        /**
         * Returns the maximum of two vec4's
         *
         * @param {vec4} out the receiving vector
         * @param {vec4} a the first operand
         * @param {vec4} b the second operand
         * @returns {vec4} out
         */
        function max(out, a, b) {
            out[0] = Math.max(a[0], b[0]);
            out[1] = Math.max(a[1], b[1]);
            out[2] = Math.max(a[2], b[2]);
            out[3] = Math.max(a[3], b[3]);
            return out;
        }
        vec4.max = max;
        /**
         * Scales a vec4 by a scalar number
         *
         * @param {vec4} out the receiving vector
         * @param {vec4} a the vector to scale
         * @param {Number} b amount to scale the vector by
         * @returns {vec4} out
         */
        function scale(out, a, b) {
            out[0] = a[0] * b;
            out[1] = a[1] * b;
            out[2] = a[2] * b;
            out[3] = a[3] * b;
            return out;
        }
        vec4.scale = scale;
        /**
         * Adds two vec4's after scaling the second operand by a scalar value
         *
         * @param {vec4} out the receiving vector
         * @param {vec4} a the first operand
         * @param {vec4} b the second operand
         * @param {Number} scale the amount to scale b by before adding
         * @returns {vec4} out
         */
        function scaleAndAdd(out, a, b, scale) {
            out[0] = a[0] + (b[0] * scale);
            out[1] = a[1] + (b[1] * scale);
            out[2] = a[2] + (b[2] * scale);
            out[3] = a[3] + (b[3] * scale);
            return out;
        }
        vec4.scaleAndAdd = scaleAndAdd;
        /**
         * Calculates the euclidian distance between two vec4's
         *
         * @param {vec4} a the first operand
         * @param {vec4} b the second operand
         * @returns {Number} distance between a and b
         */
        function distance(a, b) {
            var x = b[0] - a[0], y = b[1] - a[1], z = b[2] - a[2], w = b[3] - a[3];
            return Math.sqrt(x * x + y * y + z * z + w * w);
        }
        vec4.distance = distance;
        /**
         * Alias for {@link vec4.distance}
         * @function
         */
        vec4.dist = vec4.distance;
        /**
         * Calculates the squared euclidian distance between two vec4's
         *
         * @param {vec4} a the first operand
         * @param {vec4} b the second operand
         * @returns {Number} squared distance between a and b
         */
        function squaredDistance(a, b) {
            var x = b[0] - a[0], y = b[1] - a[1], z = b[2] - a[2], w = b[3] - a[3];
            return x * x + y * y + z * z + w * w;
        }
        vec4.squaredDistance = squaredDistance;
        /**
         * Alias for {@link vec4.squaredDistance}
         * @function
         */
        vec4.sqrDist = vec4.squaredDistance;
        /**
         * Calculates the length of a vec4
         *
         * @param {vec4} a vector to calculate length of
         * @returns {Number} length of a
         */
        function length(a) {
            var x = a[0], y = a[1], z = a[2], w = a[3];
            return Math.sqrt(x * x + y * y + z * z + w * w);
        }
        vec4.length = length;
        /**
         * Alias for {@link vec4.length}
         * @function
         */
        vec4.len = vec4.length;
        /**
         * Calculates the squared length of a vec4
         *
         * @param {vec4} a vector to calculate squared length of
         * @returns {Number} squared length of a
         */
        function squaredLength(a) {
            var x = a[0], y = a[1], z = a[2], w = a[3];
            return x * x + y * y + z * z + w * w;
        }
        vec4.squaredLength = squaredLength;
        /**
         * Alias for {@link vec4.squaredLength}
         * @function
         */
        vec4.sqrLen = vec4.squaredLength;
        /**
         * Negates the components of a vec4
         *
         * @param {vec4} out the receiving vector
         * @param {vec4} a vector to negate
         * @returns {vec4} out
         */
        function negate(out, a) {
            out[0] = -a[0];
            out[1] = -a[1];
            out[2] = -a[2];
            out[3] = -a[3];
            return out;
        }
        vec4.negate = negate;
        /**
         * Returns the inverse of the components of a vec4
         *
         * @param {vec4} out the receiving vector
         * @param {vec4} a vector to invert
         * @returns {vec4} out
         */
        function inverse(out, a) {
            out[0] = 1.0 / a[0];
            out[1] = 1.0 / a[1];
            out[2] = 1.0 / a[2];
            out[3] = 1.0 / a[3];
            return out;
        }
        vec4.inverse = inverse;
        /**
         * Normalize a vec4
         *
         * @param {vec4} out the receiving vector
         * @param {vec4} a vector to normalize
         * @returns {vec4} out
         */
        function normalize(out, a) {
            var x = a[0], y = a[1], z = a[2], w = a[3];
            var len = x * x + y * y + z * z + w * w;
            if (len > 0) {
                len = 1 / Math.sqrt(len);
                out[0] = a[0] * len;
                out[1] = a[1] * len;
                out[2] = a[2] * len;
                out[3] = a[3] * len;
            }
            return out;
        }
        vec4.normalize = normalize;
        /**
         * Calculates the dot product of two vec4's
         *
         * @param {vec4} a the first operand
         * @param {vec4} b the second operand
         * @returns {Number} dot product of a and b
         */
        function dot(a, b) {
            return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
        }
        vec4.dot = dot;
        /**
         * Performs a linear interpolation between two vec4's
         *
         * @param {vec4} out the receiving vector
         * @param {vec4} a the first operand
         * @param {vec4} b the second operand
         * @param {Number} t interpolation amount between the two inputs
         * @returns {vec4} out
         */
        function lerp(out, a, b, t) {
            var ax = a[0], ay = a[1], az = a[2], aw = a[3];
            out[0] = ax + t * (b[0] - ax);
            out[1] = ay + t * (b[1] - ay);
            out[2] = az + t * (b[2] - az);
            out[3] = aw + t * (b[3] - aw);
            return out;
        }
        vec4.lerp = lerp;
        /**
         * Generates a random vector with the given scale
         *
         * @param {vec4} out the receiving vector
         * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
         * @returns {vec4} out
         */
        function random(out, scale) {
            scale = scale || 1.0;
            //TODO: This is a pretty awful way of doing this. Find something better.
            out[0] = glMatrix.GLMAT_RANDOM();
            out[1] = glMatrix.GLMAT_RANDOM();
            out[2] = glMatrix.GLMAT_RANDOM();
            out[3] = glMatrix.GLMAT_RANDOM();
            vec4.normalize(out, out);
            vec4.scale(out, out, scale);
            return out;
        }
        vec4.random = random;
        /**
         * Transforms the vec4 with a mat4.
         *
         * @param {vec4} out the receiving vector
         * @param {vec4} a the vector to transform
         * @param {mat4} m matrix to transform with
         * @returns {vec4} out
         */
        function transformMat4(out, a, m) {
            var x = a[0], y = a[1], z = a[2], w = a[3];
            out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
            out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
            out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
            out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
            return out;
        }
        vec4.transformMat4 = transformMat4;
        /**
         * Transforms the vec4 with a quat
         *
         * @param {vec4} out the receiving vector
         * @param {vec4} a the vector to transform
         * @param {quat} q quaternion to transform with
         * @returns {vec4} out
         */
        function transformQuat(out, a, q) {
            var x = a[0], y = a[1], z = a[2], qx = q[0], qy = q[1], qz = q[2], qw = q[3], 
            // calculate quat * vec
            ix = qw * x + qy * z - qz * y, iy = qw * y + qz * x - qx * z, iz = qw * z + qx * y - qy * x, iw = -qx * x - qy * y - qz * z;
            // calculate result * inverse quat
            out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
            out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
            out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
            out[3] = a[3];
            return out;
        }
        vec4.transformQuat = transformQuat;
        /**
         * Perform some operation over an array of vec4s.
         *
         * @param {Array} a the array of vectors to iterate over
         * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
         * @param {Number} offset Number of elements to skip at the beginning of the array
         * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
         * @param {Function} fn Function to call for each vector in the array
         * @param {Object} [arg] additional argument to pass to fn
         * @returns {Array} a
         * @function
         */
        vec4.forEach = (function () {
            var vec = vec4.create();
            return function (a, stride, offset, count, fn, arg) {
                var i, l;
                if (!stride) {
                    stride = 4;
                }
                if (!offset) {
                    offset = 0;
                }
                if (count) {
                    l = Math.min((count * stride) + offset, a.length);
                }
                else {
                    l = a.length;
                }
                for (i = offset; i < l; i += stride) {
                    vec[0] = a[i];
                    vec[1] = a[i + 1];
                    vec[2] = a[i + 2];
                    vec[3] = a[i + 3];
                    fn(vec, vec, arg);
                    a[i] = vec[0];
                    a[i + 1] = vec[1];
                    a[i + 2] = vec[2];
                    a[i + 3] = vec[3];
                }
                return a;
            };
        })();
        /**
         * Returns a string representation of a vector
         *
         * @param {vec4} vec vector to represent as a string
         * @returns {String} string representation of the vector
         */
        function str(a) {
            return 'vec4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
        }
        vec4.str = str;
    })(vec4 || (vec4 = {}));
    return vec4;
});

/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

 Redistribution and use in source and binary forms, with or without modification,
 are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this
 list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */
define('math/quat',["require", "exports", "./glMatrix", "./vec3", "./mat3", "./vec4"], function (require, exports, glMatrix, vec3, mat3, vec4) {
    /**
     * @class Quaternion
     * @name quat
     */
    var quat;
    (function (quat) {
        /**
         * Creates a new identity quat
         *
         * @returns {quat} a new quaternion
         */
        function create() {
            var out = new glMatrix.GLMAT_ARRAY_TYPE(4);
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            return out;
        }
        quat.create = create;
        /**
         * Sets a quaternion to represent the shortest rotation from one
         * vector to another.
         *
         * Both vectors are assumed to be unit length.
         *
         * @param {quat} out the receiving quaternion.
         * @param {vec3} a the initial vector
         * @param {vec3} b the destination vector
         * @returns {quat} out
         */
        quat.rotationTo = (function () {
            var tmpvec3 = vec3.create();
            var xUnitVec3 = vec3.fromValues(1, 0, 0);
            var yUnitVec3 = vec3.fromValues(0, 1, 0);
            return function (out, a, b) {
                var dot = vec3.dot(a, b);
                if (dot < -0.999999) {
                    vec3.cross(tmpvec3, xUnitVec3, a);
                    if (vec3.length(tmpvec3) < 0.000001)
                        vec3.cross(tmpvec3, yUnitVec3, a);
                    vec3.normalize(tmpvec3, tmpvec3);
                    quat.setAxisAngle(out, tmpvec3, Math.PI);
                    return out;
                }
                else if (dot > 0.999999) {
                    out[0] = 0;
                    out[1] = 0;
                    out[2] = 0;
                    out[3] = 1;
                    return out;
                }
                else {
                    vec3.cross(tmpvec3, a, b);
                    out[0] = tmpvec3[0];
                    out[1] = tmpvec3[1];
                    out[2] = tmpvec3[2];
                    out[3] = 1 + dot;
                    return quat.normalize(out, out);
                }
            };
        })();
        /**
         * Sets the specified quaternion with values corresponding to the given
         * axes. Each axis is a vec3 and is expected to be unit length and
         * perpendicular to all other specified axes.
         *
         * @param {vec3} view  the vector representing the viewing direction
         * @param {vec3} right the vector representing the local "right" direction
         * @param {vec3} up    the vector representing the local "up" direction
         * @returns {quat} out
         */
        quat.setAxes = (function () {
            var matr = mat3.create();
            return function (out, view, right, up) {
                matr[0] = right[0];
                matr[3] = right[1];
                matr[6] = right[2];
                matr[1] = up[0];
                matr[4] = up[1];
                matr[7] = up[2];
                matr[2] = -view[0];
                matr[5] = -view[1];
                matr[8] = -view[2];
                return quat.normalize(out, quat.fromMat3(out, matr));
            };
        })();
        /**
         * Creates a new quat initialized with values from an existing quaternion
         *
         * @param {quat} a quaternion to clone
         * @returns {quat} a new quaternion
         * @function
         */
        quat.clone = vec4.clone;
        /**
         * Creates a new quat initialized with the given values
         *
         * @param {Number} x X component
         * @param {Number} y Y component
         * @param {Number} z Z component
         * @param {Number} w W component
         * @returns {quat} a new quaternion
         * @function
         */
        quat.fromValues = vec4.fromValues;
        /**
         * Copy the values from one quat to another
         *
         * @param {quat} out the receiving quaternion
         * @param {quat} a the source quaternion
         * @returns {quat} out
         * @function
         */
        quat.copy = vec4.copy;
        /**
         * Set the components of a quat to the given values
         *
         * @param {quat} out the receiving quaternion
         * @param {Number} x X component
         * @param {Number} y Y component
         * @param {Number} z Z component
         * @param {Number} w W component
         * @returns {quat} out
         * @function
         */
        quat.set = vec4.set;
        /**
         * Set a quat to the identity quaternion
         *
         * @param {quat} out the receiving quaternion
         * @returns {quat} out
         */
        function identity(out) {
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            return out;
        }
        quat.identity = identity;
        /**
         * Sets a quat from the given angle and rotation axis,
         * then returns it.
         *
         * @param {quat} out the receiving quaternion
         * @param {vec3} axis the axis around which to rotate
         * @param {Number} rad the angle in radians
         * @returns {quat} out
         **/
        function setAxisAngle(out, axis, rad) {
            rad = rad * 0.5;
            var s = Math.sin(rad);
            out[0] = s * axis[0];
            out[1] = s * axis[1];
            out[2] = s * axis[2];
            out[3] = Math.cos(rad);
            return out;
        }
        quat.setAxisAngle = setAxisAngle;
        /**
         * Adds two quat's
         *
         * @param {quat} out the receiving quaternion
         * @param {quat} a the first operand
         * @param {quat} b the second operand
         * @returns {quat} out
         * @function
         */
        quat.add = vec4.add;
        /**
         * Multiplies two quat's
         *
         * @param {quat} out the receiving quaternion
         * @param {quat} a the first operand
         * @param {quat} b the second operand
         * @returns {quat} out
         */
        function multiply(out, a, b) {
            var ax = a[0], ay = a[1], az = a[2], aw = a[3], bx = b[0], by = b[1], bz = b[2], bw = b[3];
            out[0] = ax * bw + aw * bx + ay * bz - az * by;
            out[1] = ay * bw + aw * by + az * bx - ax * bz;
            out[2] = az * bw + aw * bz + ax * by - ay * bx;
            out[3] = aw * bw - ax * bx - ay * by - az * bz;
            return out;
        }
        quat.multiply = multiply;
        /**
         * Alias for {@link quat.multiply}
         * @function
         */
        quat.mul = quat.multiply;
        /**
         * Scales a quat by a scalar number
         *
         * @param {quat} out the receiving vector
         * @param {quat} a the vector to scale
         * @param {Number} b amount to scale the vector by
         * @returns {quat} out
         * @function
         */
        quat.scale = vec4.scale;
        /**
         * Rotates a quaternion by the given angle about the X axis
         *
         * @param {quat} out quat receiving operation result
         * @param {quat} a quat to rotate
         * @param {number} rad angle (in radians) to rotate
         * @returns {quat} out
         */
        function rotateX(out, a, rad) {
            rad *= 0.5;
            var ax = a[0], ay = a[1], az = a[2], aw = a[3], bx = Math.sin(rad), bw = Math.cos(rad);
            out[0] = ax * bw + aw * bx;
            out[1] = ay * bw + az * bx;
            out[2] = az * bw - ay * bx;
            out[3] = aw * bw - ax * bx;
            return out;
        }
        quat.rotateX = rotateX;
        /**
         * Rotates a quaternion by the given angle about the Y axis
         *
         * @param {quat} out quat receiving operation result
         * @param {quat} a quat to rotate
         * @param {number} rad angle (in radians) to rotate
         * @returns {quat} out
         */
        function rotateY(out, a, rad) {
            rad *= 0.5;
            var ax = a[0], ay = a[1], az = a[2], aw = a[3], by = Math.sin(rad), bw = Math.cos(rad);
            out[0] = ax * bw - az * by;
            out[1] = ay * bw + aw * by;
            out[2] = az * bw + ax * by;
            out[3] = aw * bw - ay * by;
            return out;
        }
        quat.rotateY = rotateY;
        /**
         * Rotates a quaternion by the given angle about the Z axis
         *
         * @param {quat} out quat receiving operation result
         * @param {quat} a quat to rotate
         * @param {number} rad angle (in radians) to rotate
         * @returns {quat} out
         */
        function rotateZ(out, a, rad) {
            rad *= 0.5;
            var ax = a[0], ay = a[1], az = a[2], aw = a[3], bz = Math.sin(rad), bw = Math.cos(rad);
            out[0] = ax * bw + ay * bz;
            out[1] = ay * bw - ax * bz;
            out[2] = az * bw + aw * bz;
            out[3] = aw * bw - az * bz;
            return out;
        }
        quat.rotateZ = rotateZ;
        /**
         * Calculates the W component of a quat from the X, Y, and Z components.
         * Assumes that quaternion is 1 unit in length.
         * Any existing W component will be ignored.
         *
         * @param {quat} out the receiving quaternion
         * @param {quat} a quat to calculate W component of
         * @returns {quat} out
         */
        function calculateW(out, a) {
            var x = a[0], y = a[1], z = a[2];
            out[0] = x;
            out[1] = y;
            out[2] = z;
            out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
            return out;
        }
        quat.calculateW = calculateW;
        /**
         * Calculates the dot product of two quat's
         *
         * @param {quat} a the first operand
         * @param {quat} b the second operand
         * @returns {Number} dot product of a and b
         * @function
         */
        quat.dot = vec4.dot;
        /**
         * Performs a linear interpolation between two quat's
         *
         * @param {quat} out the receiving quaternion
         * @param {quat} a the first operand
         * @param {quat} b the second operand
         * @param {Number} t interpolation amount between the two inputs
         * @returns {quat} out
         * @function
         */
        quat.lerp = vec4.lerp;
        /**
         * Performs a spherical linear interpolation between two quat
         *
         * @param {quat} out the receiving quaternion
         * @param {quat} a the first operand
         * @param {quat} b the second operand
         * @param {Number} t interpolation amount between the two inputs
         * @returns {quat} out
         */
        function slerp(out, a, b, t) {
            // benchmarks:
            //    http://jsperf.com/quaternion-slerp-implementations
            var ax = a[0], ay = a[1], az = a[2], aw = a[3], bx = b[0], by = b[1], bz = b[2], bw = b[3];
            var omega, cosom, sinom, scale0, scale1;
            // calc cosine
            cosom = ax * bx + ay * by + az * bz + aw * bw;
            // adjust signs (if necessary)
            if (cosom < 0.0) {
                cosom = -cosom;
                bx = -bx;
                by = -by;
                bz = -bz;
                bw = -bw;
            }
            // calculate coefficients
            if ((1.0 - cosom) > 0.000001) {
                // standard case (slerp)
                omega = Math.acos(cosom);
                sinom = Math.sin(omega);
                scale0 = Math.sin((1.0 - t) * omega) / sinom;
                scale1 = Math.sin(t * omega) / sinom;
            }
            else {
                // "from" and "to" quaternions are very close
                //  ... so we can do a linear interpolation
                scale0 = 1.0 - t;
                scale1 = t;
            }
            // calculate final values
            out[0] = scale0 * ax + scale1 * bx;
            out[1] = scale0 * ay + scale1 * by;
            out[2] = scale0 * az + scale1 * bz;
            out[3] = scale0 * aw + scale1 * bw;
            return out;
        }
        quat.slerp = slerp;
        /**
         * Calculates the inverse of a quat
         *
         * @param {quat} out the receiving quaternion
         * @param {quat} a quat to calculate inverse of
         * @returns {quat} out
         */
        function invert(out, a) {
            var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3, invDot = dot ? 1.0 / dot : 0;
            // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0
            out[0] = -a0 * invDot;
            out[1] = -a1 * invDot;
            out[2] = -a2 * invDot;
            out[3] = a3 * invDot;
            return out;
        }
        quat.invert = invert;
        /**
         * Calculates the conjugate of a quat
         * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
         *
         * @param {quat} out the receiving quaternion
         * @param {quat} a quat to calculate conjugate of
         * @returns {quat} out
         */
        function conjugate(out, a) {
            out[0] = -a[0];
            out[1] = -a[1];
            out[2] = -a[2];
            out[3] = a[3];
            return out;
        }
        quat.conjugate = conjugate;
        /**
         * Calculates the length of a quat
         *
         * @param {quat} a vector to calculate length of
         * @returns {Number} length of a
         * @function
         */
        quat.length = vec4.length;
        /**
         * Alias for {@link quat.length}
         * @function
         */
        quat.len = quat.length;
        /**
         * Calculates the squared length of a quat
         *
         * @param {quat} a vector to calculate squared length of
         * @returns {Number} squared length of a
         * @function
         */
        quat.squaredLength = vec4.squaredLength;
        /**
         * Alias for {@link quat.squaredLength}
         * @function
         */
        quat.sqrLen = quat.squaredLength;
        /**
         * Normalize a quat
         *
         * @param {quat} out the receiving quaternion
         * @param {quat} a quaternion to normalize
         * @returns {quat} out
         * @function
         */
        quat.normalize = vec4.normalize;
        /**
         * Creates a quaternion from the given 3x3 rotation matrix.
         *
         * NOTE: The resultant quaternion is not normalized, so you should be sure
         * to renormalize the quaternion yourself where necessary.
         *
         * @param {quat} out the receiving quaternion
         * @param {mat3} m rotation matrix
         * @returns {quat} out
         * @function
         */
        function fromMat3(out, m) {
            // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
            // article "Quaternion Calculus and Fast Animation".
            var fTrace = m[0] + m[4] + m[8];
            var fRoot;
            if (fTrace > 0.0) {
                // |w| > 1/2, may as well choose w > 1/2
                fRoot = Math.sqrt(fTrace + 1.0); // 2w
                out[3] = 0.5 * fRoot;
                fRoot = 0.5 / fRoot; // 1/(4w)
                out[0] = (m[5] - m[7]) * fRoot;
                out[1] = (m[6] - m[2]) * fRoot;
                out[2] = (m[1] - m[3]) * fRoot;
            }
            else {
                // |w| <= 1/2
                var i = 0;
                if (m[4] > m[0])
                    i = 1;
                if (m[8] > m[i * 3 + i])
                    i = 2;
                var j = (i + 1) % 3;
                var k = (i + 2) % 3;
                fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
                out[i] = 0.5 * fRoot;
                fRoot = 0.5 / fRoot;
                out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
                out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
                out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
            }
            return out;
        }
        quat.fromMat3 = fromMat3;
        /**
         * Returns a string representation of a quatenion
         *
         * @param {quat} vec vector to represent as a string
         * @returns {String} string representation of the vector
         */
        function str(a) {
            return 'quat(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
        }
        quat.str = str;
    })(quat || (quat = {}));
    return quat;
});

/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

 Redistribution and use in source and binary forms, with or without modification,
 are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this
 list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */
define('math/vec2',["require", "exports", "./glMatrix"], function (require, exports, glMatrix) {
    /**
     * @class 2 Dimensional Vector
     * @name vec2
     */
    var vec2;
    (function (vec2) {
        /**
         * Creates a new, empty vec2
         *
         * @returns {vec2} a new 2D vector
         */
        function create() {
            var out = new glMatrix.GLMAT_ARRAY_TYPE(2);
            out[0] = 0;
            out[1] = 0;
            return out;
        }
        vec2.create = create;
        /**
         * Creates a new vec2 initialized with values from an existing vector
         *
         * @param {vec2} a vector to clone
         * @returns {vec2} a new 2D vector
         */
        function clone(a) {
            var out = new glMatrix.GLMAT_ARRAY_TYPE(2);
            out[0] = a[0];
            out[1] = a[1];
            return out;
        }
        vec2.clone = clone;
        /**
         * Creates a new vec2 initialized with the given values
         *
         * @param {Number} x X component
         * @param {Number} y Y component
         * @returns {vec2} a new 2D vector
         */
        function fromValues(x, y) {
            var out = new glMatrix.GLMAT_ARRAY_TYPE(2);
            out[0] = x;
            out[1] = y;
            return out;
        }
        vec2.fromValues = fromValues;
        /**
         * Copy the values from one vec2 to another
         *
         * @param {vec2} out the receiving vector
         * @param {vec2} a the source vector
         * @returns {vec2} out
         */
        function copy(out, a) {
            out[0] = a[0];
            out[1] = a[1];
            return out;
        }
        vec2.copy = copy;
        /**
         * Set the components of a vec2 to the given values
         *
         * @param {vec2} out the receiving vector
         * @param {Number} x X component
         * @param {Number} y Y component
         * @returns {vec2} out
         */
        function set(out, x, y) {
            out[0] = x;
            out[1] = y;
            return out;
        }
        vec2.set = set;
        /**
         * Adds two vec2's
         *
         * @param {vec2} out the receiving vector
         * @param {vec2} a the first operand
         * @param {vec2} b the second operand
         * @returns {vec2} out
         */
        function add(out, a, b) {
            out[0] = a[0] + b[0];
            out[1] = a[1] + b[1];
            return out;
        }
        vec2.add = add;
        /**
         * Subtracts vector b from vector a
         *
         * @param {vec2} out the receiving vector
         * @param {vec2} a the first operand
         * @param {vec2} b the second operand
         * @returns {vec2} out
         */
        function subtract(out, a, b) {
            out[0] = a[0] - b[0];
            out[1] = a[1] - b[1];
            return out;
        }
        vec2.subtract = subtract;
        /**
         * Multiplies two vec2's
         *
         * @param {vec2} out the receiving vector
         * @param {vec2} a the first operand
         * @param {vec2} b the second operand
         * @returns {vec2} out
         */
        function multiply(out, a, b) {
            out[0] = a[0] * b[0];
            out[1] = a[1] * b[1];
            return out;
        }
        vec2.multiply = multiply;
        /**
         * Divides two vec2's
         *
         * @param {vec2} out the receiving vector
         * @param {vec2} a the first operand
         * @param {vec2} b the second operand
         * @returns {vec2} out
         */
        function divide(out, a, b) {
            out[0] = a[0] / b[0];
            out[1] = a[1] / b[1];
            return out;
        }
        vec2.divide = divide;
        /**
         * Returns the minimum of two vec2's
         *
         * @param {vec2} out the receiving vector
         * @param {vec2} a the first operand
         * @param {vec2} b the second operand
         * @returns {vec2} out
         */
        function min(out, a, b) {
            out[0] = Math.min(a[0], b[0]);
            out[1] = Math.min(a[1], b[1]);
            return out;
        }
        vec2.min = min;
        /**
         * Returns the maximum of two vec2's
         *
         * @param {vec2} out the receiving vector
         * @param {vec2} a the first operand
         * @param {vec2} b the second operand
         * @returns {vec2} out
         */
        function max(out, a, b) {
            out[0] = Math.max(a[0], b[0]);
            out[1] = Math.max(a[1], b[1]);
            return out;
        }
        vec2.max = max;
        /**
         * Scales a vec2 by a scalar number
         *
         * @param {vec2} out the receiving vector
         * @param {vec2} a the vector to scale
         * @param {Number} b amount to scale the vector by
         * @returns {vec2} out
         */
        function scale(out, a, b) {
            out[0] = a[0] * b;
            out[1] = a[1] * b;
            return out;
        }
        vec2.scale = scale;
        /**
         * Adds two vec2's after scaling the second operand by a scalar value
         *
         * @param {vec2} out the receiving vector
         * @param {vec2} a the first operand
         * @param {vec2} b the second operand
         * @param {Number} scale the amount to scale b by before adding
         * @returns {vec2} out
         */
        function scaleAndAdd(out, a, b, scale) {
            out[0] = a[0] + (b[0] * scale);
            out[1] = a[1] + (b[1] * scale);
            return out;
        }
        vec2.scaleAndAdd = scaleAndAdd;
        /**
         * Calculates the euclidian distance between two vec2's
         *
         * @param {vec2} a the first operand
         * @param {vec2} b the second operand
         * @returns {Number} distance between a and b
         */
        function distance(a, b) {
            var x = b[0] - a[0], y = b[1] - a[1];
            return Math.sqrt(x * x + y * y);
        }
        vec2.distance = distance;
        /**
         * Calculates the squared euclidian distance between two vec2's
         *
         * @param {vec2} a the first operand
         * @param {vec2} b the second operand
         * @returns {Number} squared distance between a and b
         */
        function squaredDistance(a, b) {
            var x = b[0] - a[0], y = b[1] - a[1];
            return x * x + y * y;
        }
        vec2.squaredDistance = squaredDistance;
        /**
         * Calculates the length of a vec2
         *
         * @param {vec2} a vector to calculate length of
         * @returns {Number} length of a
         */
        function length(a) {
            var x = a[0], y = a[1];
            return Math.sqrt(x * x + y * y);
        }
        vec2.length = length;
        /**
         * Calculates the squared length of a vec2
         *
         * @param {vec2} a vector to calculate squared length of
         * @returns {Number} squared length of a
         */
        function squaredLength(a) {
            var x = a[0], y = a[1];
            return x * x + y * y;
        }
        vec2.squaredLength = squaredLength;
        /**
         * Negates the components of a vec2
         *
         * @param {vec2} out the receiving vector
         * @param {vec2} a vector to negate
         * @returns {vec2} out
         */
        function negate(out, a) {
            out[0] = -a[0];
            out[1] = -a[1];
            return out;
        }
        vec2.negate = negate;
        /**
         * Returns the inverse of the components of a vec2
         *
         * @param {vec2} out the receiving vector
         * @param {vec2} a vector to invert
         * @returns {vec2} out
         */
        function inverse(out, a) {
            out[0] = 1.0 / a[0];
            out[1] = 1.0 / a[1];
            return out;
        }
        vec2.inverse = inverse;
        /**
         * Normalize a vec2
         *
         * @param {vec2} out the receiving vector
         * @param {vec2} a vector to normalize
         * @returns {vec2} out
         */
        function normalize(out, a) {
            var x = a[0], y = a[1];
            var len = x * x + y * y;
            if (len > 0) {
                //TODO: evaluate use of glm_invsqrt here?
                len = 1 / Math.sqrt(len);
                out[0] = a[0] * len;
                out[1] = a[1] * len;
            }
            return out;
        }
        vec2.normalize = normalize;
        /**
         * Calculates the dot product of two vec2's
         *
         * @param {vec2} a the first operand
         * @param {vec2} b the second operand
         * @returns {Number} dot product of a and b
         */
        function dot(a, b) {
            return a[0] * b[0] + a[1] * b[1];
        }
        vec2.dot = dot;
        /**
         * Computes the cross product of two vec2's
         * Note that the cross product must by definition produce a 3D vector
         *
         * @param {vec3} out the receiving vector
         * @param {vec2} a the first operand
         * @param {vec2} b the second operand
         * @returns {vec3} out
         */
        function cross(out, a, b) {
            var z = a[0] * b[1] - a[1] * b[0];
            out[0] = out[1] = 0;
            out[2] = z;
            return out;
        }
        vec2.cross = cross;
        /**
         * Performs a linear interpolation between two vec2's
         *
         * @param {vec2} out the receiving vector
         * @param {vec2} a the first operand
         * @param {vec2} b the second operand
         * @param {Number} t interpolation amount between the two inputs
         * @returns {vec2} out
         */
        function lerp(out, a, b, t) {
            var ax = a[0], ay = a[1];
            out[0] = ax + t * (b[0] - ax);
            out[1] = ay + t * (b[1] - ay);
            return out;
        }
        vec2.lerp = lerp;
        /**
         * Generates a random vector with the given scale
         *
         * @param {vec2} out the receiving vector
         * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
         * @returns {vec2} out
         */
        function random(out, scale) {
            scale = scale || 1.0;
            var r = glMatrix.GLMAT_RANDOM() * 2.0 * Math.PI;
            out[0] = Math.cos(r) * scale;
            out[1] = Math.sin(r) * scale;
            return out;
        }
        vec2.random = random;
        /**
         * Transforms the vec2 with a mat2
         *
         * @param {vec2} out the receiving vector
         * @param {vec2} a the vector to transform
         * @param {mat2} m matrix to transform with
         * @returns {vec2} out
         */
        function transformMat2(out, a, m) {
            var x = a[0], y = a[1];
            out[0] = m[0] * x + m[2] * y;
            out[1] = m[1] * x + m[3] * y;
            return out;
        }
        vec2.transformMat2 = transformMat2;
        /**
         * Transforms the vec2 with a mat2d
         *
         * @param {vec2} out the receiving vector
         * @param {vec2} a the vector to transform
         * @param {mat2d} m matrix to transform with
         * @returns {vec2} out
         */
        function transformMat2d(out, a, m) {
            var x = a[0], y = a[1];
            out[0] = m[0] * x + m[2] * y + m[4];
            out[1] = m[1] * x + m[3] * y + m[5];
            return out;
        }
        vec2.transformMat2d = transformMat2d;
        /**
         * Transforms the vec2 with a mat3
         * 3rd vector component is implicitly '1'
         *
         * @param {vec2} out the receiving vector
         * @param {vec2} a the vector to transform
         * @param {mat3} m matrix to transform with
         * @returns {vec2} out
         */
        function transformMat3(out, a, m) {
            var x = a[0], y = a[1];
            out[0] = m[0] * x + m[3] * y + m[6];
            out[1] = m[1] * x + m[4] * y + m[7];
            return out;
        }
        vec2.transformMat3 = transformMat3;
        /**
         * Transforms the vec2 with a mat4
         * 3rd vector component is implicitly '0'
         * 4th vector component is implicitly '1'
         *
         * @param {vec2} out the receiving vector
         * @param {vec2} a the vector to transform
         * @param {mat4} m matrix to transform with
         * @returns {vec2} out
         */
        function transformMat4(out, a, m) {
            var x = a[0], y = a[1];
            out[0] = m[0] * x + m[4] * y + m[12];
            out[1] = m[1] * x + m[5] * y + m[13];
            return out;
        }
        vec2.transformMat4 = transformMat4;
        /**
         * Perform some operation over an array of vec2s.
         *
         * @param {Array} a the array of vectors to iterate over
         * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
         * @param {Number} offset Number of elements to skip at the beginning of the array
         * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
         * @param {Function} fn Function to call for each vector in the array
         * @param {Object} [arg] additional argument to pass to fn
         * @returns {Array} a
         * @function
         */
        vec2.forEach = (function () {
            var vec = vec2.create();
            return function (a, stride, offset, count, fn, arg) {
                var i, l;
                if (!stride) {
                    stride = 2;
                }
                if (!offset) {
                    offset = 0;
                }
                if (count) {
                    l = Math.min((count * stride) + offset, a.length);
                }
                else {
                    l = a.length;
                }
                for (i = offset; i < l; i += stride) {
                    vec[0] = a[i];
                    vec[1] = a[i + 1];
                    fn(vec, vec, arg);
                    a[i] = vec[0];
                    a[i + 1] = vec[1];
                }
                return a;
            };
        })();
        /**
         * Returns a string representation of a vector
         *
         * @param {vec2} vec vector to represent as a string
         * @returns {String} string representation of the vector
         */
        function str(a) {
            return 'vec2(' + a[0] + ', ' + a[1] + ')';
        }
        vec2.str = str;
    })(vec2 || (vec2 = {}));
    return vec2;
});

define('math/index',["require", "exports", './mat2', './mat2d', './mat3', './mat4', './quat', './vec2', './vec3', './vec4'], function (require, exports, mat2_file, mat2d_file, mat3_file, mat4_file, quat_file, vec2_file, vec3_file, vec4_file) {
    exports.mat2 = mat2_file; ///ts:export:generated
    exports.mat2d = mat2d_file; ///ts:export:generated
    exports.mat3 = mat3_file; ///ts:export:generated
    exports.mat4 = mat4_file; ///ts:export:generated
    exports.quat = quat_file; ///ts:export:generated
    exports.vec2 = vec2_file; ///ts:export:generated
    exports.vec3 = vec3_file; ///ts:export:generated
    exports.vec4 = vec4_file; ///ts:export:generated
});

///<reference path="./nemesisConfig.d.ts" />
define('config',["require", "exports", './canvas'], function (require, exports, canvas) {
    /**
     * Retrieves the configurations as defined by the user.
     */
    var config = {};
    if (canvas.getAttribute('debug') == "true") {
        config.throwOnGLError = true;
        config.logGLCalls = true;
        config.validateGLArgs = true;
    }
    return config;
});

define('util/debug/webgl',["require", "exports", "../logger/consoleLogger"], function (require, exports, logger) {
    var WebGLDebugUtils;
    (function (WebGLDebugUtils) {
        /**
         * Which arguments are enums based on the number of arguments to the function.
         * So
         *    'texImage2D': {
     *       9: { 0:true, 2:true, 6:true, 7:true },
     *       6: { 0:true, 2:true, 3:true, 4:true },
     *    },
         *
         * means if there are 9 arguments then 6 and 7 are enums, if there are 6
         * arguments 3 and 4 are enums
         *
         * @type {!Object.<number, !Object.<number, string>}
         */
        var glValidEnumContexts = {
            // Generic setters and getters
            'enable': { 1: { 0: true } },
            'disable': { 1: { 0: true } },
            'getParameter': { 1: { 0: true } },
            // Rendering
            'drawArrays': { 3: { 0: true } },
            'drawElements': { 4: { 0: true, 2: true } },
            // Shaders
            'createShader': { 1: { 0: true } },
            'getShaderParameter': { 2: { 1: true } },
            'getProgramParameter': { 2: { 1: true } },
            'getShaderPrecisionFormat': { 2: { 0: true, 1: true } },
            // Vertex attributes
            'getVertexAttrib': { 2: { 1: true } },
            'vertexAttribPointer': { 6: { 2: true } },
            // Textures
            'bindTexture': { 2: { 0: true } },
            'activeTexture': { 1: { 0: true } },
            'getTexParameter': { 2: { 0: true, 1: true } },
            'texParameterf': { 3: { 0: true, 1: true } },
            'texParameteri': { 3: { 0: true, 1: true, 2: true } },
            'texImage2D': {
                9: { 0: true, 2: true, 6: true, 7: true },
                6: { 0: true, 2: true, 3: true, 4: true }
            },
            'texSubImage2D': {
                9: { 0: true, 6: true, 7: true },
                7: { 0: true, 4: true, 5: true }
            },
            'copyTexImage2D': { 8: { 0: true, 2: true } },
            'copyTexSubImage2D': { 8: { 0: true } },
            'generateMipmap': { 1: { 0: true } },
            'compressedTexImage2D': { 7: { 0: true, 2: true } },
            'compressedTexSubImage2D': { 8: { 0: true, 6: true } },
            // Buffer objects
            'bindBuffer': { 2: { 0: true } },
            'bufferData': { 3: { 0: true, 2: true } },
            'bufferSubData': { 3: { 0: true } },
            'getBufferParameter': { 2: { 0: true, 1: true } },
            // Renderbuffers and framebuffers
            'pixelStorei': { 2: { 0: true, 1: true } },
            'readPixels': { 7: { 4: true, 5: true } },
            'bindRenderbuffer': { 2: { 0: true } },
            'bindFramebuffer': { 2: { 0: true } },
            'checkFramebufferStatus': { 1: { 0: true } },
            'framebufferRenderbuffer': { 4: { 0: true, 1: true, 2: true } },
            'framebufferTexture2D': { 5: { 0: true, 1: true, 2: true } },
            'getFramebufferAttachmentParameter': { 3: { 0: true, 1: true, 2: true } },
            'getRenderbufferParameter': { 2: { 0: true, 1: true } },
            'renderbufferStorage': { 4: { 0: true, 1: true } },
            // Frame buffer operations (clear, blend, depth test, stencil)
            'clear': { 1: { 0: { 'enumBitwiseOr': ['COLOR_BUFFER_BIT', 'DEPTH_BUFFER_BIT', 'STENCIL_BUFFER_BIT'] } } },
            'depthFunc': { 1: { 0: true } },
            'blendFunc': { 2: { 0: true, 1: true } },
            'blendFuncSeparate': { 4: { 0: true, 1: true, 2: true, 3: true } },
            'blendEquation': { 1: { 0: true } },
            'blendEquationSeparate': { 2: { 0: true, 1: true } },
            'stencilFunc': { 3: { 0: true } },
            'stencilFuncSeparate': { 4: { 0: true, 1: true } },
            'stencilMaskSeparate': { 2: { 0: true } },
            'stencilOp': { 3: { 0: true, 1: true, 2: true } },
            'stencilOpSeparate': { 4: { 0: true, 1: true, 2: true, 3: true } },
            // Culling
            'cullFace': { 1: { 0: true } },
            'frontFace': { 1: { 0: true } },
            // ANGLE_instanced_arrays extension
            'drawArraysInstancedANGLE': { 4: { 0: true } },
            'drawElementsInstancedANGLE': { 5: { 0: true, 2: true } },
            // EXT_blend_minmax extension
            'blendEquationEXT': { 1: { 0: true } }
        };
        /**
         * Map of numbers to names.
         * @type {Object}
         */
        var glEnums = null;
        /**
         * Map of names to numbers.
         * @type {Object}
         */
        var enumStringToValue = null;
        /**
         * Initializes this module. Safe to call more than once.
         * @param {!WebGLRenderingContext} ctx A WebGL context. If
         *    you have more than one context it doesn't matter which one
         *    you pass in, it is only used to pull out constants.
         */
        function init(ctx) {
            if (glEnums == null) {
                glEnums = {};
                enumStringToValue = {};
                for (var propertyName in ctx) {
                    if (typeof ctx[propertyName] == 'number') {
                        glEnums[ctx[propertyName]] = propertyName;
                        enumStringToValue[propertyName] = ctx[propertyName];
                    }
                }
            }
        }
        WebGLDebugUtils.init = init;
        /**
         * Checks the utils have been initialized.
         */
        function checkInit() {
            if (glEnums == null) {
                throw 'WebGLDebugUtils.init(ctx) not called';
            }
        }
        /**
         * Returns true or false if value matches any WebGL enum
         * @param {*} value Value to check if it might be an enum.
         * @return {boolean} True if value matches one of the WebGL defined enums
         */
        function mightBeEnum(value) {
            checkInit();
            return (glEnums[value] !== undefined);
        }
        WebGLDebugUtils.mightBeEnum = mightBeEnum;
        /**
         * Gets an string version of an WebGL enum.
         *
         * Example:
         *   var str = WebGLDebugUtil.glEnumToString(ctx.getError());
         *
         * @param {number} value Value to return an enum for
         * @return {string} The string version of the enum.
         */
        function glEnumToString(value) {
            checkInit();
            var name = glEnums[value];
            return (name !== undefined) ? ("gl." + name) : ("/*UNKNOWN WebGL ENUM*/ 0x" + value.toString(16) + "");
        }
        WebGLDebugUtils.glEnumToString = glEnumToString;
        /**
         * Returns the string version of a WebGL argument.
         * Attempts to convert enum arguments to strings.
         * @param {string} functionName the name of the WebGL function.
         * @param {number} numArgs the number of arguments passed to the function.
         * @param {number} argumentIndx the index of the argument.
         * @param {*} value The value of the argument.
         * @return {string} The value as a string.
         */
        function glFunctionArgToString(functionName, numArgs, argumentIndex, value) {
            var funcInfo = glValidEnumContexts[functionName];
            if (funcInfo !== undefined) {
                var funcInfo = funcInfo[numArgs];
                if (funcInfo !== undefined) {
                    if (funcInfo[argumentIndex]) {
                        if (typeof funcInfo[argumentIndex] === 'object' && funcInfo[argumentIndex]['enumBitwiseOr'] !== undefined) {
                            var enums = funcInfo[argumentIndex]['enumBitwiseOr'];
                            var orResult = 0;
                            var orEnums = [];
                            for (var i = 0; i < enums.length; ++i) {
                                var enumValue = enumStringToValue[enums[i]];
                                if ((value & enumValue) !== 0) {
                                    orResult |= enumValue;
                                    orEnums.push(glEnumToString(enumValue));
                                }
                            }
                            if (orResult === value) {
                                return orEnums.join(' | ');
                            }
                            else {
                                return glEnumToString(value);
                            }
                        }
                        else {
                            return glEnumToString(value);
                        }
                    }
                }
            }
            if (value === null) {
                return "null";
            }
            else if (value === undefined) {
                return "undefined";
            }
            else {
                return value.toString();
            }
        }
        WebGLDebugUtils.glFunctionArgToString = glFunctionArgToString;
        /**
         * Converts the arguments of a WebGL function to a string.
         * Attempts to convert enum arguments to strings.
         *
         * @param {string} functionName the name of the WebGL function.
         * @param {number} args The arguments.
         * @return {string} The arguments as a string.
         */
        function glFunctionArgsToString(functionName, args) {
            // apparently we can't do args.join(",");
            var argStr = "";
            var numArgs = args.length;
            for (var ii = 0; ii < numArgs; ++ii) {
                argStr += ((ii == 0) ? '' : ', ') + glFunctionArgToString(functionName, numArgs, ii, args[ii]);
            }
            return argStr;
        }
        WebGLDebugUtils.glFunctionArgsToString = glFunctionArgsToString;
        ;
        function makePropertyWrapper(wrapper, original, propertyName) {
            //log("wrap prop: " + propertyName);
            wrapper.__defineGetter__(propertyName, function () {
                return original[propertyName];
            });
            // TODO(gmane): this needs to handle properties that take more than
            // one value?
            wrapper.__defineSetter__(propertyName, function (value) {
                //log("set: " + propertyName);
                original[propertyName] = value;
            });
        }
        // Makes a function that calls a function on another object.
        function makeFunctionWrapper(original, functionName) {
            //log("wrap fn: " + functionName);
            var f = original[functionName];
            return function () {
                //log("call: " + functionName);
                var result = f.apply(original, arguments);
                return result;
            };
        }
        /**
         * Given a WebGL context returns a wrapped context that calls
         * gl.getError after every command and calls a function if the
         * result is not gl.NO_ERROR.
         *
         * @param {!WebGLRenderingContext} ctx The webgl context to
         *        wrap.
         * @param {!function(err, funcName, args): void} opt_onErrorFunc
         *        The function to call when gl.getError returns an
         *        error. If not specified the default function calls
         *        console.log with a message.
         * @param {!function(funcName, args): void} opt_onFunc The
         *        function to call when each webgl function is called.
         *        You can use this to log all calls for example.
         * @param {!WebGLRenderingContext} opt_err_ctx The webgl context
         *        to call getError on if different than ctx.
         */
        function makeDebugContext(ctx, opt_onErrorFunc, opt_onFunc, opt_err_ctx) {
            opt_err_ctx = opt_err_ctx || ctx;
            init(ctx);
            opt_onErrorFunc = opt_onErrorFunc || function (err, functionName, args) {
                // apparently we can't do args.join(",");
                var argStr = "";
                var numArgs = args.length;
                for (var ii = 0; ii < numArgs; ++ii) {
                    argStr += ((ii == 0) ? '' : ', ') + glFunctionArgToString(functionName, numArgs, ii, args[ii]);
                }
                logger.logError("WebGL error " + glEnumToString(err) + " in " + functionName + "(" + argStr + ")");
            };
            // Holds booleans for each GL error so after we get the error ourselves
            // we can still return it to the client app.
            var glErrorShadow = {};
            // Makes a function that calls a WebGL function and then calls getError.
            function makeErrorWrapper(ctx, functionName) {
                return function () {
                    if (opt_onFunc) {
                        opt_onFunc(functionName, arguments);
                    }
                    var result = ctx[functionName].apply(ctx, arguments);
                    var err = opt_err_ctx.getError();
                    if (err != 0) {
                        glErrorShadow[err] = true;
                        opt_onErrorFunc(err, functionName, arguments);
                    }
                    return result;
                };
            }
            // Make a an object that has a copy of every property of the WebGL context
            // but wraps all functions.
            var wrapper = {};
            for (var propertyName in ctx) {
                if (typeof ctx[propertyName] == 'function') {
                    if (propertyName != 'getExtension') {
                        wrapper[propertyName] = makeErrorWrapper(ctx, propertyName);
                    }
                    else {
                        var wrapped = makeErrorWrapper(ctx, propertyName);
                        wrapper[propertyName] = function () {
                            var result = wrapped.apply(ctx, arguments);
                            return makeDebugContext(result, opt_onErrorFunc, opt_onFunc, opt_err_ctx);
                        };
                    }
                }
                else {
                    makePropertyWrapper(wrapper, ctx, propertyName);
                }
            }
            // Override the getError function with one that returns our saved results.
            wrapper.getError = function () {
                for (var err in glErrorShadow) {
                    if (glErrorShadow.hasOwnProperty(err)) {
                        if (glErrorShadow[err]) {
                            glErrorShadow[err] = false;
                            return err;
                        }
                    }
                }
                return ctx.NO_ERROR;
            };
            return wrapper;
        }
        WebGLDebugUtils.makeDebugContext = makeDebugContext;
        function resetToInitialState(ctx) {
            var numAttribs = ctx.getParameter(ctx.MAX_VERTEX_ATTRIBS);
            var tmp = ctx.createBuffer();
            ctx.bindBuffer(ctx.ARRAY_BUFFER, tmp);
            for (var ii = 0; ii < numAttribs; ++ii) {
                ctx.disableVertexAttribArray(ii);
                ctx.vertexAttribPointer(ii, 4, ctx.FLOAT, false, 0, 0);
                ctx.vertexAttrib1f(ii, 0);
            }
            ctx.deleteBuffer(tmp);
            var numTextureUnits = ctx.getParameter(ctx.MAX_TEXTURE_IMAGE_UNITS);
            for (var ii = 0; ii < numTextureUnits; ++ii) {
                ctx.activeTexture(ctx.TEXTURE0 + ii);
                ctx.bindTexture(ctx.TEXTURE_CUBE_MAP, null);
                ctx.bindTexture(ctx.TEXTURE_2D, null);
            }
            ctx.activeTexture(ctx.TEXTURE0);
            ctx.useProgram(null);
            ctx.bindBuffer(ctx.ARRAY_BUFFER, null);
            ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, null);
            ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
            ctx.bindRenderbuffer(ctx.RENDERBUFFER, null);
            ctx.disable(ctx.BLEND);
            ctx.disable(ctx.CULL_FACE);
            ctx.disable(ctx.DEPTH_TEST);
            ctx.disable(ctx.DITHER);
            ctx.disable(ctx.SCISSOR_TEST);
            ctx.blendColor(0, 0, 0, 0);
            ctx.blendEquation(ctx.FUNC_ADD);
            ctx.blendFunc(ctx.ONE, ctx.ZERO);
            ctx.clearColor(0, 0, 0, 0);
            ctx.clearDepth(1);
            ctx.clearStencil(-1);
            ctx.colorMask(true, true, true, true);
            ctx.cullFace(ctx.BACK);
            ctx.depthFunc(ctx.LESS);
            ctx.depthMask(true);
            ctx.depthRange(0, 1);
            ctx.frontFace(ctx.CCW);
            ctx.hint(ctx.GENERATE_MIPMAP_HINT, ctx.DONT_CARE);
            ctx.lineWidth(1);
            ctx.pixelStorei(ctx.PACK_ALIGNMENT, 4);
            ctx.pixelStorei(ctx.UNPACK_ALIGNMENT, 4);
            ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, false);
            ctx.pixelStorei(ctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
            // TODO: Delete this IF.
            if (ctx.UNPACK_COLORSPACE_CONVERSION_WEBGL) {
                ctx.pixelStorei(ctx.UNPACK_COLORSPACE_CONVERSION_WEBGL, ctx.BROWSER_DEFAULT_WEBGL);
            }
            ctx.polygonOffset(0, 0);
            ctx.sampleCoverage(1, false);
            ctx.scissor(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.stencilFunc(ctx.ALWAYS, 0, 0xFFFFFFFF);
            ctx.stencilMask(0xFFFFFFFF);
            ctx.stencilOp(ctx.KEEP, ctx.KEEP, ctx.KEEP);
            ctx.viewport(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT | ctx.STENCIL_BUFFER_BIT);
            while (ctx.getError())
                ;
        }
        WebGLDebugUtils.resetToInitialState = resetToInitialState;
        function makeLostContextSimulatingCanvas(canvas) {
            var unwrappedContext_;
            var wrappedContext_ = {};
            var onLost_ = [];
            var onRestored_ = [];
            var contextId_ = 1;
            var contextLost_ = false;
            var resourceId_ = 0;
            var resourceDb_ = [];
            var numCallsToLoseContext_ = 0;
            var numCalls_ = 0;
            var canRestore_ = false;
            var restoreTimeout_ = 0;
            // Holds booleans for each GL error so can simulate errors.
            var glErrorShadow_ = {};
            canvas.getContext = function (f) {
                return function () {
                    var ctx = f.apply(canvas, arguments);
                    // Did we get a context and is it a WebGL context?
                    if (ctx instanceof WebGLRenderingContext) {
                        if (ctx != unwrappedContext_) {
                            if (unwrappedContext_) {
                                throw "got different context";
                            }
                            unwrappedContext_ = ctx;
                            wrappedContext_ = makeLostContextSimulatingContext(unwrappedContext_);
                        }
                        return wrappedContext_;
                    }
                    return ctx;
                };
            }(canvas.getContext);
            function wrapEvent(listener) {
                if (typeof (listener) == "function") {
                    return listener;
                }
                else {
                    return function (info) {
                        listener.handleEvent(info);
                    };
                }
            }
            var addOnContextLostListener = function (listener) {
                onLost_.push(wrapEvent(listener));
            };
            var addOnContextRestoredListener = function (listener) {
                onRestored_.push(wrapEvent(listener));
            };
            function wrapAddEventListener(canvas) {
                var f = canvas.addEventListener;
                canvas.addEventListener = function (type, listener, bubble) {
                    switch (type) {
                        case 'webglcontextlost':
                            addOnContextLostListener(listener);
                            break;
                        case 'webglcontextrestored':
                            addOnContextRestoredListener(listener);
                            break;
                        default:
                            f.apply(canvas, arguments);
                    }
                };
            }
            wrapAddEventListener(canvas);
            canvas.loseContext = function () {
                if (!contextLost_) {
                    contextLost_ = true;
                    numCallsToLoseContext_ = 0;
                    ++contextId_;
                    while (unwrappedContext_.getError())
                        ;
                    clearErrors();
                    glErrorShadow_[unwrappedContext_.CONTEXT_LOST_WEBGL] = true;
                    var event = makeWebGLContextEvent("context lost");
                    var callbacks = onLost_.slice();
                    setTimeout(function () {
                        for (var ii = 0; ii < callbacks.length; ++ii) {
                            //log("calling callback:" + ii);
                            callbacks[ii](event);
                        }
                        if (restoreTimeout_ >= 0) {
                            setTimeout(function () {
                                canvas.restoreContext();
                            }, restoreTimeout_);
                        }
                    }, 0);
                }
            };
            canvas.restoreContext = function () {
                if (contextLost_) {
                    if (onRestored_.length) {
                        setTimeout(function () {
                            if (!canRestore_) {
                                throw "can not restore. webglcontestlost listener did not call event.preventDefault";
                            }
                            freeResources();
                            resetToInitialState(unwrappedContext_);
                            contextLost_ = false;
                            numCalls_ = 0;
                            canRestore_ = false;
                            var callbacks = onRestored_.slice();
                            var event = makeWebGLContextEvent("context restored");
                            for (var ii = 0; ii < callbacks.length; ++ii) {
                                callbacks[ii](event);
                            }
                        }, 0);
                    }
                }
            };
            canvas.loseContextInNCalls = function (numCalls) {
                if (contextLost_) {
                    throw "You can not ask a lost contet to be lost";
                }
                numCallsToLoseContext_ = numCalls_ + numCalls;
            };
            canvas.getNumCalls = function () {
                return numCalls_;
            };
            canvas.setRestoreTimeout = function (timeout) {
                restoreTimeout_ = timeout;
            };
            function isWebGLObject(obj) {
                //return false;
                return (obj instanceof WebGLBuffer || obj instanceof WebGLFramebuffer || obj instanceof WebGLProgram || obj instanceof WebGLRenderbuffer || obj instanceof WebGLShader || obj instanceof WebGLTexture);
            }
            function checkResources(args) {
                for (var ii = 0; ii < args.length; ++ii) {
                    var arg = args[ii];
                    if (isWebGLObject(arg)) {
                        return arg.__webglDebugContextLostId__ == contextId_;
                    }
                }
                return true;
            }
            function clearErrors() {
                var k = Object.keys(glErrorShadow_);
                for (var ii = 0; ii < k.length; ++ii) {
                    delete glErrorShadow_[k];
                }
            }
            function loseContextIfTime() {
                ++numCalls_;
                if (!contextLost_) {
                    if (numCallsToLoseContext_ == numCalls_) {
                        canvas.loseContext();
                    }
                }
            }
            // Makes a function that simulates WebGL when out of context.
            function makeLostContextFunctionWrapper(ctx, functionName) {
                var f = ctx[functionName];
                return function () {
                    // log("calling:" + functionName);
                    // Only call the functions if the context is not lost.
                    loseContextIfTime();
                    if (!contextLost_) {
                        //if (!checkResources(arguments)) {
                        //  glErrorShadow_[wrappedContext_.INVALID_OPERATION] = true;
                        //  return;
                        //}
                        var result = f.apply(ctx, arguments);
                        return result;
                    }
                };
            }
            function freeResources() {
                for (var ii = 0; ii < resourceDb_.length; ++ii) {
                    var resource = resourceDb_[ii];
                    if (resource instanceof WebGLBuffer) {
                        unwrappedContext_.deleteBuffer(resource);
                    }
                    else if (resource instanceof WebGLFramebuffer) {
                        unwrappedContext_.deleteFramebuffer(resource);
                    }
                    else if (resource instanceof WebGLProgram) {
                        unwrappedContext_.deleteProgram(resource);
                    }
                    else if (resource instanceof WebGLRenderbuffer) {
                        unwrappedContext_.deleteRenderbuffer(resource);
                    }
                    else if (resource instanceof WebGLShader) {
                        unwrappedContext_.deleteShader(resource);
                    }
                    else if (resource instanceof WebGLTexture) {
                        unwrappedContext_.deleteTexture(resource);
                    }
                }
            }
            function makeWebGLContextEvent(statusMessage) {
                return {
                    statusMessage: statusMessage,
                    preventDefault: function () {
                        canRestore_ = true;
                    }
                };
            }
            return canvas;
            function makeLostContextSimulatingContext(ctx) {
                for (var propertyName in ctx) {
                    if (typeof ctx[propertyName] == 'function') {
                        wrappedContext_[propertyName] = makeLostContextFunctionWrapper(ctx, propertyName);
                    }
                    else {
                        makePropertyWrapper(wrappedContext_, ctx, propertyName);
                    }
                }
                // Wrap a few functions specially.
                wrappedContext_.getError = function () {
                    loseContextIfTime();
                    if (!contextLost_) {
                        var err;
                        while (err = unwrappedContext_.getError()) {
                            glErrorShadow_[err] = true;
                        }
                    }
                    for (var err in glErrorShadow_) {
                        if (glErrorShadow_[err]) {
                            delete glErrorShadow_[err];
                            return err;
                        }
                    }
                    return wrappedContext_.NO_ERROR;
                };
                var creationFunctions = [
                    "createBuffer",
                    "createFramebuffer",
                    "createProgram",
                    "createRenderbuffer",
                    "createShader",
                    "createTexture"
                ];
                for (var ii = 0; ii < creationFunctions.length; ++ii) {
                    var functionName = creationFunctions[ii];
                    wrappedContext_[functionName] = function (f) {
                        return function () {
                            loseContextIfTime();
                            if (contextLost_) {
                                return null;
                            }
                            var obj = f.apply(ctx, arguments);
                            obj.__webglDebugContextLostId__ = contextId_;
                            resourceDb_.push(obj);
                            return obj;
                        };
                    }(ctx[functionName]);
                }
                var functionsThatShouldReturnNull = [
                    "getActiveAttrib",
                    "getActiveUniform",
                    "getBufferParameter",
                    "getContextAttributes",
                    "getAttachedShaders",
                    "getFramebufferAttachmentParameter",
                    "getParameter",
                    "getProgramParameter",
                    "getProgramInfoLog",
                    "getRenderbufferParameter",
                    "getShaderParameter",
                    "getShaderInfoLog",
                    "getShaderSource",
                    "getTexParameter",
                    "getUniform",
                    "getUniformLocation",
                    "getVertexAttrib"
                ];
                for (var ii = 0; ii < functionsThatShouldReturnNull.length; ++ii) {
                    var functionName = functionsThatShouldReturnNull[ii];
                    wrappedContext_[functionName] = function (f) {
                        return function () {
                            loseContextIfTime();
                            if (contextLost_) {
                                return null;
                            }
                            return f.apply(ctx, arguments);
                        };
                    }(wrappedContext_[functionName]);
                }
                var isFunctions = [
                    "isBuffer",
                    "isEnabled",
                    "isFramebuffer",
                    "isProgram",
                    "isRenderbuffer",
                    "isShader",
                    "isTexture"
                ];
                for (var ii = 0; ii < isFunctions.length; ++ii) {
                    var functionName = isFunctions[ii];
                    wrappedContext_[functionName] = function (f) {
                        return function () {
                            loseContextIfTime();
                            if (contextLost_) {
                                return false;
                            }
                            return f.apply(ctx, arguments);
                        };
                    }(wrappedContext_[functionName]);
                }
                wrappedContext_.checkFramebufferStatus = function (f) {
                    return function () {
                        loseContextIfTime();
                        if (contextLost_) {
                            return wrappedContext_.FRAMEBUFFER_UNSUPPORTED;
                        }
                        return f.apply(ctx, arguments);
                    };
                }(wrappedContext_.checkFramebufferStatus);
                wrappedContext_.getAttribLocation = function (f) {
                    return function () {
                        loseContextIfTime();
                        if (contextLost_) {
                            return -1;
                        }
                        return f.apply(ctx, arguments);
                    };
                }(wrappedContext_.getAttribLocation);
                wrappedContext_.getVertexAttribOffset = function (f) {
                    return function () {
                        loseContextIfTime();
                        if (contextLost_) {
                            return 0;
                        }
                        return f.apply(ctx, arguments);
                    };
                }(wrappedContext_.getVertexAttribOffset);
                wrappedContext_.isContextLost = function () {
                    return contextLost_;
                };
                return wrappedContext_;
            }
        }
        WebGLDebugUtils.makeLostContextSimulatingCanvas = makeLostContextSimulatingCanvas;
    })(WebGLDebugUtils || (WebGLDebugUtils = {}));
    return WebGLDebugUtils;
});

define('rendering/glContext',["require", "exports", "../canvas", "../config", "../util/logger/consoleLogger", "../util/debug/webgl"], function (require, exports, canvas, config, logger, debug) {
    /**
     * Gets the gl context object from the canvas element.
     */
    function throwOnGLError(err, funcName, args) {
        if (config.throwOnGLError) {
            throw debug.glEnumToString(err) + " was caused by call to: " + funcName;
        }
    }
    function logGLCall(functionName, args) {
        logger.log("gl." + functionName + "(" + debug.glFunctionArgsToString(functionName, args) + ")");
    }
    function validateNoneOfTheArgsAreUndefined(functionName, args) {
        for (var ii = 0; ii < args.length; ++ii) {
            if (args[ii] === undefined) {
                logger.logError("undefined passed to gl." + functionName + "(" + debug.glFunctionArgsToString(functionName, args) + ")");
            }
        }
    }
    function logAndValidate(functionName, args) {
        if (config.logGLCalls) {
            logGLCall(functionName, args);
        }
        if (config.validateGLArgs) {
            validateNoneOfTheArgsAreUndefined(functionName, args);
        }
    }
    var GL;
    try {
        GL = canvas.getContext('experimental-webgl', { antialias: true });
        GL = debug.makeDebugContext(GL, throwOnGLError, logAndValidate);
    }
    catch (e) {
        logger.logError('Error getting webgl context.', e);
    }
    return GL;
});

/**
 * @license RequireJS text 2.0.12 Copyright (c) 2010-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/text for details
 */
/*jslint regexp: true */
/*global require, XMLHttpRequest, ActiveXObject,
  define, window, process, Packages,
  java, location, Components, FileUtils */

define('text',['module'], function (module) {
    

    var text, fs, Cc, Ci, xpcIsWindows,
        progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],
        xmlRegExp = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
        bodyRegExp = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,
        hasLocation = typeof location !== 'undefined' && location.href,
        defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, ''),
        defaultHostName = hasLocation && location.hostname,
        defaultPort = hasLocation && (location.port || undefined),
        buildMap = {},
        masterConfig = (module.config && module.config()) || {};

    text = {
        version: '2.0.12',

        strip: function (content) {
            //Strips <?xml ...?> declarations so that external SVG and XML
            //documents can be added to a document without worry. Also, if the string
            //is an HTML document, only the part inside the body tag is returned.
            if (content) {
                content = content.replace(xmlRegExp, "");
                var matches = content.match(bodyRegExp);
                if (matches) {
                    content = matches[1];
                }
            } else {
                content = "";
            }
            return content;
        },

        jsEscape: function (content) {
            return content.replace(/(['\\])/g, '\\$1')
                .replace(/[\f]/g, "\\f")
                .replace(/[\b]/g, "\\b")
                .replace(/[\n]/g, "\\n")
                .replace(/[\t]/g, "\\t")
                .replace(/[\r]/g, "\\r")
                .replace(/[\u2028]/g, "\\u2028")
                .replace(/[\u2029]/g, "\\u2029");
        },

        createXhr: masterConfig.createXhr || function () {
            //Would love to dump the ActiveX crap in here. Need IE 6 to die first.
            var xhr, i, progId;
            if (typeof XMLHttpRequest !== "undefined") {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject !== "undefined") {
                for (i = 0; i < 3; i += 1) {
                    progId = progIds[i];
                    try {
                        xhr = new ActiveXObject(progId);
                    } catch (e) {}

                    if (xhr) {
                        progIds = [progId];  // so faster next time
                        break;
                    }
                }
            }

            return xhr;
        },

        /**
         * Parses a resource name into its component parts. Resource names
         * look like: module/name.ext!strip, where the !strip part is
         * optional.
         * @param {String} name the resource name
         * @returns {Object} with properties "moduleName", "ext" and "strip"
         * where strip is a boolean.
         */
        parseName: function (name) {
            var modName, ext, temp,
                strip = false,
                index = name.indexOf("."),
                isRelative = name.indexOf('./') === 0 ||
                             name.indexOf('../') === 0;

            if (index !== -1 && (!isRelative || index > 1)) {
                modName = name.substring(0, index);
                ext = name.substring(index + 1, name.length);
            } else {
                modName = name;
            }

            temp = ext || modName;
            index = temp.indexOf("!");
            if (index !== -1) {
                //Pull off the strip arg.
                strip = temp.substring(index + 1) === "strip";
                temp = temp.substring(0, index);
                if (ext) {
                    ext = temp;
                } else {
                    modName = temp;
                }
            }

            return {
                moduleName: modName,
                ext: ext,
                strip: strip
            };
        },

        xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,

        /**
         * Is an URL on another domain. Only works for browser use, returns
         * false in non-browser environments. Only used to know if an
         * optimized .js version of a text resource should be loaded
         * instead.
         * @param {String} url
         * @returns Boolean
         */
        useXhr: function (url, protocol, hostname, port) {
            var uProtocol, uHostName, uPort,
                match = text.xdRegExp.exec(url);
            if (!match) {
                return true;
            }
            uProtocol = match[2];
            uHostName = match[3];

            uHostName = uHostName.split(':');
            uPort = uHostName[1];
            uHostName = uHostName[0];

            return (!uProtocol || uProtocol === protocol) &&
                   (!uHostName || uHostName.toLowerCase() === hostname.toLowerCase()) &&
                   ((!uPort && !uHostName) || uPort === port);
        },

        finishLoad: function (name, strip, content, onLoad) {
            content = strip ? text.strip(content) : content;
            if (masterConfig.isBuild) {
                buildMap[name] = content;
            }
            onLoad(content);
        },

        load: function (name, req, onLoad, config) {
            //Name has format: some.module.filext!strip
            //The strip part is optional.
            //if strip is present, then that means only get the string contents
            //inside a body tag in an HTML string. For XML/SVG content it means
            //removing the <?xml ...?> declarations so the content can be inserted
            //into the current doc without problems.

            // Do not bother with the work if a build and text will
            // not be inlined.
            if (config && config.isBuild && !config.inlineText) {
                onLoad();
                return;
            }

            masterConfig.isBuild = config && config.isBuild;

            var parsed = text.parseName(name),
                nonStripName = parsed.moduleName +
                    (parsed.ext ? '.' + parsed.ext : ''),
                url = req.toUrl(nonStripName),
                useXhr = (masterConfig.useXhr) ||
                         text.useXhr;

            // Do not load if it is an empty: url
            if (url.indexOf('empty:') === 0) {
                onLoad();
                return;
            }

            //Load the text. Use XHR if possible and in a browser.
            if (!hasLocation || useXhr(url, defaultProtocol, defaultHostName, defaultPort)) {
                text.get(url, function (content) {
                    text.finishLoad(name, parsed.strip, content, onLoad);
                }, function (err) {
                    if (onLoad.error) {
                        onLoad.error(err);
                    }
                });
            } else {
                //Need to fetch the resource across domains. Assume
                //the resource has been optimized into a JS module. Fetch
                //by the module name + extension, but do not include the
                //!strip part to avoid file system issues.
                req([nonStripName], function (content) {
                    text.finishLoad(parsed.moduleName + '.' + parsed.ext,
                                    parsed.strip, content, onLoad);
                });
            }
        },

        write: function (pluginName, moduleName, write, config) {
            if (buildMap.hasOwnProperty(moduleName)) {
                var content = text.jsEscape(buildMap[moduleName]);
                write.asModule(pluginName + "!" + moduleName,
                               "define(function () { return '" +
                                   content +
                               "';});\n");
            }
        },

        writeFile: function (pluginName, moduleName, req, write, config) {
            var parsed = text.parseName(moduleName),
                extPart = parsed.ext ? '.' + parsed.ext : '',
                nonStripName = parsed.moduleName + extPart,
                //Use a '.js' file name so that it indicates it is a
                //script that can be loaded across domains.
                fileName = req.toUrl(parsed.moduleName + extPart) + '.js';

            //Leverage own load() method to load plugin value, but only
            //write out values that do not have the strip argument,
            //to avoid any potential issues with ! in file names.
            text.load(nonStripName, req, function (value) {
                //Use own write() method to construct full module value.
                //But need to create shell that translates writeFile's
                //write() to the right interface.
                var textWrite = function (contents) {
                    return write(fileName, contents);
                };
                textWrite.asModule = function (moduleName, contents) {
                    return write.asModule(moduleName, fileName, contents);
                };

                text.write(pluginName, nonStripName, textWrite, config);
            }, config);
        }
    };

    if (masterConfig.env === 'node' || (!masterConfig.env &&
            typeof process !== "undefined" &&
            process.versions &&
            !!process.versions.node &&
            !process.versions['node-webkit'])) {
        //Using special require.nodeRequire, something added by r.js.
        fs = require.nodeRequire('fs');

        text.get = function (url, callback, errback) {
            try {
                var file = fs.readFileSync(url, 'utf8');
                //Remove BOM (Byte Mark Order) from utf8 files if it is there.
                if (file.indexOf('\uFEFF') === 0) {
                    file = file.substring(1);
                }
                callback(file);
            } catch (e) {
                if (errback) {
                    errback(e);
                }
            }
        };
    } else if (masterConfig.env === 'xhr' || (!masterConfig.env &&
            text.createXhr())) {
        text.get = function (url, callback, errback, headers) {
            var xhr = text.createXhr(), header;
            xhr.open('GET', url, true);

            //Allow plugins direct access to xhr headers
            if (headers) {
                for (header in headers) {
                    if (headers.hasOwnProperty(header)) {
                        xhr.setRequestHeader(header.toLowerCase(), headers[header]);
                    }
                }
            }

            //Allow overrides specified in config
            if (masterConfig.onXhr) {
                masterConfig.onXhr(xhr, url);
            }

            xhr.onreadystatechange = function (evt) {
                var status, err;
                //Do not explicitly handle errors, those should be
                //visible via console output in the browser.
                if (xhr.readyState === 4) {
                    status = xhr.status || 0;
                    if (status > 399 && status < 600) {
                        //An http 4xx or 5xx error. Signal an error.
                        err = new Error(url + ' HTTP status: ' + status);
                        err.xhr = xhr;
                        if (errback) {
                            errback(err);
                        }
                    } else {
                        callback(xhr.responseText);
                    }

                    if (masterConfig.onXhrComplete) {
                        masterConfig.onXhrComplete(xhr, url);
                    }
                }
            };
            xhr.send(null);
        };
    } else if (masterConfig.env === 'rhino' || (!masterConfig.env &&
            typeof Packages !== 'undefined' && typeof java !== 'undefined')) {
        //Why Java, why is this so awkward?
        text.get = function (url, callback) {
            var stringBuffer, line,
                encoding = "utf-8",
                file = new java.io.File(url),
                lineSeparator = java.lang.System.getProperty("line.separator"),
                input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), encoding)),
                content = '';
            try {
                stringBuffer = new java.lang.StringBuffer();
                line = input.readLine();

                // Byte Order Mark (BOM) - The Unicode Standard, version 3.0, page 324
                // http://www.unicode.org/faq/utf_bom.html

                // Note that when we use utf-8, the BOM should appear as "EF BB BF", but it doesn't due to this bug in the JDK:
                // http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=4508058
                if (line && line.length() && line.charAt(0) === 0xfeff) {
                    // Eat the BOM, since we've already found the encoding on this file,
                    // and we plan to concatenating this buffer with others; the BOM should
                    // only appear at the top of a file.
                    line = line.substring(1);
                }

                if (line !== null) {
                    stringBuffer.append(line);
                }

                while ((line = input.readLine()) !== null) {
                    stringBuffer.append(lineSeparator);
                    stringBuffer.append(line);
                }
                //Make sure we return a JavaScript string and not a Java string.
                content = String(stringBuffer.toString()); //String
            } finally {
                input.close();
            }
            callback(content);
        };
    } else if (masterConfig.env === 'xpconnect' || (!masterConfig.env &&
            typeof Components !== 'undefined' && Components.classes &&
            Components.interfaces)) {
        //Avert your gaze!
        Cc = Components.classes;
        Ci = Components.interfaces;
        Components.utils['import']('resource://gre/modules/FileUtils.jsm');
        xpcIsWindows = ('@mozilla.org/windows-registry-key;1' in Cc);

        text.get = function (url, callback) {
            var inStream, convertStream, fileObj,
                readData = {};

            if (xpcIsWindows) {
                url = url.replace(/\//g, '\\');
            }

            fileObj = new FileUtils.File(url);

            //XPCOM, you so crazy
            try {
                inStream = Cc['@mozilla.org/network/file-input-stream;1']
                           .createInstance(Ci.nsIFileInputStream);
                inStream.init(fileObj, 1, 0, false);

                convertStream = Cc['@mozilla.org/intl/converter-input-stream;1']
                                .createInstance(Ci.nsIConverterInputStream);
                convertStream.init(inStream, "utf-8", inStream.available(),
                Ci.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);

                convertStream.readString(inStream.available(), readData);
                convertStream.close();
                inStream.close();
                callback(readData.value);
            } catch (e) {
                throw new Error((fileObj && fileObj.path || '') + ': ' + e);
            }
        };
    }
    return text;
});


define('text!shaders/common.glsl',[],function () { return 'vec4 getPosition(mat4 mvp, vec3 pos) {\r\n    return mvp * vec4(pos, 1);\r\n}';});


define('text!shaders/base_vertex.glsl',[],function () { return '#include common.glsl\r\n\r\nattribute vec3 aVertex;\r\nuniform mat4 mvp;\r\n\r\nvoid main(void) {\r\n    gl_Position = mvp * vec4(aVertex, 1.);\r\n}';});


define('text!shaders/color_frag.glsl',[],function () { return 'precision mediump float;\r\nuniform vec3 vColor;\r\nvoid main(void) {\r\n    gl_FragColor = vec4(vColor, 1.);\r\n}';});


define('text!shaders/tex_frag.glsl',[],function () { return 'precision mediump float;\r\n\r\nuniform sampler2D sampler;\r\nvarying vec2 vUV;\r\n\r\nvoid main(void) {\r\n    gl_FragColor = texture2D(sampler, vUV);\r\n}';});


define('text!shaders/tex_vertex.glsl',[],function () { return 'attribute vec3 aVertex;\r\nuniform mat4 mvp;\r\n\r\nattribute vec2 aUV;\r\nvarying vec2 vUV;\r\n\r\nvoid main(void) {\r\n    gl_Position = mvp * vec4(aVertex, 1.);\r\n    vUV = aUV;\r\n}';});

///<reference path="./shaders.d.ts" />
define('rendering/shaders',["require", "exports", "./glContext", "../util/logger/consoleLogger", "text!../shaders/common.glsl", "text!../shaders/base_vertex.glsl", "text!../shaders/color_frag.glsl", "text!../shaders/tex_frag.glsl", "text!../shaders/tex_vertex.glsl"], function (require, exports, gl, logger, common, base_vertex, color_frag, tex_frag, tex_vertex) {
    /**
     * Handles compiling shaders and creating shader programs.
     */
    var shaders;
    (function (shaders) {
        /**
         * RegExp for fining include statements in shaders.
         * @type {RegExp}
         */
        var includeReg = /#include \S+/;
        /**
         * Stores lib shaders compiled by compileLib
         * @type {{}}
         */
        var lib = {};
        /**
         * Parses the source of a shader.
         * @param source the source for a shader.
         * @returns {string} the parsed source.
         */
        function parseSource(source) {
            source = source.replace(includeReg, function (match) {
                var name = match.replace("#include", "").trim();
                if (!lib[name]) {
                    logger.logError("Shader lib [" + name + "] not found.");
                    return "";
                }
                return lib[name];
            });
            return source;
        }
        /**
         * Compiles the given source a library to be included in other shaders.
         * @param name The name of the library. Generally this should be the file name of the library.
         * @param source The source.
         */
        function compileLib(name, source) {
            source = parseSource(source);
            lib[name] = source;
        }
        shaders.compileLib = compileLib;
        /**
         * Compiles a shader for use on the gpu.
         * @param source The source of the shader.
         * @param type The type of the shader to compile.
         * @returns {WebGLShader} The handle to the compiled shader.
         */
        function compile(source, type) {
            source = parseSource(source);
            var shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                logger.logError("Error compiling shader:" + gl.getShaderInfoLog(shader));
                return null;
            }
            return shader;
        }
        shaders.compile = compile;
        /**
         * Creates a new program with the given vertex and fragment shaders.
         * @param vertexShader The handle to the compiled vertex shader.
         * @param fragmentShader The handle to the compiled fragment shader.
         * @returns {WebGLProgram} The handle to the shader program.
         */
        function createProgram(vertexShader, fragmentShader) {
            var prog = gl.createProgram();
            gl.attachShader(prog, vertexShader);
            gl.attachShader(prog, fragmentShader);
            gl.linkProgram(prog);
            return prog;
        }
        shaders.createProgram = createProgram;
        /* Libraries */
        compileLib("common.glsl", common);
        /* Shaders */
        shaders.baseVertexShader = compile(base_vertex, gl.VERTEX_SHADER);
        shaders.colorFragmentShader = compile(color_frag, gl.FRAGMENT_SHADER);
        shaders.textureVertexShader = compile(tex_vertex, gl.VERTEX_SHADER);
        shaders.textureFragmentShader = compile(tex_frag, gl.FRAGMENT_SHADER);
    })(shaders || (shaders = {}));
    return shaders;
});

define('rendering/render',["require", "exports", "./glContext"], function (require, exports, gl) {
    /**
     * Functions to setup and complete each frame.
     */
    var render;
    (function (render) {
        /**
         * Performs initialization for rendering
         */
        function init() {
            gl.clearColor(0.0, 0.0, 0.0, 0.0);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            gl.clearDepth(1.0);
        }
        render.init = init;
        /**
         * Begins a new frame
         */
        function begin() {
            gl.viewport(0.0, 0.0, gl.canvas.width, gl.canvas.height);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        }
        render.begin = begin;
        /**
         * Completes a frame
         */
        function end() {
            gl.flush();
        }
        render.end = end;
    })(render || (render = {}));
    return render;
});

define('rendering/camera',["require", "exports", "../canvas", "../math/vec3", "../math/mat4"], function (require, exports, canvas, vec3, mat4) {
    /**
     *
     */
    var camera = (function () {
        /**
         * Creates a new camera at the given position, looking at the given target.
         * @param pos {vec3} The position to create the camera at
         * @param target {vec3} The position for the camera to look at
         */
        function camera(pos, target) {
            this._pos = pos || vec3.create();
            this._target = target || vec3.create();
            this._fov = 45;
            this._aspect = canvas.width / canvas.height;
            this._nearClip = 1;
            this._farClip = 100;
            this._proj = mat4.perspective(mat4.create(), this._fov, this._aspect, this._nearClip, this._farClip);
        }
        /**
         * Gets or sets the field of view
         * @param fov The new field of view
         * @returns {number} The current field of view
         */
        camera.prototype.fov = function (fov) {
            if (!!fov) {
                this._fov = fov;
                mat4.perspective(this._proj, this._fov, this._aspect, this._nearClip, this._farClip);
            }
            return this._fov;
        };
        /**
         * Gets or sets the near clip plane
         * @param nearClip The new near clip plane
         * @returns {number} The current near clip plane
         */
        camera.prototype.nearClip = function (nearClip) {
            if (!!nearClip) {
                this._nearClip = nearClip;
                mat4.perspective(this._proj, this._fov, this._aspect, this._nearClip, this._farClip);
            }
            return this._nearClip;
        };
        /**
         * Gets or sets the far clip plane
         * @param farClip The new far clip plane
         * @returns {number} The current far clip plane
         */
        camera.prototype.farClip = function (farClip) {
            if (!!farClip) {
                this._farClip = farClip;
                mat4.perspective(this._proj, this._fov, this._aspect, this._nearClip, this._farClip);
            }
            return this._farClip;
        };
        /**
         * Gets or sets the aspect ratio
         * @param aspectRatio The new aspect ratio
         * @returns {number} The current aspect ratio
         */
        camera.prototype.aspectRatio = function (aspectRatio) {
            if (!!aspectRatio) {
                this._aspect = aspectRatio;
                mat4.perspective(this._proj, this._fov, this._aspect, this._nearClip, this._farClip);
            }
            return this._aspect;
        };
        /**
         * Gets the current projection view matrix. This is a slight optimiation of getView() * getProjection()
         * @returns {mat4}
         */
        camera.prototype.projectionView = function () {
            var ret = mat4.create();
            mat4.lookAt(ret, this._pos, this._target, vec3.UNIT_Y);
            return mat4.mul(ret, this._proj, ret);
        };
        /**
         * Gets the current projection matrix
         * @returns {mat4}
         */
        camera.prototype.getProjection = function () {
            return mat4.copy(mat4.create(), this._proj);
        };
        /**
         * Gets the current view matrix
         * @returns {mat4}
         */
        camera.prototype.getView = function () {
            return mat4.lookAt(mat4.create(), this._pos, this._target, vec3.UNIT_Y);
        };
        return camera;
    })();
    return camera;
});

///<refernece path="./logger.d.ts" />
define('util/logger/index',["require", "exports", "./consoleLogger"], function (require, exports, consoleLogger) {
    /**
     * Logs to the currently active loggers.
     */
    var logger = (function () {
        /**
         * Default constructor
         */
        function logger() {
            /**
             * The actve loggers
             * @type {Array}
             * @private
             */
            this._loggers = [];
            this._loggers.push(consoleLogger);
        }
        /**
         * Logs a standard message
         * @param msg The message to log
         */
        logger.prototype.log = function (msg) {
            _.forEach(this._loggers, function (logger) {
                logger.log(msg);
            });
        };
        /**
         * Logs an error message
         * @param msg The error message
         * @param e Error
         */
        logger.prototype.logError = function (msg, e) {
            _.forEach(this._loggers, function (logger) {
                logger.logError(msg, e);
            });
        };
        return logger;
    })();
    var _logger = new logger();
    return _logger;
});

///<reference path="../../../../lib/lodash/lodash.d.ts" />
define('util/debug/verifier',["require", "exports", "../logger/index"], function (require, exports, logger) {
    /**
     * Provides methods to verify the given parameter.
     */
    var verifier = (function () {
        /**
         * Create a new verifier.
         * @param value The value to verify
         * @param name The parameter name of the value
         */
        function verifier(value, name) {
            this._value = value;
            this._name = name;
        }
        /**
         * Logs an error if the value is not defined
         * @returns {verifier} This
         */
        verifier.prototype.isDefined = function () {
            if (typeof (this._value) == 'undefined') {
                logger.logError(this._getMsg("Parameter [{name}, {value}] is undefined"));
            }
            return this;
        };
        /**
         * Logs an error if the value is empty
         * @returns {verifier} This
         */
        verifier.prototype.isNotEmpty = function () {
            if (typeof (this._value.length) != 'undefined' && this._value.length == 0) {
                logger.logError(this._getMsg("Parameter [{name}, {value}] is empty."));
            }
            return this;
        };
        /**
         * Logs an error if the value is greater then the given value.
         * @param x The value to compare against
         * @returns {verifier} This
         */
        verifier.prototype.isGreaterThan = function (x) {
            if (this._value <= x) {
                logger.logError(this._getMsg("Parameter [{name}, {value}] is greater than [" + x + "]"));
            }
            return this;
        };
        /**
         * Logs an error if the value is less then the given value.
         * @param x The value to compare against
         * @returns {verifier} This
         */
        verifier.prototype.isLessThan = function (x) {
            if (this._value >= x) {
                logger.logError(this._getMsg("Parameter [{name}, {value}] is less than [" + x + "]"));
            }
            return this;
        };
        /**
         * Retrusn the given message with {name} and {value} replaced with _name and _value.
         * @param msg
         * @returns {any}
         * @private
         */
        verifier.prototype._getMsg = function (msg) {
            return msg.replace("{name}", this._name).replace("{value}", this._value);
        };
        return verifier;
    })();
    /**
     * Exposes the function to create the verifier.
     */
    var verify;
    (function (verify) {
        /**
         * Creates a new verifier with the given value and name
         * @param value THe value of the parameter
         * @param name The name of the parameter
         * @returns {verifier} The new verifier
         */
        function that(value, name) {
            return new verifier(value, name);
        }
        verify.that = that;
    })(verify || (verify = {}));
    return verify;
});

define('rendering/texture',["require", "exports", './glContext', '../util/debug/verifier'], function (require, exports, gl, verify) {
    /**
     * Manages a texture on the graphics card.
     */
    var texture = (function () {
        /**
         * Creates a new texture with the given image.
         * @param img The image to send to the graphics card
         */
        function texture(img) {
            this._img = img;
            this._tex = gl.createTexture();
            if (this.loaded()) {
                this._handleLoadedImage();
            }
            else {
                this._img.onload = this._handleLoadedImage();
            }
        }
        /**
         * Gets if the texture has been loaded on the graphics card
         * @returns {boolean} True if the texture has been sent to the graphics card. False, otherwise.
         */
        texture.prototype.loaded = function () {
            if (this._img.complete) {
                return true;
            }
            return !!(typeof (this._img.naturalWidth) == 'undefined' || this._img.naturalWidth > 0);
        };
        /**
         * Sets this texture as active on graphics card.
         * @param texNumber The texture number on the graphics card
         */
        texture.prototype.activate = function (texNumber) {
            texNumber = typeof (texNumber) == 'undefined' ? gl.TEXTURE0 : texNumber;
            verify.that(texNumber, "texNumber").isGreaterThan(-1).isLessThan(32);
            gl.activeTexture(texNumber);
            gl.bindTexture(gl.TEXTURE_2D, this._tex);
        };
        /**
         * Sends the image
         * @private
         */
        texture.prototype._handleLoadedImage = function () {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
            gl.bindTexture(gl.TEXTURE_2D, this._tex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._img);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
        };
        return texture;
    })();
    return texture;
});

///<reference path="../../../lib/lodash/lodash.d.ts" />
define('rendering/renderObject',["require", "exports", "./glContext", "../math/index", "../util/debug/verifier"], function (require, exports, gl, math, verify) {
    /**
     * A private class that contains shader attribute data.
     */
    var attribData = (function () {
        function attribData(attrib, size, buf) {
            this.attrib = attrib;
            this.size = size;
            this.buf = buf;
        }
        return attribData;
    })();
    /**
     * Represents an object that can be drawn.
     */
    var renderObject = (function () {
        /**
         * Creates a new renderObject with the given shaderProgram
         * @param shaderProgram The shader program to render this object with.
         */
        function renderObject(shaderProgram) {
            /**
             * Contians data on each attribute intialized.
             * @type {Array}
             * @private
             */
            this._attribs = [];
            this._shaderProgram = shaderProgram;
            this._modelMat = math.mat4.create();
            this._mvp = math.mat4.create();
        }
        /**
         * Gets or sets the model matrix for this object. Model matricies contain position, rotation, and scale.
         * @param m {mat4} The new model matrix
         * @returns {mat4} The current model matrix
         */
        renderObject.prototype.modelMatrix = function (m) {
            if (!!m) {
                math.mat4.copy(this._modelMat, m);
            }
            return math.mat4.clone(this._modelMat);
        };
        /**
         * Gets or sets the camera that "sees" this object.
         * @param c {camera} The new camera.
         * @returns {camera} The current camera
         */
        renderObject.prototype.camera = function (c) {
            if (!!c) {
                this._camera = c;
            }
            return this._camera;
        };
        /**
         * Gets or sets the texture to apply to this object.
         * @param t {texture} The new texture
         * @returns {texture} The current texture
         */
        renderObject.prototype.texture = function (t) {
            if (!!t) {
                this._texture = t;
            }
            return this._texture;
        };
        /**
         * Renders this object to the canvas
         */
        renderObject.prototype.render = function () {
            gl.useProgram(this._shaderProgram);
            //Set mvp matrix.
            this.setMatrix4("mvp", math.mat4.mul(this._mvp, this._camera.projectionView(), this._modelMat));
            //If we have a texture activate it
            if (!!this._texture && this._texture.loaded()) {
                this._texture.activate();
            }
            //Reactivate the shader attributes.
            this._attribs.forEach(function (attrib) {
                gl.bindBuffer(gl.ARRAY_BUFFER, attrib.buf);
                gl.vertexAttribPointer(attrib.attrib, attrib.size, gl.FLOAT, false, 0, 0);
            });
            //Draw!
            gl.drawElements(gl.TRIANGLES, this._vertexes, gl.UNSIGNED_SHORT, 0);
        };
        /**
         * Deletes any used resources on the graphics card.
         */
        renderObject.prototype.dispose = function () {
            this._attribs.forEach(function (attrib) {
                gl.deleteBuffer(attrib.buf);
            });
        };
        /**
         * Sets the vertexes for this object. Vertexes tell the graphics card in what order to draw the vertexes.
         * @param vertexes The vertexes to set
         */
        renderObject.prototype.setVertexes = function (vertexes) {
            verify.that(vertexes, "vertexes").isDefined().isNotEmpty();
            var buf = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buf);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexes), gl.STATIC_DRAW);
            this._vertexes = vertexes.length;
        };
        /**
         * Enable an attribute in the shader with the given data.
         * @param attribName The name of the attribute
         * @param size The number of items in data that make up a single attribute
         * @param data Data for each vertex
         */
        renderObject.prototype.enableAttrib = function (attribName, size, data) {
            verify.that(attribName, "atttibName").isDefined();
            verify.that(size, "size").isDefined().isGreaterThan(0);
            verify.that(data, "data").isDefined().isNotEmpty();
            var attrib = gl.getAttribLocation(this._shaderProgram, attribName);
            gl.enableVertexAttribArray(attrib);
            var buf = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buf);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
            this._attribs.push(new attribData(attrib, size, buf));
        };
        /**
         * Sets a mat4 in the shader program.
         * @param uniName The name of the uniform
         * @param value The value to set
         */
        renderObject.prototype.setMatrix4 = function (uniName, value) {
            verify.that(uniName, "uniName").isDefined();
            verify.that(value, "value").isDefined().isNotEmpty();
            gl.useProgram(this._shaderProgram);
            var uniform = gl.getUniformLocation(this._shaderProgram, uniName);
            gl.uniformMatrix4fv(uniform, false, value);
        };
        /**
         * Sets a vec3 in the shader program.
         * @param uniName The name of the uniform
         * @param value The value to set
         */
        renderObject.prototype.setVector3 = function (uniName, value) {
            verify.that(uniName, "uniName").isDefined();
            verify.that(value, "value").isDefined().isNotEmpty();
            gl.useProgram(this._shaderProgram);
            var uniform = gl.getUniformLocation(this._shaderProgram, uniName);
            gl.uniform3f(uniform, value[0], value[1], value[2]);
        };
        return renderObject;
    })();
    return renderObject;
});

define('rendering/index',["require", "exports", './glContext', './shaders', './render', './camera', './texture', './renderObject'], function (require, exports, GL_file, shaders_file, render_file, camera_file, texture_file, renderObject_file) {
    exports.GL = GL_file; ///ts:export:generated
    exports.shaders = shaders_file; ///ts:export:generated
    exports.render = render_file; ///ts:export:generated
    exports.camera = camera_file; ///ts:export:generated
    exports.texture = texture_file; ///ts:export:generated
    exports.renderObject = renderObject_file; ///ts:export:generated
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define('nemesis',["require", "exports", "./eventObject", './input/index', './math/index', './rendering/index', "./canvas", "./config"], function (require, exports, eventObject, _input, _math, _rendering, _canvas, _config) {
    /**
     * The entry point class. Contains reference to other modules and manages the game loop.
     */
    var nemesis = (function (_super) {
        __extends(nemesis, _super);
        /**
         * Default constructor.
         */
        function nemesis() {
            _super.call(this);
            this.input = _input;
            this.math = _math;
            this.rendering = _rendering;
            this.canvas = _canvas;
            this.config = _config;
            this.registerEvent("update");
            this.registerEvent("render");
        }
        /**
         * Starts the game.
         * @param context An object that gets passed to each function, each time a frame is rendered.
         */
        nemesis.prototype.run = function (context) {
            var _this = this;
            debugger;
            _rendering.render.init();
            var animateFrame = function (time) {
                _this.emit("update", time, context);
                _rendering.render.begin();
                _this.emit("render", time, context);
                _rendering.render.end();
                window.requestAnimationFrame(animateFrame);
            };
            window.requestAnimationFrame(animateFrame);
        };
        return nemesis;
    })(eventObject);
    var _nemesis = new nemesis();
    return _nemesis;
});

