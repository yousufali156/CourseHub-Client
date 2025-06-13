// src/App.jsx
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  Outlet,
} from 'react-router'; 
// Components & Pages
import Navbar from './Components/Navbar/Navbar';
import Footer from './components/Footer';
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
        <Route path="/courses" element={<Courses />} />
        <Route path="/add-course" element={<AddCourse />} />
        <Route path="/manage-course" element={<ManageCourse />} />
        <Route path="/my-enrolled-courses" element={<MyEnrolledCourses />} />
        <Route path="/course-details/:id" element={<CourseDetailsPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFoundCourse />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
