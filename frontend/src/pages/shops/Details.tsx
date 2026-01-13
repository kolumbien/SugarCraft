import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop, useDeleteShop } from '../../api/shops';
import { ChevronLeft, Trash2 } from 'lucide-react';

const ShopDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const shopId = parseInt(id || '0');

    const { data: shop, isLoading, error } = useShop(shopId);
    const deleteShop = useDeleteShop();

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    if (isLoading) return <div>Loading...</div>;
    if (error || !shop) return <div>Error loading shop details</div>;

    const handleDelete = async () => {
        try {
            await deleteShop.mutateAsync(shopId);
            navigate('/shops');
        } catch (err) {
            console.error('Failed to delete shop', err);
            alert('Failed to delete shop');
        }
    };

    if (showDeleteConfirm) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Shop?</h3>
                    <p className="text-gray-600 mb-6">
                        Are you sure you want to delete <span className="font-semibold">{shop.name}</span>?
                        This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={deleteShop.isPending}
                            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg disabled:opacity-50"
                        >
                            {deleteShop.isPending ? 'Deleting...' : 'Confirm Delete'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-start mb-6">
                <button
                    onClick={() => navigate('/shops')}
                    className="flex items-center text-gray-500 hover:text-gray-700"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back to Shops
                </button>
                <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center text-red-600 hover:text-red-700 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Shop
                </button>
            </div>

            <div className="bg-white shadow rounded-lg p-8 mb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{shop.name}</h2>
                        <div className="space-y-1 text-gray-600">
                            <p>City: <span className="font-medium">{shop.city}</span></p>
                            {shop.factory && (
                                <p>Supplied by: <span className="font-medium text-purple-600">{shop.factory.name}</span></p>
                            )}
                        </div>
                    </div>
                    <div className="text-sm text-gray-400">ID: {shop.id}</div>
                </div>
            </div>

            {/* Available Articles Section */}
            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                <div className="p-6 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Available Articles</h3>
                    <p className="text-sm text-gray-500 mt-1">Products supplied by {shop.factory?.name || 'Factory'}</p>
                </div>
                <ul className="divide-y divide-gray-200">
                    {shop.factory?.articles?.map((article) => (
                        <li key={article.id} className="p-4 bg-white">
                            <span className="text-gray-900 font-medium">{article.name}</span>
                        </li>
                    ))}
                    {(!shop.factory?.articles || shop.factory.articles.length === 0) && (
                        <li className="p-6 text-center text-gray-500">
                            No articles currently available from this factory.
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default ShopDetails;
