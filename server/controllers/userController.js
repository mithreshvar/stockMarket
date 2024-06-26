
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}

const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.login(email, password)
        const token = createToken(user._id)

        res.status(200).json( { balance: user.balance, email: user.email, name: user.name, portfolio: user.portfolio, watchlist: user.watchlist, token } )
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const signupUser = async (req, res) => {
    const { email, password, name } = req.body

    try {
        const user = await User.signup(email, password, name)
        const token = createToken(user._id)

        res.status(200).json({ balance: user.balance, email: user.email, name: user.name, portfolio: user.portfolio, watchlist: user.watchlist, token })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const updateWallet = async (req, res) => {
    const { wallet } = req.body
    const user = req.user

    try {
        user.balance = Number(wallet);
        await user.save()
        res.status(200).json({ balance: user.balance })
    }
    catch (error) {
        res.status(200).json({ error: error.message })
    }
}

const reAuth = async (req, res) => {
    const user = req.user
    res.status(200).json({ balance: user.balance, email: user.email, name: user.name, portfolio: user.portfolio, watchlist: user.watchlist })
}


module.exports = { signupUser, loginUser, updateWallet, reAuth }