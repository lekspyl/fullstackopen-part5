const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const blogPosts = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
  return response.json(blogPosts)
})

blogRouter.get('/:id', async (request, response) => {
  const blogPost = await Blog.findById(request.params.id)
  if (blogPost) {
    response.json(blogPost)
  } else {
    response.status(404).end()
  }
})

blogRouter.post('/', [middleware.tokenExtractor, middleware.userExtractor], async (request, response) => {
  if (!request.body.title || !request.body.url) {
    return response.status(400).json({ error: 'title and url must be provided'})
  }

  const blog = new Blog({
    ...request.body,
    user: request.user._id.toString()
  })

  const savedBlogPost = await blog.save()
  request.user.blogs = request.user.blogs.concat(savedBlogPost._id)
  await request.user.save()

  response.status(201).json(savedBlogPost)
})

blogRouter.put('/:id', [middleware.tokenExtractor, middleware.userExtractor], async (request, response) => {
  if (!request.body.title || !request.body.url || !request.body.author || !request.body.likes) {
    return response.status(400).json({ error: 'title, author, url and likes must be provided'})
  }

  const body = request.body

  const updatedBlogPostObject = {
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes
  }
  const updatedBlogPost = await Blog.findByIdAndUpdate(request.params.id, updatedBlogPostObject, { new: true })

  return response.status(200).json(updatedBlogPost)
})

blogRouter.delete('/:id',[middleware.tokenExtractor, middleware.userExtractor], async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if ( blog.user.toString() === request.user._id.toString() ) {
    await Blog.findByIdAndRemove(request.params.id)
    request.user.blogs = request.user.blogs.pop(request.params.id)
    await request.user.save()
    response.status(204).end()
  } else {
    response.status(403).json({
      error: `user ${user.username.toString()} does not have sufficient rights to delete post with ID ${request.params.id}`
    })
  }
})

module.exports = blogRouter
