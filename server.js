const express = require("express");
const app = express();
const customers = [];
const url = require('url');
const http = require('http');
var customerCounter = 0;
function RND(limit){
  return Math.floor(Math.random() * limit)
}

function generateNames() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(RND(possible.length));

  return text;
}

function generateDirections(){
  let directions = [];
  const numDirections = RND(5);
  for(var i=0; i<numDirections; i++){
    directions.push('direction'+i);
  }
  return directions;
}

function generateClients(){
  for(var i=0; i<500; i++){
      customers.push({
        id: 'customer'+(customerCounter),
        name: generateNames(),
        directions: generateDirections()
      })
      customerCounter++;
  }
}

app.listen(3000, () => {
  console.log("Application started and Listening on port 3000");
  generateClients();
  console.log("customers generated");
  console.table(customers)
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/index.js", (req, res) => {
  res.sendFile(__dirname + "/index.js");
});
app.get("/modules/filters.js", (req, res) => {
  res.sendFile(__dirname + "/modules/filters.js");
});
app.get("/styles.css", (req, res) => {
  res.sendFile(__dirname + "/styles.css");
});
app.get("/arrow.png", (req, res) => {
  res.sendFile(__dirname + "/arrow.png");
});
app.get("/getCustomers", (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(customers));
});

app.get("/deleteCustomer", (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  customers.splice(customers.findIndex(customer => customer.id === queryObject.customer), 1)
  console.log('deleted customer', queryObject.customer)
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(customers));
});

app.get("/modifyCustomer", (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  let customerIndex = customers.findIndex(customer => customer.id === queryObject.customer);
  customers[customerIndex].name = queryObject.newName;
  console.log('modified customer', queryObject.customer);
  console.log('new name', queryObject.newName);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(customers));
});

app.get("/addDirection", (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  let customerIndex = customers.findIndex(customer => customer.id === queryObject.customer);
  customers[customerIndex].directions.push(queryObject.newDirection);
  console.log('modified customer', queryObject.customer);
  console.log('new direction', queryObject.newDirection);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(customers));
});


app.get("/addCustomer", (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  customerCounter++;
  console.log('customer added', queryObject.newName)

  customers.push({
    id: 'customer'+customerCounter,
    name: queryObject.newName,
    directions: []
  })
  console.table(customers)
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(customers));
});

app.get("/deleteDirection", (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  let customerIndex = customers.findIndex(customer => customer.id === queryObject.customer)
  let directions = customers[customerIndex].directions
  directions.splice(directions.findIndex(direction => direction === queryObject.direction), 1)
  console.log('deleted direction '+queryObject.direction+ ' of customer', queryObject.customer)
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(customers));
});