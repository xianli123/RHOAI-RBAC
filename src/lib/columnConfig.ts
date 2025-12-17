import type { Column, LatencyMetricType, LatencyPercentileType } from "../types";

export const COLUMN_DEFINITIONS: Column[] = [
  // Hardware group
  {
    id: "replicas",
    label: "Replicas",
    group: "hardware",
    defaultVisible: true,
  },
  {
    id: "totalHardware",
    label: "Total hardware",
    group: "hardware",
    defaultVisible: false,
  },
  // Metadata group
  {
    id: "rpsPerReplica",
    label: "RPS per replica",
    group: "metadata",
    defaultVisible: true,
  },
  {
    id: "totalRps",
    label: "Total RPS",
    group: "metadata",
    defaultVisible: true,
  },
  {
    id: "scenarioId",
    label: "Scenario ID",
    group: "metadata",
    defaultVisible: false,
  },
  {
    id: "configId",
    label: "Config ID",
    group: "metadata",
    defaultVisible: false,
  },
  {
    id: "guidellmVersion",
    label: "GuideLLM version",
    group: "metadata",
    defaultVisible: true,
  },
  {
    id: "rhaiisVersion",
    label: "RHAIS version",
    group: "metadata",
    defaultVisible: true,
  },
  {
    id: "vllmVersion",
    label: "vLLM version",
    group: "metadata",
    defaultVisible: true,
  },
  // Latency group - TTFT
  {
    id: "ttft-mean",
    label: "TTFT latency mean",
    group: "latency",
    defaultVisible: true,
    latencyMetric: "TTFT",
    latencyPercentile: "Mean",
  },
  {
    id: "ttft-p90",
    label: "TTFT latency P90",
    group: "latency",
    defaultVisible: true,
    latencyMetric: "TTFT",
    latencyPercentile: "P90",
  },
  {
    id: "ttft-p95",
    label: "TTFT latency P95",
    group: "latency",
    defaultVisible: false,
    latencyMetric: "TTFT",
    latencyPercentile: "P95",
  },
  {
    id: "ttft-p99",
    label: "TTFT latency P99",
    group: "latency",
    defaultVisible: false,
    latencyMetric: "TTFT",
    latencyPercentile: "P99",
  },
  // Latency group - E2E
  {
    id: "e2e-mean",
    label: "E2E latency mean",
    group: "latency",
    defaultVisible: false,
    latencyMetric: "E2E",
    latencyPercentile: "Mean",
  },
  {
    id: "e2e-p90",
    label: "E2E latency P90",
    group: "latency",
    defaultVisible: false,
    latencyMetric: "E2E",
    latencyPercentile: "P90",
  },
  {
    id: "e2e-p95",
    label: "E2E latency P95",
    group: "latency",
    defaultVisible: false,
    latencyMetric: "E2E",
    latencyPercentile: "P95",
  },
  {
    id: "e2e-p99",
    label: "E2E latency P99",
    group: "latency",
    defaultVisible: false,
    latencyMetric: "E2E",
    latencyPercentile: "P99",
  },
  // Latency group - ITL (TPS)
  {
    id: "itl-mean",
    label: "ITL latency mean",
    group: "latency",
    defaultVisible: false,
    latencyMetric: "ITL",
    latencyPercentile: "Mean",
  },
  {
    id: "itl-p90",
    label: "ITL latency P90",
    group: "latency",
    defaultVisible: false,
    latencyMetric: "ITL",
    latencyPercentile: "P90",
  },
  {
    id: "itl-p95",
    label: "ITL latency P95",
    group: "latency",
    defaultVisible: false,
    latencyMetric: "ITL",
    latencyPercentile: "P95",
  },
  {
    id: "itl-p99",
    label: "ITL latency P99",
    group: "latency",
    defaultVisible: false,
    latencyMetric: "ITL",
    latencyPercentile: "P99",
  },
  // Request profile group
  {
    id: "targetInputTokens",
    label: "Target input tokens",
    group: "requestProfile",
    defaultVisible: false,
  },
  {
    id: "targetOutputTokens",
    label: "Target output tokens",
    group: "requestProfile",
    defaultVisible: false,
  },
];

// Get default visible columns based on current latency filter
export const getDefaultVisibleColumns = (
  latencyMetric: LatencyMetricType,
  latencyPercentile: LatencyPercentileType
): string[] => {
  // Hardware configuration is always visible (not in this list)
  const alwaysVisible = [
    "replicas",
    "rpsPerReplica",
    "totalRps",
    "guidellmVersion",
    "rhaiisVersion",
    "vllmVersion",
  ];

  // Only the latency column matching the current filter is visible by default
  const latencyColumnId = `${latencyMetric.toLowerCase()}-${latencyPercentile.toLowerCase()}`;

  return [...alwaysVisible, latencyColumnId];
};

// Get column by ID
export const getColumnById = (id: string): Column | undefined => {
  return COLUMN_DEFINITIONS.find(col => col.id === id);
};

// Get columns by group
export const getColumnsByGroup = (group: Column["group"]): Column[] => {
  return COLUMN_DEFINITIONS.filter(col => col.group === group);
};


