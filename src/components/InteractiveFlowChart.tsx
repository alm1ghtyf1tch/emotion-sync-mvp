import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  MarkerType,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define different chart types and their corresponding data
const chartConfigs = {
  moodFlow: {
    name: "Mood Flow Analysis",
    initialNodes: [
      {
        id: '1',
        type: 'input' as const,
        data: { label: 'Daily Mood Check-in' },
        position: { x: 250, y: 0 },
        style: { background: '#e1f5fe', border: '2px solid #29b6f6' }
      },
      {
        id: '2',
        type: 'default' as const,
        data: { label: 'Emotion Processing' },
        position: { x: 100, y: 100 },
        style: { background: '#f3e5f5', border: '2px solid #ab47bc' }
      },
      {
        id: '3',
        type: 'default' as const,
        data: { label: 'Trigger Analysis' },
        position: { x: 400, y: 100 },
        style: { background: '#fff3e0', border: '2px solid #ff9800' }
      },
      {
        id: '4',
        type: 'default' as const,
        data: { label: 'Coping Strategies' },
        position: { x: 250, y: 200 },
        style: { background: '#e8f5e8', border: '2px solid #4caf50' }
      },
      {
        id: '5',
        type: 'output' as const,
        data: { label: 'Emotional Insight' },
        position: { x: 250, y: 300 },
        style: { background: '#fce4ec', border: '2px solid #e91e63' }
      }
    ] as Node[],
    initialEdges: [
      { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', animated: true },
      { id: 'e1-3', source: '1', target: '3', type: 'smoothstep', animated: true },
      { id: 'e2-4', source: '2', target: '4', type: 'smoothstep' },
      { id: 'e3-4', source: '3', target: '4', type: 'smoothstep' },
      { id: 'e4-5', source: '4', target: '5', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } }
    ] as Edge[]
  },
  therapyFlow: {
    name: "Therapy Session Flow",
    initialNodes: [
      {
        id: '1',
        type: 'input' as const,
        data: { label: 'Session Start' },
        position: { x: 300, y: 0 },
        style: { background: '#e3f2fd', border: '2px solid #2196f3' }
      },
      {
        id: '2',
        type: 'default' as const,
        data: { label: 'Check-in & Assessment' },
        position: { x: 300, y: 100 },
        style: { background: '#f1f8e9', border: '2px solid #8bc34a' }
      },
      {
        id: '3',
        type: 'default' as const,
        data: { label: 'Issue Exploration' },
        position: { x: 150, y: 200 },
        style: { background: '#fff8e1', border: '2px solid #ffc107' }
      },
      {
        id: '4',
        type: 'default' as const,
        data: { label: 'Skill Building' },
        position: { x: 450, y: 200 },
        style: { background: '#fce4ec', border: '2px solid #e91e63' }
      },
      {
        id: '5',
        type: 'default' as const,
        data: { label: 'Action Planning' },
        position: { x: 300, y: 300 },
        style: { background: '#f3e5f5', border: '2px solid #9c27b0' }
      },
      {
        id: '6',
        type: 'output' as const,
        data: { label: 'Session Close & Homework' },
        position: { x: 300, y: 400 },
        style: { background: '#e8f5e8', border: '2px solid #4caf50' }
      }
    ] as Node[],
    initialEdges: [
      { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
      { id: 'e2-3', source: '2', target: '3', type: 'smoothstep' },
      { id: 'e2-4', source: '2', target: '4', type: 'smoothstep' },
      { id: 'e3-5', source: '3', target: '5', type: 'smoothstep' },
      { id: 'e4-5', source: '4', target: '5', type: 'smoothstep' },
      { id: 'e5-6', source: '5', target: '6', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } }
    ] as Edge[]
  },
  copingFlow: {
    name: "Coping Strategy Flow",
    initialNodes: [
      {
        id: '1',
        type: 'input' as const,
        data: { label: 'Emotional Trigger' },
        position: { x: 300, y: 0 },
        style: { background: '#ffebee', border: '2px solid #f44336' }
      },
      {
        id: '2',
        type: 'default' as const,
        data: { label: 'Immediate Response' },
        position: { x: 150, y: 100 },
        style: { background: '#fff3e0', border: '2px solid #ff9800' }
      },
      {
        id: '3',
        type: 'default' as const,
        data: { label: 'Breathing Exercise' },
        position: { x: 450, y: 100 },
        style: { background: '#e1f5fe', border: '2px solid #03a9f4' }
      },
      {
        id: '4',
        type: 'default' as const,
        data: { label: 'Grounding Technique' },
        position: { x: 50, y: 200 },
        style: { background: '#f3e5f5', border: '2px solid #9c27b0' }
      },
      {
        id: '5',
        type: 'default' as const,
        data: { label: 'Mindfulness Practice' },
        position: { x: 250, y: 200 },
        style: { background: '#e8f5e8', border: '2px solid #4caf50' }
      },
      {
        id: '6',
        type: 'default' as const,
        data: { label: 'Physical Activity' },
        position: { x: 450, y: 200 },
        style: { background: '#fff8e1', border: '2px solid #cddc39' }
      },
      {
        id: '7',
        type: 'output' as const,
        data: { label: 'Emotional Regulation' },
        position: { x: 300, y: 300 },
        style: { background: '#e8f5e8', border: '2px solid #4caf50' }
      }
    ] as Node[],
    initialEdges: [
      { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
      { id: 'e1-3', source: '1', target: '3', type: 'smoothstep' },
      { id: 'e2-4', source: '2', target: '4', type: 'smoothstep' },
      { id: 'e2-5', source: '2', target: '5', type: 'smoothstep' },
      { id: 'e3-6', source: '3', target: '6', type: 'smoothstep' },
      { id: 'e4-7', source: '4', target: '7', type: 'smoothstep' },
      { id: 'e5-7', source: '5', target: '7', type: 'smoothstep' },
      { id: 'e6-7', source: '6', target: '7', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } }
    ] as Edge[]
  }
};

