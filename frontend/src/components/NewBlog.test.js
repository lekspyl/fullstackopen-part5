import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import NewBlog from './NewBlog'
import userEvent from '@testing-library/user-event'

test('form can be filled in and submitted', async () => {
  const addBlog = jest.fn()
  const user = userEvent.setup()

  render(<NewBlog addBlog={addBlog} />)

  const authorField = screen.getByLabelText('Author:')
  await user.type(authorField, 'Great Author')
  const titleField = screen.getByLabelText('Title:')
  await user.type(titleField, 'Awesome Post')
  const urlField = screen.getByLabelText('URL:')
  await user.type(urlField, 'https://example.com')
  const createButton = screen.getByText('Create')

  await user.click(createButton)

  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog.mock.calls[0][0].title).toBe('Awesome Post')
  expect(addBlog.mock.calls[0][0].url).toBe('https://example.com')
  expect(addBlog.mock.calls[0][0].author).toBe('Great Author')
})
