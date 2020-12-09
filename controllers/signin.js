const handleSignin = (db, bcrypt) => (req, res) => {
    let email  = req.body.email;
    let password = req.body.password;
    res.json('pa',req.body)
    db.select('email', 'hash').from('login')
      .where('email', '=', email)
      .then(data => {
        const isValid = bcrypt.compare(password, data[0].hash);
        if (isValid) {
          return db.select('*').from('users')
            .where('email', '=', email)
            .then(user => {
              res.json("pass")
            })
            .catch(err => res.status(400).json('unable to get user'))
        } else {
          res.status(400).json('not Foundh')
        }
      })
      .catch(err => res.status(400).json('not Found'))
  }
  
  module.exports = {
    handleSignin: handleSignin
  }