import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Code,
  Brush,
  Shield,
  Globe,
  Smartphone,
} from "lucide-react";

const icons = {
  "Digital Marketing": <Globe className="text-purple-500" />,
  "Graphics Design": <Brush className="text-blue-400" />,
  "Web Development": <Code className="text-purple-400" />,
  "Cyber Security": <Shield className="text-blue-500" />,
  "Java Programming": <Code className="text-orange-400" />,
  Python: <Code className="text-yellow-400" />,
  Android: <Smartphone className="text-green-500" />,
};

const getIcon = (name) => {
  if (name.includes("Graphics")) return icons["Graphics Design"];
  if (name.includes("Digital Marketing")) return icons["Digital Marketing"];
  if (name.includes("Web")) return icons["Web Development"];
  if (name.includes("Cyber")) return icons["Cyber Security"];
  if (name.includes("Java")) return icons["Java Programming"];
  if (name.includes("Python")) return icons["Python"];
  if (name.includes("Android")) return icons["Android"];
  return <BookOpen className="text-indigo-400" />;
};

const UpcomingCourse = () => {
  const [courses, setCourses] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch("/UpcomingCourse.json")
      .then((res) => res.json())
      .then((data) => setCourses(data));
  }, []);

  const displayedCourses = showAll ? courses : courses.slice(0, 6);

  return (
    <div className="py-12 px-4 md:px-12 bg-base-100">
      <h2 className="text-4xl font-bold text-center text-blue-400 dark:text-purple-300 mb-8">
        Upcoming Courses
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedCourses.map((course, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-5">
                <div className="flex items-center gap-4 mb-3">
                  {getIcon(course.courseName)}
                  <h3 className="text-xl font-semibold text-blue-500 dark:text-purple-200">
                    {course.courseName}
                  </h3>
                </div>
                <p className=" mb-2">
                  {course.description}
                </p>
                <ul className="text-sm">
                  <li>
                    <strong>Fee:</strong> {course.tuitionFee} BDT
                  </li>
                  <li>
                    <strong>Duration:</strong> {course.duration}
                  </li>
                  <li>
                    <strong>Date:</strong> {course.date}
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button
          variant="default"
          onClick={() => setShowAll(!showAll)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:brightness-110 text-white"
        >
          {showAll ? "Show Less" : "Show All"}
        </Button>
      </div>
    </div>
  );
};

export default UpcomingCourse;
