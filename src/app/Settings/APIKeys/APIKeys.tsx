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
  MenuToggle,
  Dropdown,
  DropdownList,
  DropdownItem,
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';
import { PlusIcon } from '@patternfly/react-icons';
import { mockAPIKeys, getModelById } from './mockData';
import { APIKey, APIKeyStatus } from './types';
import { CreateAPIKeyModal, DeleteAPIKeyModal, DeleteAllAPIKeysModal } from './components';

const APIKeys: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = React.useState(false);
  const [isActionsDropdownOpen, setIsActionsDropdownOpen] = React.useState(false);
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
    return owner.name;
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

  const formatCreationDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatExpirationDate = (date?: Date): string => {
    if (!date) return 'Never';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleDeleteAPIKey = (apiKey: APIKey) => {
    setSelectedAPIKey(apiKey);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = (apiKey: APIKey) => {
    console.log('Deleting API key:', apiKey.id);
    // TODO: Implement actual delete functionality
  };

  const handleDeleteAllKeys = () => {
    console.log('Deleting all API keys');
    // TODO: Implement actual delete all functionality
  };

  const handleToggleAPIKeyStatus = (apiKey: APIKey) => {
    console.log('Toggling API key status:', apiKey.id);
    // TODO: Implement actual toggle functionality
  };

  const handleCreateAPIKey = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <PageSection>
      <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
        <FlexItem>
          <Content component={ContentVariants.h1}>API keys</Content>
        </FlexItem>
        <FlexItem>
          <Dropdown
            id="api-keys-actions-dropdown"
            isOpen={isActionsDropdownOpen}
            onOpenChange={(isOpen: boolean) => setIsActionsDropdownOpen(isOpen)}
            popperProps={{ position: 'right' }}
            toggle={(toggleRef) => (
              <MenuToggle
                id="api-keys-actions-toggle"
                ref={toggleRef}
                onClick={() => setIsActionsDropdownOpen(!isActionsDropdownOpen)}
                isExpanded={isActionsDropdownOpen}
                variant="secondary"
                aria-label="Actions"
              >
                Actions
              </MenuToggle>
            )}
          >
            <DropdownList>
              <DropdownItem
                id="revoke-all-keys-action"
                key="revoke-all"
                onClick={() => {
                  setIsActionsDropdownOpen(false);
                  setIsDeleteAllModalOpen(true);
                }}
              >
                Revoke all API keys
              </DropdownItem>
            </DropdownList>
          </Dropdown>
        </FlexItem>
      </Flex>
      <Content component={ContentVariants.p}>
        Manage personal API keys that can be used to access AI asset endpoints.
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
                <Th>Creation date</Th>
                <Th>Expiration date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {mockAPIKeys.map((apiKey) => (
                <Tr key={apiKey.id}>
                  <Td dataLabel="Name">
                    {apiKey.name}
                  </Td>
                  <Td dataLabel="Status">
                    {getStatusLabel(apiKey.status)}
                  </Td>
                  <Td dataLabel="Creation date">
                    {formatCreationDate(apiKey.dateCreated)}
                  </Td>
                  <Td dataLabel="Expiration date">
                    {formatExpirationDate(apiKey.limits?.expirationDate)}
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

      <DeleteAllAPIKeysModal
        isOpen={isDeleteAllModalOpen}
        onClose={() => setIsDeleteAllModalOpen(false)}
        onDelete={handleDeleteAllKeys}
        keyCount={mockAPIKeys.length}
      />
    </PageSection>
  );
};

export { APIKeys };