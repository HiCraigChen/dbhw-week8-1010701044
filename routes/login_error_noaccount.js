var express = require('express');
var router = express.Router();
var Member = require('../models/Member');
var Article = require('../models/Article');
var async = require('async');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login_error_noaccount', {
    member : null
  });
});

//members test
router.get('/members/:memberId', function(req, res) {
  Member.get(req.params.memberId, function(err, member) {
    if(err) {
      res.status(err.code);
      res.json(err);
    } else {
      res.json(member);
    }
  })

});

router.post('/', function(req, res, next) {

  //首先必須先產生出一個Member的物件在進行save
  var newMember = new Member({
    name : req.body.name,
    account : req.body.account,
    password : req.body.password
  });

  var member;

  var db = require('../libs/db');
  db.select()
    .from('member')
    .where({
      account : newMember.account
    })
    .map(function(row) {
      //將select出來的資料轉換成Member物件
      //如果沒有此account的method
      member = new Member(row);
    })
    .map(function(){
      if(member.password==newMember.password && member.name == newMember.name){
        req.session.member = newMember;
        res.redirect('/');
      }else{
        res.redirect('/login_error_mistake');
      }
    })
    .then(function(){
      if(member===undefined){
      res.redirect('/login_error_noaccount');
      };
    }); 
});


router.post('/logout', function(req, res, next) {
  req.session.member = null;
  res.redirect('/');
});


module.exports = router;
