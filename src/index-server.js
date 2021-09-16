const express = require('express')
const app = express()
const port = 3000

const bodyParser = require('body-parser');

const scrapers = require('./scrapers');
const db = require('./database')
var { spawn } = require('child_process');




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

let search;
const pythonProcess1 = spawn('python', ['new_image_demo.py', 'image.jpg']);
pythonProcess1.stdout.on('data', function (data) {
  //Here is where the output goes

  // console.log('stdout: ' + data);

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


  const pythonProcess = spawn('python', ['d.py', 'image4.jpg', arr,arr2]);
  pythonProcess.stdout.on('data', data => console.log(`${data}`))
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