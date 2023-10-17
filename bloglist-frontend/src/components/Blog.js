import { useState } from 'react'

const Blog = ({ blog, user, handleLikeClick, handleDeleteClick }) => {
  const [showFullInfo, setShowFullInfo] = useState(false)

  const toggleShowFullInfo = () => {
    setShowFullInfo(!showFullInfo)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  if (showFullInfo) {
    if (user && user.username === blog.user.username) {
      return (
        <div
          style={blogStyle}
          data-testid="blog">
          <div>
            {blog.title}
            <button
              data-testid="hide-button"
              onClick={toggleShowFullInfo}>
              Hide
            </button>
          </div>
          <div>
            {blog.url}
          </div>
          <div data-testid="likes">
            Likes {blog.likes}
            <button data-testid="like-button"
              onClick={() => handleLikeClick(blog)}>
              Like
            </button>
          </div>
          <div>
            {blog.author}
          </div>
          <button
            data-testid="delete-button"
            onClick={() => handleDeleteClick(blog)}>
            Delete
          </button>
        </div>
      )
    }

    return (
      <div
        style={blogStyle}
        data-testid="blog">
        <div>
          {blog.title}
          <button
            data-testid="hide-button"
            onClick={toggleShowFullInfo}>
            Hide
          </button>
        </div>
        <div>
          {blog.url}
        </div>
        <div data-testid="likes">
          Likes {blog.likes}
          <button
            data-testid="like-button"
            onClick={() => handleLikeClick(blog)}>
            Like
          </button>
        </div>
        <div>
          {blog.author}
        </div>
      </div>
    )
  }

  return (
    <div
      style={blogStyle}
      data-testid="blog">
      <div>
        {blog.title}
        <button
          data-testid="view-button"
          onClick={toggleShowFullInfo}>
          View
        </button>
      </div>
    </div>
  )
}

export default Blog