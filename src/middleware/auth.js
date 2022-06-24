const jwt = require("jsonwebtoken")
const User = require('../db/models/user')


const authToken = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer', '').trim()
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({_id: decoded._id, 'tokens.token':token})
        if(!user) {
            throw new Error()
        }
        req.user = user
        req.token = token
        next()
    } catch(e) {
        res.status(401).send({error: 'Please authenticate.'})
        console.log(e)
    }

}

module.exports = authToken