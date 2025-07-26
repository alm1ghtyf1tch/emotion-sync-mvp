import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Circle, Rect } from "fabric";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brush, Square, Circle as CircleIcon, Save, Upload, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<"select" | "draw" | "rectangle" | "circle">("draw");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 600,
      height: 400,
      backgroundColor: "#ffffff",
    });

    // Initialize the freeDrawingBrush
    canvas.freeDrawingBrush.color = "#333333";
    canvas.freeDrawingBrush.width = 3;
    canvas.isDrawingMode = true;

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = activeTool === "draw";
    
    if (activeTool === "draw" && fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = "#333333";
      fabricCanvas.freeDrawingBrush.width = 3;
    }
  }, [activeTool, fabricCanvas]);

  const handleToolClick = (tool: typeof activeTool) => {
    setActiveTool(tool);

    if (tool === "rectangle") {
      const rect = new Rect({
        left: 100,
        top: 100,
        fill: "#e0e0e0",
        stroke: "#333333",
        strokeWidth: 2,
        width: 100,
        height: 80,
      });
      fabricCanvas?.add(rect);
    } else if (tool === "circle") {
      const circle = new Circle({
        left: 100,
        top: 100,
        fill: "#e0e0e0",
        stroke: "#333333",
        strokeWidth: 2,
        radius: 50,
      });
      fabricCanvas?.add(circle);
    }
  };

  const handleSave = () => {
    if (!fabricCanvas) return;
    
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 0.8,
      multiplier: 1
    });
    
    const link = document.createElement('a');
    link.download = 'my-drawing.png';
    link.href = dataURL;
    link.click();
    
    toast("Drawing saved successfully!");
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !fabricCanvas) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        fabricCanvas.clear();
        fabricCanvas.renderAll();
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
    
    toast("Image imported successfully!");
  };

  const handleReset = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
    toast("Canvas cleared!");
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Drawing Space</h3>
          <div className="flex gap-2">
            <Button
              variant={activeTool === "draw" ? "default" : "outline"}
              size="sm"
              onClick={() => handleToolClick("draw")}
            >
              <Brush className="w-4 h-4" />
            </Button>
            <Button
              variant={activeTool === "rectangle" ? "default" : "outline"}
              size="sm"
              onClick={() => handleToolClick("rectangle")}
            >
              <Square className="w-4 h-4" />
            </Button>
            <Button
              variant={activeTool === "circle" ? "default" : "outline"}
              size="sm"
              onClick={() => handleToolClick("circle")}
            >
              <CircleIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="border border-border rounded-lg overflow-hidden bg-white">
          <canvas ref={canvasRef} className="max-w-full" />
        </div>

        <div className="flex gap-2 justify-center">
          <Button onClick={handleSave} variant="outline" size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save Drawing
          </Button>
          <Button onClick={handleImport} variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import Image
          </Button>
          <Button onClick={handleReset} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Canvas
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        <p className="text-sm text-muted-foreground text-center">
          Express your feelings through art. Drawing can be therapeutic and help process emotions.
        </p>
      </div>
    </Card>
  );
}