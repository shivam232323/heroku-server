const handleSignin = (data, bcrypt) => (req, res) => {
    const { email, password } = req.body;
    res.json(email,password);
    if (!email || !password) {
      return res.status(400).json('incorrect form submission');
    }
    data.select('email', 'hash').from('login')
      .where('email', '=', email)
      .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if (isValid) {
          return data.select('*').from('users')
            .where('email', '=', email)
            .then(user => {
              res.json("pass")
            })
            .catch(err => res.status(400).json('unable to get user'))
        } else {
          res.status(400).json('not Found')
        }
      })
      .catch(err => res.status(400).json('not Found'))
  }
  
  module.exports = {
    handleSignin: handleSignin
  }