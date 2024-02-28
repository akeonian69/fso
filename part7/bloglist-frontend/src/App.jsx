import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Toggelable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import { useDispatch, useSelector } from 'react-redux'
import { showErrorNotification } from './reducers/errorNotificationReducer'
import { setUser, removeUser } from './reducers/userReducer'
import {
  initializeBlogs,
  createBlog,
  likeBlog,
  removeBlog,
} from './reducers/blogReducer'

const Notification = () => {
  const message = useSelector((state) => state.notification)
  const notificationStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }
  if (message) {
    return <div style={notificationStyle}>{message}</div>
  }
  return null
}

const ErrorNotification = () => {
  const error = useSelector((state) => state.errorNotification)
  const notificationStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }
  if (error) {
    return (
      <div className="error" style={notificationStyle}>
        {error}
      </div>
    )
  }
  return null
}

const LoginForm = (props) => {
  const { username, onUsernameChange, password, onPasswordChange, onSubmit } =
    props
  return (
    <div>
      <form onSubmit={onSubmit}>
        <div>
          username
          <input
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={onUsernameChange}
          />
        </div>
        <div>
          password
          <input
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={onPasswordChange}
          />
        </div>
        <button id="login-button" type="submit">
          login
        </button>
      </form>
    </div>
  )
}

const App = () => {
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistAppUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      dispatch(setUser(loggedUser))
      blogService.setToken(loggedUser.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const credentials = { username, password }
      const loggedUser = await loginService.login(credentials)
      console.log('user', loggedUser)

      window.localStorage.setItem(
        'loggedBloglistAppUser',
        JSON.stringify(loggedUser)
      )

      blogService.setToken(loggedUser.token)
      dispatch(setUser(loggedUser))
      setUsername('')
      setPassword('')
    } catch (exception) {
      if (exception.response && exception.response.data) {
        dispatch(showErrorNotification(exception.response.data.error))
      } else {
        dispatch(showErrorNotification(exception.message))
      }
      console.error(exception)
    }
  }
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistAppUser')
    dispatch(removeUser())
  }
  const handleCreateBlog = async (blog) => {
    dispatch(createBlog(blog))
    blogFormRef.current.toggleVisibility()
  }

  const handleLikeBlog = async (blog) => {
    dispatch(likeBlog(blog))
  }
  const handleRemoveBlog = async (blog) => {
    const confirmMsg = `Remove blog ${blog.title}`
    if (window.confirm(confirmMsg)) {
      dispatch(removeBlog(blog))
    }
  }

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }
  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification />
        <ErrorNotification />
        <LoginForm
          username={username}
          onUsernameChange={handleUsernameChange}
          password={password}
          onPasswordChange={handlePasswordChange}
          onSubmit={handleLogin}
        />
      </div>
    )
  }

  const sortedBlogs = blogs // blogs.sort((b1, b2) => b2.likes - b1.likes)

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <ErrorNotification />
      {user && (
        <div>
          <p>
            {user.name} logged in
            <button onClick={handleLogout}>logout</button>
          </p>
        </div>
      )}
      <Toggelable buttonLabel="create" ref={blogFormRef}>
        <BlogForm createBlog={handleCreateBlog} />
      </Toggelable>
      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          likeBlog={handleLikeBlog}
          username={user.username}
          removeBlog={handleRemoveBlog}
        />
      ))}
    </div>
  )
}

export default App
