import loginService from '../services/login'
import blogService from '../services/blogs'
import { emptyPopup, popupClasses } from './Notification'
import PropTypes from 'prop-types'

const LoginForm = ({
  setUser, setUsername, setPassword, username, password,
  setPopupMessage
}) => {
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setPopupMessage({ message: `Logged in as ${username}`, className: popupClasses.success })
      setTimeout(() => {
        setPopupMessage(emptyPopup)
      }, 5000)
    } catch (exception) {
      setPopupMessage({ message: 'Wrong credentials', className: popupClasses.error })
      setTimeout(() => {
        setPopupMessage(emptyPopup)
      }, 5000)
    }
  }
  return (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm
