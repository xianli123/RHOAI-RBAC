import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageSection,
  Title,
  Content,
  ContentVariants,
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
  SearchInput,
  Dropdown,
  MenuToggle,
  DropdownList,
  DropdownItem,
  Badge,
  Flex,
  FlexItem,
  Pagination,
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  ISortBy,
} from '@patternfly/react-table';
import { EllipsisVIcon } from '@patternfly/react-icons';

interface Role {
  id: string;
  name: string;
  openshiftName: string;
  description: string;
  category: string;
  type: 'Default' | 'Custom';
}

// Mock data for roles
const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Admin',
    openshiftName: 'openshift-io:project:admin',
    description: 'User can edit the project and manage user access. User can view and manage any project resource.',
    category: 'Project Management',
    type: 'Default',
  },
  {
    id: '2',
    name: 'Contributor',
    openshiftName: 'openshift-io:project:contributor',
    description: 'User can view and manage any project resource. Users with this role can manage all resources in the namespace, including workbenches, model deployments, and cluster storage, except for permissions controlling.',
    category: 'Project Management',
    type: 'Default',
  },
  {
    id: '3',
    name: 'Deployment maintainer',
    openshiftName: 'openshift-io:deployment:maintainer',
    description: 'User can view and manage all model deployments.',
    category: 'Deployment Management',
    type: 'Default',
  },
  {
    id: '4',
    name: 'Deployment reader',
    openshiftName: 'openshift-io:deployment:reader',
    description: 'User can view and open model deployments without modifying their configuration.',
    category: 'Deployment Management',
    type: 'Default',
  },
  {
    id: '5',
    name: 'Deployment updater',
    openshiftName: 'openshift-io:deployment:updater',
    description: 'User can view model deployments and update existing deployments.',
    category: 'Deployment Management',
    type: 'Default',
  },
  {
    id: '6',
    name: 'Deployments access',
    openshiftName: 'openshift-io:deployments:access',
    description: 'User can access and interact with deployments.',
    category: 'Deployment Management',
    type: 'Default',
  },
  {
    id: '7',
    name: 'Pipeline maintainer',
    openshiftName: 'openshift-io:pipeline:maintainer',
    description: 'User can view and manage all pipelines.',
    category: 'Pipeline Management',
    type: 'Default',
  },
  {
    id: '8',
    name: 'Pipeline reader',
    openshiftName: 'openshift-io:pipeline:reader',
    description: 'User can view and open pipelines without modifying their configuration.',
    category: 'Pipeline Management',
    type: 'Default',
  },
  {
    id: '9',
    name: 'Pipeline updater',
    openshiftName: 'openshift-io:pipeline:updater',
    description: 'User can view pipelines and modify their configuration, but cannot create or delete them.',
    category: 'Pipeline Management',
    type: 'Default',
  },
  {
    id: '10',
    name: 'Workbench maintainer',
    openshiftName: 'openshift-io:workbench:maintainer',
    description: 'User can view and manage all workbenches. Applies to all workbenches.',
    category: 'Workbench Management',
    type: 'Default',
  },
];

