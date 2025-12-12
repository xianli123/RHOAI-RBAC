import * as React from 'react';
import { useMemo, useState } from 'react';
import {
  PageSection,
  Title,
  Card,
  CardBody,
  CardTitle,
  Grid,
  GridItem,
  Content,
  ContentVariants,
  Flex,
  FlexItem,
  Badge,
  Button,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  Tabs,
  Tab,
  TabTitleText,
  TabContent,
  TabContentBody,
  Divider,
} from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { MultiTypeaheadSelect, MultiTypeaheadSelectOption } from '@patternfly/react-templates';
import { 
  Chart,
  ChartBar, 
  ChartLine, 
  ChartAxis, 
  ChartGroup, 
  ChartArea,
  ChartContainer,
  ChartThemeColor,
  ChartVoronoiContainer
} from '@patternfly/react-charts/victory';
import { TableIcon, KeyIcon, CubeIcon, CheckCircleIcon, ExclamationTriangleIcon, ExclamationCircleIcon, AngleRightIcon } from '@patternfly/react-icons';
import { PatternFlyLineChart } from '@app/components/PatternFlyLineChart';
import { PatternFlyAreaChart } from '@app/components/PatternFlyAreaChart';

// Mock data for the dashboard
const usageMetrics = {
  totalRequests: '13,733',
  errorRate: '2.12%',
  avgLatency: '127.8ms',
  totalCost: '540',
  totalToken: '249'
};

// Restructured data for better chart organization
const llmChatData = [
  { name: 'llm-7b-chat', x: 'User 1', y: 3 },
  { name: 'llm-7b-chat', x: 'User 2', y: 7 },
  { name: 'llm-7b-chat', x: 'User 3', y: 8 },
  { name: 'llm-7b-chat', x: 'User 4', y: 5 },
  { name: 'llm-7b-chat', x: 'User 5', y: 5 },
  { name: 'llm-7b-chat', x: 'User 6', y: 8 },
  { name: 'llm-7b-chat', x: 'User 7', y: 5 },
  { name: 'llm-7b-chat', x: 'User 8', y: 5 },
  { name: 'llm-7b-chat', x: 'User 9', y: 4 },
  { name: 'llm-7b-chat', x: 'User 10', y: 4 }
];

const mistralData = [
  { name: 'mistral-7b-instruct-v2', x: 'User 1', y: 1 },
  { name: 'mistral-7b-instruct-v2', x: 'User 2', y: 1 },
  { name: 'mistral-7b-instruct-v2', x: 'User 3', y: 1 },
  { name: 'mistral-7b-instruct-v2', x: 'User 4', y: 1 },
  { name: 'mistral-7b-instruct-v2', x: 'User 5', y: 1 },
  { name: 'mistral-7b-instruct-v2', x: 'User 6', y: 2 },
  { name: 'mistral-7b-instruct-v2', x: 'User 7', y: 1 },
  { name: 'mistral-7b-instruct-v2', x: 'User 8', y: 1 },
  { name: 'mistral-7b-instruct-v2', x: 'User 9', y: 1 },
  { name: 'mistral-7b-instruct-v2', x: 'User 10', y: 1 }
];

const stableDiffusionData = [
  { name: 'stable-diffusion-xl-beta', x: 'User 1', y: 0 },
  { name: 'stable-diffusion-xl-beta', x: 'User 2', y: 0 },
  { name: 'stable-diffusion-xl-beta', x: 'User 3', y: 0 },
  { name: 'stable-diffusion-xl-beta', x: 'User 4', y: 1 },
  { name: 'stable-diffusion-xl-beta', x: 'User 5', y: 1 },
  { name: 'stable-diffusion-xl-beta', x: 'User 6', y: 0 },
  { name: 'stable-diffusion-xl-beta', x: 'User 7', y: 0 },
  { name: 'stable-diffusion-xl-beta', x: 'User 8', y: 0 },
  { name: 'stable-diffusion-xl-beta', x: 'User 9', y: 0 },
  { name: 'stable-diffusion-xl-beta', x: 'User 10', y: 0 }
];

const legendData = [
  { name: 'llm-7b-chat' }, 
  { name: 'mistral-7b-instruct-v2' }, 
  { name: 'stable-diffusion-xl-beta' }
];

// Request traces table data
interface TraceData {
  user: string;
  userDetails: string;
  traceId: string;
  timestamp: string;
  duration: string;
  durationColor: string;
  model: string;
  status: 'success' | 'warning' | 'unknown';
  statusIcon: string;
}

const traceData: TraceData[] = [
  {
    user: 'patient_user',
    userDetails: '204 tokens • 22 tok/s • 243ms TTIF',
    traceId: 'a4b1c2d3-e4f5-g6h7-i8j9-k811n2n3o4p5',
    timestamp: '2025-09-16 18:49:01',
    duration: '4.81s',
    durationColor: '#3e8635',
    model: 'granite-7b-instruct-v2',
    status: 'success',
    statusIcon: '#3e8635'
  },
  {
    user: 'health_user',
    userDetails: '156 tokens • 28 tok/s • 198ms TTIF',
    traceId: 'b5c6d7e8-f9g0-h1i2-j3k4-l5m6n7o8p9q8',
    timestamp: '2025-09-16 18:48:45',
    duration: '3.42s',
    durationColor: '#3e8635',
    model: 'granite-7b-instruct-v2',
    status: 'success',
    statusIcon: '#3e8635'
  },
  {
    user: 'complex_user',
    userDetails: '312 tokens • 18 tok/s • 456ms TTIF',
    traceId: 'c7d8e9f8-g1h2-i3j4-k5l6-m7n8o9p0q1r2',
    timestamp: '2025-09-16 18:48:12',
    duration: '6.80s',
    durationColor: '#f0ad00',
    model: 'granite-7b-instruct-v2',
    status: 'warning',
    statusIcon: '#f0ad00'
  },
  {
    user: 'enterprise_user',
    userDetails: '89 tokens • 35 tok/s • 156ms TTIF',
    traceId: 'd8e9f0a1-h2i3-j4k5-l6m7-n8o9p0q1r2s3',
    timestamp: '2025-09-16 18:47:23',
    duration: '2.15s',
    durationColor: '#3e8635',
    model: 'granite-7b-instruct-v2',
    status: 'success',
    statusIcon: '#3e8635'
  },
  {
    user: 'system_admin',
    userDetails: '124 tokens • 31 tok/s • 145ms TTIF',
    traceId: 'e9f0a1b2-i3j4-k5l6-m7n8-o9p0q1r2s3t4',
    timestamp: '2025-09-16 17:32:15',
    duration: '1.89s',
    durationColor: '#3e8635',
    model: 'granite-7b-instruct-v2',
    status: 'success',
    statusIcon: '#3e8635'
  },
  {
    user: 'dev_team_lead',
    userDetails: '1,247 tokens • N/A tok/s • No TTIF',
    traceId: '',
    timestamp: '2025-09-16 17:25:30',
    duration: 'N/A',
    durationColor: '#d2d2d2',
    model: 'llama-70b-chat',
    status: 'unknown',
    statusIcon: '#6a6e73'
  },
  {
    user: 'qa_engineer',
    userDetails: '892 tokens • N/A tok/s • No TTIF',
    traceId: '',
    timestamp: '2025-09-16 17:20:45',
    duration: 'N/A',
    durationColor: '#d2d2d2',
    model: 'mistral-7b-instruct-v2',
    status: 'unknown',
    statusIcon: '#6a6e73'
  },
  {
    user: 'analyst_user',
    userDetails: '456 tokens • N/A tok/s • No TTIF',
    traceId: '',
    timestamp: '2025-09-16 17:15:12',
    duration: 'N/A',
    durationColor: '#d2d2d2',
    model: 'granite-7b-instruct-v2',
    status: 'unknown',
    statusIcon: '#6a6e73'
  }
];

// Model deployment table data
const modelDeploymentData = [
  {
    deployment: 'mistral-7b-instruct-v2',
    apiKey: 'Production API Key',
    apiKeyTag: 'MaaS',
    project: 'KonText PTE',
    runtime: 'vLLM',
    requests: '377962',
    latency: '199.56',
    errorRate: '3.98%',
    resources: 'GPU: V1 | CPU: 6/4',
    status: 'Running'
  },
  {
    deployment: 'stable-diffusion-xl-beta',
    apiKey: 'Dev API Key',
    apiKeyTag: 'MaaS',
    project: 'KonText PTE',
    runtime: 'KServer',
    requests: '377962',
    latency: '199.56',
    errorRate: '3.98%',
    resources: 'GPU: V1 | CPU: 7/3',
    status: 'Running'
  },
  {
    deployment: 'llama-70b-chat-v4',
    apiKey: 'Staging API Key',
    apiKeyTag: 'MaaS',
    project: 'KonText PTE',
    runtime: 'Bind',
    requests: '377962',
    latency: '199.56',
    errorRate: '3.98%',
    resources: 'GPU: 2/2 | CPU: 6/4',
    status: 'Scaling'
  },
  {
    deployment: 'mistral-7b-instruct-v2',
    apiKey: 'Test API Key',
    apiKeyTag: 'MaaS',
    project: 'KonText PTE',
    runtime: 'vLLM',
    requests: '377962',
    latency: '199.56',
    errorRate: '3.98%',
    resources: 'GPU: 2/2 | CPU: 6/7',
    status: 'Failed'
  },
  {
    deployment: 'mistral-7b-instruct-v2',
    apiKey: 'Analyst LLM API Key',
    apiKeyTag: 'MaaS',
    project: 'KonText PTE',
    runtime: 'vLLM',
    requests: '377962',
    latency: '199.56',
    errorRate: '3.98%',
    resources: 'GPU: 2/2 | CPU: 6/7',
    status: 'Degraded'
  }
];

