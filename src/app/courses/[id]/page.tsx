"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { client } from "@/lib/graphqlClient";
import { GET_COURSE_DETAIL, ENROLL_MUTATION, ADD_REVIEW_MUTATION, UPDATE_REVIEW_MUTATION, DELETE_REVIEW_MUTATION, ADD_TO_WISHLIST_MUTATION, PROCESS_PAYMENT_MUTATION } from "@/graphql/queries";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: {
    name: string;
  };
  price: number;
  rating: number;
  category: string;
  content: string[];
  reviews: Review[];
}

interface Review {
  id: string;
  user: {
    name: string;
  };
  rating: number;
  comment: string;
}

export default function CourseDetail() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const courseData = await client.request(GET_COURSE_DETAIL, { id }) as { course: Course };
      setCourse(courseData.course);
    } catch (err) {
      setError("Failed to load course details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddReview = async () => {
    try {
      await client.request(ADD_REVIEW_MUTATION, { courseId: id, rating: reviewRating, comment: reviewComment });
      setReviewComment("");
      setReviewRating(5);
      fetchData();
    } catch (err) {
      alert("Failed to add review");
      console.error(err);
    }
  };

  const handleUpdateReview = async (reviewId: string) => {
    try {
      await client.request(UPDATE_REVIEW_MUTATION, { id: reviewId, rating: editRating, comment: editComment });
      setEditingReview(null);
      setEditComment("");
      setEditRating(5);
      fetchData();
    } catch (err) {
      alert("Failed to update review");
      console.error(err);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      try {
        await client.request(DELETE_REVIEW_MUTATION, { id: reviewId });
        fetchData();
      } catch (err) {
        alert("Failed to delete review");
        console.error(err);
      }
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await client.request(ADD_TO_WISHLIST_MUTATION, { courseId: id });
      alert("Added to wishlist!");
    } catch (err) {
      alert("Failed to add to wishlist");
      console.error(err);
    }
  };

  const handleProcessPayment = async (paymentMethod: string) => {
    try {
      const result = await client.request(PROCESS_PAYMENT_MUTATION, { courseId: id, paymentMethod }) as { processPayment: string };
      alert(result.processPayment);
    } catch (err) {
      alert("Payment failed");
      console.error(err);
    }
  };

  if (loading) {
    return <p>Loading course details...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!course) {
    return <p>Course not found.</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
      <p className="mb-2 text-gray-700 dark:text-gray-300">{course.description}</p>
      <p className="mb-2">
        <strong>Instructor:</strong> {course.instructor.name}
      </p>
      <p className="mb-2">
        <strong>Category:</strong> {course.category}
      </p>
      <p className="mb-2 text-blue-600 font-bold">${course.price.toFixed(2)}</p>
      <p className="mb-4">
        <strong>Rating:</strong> {course.rating} / 5
      </p>

      <h2 className="text-2xl font-semibold mb-2">Course Content</h2>
      <ul className="list-disc list-inside mb-6">
        {course.content.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <div className="mb-6 flex gap-4">
        <button
          onClick={async () => {
            try {
              await client.request(ENROLL_MUTATION, { courseId: course.id });
              alert("Enrolled successfully!");
            } catch (err) {
              alert("Enrollment failed");
              console.error(err);
            }
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Enroll Now
        </button>
        <button
          onClick={handleAddToWishlist}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
        >
          Add to Wishlist
        </button>
        <button
          onClick={() => handleProcessPayment("credit_card")}
          className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition-colors"
        >
          Buy Now
        </button>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
        {course.reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <ul className="space-y-4">
            {course.reviews.map((review) => (
              <li key={review.id} className="border rounded p-4 dark:bg-gray-800">
                {editingReview === review.id ? (
                  <div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium mb-1">Rating</label>
                      <select
                        value={editRating}
                        onChange={(e) => setEditRating(parseInt(e.target.value))}
                        className="border rounded p-1 dark:bg-gray-700"
                      >
                        {[1, 2, 3, 4, 5].map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium mb-1">Comment</label>
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        className="w-full border rounded p-2 dark:bg-gray-700"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateReview(review.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => setEditingReview(null)}
                        className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p><strong>{review.user.name}</strong> - {review.rating}/5</p>
                    <p>{review.comment}</p>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => {
                          setEditingReview(review.id);
                          setEditRating(review.rating);
                          setEditComment(review.comment);
                        }}
                        className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 p-4 border rounded dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-2">Add a Review</h3>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Rating</label>
            <select
              value={reviewRating}
              onChange={(e) => setReviewRating(parseInt(e.target.value))}
              className="border rounded p-1 dark:bg-gray-700"
            >
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Comment</label>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full border rounded p-2 dark:bg-gray-700"
              placeholder="Write your review..."
            />
          </div>
          <button
            onClick={handleAddReview}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit Review
          </button>
        </div>
      </section>

      <div className="mt-6">
        <Link href="/courses" className="text-blue-600 hover:underline">
          &larr; Back to Courses
        </Link>
      </div>
    </div>
  );
}
