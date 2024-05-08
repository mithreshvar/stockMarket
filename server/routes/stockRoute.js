const express = require('express');
const { createStock, createManyStocks, getStocks, getStock, updateStock, deleteStock, getStockBySymbol, buyStock, sellStock } = require('../controllers/stockController');
const requireAuth = require('../middleware/requireAuth');


const router = express.Router();

router.get('/id/:id', getStock);

router.get('/:symbol', getStockBySymbol);

router.get('/', getStocks);

router.use(requireAuth)

router.post('/buy', buyStock);

router.post('/sell', sellStock);

router.post('/create', createStock);

router.post('/createMany', createManyStocks);

router.put('/update/:id', updateStock);

router.delete('/delete/:id', deleteStock);

module.exports = router;