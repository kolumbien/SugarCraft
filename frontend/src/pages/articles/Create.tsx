import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateArticle } from '../../api/articles';
import { ChevronLeft } from 'lucide-react';

const CreateArticle = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const createArticle = useCreateArticle();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const article = await createArticle.mutateAsync({ name });
      navigate(`/articles/${article.id}`);
    } catch (error) {
      console.error('Failed to create article', error);
      alert('Failed to create article');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/articles')}
        className="flex items-center text-gray-500 hover:text-gray-700 mb-6"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Articles
      </button>

      <div className="bg-white shadow rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Article</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Article Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g. Vanilla Ice Cream"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={createArticle.isPending}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {createArticle.isPending ? 'Saving...' : 'Save Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateArticle;
