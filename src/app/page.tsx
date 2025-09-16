import Link from "next/link";
import { Star, Users, BookOpen } from "lucide-react";

export default function Home() {
  const featuredCourses = [
    {
      id: 1,
      title: "React for Beginners",
      instructor: "John Doe",
      rating: 4.5,
      students: 1234,
      price: 49.99,
      image: "/course1.jpg",
    },
    {
      id: 2,
      title: "Advanced JavaScript",
      instructor: "Jane Smith",
      rating: 4.8,
      students: 2567,
      price: 79.99,
      image: "/course2.jpg",
    },
    {
      id: 3,
      title: "Python Data Science",
      instructor: "Bob Johnson",
      rating: 4.7,
      students: 1890,
      price: 99.99,
      image: "/course3.jpg",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Learn from the Best Instructors
        </h1>
        <p className="text-xl md:text-2xl mb-8">
          Discover courses in programming, design, business, and more.
        </p>
        <Link
          href="/courses"
          className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
        >
          Explore Courses
        </Link>
      </section>

      {/* Featured Courses */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                <BookOpen size={64} className="text-gray-500" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  by {course.instructor}
                </p>
                <div className="flex items-center mb-2">
                  <Star className="text-yellow-400 fill-current" size={16} />
                  <span className="ml-1">{course.rating}</span>
                  <Users className="ml-4 text-gray-500" size={16} />
                  <span className="ml-1">{course.students}</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">${course.price}</p>
                <Link
                  href={`/courses/${course.id}`}
                  className="mt-4 block bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  View Course
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-16 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Start Your Learning Journey Today</h2>
        <p className="text-xl mb-8">
          Join thousands of students learning new skills.
        </p>
        <Link
          href="/auth/signup"
          className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
        >
          Sign Up Now
        </Link>
      </section>
      {/* Personal Consultation Feature */}
      <section className="text-center py-16 bg-white dark:bg-gray-900 rounded-lg shadow-md mt-12">
        <h2 className="text-3xl font-bold mb-4">Personal Consultation</h2>
        <p className="text-lg mb-6 max-w-xl mx-auto">
          Need personalized guidance? Book a one-on-one consultation with our expert instructors to get tailored advice and support.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors"
        >
          Book a Consultation
        </Link>
      </section>
    </div>
  );
}
