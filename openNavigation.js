const express = require('express');
const router = express.Router();
const {imagegeneration,mockurl,supabaseStorage} = require('./apiHelpher');

router.post("/",[],async (req,res) =>{
   const responses = await req.body["propmt"];
   console.log("have entered this");
   const data = await mockurl();
   console.log("Response has passed")
   console.log(responses);
   return res.send(data);
})

router.post('/propmt',async (req,res) =>{
    const query = await req.body['propmt'];
    console.log(query);
    const data = await imagegeneration(query)
    console.log("Data is fetched!")
    console.log(data);
    return res.send(res.json(data));
    
})

router.get('/supabaseStorage',async (req,res)=>{
    console.log("Reaching inside the routring")
    const data = await supabaseStorage();
    return res.send(data);
})

module.exports = router;