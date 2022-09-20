const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogPosts = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Test User 1',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    user: '632772da6c0022e9d02960ac',
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f9',
    title: 'Another Useless Blog Post',
    author: 'Test User 1',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/lorem.html',
    likes: 7,
    user: '632772da6c0022e9d02960ac',
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f0',
    title: 'I am beautiful',
    author: 'Test User 2',
    url: 'http://lekspyl.com',
    likes: 4,
    user: '632773e4ee42a926814db985',
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f1',
    title: 'How to be a pig',
    author: 'Test User 2',
    url: 'http://pepe-the-pig.com/how-to-be-a-pig.html',
    likes: 1,
    user: '632773e4ee42a926814db985',
    __v: 0
  }
]

const initialUsers = [
  {
    _id: '632772da6c0022e9d02960ac',
    username: 'testUser1',
    name: 'Test User 1',
    passwordHash: '$2b$10$avRVcvz591c.IFQ69FusyO4WLLEQ7thkZvnib0Uysw0kHSLSG6VcG',
    blogs: [
      '5a422aa71b54a676234d17f8',
      '5a422aa71b54a676234d17f9'
    ],
    __v: 0
  },
  {
    _id: '632773e4ee42a926814db985',
    username: 'testUser2',
    name: 'Test User 2',
    passwordHash: '$2b$10$cuhFx78r1pVLHsvibZt7MOIcGPKyyyUWuzWPQ2hgL2oQmowK.qbu.',
    blogs: [
      '5a422aa71b54a676234d17f0',
      '5a422aa71b54a676234d17f1'
    ],
    __v: 0
  }
]

const nonExistingId = async () => {
  const blogPost = new Blog({
    title: 'willremovethissoon',
    author: 'doesntmatter',
    url: 'about://blank',
    likes: 0
  })
  await blogPost.save()
  await blogPost.remove()

  return blogPost._id.toString()
}

const blogPostsInDb = async () => {
  const blogPosts = await Blog.find({})
  return blogPosts.map(blogPost => blogPost.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogPosts,
  initialUsers,
  nonExistingId,
  blogPostsInDb,
  usersInDb
}
