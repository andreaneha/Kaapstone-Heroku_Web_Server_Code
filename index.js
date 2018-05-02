const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
var http = require('http');
var url = require('url');
var fs = require('fs');

const { Client } = require('pg');
var q;
var sensorQuery;
var sensor_string;
var data_array;
var retString = '';
var lastItem = 0;

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

client.connect((err) => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('connected')
  }
});
client.query('SELECT * FROM test ORDER BY test1 LIMIT 1;', function (err, result, fields){
        lastItem = result.rows[0].test1;
    });
    


function pushToDB(sensorQuery){
    
    client.query('INSERT INTO sensor_input(end_time, Sensor1, Sensor2, Sensor3, Sensor4, Sensor5, Sensor6, Sensor7) VALUES ('+sensorQuery.time+','+sensorQuery.s1+','+sensorQuery.s2+','+sensorQuery.s3+',' + sensorQuery.s4+','+sensorQuery.s5+','+sensorQuery.s6+','+sensorQuery.s7+');', (err, res) => {
        });
    console.log("pushed to db");
}

function pushToDBtest(S1){
    
    client.query('INSERT INTO test(test1) VALUES (' + S1 + ');', (err, res) => {
            if (err) {console.log('oopsies')};
        });
    console.log("pushed to dbtest" + S1);
}

function getLastSensor(){
    var query_string = 'Select * from sensor_input ORDER BY end_time desc LIMIT 1;';
    client.query(query_string, function (err, result, fields){
        data_array = result.rows[0]
        lastItem = data_array.end_time;
        console.log(lastItem);
        sensor_string1 = 'sensor1=' + data_array.sensor1.toString();
        sensor_string2 = ';sensor2=' + data_array.sensor2.toString();
        sensor_string3 = ';sensor3=' + data_array.sensor3.toString();
        sensor_string4 = ';sensor4=' + data_array.sensor4.toString();
        sensor_string5 = ';sensor5=' + data_array.sensor5.toString();
        sensor_string6 = ';sensor6=' + data_array.sensor6.toString();
        sensor_string7 = ';sensor7=' + data_array.sensor7.toString();
        
        retString = sensor_string1 + sensor_string2 + sensor_string3 + sensor_string4 + sensor_string5 + sensor_string6 + sensor_string7;  
        
        console.log(retString);
        
        
    });

    return retString;
    
};


express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/sensor', function(req, res){
        q = url.parse(req.url, true); //stores the address in q (url object)
        sensorQuery = q.query;
        pushToDB(sensorQuery);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('hello node');
  })    
  .get('/test', function(req, res){
        q = url.parse(req.url, true); //stores the address in q (url object)
        sensorQuery = q.query;
        res.writeHead(200, {'Content-Type': 'text/html'});
        console.log(sensorQuery.test1);
        pushToDBtest(sensorQuery.test1);

        res.end("sup")
        
    })
    .get('/lastdataset', function(req,res){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(getLastSensor());
        
    })
   .listen(PORT, () => console.log(`Listening on ${ PORT }`));
    

    

    
 