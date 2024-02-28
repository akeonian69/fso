import blogService from '../services/blogs'
import commentService from '../services/comments'
import { createSlice } from '@reduxjs/toolkit'
import { showNotification } from './notificationReducer'
import { showErrorNotification } from './errorNotificationReducer'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      return state.concat(action.payload)
    },
    updateBlog(state, action) {
      return state.map((blog) => {
        if (blog.id === action.payload.id) {
          return action.payload
        } else {
          return blog
        }
      })
    },
    deleteBlog(state, action) {
      return state.filter((blog) => blog.id !== action.payload.id)
    },
    appendComment(state, action) {
      const c = action.payload
      return state.map((b) => {
        if (b.id === c.blogId) {
          b.comments = b.comments.concat(c)
          return b
        }
        return b
      })
    },
  },
})

export const { setBlogs, appendBlog, updateBlog, deleteBlog, appendComment } =
  blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    try {
      const blogs = await blogService.getAll()
      dispatch(setBlogs(blogs))
    } catch (exception) {
      console.error('initialize Blogs error', exception)
      dispatch(showErrorNotification(exception.message))
    }
  }
}

export const createBlog = (blog) => {
  return async (dispatch) => {
    try {
      const createdBlog = await blogService.create(blog)
      dispatch(appendBlog(createdBlog))
      dispatch(showNotification(`a new blog ${blog.title} added`))
    } catch (exception) {
      console.error('createBlog error', exception)
      dispatch(showErrorNotification(exception.message))
    }
  }
}

export const likeBlog = (blog) => {
  return async (dispatch) => {
    try {
      const newBlog = {
        user: blog.user.id,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url,
      }
      const updatedBlog = await blogService.update(blog.id, newBlog)
      updatedBlog.user = blog.user
      dispatch(updateBlog(updatedBlog))

      dispatch(showNotification(`a new blog ${blog.title} added`))
    } catch (exception) {
      console.error('createBlog error', exception)
      dispatch(showErrorNotification(exception.message))
    }
  }
}

export const removeBlog = (blog) => {
  return async (dispatch) => {
    try {
      console.log('deleting blog', blog)
      const response = await blogService.remove(blog.id)
      console.log('delete response', response)
      dispatch(deleteBlog(blog))
      dispatch(showNotification(`Deleted ${blog.title}`))
    } catch (exception) {
      console.error(exception)
      if (exception.response && exception.response.data) {
        dispatch(showErrorNotification(exception.response.data.error))
      } else {
        dispatch(showErrorNotification(exception.message))
      }
    }
  }
}

export const postComment = (blog, comment) => {
  return async (dispatch) => {
    try {
      const createdComment = await commentService.create(blog.id, comment)
      dispatch(appendComment(createdComment))
    } catch (exception) {
      console.error('postComment error', exception)
      dispatch(showErrorNotification(exception.message))
    }
  }
}

export default blogSlice.reducer
