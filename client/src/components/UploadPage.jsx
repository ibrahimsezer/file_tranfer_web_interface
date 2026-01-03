import { useState } from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { API_URL } from '../config';

function UploadPage() {
  const [file, setFile] = useState(null);
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage(t('upload.error.noFile'));
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Uploading file:', file.name);
      // DÜZELTME BURADA:
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          // 'Content-Type': 'multipart/form-data',  <-- BU SATIRI SİL! (Axios otomatik halleder)
          'Accept': 'application/json',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log('Upload progress:', percentCompleted + '%');
        },
      });
      setCode(response.data.code);
      setMessage(t('upload.success'));
    } catch (error) {
      // ... hata yakalama kısmı aynı kalabilir ...
      console.error('Upload error:', error);
      if (error.code === 'ERR_NETWORK') {
        setMessage(t('upload.error.serverError'));
      } else {
        setMessage(error.response?.data?.error || `Error uploading file: ${error.message}`);
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex-grow w-full">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 sm:text-5xl">{t('upload.title')}</h1>
            <p className="text-lg text-gray-600 sm:text-xl">{t('upload.subtitle')}</p>
          </div>

          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-4 sm:p-6 md:p-8">
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-40 sm:h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                      <CloudArrowUpIcon className="w-12 h-12 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm sm:text-base text-gray-500">
                        <span className="font-semibold">{t('upload.dropzone.title')}</span> {t('upload.dropzone.or')} {t('upload.dropzone.dragDrop')}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {t('upload.dropzone.supports')}
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.txt,.mp3,.mp4,.wav,.avi,.mov,.png,.jpg,.jpeg,.gif"
                    />
                  </label>
                </div>
                {file && (
                  <div className="text-sm text-gray-600 bg-white p-4 rounded-lg border">
                    <p className="mb-1">{t('upload.selected')}: {file.name}</p>
                    <p className="mb-1">{t('upload.type')}: {file.type || 'Unknown'}</p>
                    <p>{t('upload.size')}: {(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                )}
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
                      {t('upload.uploading')}
                    </span>
                  ) : t('upload.button')}
                </button>
              </form>
              {code && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-green-800 text-sm sm:text-base">{t('upload.code')}: <span className="font-mono font-bold">{code}</span></p>
                </div>
              )}
              {message && !code && (
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

export default UploadPage; 