var express = require('express');
var router = express.Router();

const ffi = require('ffi');
const path = require('path');

const rust = ffi.Library(path.join(__dirname, '../../backend/target/release/backend'), {
  get_by_key: ["string", [ "string" ]],
  del_by_key: ["string", [ "string" ]],
  customer_registration: ["string", [ "string" ]],
  resort_registration: ["string", [ "string" ]],
  scan_by_pattern: ["string", [ "string" ]],
  mget_by_pattern: ["string", [ "string" ]],
});

router.get('/', function(req, res) {
  res.send(rust.get_by_key("test"));
});

router.get('/resorts', function(req, res) {
  res.send(rust.scan_by_pattern("resorts:*"));
});

router.get('/customers', function(req, res) {
  res.send(rust.mget_by_pattern("customers:*"));
});

router.post('/customer_registration', function(req, res) {
  req.body.favorite_resort = req.body.favorite_resort.value;
  let stringifiedBody = JSON.stringify(req.body);
  res.send(rust.customer_registration(stringifiedBody));
});

router.post('/resort_registration', function(req, res) {
  let stringifiedBody = JSON.stringify(req.body);
  res.send(rust.resort_registration(stringifiedBody));
});

router.post('/resort_delete', function(req, res) {
  res.send(rust.del_by_key("resorts:\"" + req.body.name + "\""));
});

module.exports = router;