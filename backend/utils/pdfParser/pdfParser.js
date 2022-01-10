import request from 'request'
import fs from 'fs'

var url = 'https://pdftables.com/api?key=6fzoiba56y4g&format=xlsx-single';

const pdfToExcel = (pdfFile) => {
    var req = request.post({encoding: null, url: url}, function (err, resp, body) {
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
    
    var form = req.form();
    form.append('file', fs.createReadStream(pdfFile.path));
}

export default pdfToExcel