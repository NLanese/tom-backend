import request from 'request'
import fs from 'fs'
// import readXlsxFile from 'read-excel-file/node';
import xlsx from 'node-xlsx';

var url = 'https://pdftables.com/api?key=dxn1z7pa5li5&format=xlsx-single';
// const readXlsxFile = require('read-excel-file/node')

const pdfToExcel = (pdfFile) => {
    var req = request.post({encoding: null, url: url}, async function (err, resp, body) {
        if (!err && resp.statusCode == 200) {
            fs.writeFile("output.xlsx", body, function(err) {
                if (err) {
                    console.log('error writing file');
                } else {
                    console.log('complete')
                    // return true
                }
            });
        } else {
            console.log('error retrieving URL');
            console.log(err)
            console.log(resp.statusCode)
        };
    });
    
    var form = req.form();
    form.append('file', fs.createReadStream(`./${pdfFile.path}`));
}

const parseExcel = async (filePath) => {
    console.log('jshHAJKDHASKJDH')

    const workSheetsFromFile = await xlsx.parse(`./output.xlsx`);

    return workSheetsFromFile[0].data
    // await console.log(workSheetsFromFile[0].data)
}

export {
    pdfToExcel,
    parseExcel
}