var express = require('express');
var app = express();
var axios = require('axios');
const port = process.env.APPLICATION_PORT ? process.env.APPLICATION_PORT : 3000
const detailServicePort = process.env.DETAIL_SERVICE_PORT ? process.env.DETAIL_SERVICE_PORT : 3000
const detailServiceHostName = process.env.DETAIL_HOSTNAME ? process.env.DETAIL_HOSTNAME : 'localhost'
const products = [
  {  
      "sku": 4433,
      "name": "mini cooper",
      "preco": 12500
  },
  {  
      "sku": 6643,
      "name": "maxda rx7",
      "preco": 10000.23
  },
  {
    "sku": 1,
    "name": "audi a3",
    "preco": 20000
  }
];
app.get('/', async (req, res) => {
  var pTemp = products
  for(i = 0; i< pTemp.length; i++) {
    const response = await getData(pTemp[i].sku)
    if (response.data) {
      pTemp[i].description = response.data.desc
    }
  }
  res.send(JSON.stringify(pTemp));
});

app.listen(port, function () {
  console.log('Example app listening on port', port);
});

const getData = async (code) => {
  try {
    return await axios.get(`http://${detailServiceHostName}:${detailServicePort}/${code}`)
  } catch (error) {
    console.error('Axios error', error)
  }
}