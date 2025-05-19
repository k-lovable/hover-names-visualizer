
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NameData, NameDataFile } from '@/types';
import { toast } from 'sonner';

const NameVisualization: React.FC = () => {
  const navigate = useNavigate();
  const [nameData, setNameData] = useState<NameData[]>([]);
  const [activeNameId, setActiveNameId] = useState<number | null>(null);
  const [imageUrl] = useState('/placeholder.svg'); // Default placeholder image

  useEffect(() => {
    const storedData = localStorage.getItem('nameData');
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData) as NameDataFile;
        setNameData(parsedData.names);
      } catch (error) {
        toast.error('Failed to load name data');
        navigate('/');
      }
    } else {
      toast.error('No name data found');
      navigate('/');
    }
  }, [navigate]);

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={handleBackClick}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Upload
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 h-full">
        {/* Names panel */}
        <Card className="md:w-1/3 h-[300px] md:h-auto overflow-hidden">
          <div className="p-4 border-b font-medium">Names</div>
          <ScrollArea className="h-[calc(100%-57px)] p-4">
            <ul className="space-y-2">
              {nameData.map((item, index) => (
                <li key={index}>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start font-normal"
                    onMouseEnter={() => setActiveNameId(index)} 
                    onMouseLeave={() => setActiveNameId(null)}
                  >
                    {item.name}
                  </Button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </Card>

        {/* Image visualization */}
        <Card className="md:w-2/3 h-[500px] md:h-auto overflow-hidden relative flex items-center justify-center">
          <div className="relative w-full h-full">
            <img 
              src={imageUrl} 
              alt="Visualization" 
              className="object-contain w-full h-full p-4"
            />
            {activeNameId !== null && (
              <div 
                className="absolute bg-primary text-primary-foreground px-3 py-1 rounded-md shadow-md z-10 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ 
                  left: `${nameData[activeNameId]?.x}%`, 
                  top: `${nameData[activeNameId]?.y}%` 
                }}
              >
                {nameData[activeNameId]?.name}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NameVisualization;
