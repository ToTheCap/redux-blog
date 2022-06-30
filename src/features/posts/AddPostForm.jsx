import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { useAddNewPostMutation } from './postsSlice'
import { selectAllUsers } from '../users/usersSlice'


const AddPostForm = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState('')

  const [addNewPost, { isLoading }] = useAddNewPostMutation()
  const navigate = useNavigate()

  const users = useSelector(selectAllUsers)

  const onTitleChange = e => setTitle(e.target.value)
  const onContentChange = e => setContent(e.target.value)
  const onAuthorChange = e => setUserId(e.target.value)

  const canSave = [title, userId, content].every(Boolean) && !isLoading

  const onSubmit = async (e) => {
    e.preventDefault()
    if (canSave) {
      try {
        await addNewPost({ title, body: content, userId }).unwrap()

        setTitle('')
        setContent('')
        setUserId('')
        navigate('/')
      } catch (err) {
        console.log('Failed to save post', err);
      }
    }
  }


  const usersOptions = users.map(user => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ))

  return (
    <section>
      <h2>Add a New Post</h2>
      <form onSubmit={onSubmit}>
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
        <button type='submit' disabled={!canSave}>Save Post</button>
      </form>
    </section>
  )
}

export default AddPostForm