import * as React from 'react';
import {
  Flex,
  FlexItem,
  ExpandableSection,
  Badge,
  PageSection,
  Card,
  CardBody,
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  ActionsColumn,
  IAction,
} from '@patternfly/react-table';
import { APIKey } from '../types';
import { 
  getModelById, 
  getMCPServerById 
} from '../mockData';

interface APIKeyAssetsTabProps {
  apiKey: APIKey;
}

const APIKeyAssetsTab: React.FunctionComponent<APIKeyAssetsTabProps> = ({ apiKey }) => {
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
    models: true,
    mcpServers: true,
  });

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  // Action handlers for different asset types
  const handleViewDetails = (assetType: string, assetId: string) => {
    // TODO: Navigate to asset details page
    console.log(`View details for ${assetType}:`, assetId);
  };

  const handleTryInPlayground = (assetType: string, assetId: string) => {
    // TODO: Navigate to playground with asset preloaded
    console.log(`Try in playground for ${assetType}:`, assetId);
  };

  // Action items for models
  const getModelActions = (modelId: string): IAction[] => [
    {
      title: 'View details',
      onClick: () => handleViewDetails('model', modelId),
    },
    {
      title: 'Try in Playground',
      onClick: () => handleTryInPlayground('model', modelId),
    },
  ];

  // Action items for MCP servers
  const getMCPServerActions = (serverId: string): IAction[] => [
    {
      title: 'View details',
      onClick: () => handleViewDetails('mcp-server', serverId),
    },
    {
      title: 'Try in Playground',
      onClick: () => handleTryInPlayground('mcp-server', serverId),
    },
  ];

  return (
    <PageSection>
      <Card>
        <CardBody>
          <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsLg' }}>
            {/* Models Section */}
            <FlexItem>
              <ExpandableSection
                toggleText={`Models (${apiKey.assets.modelEndpoints.length})`}
                isExpanded={expandedSections.models}
                onToggle={() => toggleSection('models')}
              >
                {apiKey.assets.modelEndpoints.length > 0 ? (
                  <Table aria-label="Models table">
                    <Thead>
                      <Tr>
                        <Th>Name</Th>
                        <Th>ID</Th>
                        <Th>Endpoint URL</Th>
                        <Th></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {apiKey.assets.modelEndpoints.map((modelId) => {
                        const model = getModelById(modelId);
                        return model ? (
                          <Tr key={model.id}>
                            <Td dataLabel="Name">
                              {model.name}
                            </Td>
                            <Td dataLabel="ID">
                              <code>{model.id}</code>
                            </Td>
                            <Td dataLabel="Endpoint">
                              <code>{model.endpoint}</code>
                            </Td>
                            <Td isActionCell>
                              <ActionsColumn items={getModelActions(model.id)} />
                            </Td>
                          </Tr>
                        ) : null;
                      })}
                    </Tbody>
                  </Table>
                ) : (
                  <div>No models assigned to this API key</div>
                )}
              </ExpandableSection>
            </FlexItem>

            {/* MCP Servers Section */}
            <FlexItem>
              <ExpandableSection
                toggleText={`MCP Servers & tools (${apiKey.assets.mcpServers.length})`}
                isExpanded={expandedSections.mcpServers}
                onToggle={() => toggleSection('mcpServers')}
              >
                {apiKey.assets.mcpServers.length > 0 ? (
                  <Table aria-label="MCP Servers table">
                    <Thead>
                      <Tr>
                        <Th>Name</Th>
                        <Th>Tools</Th>
                        <Th>Endpoint</Th>
                        <Th></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {apiKey.assets.mcpServers.map((serverId) => {
                        const server = getMCPServerById(serverId);
                        return server ? (
                          <Tr key={server.id}>
                            <Td dataLabel="Name">{server.name}</Td>
                            <Td dataLabel="Tools">
                              <Flex spaceItems={{ default: 'spaceItemsXs' }}>
                                {server.tools.map((tool) => (
                                  <FlexItem key={tool}>
                                    <Badge isRead>{tool}</Badge>
                                  </FlexItem>
                                ))}
                              </Flex>
                            </Td>
                            <Td dataLabel="Endpoint">
                              <code>{server.endpoint}</code>
                            </Td>
                            <Td isActionCell>
                              <ActionsColumn items={getMCPServerActions(server.id)} />
                            </Td>
                          </Tr>
                        ) : null;
                      })}
                    </Tbody>
                  </Table>
                ) : (
                  <div>No MCP servers assigned to this API key</div>
                )}
              </ExpandableSection>
            </FlexItem>
          </Flex>
        </CardBody>
      </Card>
    </PageSection>
  );
};

export { APIKeyAssetsTab };
