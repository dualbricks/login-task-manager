const express = require('express')
// require('../db/mongoose')
const Task = require('../db/models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth,  async (req,res)=>{
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})
// GET ?completed
// GET ?limit=&skip=
// GET ?sortBy=createdAt:desc

router.get('/tasks', auth, async (req, res)=>{
    const match = {}
    const sort = {}
    if(req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1

    } 
    try {
        const user = req.user
        await user.populate({path: 'tasks', match, options:{
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort
        }})
        res.send(user.tasks)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req, res)=>{
    const _id = req.params.id.trim() 
    try {
        const task = await Task.findOne({_id, owner: req.user._id})

        if(!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch(e) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req, res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))

    if(!isValidOperation) return res.status(400).send("Invalid Update")

    const _id = req.params.id.trim()

    try {
        const task = await Task.findOne({_id, owner: req.user._id})
    
        if(!task) {
            return res.status(404).send()
        }

        updates.forEach((update)=> task[update] = req.body[update])
        await task.save()
        //const task  = await Task.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true})

        res.send(task)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res)=>{
    try{
        const task = await Task.findOneAndDelete({_id: req.params.id.trim(), owner: req.user._id})

        if(!task) return res.status(404).send()

        res.send(task)

    } catch(e) {
        res.status(400).send()
    }
})

module.exports = router