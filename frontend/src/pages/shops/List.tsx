import { Link } from 'react-router-dom';
import { useShops } from '../../api/shops';
import { Plus, Store } from 'lucide-react';

const ShopsList = () => {
    const { data: shops, isLoading, error } = useShops();

    if (isLoading) return <div className="p-4">Loading shops...</div>;
    if (error) return <div className="p-4 text-red-500">Error loading shops</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Store className="w-6 h-6 mr-2" />
                    Shops
                </h2>
                <Link
                    to="/shops/new"
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Shop
                </Link>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                <ul className="divide-y divide-gray-200">
                    {shops?.map((shop) => (
                        <li key={shop.id} className="hover:bg-gray-50 transition-colors">
                            <Link to={`/shops/${shop.id}`} className="block p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-lg font-medium text-gray-900 block">{shop.name}</span>
                                        <span className="text-sm text-gray-500">{shop.city} • Factory ID: {shop.factory_id}</span>
                                    </div>
                                    <span className="text-sm text-gray-400">ID: {shop.id}</span>
                                </div>
                            </Link>
                        </li>
                    ))}
                    {shops?.length === 0 && (
                        <li className="p-6 text-center text-gray-500">No shops found. Create one!</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default ShopsList;
