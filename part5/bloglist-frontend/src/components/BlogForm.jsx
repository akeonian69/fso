import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = props => {
  const { createBlog } = props

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }
  return <>
    <h2>create new</h2>
    <form onSubmit={handleSubmit}>
      <div>
        title:
        <input
          type="text"
          value={title}
          name="title"
          onChange={event => setTitle(event.target.value)} />
      </div>
      <div>
        author:
        <input
          type="text"
          value={author}
          name="author"
          onChange={event => setAuthor(event.target.value)} />
      </div>
      <div>
        url:
        <input
          type="text"
          value={url}
          name="url"
          onChange={event => setUrl(event.target.value)} />
      </div>
      <button type="submit">create</button>
    </form>
  </>
}

BlogForm.PropTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm