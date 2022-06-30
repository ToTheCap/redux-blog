import { useSelector } from "react-redux/es/exports";
import { Link, useParams } from 'react-router-dom'

import { selectUserById } from "./usersSlice";
import { useGetPostByUserIdQuery } from "../posts/postsSlice";

const UserPage = () => {
  const { userId } = useParams()
  const user = useSelector(state => selectUserById(state, Number(userId)))
  const {
    data: userPosts,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetPostByUserIdQuery(userId)

  let content
  if (isLoading) {
    content = <p>Loading...</p>
  } else if (isSuccess) {
    const { ids, entities } = userPosts
    content = ids.map(id => (
      <li key={id}>
        <Link to={`/post/${id}`}>{entities[id].title}</Link>
      </li>
    ))
  } else if (isError) {
    content = <p>{error}</p>
  }

  return (
    <section>
      <h2>{user.name}</h2>
      <ol>{content}</ol>
    </section>
  )
}

export default UserPage