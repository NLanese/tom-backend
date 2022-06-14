import request from 'request'
import fs from 'fs'
import xlsx from 'node-xlsx';
import path from 'path'

var url = 'https://pdftables.com/api?key=jp0nf8bef3rkl&format=xlsx-single';

const pdfToExcel = (pdfFile) => {
    var req = request.post({encoding: null, url: url}, async function (err, resp, body) {
        if (!err && resp.statusCode == 200) {
            fs.writeFile(`${pdfFile.path}.xlsx`, body, function(err) {
                if (err) {
                    console.log('error writing file');
                }
            });
        } else {
            console.log('error retrieving URL');
        };
    });
    
    var form = req.form();
    form.append('file', fs.createReadStream(`./${pdfFile.path}`));
}

const parseExcel = async (file) => {
    let workSheetsFromFile;

    if (file.path.search(".xlsx") === -1) {
        const filePath = await path.resolve(`./${file.path}.xlsx`)
        workSheetsFromFile = await xlsx.parse(`./${file.path}.xlsx`);
        await fs.unlinkSync(`./${file.path}`)
        await fs.unlinkSync(filePath)
        return workSheetsFromFile[0].data
    }
    
    if (file.path.search(".xlsx") !== -1) {
        const filePath = await path.resolve(`./${file.path}`)
        workSheetsFromFile = await xlsx.parse(`./${file.path}`);
        await fs.unlinkSync(filePath)
        return workSheetsFromFile[0].data
    }
}

export {
    pdfToExcel,
    parseExcel
}