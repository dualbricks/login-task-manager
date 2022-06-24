const express = require('express')
// require('../db/mongoose')
const User = require('../db/models/user')
const auth = require('../middleware/auth')
const router = new express.Router()
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail, sendCancellationEmail} = require('../emails/accounts')


// Sign Up
router.post('/users', async (req,res)=>{
    const user = User(req.body)
    console.log(user)
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch(e){
        console.log(e)
        res.status(400).send(e)
    }
})
// Login 
router.post('/users/login', async (req, res)=>{
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch(e) {
        res.status(400).send("Invalid login")
    }

})
// Logout
router.post('/users/logout', auth, async (req, res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch(e) {
        console.log(e)
        res.status(500).send()
        
    }
})
// LogOut from all
router.post('/users/logoutAll', auth, async (req, res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()     
    } catch(e) {
        res.status(500).send()
    }
})
// Upload

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req,file, cb) {
        if(!file.originalname.match(/\.(jpg| jpeg| png)$/)) {
            return cb(new Error('File must be an image'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar',auth, upload.single('avatar'), async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next)=>{
    res.status(400).send({
        error: error.message
    })
})
// profile
router.get('/users/me', auth, async(req, res)=>{
    res.send({user: req.user, token: req.token})
})

// update details
router.patch('/users/me', auth,  async (req, res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send("Invalid Updates")
    }

    try{
        const user = req.user
        console.log(user)
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.send(user)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)

    }
})
// Delete User
router.delete('/users/me', auth, async (req, res)=>{
    try{
        await req.user.remove()
        sendCancellationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch(e) {
        console.log(e)
        res.status(500).send()

    }
})

// Delete avatar
router.delete('/users/me/avatar', auth, async (req, res)=>{
    try{
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(400).send()
    }
    
})

//Get image

router.get('users/:id/avatar',async(req, res)=>{
    try {
        const user = await User.findById(req.params.id.trim())
        
        if(!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch(e) {
        res.status(404).send()
    }
})

module.exports = router