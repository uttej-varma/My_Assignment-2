const express = require("express");
const { body, validationResult } = require('express-validator');
const bodyParser = require('body-parser');
const User = require("../My_Assignment-2/models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = "RESTAPI";

const router = express.Router();
router.use(bodyParser.json());


router.post("/register", 
    body('email').isEmail(),
  
    body('password').isLength({ min: 5, max: 12 }),
    body("name").isAlpha(), async (req, res) => {

        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
          
            const { name, email, password } = req.body;

            const user = await User.findOne({ email });
            if (user) {
                return res.status(409).json({
                    status: "Failed",
                    message: "User already exists"
                });
            }
           
            bcrypt.hash(password, 10, async function (err, hash) {
                
                if (err) {
                    return res.status(500).json({
                        status: "Failed",
                        message: err.message
                    })
                }
                const data = await User.create({
                    name,
                    email,
                    password: hash
                });
                return res.status(200).json({
                    status: "Success",
                    message: "User successfuully registerd",
                    data
                })
            });
        } catch (e) {
            return res.status(500).json({
                status: "Failed",
                message: "Registration =unsuccessful"
            })
        }
    });


router.post("/login",
    body('email').isEmail(), async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
      
            const { name, email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({
                    status: "Failed",
                    message: "Unnown user/ User is not registered"
                })
            }
           
            bcrypt.compare(password, user.password, function (err, result) {
              
                if (err) {
                    return res.status(500).json({
                        status: "Failed",
                        message: err.message
                    })
                }
                if (result) {
                    const token = jwt.sign({
                        exp: Math.floor(Date.now() / 1000) + (60 * 60),
                        data: user._id
                      }, secret);

                    return res.status(200).json({
                        status: "Succces",
                        message: "Login successful",
                        token
                    })
                } else {
                    return res.status(400).json({
                        status: "Failed",
                        message: "Invalid credentails"
                    })
                }
            });


        } catch (e) {
            return res.status(500).json({
                status: "Failed",
                message: e.message
            })
        }
        
    });
module.exports = router;