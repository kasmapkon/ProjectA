import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { productAPI } from '../../api/api';

const ImportData: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{ success: boolean; message: string; count?: number } | null>(null);
  const [replaceAll, setReplaceAll] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
    setFile(null);
    setResult(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setJsonInput('');
      setResult(null);
    }
  };

  const readJsonFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error('Không thể đọc file'));
        }
      };
      reader.onerror = () => {
        reject(new Error('Lỗi khi đọc file'));
      };
      reader.readAsText(file);
    });
  };

  const isValidJson = (str: string): boolean => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleImport = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      let jsonData: string = '';

      if (file) {
        jsonData = await readJsonFile(file);
      } else if (jsonInput) {
        jsonData = jsonInput;
      } else {
        throw new Error('Vui lòng nhập dữ liệu JSON hoặc chọn file JSON');
      }

      if (!isValidJson(jsonData)) {
        throw new Error('Định dạng JSON không hợp lệ');
      }

      const parsedData = JSON.parse(jsonData);
      
      const result = await productAPI.importFromJson(parsedData, replaceAll);
      
      setResult(result);
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || 'Có lỗi xảy ra khi nhập dữ liệu'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setJsonInput('');
    setFile(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Nhập dữ liệu sản phẩm từ JSON</h1>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Tải lên dữ liệu sản phẩm dạng JSON hoặc dán trực tiếp dữ liệu vào ô bên dưới.
            Cấu trúc dữ liệu phải đúng định dạng của hệ thống.
          </p>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Lưu ý:</strong> Tùy chọn "Thay thế tất cả dữ liệu" sẽ xóa toàn bộ dữ liệu sản phẩm
                  hiện có và thay thế bằng dữ liệu mới. Hãy cân nhắc kỹ trước khi sử dụng.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={replaceAll}
                onChange={() => setReplaceAll(!replaceAll)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700">Thay thế tất cả dữ liệu hiện có</span>
            </label>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-4 text-center">
              Kéo thả file JSON hoặc nhấn vào đây để chọn file
            </p>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Chọn File
            </button>
            {file && (
              <div className="mt-4 flex items-center">
                <FileText className="h-5 w-5 text-purple-600 mr-2" />
                <span className="text-sm text-gray-800">{file.name}</span>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hoặc dán dữ liệu JSON trực tiếp:
            </label>
            <textarea
              value={jsonInput}
              onChange={handleTextChange}
              placeholder='{"flower1": {"name": "Bó Hoa Hồng", "code": "flower1", "price": 450000, ...}}'
              className="w-full h-40 px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            ></textarea>
          </div>
        </div>
        
        {result && (
          <div className={`mb-6 p-4 rounded-md ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                  {result.success ? 'Import thành công' : 'Import thất bại'}
                </h3>
                <div className={`mt-2 text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                  <p>{result.message}</p>
                  {result.success && result.count && (
                    <p className="mt-1">Số sản phẩm được nhập: {result.count}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleImport}
            disabled={isLoading || (!jsonInput && !file)}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-2" />
                Nhập dữ liệu
              </>
            )}
          </button>
          
          <button
            onClick={handleClear}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
          >
            Xóa dữ liệu
          </button>
        </div>
      </div>
      
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Cấu trúc dữ liệu mẫu</h2>
        <p className="text-gray-600 mb-4">
          Dữ liệu JSON cần có cấu trúc như ví dụ dưới đây:
        </p>
        <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm">
          {`{
  "flower1": {
    "name": "Bó Hoa Hồng",
    "code": "flower1",
    "price": 450000,
    "discountPrice": 400000,
    "description": "Bó hoa hồng đỏ tươi",
    "image": "https://example.com/rose.jpg",
    "categoryId": 1,
    "stock": 100,
    "bestSeller": true,
    "featured": true
  }
}`}
        </pre>
      </div>
    </div>
  );
};

export default ImportData; 