const StreamZip = require('node-stream-zip');
const parser = require('fast-xml-parser');

exports.extract = function (filePath) {
    return new Promise(
        function (resolve, reject) {
            open(filePath).then(function (res, err) {
                if (err) {
                    reject(err)
                }
                resolve(res)
            })
        }
    )
};

function open(filePath) {
    return new Promise(
        function (resolve, reject) {
            const zip = new StreamZip({
                file: filePath,
                storeEntries: true
            })
            zip.on('ready', () => {
                var chunks = [];

                zip.stream('word/document.xml', (err, stream) => {
                    if (err) {
                        reject(err)
                    }
                    stream.on('data', function (chunk) {
                        chunks.push(chunk)
                    })
                    stream.on('end', function () {
                        content = Buffer.concat(chunks);

                        if( parser.validate(chunks.join()) === true) {
                            var jsonObj = parser.parse(chunks.join(), {});
                            zip.close();
                            resolve(readJson(jsonObj));
                        }

                        zip.close();
                        resolve('');
                    })
                })
            })
        }
    )
};

function readJson(jsonData) {
    const content = jsonData["w:document"]["w:body"]["w:p"];
    let pointTitle = '';
    let points = [];
    let pointObject = [];

    for (let index = 0; index < content.length; index++) {

        if ((content[index]["w:pPr"].hasOwnProperty("w:contextualSpacing") && content[index]["w:pPr"].hasOwnProperty("w:ind")) ||
        (content[index]["w:pPr"].hasOwnProperty("w:numPr") && content[index]["w:pPr"]["w:numPr"].hasOwnProperty("w:ilvl") && content[index]["w:pPr"]["w:numPr"].hasOwnProperty("w:numId"))) {
            if (content[index]["w:r"] && content[index]["w:r"].hasOwnProperty("w:t")) {
                pointObject.push(content[index]["w:r"]["w:t"]);
            } else if (content[index]["w:r"] && content[index]["w:r"].length > 0) {
                let point = ''
                content[index]["w:r"].forEach(element => {
                    if (element.hasOwnProperty("w:t")) {
                        point += element["w:t"];
                    }
                });
                pointObject.push(point);
            }
        } else if(content[index]["w:r"] && content[index]["w:r"].hasOwnProperty("w:t")) {
            if (pointTitle == '' && points.length > 0) {
                points.push(pointObject);
            } else if (pointTitle != "" || pointObject.length > 0) {
                points[pointTitle] = pointObject;
            }
            pointTitle = content[index]["w:r"]["w:t"].toString();
            pointObject = [];
        }
    }

    return points;
}
