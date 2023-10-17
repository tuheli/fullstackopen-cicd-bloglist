import Blog from './Blog'

const Blogs = ({ blogs, user, handleLikeClick, handleDeleteClick }) => (
  <div>
    <h2>Blogs</h2>
    <div data-testid="bloglist">
      {blogs.map(blog => <Blog key={blog.id} blog={blog} user={user} handleLikeClick={handleLikeClick} handleDeleteClick={handleDeleteClick} />)}
    </div>
  </div>
)

export default Blogs