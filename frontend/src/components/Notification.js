const Notification = ({ message, className }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={className}>
      {message}
    </div>
  )
}

export default Notification
export const emptyPopup = { message: null, className: null }
export const popupClasses = { success: 'popupSuccess', error: 'popupError' }
