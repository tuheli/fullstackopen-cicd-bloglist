const Notification = ({ message, style }) => {
  if (message === null) {
    return null
  }

  const successStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  if (style === null || style === undefined) {
    return (
      <div>{message}</div>
    )
  }

  if (style === 'success') {
    return (
      <div style={successStyle}>{message}</div>
    )
  }

  if (style === 'error') {
    return (
      <div style={errorStyle}>{message}</div>
    )
  }
}

export default Notification