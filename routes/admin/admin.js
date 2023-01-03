var express = require('express');
var router = express.Router();
const db = require('../../config/connection')
var objectId = require('mongodb').ObjectId  
const bcrypt = require('bcrypt')

/* GET home page. */
router.get('/', async(req, res)=> {
  if (req.session.user) {
    res.redirect('/user')
  }else if(req.session.admin){
    let users = await db.conn().collection('user').find({'role':'user'}).sort({createdAt:-1}).toArray()
    res.render('admin/home', { title: 'Admin Home',users:users });
  } else {
    res.render('login', { title: 'Login' });
  }
});

router.post('/addUser',async (req, res) => {
  try{
    var datetime = new Date();
    let image = req.files.profileImage
    req.body.image = image.name
    req.body.role  = 'user'
    req.body.createdAt = datetime
    req.body.status = '1'
    req.body.password = await bcrypt.hash(req.body.password,10)

    image.mv('./public/images/profile-images/'+image.name)
    let checkUser = await db.conn().collection("user").find({email:req.body.email}).toArray()
    if(checkUser != ''){
      // res.render('admin/home', { error: 'Email already taken !!!' });
      let users = await db.conn().collection('user').find({'role':'user'}).sort({createdAt:-1}).toArray()
      res.render('admin/home', { title: 'Admin Home',users:users,error: 'Email already taken !!!' });
    }else{
      let addUser = await db.conn().collection("user").insertOne(req.body)
      const msg = "User added successfully"
      const url = require('url');   
      res.redirect('/admin');
    }
  }catch (e) {
    console.log(e)
    return e
  }
})

router.get('/delete-user/:id',async(req,res)=>{
  try{
    let userId = req.params.id
    let deleteUser = await db.conn().collection('user').deleteOne({_id:objectId(userId)})
    res.redirect('/admin')
  }catch(e){
    console.log(e)
    return e
  }
})

router.get('/edit-user/:id',async(req,res)=>{
  try{
    if(req.session.admin){
      let userId = req.params.id
      let userDetails = await db.conn().collection('user').findOne({_id:objectId(userId)})
      res.render('admin/edit-user',{title:'Edit User', user:userDetails})
    }
  }catch(e){
    return e
  }
  
})

router.post('/update-user/:id',async(req,res)=>{
  try{
    if(req.session.admin){
      let userId = req.params.id
      let imageName =''
      if(req.files){
         imageName = req.files.profileImage.name
      }else{
         imageName = req.body.profileImage
      }
      let updateUser = await db.conn().collection('user')
      .updateOne({_id:objectId(userId)},
        {$set:{
          first_name:req.body.first_name,
          last_name:req.body.last_name,
          email:req.body.email,
          phone:req.body.phone,
          image:imageName,
        }
      })
      res.redirect('/admin')
    }
  }catch(e){
      console.log(e)
      return e
    }
})

router.get('/logout', function (req, res, next) {
  req.session.destroy()
  res.redirect('/login');
});
module.exports = router;
