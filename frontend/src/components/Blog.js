import { useState } from 'react'
import blogService from '../services/blogs'
import { emptyPopup, popupClasses } from './Notification'
import Button from './Button'

const Blog = ({
  blog,
  user,
  setPopupMessage,
  blogs,
  setBlogs,
  blogLikes,
  setBlogLikes
}) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [isShown, setIsShown] = useState({})
  let buttonText
  let isVisible
  let blogDetails

  const likeBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      author: blog.author,
      title: blog.title,
      url: blog.url,
      likes: blogLikes[blog.id] + 1
    }

    try {
      const response = await blogService.put(blog.id, blogObject)

      setPopupMessage({ message: `Liked ${blog.title} blog`, className: popupClasses.success })
      setTimeout(() => {
        setPopupMessage(emptyPopup)
      }, 5000)
      setBlogLikes({
        ...blogLikes,
        [blog.id]: response.likes
      })
    } catch (error) {
      setPopupMessage({ message: `Failed to like ${blog.title} blog: ${error}`, className: popupClasses.error })
      setTimeout(() => {
        setPopupMessage(emptyPopup)
      }, 5000)
    }
  }

  const deleteBlog = async (event) => {
    event.preventDefault()
    if (window.confirm(`You really want to delete ${blog.title}?`)) {
      try {
        await blogService.deleteBlog(blog.id)
        setBlogs(blogs.filter(x => x.id !== blog.id))
        setPopupMessage({ message: `Deleted ${blog.title} blog`, className: popupClasses.success })
        setTimeout(() => {
          setPopupMessage(emptyPopup)
        }, 5000)
      } catch (error) {
        setPopupMessage({ message: `Failed to delete ${blog.title} blog: ${error}`, className: popupClasses.error })
        setTimeout(() => {
          setPopupMessage(emptyPopup)
        }, 5000)
      }
    }
  }

  const showDetails = (id, setState) => {
    setIsShown({
      ...isShown,
      [id]: setState
    })
  }

  if (isShown[blog.id]) {
    buttonText = 'hide'
    isVisible = false

    blogDetails = (
      <div>
        <p>URL: {blog.url}</p>
        <p>Likes: {blogLikes[blog.id]} <Button clickHandler={likeBlog} buttonText='like' /></p>
        <p>Author: {blog.author} </p>
        {((user.id === blog.user.id) ? true : false) && <button onClick={deleteBlog}>delete</button>}
      </div>
    )
  } else {
    buttonText = 'view details'
    isVisible = true
    blogDetails = null
  }

  return (
    <div style={blogStyle}>
      {blog.title} <button onClick={() => showDetails(blog.id, isVisible)}>{buttonText}</button>
      {blogDetails}
    </div>
  )
}

export default Blog
