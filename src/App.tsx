import './App.css'
import Login from './pages/Login/Login'
import {createBrowserRouter, RouterProvider} from 'react-router'
import Student_View from './pages/Student/Studen_View/Student_View'
import Teacher_View from './pages/Teacher/Teacher_View'
import Admin_View from './pages/Admin/Admin_view/Admin_View'
const router = createBrowserRouter([
  {
    path : '/',
    element : <Login />
  },
  {
    path : '/edu-stud',
    element : <Student_View />
  },
  {
    path : '/edu-teach',
    element : <Teacher_View />
  },
  {
    path : '/edu-admin',
    element : <Admin_View />
  }
])
function App() {

  return <RouterProvider router={router}>

  </RouterProvider>
}

export default App
