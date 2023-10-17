import PropTypes from 'prop-types'

const LoginForm = ({ username, password, handleLoginClick, handleUsernameChange, handlePasswordChange }) => (
  <div>
    <h2>Login to Application</h2>
    <form onSubmit={handleLoginClick}>
      <div>
          Username
        <input
          type="text"
          value={username}
          name="Username"
          data-testid="input-username"
          autoComplete="username"
          onChange={({ target }) => handleUsernameChange(target.value)}/>
      </div>
      <div>
          Password
        <input
          type="password"
          value={password}
          name="Password"
          data-testid="input-password"
          autoComplete="current-password"
          onChange={({ target }) => handlePasswordChange(target.value)}
        />
      </div>
      <button data-testid="login-button" type="submit">Login</button>
    </form>
  </div>
)

LoginForm.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  handleLoginClick: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired
}

export default LoginForm