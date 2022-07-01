import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App'
import './index.css'

import { store } from './app/store'
import { Provider } from 'react-redux'
import { postsApiSlice } from './features/posts/postsSlice'
import { usersApiSlice } from './features/users/usersSlice'

store.dispatch(postsApiSlice.endpoints.getPosts.initiate())
store.dispatch(usersApiSlice.endpoints.getUsers.initiate())

const container = document.getElementById('root')
const root = ReactDOM.createRoot(container)

root.render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path='/*' element={<App />} />
      </Routes>
    </Router>
  </Provider>
)
