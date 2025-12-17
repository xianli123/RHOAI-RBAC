import React from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import {
  Alert,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  CardHeader,
  CodeBlock,
  CodeBlockCode,
  DataList,
  DataListItem,
  DataListItemRow,
  DataListCell,
  DataListToggle,
  DataListContent,
  DataListItemCells,
  Divider,
  Grid,
  GridItem,
  Label,
  LabelGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  PageSection,
  Progress,
  Title,
  Tooltip,
  Tab,
  TabTitleText,
  Tabs,
  Popover,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  Select,
  SelectList,
  SelectOption,
  Slider,
  TextInput,
  Checkbox,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Panel,
  PanelMain,
  PanelMainBody,
  Menu,
  MenuContent,
  MenuList,
  MenuItem,
} from '@patternfly/react-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  ThProps,
  InnerScrollContainer,
} from '@patternfly/react-table';
import {
  CheckCircleIcon,
  CopyIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  InfoCircleIcon,
  LinkIcon,
  PlayIcon,
  PlusCircleIcon,
  OutlinedQuestionCircleIcon,
  ColumnsIcon,
  FilterIcon,
  MonitoringIcon,
} from '@patternfly/react-icons';
import { useDocumentTitle } from '../../utils/useDocumentTitle';
import { useFeatureFlags } from '../../utils/FeatureFlagsContext';
import { modelLogos } from './modelLogos';
import genericModelIcon from '@app/assets/generic-model-icon.png';
import { MODELS } from '../../../data/models';
import type { Model } from '../../../types';
import { usePerformanceFilters, DEFAULT_LATENCY_METRIC, DEFAULT_LATENCY_PERCENTILE, DEFAULT_LATENCY_VALUE, DEFAULT_RPS_VALUE, DEFAULT_WORKLOAD, WORKLOAD_OPTIONS } from '../../../hooks/usePerformanceFilters';
import { generateModelBenchmarks, filterBenchmarks, getAvailableWorkloads, getAvailableHardware } from '../../../lib/benchmarks';
import { useColumnPreferences } from '../../../hooks/useColumnPreferences';
import { COLUMN_DEFINITIONS, getColumnById, getDefaultVisibleColumns } from '../../../lib/columnConfig';
import type { BenchmarkData } from '../../../lib/benchmarks';
import ValidatedModelIcon from '@app/assets/validated-model.svg';
import RedHatIcon from '@app/assets/the-hat.svg';
import GenericModelSvgIcon from '@app/assets/generic-model-icon.svg';

// Helper function to get display name (removes repo prefix like "RedHatAI/")
const getDisplayName = (name: string): string => {
  const slashIndex = name.lastIndexOf('/');
  return slashIndex !== -1 ? name.substring(slashIndex + 1) : name;
};

// Simple markdown to HTML converter
const markdownToHtml = (markdown: string): string => {
  let html = markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    // Code blocks
    .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Unordered lists
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    // Wrap consecutive list items in ul tags
    .replace(/(<li>.*<\/li>\n?)+/gim, '<ul>$&</ul>')
    // Ordered lists
    .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
    // Line breaks
    .replace(/\n\n/gim, '</p><p>')
    .replace(/\n/gim, '<br>');
  
  // Wrap in paragraph tags
  html = '<p>' + html + '</p>';
  
  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/gim, '');
  html = html.replace(/<p>(<h[1-6]>)/gim, '$1');
  html = html.replace(/(<\/h[1-6]>)<\/p>/gim, '$1');
  html = html.replace(/<p>(<ul>)/gim, '$1');
  html = html.replace(/(<\/ul>)<\/p>/gim, '$1');
  html = html.replace(/<p>(<pre>)/gim, '$1');
  html = html.replace(/(<\/pre>)<\/p>/gim, '$1');
  
  return html;
};

type ModelDetailsProps = Record<string, never>;

