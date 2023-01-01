const express = require('express');
const Model = require('../models/model');
const router = express.Router()



router.post('/postnotes', async (req, res) => {
    const data = new Model({
        
        userid: req.body.userid,
        text: req.body.text
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})



router.post('/getallnotes', async (req, res) => {
    try{
        const data = await Model.find({userid: req.body.userid});
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})



router.post('/delete', async (req, res) => {
    try {
        const id = req.body.id;
        const data = await Model.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router;