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
  SearchInput,
  Dropdown,
  MenuToggle,
  DropdownList,
  DropdownItem,
  Label,
  Flex,
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
  roleType: 'openshift-default' | 'openshift-custom' | 'regular';
}

// Mock data for roles
const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Admin',
    openshiftName: 'openshift-io:project:admin',
    description: 'User can edit the project and manage user access. User can view and manage any project resource.',
    category: 'Project Management',
    roleType: 'openshift-default',
  },
  {
    id: '2',
    name: 'Contributor',
    openshiftName: 'openshift-io:project:contributor',
    description: 'User can view and manage any project resource. Users with this role can manage all resources in the namespace, including workbenches, model deployments, and cluster storage, except for permissions controlling.',
    category: 'Project Management',
    roleType: 'openshift-default',
  },
  {
    id: '3',
    name: 'Deployment maintainer',
    openshiftName: 'openshift-io:deployment:maintainer',
    description: 'User can view and manage all model deployments.',
    category: 'Deployment Management',
    roleType: 'regular',
  },
  {
    id: '4',
    name: 'Deployment reader',
    openshiftName: 'openshift-io:deployment:reader',
    description: 'User can view and open model deployments without modifying their configuration.',
    category: 'Deployment Management',
    roleType: 'regular',
  },
  {
    id: '5',
    name: 'Deployment updater',
    openshiftName: 'openshift-io:deployment:updater',
    description: 'User can view model deployments and update existing deployments.',
    category: 'Deployment Management',
    roleType: 'regular',
  },
  {
    id: '6',
    name: 'Deployments access',
    openshiftName: 'openshift-io:deployments:access',
    description: 'User can access and interact with deployments.',
    category: 'Deployment Management',
    roleType: 'regular',
  },
  {
    id: '7',
    name: 'Pipeline maintainer',
    openshiftName: 'openshift-io:pipeline:maintainer',
    description: 'User can view and manage all pipelines.',
    category: 'Pipeline Management',
    roleType: 'regular',
  },
  {
    id: '8',
    name: 'Pipeline reader',
    openshiftName: 'openshift-io:pipeline:reader',
    description: 'User can view and open pipelines without modifying their configuration.',
    category: 'Pipeline Management',
    roleType: 'regular',
  },
  {
    id: '9',
    name: 'Pipeline updater',
    openshiftName: 'openshift-io:pipeline:updater',
    description: 'User can view pipelines and modify their configuration, but cannot create or delete them.',
    category: 'Pipeline Management',
    roleType: 'regular',
  },
  {
    id: '10',
    name: 'Workbench maintainer',
    openshiftName: 'openshift-io:workbench:maintainer',
    description: 'User can view and manage all workbenches. Applies to all workbenches.',
    category: 'Workbench Management',
    roleType: 'regular',
  },
  {
    id: '11',
    name: 'Workbench reader',
    openshiftName: 'openshift-io:workbench:reader',
    description: 'User can view and open workbenches without modifying their configuration.',
    category: 'Workbench Management',
    roleType: 'regular',
  },
  {
    id: '12',
    name: 'Workbench updater',
    openshiftName: 'openshift-io:workbench:updater',
    description: 'User can view workbenches and modify their configuration, but cannot create or delete them.',
    category: 'Workbench Management',
    roleType: 'regular',
  },
];

