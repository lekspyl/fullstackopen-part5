import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'Does not work anymore :(',
    author: 'Oleksandr Pylypenko',
    url: 'http://localhost:1010',
    likes: 50
  }

  render(<Blog
    id='1'
    blog={blog}
  />)

  const element = screen.getByText('Does not work anymore :(', { exact: false })


  expect(element).toBeDefined()
})

test('blog url and likes are shown on show details button click', async () => {
  const blog = {
    id: 1,
    title: 'Does not work anymore :(',
    author: 'Oleksandr Pylypenko',
    url: 'http://localhost:1010',
    user: 1,
    likes: 50
  }

  const blogLikes = {
    '1': blog.likes
  }

  render(<Blog
    id='1'
    blog={blog}
    user={1}
    blogLikes={blogLikes}
  />)

  const user = userEvent.setup()
  const button = screen.getByText('view details')
  await user.click(button)

  const urlElement = screen.getByText('URL', { exact: false })
  expect(urlElement).toBeDefined()
  const likesElement = screen.getByText('Likes', { exact: false })
  expect(likesElement).toBeDefined()
})
