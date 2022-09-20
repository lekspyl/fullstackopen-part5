const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, x) => sum + x.likes, 0)
}

const favoriteBlog = (blogs) => {
  const mostLikedBlogPost = blogs.find(x => x.likes === Math.max(...blogs.map(x => x.likes)))
  return {
    title: mostLikedBlogPost.title,
    author: mostLikedBlogPost.author,
    likes: mostLikedBlogPost.likes
  }
}

const mostBlogs = (blogs) => {
  const groupedByAuthor = _.groupBy(blogs, 'author')
  for (const author in groupedByAuthor) {
    let mostPostingAuthor = ''
    let amountOfPosts = 0
    if (groupedByAuthor[author].length > amountOfPosts) {
      mostPostingAuthor = author
      amountOfPosts = groupedByAuthor[author].length
    }
    return { author: mostPostingAuthor, blogs: amountOfPosts }
  }
}

const mostLikes = (blogs) => {
  const groupedByAuthor = _.groupBy(blogs, 'author')
  let mostLikedAuthorName = ''
  let mostLikedAuthorLikes = 0
  for (const author in groupedByAuthor) {
    const totalLikes = groupedByAuthor[author].reduce((sum, x) => sum + x.likes, 0)
    if (totalLikes > mostLikedAuthorLikes) {
      mostLikedAuthorName = author
      mostLikedAuthorLikes = totalLikes
    }
  }
  return { author: mostLikedAuthorName, likes: mostLikedAuthorLikes }
}
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
