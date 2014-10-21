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
            } else {
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
            var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], det = a0 * a3 - a2 * a1;

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