const ModelDetails: React.FunctionComponent<ModelDetailsProps> = () => {
  const { modelSlug } = useParams<{ modelSlug: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { flags } = useFeatureFlags();
  
  // Find the model by ID (modelSlug is actually modelId from ModelCatalog navigation)
  const model = MODELS.find(m => m.id === modelSlug);
  
  // Performance filters from URL
  const {
    workload,
    latencyMetric,
    latencyPercentile,
    latencyValue,
    rpsValue,
    hardware,
    setWorkload,
    setLatencyMetric,
    setLatencyPercentile,
    setLatencyValue,
    setLatencyFilters,
    setRpsValue,
    setHardware,
    resetAll: resetPerformanceFilters,
  } = usePerformanceFilters();
  
  // Check if model is validated (only validated models have Performance tab)
  const isValidated = model?.category === 'validated';
  
  // Memoized catalog URL that preserves filters but removes details-page-specific params
  const catalogUrl = React.useMemo(() => {
    const catalogParams = new URLSearchParams(searchParams);
    catalogParams.delete('tab'); // Remove details-page-specific param
    const paramString = catalogParams.toString();
    return `/ai-hub/catalog${paramString ? `?${paramString}` : ''}`;
  }, [searchParams]);
  
  // Active tab state - check URL param for tab selection
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = React.useState<string | number>(() => {
    if (tabParam === 'performance' && isValidated) {
      return 1;
    }
    return 0;
  });
  
  // Column preferences for performance table
  const {
    visibleColumns,
    toggleColumn,
    setVisibleColumns,
    restoreDefaults,
    isColumnVisible,
  } = useColumnPreferences(latencyMetric, latencyPercentile);
  
  // Reorder visible columns so latency columns appear after Total RPS
  const orderedVisibleColumns = React.useMemo(() => {
    // Define the desired order: non-latency columns first (up to and including totalRps), then latency, then rest
    const preLatencyColumns = ['replicas', 'totalHardware', 'rpsPerReplica', 'totalRps'];
    const latencyColumns = visibleColumns.filter(colId => {
      const col = getColumnById(colId);
      return col?.group === 'latency';
    });
    const otherColumns = visibleColumns.filter(colId => {
      const col = getColumnById(colId);
      return col?.group !== 'latency' && !preLatencyColumns.includes(colId);
    });
    
    // Build ordered list: pre-latency columns (in order), then latency, then other
    const ordered: string[] = [];
    
    // Add pre-latency columns in their defined order
    for (const colId of preLatencyColumns) {
      if (visibleColumns.includes(colId)) {
        ordered.push(colId);
      }
    }
    
    // Add latency columns
    ordered.push(...latencyColumns);
    
    // Add remaining columns (metadata like versions, request profile, etc.)
    ordered.push(...otherColumns);
    
    return ordered;
  }, [visibleColumns]);
  
  // Customize columns modal state
  const [isCustomizeColumnsOpen, setIsCustomizeColumnsOpen] = React.useState(false);
  const [expandedGroups, setExpandedGroups] = React.useState<string[]>(['hardware', 'metadata', 'latency', 'requestProfile']);
  const [tempVisibleColumns, setTempVisibleColumns] = React.useState<string[]>([]);
  
  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };
  
  // Open modal and initialize temp state
  const openCustomizeColumnsModal = () => {
    setTempVisibleColumns([...visibleColumns]);
    setIsCustomizeColumnsOpen(true);
  };
  
  // Toggle column in temp state
  const toggleTempColumn = (columnId: string) => {
    setTempVisibleColumns(prev => 
      prev.includes(columnId)
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    );
  };
  
  // Check if column is visible in temp state
  const isTempColumnVisible = (columnId: string) => tempVisibleColumns.includes(columnId);
  
  // Apply changes and close modal
  const handleUpdateColumns = () => {
    // Apply temp state to actual visible columns
    setVisibleColumns([...tempVisibleColumns]);
    setIsCustomizeColumnsOpen(false);
  };
  
  // Cancel and discard changes
  const handleCancelColumns = () => {
    setTempVisibleColumns([]);
    setIsCustomizeColumnsOpen(false);
  };
  
  // Restore defaults in temp state
  const handleRestoreDefaults = () => {
    const defaults = getDefaultVisibleColumns(latencyMetric, latencyPercentile);
    setTempVisibleColumns(defaults);
  };

  // Table sort state - default to sorting by the current latency column
  const [activeSortIndex, setActiveSortIndex] = React.useState<number | null>(null);
  const [activeSortDirection, setActiveSortDirection] = React.useState<'asc' | 'desc' | null>(null);

  // Initialize/update sort to the current latency column when filter changes
  React.useEffect(() => {
    // Build the latency column ID from current filter
    const latencyColId = `${latencyMetric.toLowerCase()}-${latencyPercentile.toLowerCase()}`;
    
    // Find the index of this column in orderedVisibleColumns
    const colIndex = orderedVisibleColumns.findIndex(colId => colId === latencyColId);
    
    if (colIndex !== -1) {
      // Column index is offset by 1 because Hardware is column 0
      setActiveSortIndex(colIndex + 1);
      setActiveSortDirection('asc');
    }
  }, [latencyMetric, latencyPercentile, orderedVisibleColumns]);

  // Table overflow detection for conditional sticky column
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const [hasTableOverflow, setHasTableOverflow] = React.useState(false);

  // Workload dropdown state
  const [isWorkloadOpen, setIsWorkloadOpen] = React.useState(false);
  const workloadMenuRef = React.useRef<HTMLDivElement>(null);
  
  // Hardware dropdown state (hardware values come from benchmark data)
  const [isHardwareOpen, setIsHardwareOpen] = React.useState(false);
  
  // Latency and RPS panel dropdown state
  const [isLatencyOpen, setIsLatencyOpen] = React.useState(false);
  const [isRpsOpen, setIsRpsOpen] = React.useState(false);
  const latencyPanelRef = React.useRef<HTMLDivElement>(null);
  const rpsPanelRef = React.useRef<HTMLDivElement>(null);
  
  // Local state for latency panel (pending values before Apply)
  const [pendingLatencyMetric, setPendingLatencyMetric] = React.useState(latencyMetric);
  const [pendingLatencyPercentile, setPendingLatencyPercentile] = React.useState(latencyPercentile);
  const [pendingLatencyValue, setPendingLatencyValue] = React.useState(latencyValue);
  // Store initial values when panel opens (for Reset)
  const latencyInitialValuesRef = React.useRef({ metric: latencyMetric, percentile: latencyPercentile, value: latencyValue });
  // Metric and Percentile dropdown state within latency panel
  const [isMetricSelectOpen, setIsMetricSelectOpen] = React.useState(false);
  const [isPercentileSelectOpen, setIsPercentileSelectOpen] = React.useState(false);
  const metricMenuRef = React.useRef<HTMLDivElement>(null);
  const percentileMenuRef = React.useRef<HTMLDivElement>(null);
  
  // Local state for RPS panel
  const [pendingRpsValue, setPendingRpsValue] = React.useState(rpsValue);
  const rpsInitialValueRef = React.useRef(rpsValue);
  
  // When opening latency panel, store initial values and sync pending state
  const handleOpenLatencyPanel = () => {
    if (!isLatencyOpen) {
      latencyInitialValuesRef.current = { metric: latencyMetric, percentile: latencyPercentile, value: latencyValue };
      setPendingLatencyMetric(latencyMetric);
      setPendingLatencyPercentile(latencyPercentile);
      setPendingLatencyValue(latencyValue);
    }
    setIsLatencyOpen(!isLatencyOpen);
  };
  
  // When opening RPS panel, store initial value and sync pending state
  const handleOpenRpsPanel = () => {
    if (!isRpsOpen) {
      rpsInitialValueRef.current = rpsValue;
      setPendingRpsValue(rpsValue);
    }
    setIsRpsOpen(!isRpsOpen);
  };
  
  // Apply latency filters
  const handleApplyLatency = () => {
    setLatencyFilters(pendingLatencyMetric, pendingLatencyPercentile, pendingLatencyValue);
    setIsLatencyOpen(false);
  };
  
  // Reset latency to values when panel was opened
  const handleResetLatency = () => {
    setPendingLatencyMetric(latencyInitialValuesRef.current.metric);
    setPendingLatencyPercentile(latencyInitialValuesRef.current.percentile);
    setPendingLatencyValue(latencyInitialValuesRef.current.value);
  };
  
  // Apply RPS filter
  const handleApplyRps = () => {
    setRpsValue(pendingRpsValue);
    setIsRpsOpen(false);
  };
  
  // Reset RPS to value when panel was opened
  const handleResetRps = () => {
    setPendingRpsValue(rpsInitialValueRef.current);
  };
  
  // Close panels when clicking outside (discard pending changes)
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (latencyPanelRef.current && !latencyPanelRef.current.contains(event.target as Node)) {
        setIsLatencyOpen(false);
      }
      if (rpsPanelRef.current && !rpsPanelRef.current.contains(event.target as Node)) {
        setIsRpsOpen(false);
      }
      if (workloadMenuRef.current && !workloadMenuRef.current.contains(event.target as Node)) {
        setIsWorkloadOpen(false);
      }
      // Close metric/percentile menus when clicking outside their container
      if (metricMenuRef.current && !metricMenuRef.current.contains(event.target as Node)) {
        setIsMetricSelectOpen(false);
      }
      if (percentileMenuRef.current && !percentileMenuRef.current.contains(event.target as Node)) {
        setIsPercentileSelectOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useDocumentTitle(model ? `${getDisplayName(model.name)} - Model Details` : 'Model Details');

  // Generate all benchmarks for the model (unfiltered) to determine available workloads
  const allBenchmarks = React.useMemo(() => {
    if (!model || !isValidated) return [];
    return generateModelBenchmarks(model);
  }, [model, isValidated]);

  // Get available workload types from the benchmark data
  const availableWorkloads = React.useMemo(() => {
    return getAvailableWorkloads(allBenchmarks);
  }, [allBenchmarks]);

  // Filter workload options to only show those with benchmark data
  const filteredWorkloadOptions = React.useMemo(() => {
    return WORKLOAD_OPTIONS.filter(opt => availableWorkloads.includes(opt.value));
  }, [availableWorkloads]);

  // Get available hardware options for the selected workload
  const hardwareOptions = React.useMemo(() => {
    return getAvailableHardware(allBenchmarks, workload);
  }, [allBenchmarks, workload]);

  // Auto-select a valid workload if current one isn't available
  React.useEffect(() => {
    if (availableWorkloads.length > 0 && !availableWorkloads.includes(workload)) {
      setWorkload(availableWorkloads[0]);
    }
  }, [availableWorkloads, workload, setWorkload]);

  // Clear invalid hardware selections when workload changes
  React.useEffect(() => {
    if (hardware.length > 0 && hardwareOptions.length > 0) {
      const validHardware = hardware.filter(h => hardwareOptions.includes(h));
      if (validHardware.length !== hardware.length) {
        setHardware(validHardware);
      }
    }
  }, [hardware, hardwareOptions, setHardware]);

  // Generate filtered benchmarks for display
  const benchmarks = React.useMemo(() => {
    if (!model || !isValidated) return [];
    return filterBenchmarks(allBenchmarks, {
      workload,
      hardware,
      latencyValue,
      rpsValue,
      latencyMetric,
      latencyPercentile,
    });
  }, [model, isValidated, allBenchmarks, workload, hardware, latencyValue, rpsValue, latencyMetric, latencyPercentile]);

  // Get sortable value for a benchmark based on column
  const getSortableValue = React.useCallback((benchmark: BenchmarkData, columnIndex: number): string | number => {
    // Column 0 is always hardware configuration
    if (columnIndex === 0) {
      return benchmark.hardware;
    }
    
    // Get the column ID from ordered visible columns (offset by 1 for hardware column)
    const colId = orderedVisibleColumns[columnIndex - 1];
    if (!colId) return '';
    
    const col = getColumnById(colId);
    if (!col) return '';
    
    // Handle latency columns
    if (col.group === 'latency' && col.latencyMetric && col.latencyPercentile) {
      return benchmark.latencyData[col.latencyMetric][col.latencyPercentile];
    }
    
    // Handle metadata columns
    if (col.group === 'metadata') {
      const rawValue = benchmark[col.id as keyof BenchmarkData];
      if (typeof rawValue === 'object' && rawValue !== null && 'TTFT' in rawValue) {
        return '';
      }
      return typeof rawValue === 'number' ? rawValue : String(rawValue);
    }
    
    // Handle hardware columns
    if (col.group === 'hardware') {
      if (col.id === 'replicas') return benchmark.replicas;
      if (col.id === 'totalHardware') return benchmark.hardwareCount * benchmark.replicas;
    }
    
    // Handle request profile columns
    if (col.group === 'requestProfile') {
      if (col.id === 'targetInputTokens') return benchmark.targetInputTokens;
      if (col.id === 'targetOutputTokens') return benchmark.targetOutputTokens;
    }
    
    return '';
  }, [orderedVisibleColumns]);

  // Sort benchmarks based on active sort
  const sortedBenchmarks = React.useMemo(() => {
    if (activeSortIndex === null || activeSortDirection === null) {
      return benchmarks;
    }
    
    return [...benchmarks].sort((a, b) => {
      const aValue = getSortableValue(a, activeSortIndex);
      const bValue = getSortableValue(b, activeSortIndex);
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        // Numeric sort
        return activeSortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      } else {
        // String sort
        const aStr = String(aValue);
        const bStr = String(bValue);
        return activeSortDirection === 'asc' 
          ? aStr.localeCompare(bStr) 
          : bStr.localeCompare(aStr);
      }
    });
  }, [benchmarks, activeSortIndex, activeSortDirection, getSortableValue]);

  // Detect table overflow to conditionally make first column sticky
  React.useEffect(() => {
    const checkOverflow = () => {
      if (tableContainerRef.current) {
        const hasOverflow = tableContainerRef.current.scrollWidth > tableContainerRef.current.clientWidth;
        setHasTableOverflow(hasOverflow);
      }
    };

    // Initial check
    checkOverflow();

    // Observe resize changes
    const resizeObserver = new ResizeObserver(checkOverflow);
    if (tableContainerRef.current) {
      resizeObserver.observe(tableContainerRef.current);
    }

    // Also check on window resize
    window.addEventListener('resize', checkOverflow);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', checkOverflow);
    };
  }, [visibleColumns, sortedBenchmarks]); // Re-check when columns or data changes

  // Get sort params for a column
  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: {
      index: activeSortIndex as number,
      direction: activeSortDirection as 'asc' | 'desc',
      defaultDirection: 'asc'
    },
    onSort: (_event, index, direction) => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
    },
    columnIndex
  });

  // Find related compression models (same base model, different compression levels)
  const compressionModels = React.useMemo(() => {
    if (!model || !isValidated) return [];
    
    // Extract base model name (e.g., "Llama-3.1-8B-Instruct" from "Llama-3.1-8B-Instruct-FP8")
    // Remove compression suffixes like -FP8, -FP16, etc.
    const baseNameMatch = model.name.match(/^(.+?)(?:-FP\d+|-FP\d+-)?$/);
    if (!baseNameMatch) return [];
    
    // Get the base name without compression suffix
    let baseName = baseNameMatch[1];
    // Also try removing -Instruct, -Base, -Code suffixes to get a more generic base
    const genericBaseMatch = baseName.match(/^(.+?)(?:-Instruct|-Base|-Code)?$/);
    const genericBase = genericBaseMatch ? genericBaseMatch[1] : baseName;
    
    const firstPart = model.name.split('-')[0]; // e.g., "Llama" from "Llama-3.1-8B-Instruct"
    
    // Find other validated models with similar base names but different full names
    const related = MODELS.filter(m => {
      if (m.id === model.id || m.category !== 'validated' || m.name === model.name) {
        return false;
      }
      
      // Check if they share the same first part (e.g., both start with "Llama")
      const otherFirstPart = m.name.split('-')[0];
      if (firstPart === otherFirstPart && firstPart.length > 2) {
        // Extract the other model's base name
        const otherBaseMatch = m.name.match(/^(.+?)(?:-FP\d+|-FP\d+-)?$/);
        if (otherBaseMatch) {
          let otherBase = otherBaseMatch[1];
          const otherGenericMatch = otherBase.match(/^(.+?)(?:-Instruct|-Base|-Code)?$/);
          const otherGenericBase = otherGenericMatch ? otherGenericMatch[1] : otherBase;
          
          // Check if generic bases match (e.g., "Llama-3.1-8B" matches "Llama-3.1-8B")
          if (genericBase === otherGenericBase) {
            return true;
          }
        }
      }
      
      return false;
    });
    
    return related.slice(0, 3); // Limit to 3 related models
  }, [model, isValidated]);

  if (!model) {
    return (
      <PageSection>
        <Title headingLevel="h1" size="2xl">Model Not Found</Title>
        <p>The requested model could not be found.</p>
        <Button variant="primary" onClick={() => navigate('/ai-hub/catalog')}>
          Back to Model Catalog
        </Button>
      </PageSection>
    );
  }



  // Handle navigation back to catalog with filters preserved
  const handleBackToCatalog = () => {
    const params = new URLSearchParams();
    // Preserve all current filter params
    searchParams.forEach((value, key) => {
      params.set(key, value);
    });
    navigate(`/ai-hub/catalog?${params.toString()}`);
  };

  return (
    <PageSection isFilled style={{ padding: 0 }}>
      {/* Breadcrumbs */}
      <div style={{ padding: '1rem', paddingBottom: '0' }}>
          <Breadcrumb>
          <BreadcrumbItem>
            <Link 
              to={catalogUrl}
              onClick={() => {
                // Set flag to indicate returning from details page
                sessionStorage.setItem("returnedFromDetails", "true");
                
                // Store current performance filters for catalog to restore
                const perfFilters = JSON.stringify({
                  performanceFiltersEnabled: searchParams.get("perfFilter") === "true",
                  workload,
                  latencyMetric,
                  latencyPercentile,
                  latencyValue,
                  rpsValue,
                  hardware
                });
                sessionStorage.setItem("catalogPerfFilters", perfFilters);
              }}
            >
              Model Catalog
            </Link>
          </BreadcrumbItem>
            <BreadcrumbItem isActive>{getDisplayName(model.name)}</BreadcrumbItem>
          </Breadcrumb>
        </div>

      {/* Header */}
      <div style={{ padding: '1rem', paddingTop: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div 
              style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              dangerouslySetInnerHTML={{ __html: model.category === 'validated' ? ValidatedModelIcon : (model.provider === 'Red Hat' ? RedHatIcon : GenericModelSvgIcon) }}
            />
            <div>
              <Title headingLevel="h1" size="2xl" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {getDisplayName(model.name)}
                {model.category === 'validated' && (
                  <Popover
                    bodyContent={
                      <div style={{ padding: '0.5rem' }}>
                        <p style={{ margin: 0, fontSize: '0.875rem' }}>
                          Validated models are benchmarked for performance and quality using leading open source evaluation datasets.
                        </p>
                      </div>
                    }
                  >
                    <Label variant="filled" color="purple" style={{ cursor: 'pointer' }}>
                      Validated
                    </Label>
                  </Popover>
                )}
                      </Title>
              <p style={{ color: '#6A6E73', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
                      {model.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onSelect={(_, key) => setActiveTab(key)}
        aria-label="Model details tabs"
      >
        <Tab eventKey={0} title={<TabTitleText>Overview</TabTitleText>}>
          <div style={{ padding: '1rem' }}>
            <Grid hasGutter>
              {/* Left Column */}
              <GridItem span={8}>
                {/* Short Description Card */}
                <Card style={{ marginBottom: '1rem' }}>
                  <CardHeader>
                    <Title headingLevel="h3" size="md">Description</Title>
                  </CardHeader>
                  <CardBody>
                    <p style={{ margin: 0, color: '#6A6E73' }}>{model.description}</p>
                  </CardBody>
                </Card>

                {/* Model Card (Hugging Face style markdown) */}
                <Card>
                  <CardHeader>
                    <Title headingLevel="h3" size="md">Model Card</Title>
                  </CardHeader>
                  <CardBody>
                    {model.modelCard ? (
                      <div 
                        style={{ 
                          maxHeight: '600px', 
                          overflowY: 'auto',
                          fontSize: '0.875rem',
                          lineHeight: '1.6',
                          padding: '1rem',
                          backgroundColor: '#fafafa',
                          border: '1px solid #d2d2d2',
                          borderRadius: '4px'
                        }}
                        dangerouslySetInnerHTML={{ __html: markdownToHtml(model.modelCard) }}
                      />
                    ) : (
                      <div style={{ color: '#6A6E73', fontStyle: 'italic' }}>
                        Model card not available
                      </div>
                    )}
                  </CardBody>
                </Card>
              </GridItem>

              {/* Right Column - Metadata */}
              <GridItem span={4}>
                <Card>
                  <CardHeader>
                    <Title headingLevel="h3" size="md">Metadata</Title>
                  </CardHeader>
                  <CardBody>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#6A6E73', marginBottom: '0.25rem' }}>Provider</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{model.provider}</div>
                      </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: '#6A6E73', marginBottom: '0.25rem' }}>License</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{model.license}</div>
                      </div>
                      {model.metrics && (
                        <>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#6A6E73', marginBottom: '0.25rem' }}>Accuracy</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                              {model.metrics.accuracy > 0 ? `${model.metrics.accuracy}%` : 'N/A'}
                            </div>
                                </div>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#6A6E73', marginBottom: '0.25rem' }}>Quality</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                              {model.metrics.quality > 0 ? `${model.metrics.quality}%` : 'N/A'}
                            </div>
                          </div>
                        </>
                      )}
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#6A6E73', marginBottom: '0.25rem' }}>Last Updated</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{model.updatedAt}</div>
                                    </div>
                                  </div>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>
          </div>
        </Tab>
        {isValidated && (
          <Tab eventKey={1} title={<TabTitleText>Performance Insights</TabTitleText>}>
            <div style={{ padding: '1rem' }}>
              {/* Hardware Configuration Card - includes filters and benchmarks table */}
              <Card style={{ marginBottom: '1rem' }}>
                <CardHeader>
                  <div>
                    <Title headingLevel="h3" size="md">Hardware configuration</Title>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#6A6E73', fontSize: '0.875rem' }}>
                      Compare the performance metrics of hardware configurations to determine the most suitable option for deployment.
                    </p>
                  </div>
                </CardHeader>
                <CardBody>
                <Toolbar>
                  <ToolbarContent>
                    <ToolbarGroup>
                      {/* Workload Type */}
                      <ToolbarItem>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.125rem' }}>
                          <div ref={workloadMenuRef} style={{ position: 'relative' }}>
                            <MenuToggle
                              onClick={() => setIsWorkloadOpen(!isWorkloadOpen)}
                              isExpanded={isWorkloadOpen}
                              style={{ height: '56px' }}
                            >
                              <span style={{ fontWeight: 500 }}>Workload:</span> {WORKLOAD_OPTIONS.find(o => o.value === workload)?.label || workload}
                          </MenuToggle>
                            {isWorkloadOpen && (
                              <Menu 
                                role="listbox" 
                                onSelect={(_, itemId) => { 
                                if (itemId && typeof itemId === 'string') {
                                  setWorkload(itemId as typeof workload); 
                                }
                                setIsWorkloadOpen(false); 
                              }}
                                selected={workload}
                                style={{ position: 'absolute', top: '100%', left: 0, zIndex: 9999, minWidth: '100%' }}
                              >
                                <MenuContent>
                                  <MenuList>
                                    {filteredWorkloadOptions.map((option) => (
                                      <MenuItem key={option.value} itemId={option.value}>
                                        {option.label}
                                      </MenuItem>
                                    ))}
                                  </MenuList>
                                </MenuContent>
                              </Menu>
                            )}
                          </div>
                          <Popover
                            bodyContent="Sets the input and output token lengths used for generating the benchmark. Different scenarios (e.g. Chatbot) use different token counts, which impacts performance results below."
                          >
                            <Button variant="plain" aria-label="Workload help" style={{ padding: '0.25rem' }}>
                              <OutlinedQuestionCircleIcon />
                            </Button>
                        </Popover>
                          <Divider orientation={{ default: 'vertical' }} style={{ height: '56px', marginLeft: '0.25rem', marginRight: '0' }} />
                        </div>
                      </ToolbarItem>
                      
                      {/* Latency */}
                      <ToolbarItem>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.125rem' }}>
                          <div ref={latencyPanelRef} style={{ position: 'relative' }}>
                            <MenuToggle 
                              onClick={handleOpenLatencyPanel}
                              isExpanded={isLatencyOpen}
                              style={{ height: '56px' }}
                            >
                              <span style={{ fontWeight: 500 }}>Latency:</span> {latencyMetric} | {latencyPercentile} | Under {latencyValue}ms
                                    </MenuToggle>
                            {isLatencyOpen && (
                              <Panel 
                                variant="raised" 
                                style={{ 
                                  position: 'absolute', 
                                  top: '100%', 
                                  left: 0, 
                                  zIndex: 9999,
                                  minWidth: '450px'
                                }}
                              >
                                <PanelMain>
                                  <PanelMainBody>
                                    {/* Row 1: Metric and Percentile dropdowns */}
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                                      <div ref={metricMenuRef} style={{ position: 'relative', flex: 1 }}>
                                        <MenuToggle 
                                          onClick={() => { setIsMetricSelectOpen(!isMetricSelectOpen); setIsPercentileSelectOpen(false); }}
                                          isExpanded={isMetricSelectOpen}
                                          style={{ width: '100%' }}
                                        >
                                          <span style={{ fontWeight: 500 }}>Metric:</span> {pendingLatencyMetric}
                                    </MenuToggle>
                                        {isMetricSelectOpen && (
                                          <Menu 
                                            role="listbox" 
                                            onSelect={(_, itemId) => { setPendingLatencyMetric(itemId as any); setIsMetricSelectOpen(false); }}
                                            selected={pendingLatencyMetric}
                                            style={{ position: 'absolute', top: '100%', left: 0, zIndex: 9999, minWidth: '100%' }}
                                          >
                                            <MenuContent>
                                              <MenuList>
                                                <MenuItem itemId="TTFT">TTFT</MenuItem>
                                                <MenuItem itemId="ITL">ITL</MenuItem>
                                                <MenuItem itemId="E2E">E2E</MenuItem>
                                              </MenuList>
                                            </MenuContent>
                                          </Menu>
                                        )}
                                      </div>
                                      <Popover bodyContent={<div>Choose the specific aspect of speed that matters most for your use case:<br/><br/><strong>TTFT (Time To First Token):</strong> How quickly the model starts responding. Important for perceived responsiveness.<br/><br/><strong>E2E (End-To-End):</strong> The total time to generate the full response. Important for completion tasks.<br/><br/><strong>ITL (Inter-Token Latency):</strong> The time gap between generating each new token. Consistent ITL ensures smooth streaming.<br/><br/><strong>TPS (Tokens Per Second):</strong> The speed of text generation. Higher TPS is better.</div>}>
                                        <Button variant="plain" aria-label="Metric help" style={{ padding: '0.25rem', marginRight: '0.5rem' }}>
                                          <OutlinedQuestionCircleIcon />
                                        </Button>
                                      </Popover>
                                      <div ref={percentileMenuRef} style={{ position: 'relative', flex: 1 }}>
                                        <MenuToggle 
                                          onClick={() => { setIsPercentileSelectOpen(!isPercentileSelectOpen); setIsMetricSelectOpen(false); }}
                                          isExpanded={isPercentileSelectOpen}
                                          style={{ width: '100%' }}
                                        >
                                          <span style={{ fontWeight: 500 }}>Percentile:</span> {pendingLatencyPercentile}
                                        </MenuToggle>
                                        {isPercentileSelectOpen && (
                                          <Menu 
                                            role="listbox" 
                                            onSelect={(_, itemId) => { setPendingLatencyPercentile(itemId as any); setIsPercentileSelectOpen(false); }}
                                            selected={pendingLatencyPercentile}
                                            style={{ position: 'absolute', top: '100%', left: 0, zIndex: 9999, minWidth: '100%' }}
                                          >
                                            <MenuContent>
                                              <MenuList>
                                                <MenuItem itemId="Mean">Mean</MenuItem>
                                                <MenuItem itemId="P90">P90</MenuItem>
                                                <MenuItem itemId="P95">P95</MenuItem>
                                                <MenuItem itemId="P99">P99</MenuItem>
                                              </MenuList>
                                            </MenuContent>
                                          </Menu>
                                        )}
                              </div>
                                      <Popover bodyContent="Defines how consistently the model must perform. For example, P90 means 90% of requests must meet your target, Mean represents the average performance across all requests.">
                                        <Button variant="plain" aria-label="Percentile help" style={{ padding: '0.25rem' }}>
                                          <OutlinedQuestionCircleIcon />
                                        </Button>
                                      </Popover>
                                    </div>
                                    {/* Row 2: Slider with input */}
                                    <div style={{ marginBottom: '1.5rem' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ flex: 1 }}>
                                <Slider
                                            value={pendingLatencyValue}
                                            onChange={(_, value) => setPendingLatencyValue(Math.round(value as number))}
                                  min={20}
                                  max={893}
                                            areCustomStepsContinuous
                                            customSteps={[{ value: 20, label: '20' }, { value: 893, label: '893' }]}
                                />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <TextInput
                                    type="number"
                                            value={pendingLatencyValue.toString()}
                                            onChange={(_, value) => {
                                              const numVal = parseInt(value) || 0;
                                              setPendingLatencyValue(Math.max(20, Math.min(893, numVal)));
                                            }}
                                            style={{ width: '80px' }}
                                          />
                                          <span style={{ padding: '0.5rem', backgroundColor: '#f3f4f6', borderRadius: '4px', fontSize: '0.875rem' }}>ms</span>
                                </div>
                              </div>
                                    </div>
                                    {/* Row 3: Apply and Reset buttons */}
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                      <Button variant="primary" onClick={handleApplyLatency}>
                                  Apply filter
                                </Button>
                                      <Button variant="link" onClick={handleResetLatency}>
                                  Reset
                                </Button>
                              </div>
                                  </PanelMainBody>
                                </PanelMain>
                              </Panel>
                            )}
                            </div>
                          <Popover
                            bodyContent="Filters out configurations that do not meet your specific speed requirements."
                          >
                            <Button variant="plain" aria-label="Latency help" style={{ padding: '0.25rem' }}>
                              <OutlinedQuestionCircleIcon />
                            </Button>
                        </Popover>
                        </div>
                      </ToolbarItem>
                      
                      {/* Max RPS */}
                      <ToolbarItem>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.125rem' }}>
                          <div ref={rpsPanelRef} style={{ position: 'relative' }}>
                            <MenuToggle 
                              onClick={handleOpenRpsPanel}
                              isExpanded={isRpsOpen}
                              style={{ height: '56px' }}
                            >
                              <span style={{ fontWeight: 500 }}>Max RPS:</span> {rpsValue}
                            </MenuToggle>
                            {isRpsOpen && (
                              <Panel 
                                variant="raised" 
                                style={{ 
                                  position: 'absolute', 
                                  top: '100%', 
                                  left: 0, 
                                  zIndex: 9999,
                                  minWidth: '350px'
                                }}
                              >
                                <PanelMain>
                                  <PanelMainBody>
                                    {/* Row 1: Slider with input */}
                                    <div style={{ marginBottom: '1.5rem' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ flex: 1 }}>
                              <Slider
                                            value={pendingRpsValue}
                                            onChange={(_, value) => setPendingRpsValue(Math.round(value as number))}
                                min={1}
                                max={50}
                                            customSteps={[{ value: 1, label: '1' }, { value: 50, label: '50' }]}
                                            areCustomStepsContinuous
                              />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <TextInput
                                  type="number"
                                            value={pendingRpsValue.toString()}
                                            onChange={(_, value) => {
                                              const numVal = parseInt(value) || 1;
                                              setPendingRpsValue(Math.min(50, Math.max(1, numVal)));
                                            }}
                                            style={{ width: '80px' }}
                                />
                              </div>
                                      </div>
                                    </div>
                                    {/* Row 2: Apply and Reset buttons */}
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                      <Button variant="primary" onClick={handleApplyRps}>
                                  Apply filter
                                </Button>
                                      <Button variant="link" onClick={handleResetRps}>
                                  Reset
                                </Button>
                              </div>
                                  </PanelMainBody>
                                </PanelMain>
                              </Panel>
                            )}
                            </div>
                          <Popover
                            bodyContent="Sets your target traffic load (Requests Per Second). This value is used to calculate the optimal deployment size (number of replicas) required to handle this volume."
                          >
                            <Button variant="plain" aria-label="RPS help" style={{ padding: '0.25rem' }}>
                              <OutlinedQuestionCircleIcon />
                            </Button>
                          </Popover>
                          <Divider orientation={{ default: 'vertical' }} style={{ height: '56px', marginLeft: '0.25rem', marginRight: '0' }} />
                        </div>
                      </ToolbarItem>
                      
                      {/* Hardware */}
                      <ToolbarItem>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.125rem' }}>
                          <Dropdown
                            isOpen={isHardwareOpen}
                            onOpenChange={(isOpen) => setIsHardwareOpen(isOpen)}
                            toggle={(toggleRef: React.Ref<HTMLButtonElement>) => (
                              <MenuToggle
                                ref={toggleRef}
                                onClick={() => setIsHardwareOpen(!isHardwareOpen)}
                                isExpanded={isHardwareOpen}
                                style={{ height: '56px' }}
                              >
                                Hardware {hardware.length > 0 && <Badge isRead>{hardware.length}</Badge>}
                          </MenuToggle>
                            )}
                            popperProps={{ position: 'left' }}
                          >
                            <DropdownList>
                              {hardwareOptions.map((hw) => (
                                <DropdownItem 
                                  key={hw}
                                  onClick={() => {
                                    if (hardware.includes(hw)) {
                                      setHardware(hardware.filter(h => h !== hw));
                                    } else {
                                      setHardware([...hardware, hw]);
                                    }
                                  }}
                                >
                                  <Checkbox
                                    id={`hw-details-${hw}`}
                                    label={hw}
                                    isChecked={hardware.includes(hw)}
                                    onChange={() => {}}
                                  />
                                </DropdownItem>
                              ))}
                            </DropdownList>
                          </Dropdown>
                          <Popover
                            bodyContent="Filters by the hardware used to generate the benchmark. This is defined by the GPU type (e.g., A100) and the number of GPUs used for a single replica."
                          >
                            <Button variant="plain" aria-label="Hardware help" style={{ padding: '0.25rem' }}>
                              <OutlinedQuestionCircleIcon />
                            </Button>
                        </Popover>
                        </div>
                      </ToolbarItem>
                      
                      {/* Customize columns - only on details page */}
                      <ToolbarItem>
                        <Button variant="link" onClick={openCustomizeColumnsModal} icon={<ColumnsIcon />}>
                          Customize columns
                        </Button>
                      </ToolbarItem>
                    </ToolbarGroup>
                  </ToolbarContent>
                </Toolbar>

                {/* Filter Chips Bar - Performance filters only */}
                {(workload !== DEFAULT_WORKLOAD || 
                  latencyMetric !== DEFAULT_LATENCY_METRIC || 
                  latencyPercentile !== DEFAULT_LATENCY_PERCENTILE || 
                  latencyValue !== DEFAULT_LATENCY_VALUE || 
                  rpsValue !== DEFAULT_RPS_VALUE || 
                  hardware.length > 0) && (
                  <Toolbar style={{ '--pf-v6-c-toolbar--RowGap': '0' } as React.CSSProperties}>
                    <ToolbarContent>
                      <ToolbarGroup variant="filter-group" style={{ flexWrap: 'wrap', rowGap: '0.5rem' }}>
                        {/* Workload Chip */}
                        {workload !== DEFAULT_WORKLOAD && (
                          <ToolbarItem>
                            <LabelGroup>
                              <Label 
                                onClose={() => setWorkload(DEFAULT_WORKLOAD)}
                                closeBtn={
                                  <button
                                    type="button"
                                    aria-label="Reset workload filter"
                                    onClick={() => setWorkload(DEFAULT_WORKLOAD)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem 0', display: 'inline-flex', alignItems: 'center' }}
                                  >
                                    <FontAwesomeIcon icon={faUndo} style={{ fontSize: '0.625rem' }} />
                                  </button>
                                }
                              >
                                Workload: {WORKLOAD_OPTIONS.find(o => o.value === workload)?.label || workload}
                              </Label>
                            </LabelGroup>
                          </ToolbarItem>
                        )}
                        {/* Latency Chips */}
                        {(latencyMetric !== DEFAULT_LATENCY_METRIC || latencyPercentile !== DEFAULT_LATENCY_PERCENTILE || latencyValue !== DEFAULT_LATENCY_VALUE) && (
                          <ToolbarItem>
                            <div className="pf-v6-c-label-group pf-m-category">
                              <div className="pf-v6-c-label-group__main">
                                <span className="pf-v6-c-label-group__label">Latency</span>
                                <ul className="pf-v6-c-label-group__list" role="list">
                                  <li className="pf-v6-c-label-group__list-item"><Label>Metric: {latencyMetric}</Label></li>
                                  <li className="pf-v6-c-label-group__list-item"><Label>Percentile: {latencyPercentile}</Label></li>
                                  <li className="pf-v6-c-label-group__list-item"><Label>Under {latencyValue}ms</Label></li>
                                </ul>
                        </div>
                              <div className="pf-v6-c-label-group__close" style={{ marginLeft: '0.25rem', paddingLeft: 0, alignSelf: 'center' }}>
                                <button
                                  type="button"
                                  aria-label="Reset latency filters"
                                  onClick={() => {
                                    setLatencyFilters(DEFAULT_LATENCY_METRIC, DEFAULT_LATENCY_PERCENTILE, DEFAULT_LATENCY_VALUE);
                                  }}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem 0', display: 'inline-flex', alignItems: 'center' }}
                                >
                                  <FontAwesomeIcon icon={faUndo} style={{ fontSize: '0.625rem' }} />
                                </button>
                              </div>
                            </div>
                          </ToolbarItem>
                        )}
                        {/* Max RPS Chip */}
                        {rpsValue !== DEFAULT_RPS_VALUE && (
                          <ToolbarItem>
                            <LabelGroup>
                              <Label 
                                onClose={() => setRpsValue(DEFAULT_RPS_VALUE)}
                                closeBtn={
                                  <button
                                    type="button"
                                    aria-label="Reset RPS filter"
                                    onClick={() => setRpsValue(DEFAULT_RPS_VALUE)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem 0', display: 'inline-flex', alignItems: 'center' }}
                                  >
                                    <FontAwesomeIcon icon={faUndo} style={{ fontSize: '0.625rem' }} />
                                  </button>
                                }
                              >
                                Max RPS: {rpsValue}
                              </Label>
                            </LabelGroup>
                          </ToolbarItem>
                        )}
                        {/* Hardware chips */}
                        {hardware.length > 0 && (
                          <ToolbarItem>
                            <LabelGroup categoryName="Hardware" isClosable onClick={() => setHardware([])}>
                              {hardware.map(hw => (
                                <Label key={hw} onClose={() => setHardware(hardware.filter(h => h !== hw))}>{hw}</Label>
                              ))}
                            </LabelGroup>
                          </ToolbarItem>
                        )}
                      </ToolbarGroup>
                    </ToolbarContent>
                    {/* Reset all filters button */}
                    <ToolbarContent style={{ paddingTop: '0.5rem' }}>
                      <ToolbarItem>
                        <Button variant="link" isInline onClick={resetPerformanceFilters}>
                          Reset all filters
                        </Button>
                      </ToolbarItem>
                    </ToolbarContent>
                  </Toolbar>
                )}
                        
              {/* Performance Table */}
              {benchmarks.length > 0 ? (
                    <InnerScrollContainer>
                      <div ref={tableContainerRef} style={{ width: '100%' }}>
                      <Table aria-label="Performance benchmarks table" variant="compact">
                        <Thead>
                          <Tr>
                            <Th 
                              sort={getSortParams(0)}
                              isStickyColumn={hasTableOverflow}
                              hasRightBorder={hasTableOverflow}
                              stickyMinWidth="200px"
                              modifier="nowrap"
                              tooltip={null}
                              info={{ popover: 'The specific hardware configuration used for this benchmark result. This is defined by the GPU type (e.g., A100) and the number of GPUs used for a single replica.' }}
                            >
                              Hardware
                            </Th>
                            {orderedVisibleColumns.map((colId, colIndex) => {
                              const col = getColumnById(colId);
                              if (!col) return null;
                              
                              // Define popovers for specific columns
                              const columnPopovers: Record<string, string> = {
                                'replicas': 'The estimated number of replicas required to meet the Max RPS you set in the filter.',
                                'totalHardware': 'The total number of GPUs across all replicas (hardware count × replicas).',
                                'totalRps': 'The total traffic load (requests per second) available from the recommended number of replicas.',
                                'guidellmVersion': 'The specific version of GuideLLM used to generate the performance results.',
                                'rhaiisVersion': 'The specific version of RHAIIS used to generate the performance results.',
                                'vllmVersion': 'The specific version of vLLM used to generate the performance results.',
                              };
                              
                              const popoverContent = columnPopovers[col.id];
                              
                              return (
                                <Th 
                                  key={colId} 
                                  sort={getSortParams(colIndex + 1)} 
                                  modifier="nowrap"
                                  tooltip={null}
                                  info={popoverContent ? { popover: popoverContent } : undefined}
                                >
                                  {col.label}
                                </Th>
                              );
                            })}
                          </Tr>
                        </Thead>
                        <Tbody>
                          {sortedBenchmarks.map((benchmark, idx) => (
                            <Tr key={`${benchmark.scenarioId}-${benchmark.workload}`}>
                              <Td
                                isStickyColumn={hasTableOverflow}
                                hasRightBorder={hasTableOverflow}
                                stickyMinWidth="200px"
                                modifier="nowrap"
                              >
                                <div style={{ fontWeight: 500 }}>{benchmark.hardware}</div>
                              </Td>
                              {orderedVisibleColumns.map(colId => {
                                const col = getColumnById(colId);
                                if (!col) return null;
                                
                                // Handle latency columns
                                if (col.group === 'latency' && col.latencyMetric && col.latencyPercentile) {
                                  const value = benchmark.latencyData[col.latencyMetric][col.latencyPercentile];
                                  return <Td key={colId}>{value}ms</Td>;
                                }
                                
                                // Handle metadata columns
                                if (col.group === 'metadata') {
                                  const rawValue = benchmark[col.id as keyof BenchmarkData];
                                  // Filter out LatencyData type
                                  if (typeof rawValue === 'object' && rawValue !== null && 'TTFT' in rawValue) {
                                    return null;
                                  }
                                  return <Td key={colId}>{String(rawValue)}</Td>;
                                }
                                
                                // Handle hardware columns (replicas, totalHardware)
                                if (col.group === 'hardware') {
                                  if (col.id === 'replicas') {
                                    return <Td key={colId}>{benchmark.replicas}</Td>;
                                  }
                                  if (col.id === 'totalHardware') {
                                    return <Td key={colId}>{benchmark.hardwareCount * benchmark.replicas}</Td>;
                                  }
                                }
                                
                                // Handle request profile columns
                                if (col.group === 'requestProfile') {
                                  if (col.id === 'targetInputTokens') {
                                    return <Td key={colId}>{benchmark.targetInputTokens}</Td>;
                                  }
                                  if (col.id === 'targetOutputTokens') {
                                    return <Td key={colId}>{benchmark.targetOutputTokens}</Td>;
                                  }
                                }
                                
                                return null;
                              })}
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </div>
                    </InnerScrollContainer>
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#6A6E73' }}>
                  No benchmark data available for the selected filters.
                </div>
              )}
                </CardBody>
              </Card>

              {/* Compression Model Cards */}
              {compressionModels.length > 0 && (
                <Card style={{ marginBottom: '1rem' }}>
                  <CardHeader>
                    <Title headingLevel="h3" size="md">Other compression levels</Title>
                  </CardHeader>
                  <CardBody>
                  <Grid hasGutter>
                    {compressionModels.map(compModel => {
                      const compBenchmarks = generateModelBenchmarks(compModel);
                      const filteredCompBenchmarks = filterBenchmarks(compBenchmarks, {
                        workload,
                        hardware,
                        latencyValue,
                        rpsValue,
                        latencyMetric,
                        latencyPercentile,
                      });
                      const bestBenchmark = filteredCompBenchmarks.length > 0 
                        ? filteredCompBenchmarks[0] 
                        : compBenchmarks[0];
                      
                      return (
                        <GridItem key={compModel.id} span={4}>
                          <Card 
                            style={{ cursor: 'pointer', height: '100%' }}
                            onClick={() => {
                              // Navigate to the other model's performance insights tab
                              const params = new URLSearchParams();
                              searchParams.forEach((value, key) => {
                                params.set(key, value);
                              });
                              params.set('tab', 'performance');
                              navigate(`/ai-assets/models/${compModel.id}?${params.toString()}`);
                            }}
                          >
                            <CardHeader>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div 
                                  style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                  dangerouslySetInnerHTML={{ __html: ValidatedModelIcon }}
                                />
                                <Title headingLevel="h4" size="md" style={{ margin: 0 }}>
                                  {getDisplayName(compModel.name)}
                                </Title>
                              </div>
                            </CardHeader>
                            <CardBody>
                              {bestBenchmark && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                  <div>
                                    <div style={{ fontSize: '0.75rem', color: '#6A6E73', marginBottom: '0.25rem' }}>
                                      {latencyMetric} {latencyPercentile}
                                    </div>
                                    <div style={{ fontSize: '1rem', fontWeight: 500 }}>
                                      {bestBenchmark.latencyData[latencyMetric][latencyPercentile]}ms
                                    </div>
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '0.75rem', color: '#6A6E73', marginBottom: '0.25rem' }}>
                                      Total RPS
                                    </div>
                                    <div style={{ fontSize: '1rem', fontWeight: 500 }}>
                                      {bestBenchmark.totalRps}
                                    </div>
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '0.75rem', color: '#6A6E73', marginBottom: '0.25rem' }}>
                                      Hardware
                                    </div>
                                    <div style={{ fontSize: '0.875rem' }}>
                                      {bestBenchmark.hardware}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </CardBody>
                          </Card>
                        </GridItem>
                      );
                    })}
                  </Grid>
                  </CardBody>
                </Card>
              )}
        </div>
          </Tab>
        )}
      </Tabs>

      {/* Customize Columns Modal */}
      <Modal
        variant={ModalVariant.small}
        title="Customize columns"
        isOpen={isCustomizeColumnsOpen}
        onClose={handleCancelColumns}
      >
        <ModalHeader>
          <Title headingLevel="h2" size="xl">Customize columns</Title>
          <p style={{ color: 'var(--pf-t--global--text--color--subtle)', marginTop: '0.5rem' }}>
            Manage the columns that will appear in the hardware configuration table.
          </p>
        </ModalHeader>
        <ModalBody style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <Button variant="link" isInline onClick={handleRestoreDefaults} style={{ marginBottom: '1rem' }}>
            Restore default columns
          </Button>
          <DataList aria-label="Customize columns" isCompact>
            {([
              { id: 'hardware', label: 'Hardware' },
              { id: 'metadata', label: 'Metadata' },
              { id: 'latency', label: 'Latency' },
              { id: 'requestProfile', label: 'Request profile' }
            ] as const).flatMap((group) => {
              const groupColumns = COLUMN_DEFINITIONS.filter(col => col.group === group.id);
              if (groupColumns.length === 0) return [];
              
              const isExpanded = expandedGroups.includes(group.id);
              
              // Return group header + column items (when expanded)
              return [
                // Group header - expandable (no DataListContent needed since columns are separate items)
                <DataListItem 
                  key={`group-${group.id}`}
                  aria-labelledby={`group-label-${group.id}`} 
                  isExpanded={isExpanded}
                >
                  <DataListItemRow>
                    <DataListToggle
                      onClick={() => toggleGroup(group.id)}
                      isExpanded={isExpanded}
                      id={`toggle-${group.id}`}
                    />
                    <DataListItemCells
                      dataListCells={[
                        <DataListCell key="name">
                          <span id={`group-label-${group.id}`} style={{ fontSize: 'var(--pf-t--global--font--size--body--default)' }}>{group.label}</span>
                        </DataListCell>
                      ]}
                    />
                  </DataListItemRow>
                </DataListItem>,
                // Column checkboxes - non-expandable with hidden toggle for alignment
                ...(isExpanded ? groupColumns.map((col) => (
                  <DataListItem key={col.id} aria-labelledby={`col-label-${col.id}`}>
                    <DataListItemRow>
                      <DataListToggle
                        id={`toggle-col-${col.id}`}
                        buttonProps={{
                          disabled: true,
                          'aria-hidden': 'true',
                          style: { visibility: 'hidden' }
                        }}
                      />
                      <DataListItemCells
                        dataListCells={[
                          <DataListCell key="checkbox">
                      <Checkbox
                              id={`col-${col.id}`}
                              label={<span id={`col-label-${col.id}`}>{col.label}</span>}
                              isChecked={isTempColumnVisible(col.id)}
                              onChange={() => toggleTempColumn(col.id)}
                            />
                          </DataListCell>
                        ]}
                      />
                    </DataListItemRow>
                  </DataListItem>
                )) : [])
              ];
            })}
          </DataList>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={handleUpdateColumns}>
            Update
        </Button>
          <Button variant="link" onClick={handleCancelColumns}>
            Cancel
        </Button>
      </ModalFooter>
    </Modal>
    </PageSection>
);
};

export default ModelDetails;
