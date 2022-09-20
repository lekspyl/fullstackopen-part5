const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

const getToken = async () => {
  const login = await api.post('/api/login')
  .send({
    username: helper.initialUsers[0].username,
    password: 'testPass1'
  })

  return login.body.token
}

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  for (let blogPost of helper.initialBlogPosts) {
    let blogPostObject = new Blog(blogPost)
    await blogPostObject.save()
  }

  for (let user of helper.initialUsers) {
    let userObj = new User(user)
    await userObj.save()
  }
})

// TODO: Add unhappy paths (unauthorized user, not authorized to perform delete etc.)

describe('generic tests', () => {
  test('blog posts are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

describe('create', () => {
  test('blog post is submitted', async () => {
    const newBlogPost = {
      author: 'Willy Wonka',
      url: 'https://goatse.cx',
      title: 'A tour around the Chocolate Factory',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlogPost)
      .set('Authorization', `Bearer ${await getToken()}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogPostsAtEnd = await helper.blogPostsInDb()
    expect(blogPostsAtEnd).toHaveLength(helper.initialBlogPosts.length + 1)

    const posts = blogPostsAtEnd.map(x => x.title)
    expect(posts).toContain(
      'A tour around the Chocolate Factory'
    )
  })

  test('likes propery set to 0 if not defined', async () => {
    const newBlogPost = {
      author: 'Willy Wonka',
      url: 'https://goatse.cx',
      title: 'A tour around the Chocolate Factory',
    }

    const savedBlogPost = await api
      .post('/api/blogs')
      .send(newBlogPost)
      .set('Authorization', `Bearer ${await getToken()}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(+savedBlogPost.body.likes).toBe(0)
  })

  test('post is not saved if url or title are not provided', async () => {
    await api
      .post('/api/blogs')
      .send({ author: 'Willy Wonka' })
      .set('Authorization', `Bearer ${await getToken()}`)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})

describe('read', () => {
  test('all blog posts are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogPosts.length)
  })

  test('name of ID property is correct', async () => {
    const response = await api.get(`/api/blogs/${helper.initialBlogPosts[0]._id}`)
    expect(response.body.id).toBeDefined()
  })
})

describe('delete', () => {
  test('post can be deleted', async () => {
    await api
      .delete(`/api/blogs/${helper.initialBlogPosts[0]._id}`)
      .set('Authorization', `Bearer ${await getToken()}`)
      .expect(204)
  })

  test('post can be only deleted by a user who created it', async () => {
    await api
      .delete(`/api/blogs/${helper.initialBlogPosts[2]._id}`)
      .set('Authorization', `Bearer ${await getToken()}`)
      .expect(403)
  })

  test('post cannot be deleted without authorization', async () => {
    await api
      .delete(`/api/blogs/${helper.initialBlogPosts[2]._id}`)
      .expect(401)
  })
})

describe('put', () => {
  test('likes are updated', async () => {
    const response = await api
      .put(`/api/blogs/${helper.initialBlogPosts[0]._id}`)
      .send({ likes: 100 })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toBe(100)
  })
})
