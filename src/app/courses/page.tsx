"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { client } from "@/lib/graphqlClient";
import { GET_COURSES } from "@/graphql/queries";

interface Course {
  id: string;
  title: string;
  category: string;
  price: number;
  rating: number;
  instructor: {
    name: string;
  };
}

const categories = ["All", "Programming", "Data Science", "Design", "Business"];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data: any = await client.request(GET_COURSES);
        setCourses(data.courses);
      } catch (err) {
        setError("Failed to load courses");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.instructor && course.instructor.name.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory, courses]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Courses</h1>

      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-6">
        <input
          type="text"
          placeholder="Search courses or instructors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 sm:mb-0 px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {filteredCourses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <li
              key={course.id}
              className="border rounded-md p-4 dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
<p className="text-gray-600 dark:text-gray-300 mb-1">Instructor: {course.instructor.name}</p>
              <p className="text-gray-600 dark:text-gray-300 mb-1">Category: {course.category}</p>
              <p className="text-blue-600 font-bold mb-2">${course.price.toFixed(2)}</p>
              <Link
                href={`/courses/${course.id}`}
                className="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                View Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
