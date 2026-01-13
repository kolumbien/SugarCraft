import { Link } from 'react-router-dom';
import { ShoppingBag, Factory, Store, ArrowRight } from 'lucide-react';

const Dashboard = () => {
    const cards = [
        {
            title: 'Articles',
            description: 'Manage ice creams, cakes, and ingredients.',
            icon: ShoppingBag,
            path: '/articles',
            color: 'bg-blue-500',
        },
        {
            title: 'Factories',
            description: 'Manage production factories and suppliers.',
            icon: Factory,
            path: '/factories',
            color: 'bg-emerald-500',
        },
        {
            title: 'Shops',
            description: 'Manage retail shops and inventory.',
            icon: Store,
            path: '/shops',
            color: 'bg-purple-500',
        },
    ];

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Welcome to SugarCraft</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Link
                            key={card.path}
                            to={card.path}
                            className="block group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center mb-4 text-white`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                                {card.title}
                            </h3>
                            <p className="text-gray-500 mb-4">{card.description}</p>
                            <div className="flex items-center text-sm font-medium text-primary-600">
                                Go to {card.title}
                                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default Dashboard;
