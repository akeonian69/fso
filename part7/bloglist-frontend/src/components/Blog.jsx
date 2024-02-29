import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { likeBlog, removeBlog } from '../reducers/blogReducer'
import { TableCell, TableRow } from '@mui/material'

const Blog = ({ blog, username }) => {
  const dispatch = useDispatch()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const [visible, setVisible] = useState(false)
  const handleRemoveBlog = () => {
    const confirmMsg = `Remove blog ${blog.title}`
    if (window.confirm(confirmMsg)) {
      dispatch(removeBlog(blog))
    }
  }
  const removeButton = () => {
    return <button onClick={handleRemoveBlog}>remove</button>
  }

  const details = () => {
    console.log('detailed', blog)
    return (
      <TableRow>
        <TableCell colSpan="3">
          <div>
            <p>{blog.url}</p>
            <p>
              likes {blog.likes}{' '}
              <button id="like-button" onClick={() => dispatch(likeBlog(blog))}>
                like
              </button>
            </p>
            <p>{blog.user.name}</p>
            {blog.user && username === blog.user.username && removeButton()}
          </div>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <>
      <TableRow className="blog">
        <TableCell>
          <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
        </TableCell>
        <TableCell>{blog.author}</TableCell>
        <TableCell>
          <button onClick={() => setVisible(!visible)}>
            {visible ? 'hide' : 'view'}
          </button>
        </TableCell>
      </TableRow>
      {visible && details()}
    </>
  )
}

export default Blog
