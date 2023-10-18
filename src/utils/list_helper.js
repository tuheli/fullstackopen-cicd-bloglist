const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

// eslint-disable-next-line no-unused-vars
const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  return blogs.reduce((sum, blog) => {
    return sum += blog['likes']
  }, 0)
}

const favoriteBlog = blogs => {
  if (blogs.length === 0) {
    return null
  }

  const mostLikedBlog = blogs.reduce((previous, current) => {
    return current.likes > previous.likes
      ? current
      : previous
  }, blogs[0])

  return {
    title: mostLikedBlog.title,
    author: mostLikedBlog.author,
    likes: mostLikedBlog.likes
  }
}

const mostBlogs = blogs => {
  const counter = blogs.reduce((counter, blog) => {
    if (counter[blog.author]) {
      counter[blog.author] += 1
    }
    else {
      counter[blog.author] = 1
    }
    return counter
  }, {})

  return Object.entries(counter).reduce((current, [author, blogs]) => {
    if (blogs > current.blogs) {
      current.author = author
      current.blogs = blogs
    }
    return current
  }, { author: null, blogs: 0 })
}

const mostLikes = blogs => {
  const counter = blogs.reduce((counter, blog) => {
    if (counter[blog.author]) {
      counter[blog.author] += blog.likes
    }
    else {
      counter[blog.author] = blog.likes
    }
    return counter
  }, {})

  return Object.entries(counter).reduce((current, [author, likes]) => {
    if (likes > current.likes) {
      current.author = author
      current.likes = likes
    }
    return current
  }, { author: null, likes: 0 })
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  blogs
}