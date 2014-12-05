///<reference path="../../lib/node/node.d.ts" />
///<reference path="../../lib/node/minimist.d.ts" />

var parseArgs = require('minimist');
var transform = require('stream').Transform;
var fs = require('fs');

interface IArguments {
    _: string[];
    h: boolean;
}

function main(args:IArguments):void {
    var parser = createParser(args);

    var input = process.stdin;
    var output = process.stdout;
    if(!!args._[0]) {
        input = fs.createReadStream(args._[0]);
    }
    if(!!args._[1]) {
        output = fs.createWriteStream(args._[1]);
    }

    input.pipe(parser).pipe(output);
}

function createParser(args) {
    var parser = new transform();
    parser._transform = function(data, encoding, done) {
        parseObj(parser, data, encoding, done);
    };
    parser.obj = {
        vertexes: [],
        uv: [],
        faces: [],
        normals: []
    };

    return parser;
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

main(parseArgs(process.argv.slice(2)));
