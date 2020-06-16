var express = require('express');
var app = express();

app.get('/', function (req, res) {
    const json = [
        {  
            "sku": 4433,
            "name": "malbec",
            "preco": 123.23
        },
        {  
            "sku": 6643,
            "name": "creme de maos nativa spa",
            "preco": 30.23
        },
    ];

  res.send(JSON.stringify(json));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
