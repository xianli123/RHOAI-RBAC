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
  ToolbarGroup,
  Badge,
  Flex,
  FlexItem,
  InputGroup,
  InputGroupItem,
  SearchInput,
  Dropdown,
  MenuToggle,
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
  ActionsColumn,
  IAction,
  ThProps,
} from '@patternfly/react-table';
import { PlusIcon, FilterIcon } from '@patternfly/react-icons';
import { mockTiers, getGroupById, getModelById } from './mockData';
import { Tier } from './types';
import { DeleteTierModal } from './components/DeleteTierModal';

const Tiers: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [filterDropdownOpen, setFilterDropdownOpen] = React.useState(false);
  const [filterAttribute, setFilterAttribute] = React.useState<'keyword'>('keyword');
  const [filterInput, setFilterInput] = React.useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [tierToDelete, setTierToDelete] = React.useState<Tier | null>(null);
  const [activeSortIndex, setActiveSortIndex] = React.useState<number | null>(null);
  const [activeSortDirection, setActiveSortDirection] = React.useState<'asc' | 'desc' | null>(null);

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
    
    const formatUnit = (quantity: number, unit: string): string => {
      const unitAbbrev = unit === 'minute' ? 'min' : unit === 'hour' ? 'hr' : 'day';
      return quantity === 1 ? unitAbbrev : `${quantity}${unitAbbrev}`;
    };
    
    if (tier.limits.tokenLimits) {
      tier.limits.tokenLimits.forEach(limit => {
        limits.push(`${limit.amount.toLocaleString()} tokens/${formatUnit(limit.quantity, limit.unit)}`);
      });
    }
    
    if (tier.limits.rateLimits) {
      tier.limits.rateLimits.forEach(limit => {
        limits.push(`${limit.amount.toLocaleString()} requests/${formatUnit(limit.quantity, limit.unit)}`);
      });
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
        onClick: () => navigate(`/settings/tiers/${tier.id}/edit`),
      },
      {
        title: 'Delete tier',
        onClick: () => {
          setTierToDelete(tier);
          setIsDeleteModalOpen(true);
        },
      },
    ];
  };

  const handleConfirmDelete = () => {
    // Delete the tier
    console.log('Tier deleted:', tierToDelete?.id);
    setIsDeleteModalOpen(false);
    setTierToDelete(null);
  };

  const handleCreateTier = () => {
    navigate('/settings/tiers/create');
  };

  const handleRowClick = (tier: Tier) => {
    navigate(`/settings/tiers/${tier.id}`);
  };

  const getSortableRowValues = (tier: Tier): (string | number)[] => {
    return [
      tier.name.toLowerCase(), // Column 0: Name
      tier.level, // Column 1: Level
      tier.groups.length, // Column 2: Groups
      tier.models.length, // Column 3: Models
      // Column 4: Limits - we'll sort by total token limits
      (tier.limits.tokenLimits?.[0]?.amount || 0) + (tier.limits.rateLimits?.[0]?.amount || 0),
    ];
  };

  const getSortedTiers = (tiersToSort: Tier[]) => {
    if (activeSortIndex === null || activeSortDirection === null) {
      return tiersToSort;
    }

    return [...tiersToSort].sort((a, b) => {
      const aValue = getSortableRowValues(a)[activeSortIndex];
      const bValue = getSortableRowValues(b)[activeSortIndex];

      if (aValue < bValue) {
        return activeSortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return activeSortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const getFilteredTiers = () => {
    if (!filterInput.trim()) {
      return mockTiers;
    }

    const searchTerm = filterInput.toLowerCase();
    return mockTiers.filter(tier => {
      return tier.name.toLowerCase().includes(searchTerm) ||
             (tier.description && tier.description.toLowerCase().includes(searchTerm));
    });
  };

  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: {
      index: activeSortIndex || 0,
      direction: activeSortDirection || 'asc',
      defaultDirection: 'asc',
    },
    onSort: (_event, index, direction) => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
    },
    columnIndex,
  });

  const filteredTiers = getSortedTiers(getFilteredTiers());

  return (
    <PageSection>
      <Content component={ContentVariants.h1}>Tiers</Content>
      <Content component={ContentVariants.p}>
        Tiers control which AI asset model endpoints users can access based on their group membership.
      </Content>
      
      <Toolbar id="tiers-toolbar" style={{ marginTop: '1rem' }}>
        <ToolbarContent>
          <ToolbarGroup>
            <ToolbarItem>
              <InputGroup>
                <InputGroupItem>
                  <Dropdown
                    isOpen={filterDropdownOpen}
                    onSelect={() => setFilterDropdownOpen(false)}
                    onOpenChange={(isOpen: boolean) => setFilterDropdownOpen(isOpen)}
                    toggle={(toggleRef: React.Ref<HTMLButtonElement>) => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                        isExpanded={filterDropdownOpen}
                        id="tier-filter-toggle"
                        style={{
                          minWidth: '120px',
                          backgroundColor: '#f0f0f0',
                          borderRight: 'none',
                          borderTopRightRadius: 0,
                          borderBottomRightRadius: 0
                        }}
                      >
                        <FilterIcon style={{ marginRight: '0.5rem' }} />
                        Keyword
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem 
                        key="keyword"
                        onClick={() => {
                          setFilterAttribute('keyword');
                          setFilterInput('');
                        }}
                      >
                        Keyword
                      </DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </InputGroupItem>
                <InputGroupItem isFill>
                  <SearchInput
                    placeholder="Filter by name or description"
                    value={filterInput}
                    onChange={(_event, value) => setFilterInput(value)}
                    onClear={() => setFilterInput('')}
                    id="tier-search-input"
                    style={{ 
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      minWidth: '300px'
                    }}
                  />
                </InputGroupItem>
              </InputGroup>
            </ToolbarItem>
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
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>

      <Table aria-label="Tiers table" id="tiers-table">
            <Thead>
              <Tr>
                <Th sort={getSortParams(0)}>Name</Th>
                <Th sort={getSortParams(1)}>Level</Th>
                <Th sort={getSortParams(2)}>Groups</Th>
                <Th sort={getSortParams(3)}>Models</Th>
                <Th sort={getSortParams(4)}>Limits</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredTiers.map((tier) => (
                <Tr key={tier.id}>
                  <Td dataLabel="Name">
                    <div>
                      <Button 
                        variant="link" 
                        isInline
                        id={`tier-name-${tier.id}`}
                        onClick={() => handleRowClick(tier)}
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
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

      <DeleteTierModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTierToDelete(null);
        }}
        tier={tierToDelete}
        onDelete={handleConfirmDelete}
      />
    </PageSection>
  );
};

export { Tiers };

