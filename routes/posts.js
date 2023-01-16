const express = require("express");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const secret = "RESTAPI";
const Blog = require("../My_Assignment-2/models/blogs");

const router = express.Router();
router.use(bodyParser.json());


router.post("/posts", async (req, res) => {
    try{
        

        const blog = await Blog.create({
            title: req.body.title,
            body: req.body.body,
            user: req.user
        });

        res.json({
            status: "Success",
            blog
        })
    }catch(e){
        res.status(500).json({
            status: "Failed",
            message: e.message
        })
    }

});

router.get("/posts", async (req, res) => {
    try{
        const blogs = await Blog.find();
        res.json({
            status: "Success",
            blogs
        })

    }catch(e){
        return res.status(500).json({
            status: "Failed",
            message: e.message
        })
    }
});

router.put("/posts/:id",async(req,res)=>{
  try{
       if(req.params.id==req.user.id)
       {
        const blogs = await Blog.updateOne({_id:req.params.id},{$set:req.body});
        res.json({
            status: "Success",
            blogs
        })
       }
       else{
        res.json({
            status: "failed",
            message:"you can edit only your post"
        })
       }
  }
  catch(e){
    return res.status(500).json({
        status: "Failed",
        message: e.message
    })
}
})

router.put("/posts/:id",async(req,res)=>{
    try{
         if(req.params.id==req.user.id)
         {
          const blogs = await Blog.deleteOne({_id:req.params.id});
          res.json({
              status: "Success",
              message:"post successfully deleted"
          })
         }
         else{
          res.json({
              status: "failed",
              message:"you can delet only your post"
          })
         }
    }
    catch(e){
      return res.status(500).json({
          status: "Failed",
          message: e.message
      })
  }
  })

module.exports = router;