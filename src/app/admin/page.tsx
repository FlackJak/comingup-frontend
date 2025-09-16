"use client";

import { useState, useEffect } from "react";
import { client } from "@/lib/graphqlClient";
import { GET_USERS, GET_ALL_COURSES, DELETE_USER_MUTATION, DELETE_COURSE_MUTATION, CREATE_USER_MUTATION, UPDATE_USER_MUTATION } from "@/graphql/queries";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Course {
  id: string;
  title: string;
  instructor: {
    name: string;
  };
  price: number;
  rating: number;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const usersData = await client.request(GET_USERS) as { users: User[] };
      const coursesData = await client.request(GET_ALL_COURSES) as { courses: Course[] };
      setUsers(usersData.users);
      setCourses(coursesData.courses);
    } catch (_error: unknown) {
      setError("Failed to load data");
      console.error(_error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteUser = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await client.request(DELETE_USER_MUTATION, { id });
        setUsers(users.filter(user => user.id !== id));
      } catch (_error: unknown) {
        alert("Failed to delete user");
        console.error(_error);
      }
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      try {
        await client.request(DELETE_COURSE_MUTATION, { id });
        setCourses(courses.filter(course => course.id !== id));
      } catch (_error: unknown) {
        alert("Failed to delete course");
        console.error(_error);
      }
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await client.request(CREATE_USER_MUTATION, userFormData);
      setUserFormData({ name: "", email: "", password: "", role: "student" });
      setShowCreateUserForm(false);
      fetchData();
    } catch (_error: unknown) {
      console.error(_error);
      setError("Failed to create user");
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      await client.request(UPDATE_USER_MUTATION, {
        id: editingUser.id,
        name: userFormData.name,
        email: userFormData.email,
        role: userFormData.role,
      });
      setEditingUser(null);
      setUserFormData({ name: "", email: "", password: "", role: "student" });
      fetchData();
    } catch (_error: unknown) {
      console.error(_error);
      setError("Failed to update user");
    }
  };

  const startEditUser = (user: User) => {
    setEditingUser(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
  };

  if (loading) {
    return <p>Loading admin data...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Users</h2>
          <button
            onClick={() => setShowCreateUserForm(!showCreateUserForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showCreateUserForm ? "Cancel" : "Create New User"}
          </button>
        </div>

        {showCreateUserForm && (
          <form onSubmit={handleCreateUser} className="mb-6 p-4 border rounded dark:bg-gray-800">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={userFormData.name}
                onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={userFormData.email}
                onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={userFormData.password}
                onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Role</label>
              <select
                value={userFormData.role}
                onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700"
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Create User
            </button>
          </form>
        )}

        {editingUser && (
          <form onSubmit={handleUpdateUser} className="mb-6 p-4 border rounded dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4">Edit User</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={userFormData.name}
                onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={userFormData.email}
                onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Role</label>
              <select
                value={userFormData.role}
                onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                className="w-full p-2 border rounded dark:bg-gray-700"
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Update User
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingUser(null);
                  setUserFormData({ name: "", email: "", password: "", role: "student" });
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <ul className="space-y-4">
          {users.map((user) => (
            <li key={user.id} className="border rounded p-4 dark:bg-gray-800 flex justify-between items-center">
              <div>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEditUser(user)}
                  className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Courses</h2>
        <ul className="space-y-4">
          {courses.map((course) => (
            <li key={course.id} className="border rounded p-4 dark:bg-gray-800 flex justify-between items-center">
              <div>
                <p><strong>Title:</strong> {course.title}</p>
                <p><strong>Instructor:</strong> {course.instructor.name}</p>
                <p><strong>Price:</strong> ${course.price}</p>
                <p><strong>Rating:</strong> {course.rating}</p>
              </div>
              <button
                onClick={() => handleDeleteCourse(course.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
