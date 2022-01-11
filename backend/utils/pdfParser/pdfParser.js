import request from 'request'
import fs from 'fs'
// import readXlsxFile from 'read-excel-file/node';
import xlsx from 'node-xlsx';

var url = 'https://pdftables.com/api?key=6fzoiba56y4g&format=xlsx-single';
// const readXlsxFile = require('read-excel-file/node')

const pdfToExcel = async (pdfFile) => {
    var req = await request.post({encoding: null, url: url}, function (err, resp, body) {
        if (!err && resp.statusCode == 200) {
            fs.writeFile("output.xlsx", body, function(err) {
                if (err) {
                    console.log('error writing file');
                }
            });
        } else {
            console.log('error retrieving URL');
            console.log(err)
            // console.log(resp.statusCode)
        };
    });
    
    var form = await req.form();
    await form.append('file', fs.createReadStream('./just-the-scorecard.pdf'));
}

const parseExcel = async (filePath) => {
    const workSheetsFromFile = await xlsx.parse(`./output.xlsx`);
    await console.log(workSheetsFromFile[0].data)
}

export {
    pdfToExcel,
    parseExcel
}