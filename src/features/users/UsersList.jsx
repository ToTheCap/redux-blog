import { useSelector } from "react-redux/es/exports";
import { selectAllUsers } from "./usersSlice";
import { useGetUsersQuery } from "./usersSlice";
import { Link } from 'react-router-dom'

const UsersList = () => {
  const {
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetUsersQuery()

  const users = useSelector(selectAllUsers)

  let content
  if (isLoading) {
    content = <h2>Loading...</h2>
  } else if (isSuccess) {
    content = users.map(user => (
      <li key={user.id}>
        <Link to={`/user/${user.id}`}>{user.name}</Link>
      </li>
    ))
  } else if (isError) {
    content = <p>{error}</p>
  }

  return (
    <section>
      <h2>Users</h2>
      <ul>{content}</ul>
    </section>
  )
}

export default UsersList