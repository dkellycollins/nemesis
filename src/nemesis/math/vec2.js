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
define(["require", "exports", "./glMatrix"], function(require, exports, glMatrix) {
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
                } else {
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
