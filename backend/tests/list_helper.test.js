const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const blogsList = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'Another Useless Blog Post',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/lorem.html',
      likes: 7,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f0',
      title: 'I am beautiful',
      author: 'Oleksandr A. Pylypenko',
      url: 'http://lekspyl.com',
      likes: 4,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17d0',
      title: 'I am wonderful',
      author: 'Oleksandr A. Pylypenko',
      url: 'http://lekspyl.com',
      likes: 3,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f1',
      title: 'How to be a pig',
      author: 'Peppe the Pig',
      url: 'http://pepe-the-pig.com/how-to-be-a-pig.html',
      likes: 1,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    expect(listHelper.totalLikes(blogsList)).toBe(20)
  })

  test('finds blog post with most likes', () => {
    expect(listHelper.favoriteBlog(blogsList)).toEqual({
      author: blogsList[1].author,
      title: blogsList[1].title,
      likes: blogsList[1].likes
    })
  })

  test('finds author with most blog posts', () => {
    expect(listHelper.mostBlogs(blogsList)).toEqual({ author: 'Edsger W. Dijkstra', blogs: 2 })
  })

  test('finds author with most total blog likes', () => {
    expect(listHelper.mostLikes(blogsList)).toEqual({ author: 'Edsger W. Dijkstra', likes: 12 })
  })
})
