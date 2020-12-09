const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var knex = require('knex');
const signin = require('./controllers/signin');

const data =knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
   
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

app.post('/signin', signin.handleSignin(data, bcrypt));

app.listen(process.env.PORT || 8080 ,() => {
  console.log(`app is running on ${process.env.PORT}`)});