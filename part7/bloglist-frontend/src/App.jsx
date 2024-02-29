import { useState, useEffect, useRef } from 'react'
import Users from './components/Users'
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
import {
  Container,
  Table,
  TableBody,
  TableContainer,
  Paper,
  Alert,
  TextField,
  Button,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material'

const NavigationMenu = (props) => {
  const { user, onLogout } = props
  if (!user) {
    return null
  }
  const padding = {
    padding: 5,
  }
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu"></IconButton>
        <Button color="inherit" component={Link} to="/">
          blogs
        </Button>
        <Button color="inherit" component={Link} to="/users">
          users
        </Button>
        {user ? (
          <em>{user.name} logged in</em>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            login
          </Button>
        )}
        <Button color="inherit" onClick={onLogout}>
          logout
        </Button>
      </Toolbar>
    </AppBar>
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
const Notification = () => {
  const message = useSelector((state) => state.notification)
  if (!message) {
    return null
  }
  return (
    <div>
      <Alert severity="success">{message}</Alert>
    </div>
  )
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
  if (!error) {
    return null
  }
  return (
    <div className="error" style={notificationStyle}>
      <Alert severity="error">{error}</Alert>
    </div>
  )
}

const LoginForm = (props) => {
  const { username, onUsernameChange, password, onPasswordChange, onSubmit } =
    props

  const margin = {
    margin: 10,
  }
  return (
    <div>
      <form onSubmit={onSubmit}>
        <div style={margin}>
          <TextField
            id="username"
            type="text"
            value={username}
            name="Username"
            label="Username"
            onChange={onUsernameChange}
          />
        </div>
        <div style={margin}>
          <TextField
            id="password"
            type="password"
            value={password}
            name="Password"
            label="Password"
            onChange={onPasswordChange}
          />
        </div>
        <div style={margin}>
          <Button variant="contained" id="login-button" type="submit">
            login
          </Button>
        </div>
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

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }
  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  if (user === null) {
    return (
      <Container>
        <h2>Log in to application</h2>
        <Notification />
        <ErrorNotification />
        <LoginForm
          username={username}
          onUsernameChange={handleUsernameChange}
          password={password}
          onPasswordChange={handlePasswordChange}
          onSubmit={handleLogin}
        />
      </Container>
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
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {sortedBlogs.map((blog) => (
                <Blog key={blog.id} blog={blog} username={user.username} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    )
  }
  return (
    <Container>
      <NavigationMenu user={user} onLogout={handleLogout} />
      <h1>Blogs</h1>
      <Notification />
      <ErrorNotification />
      <Routes>
        <Route path="/users/:id" element={<User user={matchedUser} />} />
        <Route path="/blogs/:id" element={<BlogPost blog={matchedBlog} />} />
        <Route path="/users" element={<Users users={users} />} />
        <Route path="/" element={home()} />
      </Routes>
    </Container>
  )
}

export default App
