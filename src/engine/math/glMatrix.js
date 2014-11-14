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
define(["require", "exports"], function (require, exports) {
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
