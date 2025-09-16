import { gql } from "graphql-request";

export const GET_COURSES = gql`
  query GetCourses {
    courses {
      id
      title
      category
      price
      rating
      instructor
    }
  }
`;

export const GET_COURSE_DETAIL = gql`
  query GetCourseDetail($id: ID!) {
    course(id: $id) {
      id
      title
      description
      instructor {
        name
      }
      price
      rating
      category
      content
      reviews {
        id
        user {
          name
        }
        rating
        comment
      }
    }
  }
`;

export const SIGNIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation Signup($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export const GET_MY_COURSES = gql`
  query GetMyCourses {
    myCourses {
      id
      title
      description
      price
      category
      tags
      rating
      reviews {
        id
        rating
        comment
        user {
          name
        }
      }
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      role
    }
  }
`;

export const GET_ALL_COURSES = gql`
  query GetAllCourses {
    courses {
      id
      title
      instructor {
        name
      }
      price
      rating
    }
  }
`;

export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

export const DELETE_COURSE_MUTATION = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id)
  }
`;

export const ENROLL_MUTATION = gql`
  mutation Enroll($courseId: ID!) {
    enroll(courseId: $courseId)
  }
`;

export const GET_REVIEWS = gql`
  query GetReviews($courseId: ID!) {
    reviews(courseId: $courseId) {
      id
      user {
        name
      }
      rating
      comment
    }
  }
`;

export const ADD_REVIEW_MUTATION = gql`
  mutation AddReview($courseId: ID!, $rating: Int!, $comment: String!) {
    addReview(courseId: $courseId, rating: $rating, comment: $comment) {
      id
      rating
      comment
    }
  }
`;

export const UPDATE_REVIEW_MUTATION = gql`
  mutation UpdateReview($id: ID!, $rating: Int, $comment: String) {
    updateReview(id: $id, rating: $rating, comment: $comment) {
      id
      rating
      comment
    }
  }
`;

export const DELETE_REVIEW_MUTATION = gql`
  mutation DeleteReview($id: ID!) {
    deleteReview(id: $id)
  }
`;

export const CREATE_COURSE_MUTATION = gql`
  mutation CreateCourse($title: String!, $description: String!, $price: Float!, $category: String!, $tags: [String!]!) {
    createCourse(title: $title, description: $description, price: $price, category: $category, tags: $tags) {
      id
      title
      description
      price
      category
      tags
    }
  }
`;

export const UPDATE_COURSE_MUTATION = gql`
  mutation UpdateCourse($id: ID!, $title: String, $description: String, $price: Float, $category: String, $tags: [String!]) {
    updateCourse(id: $id, title: $title, description: $description, price: $price, category: $category, tags: $tags) {
      id
      title
      description
      price
      category
      tags
    }
  }
`;

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($name: String!, $email: String!, $password: String!, $role: String!) {
    createUser(name: $name, email: $email, password: $password, role: $role) {
      id
      name
      email
      role
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: ID!, $name: String, $email: String, $role: String) {
    updateUser(id: $id, name: $name, email: $email, role: $role) {
      id
      name
      email
      role
    }
  }
`;

export const ADD_TO_WISHLIST_MUTATION = gql`
  mutation AddToWishlist($courseId: ID!) {
    addToWishlist(courseId: $courseId)
  }
`;

export const REMOVE_FROM_WISHLIST_MUTATION = gql`
  mutation RemoveFromWishlist($courseId: ID!) {
    removeFromWishlist(courseId: $courseId)
  }
`;

export const PROCESS_PAYMENT_MUTATION = gql`
  mutation ProcessPayment($courseId: ID!, $paymentMethod: String!) {
    processPayment(courseId: $courseId, paymentMethod: $paymentMethod)
  }
`;

export const SEND_NOTIFICATION_MUTATION = gql`
  mutation SendNotification($userId: ID!, $message: String!) {
    sendNotification(userId: $userId, message: $message)
  }
`;

// Additional queries and mutations for wishlist, notifications can be added here
