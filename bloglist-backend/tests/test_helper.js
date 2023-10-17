const User = require('../models/user')
const bcrypt = require('bcrypt')

const saveUser = async user => {
  console.log(`Saving user ${user.name}`)
  const { username, name, password } = user

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const userToSave = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await userToSave.save()
  return savedUser
}

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'Backend lisää minulle likes kentän.',
    author: 'Elias',
    url: 'www.url.fi',
  },
]

const initialUsers = [
  {
    username: 'eliastuh',
    name: 'Elias Tuhola',
    password: 'salasana1234'
  },
  {
    username: 'distra',
    name: 'Ester Distra',
    password: 'password1234'
  }
]

module.exports = {
  initialBlogs,
  initialUsers,
  saveUser
}