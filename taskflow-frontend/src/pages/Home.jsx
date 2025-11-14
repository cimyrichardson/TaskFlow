import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, BarChart, Users, Shield } from 'lucide-react';
import Button from '../components/ui/Button';
import logo from '../assets/taskflow.png';

const Home = () => {
  const features = [
    {
      icon: CheckSquare,
      title: 'Gestion Simplifiée',
      description: 'Créez, organisez et suivez vos tâches en quelques clics avec une interface intuitive.'
    },
    {
      icon: BarChart,
      title: 'Statistiques Détaillées',
      description: 'Visualisez votre productivité avec des graphiques et analyses en temps réel.'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Partagez vos tâches et collaborez avec votre équipe (bientôt disponible).'
    },
    {
      icon: Shield,
      title: 'Sécurisé',
      description: 'Vos données sont protégées et sauvegardées en toute sécurité.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white rounded-2xl p-4 shadow-lg">
                <img src={logo} alt="TaskFlow Logo" className="h-12 w-12" />
                {/* <CheckSquare className="h-12 w-12 text-primary-600" /> */}
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Organisez votre vie avec
              <span className="text-primary-600 block">TaskFlow</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              La plateforme de gestion de tâches qui vous aide à rester productif, 
              organisé et concentré sur ce qui compte vraiment.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register">
                <Button size="large" className="text-lg px-8 py-4">
                  Commencer gratuitement
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="large" className="text-lg px-8 py-4">
                  Se connecter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir TaskFlow ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez les fonctionnalités qui font de TaskFlow votre meilleur allié productivité
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-6">
                  <div className="bg-primary-50 rounded-2xl p-4 inline-flex mb-4">
                    <Icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Prêt à booster votre productivité ?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Rejoignez des milliers d'utilisateurs qui ont transformé leur façon de travailler
          </p>
          <Link to="/register">
            <Button 
              size="large" 
              className="!bg-white !text-primary-600 hover:!bg-gray-100 text-lg px-8 py-4"
            >
              Créer mon compte gratuit
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <img src={logo} alt="TaskFlow Logo" className="h-12 w-12" />
            <span className="text-2xl font-bold">TaskFlow</span>
          </div>
          <p className="text-gray-400 mb-4">
            L'outil de gestion de tâches qui simplifie votre quotidien.
          </p>
          <p className="text-gray-500 text-sm">
            © 2025 TaskFlow. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;