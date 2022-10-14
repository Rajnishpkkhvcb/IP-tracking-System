const express=require('express')
const app=express()

const fs = require("fs");
const { parse } = require("csv-parse");

const requestIp = require('request-ip');

const ObjectsToCsv = require('objects-to-csv');

const csvFilePath=''
const csvJson=require('csvtojson')


const port = process.env.port || 4000



app.listen(port);

console.log(port)

const Middleware = async function(req, res, next) {
    var clientIp=requestIp.getClientIp(req);
    console.log(clientIp)
    const csvdata=await csvJson().fromFile(`${__dirname}/data.csv`);
    console.log(csvdata,"-----------------")
    let ipRegister=false
    for(let i=0;i<csvdata.length;i++){
        if(csvdata[i].IP==clientIp){
            csvdata[i].Count++
            ipRegister=true
            break;
        }
    }
    if(!ipRegister){
        csvdata.push({IP:clientIp,Count:1})
    }

    const csv = new ObjectsToCsv(csvdata);
    await csv.toDisk(`./data.csv`, { append: false });
    next();
};

app.use(Middleware)

app.get('/',(req,res)=>{
    res.send(`<!DOCTYPE html>
    <html>
    <head>
    <title>Title of the document</title>
    </head>
    
    <body>
        <h1>Welcome to IP tracking System</h1>

        <form action="/iptrack" method="GET">
            <input type="submit" value="Get Track">
        </form>
        </body>
    
    </html>`)
})


// app.get("/iptrack",async (req,res)=>{
//     res.send("track")
// })


// fs.createReadStream("./migration_data.csv")
//   .pipe(parse({ delimiter: ",", from_line: 2 }))
//   .on("data", function (row) {
//     console.log(row);
//   })
//   .on("end", function () {
//     console.log("finished");
//   })
//   .on("error", function (error) {
//     console.log(error.message);
//   });
