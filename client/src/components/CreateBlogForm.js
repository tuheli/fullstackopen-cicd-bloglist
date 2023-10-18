import { useState } from 'react'

const CreateBlogForm = ({ handleCreateClick }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const onCreateClick = (event) => {
    handleCreateClick(event, title, author, url)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create New Blog</h2>
      <form>
        <div>
          Title
          <input
            data-testid="title-input"
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          Author
          <input
            data-testid="author-input"
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          Url
          <input
            data-testid="url-input"
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button
          data-testid="create-blog-button"
          type="submit"
          onClick={(event) => onCreateClick(event)}>Create</button>
      </form>
    </div>
  )
}

export default CreateBlogForm