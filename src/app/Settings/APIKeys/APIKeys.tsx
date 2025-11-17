import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageSection,
  Content,
  ContentVariants,
  Button,
  ToolbarItem,
  Toolbar,
  ToolbarContent,
  Badge,
  Flex,
  FlexItem,
  Label,
  Popover,
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
import { PlusIcon } from '@patternfly/react-icons';
import { mockAPIKeys, getModelById } from './mockData';
import { APIKey, APIKeyStatus } from './types';
import { CreateAPIKeyModal, DeleteAPIKeyModal } from './components';

const APIKeys: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [selectedAPIKey, setSelectedAPIKey] = React.useState<APIKey | null>(null);

  const formatAPIKey = (apiKey: string): string => {
    return apiKey.substring(0, 9) + '...';
  };

  const getAssetsSummary = (apiKey: APIKey): React.ReactNode => {
    const totalAssets = apiKey.assets.modelEndpoints.length;

    if (totalAssets === 0) {
      return <span>No assets</span>;
    }

    return (
      <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsCenter' }}>
        {apiKey.assets.modelEndpoints.length > 0 && (
          <FlexItem>
            <Badge isRead>{apiKey.assets.modelEndpoints.length} Models</Badge>
          </FlexItem>
        )}
      </Flex>
    );
  };

  const getOwnerDisplay = (owner: APIKey['owner']): string => {
    return `${owner.name} (${owner.type})`;
  };

  const getStatusLabel = (status: APIKeyStatus) => {
    const statusMap = {
      Active: { color: 'green' as const, label: 'Active' },
      Expired: { color: 'red' as const, label: 'Expired' },
      Disabled: { color: 'grey' as const, label: 'Disabled' },
      Inactive: { color: 'orange' as const, label: 'Inactive' },
    };
    const { color, label } = statusMap[status];
    
    if (status === 'Inactive') {
      return (
        <Popover
          aria-label="Inactive status information"
          headerContent="Inactive API key"
          bodyContent="This API key is inactive. The tier associated with this key may have been deleted or modified."
        >
          <Label 
            id={`status-${status.toLowerCase()}`} 
            color={color}
            style={{ cursor: 'pointer' }}
          >
            {label}
          </Label>
        </Popover>
      );
    }
    
    return <Label id={`status-${status.toLowerCase()}`} color={color}>{label}</Label>;
  };

  const formatLastUsed = (date?: Date): string => {
    if (!date) return 'Never';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const formatExpirationDate = (date?: Date): string => {
    if (!date) return 'Never';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleViewDetails = (apiKey: APIKey) => {
    navigate(`/gen-ai-studio/api-keys/${apiKey.id}`);
  };

  const handleDeleteAPIKey = (apiKey: APIKey) => {
    setSelectedAPIKey(apiKey);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = (apiKey: APIKey) => {
    console.log('Deleting API key:', apiKey.id);
    // TODO: Implement actual delete functionality
  };

  const handleToggleAPIKeyStatus = (apiKey: APIKey) => {
    console.log('Toggling API key status:', apiKey.id);
    // TODO: Implement actual toggle functionality
  };

  const handleCreateAPIKey = () => {
    setIsCreateModalOpen(true);
  };

  const rowActions = (apiKey: APIKey): IAction[] => {
    return [
      {
        title: 'View details',
        onClick: () => handleViewDetails(apiKey),
      },
      {
        title: apiKey.status === 'Active' ? 'Disable API key' : 'Enable API key',
        onClick: () => handleToggleAPIKeyStatus(apiKey),
      },
      {
        title: 'Delete API key',
        onClick: () => handleDeleteAPIKey(apiKey),
      },
    ];
  };

  return (
    <PageSection>
      <Content component={ContentVariants.h1}>API keys</Content>
      <Content component={ContentVariants.p}>
        Manage API keys that control access to AI asset endpoints.
      </Content>
      
      <Toolbar id="api-keys-toolbar" style={{ marginTop: '1rem' }}>
        <ToolbarContent>
          <ToolbarItem>
            <Button 
              variant="primary" 
              icon={<PlusIcon />}
              onClick={handleCreateAPIKey}
            >
              Create API key
            </Button>
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <Table aria-label="API Keys table">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Status</Th>
                <Th>API Key</Th>
                <Th>Assets</Th>
                <Th>Owner</Th>
                <Th>Last used</Th>
                <Th>Expiration date</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {mockAPIKeys.map((apiKey) => (
                <Tr key={apiKey.id}>
                  <Td dataLabel="Name">
                    <div>
                      <Button
                        variant="link"
                        isInline
                        id={`api-key-name-${apiKey.id}`}
                        onClick={() => handleViewDetails(apiKey)}
                      >
                        {apiKey.name}
                      </Button>
                      {apiKey.description && (
                        <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)' }}>
                          {apiKey.description}
                        </div>
                      )}
                    </div>
                  </Td>
                  <Td dataLabel="Status">
                    {getStatusLabel(apiKey.status)}
                  </Td>
                  <Td dataLabel="API Key">
                    <code>{formatAPIKey(apiKey.apiKey)}</code>
                  </Td>
                  <Td dataLabel="Assets">
                    {getAssetsSummary(apiKey)}
                  </Td>
                  <Td dataLabel="Owner">
                    {getOwnerDisplay(apiKey.owner)}
                  </Td>
                  <Td dataLabel="Last used">
                    {formatLastUsed(apiKey.dateLastUsed)}
                  </Td>
                  <Td dataLabel="Expiration date">
                    {formatExpirationDate(apiKey.limits?.expirationDate)}
                  </Td>
                  <Td isActionCell>
                    <ActionsColumn
                      items={rowActions(apiKey)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

      <CreateAPIKeyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <DeleteAPIKeyModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        apiKey={selectedAPIKey}
        onDelete={handleDeleteConfirm}
      />
    </PageSection>
  );
};

export { APIKeys };