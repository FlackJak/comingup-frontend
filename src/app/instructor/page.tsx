"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { client } from "@/lib/graphqlClient";
import { GET_MY_COURSES, CREATE_COURSE_MUTATION, UPDATE_COURSE_MUTATION, DELETE_COURSE_MUTATION } from "@/graphql/queries";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  rating: number;
  reviews: any[];
}

export default function InstructorDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    category: "",
    tags: "",
  });

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data: any = await client.request(GET_MY_COURSES);
      setCourses(data.myCourses);
    } catch (err) {
      setError("Failed to load courses");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tags = formData.tags.split(",").map(tag => tag.trim());
      await client.request(CREATE_COURSE_MUTATION, {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price.toString()),
        category: formData.category,
        tags,
      });
      setFormData({ title: "", description: "", price: 0, category: "", tags: "" });
      setShowCreateForm(false);
      fetchCourses();
    } catch (err) {
      console.error(err);
      setError("Failed to create course");
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      try {
        await client.request(DELETE_COURSE_MUTATION, { id });
        fetchCourses();
      } catch (err) {
        console.error(err);
        setError("Failed to delete course");
      }
    }
  };

  if (loading) {
    return <p>Loading your courses...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Instructor Dashboard</h1>

      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Your Courses</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showCreateForm ? "Cancel" : "Create New Course"}
          </button>
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreateCourse} className="mb-6 p-4 border rounded dark:bg-gray-800">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full p-2 border rounded dark:bg-gray-700"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700"
              />
            </div>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Create Course
            </button>
          </form>
        )}

        {courses.length === 0 ? (
          <p>You have not created any courses yet.</p>
        ) : (
          <ul className="space-y-4">
            {courses.map((course) => (
              <li key={course.id} className="border rounded p-4 dark:bg-gray-800">
                <div className="flex justify-between items-start">
                  <div>
                    <Link href={`/courses/${course.id}`} className="text-xl font-semibold hover:underline">
                      {course.title}
                    </Link>
                    <p className="text-gray-600 dark:text-gray-400">{course.description}</p>
                    <p className="text-gray-600 dark:text-gray-400">Price: ${course.price}</p>
                    <p className="text-gray-600 dark:text-gray-400">Category: {course.category}</p>
                    <p className="text-gray-600 dark:text-gray-400">Rating: {course.rating || "N/A"}</p>
                    <p className="text-gray-600 dark:text-gray-400">Reviews: {course.reviews.length}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
