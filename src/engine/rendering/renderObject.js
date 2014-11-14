define(["require", "exports", "./glContext", "lodash"], function (require, exports, gl, _) {
    var attribData = (function () {
        function attribData(id, index, type, normalize, stride, offset) {
            this.id = id;
            this.index = index;
            this.type = type;
            this.normalize = normalize;
            this.stride = stride;
            this.offset = offset;
        }
        return attribData;
    })();
    var renderObject = (function () {
        function renderObject(data, faces, triangles, shaderProgram) {
            this._attribData = {};
            this._vertexData = new Float32Array(data);
            this._faces = new Uint16Array(faces);
            this._triangles = triangles;
            this._shaderProgram = shaderProgram;
        }
        renderObject.prototype.init = function () {
            this._vertexDataBuffer = gl.createBuffer();
            this._faceBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexDataBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this._vertexData, gl.STATIC_DRAW);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._faceBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._faces, gl.STATIC_DRAW);
        };
        renderObject.prototype.setActive = function () {
            gl.useProgram(this._shaderProgram);
        };
        renderObject.prototype.render = function (time, args) {
            //gl.useProgram(this._shaderProgram);
            gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexDataBuffer);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._faceBuffer);
            _.forEach(this._attribData, function (attrib) {
                gl.vertexAttribPointer(attrib.id, attrib.index, attrib.type, attrib.normalize, attrib.stride, attrib.offset);
            });
            gl.drawElements(gl.TRIANGLES, this._triangles, gl.UNSIGNED_SHORT, 0);
        };
        renderObject.prototype.dispose = function () {
            gl.deleteBuffer(this._vertexDataBuffer);
            gl.deleteBuffer(this._faceBuffer);
        };
        renderObject.prototype.enableAttrib = function (attribName, index, stride, offset) {
            var attrib = gl.getAttribLocation(this._shaderProgram, attribName);
            gl.enableVertexAttribArray(attrib);
            this._attribData[attribName] = new attribData(attrib, index, gl.FLOAT, false, stride, offset);
            gl.vertexAttribPointer(attrib, index, gl.FLOAT, false, stride, offset);
        };
        renderObject.prototype.setMatrix = function (uniName, value) {
            var uniform = gl.getUniformLocation(this._shaderProgram, uniName);
            gl.uniformMatrix4fv(uniform, false, value);
        };
        renderObject.prototype._createArrayBuffer = function (bufferData) {
            return this._createBuffer(new Float32Array(bufferData), gl.ARRAY_BUFFER);
        };
        renderObject.prototype._createElementArrayBuffer = function (bufferData) {
            return this._createBuffer(new Uint16Array(bufferData), gl.ELEMENT_ARRAY_BUFFER);
        };
        renderObject.prototype._createBuffer = function (bufferData, bufferType) {
            var buffer = gl.createBuffer();
            gl.bindBuffer(bufferType, buffer);
            gl.bufferData(bufferType, bufferData, gl.STATIC_DRAW);
            return buffer;
        };
        return renderObject;
    })();
    return renderObject;
});
