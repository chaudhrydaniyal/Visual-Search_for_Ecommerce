const bodyParser = require('body-parser');

const scrapers = require('./scrapers');
var { spawn } = require('child_process');


const express= require('express')
const upload= require('express-fileupload')

var resultArray = [];




// MongoDB 

var MongoClient = require('mongodb').MongoClient;  
async function writeData(dataToMongodb) {
  const client = new MongoClient("mongodb://localhost:27017/mydb1");
  client.connect()
  const db = client.db();

  await db.collection('results').insertOne(dataToMongodb)

  client.close()
}




async function resetDB() {
  const client = new MongoClient("mongodb://localhost:27017/mydb1");
  client.connect()
  const db = client.db();
  if (await db.collection('results').count()){
  await db.collection('results').drop()
  }

  client.close()
}


// async function readData() {
//   resultArray = [];
//   const client = new MongoClient("mongodb://localhost:27017/mydb1");
//   client.connect()
//   const db = client.db();

//   var cursor = await db.collection('results').find({}).toArray()
//   cursor.forEach(function(doc,err){resultArray.push(doc)})

//   console.log(resultArray)

//   client.close()
// }




const app = express()

app.use(upload())


app.get('/', (req,res)=>{res.sendFile(__dirname + '/index.html')})
app.get('/results', (req,res)=>{
  
 
  res.sendFile(__dirname + '/results.html');

  // const client = new MongoClient("mongodb://localhost:27017/mydb1");
  // client.connect()
  // const db = client.db();

  // db.collection('results').find({}).toArray((err,result)=>{
  //   res.write(JSON.stringify(res))
  // })
  


  // readData()
  // resultArray.forEach((r)=>{res.send('add')})
  


})


app.get('/results1', (req, res) => {

  let temp=[];


  const client = new MongoClient("mongodb://localhost:27017/mydb1");
  client.connect()
  const db = client.db();
  db.collection('results').find({}).toArray((err, result) => {
    // temp = result
    // function reducer(acc,cur){
    //   return {...acc, [cur._id]: cur.data1}
    // }
  
    
  
    // let obj = temp.reduce(reducer,{})
  
    // console.log(obj)
    // res.send(obj)

    const obj = {};

    for (let i = 0; i < result.length; i++) {
      obj[i] = result[i].data1;
    }

    res.send(obj)
  }





  )

  



})






app.post('/' , (req,res)=>{

    if (req.files){
        console.log(req.files)
        var file = req.files.file
        var filename = 'image.jpg'
        file.mv('./uploads/' + filename, function (err) {
            if (err){
                res.send(err)
            }
            else {
              resetDB();

              res.redirect('/results')
              call();
            }
            }
        )

    }
})






// app.use(bodyParser.json())
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*"); // disabled for security on local
//     res.header("Access-Control-Allow-Headers", "Content-Type");
//     next();
// });


// app.get('/players', async (req, res) => {
//     const players = await db.getAllPlayers();
//     res.send(players)
// })

function call(){

let search;
const pythonProcess1 = spawn('python', ['new_image_demo.py', './uploads/image.jpg']);
pythonProcess1.stdout.on('data', function (data) {
  //Here is where the output goes

  console.log('stdout: ' + data);

  data = data.toString();
  search += data;

});


pythonProcess1.stdout.on('end', function () {
  search = search.substring(search.indexOf('\n') + 1)
  search = search.substring(0, search.indexOf('\n')-1)


  console.log(search)
  if (search === 'short sleeve top') {

    formalcall();
  }
  else {
    console.log('error')
    




 











  }
})
}



async function formalcall() {
  const channelData = await scrapers.scrape('https://www.amazon.com/s?i=fashion-mens-clothing&rh=n%3A2476517011&fs=true&qid=1631084764&ref=sr_pg_1');
  var i;
  var lim = channelData.el2.length;
  const arr = [];
  const arr2 = [];



  for (i = 0; i < 5; i++) {

    arr[i] = channelData.el1[i];
    arr2[i]= channelData.el2[i];

  }


  const pythonProcess = spawn('python', ['d.py', './uploads/image.jpg', arr, arr2]);
  pythonProcess.stdout.on('data', data => {
    console.log(`${data}`);
    writeData({data1:`${data}`});

  })
  console.log(lim)

  // await db.insertPlayername(i,channelData.el1[i],channelData.el2[i]);




  var lim = channelData.el2.length;
  console.log(lim);

  var lim1 = channelData.el1.length;
  console.log(lim1);


}


// if (search == 'short sleeve top'){

// formalcall();
// }
// else {console.log('error')}


// app.listen(port, () => console.log(`Example app listening on port ${port}!`))
app.listen(3000)