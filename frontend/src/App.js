import { useState, useEffect } from 'react'
import Notification, { emptyPopup, popupClasses } from './components/Notification'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import NewBlog from './components/NewBlog'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [popupMessage, setPopupMessage] = useState(emptyPopup)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogout = async => {
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
          <NewBlog blogs={blogs} setBlogs={setBlogs} setPopupMessage={setPopupMessage} />
          <h2>Blogs</h2>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      }

    </div>
  )
}

export default App
