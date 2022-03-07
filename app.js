const path = require('path');
const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3050;


// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Hello');
});


const start = () => {
  try {
    app.listen(PORT, () => {
      console.log(`Listening for port: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();