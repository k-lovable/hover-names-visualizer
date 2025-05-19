
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NameData, NameDataFile } from '@/types';
import { toast } from 'sonner';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function createLabelTexture(text: string): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 360;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#111';
  ctx.font = 'normal 80px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function LabelCylinder({ labelText }: { labelText: any }) {

  console.log(labelText)
  const materialRef = useRef<THREE.MeshBasicMaterial>(null!);

  const texture = useMemo(() => createLabelTexture(labelText), [labelText]);

  useEffect(() => {
    materialRef.current.map = texture;
    materialRef.current.needsUpdate = true;
  }, [texture]);

  const color = new THREE.Color().setHex( 0x112233 );

  return (
    <mesh position={[0, -0.63, -2]} rotation={[0.09, Math.PI, 0]} scale={[1, 1, 1]}>
      <cylinderGeometry args={[0.5, 0.5, 0.5, 256, 1, true]} />
      <meshBasicMaterial
        ref={materialRef}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

const NameVisualization: React.FC = () => {
  const navigate = useNavigate();
  const [nameData, setNameData] = useState<NameData[]>([]);
  const [activeNameId, setActiveNameId] = useState<number | null>(null);
  const [imageUrl] = useState('/bluebottle.png'); // Default placeholder image
  const canvasRef = useRef(null);
  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   if (!canvas || activeNameId === null) return;
  
  //   const ctx = canvas.getContext("2d");
  //   const { name } = nameData[activeNameId];
  
  //   const width = canvas.width;
  //   const height = canvas.height;
  
  //   ctx.clearRect(0, 0, width, height);
  
  //   // Fixed label position (middle of white rectangle)
  //   const centerX = width * 0.5;
  //   const centerY = height * 0.73;
  
  //   const fontSize = 16;
  //   const radius = 60;
  //   const verticalBend = 8;
  //   const angleMultiplier = 0.2;
  //   const angleStepBase = 0.6;
  
  //   ctx.font = `${fontSize}px sans-serif`;
  //   ctx.fillStyle = "#111";
  //   ctx.textBaseline = "middle";
  //   ctx.textAlign = "center";
  
  //   const angleStep = (Math.PI / name.length) * angleStepBase;
  
  //   for (let i = 0; i < name.length; i++) {
  //     const char = name[i];
  //     const angle = (i - name.length / 2) * angleStep;
  
  //     const charX = centerX + Math.sin(angle) * radius;
  //     const charY = centerY + Math.cos(angle) * verticalBend;
  
  //     ctx.save();
  //     ctx.translate(charX, charY);
  //     ctx.rotate(angle * angleMultiplier);
  //     ctx.fillText(char, 0, 0);
  //     ctx.restore();
  //   }
  // }, [nameData, activeNameId]);
  


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
          <div className="relative w-[500px] h-[600px] mx-auto">
          <img
            src="/bluebottle.png" // or your actual public path
            className="absolute top-0 left-0 w-full h-full object-contain z-0"
            alt="Bottle"
          />
          <Canvas
            className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
            camera={{ position: [0, 0, 5], fov: 30 }}
          >
            <ambientLight intensity={10} />
            <LabelCylinder labelText={nameData[activeNameId] ? nameData[activeNameId].name : ''} />
          </Canvas>
        </div>
        </Card>
      </div>
    </div>
  );
};

export default NameVisualization;
