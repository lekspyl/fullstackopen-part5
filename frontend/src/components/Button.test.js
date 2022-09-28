import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './Button'

test('event handler gets called twice on two button presses', async () => {
  const mockHandler = jest.fn()

  render(<Button
    clickHandler={mockHandler}
    buttonText='like'
  />)

  const user = userEvent.setup()
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)

})
