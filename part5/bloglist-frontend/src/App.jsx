import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Toggelable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = (props) => {
  const { message } = props
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

const ErrorNotification = (props) => {
  const { error } = props
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
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    const fetchData = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }
    fetchData()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistAppUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, [])

  const showMessage = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(null), 3000)
  }
  const showErrorMessage = (errorMsg) => {
    setErrorMessage(errorMsg)
    setTimeout(() => setErrorMessage(null), 4000)
  }

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
      setUser(loggedUser)
      setUsername('')
      setPassword('')
    } catch (exception) {
      if (exception.response && exception.response.data) {
        showErrorMessage(exception.response.data.error)
      } else {
        showErrorMessage(exception.message)
      }
      console.error(exception)
    }
  }
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistAppUser')
    setUser(null)
  }
  const handleCreateBlog = async (blog) => {
    try {
      blogFormRef.current.toggleVisibility()
      const createdBlog = await blogService.create(blog)
      console.log(createdBlog)
      setBlogs(blogs.concat(createdBlog))
      showMessage(`a new blog ${createdBlog.title} added`)
    } catch (exception) {
      console.error(exception)
      showErrorMessage(exception.message)
    }
  }
  const handleLikeBlog = async (blog) => {
    const newBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    }
    const updatedBlog = await blogService.update(blog.id, newBlog)
    const newBlogs = blogs.map((b) => {
      if (b.id === blog.id) {
        return updatedBlog
      }
      return b
    })
    setBlogs(newBlogs)
  }
  const handleRemoveBlog = async (blog) => {
    const confirmMsg = `Remove blog ${blog.title}`
    if (window.confirm(confirmMsg)) {
      try {
        console.log('deleting blog', blog)
        const response = await blogService.remove(blog.id)
        console.log('delete response', response)
        const newBlogs = blogs.filter((b) => b.id !== blog.id)
        setBlogs(newBlogs)
        showMessage(`Deleted ${blog.title}`)
      } catch (exception) {
        if (exception.response && exception.response.data) {
          showErrorMessage(exception.response.data.error)
        } else {
          showErrorMessage(exception.message)
        }
        console.error(exception)
      }
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
        <Notification message={message} />
        <ErrorNotification error={errorMessage} />
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

  const sortedBlogs = blogs.sort((b1, b2) => b2.likes - b1.likes)

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <ErrorNotification error={errorMessage} />
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
