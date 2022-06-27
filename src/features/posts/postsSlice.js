import axios from "axios";
import { sub } from "date-fns";
import {
  createSlice,
  createAsyncThunk,
  createSelector,
  createEntityAdapter
} from "@reduxjs/toolkit";

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts'

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const initialState = postsAdapter.getInitialState({
  status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
})

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await axios.get(POSTS_URL)
  return response.data
})

export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost) => {
  const response = await axios.post(POSTS_URL, initialPost)
  return response.data
})

export const updatePost = createAsyncThunk('posts/updatePost', async (initialPost) => {
  const { id } = initialPost
  try {
    const response = await axios.put(`${POSTS_URL}/${id}`, initialPost)
    return response.data
  } catch (err) {
    return err.message
  }
})

export const deletePost = createAsyncThunk('posts/deletePost', async (initialPost) => {
  const { id } = initialPost
  try {
    const response = await axios.delete(`${POSTS_URL}/${id}`)
    if (response?.status === 200) return initialPost
    return `${response?.status} : ${response?.statusText}`
  } catch (err) {
    // return err.message
    return initialPost // just to test redux, because API does not let me delete posts created by me
  }
})

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addReactions(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.entities[postId]
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'

        let min = 1
        const loadedPosts = action.payload.map(post => {
          post.date = sub(new Date(), { minutes: min++ }).toISOString()
          post.reactions = {
            thumbsUp: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
            wow: 0
          }
          return post
        })
        postsAdapter.upsertMany(state, loadedPosts)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        action.payload.userId = Number(action.payload.userId)
        action.payload.date = new Date().toISOString()
        action.payload.reactions = {
          thumbsUp: 0,
          heart: 0,
          rocket: 0,
          coffee: 0,
          wow: 0
        }
        postsAdapter.addOne(state, action.payload)
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Update could not completed", action.payload);
          return
        }
        action.payload.date = new Date().toISOString()
        postsAdapter.upsertOne(state, action.payload)
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Delete could not completed", action.payload)
          return
        }
        const { id } = action.payload
        postsAdapter.removeOne(state, id)
      })
  }
})

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds
} = postsAdapter.getSelectors(state => state.posts)

export const getPostsStatus = (state) => state.posts.status
export const getPostsError = (state) => state.posts.error
export const getCount = (state) => state.posts.count

export const selectPostByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter(post => post.userId === userId)
)

export const { addReactions } = postsSlice.actions

export default postsSlice.reducer