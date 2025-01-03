import { useState } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { API_URL } from '../config';

function DownloadPage() {
  const [downloadCode, setDownloadCode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleDownload = async (e) => {
    e.preventDefault();
    if (!downloadCode) {
      setMessage(t('download.error.noCode'));
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting to download with code:', downloadCode);
      const response = await axios.get(`${API_URL}/download/${downloadCode}`, {
        responseType: 'blob',
        headers: {
          'Accept': '*/*',
        }
      });
      
      // Get filename from Content-Disposition header
      const contentDisposition = response.headers['content-disposition'];
      const contentType = response.headers['content-type'];
      
      let filename = 'downloaded-file';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+?)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      console.log('Download successful, content type:', contentType);
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      link.remove();
      setMessage(t('download.success'));
      setDownloadCode(''); // Clear the input after successful download
    } catch (error) {
      console.error('Download error:', error);
      if (error.response?.status === 404) {
        setMessage(t('download.error.invalid'));
      } else {
        setMessage(t('download.error.generic'));
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex-grow w-full">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 sm:text-5xl">{t('download.title')}</h1>
            <p className="text-lg text-gray-600 sm:text-xl">{t('download.subtitle')}</p>
          </div>

          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-4 sm:p-6 md:p-8">
              <form onSubmit={handleDownload} className="space-y-6">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 sm:text-base mb-2">
                    {t('download.form.label')}
                  </label>
                  <input
                    type="text"
                    id="code"
                    value={downloadCode}
                    onChange={(e) => setDownloadCode(e.target.value)}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 sm:text-base"
                    placeholder={t('download.form.placeholder')}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 sm:text-base"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('download.downloading')}
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                      {t('download.button')}
                    </span>
                  )}
                </button>
              </form>

              {message && (
                <div className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-blue-800 text-sm sm:text-base">{message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DownloadPage; 