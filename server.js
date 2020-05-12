const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const connectMongo = require('connect-mongo');
const expressSession = require('express-session');

const entries = require('./database/models/entries')

const app = express()
app.use(bodyParser.json());
app.use(cors())

mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true }, function(error){
    if(error) console.log(error);
      console.log("connection successful");
});


const mongoStore = connectMongo(expressSession);


app.use(
  expressSession({
    secret: 'random',
    store: new mongoStore({
      mongooseConnection: mongoose.connection
    })
  })
);

function callAPI(){
	let username='stellar'
    let password='trackit'
    var options={
    	host:'blazer7.geotrackers.co.in',
    	port:80,
    	method: 'get',
    	path: '/GTWS/gtWs/LocationWs/getUsrLatestLocation',
		headers: {
		    "Content-Type": "text/plain",
		    'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64'),
		}
    }

    const req = http.request(options, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));
	  res.setEncoding('utf8');
	  var body = '';
	  res.on('data', function (chunk) {
	  	body += chunk;
	  	});
	  res.on('end', function(){
        var result = JSON.parse(body);
        const records = Object.values(result)
        for (var key in records){
       	let record = records[key]
       	entries.create(record)
       }

        
    });
	}).end();
	req.on('error', (e) => {
	  console.error(`problem with request: ${e.message}`);
	});
     
}
app.use(bodyParser.json());
app.use(cors())

app.get('/', (request,response)=>{
	callAPI()
	response.json('app working')
})
app.get('/getAllData', (req,res)=>{
	entries.find({}).exec((err,p)=>{
              if(err)return res.json('error')
              return res.json(p);
            })
})
app.post('/getFilteredData',(req,res)=>{
	console.log(req.body.speed)
	entries.find({speed:{$gte:req.body.speed}}).exec((err,result)=>{
		if(err) 
			return res.json('error')
		return res.json(result)
	})
})
app.listen(4000,()=>{
	console.log('Server running on port 4000')
})