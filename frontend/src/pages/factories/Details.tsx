import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFactory, useCreateSupplier } from '../../api/factories';
import { ChevronLeft, Plus } from 'lucide-react';
import { CreateSupplierDTO } from '../../types';

const FactoryDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const factoryId = parseInt(id || '0');

    const { data: factory, isLoading, error } = useFactory(factoryId);
    const createSupplier = useCreateSupplier(factoryId);

    const [showAddSupplier, setShowAddSupplier] = useState(false);
    const [newSupplier, setNewSupplier] = useState<CreateSupplierDTO>({ name: '', country: '' });

    if (isLoading) return <div>Loading...</div>;
    if (error || !factory) return <div>Error loading factory details</div>;

    const handleAddSupplier = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSupplier.name.trim() || !newSupplier.country.trim()) return;

        try {
            await createSupplier.mutateAsync(newSupplier);
            setNewSupplier({ name: '', country: '' });
            setShowAddSupplier(false);
        } catch (err) {
            console.error('Failed to add supplier', err);
            alert('Failed to add supplier');
        }
    };

    return (
        <div>
            <button
                onClick={() => navigate('/factories')}
                className="flex items-center text-gray-500 hover:text-gray-700 mb-6"
            >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Factories
            </button>

            <div className="bg-white shadow rounded-lg p-8 mb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{factory.name}</h2>
                        <div className="space-y-1 text-gray-600">
                            <p>Type: <span className="font-medium capitalize">{factory.type}</span></p>
                            <p>Email: <span className="font-medium">{factory.email}</span></p>
                        </div>
                    </div>
                    <div className="text-sm text-gray-400">ID: {factory.id}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Suppliers Section */}
                <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                    <div className="p-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">Suppliers</h3>
                        {!showAddSupplier && (
                            <button
                                onClick={() => setShowAddSupplier(true)}
                                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Add Supplier
                            </button>
                        )}
                    </div>

                    {showAddSupplier && (
                        <div className="p-6 border-b border-gray-200 bg-gray-50">
                            <form onSubmit={handleAddSupplier} className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        value={newSupplier.name}
                                        onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                                        placeholder="Supplier Name"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={newSupplier.country}
                                        onChange={(e) => setNewSupplier({ ...newSupplier, country: e.target.value })}
                                        placeholder="Country"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddSupplier(false)}
                                        className="text-gray-600 hover:text-gray-900 px-4 py-2 text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createSupplier.isPending}
                                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 text-sm"
                                    >
                                        Save Supplier
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <ul className="divide-y divide-gray-200">
                        {factory.suppliers?.map((supplier) => (
                            <li key={supplier.id} className="p-4 flex justify-between items-center bg-white hover:bg-gray-50">
                                <div>
                                    <p className="font-medium text-gray-900">{supplier.name}</p>
                                    <p className="text-sm text-gray-500">{supplier.country}</p>
                                </div>
                                <span className="text-xs text-gray-400">ID: {supplier.id}</span>
                            </li>
                        ))}
                        {(!factory.suppliers || factory.suppliers.length === 0) && (
                            <li className="p-6 text-center text-gray-500">
                                No suppliers yet. Add at least one to allow Shop creation.
                            </li>
                        )}
                    </ul>
                </div>

                {/* Produced Articles Section */}
                <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                    <div className="p-6 bg-gray-50 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Produced Articles</h3>
                    </div>
                    <ul className="divide-y divide-gray-200">
                        {factory.articles?.map((article) => (
                            <li key={article.id} className="p-4 bg-white">
                                <span className="text-gray-900">{article.name}</span>
                            </li>
                        ))}
                        {(!factory.articles || factory.articles.length === 0) && (
                            <li className="p-6 text-center text-gray-500">
                                No articles assigned.
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default FactoryDetails;
