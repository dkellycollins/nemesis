///<reference path="../../lib/node/node.d.ts" />

var transform = require('stream').Transform;

class objTransform extends Trans {

}

function parseObj(parser, data, encoding, done) {
    if(!!parser.prevData) {
        data = parser.prevData + data;
    }

    data = data.toString().split('\n');
    while(data.length > 1) {
        var d = data[0];
        switch (d[0]) {
            case 'v':
                parser.obj.vertexes.push(parseFloat(d[1]));
                parser.obj.vertexes.push(parseFloat(d[2]));
                parser.obj.vertexes.push(parseFloat(d[3]));
                break;
            case 'f':
                parser.obj.faces.push(parseInt(d[1]) - 1);
                parser.obj.faces.push(parseInt(d[2]) - 1);
                parser.obj.faces.push(parseInt(d[3]) - 1);
                break;
            case 'vt':
                parser.obj.uv.push(parseFloat(d[1]));
                parser.obj.uv.push(parseFloat(d[2]));
                break;
            case 'vn':
                parser.obj.normals.push(parseFloat(d[1]));
                parser.obj.normals.push(parseFloat(d[2]));
                parser.obj.normals.push(parseFloat(d[3]));
                break;
        }
        data.pop();
    }

    if(data[0].length == 0) {
        parser.push(JSON.stringify(parser.obj));
    } else {
        parser.prevData = data[0];
    }
    done();
}