const Button = ({ buttonText, clickHandler }) => {
  return (
    <button onClick={clickHandler}>{buttonText}</button>
  )
}

export default Button
