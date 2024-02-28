import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Toggelable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import { useDispatch, useSelector } from 'react-redux'
import { showErrorNotification } from './reducers/errorNotificationReducer'
import { setUser, removeUser } from './reducers/userReducer'
import usersService from './services/users'
import { Routes, Route, Link, useMatch } from 'react-router-dom'
import {
  initializeBlogs,
  createBlog,
  likeBlog,
  removeBlog,
  postComment,
} from './reducers/blogReducer'

const NavigationMenu = (props) => {
  const { user, onLogout } = props
  if (!user) {
    return null
  }
  const padding = {
    padding: 5,
  }
  return (
    <div>
      <p>
        <Link style={padding} to="/">
          blogs
        </Link>
        <Link style={padding} to="/users">
          users
        </Link>
        {user.name} logged in <button onClick={onLogout}>logout</button>
      </p>
    </div>
  )
}

const BlogPost = (props) => {
  const { blog } = props
  const dispatch = useDispatch()
  if (!blog) {
    return null
  }
  const handleComment = async (event) => {
    const comment = {
      text: event.target.comment.value,
    }
    dispatch(postComment(blog, comment))
  }
  return (
    <div>
      <h2>{blog.title}</h2>
      <Link to={blog.url}>{blog.url}</Link>
      <p>
        {blog.likes} likes
        <button onClick={() => dispatch(likeBlog(blog))}>like</button>
      </p>
      <p>added by {blog.author}</p>
      <p>
        <strong>comments</strong>
      </p>
      <form onSubmit={handleComment}>
        <input name="comment" type="text" />
        <button>add comment</button>
      </form>
      <ul>
        {blog.comments &&
          blog.comments.map((c) => <li key={c.id}>{c.text}</li>)}
      </ul>
    </div>
  )
}
const User = (props) => {
  const { user } = props
  if (!user) {
    return null
  }
  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((b) => (
          <li key={b.id}>{b.title}</li>
        ))}
      </ul>
    </div>
  )
}
const Users = (props) => {
  const { users } = props
  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
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
  const [users, setUsers] = useState([])
  const dispatch = useDispatch()
  const userMatch = useMatch('/users/:id')
  const blogMatch = useMatch('/blogs/:id')

  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const data = await usersService.getAll()
      setUsers(data)
    }
    fetchData()
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

  const matchedUser = userMatch
    ? users.find((u) => u.id === userMatch.params.id)
    : null
  const matchedBlog = blogMatch
    ? blogs.find((b) => b.id === blogMatch.params.id)
    : null
  const sortedBlogs = blogs.slice().sort((b1, b2) => b2.likes - b1.likes)

  const home = () => {
    return (
      <>
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
      </>
    )
  }
  return (
    <div>
      <NavigationMenu user={user} onLogout={handleLogout} />
      <h2>blogs</h2>
      <Notification />
      <ErrorNotification />
      <Routes>
        <Route path="/users/:id" element={<User user={matchedUser} />} />
        <Route path="/blogs/:id" element={<BlogPost blog={matchedBlog} />} />
        <Route path="/users" element={<Users users={users} />} />
        <Route path="/" element={home()} />
      </Routes>
    </div>
  )
}

export default App
