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
          id='blog-title'
          type="text"
          value={title}
          name="title"
          placeholder='write blog title here'
          onChange={event => setTitle(event.target.value)} />
      </div>
      <div>
        author:
        <input
          id='blog-author'
          type="text"
          value={author}
          name="author"
          placeholder='write blog author here'
          onChange={event => setAuthor(event.target.value)} />
      </div>
      <div>
        url:
        <input
          id='blog-url'
          type="text"
          value={url}
          name="url"
          placeholder='write blog url here'
          onChange={event => setUrl(event.target.value)} />
      </div>
      <button id='create-blog-button' type="submit">create</button>
    </form>
  </>
}

BlogForm.PropTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm