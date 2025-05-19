
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { NameDataFile } from '@/types';

const FileUpload: React.FC = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const processFile = useCallback((file: File) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target?.result as string) as NameDataFile;
        
        // Validate the JSON structure
        if (!jsonData.names || !Array.isArray(jsonData.names)) {
          throw new Error('Invalid JSON format. Expected an object with a "names" array.');
        }
        
        // Check if each name has the required properties
        for (const item of jsonData.names) {
          if (typeof item.name !== 'string' || typeof item.x !== 'number' || typeof item.y !== 'number') {
            throw new Error('Each name must have name (string), x (number), and y (number) properties.');
          }
        }

        // Store the data in local storage
        localStorage.setItem('nameData', JSON.stringify(jsonData));
        
        toast.success('JSON file successfully loaded!');
        navigate('/visualize');
      } catch (error) {
        console.error('Error parsing JSON:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to parse JSON file.');
      }
    };

    reader.onerror = () => {
      toast.error('Error reading file.');
    };

    reader.readAsText(file);
  }, [navigate]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      if (file.type !== 'application/json') {
        toast.error('Please upload a JSON file.');
        return;
      }
      
      processFile(file);
    }
  }, [processFile]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  }, [processFile]);

  return (
    <div className="mx-auto max-w-xl w-full">
      <Card>
        <CardContent className="pt-6">
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">Drag and drop your JSON file</h3>
            <p className="mt-2 text-sm text-gray-500">
              Or click the button below to browse
            </p>
            
            <div className="mt-6">
              <label htmlFor="file-upload">
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept="application/json"
                  className="sr-only"
                  onChange={handleFileInputChange}
                />
                <Button type="button" onClick={() => document.getElementById('file-upload')?.click()}>
                  Browse Files
                </Button>
              </label>
            </div>
            
            <div className="mt-6 text-xs text-gray-500">
              <p>The JSON file should have the following format:</p>
              <pre className="mt-2 bg-gray-100 p-3 rounded text-left overflow-auto">
{`{
  "names": [
    { "name": "John Doe", "x": 30, "y": 40 },
    { "name": "Jane Smith", "x": 70, "y": 60 }
  ]
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUpload;