export function InteractiveFlowChart() {
  const [selectedChart, setSelectedChart] = useState<keyof typeof chartConfigs>('moodFlow');
  const currentConfig = chartConfigs[selectedChart];
  
  const [nodes, setNodes, onNodesChange] = useNodesState(currentConfig.initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(currentConfig.initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  // Update nodes and edges when chart type changes
  React.useEffect(() => {
    const config = chartConfigs[selectedChart];
    setNodes(config.initialNodes);
    setEdges(config.initialEdges);
  }, [selectedChart, setNodes, setEdges]);

  const handleAddNode = () => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'default',
      data: { label: 'New Node' },
      position: { x: Math.random() * 400, y: Math.random() * 300 },
      style: { background: '#f0f0f0', border: '2px solid #ccc' }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleClearChart = () => {
    setNodes([]);
    setEdges([]);
  };

  const handleResetChart = () => {
    const config = chartConfigs[selectedChart];
    setNodes(config.initialNodes);
    setEdges(config.initialEdges);
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Interactive Flow Charts</h3>
          <div className="flex gap-2 items-center">
            <Select value={selectedChart} onValueChange={(value: keyof typeof chartConfigs) => setSelectedChart(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(chartConfigs).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <Button onClick={handleAddNode} variant="outline" size="sm">
            Add Node
          </Button>
          <Button onClick={handleResetChart} variant="outline" size="sm">
            Reset Chart
          </Button>
          <Button onClick={handleClearChart} variant="outline" size="sm">
            Clear All
          </Button>
        </div>

        <div className="border border-border rounded-lg bg-background" style={{ height: '500px' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            attributionPosition="top-right"
            style={{ backgroundColor: "#fafafa" }}
          >
            <MiniMap 
              zoomable 
              pannable 
              style={{ backgroundColor: "#f8f9fa" }}
            />
            <Controls />
            <Background color="#e2e8f0" gap={16} />
          </ReactFlow>
        </div>

        <div className="text-sm text-muted-foreground">
          <p className="mb-2"><strong>Instructions:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Drag nodes to reposition them</li>
            <li>Click and drag from node handles to create connections</li>
            <li>Use the minimap to navigate large charts</li>
            <li>Zoom and pan using mouse controls</li>
            <li>Select different chart types to explore various mental health workflows</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}