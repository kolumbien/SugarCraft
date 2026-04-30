import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateShop } from '../../api/shops';
import { useFactories } from '../../api/factories';
import { ChevronLeft } from 'lucide-react';
import { CreateShopDTO } from '../../types';

const CreateShop = () => {
  const navigate = useNavigate();
  const createShop = useCreateShop();
  const { data: factories, isLoading: isLoadingFactories } = useFactories();

  const [formData, setFormData] = useState<CreateShopDTO>({
    name: '',
    city: '',
    factory_id: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.city.trim() || formData.factory_id === 0) {
      alert("Please fill all fields and select a valid factory.");
      return;
    }

    try {
      const shop = await createShop.mutateAsync(formData);
      navigate(`/shops/${shop.id}`);
    } catch (error: any) {
      console.error('Failed to create shop', error);
      const message = error.response?.data?.detail || 'Failed to create shop. Ensure the selected factory has at least one supplier.';
      alert(message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/shops')}
        className="flex items-center text-gray-500 hover:text-gray-700 mb-6"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Shops
      </button>

      <div className="bg-white shadow rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Shop</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              id="city"
              type="text"
              required
              value={formData.city}
              onChange={e => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div className="mb-8">
            <label htmlFor="factory_id" className="block text-sm font-medium text-gray-700 mb-1">Associated Factory</label>
            {isLoadingFactories ? (
              <div>Loading factories...</div>
            ) : (
              <select
                id="factory_id"
                required
                value={formData.factory_id}
                onChange={e => setFormData({ ...formData, factory_id: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              >
                <option value={0}>Select a Factory</option>
                {factories?.map(factory => (
                  <option key={factory.id} value={factory.id}>
                    {factory.name} ({factory.type})
                  </option>
                ))}
              </select>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Note: The factory must have at least one supplier to support a shop.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={createShop.isPending}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {createShop.isPending ? 'Saving...' : 'Save Shop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateShop;
