import { useState } from 'react'
import './App.css'
import Login from './pages/Login/Login'
import {createBrowserRouter, RouterProvider} from 'react-router'
import Student_View from './pages/Student/Studen_View/Student_View'
const router = createBrowserRouter([
  {
    path : '/',
    element : <Login />
  },
  {
    path : '/edu-nexus/',
    element : <Student_View />
  }
])
function App() {
  const [count, setCount] = useState(0)

  return <RouterProvider router={router}>

  </RouterProvider>
}

export default App
