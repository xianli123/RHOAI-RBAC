import * as React from 'react';
import ReactECharts from 'echarts-for-react';
import {
  PageSection,
  Content,
  ContentVariants,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Grid,
  GridItem,
  Flex,
  FlexItem,
  Button,
  TextInput,
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  MenuToggleElement,
  Label,
  LabelGroup,
  Badge,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggleAction,
  Icon,
  Popover,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ExpandableSection,
  Divider,
} from '@patternfly/react-core';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import {
  ChartDonut,
  ChartDonutUtilization,
  ChartThemeColor,
} from '@patternfly/react-charts/victory';
import {
  SearchIcon,
  FilterIcon,
  EllipsisVIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  InfoCircleIcon,
  InProgressIcon,
  CheckIcon,
  PendingIcon,
  OutlinedClockIcon,
  OutlinedQuestionCircleIcon,
  FolderIcon,
  ExternalLinkAltIcon,
} from '@patternfly/react-icons';

const WorkloadMetrics: React.FunctionComponent = () => {
  const [isProjectSelectOpen, setIsProjectSelectOpen] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState('All projects');
  const [isAttributeSelectOpen, setIsAttributeSelectOpen] = React.useState(false);
  const [selectedAttribute, setSelectedAttribute] = React.useState<string>('Status');
  const [isFilterSelectOpen, setIsFilterSelectOpen] = React.useState(false);
  const [selectedFilters, setSelectedFilters] = React.useState<string[]>([]);
  const [searchValue, setSearchValue] = React.useState('');
  const [openKebabIndex, setOpenKebabIndex] = React.useState<number | null>(null);
  const [isAdmissionMetricsExpanded, setIsAdmissionMetricsExpanded] = React.useState(true);
  const [isAdmissionFlowExpanded, setIsAdmissionFlowExpanded] = React.useState(true);
  const [isAdmissionFlow2Expanded, setIsAdmissionFlow2Expanded] = React.useState(true);
  const [isResourceAvailabilityExpanded, setIsResourceAvailabilityExpanded] = React.useState(true);
  const [isWorkloadsExpanded, setIsWorkloadsExpanded] = React.useState(true);

  const projectOptions = ['All projects', 'Project-A', 'Project-B', 'Project-C'];
  const attributeOptions = ['Status', 'Priority', 'Hardware profile'];
  
  const filterOptionsByAttribute: { [key: string]: string[] } = {
    'Status': ['Queued', 'Pending', 'Admitted', 'Running', 'Paused', 'Preempted', 'Inadmissible', 'Evicted', 'Complete', 'Failed'],
    'Priority': ['Critical\n2000', 'Reserved\n1000', 'Standard\n500', 'On demand\n100'],
    'Hardware profile': ['High Performance (H100 - 80GB)\nnvidia.com/mig-7g.80gb', 'Standard (H100 MIG - 20GB)\nnvidia.com/mig-1g.20gb'],
  };
  
  const currentFilterOptions = filterOptionsByAttribute[selectedAttribute] || [];

  // Helper function to create ECharts sparkline options
  const getSparklineOptions = (data: Array<{ x: number; y: number }>, color: string) => ({
    grid: {
      left: '0%',
      right: '0%',
      top: 5,
      bottom: 5,
      containLabel: false,
    },
    xAxis: {
      type: 'category',
      show: false,
      data: data.map(d => d.x),
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    series: [
      {
        data: data.map(d => d.y),
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color: color,
          width: 2,
        },
        areaStyle: {
          color: color,
          opacity: 0.5,
        },
      },
    ],
  });

  const onProjectToggle = () => {
    setIsProjectSelectOpen(!isProjectSelectOpen);
  };

  const onProjectSelect = (_event: React.MouseEvent<Element, MouseEvent> | undefined, value: string | number | undefined) => {
    if (value && typeof value === 'string') {
      setSelectedProject(value);
      setIsProjectSelectOpen(false);
    }
  };

  const onAttributeToggle = () => {
    setIsAttributeSelectOpen(!isAttributeSelectOpen);
  };

  const onAttributeSelect = (_event: React.MouseEvent<Element, MouseEvent> | undefined, value: string | number | undefined) => {
    if (value && typeof value === 'string') {
      setSelectedAttribute(value);
      setIsAttributeSelectOpen(false);
      setSelectedFilters([]); // Clear selected filters when changing attribute
    }
  };

  const onFilterToggle = () => {
    setIsFilterSelectOpen(!isFilterSelectOpen);
  };

  const onFilterSelect = (_event: React.MouseEvent<Element, MouseEvent> | undefined, value: string | number | undefined) => {
    if (value && typeof value === 'string') {
      setSelectedFilters((prev) =>
        prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
      );
    }
  };

  const clearFilters = () => {
    setSelectedFilters([]);
  };

  const clearFilter = (filter: string) => {
    setSelectedFilters((prev) => prev.filter((item) => item !== filter));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { color: 'blue' | 'orange' | 'green' | 'grey' | 'red' | 'purple', icon?: React.ReactNode, customColor?: string, whiteText?: boolean } } = {
      'Running': { 
        color: 'blue', 
        icon: (
          <span style={{ 
            display: 'inline-block', 
            animation: 'spin 2s linear infinite',
          }}>
            <InProgressIcon />
          </span>
        ) 
      },
      'Admitted': { color: 'grey', icon: <CheckIcon /> },
      'Pending': { color: 'purple', icon: <PendingIcon /> },
      'Queued': { color: 'grey', icon: <OutlinedClockIcon /> },
      'Preempted': { color: 'orange', icon: <ExclamationTriangleIcon />, customColor: '#FFCC17' },
      'Inadmissible': { color: 'orange', icon: <ExclamationTriangleIcon />, customColor: '#FFCC17' },
      'Evicted': { color: 'orange', icon: <ExclamationTriangleIcon />, customColor: '#FFCC17' },
      'Complete': { color: 'green', icon: <CheckCircleIcon />, customColor: '#3D7317', whiteText: true },
      'Failed': { color: 'red', icon: <ExclamationCircleIcon />, customColor: '#B1380B', whiteText: true },
    };

    const config = statusConfig[status] || { color: 'grey' as const };
    
    const customStyle = config.customColor ? {
      '--pf-v6-c-label--BackgroundColor': config.customColor,
      '--pf-v6-c-label--m-filled--BackgroundColor': config.customColor,
      ...(config.whiteText && {
        '--pf-v6-c-label--Color': '#ffffff',
        '--pf-v6-c-label__icon--Color': '#ffffff',
      }),
    } as React.CSSProperties : undefined;

    return (
      <Label 
        color={config.color} 
        id={`status-badge-${status}`} 
        icon={config.icon} 
        variant="filled"
        style={customStyle}
      >
        {status}
      </Label>
    );
  };

  // Sample data for the table
  // Sample data for the table
  const jobData = [
    {
      id: 'gpt-finetune-run',
      name: 'gpt-finetune-run',
      project: 'Project-A',
      type: 'Train job',
      status: 'Running',
      queuePosition: '--',
      priority: 'Reserved (1000)',
      waitTime: '--',
      hardwareProfile: 'High Performance\nnvidia.com/mig-7g.80gb',
    },
    {
      id: 'inference-prod-v1',
      name: 'inference-prod-v1',
      project: 'Project-B',
      type: 'Inference',
      status: 'Admitted',
      queuePosition: '--',
      priority: 'Critical (2000)',
      waitTime: '12s',
      hardwareProfile: 'Standard\nnvidia.com/mig-3g.20gb',
    },
    {
      id: 'ray-tune-experiment',
      name: 'ray-tune-experiment',
      project: 'Project-C',
      type: 'Ray job',
      status: 'Pending',
      queuePosition: 'Position #1\n(~ 5 min)',
      priority: 'On Demand (100)',
      waitTime: '45s',
      hardwareProfile: 'High Performance\nnvidia.com/mig-7g.80gb',
    },
    {
      id: 'notebook-interactive',
      name: 'notebook-interactive',
      project: 'Project-A',
      type: 'Notebook',
      status: 'Queued',
      queuePosition: 'Position #5\n(~ 20 min)',
      priority: 'On Demand (100)',
      waitTime: '5m',
      hardwareProfile: 'Standard\nnvidia.com/mig-3g.20gb',
    },
    {
      id: 'batch-process-nightly',
      name: 'batch-process-nightly',
      project: 'Project-B',
      type: 'Train job',
      status: 'Preempted',
      queuePosition: 'Position #1\n(Paused)',
      priority: 'On Demand (100)',
      waitTime: '2h 10m',
      hardwareProfile: 'High Performance\nnvidia.com/mig-7g.80gb',
    },
    {
      id: 'massive-model-test',
      name: 'massive-model-test',
      project: 'Project-C',
      type: 'Train job',
      status: 'Inadmissible',
      queuePosition: '--',
      priority: 'On Demand (100)',
      waitTime: '10m',
      hardwareProfile: 'High Performance\nnvidia.com/mig-7g.80gb',
    },
    {
      id: 'long-run-analysis',
      name: 'long-run-analysis',
      project: 'Project-A',
      type: 'Ray job',
      status: 'Evicted',
      queuePosition: '--',
      priority: 'On Demand (100)',
      waitTime: '--',
      hardwareProfile: 'Standard\nnvidia.com/mig-3g.20gb',
    },
    {
      id: 'data-prep-daily',
      name: 'data-prep-daily',
      project: 'Project-B',
      type: 'Notebook',
      status: 'Complete',
      queuePosition: '--',
      priority: 'Standard (500)',
      waitTime: '--',
      hardwareProfile: 'High Performance\nnvidia.com/mig-7g.80gb',
    },
    {
      id: 'broken-code-v4',
      name: 'broken-code-v4',
      project: 'Project-C',
      type: 'Train job',
      status: 'Failed',
      queuePosition: '--',
      priority: 'Reserved (1000)',
      waitTime: '--',
      hardwareProfile: 'High Performance\nnvidia.com/mig-7g.80gb',
    },
  ];

  // Filter jobs based on search value
  const filteredJobs = jobData.filter(job => 
    job.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Mock chart data for metric cards
  const admissionsRateData = [
    { x: 1, y: 0.19 },
    { x: 2, y: 0.20 },
    { x: 3, y: 0.21 },
    { x: 4, y: 0.19 },
    { x: 5, y: 0.18 },
    { x: 6, y: 0.17 },
    { x: 7, y: 0.16 },
  ];

  const admissionsLatencyData = [
    { x: 1, y: 48 },
    { x: 2, y: 50 },
    { x: 3, y: 52 },
    { x: 4, y: 49 },
    { x: 5, y: 48 },
    { x: 6, y: 47 },
    { x: 7, y: 49 },
  ];

  const pendingWorkloadsData = [
    { x: 1, y: 140 },
    { x: 2, y: 142 },
    { x: 3, y: 148 },
    { x: 4, y: 145 },
    { x: 5, y: 143 },
    { x: 6, y: 141 },
    { x: 7, y: 145 },
  ];

  const activeWorkloadsData = [
    { x: 1, y: 85 },
    { x: 2, y: 83 },
    { x: 3, y: 82 },
    { x: 4, y: 81 },
    { x: 5, y: 79 },
    { x: 6, y: 78 },
    { x: 7, y: 80 },
  ];

  return (
    <>
      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
  <PageSection>
        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
          <FlexItem>
            <Content component={ContentVariants.h1} id="workload-metrics-title">Workload metrics</Content>
          </FlexItem>
          <FlexItem>
            <Badge 
              id="workload-metrics-status-badge"
              style={{
                '--pf-v6-c-badge--BackgroundColor': '#F32BC4',
                '--pf-v6-c-badge--Color': '#ffffff',
              } as React.CSSProperties}
            >
              WIP
            </Badge>
          </FlexItem>
        </Flex>
        <Content component={ContentVariants.p} id="workload-metrics-subtitle">
          Monitor the metrics of your active resources.
    </Content>
        
        {/* Project selector */}
        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsMd' }} style={{ marginTop: '24px' }}>
          <FlexItem>
            <Icon>
              <FolderIcon />
            </Icon>
          </FlexItem>
          <FlexItem>
            <span style={{ fontWeight: 600 }}>Project</span>
          </FlexItem>
          <FlexItem>
            <Select
              id="project-filter-select"
              isOpen={isProjectSelectOpen}
              selected={selectedProject}
              onSelect={onProjectSelect}
              onOpenChange={setIsProjectSelectOpen}
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={onProjectToggle}
                  isExpanded={isProjectSelectOpen}
                  id="project-filter-toggle"
                  style={{ minWidth: '200px' }}
                >
                  {selectedProject}
                </MenuToggle>
              )}
            >
              <SelectList id="project-select-list">
                {projectOptions.map((option, index) => (
                  <SelectOption
                    key={option}
                    value={option}
                    id={`project-option-${index}`}
                  >
                    {option}
                  </SelectOption>
                ))}
              </SelectList>
            </Select>
          </FlexItem>
          <FlexItem>
            <Button 
              variant="link" 
              icon={<ExternalLinkAltIcon />} 
              iconPosition="end"
              id="go-to-projects-button"
            >
              Go to Projects
            </Button>
          </FlexItem>
        </Flex>

        {/* Attribute and Filter selector */}
        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsMd' }} style={{ marginTop: '16px' }}>
          <FlexItem>
            <Select
              id="attribute-filter-select"
              isOpen={isAttributeSelectOpen}
              selected={selectedAttribute}
              onSelect={onAttributeSelect}
              onOpenChange={setIsAttributeSelectOpen}
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={onAttributeToggle}
                  isExpanded={isAttributeSelectOpen}
                  icon={<FilterIcon />}
                  id="attribute-filter-toggle"
                  style={{ minWidth: '200px' }}
                >
                  {selectedAttribute}
                </MenuToggle>
              )}
            >
              <SelectList id="attribute-select-list">
                {attributeOptions.map((option, index) => (
                  <SelectOption
                    key={option}
                    value={option}
                    id={`attribute-option-${index}`}
                  >
                    {option}
                  </SelectOption>
                ))}
              </SelectList>
            </Select>
          </FlexItem>
          <FlexItem>
            <Select
              id="filter-options-select"
              isOpen={isFilterSelectOpen}
              selected={selectedFilters}
              onSelect={onFilterSelect}
              onOpenChange={setIsFilterSelectOpen}
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={onFilterToggle}
                  isExpanded={isFilterSelectOpen}
                  id="filter-options-toggle"
                  style={{ minWidth: '300px' }}
                >
                  Filter by {selectedAttribute.toLowerCase()}
                </MenuToggle>
              )}
            >
              <SelectList id="filter-options-list">
                {currentFilterOptions.map((option, index) => {
                  const lines = option.split('\n');
                  return (
                    <SelectOption
                      key={option}
                      value={option}
                      isSelected={selectedFilters.includes(option)}
                      id={`filter-option-${index}`}
                    >
                      {lines.length > 1 ? (
                        <div>
                          <div>{lines[0]}</div>
                          <div style={{ fontSize: '12px', color: '#6A6E73' }}>{lines[1]}</div>
                        </div>
                      ) : (
                        option
                      )}
                    </SelectOption>
                  );
                })}
              </SelectList>
            </Select>
          </FlexItem>
        </Flex>

        {/* Active filters */}
        {selectedFilters.length > 0 && (
          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }} style={{ marginTop: '16px' }}>
            <FlexItem>
              <LabelGroup categoryName={selectedAttribute} id="filter-label-group">
                {selectedFilters.map((filter) => {
                  const displayText = filter.split('\n')[0]; // Show only first line in label
                  return (
                    <Label key={filter} onClose={() => clearFilter(filter)} id={`filter-label-${filter}`} color="grey">
                      {displayText}
                    </Label>
                  );
                })}
              </LabelGroup>
            </FlexItem>
            <FlexItem>
              <Button variant="link" onClick={clearFilters} id="clear-filters-button">
                Clear all filters
              </Button>
            </FlexItem>
          </Flex>
        )}
      </PageSection>

      <PageSection>
        {/* Admission Metrics */}
        <ExpandableSection
          toggleText="Admission Metrics"
          isExpanded={isAdmissionMetricsExpanded}
          onToggle={(_event, isExpanded) => setIsAdmissionMetricsExpanded(isExpanded)}
          displaySize="lg"
          id="admission-metrics-expandable"
          style={{ backgroundColor: 'transparent' }}
        >
          <div style={{ padding: '24px', backgroundColor: '#ffffff' }}>
            <Flex>
            <FlexItem flex={{ default: 'flex_1' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }} id="admissions-rate-title">Admissions rate</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>0.195/s</div>
                <div style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                  Target: 0.200/s
                </div>
                <div style={{ height: '60px', marginTop: '8px', width: '100%' }}>
                  <ReactECharts
                    option={getSparklineOptions(admissionsRateData, '#73BCF7')}
                    style={{ height: '60px', width: '100%' }}
                    opts={{ renderer: 'svg' }}
                  />
                </div>
              </div>
            </FlexItem>
            <Divider orientation={{ default: 'vertical' }} />
            <FlexItem flex={{ default: 'flex_1' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }} id="admissions-latency-title">Admissions latency</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>49.3 ms</div>
                <div style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                  Target: {'<'}50ms
                </div>
                <div style={{ height: '60px', marginTop: '8px', width: '100%' }}>
                  <ReactECharts
                    option={getSparklineOptions(admissionsLatencyData, '#73BCF7')}
                    style={{ height: '60px', width: '100%' }}
                    opts={{ renderer: 'svg' }}
                  />
                </div>
              </div>
            </FlexItem>
            <Divider orientation={{ default: 'vertical' }} />
            <FlexItem flex={{ default: 'flex_1' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }} id="pending-workloads-title">Pending workloads</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>145 pending</div>
                <div style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                  Waiting of resources
                </div>
                <div style={{ height: '60px', marginTop: '8px', width: '100%' }}>
                  <ReactECharts
                    option={getSparklineOptions(pendingWorkloadsData, '#F4C145')}
                    style={{ height: '60px', width: '100%' }}
                    opts={{ renderer: 'svg' }}
                  />
                </div>
              </div>
            </FlexItem>
            <Divider orientation={{ default: 'vertical' }} />
            <FlexItem flex={{ default: 'flex_1' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }} id="active-workloads-title">Active workloads</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>80 active</div>
                <div style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                  Admitted & Executing
                </div>
                <div style={{ height: '60px', marginTop: '8px', width: '100%' }}>
                  <ReactECharts
                    option={getSparklineOptions(activeWorkloadsData, '#73BCF7')}
                    style={{ height: '60px', width: '100%' }}
                    opts={{ renderer: 'svg' }}
                  />
                </div>
              </div>
            </FlexItem>
          </Flex>
          </div>
        </ExpandableSection>

        {/* Admission flow */}
        <ExpandableSection
          toggleText="Admission flow (Option 1)"
          isExpanded={isAdmissionFlowExpanded}
          onToggle={(_event, isExpanded) => setIsAdmissionFlowExpanded(isExpanded)}
          displaySize="lg"
          id="admission-flow-expandable"
          style={{ marginTop: '24px', backgroundColor: 'transparent' }}
        >
          <div style={{ padding: '24px', backgroundColor: '#ffffff' }}>
            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsLg' }}>
              <FlexItem>
                <Card isCompact id="job-created-card" style={{ height: '100px' }}>
                  <CardTitle id="job-created-title">Job created</CardTitle>
                  <CardBody>
                    <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                      If submitted
                    </div>
                  </CardBody>
                </Card>
              </FlexItem>
              <FlexItem>
                <Icon size="lg">
                  <ArrowRightIcon />
                </Icon>
              </FlexItem>
              <FlexItem>
                <Card isCompact id="local-queue-card" style={{ height: '100px' }}>
                  <CardTitle id="local-queue-title">Local Queue</CardTitle>
                  <CardBody>
                    <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                      Namespace
                    </div>
                  </CardBody>
                </Card>
              </FlexItem>
              <FlexItem>
                <Icon size="lg">
                  <ArrowRightIcon />
                </Icon>
              </FlexItem>
              <FlexItem>
                <Card isCompact id="cluster-queue-card" style={{ height: '100px' }}>
                  <CardTitle id="cluster-queue-title">Cluster Queue</CardTitle>
                  <CardBody>
                    <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                      Quota check<br />5 blocked (quota)
                    </div>
                  </CardBody>
                </Card>
              </FlexItem>
              <FlexItem>
                <Icon size="lg">
                  <ArrowRightIcon />
                </Icon>
              </FlexItem>
              <FlexItem>
                <Card isCompact id="resource-flavor-card" style={{ height: '100px' }}>
                  <CardTitle id="resource-flavor-title">Resource flavor</CardTitle>
                  <CardBody>
                    <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                      Quota hardware match<br />5 stuck (no hardware)
                    </div>
                  </CardBody>
                </Card>
              </FlexItem>
              <FlexItem>
                <Icon size="lg">
                  <ArrowRightIcon />
                </Icon>
              </FlexItem>
              <FlexItem>
                <Card isCompact id="admitted-card" style={{ height: '100px' }}>
                  <CardTitle id="admitted-title">Admitted</CardTitle>
                  <CardBody>
                    <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                      Running
                    </div>
                  </CardBody>
                </Card>
              </FlexItem>
            </Flex>
          </div>
        </ExpandableSection>

        {/* Admission flow 2 */}
        <ExpandableSection
          toggleText="Admission flow (Option 2)"
          isExpanded={isAdmissionFlow2Expanded}
          onToggle={(_event, isExpanded) => setIsAdmissionFlow2Expanded(isExpanded)}
          displaySize="lg"
          id="admission-flow-2-expandable"
          style={{ marginTop: '24px', backgroundColor: 'transparent' }}
        >
          <div style={{ padding: '24px', backgroundColor: '#ffffff' }}>
            <Flex>
              <FlexItem flex={{ default: 'flex_1' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Job created <Badge isRead id="job-created-badge-2">2</Badge>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                    If submitted
                  </div>
                </div>
              </FlexItem>
              <Divider orientation={{ default: 'vertical' }} />
              <FlexItem flex={{ default: 'flex_1' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Local Queue <Badge isRead id="local-queue-badge-2">3</Badge>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                    Namespace
                  </div>
                </div>
              </FlexItem>
              <Divider orientation={{ default: 'vertical' }} />
              <FlexItem flex={{ default: 'flex_1' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Cluster Queue <Badge isRead id="cluster-queue-badge-2">5</Badge>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                    Quota check<br />5 blocked (quota)
                  </div>
                </div>
              </FlexItem>
              <Divider orientation={{ default: 'vertical' }} />
              <FlexItem flex={{ default: 'flex_1' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Resource flavor <Badge isRead id="resource-flavor-badge-2">5</Badge>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                    Quota hardware match<br />5 stuck (no hardware)
                  </div>
                </div>
              </FlexItem>
              <Divider orientation={{ default: 'vertical' }} />
              <FlexItem flex={{ default: 'flex_1' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Admitted <Badge isRead id="admitted-badge-2">8</Badge>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                    Running
                  </div>
                </div>
              </FlexItem>
            </Flex>
          </div>
        </ExpandableSection>

        {/* Resource availability */}
        <ExpandableSection
          toggleText="Resource availability"
          isExpanded={isResourceAvailabilityExpanded}
          onToggle={(_event, isExpanded) => setIsResourceAvailabilityExpanded(isExpanded)}
          displaySize="lg"
          id="resource-availability-expandable"
          style={{ marginTop: '24px', backgroundColor: 'transparent' }}
        >
          <div style={{ padding: '24px', backgroundColor: '#ffffff' }}>
            <Grid hasGutter>
              <GridItem span={4}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>GPU</div>
                  <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChartDonutUtilization
                      ariaTitle="GPU utilization"
                      ariaDesc="75% of GPU slices are currently used"
                      constrainToVisibleArea
                      data={{ x: 'GPU slices used', y: 75 }}
                      labels={({ datum }) => `${datum.x}: ${datum.y}%`}
                      subTitle="slices used"
                      title="75%"
                      height={200}
                      width={200}
                    />
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--subtle)', marginTop: '8px' }}>
                    6/8 slices used
                  </div>
                </div>
              </GridItem>
              <GridItem span={4}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>CPU</div>
                  <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChartDonutUtilization
                      ariaTitle="CPU utilization"
                      ariaDesc="70% of CPU cores are currently used"
                      constrainToVisibleArea
                      data={{ x: 'CPU cores used', y: 70 }}
                      labels={({ datum }) => `${datum.x}: ${datum.y}%`}
                      subTitle="cores used"
                      title="70%"
                      height={200}
                      width={200}
                    />
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--subtle)', marginTop: '8px' }}>
                    10/14 cores used
                  </div>
                </div>
              </GridItem>
              <GridItem span={4}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>Memory</div>
                  <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChartDonutUtilization
                      ariaTitle="Memory utilization"
                      ariaDesc="65% of memory is currently used"
                      constrainToVisibleArea
                      data={{ x: 'Memory used', y: 65 }}
                      labels={({ datum }) => `${datum.x}: ${datum.y}%`}
                      subTitle="GB used"
                      title="65%"
                      height={200}
                      width={200}
                    />
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--subtle)', marginTop: '8px' }}>
                    64/96 GB used
                  </div>
                </div>
              </GridItem>
            </Grid>
          </div>
        </ExpandableSection>
  </PageSection>

      {/* Jobs table */}
      <PageSection style={{ paddingTop: '24px', backgroundColor: 'var(--pf-t--global--background--color--primary)' }}>
        <ExpandableSection
          toggleText={
            <>
              Workloads <Badge isRead id="workloads-count-badge">{filteredJobs.length}</Badge>
            </> as any
          }
          isExpanded={isWorkloadsExpanded}
          onToggle={(_event, isExpanded) => setIsWorkloadsExpanded(isExpanded)}
          displaySize="lg"
          id="workloads-expandable"
          style={{ backgroundColor: 'transparent' }}
        >
          <div style={{ padding: '24px', backgroundColor: '#ffffff' }}>
              {/* Toolbar with search and pagination */}
            <Toolbar id="workloads-toolbar">
              <ToolbarContent style={{ alignItems: 'baseline' }}>
                <ToolbarItem>
                  <TextInput
                    id="job-search-input"
                    type="search"
                    placeholder="Find by job name"
                    aria-label="Search jobs"
                    value={searchValue}
                    onChange={(_event, value) => setSearchValue(value)}
                    customIcon={<SearchIcon />}
                  />
                </ToolbarItem>
                <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }} style={{ alignSelf: 'center' }}>
                  <span style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                    {filteredJobs.length > 0 ? `1 - ${filteredJobs.length} of ${filteredJobs.length}` : '0 of 0'}
                  </span>
                </ToolbarItem>
              </ToolbarContent>
            </Toolbar>
            <Table aria-label="Workload jobs table" variant="compact" id="jobs-table">
                <Thead>
                  <Tr>
                    <Th id="job-name-header">Job name</Th>
                    <Th id="project-header">Project</Th>
                    <Th id="type-header">Type</Th>
                    <Th id="status-header">Status</Th>
                    <Th id="queue-position-header">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        Queue position (est. start)
                        <Popover
                          aria-label="Queue position information"
                          headerContent="Queue position"
                          bodyContent="The position of the job in the queue and estimated start time"
                        >
                          <Button variant="plain" aria-label="More info for queue position" id="queue-position-info-button" style={{ padding: 0, minHeight: 'auto' }}>
                            <OutlinedQuestionCircleIcon />
                          </Button>
                        </Popover>
                      </span>
                    </Th>
                    <Th id="priority-header">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        Priority
                        <Popover
                          aria-label="Priority information"
                          headerContent="Priority"
                          bodyContent="The priority level determines the order in which jobs are scheduled"
                        >
                          <Button variant="plain" aria-label="More info for priority" id="priority-info-button" style={{ padding: 0, minHeight: 'auto' }}>
                            <OutlinedQuestionCircleIcon />
                          </Button>
                        </Popover>
                      </span>
                    </Th>
                    <Th id="wait-time-header">Wait time</Th>
                    <Th id="hardware-profile-header">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        Hardware profile
                        <Popover
                          aria-label="Hardware profile information"
                          headerContent="Hardware profile"
                          bodyContent="The hardware configuration and GPU specifications for the job"
                        >
                          <Button variant="plain" aria-label="More info for hardware profile" id="hardware-profile-info-button" style={{ padding: 0, minHeight: 'auto' }}>
                            <OutlinedQuestionCircleIcon />
                          </Button>
                        </Popover>
                      </span>
                    </Th>
                    <Th id="actions-header"></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredJobs.map((job, index) => {
                    const queuePositionLines = job.queuePosition.split('\n');
                    const priorityMatch = job.priority.match(/^(.*?)(\(.*\))$/);
                    const hardwareProfileLines = job.hardwareProfile.split('\n');
                    
                    return (
                      <Tr key={job.id}>
                        <Td dataLabel="Job name">
                          <Button variant="link" isInline id={`job-link-${index}`}>{job.name}</Button>
                        </Td>
                        <Td dataLabel="Project">{job.project}</Td>
                        <Td dataLabel="Type">{job.type}</Td>
                        <Td dataLabel="Status">{getStatusBadge(job.status)}</Td>
                        <Td dataLabel="Queue position">
                          {queuePositionLines[0]}
                          {queuePositionLines[1] && (
                            <>
                              <br />
                              <span style={{ color: '#4D4D4D' }}>{queuePositionLines[1]}</span>
                            </>
                          )}
                        </Td>
                        <Td dataLabel="Priority">
                          {priorityMatch ? (
                            <>
                              {priorityMatch[1]}
                              <span style={{ color: '#4D4D4D' }}>{priorityMatch[2]}</span>
                            </>
                          ) : (
                            job.priority
                          )}
                        </Td>
                        <Td dataLabel="Wait time">{job.waitTime}</Td>
                        <Td dataLabel="Hardware profile">
                          {hardwareProfileLines[0]}
                          {hardwareProfileLines[1] && (
                            <>
                              <br />
                              <span style={{ color: '#4D4D4D' }}>{hardwareProfileLines[1]}</span>
                            </>
                          )}
                        </Td>
                        <Td isActionCell>
                          <Dropdown
                            isOpen={openKebabIndex === index}
                            onOpenChange={(isOpen: boolean) => setOpenKebabIndex(isOpen ? index : null)}
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                              <MenuToggle
                                ref={toggleRef}
                                aria-label={`Actions for ${job.name}`}
                                variant="plain"
                                onClick={() => setOpenKebabIndex(openKebabIndex === index ? null : index)}
                                isExpanded={openKebabIndex === index}
                                id={`job-actions-${index}`}
                              >
                                <EllipsisVIcon />
                              </MenuToggle>
                            )}
                            popperProps={{ appendTo: () => document.body }}
                          >
                            <DropdownList id={`job-actions-list-${index}`}>
                              <DropdownItem key="view" id={`job-action-view-${index}`}>View details</DropdownItem>
                              <DropdownItem key="pause" id={`job-action-pause-${index}`}>Pause job</DropdownItem>
                              <DropdownItem key="cancel" id={`job-action-cancel-${index}`}>Cancel job</DropdownItem>
                              <DropdownItem key="logs" id={`job-action-logs-${index}`}>View logs</DropdownItem>
                            </DropdownList>
                          </Dropdown>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
              
              {/* Bottom pagination */}
              <Toolbar id="workloads-bottom-toolbar">
                <ToolbarContent style={{ alignItems: 'baseline' }}>
                  <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }} style={{ alignSelf: 'center' }}>
                    <span style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                      {filteredJobs.length > 0 ? `1 - ${filteredJobs.length} of ${filteredJobs.length}` : '0 of 0'}
                    </span>
                  </ToolbarItem>
                </ToolbarContent>
              </Toolbar>
          </div>
        </ExpandableSection>
      </PageSection>
    </>
  );
};

export { WorkloadMetrics };
