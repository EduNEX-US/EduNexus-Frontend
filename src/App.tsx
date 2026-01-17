import './App.css'
import Login from './pages/Login/Login'
import {createBrowserRouter, RouterProvider} from 'react-router'
import Student_View from './pages/Student/Studen_View/Student_View'
import Teacher_View from './pages/Teacher/Teacher_View/Teacher_View'
import Admin_View from './pages/Admin/Admin_view/Admin_View'
// import VideoCaller from './pages/Student/PTM/VideoCaller'
import AuthLoader from './features/auth/AuthLoader'
import ProtectedRoute from './pages/Login/ProtectedRoute'
import ChangePassword from './pages/Login/ChangePassword'
const router = createBrowserRouter([
  {
    path : '/',
    element : <Login />
  },
  {
    path: "/change-password",
    element: <ProtectedRoute>
        <ChangePassword />
      </ProtectedRoute>
  },
  {
    path : '/edu-stud',
    element : <ProtectedRoute role="student">
        <Student_View />
      </ProtectedRoute>
  },
  {
    path : '/edu-teach',
    element : <ProtectedRoute role="teacher">
        <Teacher_View />
      </ProtectedRoute>
  },
  {
    path : '/edu-admin',
    element : <ProtectedRoute role="admin">
        <Admin_View />
      </ProtectedRoute>
  },
  // {
  //   path : '/ptm',
  //   element : <VideoCaller />
  // }
])
function App() {

  return <AuthLoader>
    <RouterProvider router={router}>

  </RouterProvider>
  </AuthLoader>
}

export default App
