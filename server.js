const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var knex = require('knex');



const data =knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : '9029',
    database : 'smart-brain'
   
  }
});


app.use(cors());
app.use(bodyParser.json());



app.post('/register',(req ,res) => {
  const { id ,name ,email ,pass} = req.body;
  
  const hash = bcrypt.hashSync(pass, saltRounds);

  data.transaction(trx => {

    trx.insert({
      hash:hash,
      email:email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      return trx('users')
      .returning('*')
      .insert({
        name:name,
        email:loginEmail[0],
        joined: new Date()
      })
      .then( user => {
        res.json(user[0]);
      })
    })
  .then(trx.commit)
  .catch(trx.rollback)
  })
  .catch(error => res.json('UNABLE TO REGIStER!'));

});


app.post('/signin',(req,res) => {
  let count =0;
  data.select('email', 'hash').from('login')
  .where('email', '=', req.body.email)
  .then(
    value => {
      
      bcrypt.compare(req.body.password, value[0].hash, function(err, result) {
        
        if(result === true && req.body.password.length > 1)
        {
         
           res.json('pass');
           
        }

       
        
    })
     
  })
  .catch(err => res.json('not Found'))
});


app.listen('8080');