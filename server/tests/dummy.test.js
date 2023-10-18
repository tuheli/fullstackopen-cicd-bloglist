const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('in a list of blogs', () => {
    expect(listHelper
      .totalLikes(listHelper.blogs))
      .toBe(36)
  })

  test('in an empty list', () => {
    expect(listHelper
      .totalLikes([]))
      .toBe(0)
  })

  test('in a list of one blog', () => {
    const blog = {
      _id: '5a422b891b54a676234d17fa',
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
      __v: 0
    }

    expect(listHelper
      .totalLikes([blog]))
      .toBe(10)
  })
})

describe('favorite blog', () => {
  test('should be distra', () => {
    expect(listHelper
      .favoriteBlog(listHelper.blogs))
      .toEqual({
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        likes: 12
      })
  })
})

describe('most blogs', () => {
  test('should be robert martin', () => {
    expect(listHelper
      .mostBlogs(listHelper.blogs))
      .toEqual({
        author: 'Robert C. Martin',
        blogs: 3
      })
  })

  test('with empty list should be null and 0', () => {
    expect(listHelper
      .mostBlogs([]))
      .toEqual({
        author: null,
        blogs: 0
      })
  })
})

describe('most likes', () => {
  test('should be distra', () => {
    expect(listHelper
      .mostLikes(listHelper.blogs))
      .toEqual({
        author: 'Edsger W. Dijkstra',
        likes: 17
      })
  })

  test('with empty list should be null and 0', () => {
    expect(listHelper
      .mostLikes([]))
      .toEqual({
        author: null,
        likes: 0
      })
  })
})