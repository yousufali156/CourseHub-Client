import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen, Code, Brush, Shield, Globe, Smartphone
} from "lucide-react";
import { Helmet } from "react-helmet";

// Icon mapping
const icons = {
  "Digital Marketing": <Globe size={40} className="text-purple-500 dark:text-purple-300" />,
  "Graphics Design": <Brush size={40} className="text-blue-400 dark:text-blue-300" />,
  "Web Development": <Code size={40} className="text-purple-400 dark:text-purple-300" />,
  "Cyber Security": <Shield size={40} className="text-blue-500 dark:text-blue-300" />,
  "Java Programming": <Code size={40} className="text-orange-400 dark:text-orange-300" />,
  Python: <Code size={40} className="text-yellow-400 dark:text-yellow-300" />,
  Android: <Smartphone size={40} className="text-green-500 dark:text-green-300" />,
};
const getIcon = (name = "") => {
  const entry = Object.keys(icons).find(key => name.includes(key));
  return entry ? icons[entry] : <BookOpen size={40} className="text-indigo-400 dark:text-indigo-300" />;
};

const UpcomingCourse = () => {
  const [courses, setCourses] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/UpcomingCourse.json")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error("Failed to fetch upcoming courses:", err))
      .finally(() => setLoading(false));
  }, []);

  const displayedCourses = showAll ? courses : courses.slice(0, 6);

  return (
    <section className="py-12 container mx-auto px-4 md:px-12 bg-base-100 transition-colors duration-300">
      <Helmet>
        <title>Upcoming Courses || CourseHub</title>
      </Helmet>
      <h2 className="text-4xl font-bold text-center text-blue-400 dark:text-purple-300 mb-10">
        Upcoming Courses
      </h2>

      {loading ? (
        <p className="text-center text-base-content">Loading upcoming courses...</p>
      ) : (
        <>
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {displayedCourses.map((course, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 1, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ delay: index * 0.04 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card
                    className="shadow-md transition-all duration-300 
                      bg-base-100 h-[380px] flex flex-col justify-between
                      hover:bg-gradient-to-r
                      hover:from-[#422fd9] hover:to-[#1c5af9]
                      hover:text-white dark:hover:text-white
                      hover:shadow-xl"
                  >
                    <CardContent className="p-5 flex flex-col justify-between flex-grow">
                      <div>
                        <div className="flex items-center gap-4 mb-3">
                          {getIcon(course.courseName)}
                          <h3 className="text-xl font-semibold text-blue-500 dark:text-purple-200 group-hover:text-white transition-colors duration-300">
                            {course.courseName}
                          </h3>
                        </div>
                        <p className="text-sm mb-3 line-clamp-3">
                          {course.description}
                        </p>
                        <ul className="text-sm mb-4">
                          <li><strong>Fee:</strong> {course.tuitionFee} BDT</li>
                          <li><strong>Duration:</strong> {course.duration}</li>
                          <li><strong>Date:</strong> {course.date}</li>
                        </ul>
                      </div>
                      {/* See More Button */}
                      <Link
                        to={`/course/${course.id}`}
                        className="mt-auto inline-block text-center bg-yellow-400 
                          text-blue-900 px-4 py-2 rounded-full font-semibold
                          hover:bg-yellow-300 transition"
                      >
                        See More
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <div className="flex justify-center mt-10">
            <Button
              variant="default"
              onClick={() => setShowAll(!showAll)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:brightness-110 text-white shadow-md"
            >
              {showAll ? "Show Less" : "Show All"}
            </Button>
          </div>
        </>
      )}
    </section>
  );
};

export default UpcomingCourse;
