import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useArticle, useCreateIngredient } from '../../api/articles';
import { ChevronLeft, Plus } from 'lucide-react';

const ArticleDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const articleId = parseInt(id || '0');

    const { data: article, isLoading, error } = useArticle(articleId);
    const createIngredient = useCreateIngredient(articleId);
    const [newIngredientName, setNewIngredientName] = useState('');
    const [showAddIngredient, setShowAddIngredient] = useState(false);

    if (isLoading) return <div>Loading...</div>;
    if (error || !article) return <div>Error loading article details</div>;

    const handleAddIngredient = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newIngredientName.trim()) return;

        try {
            await createIngredient.mutateAsync({ name: newIngredientName });
            setNewIngredientName('');
            setShowAddIngredient(false);
        } catch (err) {
            console.error('Failed to add ingredient', err);
            alert('Failed to add ingredient');
        }
    };

    return (
        <div>
            <button
                onClick={() => navigate('/articles')}
                className="flex items-center text-gray-500 hover:text-gray-700 mb-6"
            >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Articles
            </button>

            <div className="bg-white shadow rounded-lg p-8 mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{article.name}</h2>
                <div className="text-sm text-gray-500">Article ID: {article.id}</div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                <div className="p-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Ingredients</h3>
                    {!showAddIngredient && (
                        <button
                            onClick={() => setShowAddIngredient(true)}
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Ingredient
                        </button>
                    )}
                </div>

                {showAddIngredient && (
                    <div className="p-6 border-b border-gray-200 bg-gray-50">
                        <form onSubmit={handleAddIngredient} className="flex gap-4">
                            <input
                                type="text"
                                value={newIngredientName}
                                onChange={(e) => setNewIngredientName(e.target.value)}
                                placeholder="Ingredient name"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                autoFocus
                            />
                            <button
                                type="submit"
                                disabled={createIngredient.isPending}
                                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAddIngredient(false)}
                                className="text-gray-600 hover:text-gray-900 px-4 py-2"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                )}

                <ul className="divide-y divide-gray-200">
                    {article.ingredients?.map((ingredient) => (
                        <li key={ingredient.id} className="p-4 flex justify-between items-center bg-white hover:bg-gray-50">
                            <span className="text-gray-900">{ingredient.name}</span>
                            <span className="text-xs text-gray-400">ID: {ingredient.id}</span>
                        </li>
                    ))}
                    {(!article.ingredients || article.ingredients.length === 0) && (
                        <li className="p-6 text-center text-gray-500">
                            No ingredients yet. Add at least one to complete this article.
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default ArticleDetails;
