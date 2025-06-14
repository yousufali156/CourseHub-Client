import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { BookOpen, Image, Clock, Users, Calendar, FileText } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const EditCourseButton = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [courseTitle, setCourseTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [duration, setDuration] = useState('');
  const [seats, setSeats] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/course/${id}`);
        const data = res.data;
        setCourseTitle(data.courseTitle);
        setShortDescription(data.shortDescription);
        setDescription(data.description || '');
        setImageURL(data.imageURL);
        setDuration(data.duration);
        setSeats(data.seats);
      } catch (err) {
        toast.error('Failed to load course');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    if (seats < 0 || isNaN(seats)) {
      toast.error('Seats must be a non-negative number');
      setUpdating(false);
      return;
    }

    try {
      await axios.put(`http://localhost:3000/course/${id}`, {
        courseTitle,
        shortDescription,
        description,
        imageURL,
        duration,
        seats: parseInt(seats),
      });

      await Swal.fire({
        icon: 'success',
        title: 'Course Updated',
        text: 'Update Successfully',
        confirmButtonColor: '#3085d6',
        timer: 1500,
        showConfirmButton: false,
      });

      navigate('/manage-course');
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="text-center py-10 text-lg text-gray-600">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 rounded-lg shadow-md mt-10 border border-gray-200 bg-gradient-to-r from-[#7DD6F6] to-[#797EF6]">
      <h2 className="text-3xl font-bold text-center text-white mb-6">Edit Course</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField id="courseTitle" icon={BookOpen} type="text" value={courseTitle} onChange={setCourseTitle} label="Course Title" />
        <TextAreaField id="shortDescription" icon={FileText} value={shortDescription} onChange={setShortDescription} label="Short Description" />
        <TextAreaField id="description" icon={FileText} value={description} onChange={setDescription} label="Description" />
        <InputField id="imageURL" icon={Image} type="url" value={imageURL} onChange={setImageURL} label="Image URL" />
        <InputField id="duration" icon={Clock} type="text" value={duration} onChange={setDuration} label="Duration" />
        <InputField id="seats" icon={Users} type="number" value={seats} onChange={setSeats} label="Seats" />
        <button
          type="submit"
          disabled={updating}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-xl hover:bg-green-700 transition duration-300 flex items-center justify-center space-x-2 shadow-md disabled:opacity-50"
        >
          {updating ? (
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
              <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4l4-4-4-4v4C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <>
              <Calendar size={20} /> <span>Update Course</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default EditCourseButton;

const InputField = ({ id, icon: Icon, type, value, onChange, label }) => (
  <div>
    <label htmlFor={id} className="text-white font-semibold block mb-1">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-white opacity-80" size={20} />
      <input
        id={id}
        type={type}
        className="w-full px-4 pl-10 py-3 rounded-lg border border-gray-300 text-lg text-gray-800"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  </div>
);

const TextAreaField = ({ id, icon: Icon, value, onChange, label }) => (
  <div>
    <label htmlFor={id} className="text-white font-semibold block mb-1">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-3 text-white opacity-80" size={20} />
      <textarea
        id={id}
        rows={3}
        className="w-full px-4 pl-10 py-3 rounded-lg border border-gray-300 text-lg text-gray-800"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      ></textarea>
    </div>
  </div>
);
