"use client";

import { useState } from "react";

export default function Dashboard2() {
  const [enrolledCourses] = useState([
    { id: "1", title: "React for Beginners", progress: 45 },
    { id: "2", title: "Advanced Node.js", progress: 20 },
  ]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
      <section>
        <h2 className="text-2xl font-semibold mb-4">Enrolled Courses</h2>
        {enrolledCourses.length === 0 ? (
          <p>You have not enrolled in any courses yet.</p>
        ) : (
          <ul className="space-y-4">
            {enrolledCourses.map((course) => (
              <li key={course.id} className="border p-4 rounded-md">
                <h3 className="text-xl font-semibold">{course.title}</h3>
                <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                  <div
                    className="bg-blue-600 h-4 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  Progress: {course.progress}%
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
