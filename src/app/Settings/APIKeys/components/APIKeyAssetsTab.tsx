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
  getModelById
} from '../mockData';

interface APIKeyAssetsTabProps {
  apiKey: APIKey;
}

const APIKeyAssetsTab: React.FunctionComponent<APIKeyAssetsTabProps> = ({ apiKey }) => {
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
    models: true,
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
          </Flex>
        </CardBody>
      </Card>
    </PageSection>
  );
};

export { APIKeyAssetsTab };