const Roles: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('All categories');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = React.useState(false);
  const [typeFilter, setTypeFilter] = React.useState<'All' | 'Default' | 'Custom'>('All');
  const [sortBy, setSortBy] = React.useState<ISortBy>({
    index: 1,
    direction: 'asc',
  });
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [openKebabMenus, setOpenKebabMenus] = React.useState<Set<string>>(new Set());

  const categories = ['All categories', 'Project Management', 'Deployment Management', 'Pipeline Management', 'Workbench Management'];

  const filteredRoles = React.useMemo(() => {
    return mockRoles.filter(role => {
      const matchesSearch = role.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                           role.description.toLowerCase().includes(searchValue.toLowerCase());
      const matchesCategory = categoryFilter === 'All categories' || role.category === categoryFilter;
      const matchesType = typeFilter === 'All' || role.type === typeFilter;
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [searchValue, categoryFilter, typeFilter]);

  const sortedRoles = React.useMemo(() => {
    const sorted = [...filteredRoles];
    if (sortBy.index !== undefined) {
      sorted.sort((a, b) => {
        let comparison = 0;
        if (sortBy.index === 1) {
          // Sort by Role name
          comparison = a.name.localeCompare(b.name);
        } else if (sortBy.index === 2) {
          // Sort by Description
          comparison = a.description.localeCompare(b.description);
        } else if (sortBy.index === 3) {
          // Sort by Category
          comparison = a.category.localeCompare(b.category);
        } else if (sortBy.index === 4) {
          // Sort by Type
          comparison = a.type.localeCompare(b.type);
        }
        return sortBy.direction === 'asc' ? comparison : -comparison;
      });
    }
    return sorted;
  }, [filteredRoles, sortBy]);

  const paginatedRoles = React.useMemo(() => {
    const start = (page - 1) * perPage;
    return sortedRoles.slice(start, start + perPage);
  }, [sortedRoles, page, perPage]);

  const getSortParams = (columnIndex: number) => ({
    sortBy,
    onSort: (_event: any, index: number, direction: 'asc' | 'desc') => {
      setSortBy({ index, direction });
    },
    columnIndex,
  });

  const toggleKebabMenu = (roleId: string) => {
    setOpenKebabMenus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(roleId)) {
        newSet.delete(roleId);
      } else {
        newSet.add(roleId);
      }
      return newSet;
    });
  };

  return (
    <PageSection>
      <Title headingLevel="h1">Settings - Roles</Title>
      <Content style={{ marginBottom: 'var(--pf-v5-global--spacer--lg)' }}>
        Manage roles and their permissions.
      </Content>

      <Toolbar>
        <ToolbarContent>
          <ToolbarGroup>
            <ToolbarItem>
              <Dropdown
                isOpen={isCategoryDropdownOpen}
                onOpenChange={(isOpen) => setIsCategoryDropdownOpen(isOpen)}
                toggle={(toggleRef) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    isExpanded={isCategoryDropdownOpen}
                  >
                    {categoryFilter}
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  {categories.map((category) => (
                    <DropdownItem
                      key={category}
                      onClick={() => {
                        setCategoryFilter(category);
                        setIsCategoryDropdownOpen(false);
                      }}
                    >
                      {category}
                    </DropdownItem>
                  ))}
                </DropdownList>
              </Dropdown>
            </ToolbarItem>
            <ToolbarItem>
              <SearchInput
                placeholder="Search roles"
                value={searchValue}
                onChange={(_event, value) => setSearchValue(value)}
                onClear={() => setSearchValue('')}
                aria-label="Search roles"
              />
            </ToolbarItem>
            <ToolbarItem>
              <Flex>
                <FlexItem>
                  <Button
                    variant={typeFilter === 'All' ? 'primary' : 'secondary'}
                    onClick={() => setTypeFilter('All')}
                    isSmall
                  >
                    All
                  </Button>
                </FlexItem>
                <FlexItem>
                  <Button
                    variant={typeFilter === 'Default' ? 'primary' : 'secondary'}
                    onClick={() => setTypeFilter('Default')}
                    isSmall
                  >
                    Default
                  </Button>
                </FlexItem>
                <FlexItem>
                  <Button
                    variant={typeFilter === 'Custom' ? 'primary' : 'secondary'}
                    onClick={() => setTypeFilter('Custom')}
                    isSmall
                  >
                    Custom
                  </Button>
                </FlexItem>
              </Flex>
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarItem>
              <Button variant="primary">Create role</Button>
            </ToolbarItem>
            <ToolbarItem>
              <Button variant="secondary" isDisabled>
                Delete role
              </Button>
            </ToolbarItem>
            <ToolbarItem alignment={{ default: 'alignRight' }}>
              <Pagination
                itemCount={sortedRoles.length}
                page={page}
                perPage={perPage}
                onSetPage={(_event, newPage) => setPage(newPage)}
                onPerPageSelect={(_event, newPerPage) => {
                  setPerPage(newPerPage);
                  setPage(1);
                }}
                variant="top"
              />
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>

      <Table variant="compact" aria-label="Roles table">
        <Thead>
          <Tr>
            <Th sort={getSortParams(1)}>Role</Th>
            <Th sort={getSortParams(2)}>Description</Th>
            <Th sort={getSortParams(3)}>Category</Th>
            <Th sort={getSortParams(4)}>Type</Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody>
          {paginatedRoles.length === 0 ? (
            <Tr>
              <Td colSpan={5} style={{ textAlign: 'center', padding: 'var(--pf-v5-global--spacer--xl)' }}>
                No roles found
              </Td>
            </Tr>
          ) : (
            paginatedRoles.map((role) => (
              <Tr key={role.id}>
                <Td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Button
                      variant="link"
                      isInline
                      style={{ padding: 0, fontSize: 'inherit', textAlign: 'left' }}
                      onClick={() => {
                        // Handle role click - could navigate to role details
                      }}
                    >
                      {role.name}
                    </Button>
                    <span style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)' }}>
                      {role.openshiftName}
                    </span>
                  </div>
                </Td>
                <Td>{role.description}</Td>
                <Td>{role.category}</Td>
                <Td>
                  <Badge isRead={role.type === 'Default'}>
                    {role.type}
                  </Badge>
                </Td>
                <Td isActionCell>
                  <Dropdown
                    isOpen={openKebabMenus.has(role.id)}
                    onSelect={() => toggleKebabMenu(role.id)}
                    onOpenChange={(isOpen: boolean) => {
                      if (!isOpen) {
                        toggleKebabMenu(role.id);
                      }
                    }}
                    popperProps={{ position: 'right' }}
                    toggle={(toggleRef) => (
                      <MenuToggle
                        ref={toggleRef}
                        aria-label={`Actions for ${role.name}`}
                        variant="plain"
                        onClick={() => toggleKebabMenu(role.id)}
                        isExpanded={openKebabMenus.has(role.id)}
                      >
                        <EllipsisVIcon />
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem key="edit">Edit</DropdownItem>
                      <DropdownItem key="delete">Delete</DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </PageSection>
  );
};

export { Roles };
