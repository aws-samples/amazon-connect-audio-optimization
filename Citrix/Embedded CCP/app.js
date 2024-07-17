/* eslint-disable no-undef */
const express = require('express')
const app = express()
const port = 3001

// set src
app.use(express.static('src'));

// Routes
app.get('/', (req, res) => {
  res.send('Amazon Connect Audio Optimization for Citrix - Embedded CCP Sample Code');
})

// Start the server. 
app.listen(port, () => {
  console.log(`Amazon Connect Audio Optimization for Citrix - Embedded CCP Sample Code app listening at http://localhost:${port}`);
})