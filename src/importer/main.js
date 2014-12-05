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
    input.pipe(parser).pipe(output);
}
/*function createParser(args) {
    var parser = new transform();
    parser._transform = function(data, encoding, done) {
        parseObj(parser, data, encoding, done);
    };
    parser.on('end', function() {
        parser.push(JSON.stringify(parser.obj));
    });

    return parser;
}*/
function createParser(args) {
    var parser = new transform();
    parser._transform = function (data, encoding, done) {
        parser.push(data + " * ");
        done();
    };
    return parser;
}
function parseObj(parser, data, encoding, done) {
    if (!parser.obj) {
        parser.obj = {
            vertexes: [],
            faces: []
        };
    }
    if (!!parser.prevData) {
        data = parser.prevData + data;
    }
    data = data.toString().split('\n');
    while (data.length > 0) {
        var d = data[0].split(' ');
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
        }
        data.pop();
    }
    done();
}
main(parseArgs(process.argv.slice(2)));
