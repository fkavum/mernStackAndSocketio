const router = require('express').Router();
let User = require('../models/user.model');
var jwt = require('jsonwebtoken');

require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
if(!JWT_SECRET_KEY) console.log("[WARN] secret key not exist!");

router.route('/').get(

    (req,res) => {
        User.find().then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
    }
);


router.route('/add').post(

    (req,res) => {
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        const newUser = new User({username,password,email});

        newUser.save().then(()=> res.json('User added!')).
        catch(err => res.status(400).json('Error: ' + err));
    }
)


router.route('/login').post(

  (req,res) => {
      const username = "zz23";
      const password = "asd";
      const token = jwt.sign({username: username, password: password},JWT_SECRET_KEY,{ expiresIn: '1h' });

      res.json({
        token:token
      })
  }
)


router.route('/middleWare').post(
  ensureToken,
  (req,res) => {
    jwt.verify(req.token, JWT_SECRET_KEY, (err,data) => {
      if(err){
        res.sendStatus(403).json("Error: " + err);
      }else{
        res.json({ 
          text: "protected succesfully",
          data: data
        })
      }
    })
  }
)


function ensureToken(req,res,next){
  const bearerHeader = req.headers["authorization"]; //always lowercase (its accepts when header camelcase etc.)
  if(typeof bearerHeader !== 'undefined'){
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;

    next();
  }else{
    res.sendStatus(403);
  }
}

module.exports = router;


/*
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
});

router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.JWT_KEY,
            {
                expiresIn: "1h"
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:userId", (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;




*/