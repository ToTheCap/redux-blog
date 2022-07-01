import { useSelector } from "react-redux"
import { selectPostById } from "./postsSlice"
import { useParams, Link } from 'react-router-dom'
import { useGetPostsQuery } from "./postsSlice"

import PostAuthor from './PostAuthor'
import TimeAgo from './TimeAgo'
import ReactionButtons from './ReactionButtons'

const SinglePostPage = () => {
  const {
    isLoading,
  } = useGetPostsQuery()

  const { postId } = useParams()
  const post = useSelector((state) => selectPostById(state, Number(postId)))

  if (isLoading) {
    return (
      <section>
        <h2>Loading...</h2>
      </section>
    )
  }

  return (
    <>{post
      ?
      <article>
        <h3>{post.title}</h3>
        <p>{post.body.substring(0, 100)}</p>

        <p className='postCredit'>
          <Link to={`/post/edit/${post.id}`}>Edit Post</Link>
          <PostAuthor userId={post.userId} />
          <TimeAgo timestamp={post.date} />
        </p>
        <ReactionButtons post={post} />
      </article>
      :
      <section>
        <h2>Post Not Found!</h2>
      </section>
    }</>
  )
}

export default SinglePostPage