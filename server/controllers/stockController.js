const Stock = require('../models/stockModel')
const mongoose = require("mongoose");

const createStock = async (req, res) => {
    const { name, symbol, price, shareAmount, type } = req.body

    if (!name || !symbol || !price || !shareAmount || !type) {
        return res.status(400).json({ error: "All fields must be filled" })
    }

    if (typeof price === 'number') {
        price = [price]
    }

    try {
        const stock = await Stock.create({ name, symbol, price, shareAmount, type })
        res.status(201).json({ stock })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const createManyStocks = async (req, res) => {
    const stocks = req.body

    if (!stocks) {
        return res.status(400).json({ error: "All fields must be filled" })
    }

    try {
        const createdStocks = await Stock.insertMany(stocks)
        res.status(201).json({ createdStocks })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getStocks = async (req, res) => {
    try {
        const stocks = await Stock.find()
        res.status(200).json({ stocks })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getStock = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(`No stock with id: ${id}`)
    }

    try {
        const stock = await Stock.findById(id)
        res.status(200).json({ stock })
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getStockBySymbol = async (req, res) => {
    const { symbol } = req.params

    try {
        const stock = await Stock.findOne({ symbol: symbol })
        res.status(200).json({ stock })
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const buyStock = async (req, res) => {

    const { stockid, quantity } = req.body

    if (!stockid || !quantity) {
        return res.status(200).json({ error: "All fields must be filled" })
    }

    try {
        const stock = await Stock.findById (stockid);
        const user = req.user;

        if (stock.shareAmount < quantity) {
            return res.status(200).json({ error: "Not enough shares" })
        }

        let price = stock.price[stock.price.length-1] * quantity;
        
        if (user.balance < quantity*price) {
            return res.status(200).json({ error: "Not enough balance" })
        }
        stock.shareAmount -= quantity;
        user.balance -= quantity*price;
        
        const newPortfolioItem = {
            stock: stock._id,
            quantity: quantity,
            price: price,
            type: stock.type
        }
        let index = user.portfolio.findIndex(item => item.stock == stockid);
        if (index !== -1) {
            user.portfolio[index].quantity += quantity;
            user.portfolio[index].price += price;
        } else {
            user.portfolio.push(newPortfolioItem);
        }

        await stock.save();
        await user.save();
        res.status(200).json({ stock, user })
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const sellStock = async (req, res) => {
    
    const { stockid, quantity } = req.body

    if (!stockid || !quantity) {
        return res.status(200).json({ error: "All fields must be filled" })
    }

    try {
        const stock = await Stock.findById (stockid);
        const user = req.user;

        let price = stock.price[stock.price.length-1] * quantity;
        
        let portfolioItem = user.portfolio.find(item => item.stock == stockid);
        if (!portfolioItem || portfolioItem.quantity < quantity) {
            return res.status(200).json({ error: "Not enough shares" })
        }

        stock.shareAmount += Number(quantity);
        user.balance += quantity*price;

        await stock.save();
        await user.save();
        res.status(200).json({ stock, user })
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}


const updateStock = async (req, res) => {
    const { id } = req.params
    const { name, symbol, price, shareAmount, type } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(`No stock with id: ${id}`)
    }

    try {
        const updatedStock = { name, symbol, price, shareAmount, type }
        const stock = await Stock.findByIdAndUpdate(id, updatedStock, { new: true })
        res.status(200).json({ stock })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const deleteStock = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(`No stock with id: ${id}`)
    }

    await Stock.findByIdAndRemove(id)

    res.json({ message: "Stock deleted successfully." })
}

module.exports = { createStock, createManyStocks, getStocks, getStock, updateStock, deleteStock, getStockBySymbol, buyStock, sellStock }