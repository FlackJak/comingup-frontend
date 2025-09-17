"use client";


import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Course {
  id: number;
  title: string;
  progress: number; // percentage
}

const enrolledCourses: Course[] = [
  { id: 1, title: "React for Beginners", progress: 45 },
  { id: 2, title: "Advanced JavaScript", progress: 80 },
  { id: 3, title: "Python Data Science", progress: 20 },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const courses = enrolledCourses;

  function handleLogout() {
    logout();
    router.push("/");
  }

  if (!user) {
    return <p>Please sign in to access your dashboard.</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}!</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Enrolled Courses</h2>
        {courses.length === 0 ? (
          <p>You are not enrolled in any courses yet.</p>
        ) : (
          <ul className="space-y-4">
            {courses.map((course) => (
              <li key={course.id} className="border rounded p-4 dark:bg-gray-800">
                <Link href={`/courses/${course.id}`} className="text-xl font-semibold hover:underline">
                  {course.title}
                </Link>
                <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-4 mt-2">
                  <div
                    className="bg-blue-600 h-4 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Progress: {course.progress}%
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </section>
    </div>
  );
}
