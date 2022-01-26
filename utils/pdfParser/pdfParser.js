import request from 'request'
import fs from 'fs'
import xlsx from 'node-xlsx';

var url = 'https://pdftables.com/api?key=770oukvvx1wl&format=xlsx-single';

const pdfToExcel = (pdfFile) => {
    var req = request.post({encoding: null, url: url}, async function (err, resp, body) {
        if (!err && resp.statusCode == 200) {
            // console.log(pdfFile.path)
            fs.writeFile(`${pdfFile.path}.xlsx`, body, function(err) {
                if (err) {
                    console.log('error writing file');
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
    const workSheetsFromFile = await xlsx.parse(`./${filePath.path}.xlsx`);
    return workSheetsFromFile[0].data
}

export {
    pdfToExcel,
    parseExcel
}