import React, { useState } from 'react';

const BookCreationForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [pages, setPages] = useState<Array<{ text: string; image: File | null }>>([]);

  const handleAddPage = () => {
    setPages([...pages, { text: '', image: null }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (coverImage) formData.append('coverImage', coverImage);
    pages.forEach((page, index) => {
      formData.append(`pages[${index}][text]`, page.text);
      if (page.image) formData.append(`pages[${index}][image]`, page.image);
    });

    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        alert('Book created successfully!');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error creating book:', error);
      alert('Failed to create book. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Create a New Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">Pages</h3>
          {pages.map((page, index) => (
            <div key={index} className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Page {index + 1}</label>
              <textarea
                value={page.text}
                onChange={(e) => {
                  const newPages = [...pages];
                  newPages[index].text = e.target.value;
                  setPages(newPages);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const newPages = [...pages];
                  newPages[index].image = e.target.files?.[0] || null;
                  setPages(newPages);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddPage}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition"
          >
            Add Page
          </button>
        </div>
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition"
        >
          Create Book
        </button>
      </form>
    </div>
  );
};

export default BookCreationForm;