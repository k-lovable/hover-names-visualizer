
import React, { useState, useEffect, useRef } from 'react';
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
  const [imageUrl] = useState('/bluebottle.png'); // Default placeholder image
  const canvasRef = useRef(null);

    useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || activeNameId === null) return;

    const ctx = canvas.getContext("2d");
    const { name, x, y } = nameData[activeNameId];

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // ---- Draw text with cylindrical distortion ----
    const centerX = (x / 100) * width;
    const centerY = (y / 100) * height;
    const text = name;

    ctx.font = "32px sans-serif";
    ctx.fillStyle = "#000";

    const radius = 100;
    const angleStep = (Math.PI / text.length) * 0.8;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const angle = (i - text.length / 2) * angleStep;

      const charX = centerX + Math.sin(angle) * radius;
      const charY = centerY + Math.cos(angle) * 10;

      ctx.save();
      ctx.translate(charX, charY);
      ctx.rotate(angle * 0.3);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
  }, [nameData, activeNameId]);


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
              alt="Bottle preview" 
              className="object-contain w-full h-full p-4"
            />
            <canvas
              ref={canvasRef}
              width={600}
              height={500}
              className="absolute left-0 top-0 w-full h-full pointer-events-none z-10"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NameVisualization;
