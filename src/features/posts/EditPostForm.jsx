import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectPostById, updatePost, deletePost } from './postsSlice'
import { useParams, useNavigate } from 'react-router-dom'

import { selectAllUsers } from '../users/usersSlice'

const EditPostForm = () => {
  const { postId } = useParams()
  const navigate = useNavigate()

  const post = useSelector((state) => selectPostById(state, Number(postId)))
  const users = useSelector(selectAllUsers)

  const [title, setTitle] = useState(post?.title)
  const [content, setContent] = useState(post?.body)
  const [userId, setUserId] = useState(post?.userId)
  const [requestStatus, setRequestStatus] = useState('idle')

  const dispatch = useDispatch()

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }

  const onTitleChange = e => setTitle(e.target.value)
  const onContentChange = e => setContent(e.target.value)
  const onAuthorChange = e => setUserId(Number(e.target.value))

  const canSave = [title, userId, content].every(Boolean) && requestStatus === 'idle'

  const onSave = () => {
    if (canSave) {
      try {
        setRequestStatus('pending')
        dispatch(updatePost({
          id: post.id,
          title,
          body: content,
          userId,
          reactions: post.reactions
        })).unwrap()

        setTitle('')
        setContent('')
        setUserId('')
        navigate(`/post/${postId}`)
      } catch (err) {
        console.log('Failed to save post', err);
      } finally {
        setRequestStatus('idle')
      }
    }
  }

  const onDelete = () => {
    try {
      setRequestStatus('pending')
      dispatch(deletePost({ id: post.id })).unwrap()

      setTitle('')
      setContent('')
      setUserId('')
      navigate('/')
    } catch (err) {
      console.log('Failed to delete the post', err);
    } finally {
      setRequestStatus('idle')
    }
  }

  const usersOptions = users.map(user => (
    <option key={user.id} value={user.id}>{user.name}</option>
  ))

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor='postAuthor'>Author: </label>
        <select
          name='postAuthor'
          id='postAuthor'
          value={userId}
          onChange={onAuthorChange}
        >
          <option value='' style={{ display: 'none' }}></option>
          {usersOptions}
        </select>
        <label htmlFor='postTitle'>Post Title: </label>
        <input type='text' id='postTitle' name='postTitle' value={title} onChange={onTitleChange} />
        <label htmlFor='postContent'>Content: </label>
        <textarea type='text' id='postContent' name='postContent' value={content} onChange={onContentChange} />
        <button type='button' onClick={onSave} disabled={!canSave}>Save Post</button>
        <button type='button' onClick={onDelete} className="deleteButton">Delete Post</button>
      </form>
    </section>
  )
}

export default EditPostForm