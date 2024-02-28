import axios from 'axios'

const getBaseUrl = (blogId) => `/api/blogs//${blogId}/comments`

const getAll = async (blogId) => {
  const response = await axios.get(getBaseUrl(blogId))
  return response.data
}

const create = async (blogId, newBlog) => {
  const response = await axios.post(getBaseUrl(blogId), newBlog)
  return response.data
}

export default { getAll, create }
