import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import axios from "axios";

const dummyReviews = [
  {
    userName: "John Doe",
    rating: 5,
    comment: "Excellent service and very professional staff!",
    date: "2024-03-15"
  },
  {
    userName: "Jane Smith",
    rating: 4,
    comment: "Good experience overall. Quick and efficient.",
    date: "2024-03-10"
  },
  {
    userName: "Mike Johnson",
    rating: 5,
    comment: "Very clean facility and helpful staff.",
    date: "2024-03-05"
  }
];

const ReviewForm = ({ hospitalId, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userName = localStorage.getItem('userName') || 'Anonymous';  // Add this line

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`http://localhost:5000/api/hospitals/${hospitalId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ rating, comment, userName })  // Include userName in the request
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      const data = await response.json();
      const reviewWithUserName = { ...data.review, userName };  // Add userName to the review
      toast.success('Review submitted successfully!');
      onReviewAdded(reviewWithUserName);
      setComment('');
      setRating(5);
    } catch (error) {
      toast.error('Failed to submit review. Please try again.');
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Add Your Review</h3>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          rows="4"
          required
          placeholder="Share your experience..."
        ></textarea>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

const RequestForm = ({ hospitalId }) => {
  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: '',
    unitsRequired: 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to make a blood request');
        navigate('/login');
        return;
      }

      // Validate input
      if (!formData.patientName.trim() || !formData.bloodGroup || formData.unitsRequired < 1) {
        toast.error('Please fill all required fields');
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/hospitals/${hospitalId}/request-blood`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send request');
      }

      toast.success('Blood request sent successfully!');
      setFormData({ patientName: '', bloodGroup: '', unitsRequired: 1 });

    } catch (error) {
      console.error('Request error:', error);
      toast.error(error.message || 'Failed to send request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Request Blood</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Patient Name</label>
          <input
            type="text"
            required
            value={formData.patientName}
            onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Blood Group</label>
          <select
            required
            value={formData.bloodGroup}
            onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Blood Group</option>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Units Required</label>
          <input
            type="number"
            min="1"
            required
            value={formData.unitsRequired}
            onChange={(e) => setFormData({ ...formData, unitsRequired: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Sending Request...' : 'Send Request'}
        </button>
      </form>
    </div>
  );
};

const HospitalPage = () => {
  const { id } = useParams();
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState(dummyReviews);  // Initialize with dummy reviews

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/hospitals/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Include auth token if required
            ...(localStorage.getItem('token') && {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            })
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Hospital data received:", data); // Debug log
        setHospital(data);
        setReviews(data.reviews?.length ? data.reviews : dummyReviews); // Use dummy reviews if no real reviews exist
      } catch (err) {
        console.error("Error fetching hospital data:", err);
        setError("Failed to load hospital data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalData();
  }, [id]);

  const handleReviewAdded = (newReview) => {
    setReviews(prevReviews => [newReview, ...prevReviews]);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-xl">Loading...</div>
    </div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-xl text-red-600">{error}</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hospital Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{hospital?.hospitalName}</h1>
          <p className="text-gray-600 mb-4">
            {hospital?.location?.city}, {hospital?.location?.state}
          </p>
          
          {/* Blood Inventory */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Blood Types</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {hospital?.inventory && Object.entries(hospital.inventory).map(([type, quantity]) => (
              <div key={type} className="bg-gray-50 p-4 rounded-lg">
                <div className="text-lg font-medium text-gray-900">
                  {type.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div className="text-2xl font-bold text-blue-600">{quantity} units</div>
              </div>
            ))}
          </div>
        </div>

        {/* Add RequestForm */}
        <RequestForm hospitalId={id} />

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
          
          {/* Review Form */}
          <ReviewForm hospitalId={id} onReviewAdded={handleReviewAdded} />
          
          {/* Reviews List */}
          <div className="space-y-6 mt-8">
            {reviews.map((review, index) => (
              <div key={index} className="border-b pb-6 last:border-b-0">
                <div className="flex items-center mb-2">
                  <span className="text-lg font-semibold text-gray-900">{review.userName}</span>
                  <span className="ml-2 text-gray-500">• {new Date(review.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center mb-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalPage;
