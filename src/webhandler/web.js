const express = require('express')
const {loginRequest} = require('../apihandler/login')
const  router = express.Router()

router.get('/', async(req, res)=>{
    res.render('index')
})

router.post('/', async(req, res)=>{
    try {
        console.log(req.body)
        user = await loginRequest(req.body)
        if(!user) {
            return res.render('index', {
                message: "Invalid Login!!"
            })
        } 
    } catch(e) {
        console.log(e)
    }
    
})

module.exports = router