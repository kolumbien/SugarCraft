import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateFactory } from '../../api/factories';
import { useArticles } from '../../api/articles';
import { ChevronLeft } from 'lucide-react';
import { CreateFactoryDTO } from '../../types';

const CreateFactory = () => {
  const navigate = useNavigate();
  const createFactory = useCreateFactory();
  const { data: articles, isLoading: isLoadingArticles } = useArticles();

  const [formData, setFormData] = useState<Omit<CreateFactoryDTO, 'article_ids'>>({
    name: '',
    type: 'local',
    email: '',
  });
  const [selectedArticles, setSelectedArticles] = useState<number[]>([]);

  const handleArticleToggle = (articleId: number) => {
    if (selectedArticles.includes(articleId)) {
      setSelectedArticles(selectedArticles.filter(id => id !== articleId));
    } else {
      if (selectedArticles.length >= 2) {
        alert("You can only select up to 2 articles.");
        return;
      }
      setSelectedArticles([...selectedArticles, articleId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    try {
      const factory = await createFactory.mutateAsync({
        ...formData,
        article_ids: selectedArticles
      });
      navigate(`/factories/${factory.id}`);
    } catch (error) {
      console.error('Failed to create factory', error);
      alert('Failed to create factory');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/factories')}
        className="flex items-center text-gray-500 hover:text-gray-700 mb-6"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Factories
      </button>

      <div className="bg-white shadow rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Factory</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Factory Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value as 'local' | 'international' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="local">Local</option>
              <option value="international">International</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Articles (Max 2)
            </label>
            {isLoadingArticles ? (
              <div>Loading articles...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {articles?.map(article => (
                  <div
                    key={article.id}
                    onClick={() => handleArticleToggle(article.id)}
                    className={`
                      p - 3 rounded - lg border cursor - pointer transition - colors flex items - center justify - between
                      ${selectedArticles.includes(article.id)
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'border-gray-200 hover:border-emerald-300'
                      }
                `}
                  >
                    <span>{article.name}</span>
                    {selectedArticles.includes(article.id) && (
                      <span className="text-emerald-600 font-bold">✓</span>
                    )}
                  </div>
                ))}
                {articles?.length === 0 && <div className="text-gray-500">No articles available.</div>}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Selected: {selectedArticles.length}/2
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={createFactory.isPending}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {createFactory.isPending ? 'Saving...' : 'Save Factory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFactory;
