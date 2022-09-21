import { useState } from 'react'
import blogService from '../services/blogs'
import { emptyPopup, popupClasses } from './Notification'

const NewBlog = ({ blogs, setBlogs, setPopupMessage }) => {
  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = { author, title, url }

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setAuthor('')
        setTitle('')
        setUrl('')
        setPopupMessage({ message: `Successfully added blog ${title} by ${author}`, className: popupClasses.success })
        setTimeout(() => {
          setPopupMessage(emptyPopup)
        }, 5000)
      })
      .catch(error => {
        setPopupMessage({ message: `There was a problem adding a blog: ${error}`, className: popupClasses.error })
        setTimeout(() => {
          setPopupMessage(emptyPopup)
        }, 5000)
      })
  }

  return (
    <div>
      <h2>Add a new post</h2>
      <form onSubmit={addBlog}>
        <div>
          Title: <input
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          Author: <input
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          URL: <input
            type="text"
            value={url}
            name="URL"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default NewBlog
