const express=require('express');
const {status}=require('../controllers/Status');
const { cryptoDeveiation } = require('../controllers/CryptoDeviation');
const logger = require('../middleware/logger');

const router= express.Router();


router.get("/status",logger, status)
router.get("/deviation",logger, cryptoDeveiation)

module.exports=router;

