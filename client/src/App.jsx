import { useState } from 'react';
import { CloudArrowUpIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import UploadPage from './components/UploadPage';
import DownloadPage from './components/DownloadPage';
import LanguageSwitcher from './components/LanguageSwitcher';

function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex space-x-6">
            <a
              href="https://github.com/ibrahimsezer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/ibrahim-sezer/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <span className="sr-only">LinkedIn</span>
              <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a
              href="https://ibrahimsezer.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <span className="sr-only">Website</span>
              <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </a>
          </div>
          <p className="text-gray-500 text-sm sm:text-base">
            © {new Date().getFullYear()} Ibrahim Sezer. {t('common.footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const { t } = useTranslation();

  const renderHome = () => (
    <div className="flex-grow w-full">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 sm:text-5xl">{t('common.title')}</h1>
            <p className="text-lg text-gray-600 sm:text-xl">{t('common.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Upload Button */}
            <button
              onClick={() => setCurrentPage('upload')}
              className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 space-y-4 border-2 border-transparent hover:border-indigo-500"
            >
              <CloudArrowUpIcon className="w-16 h-16 text-indigo-600" />
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('home.upload.title')}</h2>
                <p className="text-gray-600">{t('home.upload.description')}</p>
              </div>
            </button>

            {/* Download Button */}
            <button
              onClick={() => setCurrentPage('download')}
              className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 space-y-4 border-2 border-transparent hover:border-indigo-500"
            >
              <ArrowDownTrayIcon className="w-16 h-16 text-indigo-600" />
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('home.download.title')}</h2>
                <p className="text-gray-600">{t('home.download.description')}</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col w-full bg-gradient-to-b from-gray-50 to-gray-100">
      <LanguageSwitcher />
      
      {/* Navigation */}
      {currentPage !== 'home' && (
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <button
                  onClick={() => setCurrentPage('home')}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
                >
                  {t('common.backToHome')}
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      {currentPage === 'home' && renderHome()}
      {currentPage === 'upload' && <UploadPage />}
      {currentPage === 'download' && <DownloadPage />}

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
