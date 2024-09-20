const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./database'); // Import the Sequelize instance
 
const fs = require('fs'); // Import the file system module
const path = require('path');
 

const Category = require('./model/category.js');
const Item = require('./model/item.js'); 

const ItemController = require('./controller/itemController.js');


 
 

const app = express();
const PORT = process.env.PORT || 3000;



// Middleware to parse JSON and URL-encoded request bodies with increased payload size limit
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

//routing for Item
app.get('/items',ItemController.getAllItems);
app.post('/items',ItemController.createItem);
app.get('/itemsbyitemcode',ItemController.getItemByItemCode);

 



// Start the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Error syncing database:', err);
});

module.exports = app;