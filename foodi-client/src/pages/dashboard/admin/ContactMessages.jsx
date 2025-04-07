import React, { useEffect, useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/contact');
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        const response = await fetch(`http://localhost:8080/api/v1/contact/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete message');

        setMessages(messages.filter(message => message.id !== id));
        
        Swal.fire(
          'Deleted!',
          'Message has been deleted.',
          'success'
        );
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      Swal.fire(
        'Error!',
        'Failed to delete message.',
        'error'
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4">Contact Messages</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          {/* head */}
          <thead className="bg-green text-white rounded-lg">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message, index) => (
              <tr key={message.id}>
                <td>{index + 1}</td>
                <td>{message.name}</td>
                <td>{message.email}</td>
                <td>{message.subject}</td>
                <td>
                  <div className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                    {message.message}
                  </div>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(message.id)}
                    className="btn btn-sm bg-red text-white hover:bg-red-600"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactMessages; 