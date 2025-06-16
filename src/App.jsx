// src/App.jsx
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  Outlet,
} from 'react-router-dom'; // ✅ Updated from 'react-router' to 'react-router-dom'

// Components & Pages
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer';
import Home from './pages/Home';
import Courses from './pages/Courses';
import AddCourse from './pages/AddCourse';
import ManageCourse from './pages/ManageCourse';
import MyEnrolledCourses from './pages/MyEnrolledCourses';
import Contact from './pages/Contact';
import About from './pages/About';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import NotFoundCourse from './Components/NotFoundCourse';
import CourseDetailsPage from './pages/CourseDetailsPage';
import EditCourseButton from './Pages/EditCourseButton';
import MyCourseDetailsButton from './Pages/MyCourseDetailsButton';
import UpcomingCourse from './Pages/Shared/UpcomingCourse';
import PrivateRoute from './PrivateRoute/PrivateRoute';

// ✅ Toast
import { Toaster } from 'react-hot-toast';

// Layout wrapper
const AppLayout = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/add-course" element={<PrivateRoute><AddCourse /></PrivateRoute>} />
        <Route path="/manage-course" element={<PrivateRoute><ManageCourse /></PrivateRoute>} />
        <Route path="/my-enrolled-courses" element={<PrivateRoute><MyEnrolledCourses /></PrivateRoute>} />

        <Route path="/courses" element={<Courses />} />
        <Route path="/course-details/:id" element={<PrivateRoute><CourseDetailsPage /></PrivateRoute>} />
        <Route path="/upcoming-course" element={<PrivateRoute><UpcomingCourse /></PrivateRoute>} />

        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/edit-course/:id" element={<EditCourseButton />} />
        <Route path="/course/:id" element={<MyCourseDetailsButton />} />

        <Route path="*" element={<NotFoundCourse />} />
      </Route>
    )
  );

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} /> {/* ✅ Toast added */}
      <RouterProvider router={router} />
    </>
  );
};

export default App;