// Line chart data for model metrics - organized by deployment
const modelMetricsData = {
  'mistral-7b-instruct-v2': {
    tokenThroughput: [
      { x: new Date('2024-10-01T00:00:00'), y: 180 },
      { x: new Date('2024-10-01T04:00:00'), y: 160 },
      { x: new Date('2024-10-01T08:00:00'), y: 140 },
      { x: new Date('2024-10-01T12:00:00'), y: 220 },
      { x: new Date('2024-10-01T16:00:00'), y: 260 },
      { x: new Date('2024-10-01T20:00:00'), y: 240 },
      { x: new Date('2024-10-02T00:00:00'), y: 200 }
    ],
    requestQueue: [
      { x: new Date('2024-10-01T00:00:00'), y: 5 },
      { x: new Date('2024-10-01T04:00:00'), y: 3 },
      { x: new Date('2024-10-01T08:00:00'), y: 2 },
      { x: new Date('2024-10-01T12:00:00'), y: 8 },
      { x: new Date('2024-10-01T16:00:00'), y: 12 },
      { x: new Date('2024-10-01T20:00:00'), y: 10 },
      { x: new Date('2024-10-02T00:00:00'), y: 6 }
    ],
    replicaCount: [
      { x: new Date('2024-10-01T00:00:00'), y: 2 },
      { x: new Date('2024-10-01T04:00:00'), y: 2 },
      { x: new Date('2024-10-01T08:00:00'), y: 1 },
      { x: new Date('2024-10-01T12:00:00'), y: 3 },
      { x: new Date('2024-10-01T16:00:00'), y: 4 },
      { x: new Date('2024-10-01T20:00:00'), y: 3 },
      { x: new Date('2024-10-02T00:00:00'), y: 3 }
    ],
    requestLatency: [
      { x: new Date('2024-10-01T00:00:00'), y: 180 },
      { x: new Date('2024-10-01T04:00:00'), y: 160 },
      { x: new Date('2024-10-01T08:00:00'), y: 140 },
      { x: new Date('2024-10-01T12:00:00'), y: 200 },
      { x: new Date('2024-10-01T16:00:00'), y: 240 },
      { x: new Date('2024-10-01T20:00:00'), y: 220 },
      { x: new Date('2024-10-02T00:00:00'), y: 190 }
    ]
  },
  'stable-diffusion-xl-beta': {
    tokenThroughput: [
      { x: new Date('2024-10-01T00:00:00'), y: 120 },
      { x: new Date('2024-10-01T04:00:00'), y: 110 },
      { x: new Date('2024-10-01T08:00:00'), y: 95 },
      { x: new Date('2024-10-01T12:00:00'), y: 140 },
      { x: new Date('2024-10-01T16:00:00'), y: 165 },
      { x: new Date('2024-10-01T20:00:00'), y: 155 },
      { x: new Date('2024-10-02T00:00:00'), y: 130 }
    ],
    requestQueue: [
      { x: new Date('2024-10-01T00:00:00'), y: 8 },
      { x: new Date('2024-10-01T04:00:00'), y: 6 },
      { x: new Date('2024-10-01T08:00:00'), y: 4 },
      { x: new Date('2024-10-01T12:00:00'), y: 12 },
      { x: new Date('2024-10-01T16:00:00'), y: 15 },
      { x: new Date('2024-10-01T20:00:00'), y: 13 },
      { x: new Date('2024-10-02T00:00:00'), y: 9 }
    ],
    replicaCount: [
      { x: new Date('2024-10-01T00:00:00'), y: 1 },
      { x: new Date('2024-10-01T04:00:00'), y: 1 },
      { x: new Date('2024-10-01T08:00:00'), y: 1 },
      { x: new Date('2024-10-01T12:00:00'), y: 2 },
      { x: new Date('2024-10-01T16:00:00'), y: 2 },
      { x: new Date('2024-10-01T20:00:00'), y: 2 },
      { x: new Date('2024-10-02T00:00:00'), y: 2 }
    ],
    requestLatency: [
      { x: new Date('2024-10-01T00:00:00'), y: 320 },
      { x: new Date('2024-10-01T04:00:00'), y: 290 },
      { x: new Date('2024-10-01T08:00:00'), y: 280 },
      { x: new Date('2024-10-01T12:00:00'), y: 340 },
      { x: new Date('2024-10-01T16:00:00'), y: 380 },
      { x: new Date('2024-10-01T20:00:00'), y: 365 },
      { x: new Date('2024-10-02T00:00:00'), y: 325 }
    ]
  },
  'llama-70b-chat-v4': {
    tokenThroughput: [
      { x: new Date('2024-10-01T00:00:00'), y: 220 },
      { x: new Date('2024-10-01T04:00:00'), y: 200 },
      { x: new Date('2024-10-01T08:00:00'), y: 185 },
      { x: new Date('2024-10-01T12:00:00'), y: 280 },
      { x: new Date('2024-10-01T16:00:00'), y: 320 },
      { x: new Date('2024-10-01T20:00:00'), y: 305 },
      { x: new Date('2024-10-02T00:00:00'), y: 260 }
    ],
    requestQueue: [
      { x: new Date('2024-10-01T00:00:00'), y: 3 },
      { x: new Date('2024-10-01T04:00:00'), y: 2 },
      { x: new Date('2024-10-01T08:00:00'), y: 1 },
      { x: new Date('2024-10-01T12:00:00'), y: 6 },
      { x: new Date('2024-10-01T16:00:00'), y: 9 },
      { x: new Date('2024-10-01T20:00:00'), y: 7 },
      { x: new Date('2024-10-02T00:00:00'), y: 4 }
    ],
    replicaCount: [
      { x: new Date('2024-10-01T00:00:00'), y: 3 },
      { x: new Date('2024-10-01T04:00:00'), y: 3 },
      { x: new Date('2024-10-01T08:00:00'), y: 2 },
      { x: new Date('2024-10-01T12:00:00'), y: 4 },
      { x: new Date('2024-10-01T16:00:00'), y: 5 },
      { x: new Date('2024-10-01T20:00:00'), y: 4 },
      { x: new Date('2024-10-02T00:00:00'), y: 4 }
    ],
    requestLatency: [
      { x: new Date('2024-10-01T00:00:00'), y: 140 },
      { x: new Date('2024-10-01T04:00:00'), y: 125 },
      { x: new Date('2024-10-01T08:00:00'), y: 115 },
      { x: new Date('2024-10-01T12:00:00'), y: 165 },
      { x: new Date('2024-10-01T16:00:00'), y: 195 },
      { x: new Date('2024-10-01T20:00:00'), y: 180 },
      { x: new Date('2024-10-02T00:00:00'), y: 155 }
    ]
  }
};

// Options for Multi-select dropdowns
const ApiKeyOptions = [
  { content: 'Production API Key', value: 'production' },
  { content: 'Dev API Key', value: 'dev' },
  { content: 'Staging API Key', value: 'staging' },
  { content: 'Test API Key', value: 'test' },
  { content: 'Analyst LLM API Key', value: 'analyst' }
];

const ModelOptions = [
  { content: 'mistral-7b-instruct-v2 (Production)', value: 'mistral-prod' },
  { content: 'stable-diffusion-xl-beta (Dev)', value: 'stable-dev' },
  { content: 'llama-70b-chat-v4 (Staging)', value: 'llama-staging' },
  { content: 'mistral-7b-instruct-v2 (Test)', value: 'mistral-test' },
  { content: 'mistral-7b-instruct-v2 (Analyst)', value: 'mistral-analyst' }
];

type SelectionsType = (string | number)[];

const usageTrendsData = {
  'llm-7b-chat': [
    { x: new Date('2024-06-01'), y: 0 },
    { x: new Date('2024-07-01'), y: 2 },
    { x: new Date('2024-08-01'), y: 7 },
    { x: new Date('2024-09-01'), y: 1 },
    { x: new Date('2024-10-01'), y: 6 },
    { x: new Date('2024-11-01'), y: 4 },
    { x: new Date('2024-12-01'), y: 9 },
    { x: new Date('2025-01-01'), y: 7 }
  ],
  'mistral-7b-instruct-v2': [
    { x: new Date('2024-06-01'), y: 0 },
    { x: new Date('2024-07-01'), y: 1 },
    { x: new Date('2024-08-01'), y: 6 },
    { x: new Date('2024-09-01'), y: 4 },
    { x: new Date('2024-10-01'), y: 6 },
    { x: new Date('2024-11-01'), y: 3 },
    { x: new Date('2024-12-01'), y: 4 },
    { x: new Date('2025-01-01'), y: 3 }
  ],
  'stable-diffusion-xl-beta': [
    { x: new Date('2024-06-01'), y: 0 },
    { x: new Date('2024-07-01'), y: 0.5 },
    { x: new Date('2024-08-01'), y: 4 },
    { x: new Date('2024-09-01'), y: 2 },
    { x: new Date('2024-10-01'), y: 4 },
    { x: new Date('2024-11-01'), y: 1 },
    { x: new Date('2024-12-01'), y: 2 },
    { x: new Date('2025-01-01'), y: 4 }
  ]
};

