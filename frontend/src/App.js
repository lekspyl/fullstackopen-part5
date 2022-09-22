import { useState, useEffect, useRef } from 'react'
import Notification, { emptyPopup, popupClasses } from './components/Notification'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import NewBlog from './components/NewBlog'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [blogLikes, setBlogLikes] = useState({})

  const [popupMessage, setPopupMessage] = useState(emptyPopup)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs)
      let fullBlogLikes = {}
      for (const blog of blogs) {
        fullBlogLikes[blog.id] = blog.likes
      }
      setBlogLikes(fullBlogLikes)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setPopupMessage({ message: 'Successfully logged out', className: popupClasses.success })
    setTimeout(() => {
      setPopupMessage(emptyPopup)
    }, 5000)
  }

  return (
    <div>
      <Notification message={popupMessage.message} className={popupMessage.className} />
      {user === null ?
        <LoginForm
          setUser={setUser}
          setUsername={setUsername}
          setPassword={setPassword}
          setPopupMessage={setPopupMessage}
          username={username}
          password={password}
        /> :
        <div>
          <p>Logged-in as {user.name}. <button onClick={handleLogout}>Logout</button></p>
          <Togglable buttonLabel='new note' ref={blogFormRef}>
            <NewBlog blogs={blogs} setBlogs={setBlogs} setPopupMessage={setPopupMessage} blogFormRef={blogFormRef} />
          </Togglable>
          <h2>Blogs</h2>
          {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              user={user}
              setPopupMessage={setPopupMessage}
              blogs={blogs}
              setBlogs={setBlogs}
              blogLikes={blogLikes}
              setBlogLikes={setBlogLikes}
            />
          )}
        </div>
      }

    </div>
  )
}

export default App
