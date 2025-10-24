import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Code, Brush, Shield, Globe, Smartphone, X } from "lucide-react";
import { Helmet } from "react-helmet";

// Icon mapping
const icons = {
  "Digital Marketing": <Globe size={36} className="text-purple-500 dark:text-purple-300" />,
  "Graphics Design": <Brush size={36} className="text-blue-400 dark:text-blue-300" />,
  "Web Development": <Code size={36} className="text-purple-400 dark:text-purple-300" />,
  "Cyber Security": <Shield size={36} className="text-blue-500 dark:text-blue-300" />,
  "Java Programming": <Code size={36} className="text-orange-400 dark:text-orange-300" />,
  Python: <Code size={36} className="text-yellow-400 dark:text-yellow-300" />,
  Android: <Smartphone size={36} className="text-green-500 dark:text-green-300" />,
};
const getIcon = (name = "") => {
  const entry = Object.keys(icons).find(key => name.includes(key));
  return entry ? icons[entry] : <BookOpen size={36} className="text-indigo-400 dark:text-indigo-300" />;
};

const UpcomingCourse = () => {
  const [courses, setCourses] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

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
                      bg-base-100 h-[340px] flex flex-col justify-between
                      hover:bg-gradient-to-r
                      hover:from-[#422fd9] hover:to-[#1c5af9]
                      hover:text-white dark:hover:text-white
                      hover:shadow-xl overflow-hidden"
                  >
                    <CardContent className="p-4 flex flex-col justify-between flex-grow">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          {getIcon(course.courseName)}
                          <h3 className="text-lg font-semibold text-blue-500 dark:text-purple-200 group-hover:text-white transition-colors duration-300">
                            {course.courseName}
                          </h3>
                        </div>
                        {course.image && (
                          <img
                            src={course.image}
                            alt={course.courseName}
                            className="w-full h-28 object-cover rounded-lg mb-2"
                          />
                        )}
                        <p className="text-xs mb-2 line-clamp-3">
                          {course.description}
                        </p>
                        <ul className="text-xs mb-3">
                          <li><strong>Fee:</strong> {course.tuitionFee} BDT</li>
                          <li><strong>Duration:</strong> {course.duration}</li>
                          <li><strong>Date:</strong> {course.date}</li>
                        </ul>
                      </div>
                      {/* See More Button */}
                      <button
                        onClick={() => setSelectedCourse(course)}
                        className="mt-auto inline-block text-center bg-yellow-400 
                          text-blue-900 px-3 py-1 rounded-full text-sm font-semibold
                          hover:bg-yellow-300 transition"
                      >
                        See More
                      </button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Show All / Show Less Button */}
          <div className="flex justify-center mt-8">
            <Button
              variant="default"
              onClick={() => setShowAll(!showAll)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:brightness-110 text-white shadow-md"
            >
              {showAll ? "Show Less" : "Show All"}
            </Button>
          </div>

          {/* Selected Course Details */}
          {selectedCourse && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-gradient-to-br from-purple-500/30 via-blue-500/30 to-pink-500/30 backdrop-blur-sm flex justify-center items-center z-50 p-4"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-2xl w-full p-6 relative overflow-y-auto max-h-[90vh]"
                >
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
                  >
                    <X size={24} />
                  </button>
                  <h3 className="text-2xl font-bold mb-4">{selectedCourse.courseName}</h3>
                  {selectedCourse.image && (
                    <img
                      src={selectedCourse.image}
                      alt={selectedCourse.courseName}
                      className="w-full h-60 object-cover rounded-lg mb-4"
                    />
                  )}
                  <p className="mb-4 text-sm leading-relaxed">{selectedCourse.description}</p>
                  <ul className="mb-4 text-sm">
                    <li><strong>Fee:</strong> {selectedCourse.tuitionFee} BDT</li>
                    <li><strong>Duration:</strong> {selectedCourse.duration}</li>
                    <li><strong>Date:</strong> {selectedCourse.date}</li>
                  </ul>
                  {/* Extra details */}
                  <div className="mb-4">
                    <h4 className="font-semibold mb-1">Instructor:</h4>
                    <p className="text-sm">{selectedCourse.instructor || "John Doe (Senior Trainer)"}</p>
                  </div>
                  {selectedCourse.syllabus && (
                    <div>
                      <h4 className="font-semibold mb-2">Syllabus:</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {selectedCourse.syllabus.map((topic, idx) => (
                          <li key={idx}>{topic}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          )}
        </>
      )}
    </section>
  );
};

export default UpcomingCourse;
