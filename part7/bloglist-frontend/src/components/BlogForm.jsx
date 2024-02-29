import { useState } from 'react'
import PropTypes from 'prop-types'
import { TextField, Button } from '@mui/material'

const BlogForm = (props) => {
  const { createBlog } = props

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const margin = {
    margin: 5,
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }
  return (
    <>
      <h2>Create New</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            id="blog-title"
            type="text"
            value={title}
            name="title"
            label="Title"
            placeholder="write blog title here"
            onChange={(event) => setTitle(event.target.value)}
            style={margin}
          />
        </div>
        <div>
          <TextField
            id="blog-author"
            type="text"
            value={author}
            name="author"
            label="Author"
            placeholder="write blog author here"
            onChange={(event) => setAuthor(event.target.value)}
            style={margin}
          />
        </div>
        <div>
          <TextField
            id="blog-url"
            type="text"
            value={url}
            name="url"
            label="Url"
            placeholder="write blog url here"
            onChange={(event) => setUrl(event.target.value)}
            style={margin}
          />
        </div>
        <div>
          <Button
            id="create-blog-button"
            variant="contained"
            color="primary"
            type="submit"
            style={margin}
          >
            create
          </Button>
        </div>
      </form>
    </>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
}

export default BlogForm
