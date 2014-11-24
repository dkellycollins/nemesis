///<reference path="../../lib/node/node.d.ts" />
//declare function require(m: string): any;
var fs = require('fs');
function processObj(src, dest) {
    var destObj = {
        vertexes: [],
        uv: [],
        faces: []
    };
    function processLine(line) {
        var buf = line.split(' ');
        switch (buf[0]) {
            case 'v':
                destObj.vertexes.push(parseFloat(buf[1]));
                destObj.vertexes.push(parseFloat(buf[2]));
                destObj.vertexes.push(parseFloat(buf[3]));
                break;
            case 'f':
                destObj.faces.push(parseInt(buf[1]));
                destObj.faces.push(parseInt(buf[2]));
                destObj.faces.push(parseInt(buf[3]));
                break;
        }
        return true;
    }
    var data = fs.readFileSync(src, "utf8");
    var data = data.split('\n');
    for (var i = 0; i < data.length; i++) {
        processLine(data[i]);
    }
    fs.writeFileSync(dest, JSON.stringify(destObj));
    /*var lineBuffer;
    function processData(data:string[]) {
        lineBuffer += data[0];
        while(data[1]) {
            processLine(lineBuffer);
            data = data.splice(1);
            lineBuffer = data[0];
        }
    }

    var buf = "";
    var length = 64 * 1024;
    var position = 0;
    var encoding = 'utf-8';
    function processRead(err, bytesRead, buffer) {
        if(!!err) {
            console.error('Error reading file.');
            console.error(err.toString());
        }

        position += bytesRead;
        processData(buffer);
        if(bytesRead < length) {
            saveData();
        } else {
            fs.read(src, buffer, 0, length, position, processRead);
        }
    }

    function saveData() {
        var b = JSON.stringify(destObj);
        dest.write(dest, b, 0, encoding, function(err, written, buffer) {
            if(err) {
                console.log('Error saving file.');
                console.log(err.toString());
            }

            if(written < b.length) {
                console.log('Incomplete write.');
            } else {

            }
        });
    }

    fs.read(src, length, position, encoding, processRead);*/
}
function main(args) {
    processObj(args[0], args[1]);
    /*
     var src;
     var dest;

    if(!!args[0]) {
        if(fs.existsSync(args[0])) {
            src = fs.openSync(args[0], 'r');
        }
    } else {
        src = process.stdin;
    }

    if(!!args[1]) {
        if(fs.existsSync(args[1])) {
            dest = fs.openSync(args[1], 'w');
        }
    } else {
        dest = process.stdout;
    }

    if(!src || !dest) {
        if(!src) {
            console.error("Source file does not exist");
        }
        if(!dest) {
            console.error("Destination file does not exist");
        }
    } else {
        processObj(src, dest);
    }*/
}
main(process.argv.slice(2));
