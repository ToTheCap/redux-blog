import { useSelector } from "react-redux"
import { selectPostIds } from "./postsSlice"
import { useGetPostsQuery } from "./postsSlice"

import PostsExcerpt from "./PostsExcerpt"

const PostList = () => {
  const {
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetPostsQuery()

  const orderedPostIds = useSelector(selectPostIds)



  let content
  if (isLoading) {
    content = <p>Loading...</p>
  }
  else if (isSuccess) {
    content = orderedPostIds.map(postId => {
      return <PostsExcerpt key={postId} postId={postId} />
    })
  }
  else if (isError) {
    content = <p>{error}</p>
  }

  return (
    <section>
      {content}
    </section>
  )
}

export default PostList