const Roles: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('All categories');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = React.useState(false);

  const renderAILabel = () => {
    return (
      <Label
        color="grey"
        variant="outline"
        isCompact
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '2px 8px',
          borderRadius: '16px',
        }}
      >
        <svg
          className="pf-v6-svg"
          viewBox="0 0 32 32"
          fill="currentColor"
          aria-hidden="true"
          role="img"
          width="1em"
          height="1em"
          style={{ width: '12px', height: '12px' }}
        >
          <path
            xmlns="http://www.w3.org/2000/svg"
            className="st1"
            d="M26.037,16.962c-5.905-.468-10.531-5.094-11-11-.042-.52-.517-.961-1.038-.961s-.997.442-1.038.962c-.468,5.905-5.094,10.531-11,11-.52.042-.961.517-.961,1.038s.442.997.962,1.038c5.905.468,10.531,5.094,11,11,.042.52.517.961,1.038.961s.997-.442,1.038-.962c.468-5.905,5.094-10.531,10.999-10.999,0,0,0,0,0,0,.52-.042.961-.517.961-1.038s-.442-.997-.962-1.038ZM14,25.764c-1.413-3.545-4.219-6.352-7.764-7.764,3.545-1.413,6.352-4.219,7.764-7.764,1.413,3.545,4.219,6.352,7.764,7.764-3.545,1.413-6.352,4.219-7.764,7.764ZM30.096,6.025c-1.55-.346-2.775-1.571-3.123-3.125-.104-.458-.504-.778-.974-.778s-.87.32-.975.781c-.346,1.55-1.571,2.775-3.125,3.123-.458.104-.778.504-.778.974s.32.87.781.975c1.55.346,2.775,1.571,3.123,3.125.104.458.504.778.974.778s.87-.32.975-.781c.346-1.55,1.571-2.775,3.122-3.122,0,0,.002,0,.003,0,.458-.104.778-.504.778-.974s-.32-.87-.781-.975ZM26,8.917c-.481-.778-1.139-1.436-1.917-1.917.778-.481,1.436-1.139,1.917-1.917.481.778,1.139,1.436,1.917,1.917-.778.481-1.436,1.139-1.917,1.917Z"
          />
        </svg>
        AI role
      </Label>
    );
  };

  const renderRoleTypeLabels = (role: Role) => {
    if (role.roleType === 'openshift-default') {
      // For OpenShift default roles, show AI label and OpenShift default label
      const openshiftLabel = (
        <Label 
          color="grey" 
          variant="outline" 
          isCompact
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        >
          <svg
            className="pf-v6-svg"
            viewBox="0 0 100 100"
            fill="currentColor"
            aria-hidden="true"
            role="img"
            width="1em"
            height="1em"
            style={{ width: '12px', height: '12px' }}
          >
            <path fill="#1F1F1F" d="M29,45.3L13,51.1c0.2,2.6,0.6,5.1,1.3,7.6l15.3-5.6C29,50.6,28.8,47.9,29,45.3"/>
            <path fill="#1F1F1F" d="M100,27.5c-1.1-2.3-2.4-4.5-3.9-6.7L80,26.7c1.9,1.9,3.4,4.1,4.7,6.4L100,27.5z"/>
            <path fill="#1F1F1F" d="M64.7,23c3.3,1.6,6.2,3.7,8.7,6.2l16.1-5.8C85,17.1,78.9,11.8,71.5,8.4c-22.9-10.7-50.3-0.7-61,22.2 C7,38,5.7,45.9,6.3,53.5l16.1-5.8c0.3-3.5,1.1-7,2.7-10.3C32,22.5,49.8,16,64.7,23"/>
            <path fill="#1F1F1F" d="M15.3,58.4L0,63.9c1.4,5.6,3.8,10.8,7.2,15.5l16-5.8C19.1,69.4,16.3,64.1,15.3,58.4"/>
            <path fill="#1F1F1F" d="M81.8,52.3c-0.3,3.5-1.1,7-2.7,10.3C72.1,77.5,54.4,84,39.5,77c-3.3-1.6-6.3-3.7-8.7-6.2l-16,5.8 c4.4,6.2,10.5,11.5,17.9,14.9c22.9,10.7,50.3,0.7,61-22.2c3.5-7.4,4.7-15.3,4.1-22.9L81.8,52.3z"/>
            <path fill="#1F1F1F" d="M85.7,32.7l-15.3,5.6c2.8,5.1,4.2,10.9,3.7,16.8l16-5.8C89.8,43.5,88.3,37.9,85.7,32.7"/>
            <path fill="#1F1F1F" d="M29,48.5c0-1.1,0-2.1,0.1-3.2L13,51.1c0.1,1,0.2,2.1,0.4,3.1L29,48.5z"/>
            <path fill="#1F1F1F" d="M97.7,23.3c-0.5-0.8-1-1.6-1.6-2.4L80,26.7c0.7,0.7,1.4,1.5,2,2.3L97.7,23.3z"/>
            <path fill="#1F1F1F" d="M14.7,76.7c1.2,1.7,2.6,3.4,4.1,5l17.4-6.4c-2-1.3-3.9-2.8-5.5-4.4L14.7,76.7z M97.8,46.5l-16,5.8 c-0.2,2.3-0.6,4.6-1.4,6.9l17.4-6.4C98,50.7,98,48.6,97.8,46.5"/>
          </svg>
          <span style={{ marginLeft: '4px' }}>OpenShift default role</span>
        </Label>
      );
      
      return (
        <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsCenter' }}>
          {renderAILabel()}
          <div style={{ width: '4px' }} />
          {openshiftLabel}
        </Flex>
      );
    } else if (role.roleType === 'openshift-custom') {
      // OpenShift custom roles don't get AI label
      const openshiftLabel = (
        <Label 
          color="grey" 
          variant="outline" 
          isCompact
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        >
          <svg
            className="pf-v6-svg"
            viewBox="0 0 100 100"
            fill="currentColor"
            aria-hidden="true"
            role="img"
            width="1em"
            height="1em"
            style={{ width: '12px', height: '12px' }}
          >
            <path fill="#1F1F1F" d="M29,45.3L13,51.1c0.2,2.6,0.6,5.1,1.3,7.6l15.3-5.6C29,50.6,28.8,47.9,29,45.3"/>
            <path fill="#1F1F1F" d="M100,27.5c-1.1-2.3-2.4-4.5-3.9-6.7L80,26.7c1.9,1.9,3.4,4.1,4.7,6.4L100,27.5z"/>
            <path fill="#1F1F1F" d="M64.7,23c3.3,1.6,6.2,3.7,8.7,6.2l16.1-5.8C85,17.1,78.9,11.8,71.5,8.4c-22.9-10.7-50.3-0.7-61,22.2 C7,38,5.7,45.9,6.3,53.5l16.1-5.8c0.3-3.5,1.1-7,2.7-10.3C32,22.5,49.8,16,64.7,23"/>
            <path fill="#1F1F1F" d="M15.3,58.4L0,63.9c1.4,5.6,3.8,10.8,7.2,15.5l16-5.8C19.1,69.4,16.3,64.1,15.3,58.4"/>
            <path fill="#1F1F1F" d="M81.8,52.3c-0.3,3.5-1.1,7-2.7,10.3C72.1,77.5,54.4,84,39.5,77c-3.3-1.6-6.3-3.7-8.7-6.2l-16,5.8 c4.4,6.2,10.5,11.5,17.9,14.9c22.9,10.7,50.3,0.7,61-22.2c3.5-7.4,4.7-15.3,4.1-22.9L81.8,52.3z"/>
            <path fill="#1F1F1F" d="M85.7,32.7l-15.3,5.6c2.8,5.1,4.2,10.9,3.7,16.8l16-5.8C89.8,43.5,88.3,37.9,85.7,32.7"/>
            <path fill="#1F1F1F" d="M29,48.5c0-1.1,0-2.1,0.1-3.2L13,51.1c0.1,1,0.2,2.1,0.4,3.1L29,48.5z"/>
            <path fill="#1F1F1F" d="M97.7,23.3c-0.5-0.8-1-1.6-1.6-2.4L80,26.7c0.7,0.7,1.4,1.5,2,2.3L97.7,23.3z"/>
            <path fill="#1F1F1F" d="M14.7,76.7c1.2,1.7,2.6,3.4,4.1,5l17.4-6.4c-2-1.3-3.9-2.8-5.5-4.4L14.7,76.7z M97.8,46.5l-16,5.8 c-0.2,2.3-0.6,4.6-1.4,6.9l17.4-6.4C98,50.7,98,48.6,97.8,46.5"/>
          </svg>
          <span style={{ marginLeft: '4px' }}>OpenShift custom role</span>
        </Label>
      );
      
      return openshiftLabel;
    } else {
      // Regular role - add AI label
      return renderAILabel();
    }
  };
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
      return matchesSearch && matchesCategory;
    });
  }, [searchValue, categoryFilter]);

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
          comparison = a.roleType.localeCompare(b.roleType);
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
            <Button variant="primary" id="create-role-button">
              Create role
            </Button>
          </ToolbarItem>
          <ToolbarItem>
            <Pagination
              itemCount={filteredRoles.length}
              page={page}
              perPage={perPage}
              onSetPage={(_event, newPage) => setPage(newPage)}
              onPerPageSelect={(_event, newPerPage) => {
                setPerPage(newPerPage);
                setPage(1);
              }}
              id="table-pagination-top"
              isCompact
            />
          </ToolbarItem>
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
                  {renderRoleTypeLabels(role)}
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
