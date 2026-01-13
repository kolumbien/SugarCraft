import { Link } from 'react-router-dom';
import { useArticles } from '../../api/articles';
import { Plus, ShoppingBag } from 'lucide-react';

const ArticlesList = () => {
    const { data: articles, isLoading, error } = useArticles();

    if (isLoading) return <div className="p-4">Loading articles...</div>;
    if (error) return <div className="p-4 text-red-500">Error loading articles</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <ShoppingBag className="w-6 h-6 mr-2" />
                    Articles
                </h2>
                <Link
                    to="/articles/new"
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Article
                </Link>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                <ul className="divide-y divide-gray-200">
                    {articles?.map((article) => (
                        <li key={article.id} className="hover:bg-gray-50 transition-colors">
                            <Link to={`/articles/${article.id}`} className="block p-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-medium text-gray-900">{article.name}</span>
                                    <span className="text-sm text-gray-400">ID: {article.id}</span>
                                </div>
                            </Link>
                        </li>
                    ))}
                    {articles?.length === 0 && (
                        <li className="p-6 text-center text-gray-500">No articles found. Create one!</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default ArticlesList;
