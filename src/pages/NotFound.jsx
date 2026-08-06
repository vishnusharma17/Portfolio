import { Link } from 'react-router-dom'
import './NotFound.css'

const NotFound = () => {
  return (
    <div className="not-found">
      <p className="not-found-code">404</p>
      <h1>Page not found</h1>
      <p>The route you requested does not exist.</p>
      <Link to="/" className="not-found-link">
        Back to Home
      </Link>
    </div>
  )
}

export default NotFound
