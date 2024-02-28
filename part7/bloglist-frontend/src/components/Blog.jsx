import { useState } from 'react'

const Blog = ({ blog, likeBlog, username, removeBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const [visible, setVisible] = useState(false)
  const removeButton = () => {
    return <button onClick={() => removeBlog(blog)}>remove</button>
  }

  const details = () => {
    console.log('detailed', blog)
    return (
      <>
        <p>{blog.url}</p>
        <p>
          likes {blog.likes}{' '}
          <button id="like-button" onClick={() => likeBlog(blog)}>
            like
          </button>
        </p>
        <p>{blog.user.name}</p>
        {blog.user && username === blog.user.username && removeButton()}
      </>
    )
  }

  return (
    <div className="blog" style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={() => setVisible(!visible)}>
        {visible ? 'hide' : 'view'}
      </button>
      {visible && details()}
    </div>
  )
}

export default Blog