const Dashboard: React.FunctionComponent = () => {
  const [groupByOpen, setGroupByOpen] = React.useState(false);
  const [metricsOpen, setMetricsOpen] = React.useState(false);
  const [trendsOpen, setTrendsOpen] = React.useState(false);
  const [utilTimeOpen, setUtilTimeOpen] = useState(false);
  const [utilTimeRange, setUtilTimeRange] = useState('Last 24 hours');
  const [selectedTab, setSelectedTab] = React.useState('Cluster');
  
  // Request traces filter states
  const [serviceNameOpen, setServiceNameOpen] = useState(false);
  const [namespaceOpen, setNamespaceOpen] = useState(false);
  const [modelFilterOpen, setModelFilterOpen] = useState(false);
  const [timeRangeOpen, setTimeRangeOpen] = useState(false);
  const [limitTracesOpen, setLimitTracesOpen] = useState(false);
  const [serviceName, setServiceName] = useState('All Services');
  const [namespace, setNamespace] = useState('All Namespaces');
  const [modelFilter, setModelFilter] = useState('All Models');
  const [timeRange, setTimeRange] = useState('Last 24 hours');
  const [limitTraces, setLimitTraces] = useState('20');
  
  // Multi-select states
  const [selectedApiKeys, setSelectedApiKeys] = useState<SelectionsType>(['production', 'dev', 'staging', 'test', 'analyst']);
  const [selectedModels, setSelectedModels] = useState<SelectionsType>(['mistral-prod', 'stable-dev', 'llama-staging', 'mistral-test', 'mistral-analyst']);

  // Initialize options with selected state
  const initialApiKeyOptions = useMemo<MultiTypeaheadSelectOption[]>(
    () => ApiKeyOptions.map((option) => ({ ...option, selected: selectedApiKeys.includes(option.value) })),
    [selectedApiKeys]
  );

  const initialModelOptions = useMemo<MultiTypeaheadSelectOption[]>(
    () => ModelOptions.map((option) => ({ ...option, selected: selectedModels.includes(option.value) })),
    [selectedModels]
  );

  // Create mapping objects for filtering
  const apiKeyValueToName = useMemo(() => {
    const mapping: { [key: string]: string } = {};
    ApiKeyOptions.forEach(option => {
      mapping[option.value] = option.content;
    });
    return mapping;
  }, []);

  const modelValueToDeployment = useMemo(() => {
    const mapping: { [key: string]: { deployment: string, apiKey: string } } = {};
    ModelOptions.forEach(option => {
      // Extract deployment name and API key from content like "mistral-7b-instruct-v2 (Production)"
      const match = option.content.match(/^(.+?)\s*\((.+)\)$/);
      if (match) {
        const deployment = match[1].trim();
        const apiKeyType = match[2].trim();
        mapping[option.value] = { 
          deployment, 
          apiKey: `${apiKeyType} API Key` 
        };
      }
    });
    return mapping;
  }, []);

  // Filter table data based on selections
  const filteredModelData = useMemo(() => {
    return modelDeploymentData.filter(model => {
      // Check if API key matches selection
      const apiKeyMatches = selectedApiKeys.some(selectedKey => 
        apiKeyValueToName[selectedKey as string] === model.apiKey
      );

      // Check if model deployment matches selection  
      const modelMatches = selectedModels.some(selectedModel => {
        const modelInfo = modelValueToDeployment[selectedModel as string];
        return modelInfo && 
               modelInfo.deployment === model.deployment && 
               modelInfo.apiKey === model.apiKey;
      });

      return apiKeyMatches && modelMatches;
    });
  }, [selectedApiKeys, selectedModels, apiKeyValueToName, modelValueToDeployment]);

  // Filter and aggregate chart data based on selections
  const filteredTokenThroughputData = useMemo(() => {
    const selectedDeployments = filteredModelData.map(model => model.deployment);
    
    // Aggregate data from all selected deployments
    const aggregatedData: { [key: string]: number } = {};
    
    selectedDeployments.forEach(deployment => {
      if (modelMetricsData[deployment]) {
        modelMetricsData[deployment].tokenThroughput.forEach(point => {
          const timeKey = point.x.getTime().toString();
          aggregatedData[timeKey] = (aggregatedData[timeKey] || 0) + point.y;
        });
      }
    });

    // Convert back to chart format
    return Object.entries(aggregatedData).map(([timeKey, value]) => ({
      x: new Date(parseInt(timeKey)),
      y: value
    })).sort((a, b) => a.x.getTime() - b.x.getTime());
  }, [filteredModelData]);

  const filteredRequestQueueData = useMemo(() => {
    const selectedDeployments = filteredModelData.map(model => model.deployment);
    
    const aggregatedData: { [key: string]: number } = {};
    
    selectedDeployments.forEach(deployment => {
      if (modelMetricsData[deployment]) {
        modelMetricsData[deployment].requestQueue.forEach(point => {
          const timeKey = point.x.getTime().toString();
          aggregatedData[timeKey] = (aggregatedData[timeKey] || 0) + point.y;
        });
      }
    });

    return Object.entries(aggregatedData).map(([timeKey, value]) => ({
      x: new Date(parseInt(timeKey)),
      y: value
    })).sort((a, b) => a.x.getTime() - b.x.getTime());
  }, [filteredModelData]);

  const filteredReplicaCountData = useMemo(() => {
    const selectedDeployments = filteredModelData.map(model => model.deployment);
    
    const aggregatedData: { [key: string]: number } = {};
    
    selectedDeployments.forEach(deployment => {
      if (modelMetricsData[deployment]) {
        modelMetricsData[deployment].replicaCount.forEach(point => {
          const timeKey = point.x.getTime().toString();
          aggregatedData[timeKey] = (aggregatedData[timeKey] || 0) + point.y;
        });
      }
    });

    return Object.entries(aggregatedData).map(([timeKey, value]) => ({
      x: new Date(parseInt(timeKey)),
      y: value
    })).sort((a, b) => a.x.getTime() - b.x.getTime());
  }, [filteredModelData]);

  const filteredRequestLatencyData = useMemo(() => {
    const selectedDeployments = filteredModelData.map(model => model.deployment);
    
    if (selectedDeployments.length === 0) return [];
    
    const aggregatedData: { [key: string]: { total: number, count: number } } = {};
    
    selectedDeployments.forEach(deployment => {
      if (modelMetricsData[deployment]) {
        modelMetricsData[deployment].requestLatency.forEach(point => {
          const timeKey = point.x.getTime().toString();
          if (!aggregatedData[timeKey]) {
            aggregatedData[timeKey] = { total: 0, count: 0 };
          }
          aggregatedData[timeKey].total += point.y;
          aggregatedData[timeKey].count += 1;
        });
      }
    });

    // Calculate average latency for each time point
    return Object.entries(aggregatedData).map(([timeKey, { total, count }]) => ({
      x: new Date(parseInt(timeKey)),
      y: Math.round(total / count)
    })).sort((a, b) => a.x.getTime() - b.x.getTime());
  }, [filteredModelData]);

  const getStatusBadge = (status: string) => {
    const baseStyle = {
      borderRadius: '16px',
      padding: '2px 8px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '12px',
      fontWeight: '500',
      minHeight: '20px'
    };

    switch (status) {
      case 'Running':
        return (
          <span style={{ 
            ...baseStyle, 
            backgroundColor: '#3e8635', 
            color: '#ffffff',
            border: '1px solid #3e8635'
          }}>
            <CheckCircleIcon size={16} />
            Running
          </span>
        );
      case 'Scaling':
        return (
          <span style={{ 
            ...baseStyle, 
            backgroundColor: '#f0ad00', 
            color: '#151515',
            border: '1px solid #f0ad00'
          }}>
            <ExclamationTriangleIcon size={16} />
            Scaling
          </span>
        );
      case 'Failed':
        return (
          <span style={{ 
            ...baseStyle, 
            backgroundColor: '#c9190b', 
            color: '#ffffff',
            border: '1px solid #c9190b'
          }}>
            <ExclamationCircleIcon size={16} />
            Failed
          </span>
        );
      case 'Degraded':
        return (
          <span style={{ 
            ...baseStyle, 
            backgroundColor: '#c9190b', 
            color: '#ffffff',
            border: '1px solid #c9190b'
          }}>
            <ExclamationCircleIcon size={16} />
            Degraded
          </span>
        );
      default:
        return (
          <span style={{ 
            ...baseStyle, 
            backgroundColor: '#6a6e73', 
            color: '#ffffff',
            border: '1px solid #6a6e73'
          }}>
            {status}
          </span>
        );
    }
  };

  const onGroupByToggle = () => {
    setGroupByOpen(!groupByOpen);
  };

  const onMetricsToggle = () => {
    setMetricsOpen(!metricsOpen);
  };

  const onTrendsToggle = () => {
    setTrendsOpen(!trendsOpen);
  };

  return (
    <PageSection hasBodyWrapper={false}>
      <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsLg' }}>
        {/* Header */}
        <FlexItem>
          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsMd' }}>
            <FlexItem>
              <Title headingLevel="h1" size="2xl">Dashboard</Title>
            </FlexItem>
          </Flex>
              <Content component={ContentVariants.p}>
            Monitor the health and performance of your AI workloads and infrastructure
              </Content>
            </FlexItem>

        {/* Overview card */}
            <FlexItem>
          <Card>
            <CardTitle>
              <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                <FlexItem>
                  <Title headingLevel="h3" size="lg">Overview</Title>
            </FlexItem>
                <FlexItem>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                    <div style={{ width: '8px', height: '8px', backgroundColor: '#3e8635', borderRadius: '50%' }} />
                    <Content component={ContentVariants.small}>All systems operational</Content>
          </Flex>
                </FlexItem>
              </Flex>
            </CardTitle>
            <CardBody>
              <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                <FlexItem grow={{ default: 'grow' }}>
                  <Card isCompact style={{ backgroundColor: '#e6f2ff', border: 'none', padding: '2px' }}>
                    <CardBody style={{ padding: '0.5rem' }}>
                      <Content component={ContentVariants.small} style={{ color: '#0066cc', fontWeight: 600, letterSpacing: 0.4, fontSize: '0.7rem' }}>CLUSTERS</Content>
                      <Flex alignItems={{ default: 'alignItemsBaseline' }} justifyContent={{ default: 'justifyContentSpaceBetween' }} style={{ marginTop: '0.25rem', marginBottom: 0, whiteSpace: 'nowrap' }}>
                        <Title headingLevel="h4" size="lg" style={{ margin: 0 }}>8 Nodes</Title>
                        <Content component={ContentVariants.small} style={{ color: '#3e8635', fontSize: '0.75rem', margin: 0 }}>+2</Content>
                      </Flex>
                    </CardBody>
                  </Card>
                </FlexItem>
                <FlexItem grow={{ default: 'grow' }}>
                  <Card isCompact style={{ backgroundColor: '#e6f2ff', border: 'none', padding: '2px' }}>
                    <CardBody style={{ padding: '0.5rem' }}>
                      <Content component={ContentVariants.small} style={{ color: '#0066cc', fontWeight: 600, letterSpacing: 0.4, fontSize: '0.7rem' }}>COMPUTE</Content>
                      <Flex alignItems={{ default: 'alignItemsBaseline' }} justifyContent={{ default: 'justifyContentSpaceBetween' }} style={{ marginTop: '0.25rem', marginBottom: 0, whiteSpace: 'nowrap' }}>
                        <Title headingLevel="h4" size="lg" style={{ margin: 0 }}>24 GPUs</Title>
                        <Content component={ContentVariants.small} style={{ color: '#c9190b', fontSize: '0.75rem', margin: 0 }}>58% util</Content>
                      </Flex>
                    </CardBody>
                  </Card>
                </FlexItem>
                <FlexItem grow={{ default: 'grow' }}>
                  <Card isCompact style={{ backgroundColor: '#e6f5e6', border: 'none' }}>
                    <CardBody style={{ padding: '0.5rem' }}>
                      <Content component={ContentVariants.small} style={{ color: '#3e8635', fontWeight: 600, letterSpacing: 0.4, fontSize: '0.7rem' }}>MODELS</Content>
                      <Flex alignItems={{ default: 'alignItemsBaseline' }} justifyContent={{ default: 'justifyContentSpaceBetween' }} style={{ marginTop: '0.25rem', marginBottom: 0, whiteSpace: 'nowrap' }}>
                        <Title headingLevel="h4" size="lg" style={{ margin: 0 }}>4 Active</Title>
                        <Content component={ContentVariants.small} style={{ color: '#3e8635', fontSize: '0.75rem', margin: 0 }}>+1</Content>
                      </Flex>
                    </CardBody>
                  </Card>
                </FlexItem>
                <FlexItem grow={{ default: 'grow' }}>
                  <Card isCompact style={{ backgroundColor: '#e6f5e6', border: 'none' }}>
                    <CardBody style={{ padding: '0.5rem' }}>
                      <Content component={ContentVariants.small} style={{ color: '#3e8635', fontWeight: 600, letterSpacing: 0.4, fontSize: '0.7rem' }}>P90 LATENCY</Content>
                      <Flex alignItems={{ default: 'alignItemsBaseline' }} justifyContent={{ default: 'justifyContentSpaceBetween' }} style={{ marginTop: '0.25rem', marginBottom: 0, whiteSpace: 'nowrap' }}>
                        <Title headingLevel="h4" size="lg" style={{ margin: 0 }}>820ms</Title>
                        <Content component={ContentVariants.small} style={{ color: '#f0ad00', fontSize: '0.75rem', margin: 0 }}>+45ms</Content>
                      </Flex>
                    </CardBody>
                  </Card>
                </FlexItem>
                <FlexItem grow={{ default: 'grow' }}>
                  <Card isCompact style={{ backgroundColor: '#f3e5f5', border: 'none' }}>
                    <CardBody style={{ padding: '0.5rem' }}>
                      <Content component={ContentVariants.small} style={{ color: '#8b5cf6', fontWeight: 600, letterSpacing: 0.4, fontSize: '0.7rem' }}>REQUESTS</Content>
                      <Flex alignItems={{ default: 'alignItemsBaseline' }} justifyContent={{ default: 'justifyContentSpaceBetween' }} style={{ marginTop: '0.25rem', marginBottom: 0, whiteSpace: 'nowrap' }}>
                        <Title headingLevel="h4" size="lg" style={{ margin: 0 }}>2.8K</Title>
                        <Content component={ContentVariants.small} style={{ color: '#3e8635', fontSize: '0.75rem', margin: 0 }}>+12%</Content>
                      </Flex>
                    </CardBody>
                  </Card>
                </FlexItem>
                <FlexItem grow={{ default: 'grow' }}>
                  <Card isCompact style={{ backgroundColor: '#f3e5f5', border: 'none' }}>
                    <CardBody style={{ padding: '0.5rem' }}>
                      <Content component={ContentVariants.small} style={{ color: '#8b5cf6', fontWeight: 600, letterSpacing: 0.4, fontSize: '0.7rem' }}>TOKENS</Content>
                      <Flex alignItems={{ default: 'alignItemsBaseline' }} justifyContent={{ default: 'justifyContentSpaceBetween' }} style={{ marginTop: '0.25rem', marginBottom: 0, whiteSpace: 'nowrap' }}>
                        <Title headingLevel="h4" size="lg" style={{ margin: 0 }}>1.2M</Title>
                        <Content component={ContentVariants.small} style={{ color: '#3e8635', fontSize: '0.75rem', margin: 0 }}>+8%</Content>
                      </Flex>
                    </CardBody>
                  </Card>
                </FlexItem>
                <FlexItem grow={{ default: 'grow' }}>
                  <Card isCompact style={{ backgroundColor: '#fff3e0', border: 'none' }}>
                    <CardBody style={{ padding: '0.5rem' }}>
                      <Content component={ContentVariants.small} style={{ color: '#c9190b', fontWeight: 600, letterSpacing: 0.4, fontSize: '0.7rem' }}>COST PER REQUEST</Content>
                      <Flex alignItems={{ default: 'alignItemsBaseline' }} justifyContent={{ default: 'justifyContentSpaceBetween' }} style={{ marginTop: '0.25rem', marginBottom: 0, whiteSpace: 'nowrap' }}>
                        <Title headingLevel="h4" size="lg" style={{ margin: 0 }}>$0.023</Title>
                        <Content component={ContentVariants.small} style={{ color: '#c9190b', fontSize: '0.75rem', margin: 0 }}>+$0.002</Content>
                      </Flex>
                    </CardBody>
                  </Card>
                </FlexItem>
                <FlexItem grow={{ default: 'grow' }}>
                  <Card isCompact style={{ backgroundColor: '#fff3e0', border: 'none' }}>
                    <CardBody style={{ padding: '0.5rem' }}>
                      <Content component={ContentVariants.small} style={{ color: '#c9190b', fontWeight: 600, letterSpacing: 0.4, fontSize: '0.7rem' }}>ERROR RATE</Content>
                      <Flex alignItems={{ default: 'alignItemsBaseline' }} justifyContent={{ default: 'justifyContentSpaceBetween' }} style={{ marginTop: '0.25rem', marginBottom: 0, whiteSpace: 'nowrap' }}>
                        <Title headingLevel="h4" size="lg" style={{ margin: 0 }}>0.8%</Title>
                        <Content component={ContentVariants.small} style={{ color: '#c9190b', fontSize: '0.75rem', margin: 0 }}>-0.1%</Content>
                      </Flex>
                    </CardBody>
                  </Card>
                </FlexItem>
              </Flex>
            </CardBody>
          </Card>
        </FlexItem>

            {/* Tab Navigation */}
            <FlexItem>
              <Tabs
                activeKey={selectedTab}
                onSelect={(_event, eventKey) => setSelectedTab(eventKey as string)}
                aria-label="Dashboard view tabs"
              >
                <Tab
                  eventKey="Cluster"
                  title={<TabTitleText>Cluster</TabTitleText>}
                  aria-label="Cluster tab"
                />
                <Tab
                  eventKey="Models"
                  title={<TabTitleText>Models</TabTitleText>}
                  aria-label="Models tab"
                />
                <Tab
                  eventKey="Usage"
                  title={<TabTitleText>Usage</TabTitleText>}
                  aria-label="Usage tab"
                />
                <Tab
                  eventKey="Traces"
                  title={<TabTitleText>Traces</TabTitleText>}
                  aria-label="Traces tab"
                />
                {/* Perses tab removed */}
              </Tabs>
            </FlexItem>


        {/* Tab Content */}
        {selectedTab === 'Cluster' && (
          <>
            {/* Cluster Details and Resource Inventory */}
          <FlexItem>
              <Grid hasGutter>
                <GridItem span={6}>
                  <Card style={{ height: '100%' }}>
                    <CardTitle>
                      <Title headingLevel="h4" size="md">Cluster Details</Title>
                    </CardTitle>
              <CardBody>
                      <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
                  <FlexItem>
                          <Flex direction={{ default: 'column' }}>
                            <Content component={ContentVariants.small} style={{ fontWeight: 'bold', marginBottom: 0 }}>Provider</Content>
                            <Content component={ContentVariants.small} style={{ marginTop: 0 }}>AWS</Content>
                    </Flex>
                  </FlexItem>
                        <FlexItem>
                    <Flex direction={{ default: 'column' }}>
                            <Content component={ContentVariants.small} style={{ fontWeight: 'bold', marginBottom: 0 }}>OpenShift version</Content>
                            <Content component={ContentVariants.small} style={{ marginTop: 0 }}>2.24.0</Content>
                          </Flex>
                        </FlexItem>
                      <FlexItem>
                          <Flex direction={{ default: 'column' }}>
                            <Content component={ContentVariants.small} style={{ fontWeight: 'bold', marginBottom: 0 }}>Channel</Content>
                            <Content component={ContentVariants.small} style={{ marginTop: 0 }}>fast</Content>
                          </Flex>
                      </FlexItem>
                      <FlexItem>
                          <Flex direction={{ default: 'column' }}>
                            <Content component={ContentVariants.small} style={{ fontWeight: 'bold', marginBottom: 0 }}>API server</Content>
                            <Content component={ContentVariants.small} style={{ fontFamily: 'monospace', fontSize: '12px', marginTop: 0 }}>
                              https://api.cluster-z84h8.z84h8.sandbox.opentic.com
                            </Content>
                        </Flex>
                      </FlexItem>
                        <FlexItem>
                          <Button variant="link" style={{ padding: 0, fontSize: '14px' }}>
                            View settings →
                          </Button>
                      </FlexItem>
                    </Flex>
                    </CardBody>
                  </Card>
                  </GridItem>
                <GridItem span={6}>
                  <Card style={{ height: '100%' }}>
                    <CardTitle>
                      <Title headingLevel="h4" size="md">Cluster inventory</Title>
                    </CardTitle>
                    <CardBody>
                    <Flex direction={{ default: 'column' }}>
                      <FlexItem>
                          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsFlexStart' }}>
                            <Content component={ContentVariants.small} style={{ fontWeight: 'normal' }}>3 Nodes</Content>
                            <Flex alignItems={{ default: 'alignItemsFlexStart' }} spaceItems={{ default: 'spaceItemsSm' }}>
                              <Content component={ContentVariants.small} style={{ color: '#73bcf7' }}>3</Content>
                              <CheckCircleIcon style={{ color: '#0066cc', fontSize: '16px' }} />
                            </Flex>
                          </Flex>
                      </FlexItem>
                      <FlexItem>
                          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsFlexStart' }}>
                            <Content component={ContentVariants.small} style={{ fontWeight: 'normal' }}>8 Disks</Content>
                        <Flex alignItems={{ default: 'alignItemsFlexStart' }} spaceItems={{ default: 'spaceItemsSm' }}>
                              <Content component={ContentVariants.small} style={{ color: '#73bcf7' }}>8</Content>
                              <CheckCircleIcon style={{ color: '#0066cc', fontSize: '16px' }} />
                            </Flex>
                        </Flex>
                      </FlexItem>
                        <FlexItem>
                          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsFlexStart' }}>
                            <Content component={ContentVariants.small} style={{ fontWeight: 'normal' }}>20 Pods</Content>
                            <Flex alignItems={{ default: 'alignItemsFlexStart' }} spaceItems={{ default: 'spaceItemsSm' }}>
                              <Content component={ContentVariants.small} style={{ color: '#73bcf7' }}>20</Content>
                              <CheckCircleIcon style={{ color: '#0066cc', fontSize: '16px' }} />
                    </Flex>
                          </Flex>
                        </FlexItem>
                      <FlexItem>
                          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsFlexStart' }}>
                            <Content component={ContentVariants.small} style={{ fontWeight: 'normal' }}>12 PVs</Content>
                            <Flex alignItems={{ default: 'alignItemsFlexStart' }} spaceItems={{ default: 'spaceItemsSm' }}>
                              <Content component={ContentVariants.small} style={{ color: '#73bcf7' }}>12</Content>
                              <CheckCircleIcon style={{ color: '#0066cc', fontSize: '16px' }} />
                            </Flex>
                          </Flex>
                      </FlexItem>
                      <FlexItem>
                          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsFlexStart' }}>
                            <Content component={ContentVariants.small} style={{ fontWeight: 'normal' }}>18 PVCs</Content>
                        <Flex alignItems={{ default: 'alignItemsFlexStart' }} spaceItems={{ default: 'spaceItemsSm' }}>
                              <Content component={ContentVariants.small} style={{ color: '#73bcf7' }}>18</Content>
                              <CheckCircleIcon style={{ color: '#0066cc', fontSize: '16px' }} />
                            </Flex>
                        </Flex>
                      </FlexItem>
                    </Flex>
                    </CardBody>
                  </Card>
                  </GridItem>
              </Grid>
            </FlexItem>

            {/* Utilizations Section */}
                      <FlexItem>
              <Card>
                <CardTitle>
                  <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                    <FlexItem>
                      <Title headingLevel="h4" size="md">Utilizations</Title>
                      </FlexItem>
                      <FlexItem>
                        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem>
                          <Content component={ContentVariants.small}>
                            Time range:
                          </Content>
                        </FlexItem>
                        <FlexItem>
                          <Dropdown
                            onSelect={(_e, itemId) => {
                              setUtilTimeOpen(false);
                              const selected = typeof itemId === 'string' ? itemId : '';
                              if (selected === '1h') setUtilTimeRange('Last 1 hour');
                              else if (selected === '6h') setUtilTimeRange('Last 6 hours');
                              else if (selected === '24h') setUtilTimeRange('Last 24 hours');
                              else if (selected === '7d') setUtilTimeRange('Last 7 days');
                            }}
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                              <MenuToggle ref={toggleRef} onClick={() => setUtilTimeOpen(!utilTimeOpen)} isExpanded={utilTimeOpen}>
                                {utilTimeRange}
                              </MenuToggle>
                            )}
                            isOpen={utilTimeOpen}
                            id="utilization-time-range-dropdown"
                          >
                            <DropdownList>
                              <DropdownItem value="1h">Last 1 hour</DropdownItem>
                              <DropdownItem value="6h">Last 6 hours</DropdownItem>
                              <DropdownItem value="24h">Last 24 hours</DropdownItem>
                              <DropdownItem value="7d">Last 7 days</DropdownItem>
                            </DropdownList>
                          </Dropdown>
                        </FlexItem>
                          </Flex>
                    </FlexItem>
                        </Flex>
                </CardTitle>
                <CardBody>
                  <Grid hasGutter>
                    {/* First row: GPU and Memory */}
                    <GridItem span={6}>
                      <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem>
                          <Content component={ContentVariants.small} style={{ fontWeight: 'bold' }}>GPU</Content>
                        </FlexItem>
                        <FlexItem>
                          <Content component={ContentVariants.p} style={{ color: '#6a6e73', fontSize: '0.875em' }}>77% available of 80</Content>
                        </FlexItem>
                        <FlexItem>
                          <PatternFlyAreaChart
                            data={[
                              { x: '00:00', y: 65 },
                              { x: '02:00', y: 70 },
                              { x: '04:00', y: 55 },
                              { x: '06:00', y: 60 },
                              { x: '08:00', y: 75 },
                              { x: '10:00', y: 68 }
                            ]}
                            height={180}
                            width="100%"
                            domain={{ y: [0, 100] }}
                            padding={{ bottom: 20, left: 4, right: 20, top: 20 }}
                            themeColor="blue"
                            showLegend={false}
                            axisTickFontSize={11}
                            chartLabel="GPU"
                            ariaDesc="GPU utilization over time"
                            ariaTitle="GPU Utilization Chart"
                          />
                      </FlexItem>
                    </Flex>
                  </GridItem>
                    <GridItem span={6}>
                      <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                      <FlexItem>
                          <Content component={ContentVariants.small} style={{ fontWeight: 'bold' }}>Memory</Content>
                      </FlexItem>
                      <FlexItem>
                          <Content component={ContentVariants.p} style={{ color: '#6a6e73', fontSize: '0.875em' }}>2,048 GB available of 3,677 GB</Content>
                        </FlexItem>
                        <FlexItem>
                          <PatternFlyAreaChart
                            data={[
                              { x: '00:00', y: 45 },
                              { x: '02:00', y: 50 },
                              { x: '04:00', y: 40 },
                              { x: '06:00', y: 42 },
                              { x: '08:00', y: 55 },
                              { x: '10:00', y: 48 }
                            ]}
                            height={180}
                            width="100%"
                            domain={{ y: [0, 80] }}
                            padding={{ bottom: 20, left: 4, right: 20, top: 20 }}
                            themeColor="blue"
                            showLegend={false}
                            axisTickFontSize={11}
                            chartLabel="Memory"
                            ariaDesc="Memory utilization over time"
                            ariaTitle="Memory Utilization Chart"
                          />
                      </FlexItem>
                    </Flex>
                  </GridItem>
                    {/* Second row: CPU and Network */}
                    <GridItem span={6}>
                      <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                      <FlexItem>
                          <Content component={ContentVariants.small} style={{ fontWeight: 'bold' }}>CPU</Content>
                      </FlexItem>
                      <FlexItem>
                          <Content component={ContentVariants.p} style={{ color: '#6a6e73', fontSize: '0.875em' }}>71% available of 80</Content>
                        </FlexItem>
                        <FlexItem>
                          <PatternFlyAreaChart
                            data={[
                              { x: '00:00', y: 60 },
                              { x: '02:00', y: 65 },
                              { x: '04:00', y: 55 },
                              { x: '06:00', y: 58 },
                              { x: '08:00', y: 70 },
                              { x: '10:00', y: 62 }
                            ]}
                            height={180}
                            width="100%"
                            domain={{ y: [0, 100] }}
                            padding={{ bottom: 20, left: 4, right: 20, top: 20 }}
                            themeColor="blue"
                            showLegend={false}
                            axisTickFontSize={11}
                            chartLabel="CPU"
                            ariaDesc="CPU utilization over time"
                            ariaTitle="CPU Utilization Chart"
                          />
                        </FlexItem>
                          </Flex>
                    </GridItem>
                    <GridItem span={6}>
                      <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem>
                          <Content component={ContentVariants.small} style={{ fontWeight: 'bold' }}>Network</Content>
                        </FlexItem>
                        <FlexItem>
                          <Content component={ContentVariants.p} style={{ color: '#6a6e73', fontSize: '0.875em' }}>3.8 Mbps In</Content>
                        </FlexItem>
                        <FlexItem>
                          <PatternFlyAreaChart
                            data={[
                              { x: '00:00', y: 15 },
                              { x: '02:00', y: 20 },
                              { x: '04:00', y: 12 },
                              { x: '06:00', y: 18 },
                              { x: '08:00', y: 25 },
                              { x: '10:00', y: 16 }
                            ]}
                            height={180}
                            width="100%"
                            domain={{ y: [0, 30] }}
                            padding={{ bottom: 20, left: 4, right: 20, top: 20 }}
                            themeColor="blue"
                            showLegend={false}
                            axisTickFontSize={11}
                            chartLabel="Network"
                            ariaDesc="Network utilization over time"
                            ariaTitle="Network Utilization Chart"
                          />
                      </FlexItem>
                    </Flex>
                  </GridItem>
                  </Grid>
                </CardBody>
              </Card>
            </FlexItem>

            {/* System Health Score */}
                      <FlexItem>
              <Card>
                <CardTitle>
                  <Title headingLevel="h4" size="md">System health score</Title>
                </CardTitle>
                <CardBody>
                  <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
                    <FlexItem>
                      <Grid hasGutter>
                        <GridItem span={3}>
                          <Flex direction={{ default: 'column' }} alignItems={{ default: 'alignItemsCenter' }}>
                            <Content component={ContentVariants.h3} size={2} style={{ color: '#3e8635', fontWeight: 'bold' }}>100%</Content>
                            <Content component={ContentVariants.small}>Health score</Content>
                          </Flex>
                        </GridItem>
                        <GridItem span={3}>
                          <Flex direction={{ default: 'column' }} alignItems={{ default: 'alignItemsCenter' }}>
                            <Content component={ContentVariants.h3} size={2} style={{ color: '#3e8635', fontWeight: 'bold' }}>0</Content>
                            <Content component={ContentVariants.small}>Active errors</Content>
                          </Flex>
                        </GridItem>
                        <GridItem span={3}>
                          <Flex direction={{ default: 'column' }} alignItems={{ default: 'alignItemsCenter' }}>
                            <Content component={ContentVariants.h3} size={2} style={{ color: '#3e8635', fontWeight: 'bold' }}>0</Content>
                            <Content component={ContentVariants.small}>Pending requests</Content>
                          </Flex>
                        </GridItem>
                        <GridItem span={3}>
                          <Flex direction={{ default: 'column' }} alignItems={{ default: 'alignItemsCenter' }}>
                            <Content component={ContentVariants.h3} size={2} style={{ color: '#3e8635', fontWeight: 'bold' }}>0</Content>
                            <Content component={ContentVariants.small}>Active warnings</Content>
                          </Flex>
                        </GridItem>
                      </Grid>
                      </FlexItem>
                      <FlexItem>
                      <Flex spaceItems={{ default: 'spaceItemsLg' }}>
                        <FlexItem>
                          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXs' }}>
                            <div style={{ width: '8px', height: '8px', backgroundColor: '#3e8635', borderRadius: '50%' }} />
                            <Content component={ContentVariants.small}>Healthy</Content>
                        </Flex>
                      </FlexItem>
                        <FlexItem>
                          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXs' }}>
                            <div style={{ width: '8px', height: '8px', backgroundColor: '#f0ad00', borderRadius: '50%' }} />
                            <Content component={ContentVariants.small}>No data</Content>
                    </Flex>
                        </FlexItem>
                      <FlexItem>
                          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXs' }}>
                            <div style={{ width: '8px', height: '8px', backgroundColor: '#f0ad00', borderRadius: '50%' }} />
                            <Content component={ContentVariants.small}>No requests</Content>
                          </Flex>
                      </FlexItem>
                      <FlexItem>
                          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXs' }}>
                            <div style={{ width: '8px', height: '8px', backgroundColor: '#c9190b', borderRadius: '50%' }} />
                            <Content component={ContentVariants.small}>No warnings</Content>
                          </Flex>
                        </FlexItem>
                        </Flex>
                      </FlexItem>
                    </Flex>
              </CardBody>
            </Card>
          </FlexItem>

            {/* Charts Section */}
          <FlexItem>
              <Grid hasGutter>
                <GridItem span={6}>
            <Card>
              <CardTitle>
                      <Title headingLevel="h4" size="md">GPU Core Utilization</Title>
              </CardTitle>
              <CardBody>
                      <PatternFlyLineChart
                        data={[
                          { name: 'GPU', x: '00:00', y: 65 },
                          { name: 'GPU', x: '02:00', y: 70 },
                          { name: 'GPU', x: '04:00', y: 55 },
                          { name: 'GPU', x: '06:00', y: 60 },
                          { name: 'GPU', x: '08:00', y: 75 },
                          { name: 'GPU', x: '10:00', y: 68 }
                        ]}
                        height={200}
                        width="100%"
                        domain={{ y: [0, 100] }}
                        padding={{
                          bottom: 40,
                          left: 50,
                          right: 120,
                          top: 20
                        }}
                        themeColor="blue"
                        showLegend={true}
                        axisTickFontSize={11}
                        ariaDesc="GPU Core Utilization over time"
                        ariaTitle="GPU Core Utilization Chart"
                      />
              </CardBody>
            </Card>
                </GridItem>
                <GridItem span={6}>
                  <Card>
                    <CardTitle>
                      <Title headingLevel="h4" size="md">Average Memory Utilization</Title>
                    </CardTitle>
                    <CardBody>
                      <PatternFlyLineChart
                        data={[
                          { name: 'Memory', x: '00:00', y: 45 },
                          { name: 'Memory', x: '02:00', y: 50 },
                          { name: 'Memory', x: '04:00', y: 40 },
                          { name: 'Memory', x: '06:00', y: 42 },
                          { name: 'Memory', x: '08:00', y: 55 },
                          { name: 'Memory', x: '10:00', y: 48 }
                        ]}
                        height={200}
                        width="100%"
                        domain={{ y: [0, 80] }}
                        padding={{
                          bottom: 40,
                          left: 50,
                          right: 120,
                          top: 20
                        }}
                        themeColor="blue"
                        showLegend={true}
                        axisTickFontSize={11}
                        ariaDesc="Average Memory Utilization over time"
                        ariaTitle="Average Memory Utilization Chart"
                      />
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>
          </FlexItem>
          </>
        )}

        {selectedTab === 'Models' && (
          <>
            {/* Model Inventory */}
            <FlexItem>
              <Card>
                <CardTitle>
                  <Title headingLevel="h3" size="lg">Model inventory</Title>
                </CardTitle>
                <CardBody>
                  <Content component={ContentVariants.p} style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                    View real-time performance metrics and monitor the health of your selected models.
                  </Content>
                  
                  {/* API Key and Model Selection */}
                  <Flex spaceItems={{ default: 'spaceItemsLg' }} style={{ marginBottom: 'var(--pf-t--global--spacer--lg)' }}>
                    <FlexItem>
                      <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem>
                          <Content component={ContentVariants.small}>Select API Key(s):</Content>
                        </FlexItem>
                        <FlexItem>
                          <MultiTypeaheadSelect
                            initialOptions={initialApiKeyOptions}
                            placeholder={selectedApiKeys.length === 0 ? "Select API Keys" : `${selectedApiKeys.length} selected`}
                            noOptionsFoundMessage={(filter) => `No API key was found for "${filter}"`}
                            onSelectionChange={(_ev, selections) => setSelectedApiKeys(selections)}
                          />
                        </FlexItem>
                      </Flex>
                    </FlexItem>
                    <FlexItem>
                      <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem>
                          <Content component={ContentVariants.small}>Select model(s):</Content>
                        </FlexItem>
                        <FlexItem>
                          <MultiTypeaheadSelect
                            initialOptions={initialModelOptions}
                            placeholder={selectedModels.length === 0 ? "Select Models" : `${selectedModels.length} selected`}
                            noOptionsFoundMessage={(filter) => `No model was found for "${filter}"`}
                            onSelectionChange={(_ev, selections) => setSelectedModels(selections)}
                          />
                        </FlexItem>
                      </Flex>
                    </FlexItem>
                  </Flex>

                  {/* Results Count */}
                  <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
                    <FlexItem>
                      <Content component={ContentVariants.small}>
                        Showing {filteredModelData.length} of {modelDeploymentData.length} deployments
                      </Content>
                    </FlexItem>
                  </Flex>

                  {/* Model Deployment Table */}
                  <Table aria-label="Model deployments table" variant="compact">
                    <Thead>
                      <Tr>
                        <Th>Model deployment</Th>
                        <Th>API key</Th>
                        <Th>Project</Th>
                        <Th>Runtime</Th>
                        <Th>Total requests</Th>
                        <Th>Avg. Latency (ms)</Th>
                        <Th>Error rate</Th>
                        <Th>Resources</Th>
                        <Th>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredModelData.length === 0 ? (
                        <Tr>
                          <Td colSpan={9} style={{ textAlign: 'center', padding: 'var(--pf-t--global--spacer--lg)' }}>
                            <Content component={ContentVariants.p}>
                              No deployments match your current selection. Try adjusting your API key or model filters.
                            </Content>
                          </Td>
                        </Tr>
                      ) : (
                        filteredModelData.map((model, index) => (
                          <Tr key={index}>
                            <Td>
                              <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                <FlexItem>
                                  <Button variant="link" style={{ padding: 0, fontSize: '14px', textAlign: 'left', fontWeight: 'normal' }}>
                                    {model.deployment}
                                  </Button>
                                </FlexItem>
                                <FlexItem>
                                  <Badge style={{ backgroundColor: '#f0ad00', color: '#ffffff', fontSize: '12px', padding: '2px 8px', minHeight: '20px' }}>{model.apiKeyTag}</Badge>
                                </FlexItem>
                            </Flex>
                            </Td>
                          <Td>
                              <Button variant="link" style={{ padding: 0, fontSize: '14px', textAlign: 'left', fontWeight: 'normal' }}>
                                {model.apiKey}
                              </Button>
                          </Td>
                            <Td>{model.project}</Td>
                            <Td>{model.runtime}</Td>
                            <Td>{model.requests}</Td>
                            <Td>{model.latency}</Td>
                          <Td>{model.errorRate}</Td>
                          <Td>{model.resources}</Td>
                            <Td>
                              {getStatusBadge(model.status)}
                            </Td>
                          </Tr>
                        ))
                      )}
                    </Tbody>
                  </Table>
                </CardBody>
              </Card>
            </FlexItem>

            {/* Performance Charts */}
            <FlexItem>
              <Grid hasGutter>
                {/* Token throughput chart */}
                <GridItem span={6}>
                  <Card isFullHeight>
                    <CardTitle>
                      <Title headingLevel="h4" size="md">Token throughput</Title>
                    </CardTitle>
                    <CardBody>
                      {filteredTokenThroughputData.length === 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
                          <Content component={ContentVariants.p}>
                            No data available for current selection
                          </Content>
                        </div>
                      ) : (
                        <div style={{ height: '200px', width: '100%' }}>
                          <Chart
                            ariaDesc="Token throughput over time"
                            ariaTitle="Token throughput line chart"
                            containerComponent={
                              <ChartVoronoiContainer 
                                labels={({ datum }) => `${new Date(datum.x).toLocaleTimeString()}: ${datum.y}`} 
                                constrainToVisibleArea 
                              />
                            }
                            height={200}
                            padding={{
                              bottom: 40,
                              left: 50,
                              right: 50,
                              top: 20
                            }}
                            themeColor={ChartThemeColor.blue}
                          >
                            <ChartAxis dependentAxis showGrid />
                            <ChartAxis 
                              tickFormat={(x) => new Date(x).toLocaleTimeString('en-US', { 
                                hour: 'numeric', 
                                hour12: true 
                              })}
                            />
                            <ChartLine
                              data={filteredTokenThroughputData}
                              interpolation="monotoneX"
                            />
                          </Chart>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </GridItem>

                {/* Request queue length chart */}
                <GridItem span={6}>
                  <Card isFullHeight>
                    <CardTitle>
                      <Title headingLevel="h4" size="md">Request queue length</Title>
                    </CardTitle>
                    <CardBody>
                      {filteredRequestQueueData.length === 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
                          <Content component={ContentVariants.p}>
                            No data available for current selection
                          </Content>
                        </div>
                      ) : (
                        <div style={{ height: '200px', width: '100%' }}>
                          <Chart
                            ariaDesc="Request queue length over time"
                            ariaTitle="Request queue length line chart"
                            containerComponent={
                              <ChartVoronoiContainer 
                                labels={({ datum }) => `${new Date(datum.x).toLocaleTimeString()}: ${datum.y}`} 
                                constrainToVisibleArea 
                              />
                            }
                          height={200}
                          padding={{
                            bottom: 40,
                            left: 50,
                            right: 50,
                            top: 20
                          }}
                            themeColor={ChartThemeColor.orange}
                          >
                            <ChartAxis dependentAxis showGrid />
                            <ChartAxis 
                              tickFormat={(x) => new Date(x).toLocaleTimeString('en-US', { 
                                hour: 'numeric', 
                                hour12: true 
                              })}
                            />
                            <ChartLine
                              data={filteredRequestQueueData}
                              interpolation="monotoneX"
                            />
                          </Chart>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </GridItem>

                {/* Replica count chart */}
                <GridItem span={6}>
                  <Card isFullHeight>
                    <CardTitle>
                      <Title headingLevel="h4" size="md">Replica count</Title>
                    </CardTitle>
                    <CardBody>
                      {filteredReplicaCountData.length === 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
                          <Content component={ContentVariants.p}>
                            No data available for current selection
                          </Content>
                        </div>
                      ) : (
                        <div style={{ height: '200px', width: '100%' }}>
                          <Chart
                            ariaDesc="Replica count over time"
                            ariaTitle="Replica count line chart"
                            containerComponent={
                              <ChartVoronoiContainer 
                                labels={({ datum }) => `${new Date(datum.x).toLocaleTimeString()}: ${datum.y}`} 
                                constrainToVisibleArea 
                              />
                            }
                          height={200}
                          padding={{
                            bottom: 40,
                            left: 50,
                            right: 50,
                            top: 20
                          }}
                            themeColor={ChartThemeColor.green}
                          >
                            <ChartAxis dependentAxis showGrid />
                            <ChartAxis 
                              tickFormat={(x) => new Date(x).toLocaleTimeString('en-US', { 
                                hour: 'numeric', 
                                hour12: true 
                              })}
                            />
                            <ChartLine
                              data={filteredReplicaCountData}
                              interpolation="monotoneX"
                            />
                          </Chart>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </GridItem>

                {/* Request latency chart */}
                <GridItem span={6}>
                  <Card isFullHeight>
                    <CardTitle>
                      <Title headingLevel="h4" size="md">Request latency</Title>
                    </CardTitle>
                    <CardBody>
                      {filteredRequestLatencyData.length === 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
                          <Content component={ContentVariants.p}>
                            No data available for current selection
                          </Content>
                        </div>
                      ) : (
                        <div style={{ height: '200px', width: '100%' }}>
                          <Chart
                            ariaDesc="Request latency over time"
                            ariaTitle="Request latency line chart"
                            containerComponent={
                              <ChartVoronoiContainer 
                                labels={({ datum }) => `${new Date(datum.x).toLocaleTimeString()}: ${datum.y} ms`} 
                                constrainToVisibleArea 
                              />
                            }
                          height={200}
                          padding={{
                            bottom: 40,
                            left: 50,
                            right: 50,
                            top: 20
                          }}
                            themeColor={ChartThemeColor.purple}
                          >
                            <ChartAxis dependentAxis showGrid tickFormat={(x) => `${x} ms`} />
                            <ChartAxis 
                              tickFormat={(x) => new Date(x).toLocaleTimeString('en-US', { 
                                hour: 'numeric', 
                                hour12: true 
                              })}
                            />
                            <ChartLine
                              data={filteredRequestLatencyData}
                              interpolation="monotoneX"
                            />
                          </Chart>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>
            </FlexItem>
          </>
        )}

        {selectedTab === 'Usage' && (
          <>
            {/* Usage Metrics */}
            <FlexItem>
              <Card>
                <CardTitle>
                  <Title headingLevel="h3" size="lg">Usage</Title>
                </CardTitle>
                <CardBody>
              <Grid hasGutter>
                <GridItem span={2}>
                  <Flex direction={{ default: 'column' }}>
                    <FlexItem>
                      <Content component={ContentVariants.small}>Total requests</Content>
                    </FlexItem>
                    <FlexItem>
                      <Title headingLevel="h4" size="xl">{usageMetrics.totalRequests}</Title>
                    </FlexItem>
                  </Flex>
                </GridItem>
                <GridItem span={2}>
                  <Flex direction={{ default: 'column' }}>
                    <FlexItem>
                      <Content component={ContentVariants.small}>Error Rate</Content>
                    </FlexItem>
                    <FlexItem>
                      <Title headingLevel="h4" size="xl">{usageMetrics.errorRate}</Title>
                    </FlexItem>
                  </Flex>
                </GridItem>
                <GridItem span={3}>
                  <Flex direction={{ default: 'column' }}>
                    <FlexItem>
                      <Content component={ContentVariants.small}>Avg. Latency</Content>
                    </FlexItem>
                    <FlexItem>
                      <Title headingLevel="h4" size="xl">{usageMetrics.avgLatency}</Title>
                    </FlexItem>
                  </Flex>
                </GridItem>
                <GridItem span={2}>
                  <Flex direction={{ default: 'column' }}>
                    <FlexItem>
                      <Content component={ContentVariants.small}>Total Cost (not 3.3)</Content>
                    </FlexItem>
                    <FlexItem>
                      <Title headingLevel="h4" size="xl">{usageMetrics.totalCost}</Title>
                    </FlexItem>
                  </Flex>
                </GridItem>
                <GridItem span={3}>
                  <Flex direction={{ default: 'column' }}>
                    <FlexItem>
                      <Content component={ContentVariants.small}>Total Token</Content>
                    </FlexItem>
                    <FlexItem>
                      <Title headingLevel="h4" size="xl">{usageMetrics.totalToken}</Title>
                    </FlexItem>
                  </Flex>
                </GridItem>
              </Grid>
            </CardBody>
          </Card>
        </FlexItem>

        {/* Charts Section - Side by Side */}
        <FlexItem>
          <Grid hasGutter>
            {/* Usage per Group Chart */}
            <GridItem span={6}>
              <Card isFullHeight>
                <CardTitle>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                    <FlexItem>
                      <Title headingLevel="h3" size="lg">Usage per Group</Title>
                    </FlexItem>
                    <FlexItem>
                      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem>
                          <Dropdown
                            onSelect={() => setGroupByOpen(false)}
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                              <MenuToggle ref={toggleRef} onClick={onGroupByToggle} isExpanded={groupByOpen}>
                                Group by: Users
                              </MenuToggle>
                            )}
                            isOpen={groupByOpen}
                          >
                            <DropdownList>
                              <DropdownItem value="users">Users</DropdownItem>
                              <DropdownItem value="models">Models</DropdownItem>
                            </DropdownList>
                          </Dropdown>
                        </FlexItem>
                        <FlexItem>
                          <Dropdown
                            onSelect={() => setMetricsOpen(false)}
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                              <MenuToggle ref={toggleRef} onClick={onMetricsToggle} isExpanded={metricsOpen}>
                                Metrics: Tokens
                              </MenuToggle>
                            )}
                            isOpen={metricsOpen}
                          >
                            <DropdownList>
                              <DropdownItem value="tokens">Tokens</DropdownItem>
                              <DropdownItem value="requests">Requests</DropdownItem>
                              <DropdownItem value="cost">Cost</DropdownItem>
                            </DropdownList>
                          </Dropdown>
                        </FlexItem>
                        <FlexItem>
                          <Button variant="plain" aria-label="Table view">
                            <TableIcon />
                          </Button>
                        </FlexItem>
                        <FlexItem>
                          <Button variant="primary" aria-label="Export">
                            Export
                          </Button>
                        </FlexItem>
                      </Flex>
                    </FlexItem>
                  </Flex>
                </CardTitle>
                <CardBody>
                  <div style={{ height: '400px', width: '100%' }}>
                    <Chart
                      ariaDesc="Average usage per user group"
                      ariaTitle="Usage per group bar chart"
                      containerComponent={
                        <ChartVoronoiContainer 
                          labels={({ datum }) => `${datum.name}: ${datum.y}`} 
                          constrainToVisibleArea 
                        />
                      }
                    domain={{ y: [0, 10] }}
                      domainPadding={{ x: [30, 25] }}
                      legendData={legendData}
                      legendOrientation="vertical"
                      legendPosition="right"
                      height={400}
                    padding={{
                      bottom: 50,
                      left: 50,
                        right: 160, // Adjusted for smaller width
                      top: 50
                    }}
                      themeColor={ChartThemeColor.multi}
                    >
                      <ChartAxis />
                      <ChartAxis dependentAxis showGrid />
                      <ChartGroup offset={11}>
                        <ChartBar data={llmChatData} />
                        <ChartBar data={mistralData} />
                        <ChartBar data={stableDiffusionData} />
                      </ChartGroup>
                    </Chart>
                  </div>
                </CardBody>
              </Card>
            </GridItem>

            {/* Usage Trends Chart */}
            <GridItem span={6}>
              <Card isFullHeight>
                <CardTitle>
                  <Flex alignItems={{ default: 'alignItemsCenter' }} justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                    <FlexItem>
                      <Title headingLevel="h3" size="lg">Usage Trends</Title>
                    </FlexItem>
                    <FlexItem>
                      <Dropdown
                        onSelect={() => setTrendsOpen(false)}
                        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                          <MenuToggle ref={toggleRef} onClick={onTrendsToggle} isExpanded={trendsOpen}>
                            Last 6 months
                          </MenuToggle>
                        )}
                        isOpen={trendsOpen}
                      >
                        <DropdownList>
                          <DropdownItem value="6months">Last 6 months</DropdownItem>
                          <DropdownItem value="3months">Last 3 months</DropdownItem>
                          <DropdownItem value="1month">Last month</DropdownItem>
                        </DropdownList>
                      </Dropdown>
                    </FlexItem>
                  </Flex>
                </CardTitle>
                <CardBody>
                  <div style={{ height: '400px', width: '100%' }}>
                    <Chart
                      ariaDesc="Usage trends over time"
                      ariaTitle="Model usage trends line chart"
                      containerComponent={
                        <ChartVoronoiContainer 
                          labels={({ datum }) => `${new Date(datum.x).toLocaleDateString()}: ${datum.y}`} 
                          constrainToVisibleArea 
                        />
                      }
                    domain={{ y: [0, 10] }}
                      legendData={legendData}
                      legendOrientation="vertical"
                      legendPosition="right"
                      height={400}
                    padding={{
                      bottom: 50,
                      left: 50,
                        right: 160, // Adjusted for smaller width
                      top: 50
                    }}
                      themeColor={ChartThemeColor.multi}
                    >
                      <ChartAxis dependentAxis showGrid tickFormat={(x) => `${x}`} />
                      <ChartAxis 
                        tickFormat={(x) => new Date(x).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <ChartArea
                        data={usageTrendsData['llm-7b-chat']}
                        interpolation="monotoneX"
                      />
                      <ChartLine
                        data={usageTrendsData['mistral-7b-instruct-v2']}
                        interpolation="monotoneX"
                      />
                      <ChartLine
                        data={usageTrendsData['stable-diffusion-xl-beta']}
                        interpolation="monotoneX"
                      />
                    </Chart>
                  </div>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
        </FlexItem>
        </>
        )}

        {selectedTab === 'Traces' && (
          <FlexItem>
            <Card>
              <CardBody>
                {/* Header Section */}
                <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }}>
                  <FlexItem>
                    <Title headingLevel="h1" size="2xl">Request traces</Title>
                  </FlexItem>
                  <FlexItem>
    <Content component={ContentVariants.p}>
                      View distributed traces for user requests with detailed service timelines and performance metrics.
    </Content>
                  </FlexItem>
                  <FlexItem>
                    <Flex spaceItems={{ default: 'spaceItemsMd' }}>
                      {/* Left side filters */}
                      <FlexItem>
                        <Flex spaceItems={{ default: 'spaceItemsMd' }}>
                          <FlexItem>
                            <Dropdown
                              onSelect={(event, value) => {
                                if (value) {
                                  setServiceName(value as string);
                                  setServiceNameOpen(false);
                                }
                              }}
                              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                <MenuToggle ref={toggleRef} onClick={() => setServiceNameOpen(!serviceNameOpen)} isExpanded={serviceNameOpen}>
                                  Service Name: {serviceName}
                                </MenuToggle>
                              )}
                              isOpen={serviceNameOpen}
                            >
                              <DropdownList>
                                <DropdownItem value="All Services">All Services</DropdownItem>
                              </DropdownList>
                            </Dropdown>
                          </FlexItem>
                          <FlexItem>
                            <Dropdown
                              onSelect={(event, value) => {
                                if (value) {
                                  setNamespace(value as string);
                                  setNamespaceOpen(false);
                                }
                              }}
                              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                <MenuToggle ref={toggleRef} onClick={() => setNamespaceOpen(!namespaceOpen)} isExpanded={namespaceOpen}>
                                  Namespace: {namespace}
                                </MenuToggle>
                              )}
                              isOpen={namespaceOpen}
                            >
                              <DropdownList>
                                <DropdownItem value="All Namespaces">All Namespaces</DropdownItem>
                              </DropdownList>
                            </Dropdown>
                          </FlexItem>
                          <FlexItem>
                            <Dropdown
                              onSelect={(event, value) => {
                                if (value) {
                                  setModelFilter(value as string);
                                  setModelFilterOpen(false);
                                }
                              }}
                              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                <MenuToggle ref={toggleRef} onClick={() => setModelFilterOpen(!modelFilterOpen)} isExpanded={modelFilterOpen}>
                                  Model: {modelFilter}
                                </MenuToggle>
                              )}
                              isOpen={modelFilterOpen}
                            >
                              <DropdownList>
                                <DropdownItem value="All Models">All Models</DropdownItem>
                              </DropdownList>
                            </Dropdown>
                          </FlexItem>
                        </Flex>
                      </FlexItem>
                      {/* Right side filters */}
                      <FlexItem grow={{ default: 'grow' }} />
                      <FlexItem>
                        <Flex spaceItems={{ default: 'spaceItemsMd' }}>
                          <FlexItem>
                            <Dropdown
                              onSelect={(event, value) => {
                                if (value) {
                                  setTimeRange(value as string);
                                  setTimeRangeOpen(false);
                                }
                              }}
                              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                <MenuToggle ref={toggleRef} onClick={() => setTimeRangeOpen(!timeRangeOpen)} isExpanded={timeRangeOpen}>
                                  Time range: {timeRange}
                                </MenuToggle>
                              )}
                              isOpen={timeRangeOpen}
                            >
                              <DropdownList>
                                <DropdownItem value="Last 1 hour">Last 1 hour</DropdownItem>
                                <DropdownItem value="Last 6 hours">Last 6 hours</DropdownItem>
                                <DropdownItem value="Last 24 hours">Last 24 hours</DropdownItem>
                                <DropdownItem value="Last 7 days">Last 7 days</DropdownItem>
                              </DropdownList>
                            </Dropdown>
                          </FlexItem>
                          <FlexItem>
                            <Dropdown
                              onSelect={(event, value) => {
                                if (value) {
                                  setLimitTraces(value as string);
                                  setLimitTracesOpen(false);
                                }
                              }}
                              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                <MenuToggle ref={toggleRef} onClick={() => setLimitTracesOpen(!limitTracesOpen)} isExpanded={limitTracesOpen}>
                                  Limit traces: {limitTraces}
                                </MenuToggle>
                              )}
                              isOpen={limitTracesOpen}
                            >
                              <DropdownList>
                                <DropdownItem value="20">20</DropdownItem>
                                <DropdownItem value="50">50</DropdownItem>
                                <DropdownItem value="100">100</DropdownItem>
                              </DropdownList>
                            </Dropdown>
                          </FlexItem>
                        </Flex>
                      </FlexItem>
                    </Flex>
                  </FlexItem>
                </Flex>

                {/* Table Section */}
                <div style={{ marginTop: '1.5rem' }}>
                  <Table aria-label="Request traces table">
                    <Thead>
                      <Tr>
                        <Th>USER</Th>
                        <Th>TRACE ID</Th>
                        <Th>TIMESTAMP</Th>
                        <Th>DURATION</Th>
                        <Th>MODEL</Th>
                        <Th>STATUS</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {traceData.map((trace, index) => (
                        <Tr key={index}>
                          <Td dataLabel="USER">
                            <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsXs' }}>
                              <FlexItem>
                                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXs' }}>
                                  <FlexItem>
                                    <div
                                      style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        backgroundColor: trace.statusIcon
                                      }}
                                    />
                                  </FlexItem>
                                  <FlexItem>
                                    <Content component={ContentVariants.p} style={{ fontWeight: 'bold', color: '#0066cc' }}>
                                      {trace.user}
                                    </Content>
                                  </FlexItem>
                                </Flex>
                              </FlexItem>
                              <FlexItem>
                                <Content component={ContentVariants.small} style={{ color: '#6a6e73' }}>
                                  {trace.userDetails}
                                </Content>
                              </FlexItem>
                            </Flex>
                          </Td>
                          <Td dataLabel="TRACE ID">
                            {trace.traceId ? (
                              <Content component={ContentVariants.p} style={{ color: '#0066cc', cursor: 'pointer' }}>
                                {trace.traceId}
                              </Content>
                            ) : (
                              <Content component={ContentVariants.p} style={{ color: '#6a6e73' }}>
                                No trace
                              </Content>
                            )}
                          </Td>
                          <Td dataLabel="TIMESTAMP">
                            <Content component={ContentVariants.p}>{trace.timestamp}</Content>
                          </Td>
                          <Td dataLabel="DURATION">
                            <span
                              style={{
                                backgroundColor: trace.durationColor,
                                color: trace.duration === 'N/A' ? '#151515' : '#ffffff',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: '500'
                              }}
                            >
                              {trace.duration}
                            </span>
                          </Td>
                          <Td dataLabel="MODEL">
                            <Content component={ContentVariants.p} style={{ color: '#0066cc', cursor: 'pointer' }}>
                              {trace.model}
                            </Content>
                          </Td>
                          <Td dataLabel="STATUS">
                            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsXs' }}>
                              <FlexItem>
                                <div
                                  style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: trace.statusIcon
                                  }}
                                />
                              </FlexItem>
                              <FlexItem>
                                <Content
                                  component={ContentVariants.p}
                                  style={{
                                    color: trace.status === 'success' ? '#3e8635' : trace.status === 'warning' ? '#f0ad00' : '#6a6e73',
                                    textTransform: 'capitalize'
                                  }}
                                >
                                  {trace.status}
                                </Content>
                              </FlexItem>
                            </Flex>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </div>
              </CardBody>
            </Card>
          </FlexItem>
        )}

        {/* Perses content removed */}
      </Flex>
  </PageSection>
);
};

export { Dashboard };
