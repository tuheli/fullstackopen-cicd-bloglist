import { useState, useEffect, useRef } from 'react'
import Blogs from './components/Blogs'
import LoginForm from './components/LoginForm'
import UserInfo from './components/UserInfo'
import blogService from './services/blogs'
import loginService from './services/login'
import LogoutButton from './components/LogoutButton'
import CreateBlogForm from './components/CreateBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [notificationStyle, setNotificationStyle] = useState(null)
  const [previousTimeout, setPreviousTimeout] = useState(null)

  const togglableRef = useRef()

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLoginClick = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService
        .login(username, password)

      setUser(user)
      blogService.setToken(user.token)

      setUsername('')
      setPassword('')

      window.localStorage.setItem('loggedAppUser', JSON.stringify(user))
    }
    catch (error) {
      showNotification('Wrong username or password.', 5000, 'error')
    }
  }

  const handleLogoutClick = () => {
    window.localStorage.clear()
    setUser(null)
    blogService.setToken(null)
  }

  const handleCreateBlogClick = async (event, title, author, url) => {
    event.preventDefault()

    try {
      const newBlog = {
        title,
        author,
        url
      }

      const returnedBlog = await blogService.create(newBlog)

      setBlogs([...blogs].concat({
        ...returnedBlog,
        user: {
          id: returnedBlog.user,
          name: user.name,
          username: user.username
        } }))

      showNotification(`Created a new blog ${returnedBlog.title} by ${returnedBlog.author}.`, 5000, 'success')

      togglableRef.current.toggleVisibility()
    }
    catch (error) {
      showNotification('Failed to create a new blog', 5000, 'error')
    }
  }

  const handleLikeClick = async blog => {
    const blogToUpdate = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1
    }

    const returnedBlog = await blogService.update(blogToUpdate)

    const updatedBlog = {
      ...returnedBlog,
      user: {
        id: blog.user.id,
        name: blog.user.name,
        username: blog.user.username
      }
    }

    const updatedBlogs = blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog)

    setBlogs(updatedBlogs)
  }

  const handleDeleteClick = async blog => {
    if (!window.confirm(`Delete blog ${blog.title} by ${blog.author}?`)) {
      return
    }

    try {
      await blogService.remove(blog.id)
      const updatedBlogs = blogs.filter(b => b.id !== blog.id)

      setBlogs(updatedBlogs)
    }
    catch (error) {
      showNotification('Failed to delete blog', 5000, 'error')
    }
  }

  const handleUsernameChange = newValue => {
    setUsername(newValue)
  }

  const handlePasswordChange = newValue => {
    setPassword(newValue)
  }

  const showNotification = (message, duration, style) => {
    setNotification(message)
    setNotificationStyle(style)

    if (previousTimeout !== null) {
      clearTimeout(previousTimeout)
    }

    setPreviousTimeout(setTimeout(() => {
      setNotification(null)
      setNotificationStyle(null)
    }, duration))
  }

  if (!user) {
    return (
      <div>
        <Notification message={notification} style={notificationStyle} />
        <LoginForm username={username} password={password} handleLoginClick={handleLoginClick} handleUsernameChange={handleUsernameChange} handlePasswordChange={handlePasswordChange} />
      </div>
    )
  }

  return (
    <div>
      <UserInfo user={user}/>
      <LogoutButton handleClick={handleLogoutClick}/>
      <Notification message={notification} style={notificationStyle} />
      <Togglable buttonLabel='Create Blog' ref={togglableRef}>
        <CreateBlogForm handleCreateClick={handleCreateBlogClick} />
      </Togglable>
      <Blogs blogs={blogs.toSorted((a, b) => b.likes - a.likes)} user={user} handleLikeClick={handleLikeClick} handleDeleteClick={handleDeleteClick} />
    </div>
  )
}

export default App