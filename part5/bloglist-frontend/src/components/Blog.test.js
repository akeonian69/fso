import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title, author but not url and likes', () => {
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  }

  render(<Blog blog={blog} likeBlog={() => {}} username="username" removeBlog={() => {}} />)

  const titleAuthor = screen.getByText('React patterns Michael Chan')
  expect(titleAuthor).toBeDefined()

  const likes = screen.queryByText('likes 7')
  expect(likes).toBeNull()

  const url = screen.queryByText( 'https://reactpatterns.com/')
  expect(url).toBeNull()
})

test('clicking the show button shows details', async () => {
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: {
      name: 'Jeff',
      username: 'Username',
      id: 'sdklafjasfywef'
    }
  }

  render(<Blog blog={blog} likeBlog={() => {}} username="username" removeBlog={() => {}} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const likes = screen.getByText('likes 7')
  expect(likes).toBeDefined()
  const url = screen.getByText('https://reactpatterns.com/')
  expect(url).toBeDefined()
})

test('clicking the like button calls the likeBlog event', async () => {
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: {
      name: 'Jeff',
      username: 'Username',
      id: 'sdklafjasfywef'
    }
  }

  const mockHandler = jest.fn()

  render(<Blog blog={blog} likeBlog={mockHandler} username="username" removeBlog={() => {}} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})