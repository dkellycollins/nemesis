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
define(["require", "exports", "./glMatrix"], function (require, exports, glMatrix) {
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
