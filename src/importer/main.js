///<reference path="../../lib/node/node.d.ts" />
///<reference path="../../lib/node/minimist.d.ts" />
var parseArgs = require('minimist');
var transform = require('stream').Transform;
var fs = require('fs');
function main(args) {
    var parser = createParser(args);
    var input = process.stdin;
    var output = process.stdout;
    if (!!args._[0]) {
        input = fs.createReadStream(args._[0]);
    }
    if (!!args._[1]) {
        output = fs.createWriteStream(args._[1]);
    }
    input.on('end', function () {
        finalize(parser);
        parser.push(JSON.stringify(parser.obj));
        parser.end();
    });
    input.pipe(parser).pipe(output);
}
function createParser(args) {
    var parser = new transform();
    parser._transform = function (data, encoding, done) {
        parseObj(parser, data, encoding, done);
    };
    parser.obj = {
        vertexes: [],
        uv: [],
        tempUv: [],
        faces: [],
        textureCoordinates: [],
        normalCoordinates: [],
        normals: []
    };
    return parser;
}
function parseObj(parser, data, encoding, done) {
    if (!!parser.prevData) {
        data = parser.prevData + data;
    }
    data = data.toString().split('\n');
    while (data.length > 1) {
        var d = data.shift().split(' ');
        switch (d[0]) {
            case 'v':
                parser.vertexCount += 3;
                parser.obj.vertexes.push(parseFloat(d[1]));
                parser.obj.vertexes.push(parseFloat(d[2]));
                parser.obj.vertexes.push(parseFloat(d[3]));
                break;
            case 'f':
                for (var i = 1; i < d.length; i++) {
                    var d2 = d[i].split('/');
                    parser.faceCount += d2.length;
                    parser.obj.faces.push(parseInt(d2[0]) - 1);
                    if (!!d2[1]) {
                        parser.obj.textureCoordinates.push(parseInt(d2[1]) - 1);
                    }
                    if (!!d2[2]) {
                        parser.obj.normalCoordinates.push(parseInt(d2[2]) - 1);
                    }
                }
                break;
            case 'vt':
                parser.uvCount += 2;
                parser.obj.tempUv.push(parseFloat(d[1]));
                parser.obj.tempUv.push(parseFloat(d[2]));
                break;
            case 'vn':
                parser.normalCount += 3;
                parser.obj.normals.push(parseFloat(d[1]));
                parser.obj.normals.push(parseFloat(d[2]));
                parser.obj.normals.push(parseFloat(d[3]));
                break;
        }
    }
    parser.prevData = data[0];
    done();
}
function finalize(parser) {
    for (var i = 0; i < parser.obj.faces.length; i++) {
        var f = parser.obj.faces[i];
        var tc = parser.obj.textureCoordinates[i];
        parser.obj.uv[f * 2] = parser.obj.tempUv[tc * 2];
        parser.obj.uv[f * 2 + 1] = parser.obj.tempUv[tc * 2 + 1];
    }
    //Remove useless data from obj.
    delete parser.obj.tempUv;
    delete parser.obj.textureCoordinates;
    delete parser.obj.normalCoordinates;
}
main(parseArgs(process.argv.slice(2)));
