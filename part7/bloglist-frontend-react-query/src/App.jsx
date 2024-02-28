import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Toggelable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  useNotificationValue,
  useNotificationDispatch,
} from './NotificationContext'
import {
  useErrorNotificationValue,
  useErrorNotificationDispatch,
} from './ErrorNotificationContext'
import { useUserValue, useUserDispatch } from './UserContext'

const Notification = () => {
  const message = useNotificationValue()
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
  const error = useErrorNotificationValue()
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
  const queryClient = useQueryClient()

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogService.getAll(),
  })

  const newBlogMutation = useMutation({
    mutationFn: (blog) => blogService.create(blog),
    onSuccess: (blog) => {
      showMessage(`a new blog ${blog.title} added`)
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
    onError: (error) => {
      console.error(error)
      showErrorMessage(error.message)
    },
  })
  const likeBlogMutation = useMutation({
    mutationFn: (blog) => blogService.update(blog.id, blog),
    onSuccess: (blog) => {
      showMessage(`you liked ${blog.title}`)
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
    onError: (error) => {
      console.error(error)
      showErrorMessage(error.message)
    },
  })
  const removeBlogMutation = useMutation({
    mutationFn: async (blog) => {
      await blogService.remove(blog.id)
      return blog
    },
    onSuccess: (blog) => {
      showMessage(`Deleted ${blog.title}`)
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
    onError: (error) => {
      if (error.response && error.response.data) {
        showErrorMessage(error.response.data.error)
      } else {
        showErrorMessage(error.message)
      }
      console.error(error)
    },
  })
  const user = useUserValue()
  const userDispatch = useUserDispatch()
  const notificationDispatch = useNotificationDispatch()
  const errorNotificationDispatch = useErrorNotificationDispatch()
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

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
      userDispatch({ type: 'SET', payload: loggedUser })
      blogService.setToken(loggedUser.token)
    }
  }, [])

  const showMessage = (msg) => {
    notificationDispatch({ type: 'SET_MSG', payload: msg })
    setTimeout(() => {
      notificationDispatch({ type: 'RESET_MSG' })
    }, 3000)
  }
  const showErrorMessage = (errorMsg) => {
    errorNotificationDispatch({ type: 'SET_MSG', payload: errorMsg })
    setTimeout(() => {
      errorNotificationDispatch({ type: 'RESET_MSG' })
    }, 4000)
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
      userDispatch({ type: 'SET', payload: loggedUser })
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
    userDispatch({ type: 'RESET' })
  }
  const handleCreateBlog = async (blog) => {
    blogFormRef.current.toggleVisibility()
    newBlogMutation.mutate(blog)
  }
  const handleLikeBlog = async (blog) => {
    const newBlog = {
      id: blog.id,
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    }
    likeBlogMutation.mutate(newBlog)
  }
  const handleRemoveBlog = async (blog) => {
    const confirmMsg = `Remove blog ${blog.title}`
    if (window.confirm(confirmMsg)) {
      removeBlogMutation.mutate(blog)
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

  const loadedBlogs = result.isLoading ? [] : result.data
  const sortedBlogs = loadedBlogs.sort((b1, b2) => b2.likes - b1.likes)

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
