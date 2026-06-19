import React, { useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import type { SampleUnit } from '@/types';

interface SampleUnitExplorerModalProps {
  open: boolean;
  onClose: () => void;
  sampleUnit: SampleUnit | null;
}

const SampleUnitExplorerModal: React.FC<SampleUnitExplorerModalProps> = ({ open, onClose, sampleUnit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!open || !sampleUnit || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = sampleUnit.imageUrl;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      // Draw detected distresses (simulated polygons)
      // In real app, you would have polygon coordinates. For demo we draw random shapes.
      sampleUnit.detectedDistresses.forEach((d, i) => {
        const color = d.severity === 'H' ? '#ef4444' : d.severity === 'M' ? '#f59e0b' : '#3b82f6';
        ctx.beginPath();
        const x = 100 + i * 150;
        const y = 100 + i * 80;
        ctx.arc(x, y, 30 + i * 10, 0, 2 * Math.PI);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = color + '40';
        ctx.fill();
        ctx.font = '14px Arial';
        ctx.fillStyle = '#000';
        ctx.fillText(`${d.type} (${d.severity})`, x - 30, y - 40);
      });
    };
  }, [open, sampleUnit]);

  if (!sampleUnit) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl w-full">
        <DialogHeader>
          <DialogTitle>Sample Unit: {sampleUnit.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Original with Overlay</p>
            <canvas ref={canvasRef} className="w-full border rounded-lg" />
          </div>
          <div>
            <p className="text-sm font-medium">Detected Distresses</p>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left">Type</th>
                    <th className="px-3 py-2 text-left">Severity</th>
                    <th className="px-3 py-2 text-left">Area (m²)</th>
                    <th className="px-3 py-2 text-left">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleUnit.detectedDistresses.map((d, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="px-3 py-2">{d.type}</td>
                      <td className="px-3 py-2">{d.severity}</td>
                      <td className="px-3 py-2">{d.area.toFixed(2)}</td>
                      <td className="px-3 py-2">{(d.confidence * 100).toFixed(0)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              <p>Pixel/mm factor: {sampleUnit.pixelToMmFactor}</p>
              <p>Note: {sampleUnit.note}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Close</button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SampleUnitExplorerModal;