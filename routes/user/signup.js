const express = require('express');
const router = express.Router();
const db = require('../../config/connection')
const bcrypt = require('bcrypt')

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('user/signup', { title: 'Sign Up' });
});

router.post('/submit', async (req, res) => {
    try{
        var datetime = new Date();
        req.body.password = await bcrypt.hash(req.body.password, 10)
        let image = req.files.profile_pic
        req.body.role = 'user'
        req.body.createdAt = datetime
        req.body.status = '1'
        req.body.image = image.name
        image.mv('./public/images/profile-images/'+image.name)
        let checkUser = await db.conn().collection("user").find({email:req.body.email}).toArray()
        if(checkUser != ''){
            res.render('user/signup', { error: 'Email already taken !!!' });
        }
        else{
            let addUser = await db.conn().collection("user").insertOne(req.body)
            if (addUser)
                res.redirect('/login')
        }
    }catch(e){
        console.log(e)
        return e
    }
})



module.exports = router;
