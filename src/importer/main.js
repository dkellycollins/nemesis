///<reference path="../../lib/node/node.d.ts" />
///<reference path="../../lib/node/minimist.d.ts" />
var parseArgs = require('minimist');
var transform = require('stream').Transform;
var fs = require('fs');
function main(args) {
    var parser = new transform();
    parser._transform = function (data, encoding, done) {
        parseObj(parser, data, encoding, done);
    };
    var input = process.stdin;
    var output = process.stdout;
    if (!!args._[0]) {
        input = fs.createReadStream(args._[0]);
    }
    if (!!args._[1]) {
        output = fs.createWriteStream(args._[0]);
    }
    input.pipe(parser).pipe(output);
}
function parseObj(parser, data, encoding, done) {
    if (!parser.obj) {
        parser.obj = {
            vertexes: [],
            faces: []
        };
    }
    data = data.toString().split('\n');
    for (var i = 0; i < data.length; i++) {
        var d = data[i].split(' ');
        switch (d[0]) {
            case 'v':
                parser.obj.vertexes.push(parseFloat(d[1]));
                parser.obj.vertexes.push(parseFloat(d[2]));
                parser.obj.vertexes.push(parseFloat(d[3]));
                break;
            case 'f':
                parser.obj.faces.push(parseInt(d[1]));
                parser.obj.faces.push(parseInt(d[2]));
                parser.obj.faces.push(parseInt(d[3]));
                break;
        }
    }
    parser.push(JSON.stringify(parser.obj));
    done();
}
main(parseArgs(process.argv.slice(2)));
