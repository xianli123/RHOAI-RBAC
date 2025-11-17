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
import { mockTiers, getGroupById, getModelById } from './mockData';
import { Tier } from './types';

const Tiers: React.FunctionComponent = () => {
  const navigate = useNavigate();

  const getGroupsSummary = (tier: Tier): React.ReactNode => {
    if (tier.groups.length === 0) {
      return <span style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>No groups</span>;
    }

    return (
      <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsCenter' }}>
        <FlexItem>
          <Badge id={`tier-groups-${tier.id}`} isRead>
            {tier.groups.length} {tier.groups.length === 1 ? 'Group' : 'Groups'}
          </Badge>
        </FlexItem>
      </Flex>
    );
  };

  const getLimitsSummary = (tier: Tier): React.ReactNode => {
    const limits: string[] = [];
    
    if (tier.limits.tokenLimit) {
      limits.push(`${tier.limits.tokenLimit.amount.toLocaleString()} tokens/${tier.limits.tokenLimit.period}`);
    }
    
    if (tier.limits.rateLimit) {
      limits.push(`${tier.limits.rateLimit.amount.toLocaleString()} reqs/${tier.limits.rateLimit.period}`);
    }

    if (limits.length === 0) {
      return <span style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>No limits</span>;
    }

    return (
      <Flex direction={{ default: 'column' }}>
        {limits.map((limit, index) => (
          <FlexItem key={index}>
            <span style={{ fontSize: '0.875rem' }}>{limit}</span>
          </FlexItem>
        ))}
      </Flex>
    );
  };

  const rowActions = (tier: Tier): IAction[] => {
    return [
      {
        title: 'View details',
        onClick: () => navigate(`/settings/tiers/${tier.id}`),
      },
      {
        title: 'Edit tier',
        onClick: () => navigate(`/settings/tiers/${tier.id}/yaml`),
      },
    ];
  };

  const handleCreateTier = () => {
    navigate('/settings/tiers/create');
  };

  const handleRowClick = (tier: Tier) => {
    navigate(`/settings/tiers/${tier.id}`);
  };

  return (
    <PageSection>
      <Content component={ContentVariants.h1}>Tiers</Content>
      <Content component={ContentVariants.p}>
        Tiers control which AI asset endpoints/models that users can access based on their group membership.
      </Content>
      
      <Toolbar id="tiers-toolbar" style={{ marginTop: '1rem' }}>
        <ToolbarContent>
          <ToolbarItem>
            <Button 
              variant="primary" 
              icon={<PlusIcon />}
              onClick={handleCreateTier}
              id="create-tier-button"
            >
              Create tier
            </Button>
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <Table aria-label="Tiers table" id="tiers-table">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Level</Th>
                <Th>Groups</Th>
                <Th>Models</Th>
                <Th>Limits</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {mockTiers.map((tier) => (
                <Tr 
                  key={tier.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleRowClick(tier)}
                >
                  <Td dataLabel="Name">
                    <div>
                      <Button 
                        variant="link" 
                        isInline
                        id={`tier-name-${tier.id}`}
                        style={{ textDecoration: 'none' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(tier);
                        }}
                      >
                        {tier.name}
                      </Button>
                      {tier.description && (
                        <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)' }}>
                          {tier.description}
                        </div>
                      )}
                    </div>
                  </Td>
                  <Td dataLabel="Level">
                    <Badge id={`tier-level-${tier.id}`} isRead>
                      {tier.level}
                    </Badge>
                  </Td>
                  <Td dataLabel="Groups">
                    {getGroupsSummary(tier)}
                  </Td>
                  <Td dataLabel="Models">
                    <Badge id={`tier-models-${tier.id}`} isRead>
                      {tier.models.length} {tier.models.length === 1 ? 'Model' : 'Models'}
                    </Badge>
                  </Td>
                  <Td dataLabel="Limits">
                    {getLimitsSummary(tier)}
                  </Td>
                  <Td isActionCell>
                    <ActionsColumn 
                      items={rowActions(tier)}
                      onClick={(e) => e.stopPropagation()} // Prevent row click when clicking actions
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
    </PageSection>
  );
};

export { Tiers };

