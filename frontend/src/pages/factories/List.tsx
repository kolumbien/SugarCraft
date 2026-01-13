import { Link } from 'react-router-dom';
import { useFactories } from '../../api/factories';
import { Plus, Factory } from 'lucide-react';

const FactoriesList = () => {
    const { data: factories, isLoading, error } = useFactories();

    if (isLoading) return <div className="p-4">Loading factories...</div>;
    if (error) return <div className="p-4 text-red-500">Error loading factories</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Factory className="w-6 h-6 mr-2" />
                    Factories
                </h2>
                <Link
                    to="/factories/new"
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Factory
                </Link>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                <ul className="divide-y divide-gray-200">
                    {factories?.map((factory) => (
                        <li key={factory.id} className="hover:bg-gray-50 transition-colors">
                            <Link to={`/factories/${factory.id}`} className="block p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-lg font-medium text-gray-900 block">{factory.name}</span>
                                        <span className="text-sm text-gray-500">{factory.type} • {factory.email}</span>
                                    </div>
                                    <span className="text-sm text-gray-400">ID: {factory.id}</span>
                                </div>
                            </Link>
                        </li>
                    ))}
                    {factories?.length === 0 && (
                        <li className="p-6 text-center text-gray-500">No factories found. Create one!</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default FactoriesList;
