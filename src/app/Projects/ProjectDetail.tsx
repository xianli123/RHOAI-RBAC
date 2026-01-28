import * as React from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { TypeaheadSelect, TypeaheadSelectOption } from '@patternfly/react-templates';
import {
  PageSection,
  Title,
  Breadcrumb,
  BreadcrumbItem,
  Tabs,
  Tab,
  TabTitleText,
  Alert,
  AlertVariant,
  Button,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
  Flex,
  FlexItem,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
  SearchInput,
  Select,
  SelectList,
  SelectOption,
  Divider,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  Content,
  ClipboardCopy,
  Radio,
  Popover,
  Form,
  FormGroup,
  HelperText,
  HelperTextItem,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  List,
  ListItem,
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
import {
  OutlinedFolderIcon,
  OutlinedQuestionCircleIcon,
  EllipsisVIcon,
} from '@patternfly/react-icons';

// Mock data for users
interface UserRole {
  role: string;
  roleType: 'openshift-default' | 'openshift-custom' | 'regular';
}

interface User {
  id: string;
  name: string;
  roles: UserRole[];
  dateCreated: string;
}

// Mock data for groups
interface GroupRole {
  role: string;
  roleType: 'openshift-default' | 'openshift-custom' | 'regular';
}

interface Group {
  id: string;
  name: string;
  roles: GroupRole[];
  dateCreated: string;
}

import { mockUsers as sharedMockUsers, mockGroups as sharedMockGroups } from './sharedPermissionsData';

// Use shared data directly - will be updated when roles are saved
// We'll use React state to ensure re-renders when data changes

// Mock data for role details (permissions/rules)
interface RoleRule {
  actions: string;
  apiGroups: string;
  resources: string;
  resourceNames: string;
}

const getRoleRules = (roleName: string): RoleRule[] => {
  // Mock data - in real app, this would come from API
  if (roleName === 'Admin') {
    return [
      { actions: 'All', apiGroups: 'infrastructure.odh.io', resources: 'aaqs', resourceNames: '-' },
      { actions: 'create, update, patch, delete', apiGroups: 'infrastructure.odh.io', resources: 'subscriptions', resourceNames: '-' },
      { actions: 'delete', apiGroups: 'infrastructure.odh.io', resources: 'catalogsources, clusterserviceversions, installplans, subscriptions', resourceNames: '-' },
      { actions: 'get, list, watch', apiGroups: 'infrastructure.odh.io', resources: 'catalogsources, clusterserviceversions, installplans, operatorgroups, subscriptions', resourceNames: '-' },
      { actions: 'get, list, watch', apiGroups: 'infrastructure.odh.io', resources: 'packagemanifests,packagemanifests/icon', resourceNames: '-' },
      { actions: 'get, list, watch', apiGroups: 'apps', resources: 'Deployments', resourceNames: '-' },
      { actions: 'get, list, watch', apiGroups: '', resources: 'Storage', resourceNames: '-' },
      { actions: 'All', apiGroups: 'argoproj.io', resources: 'analysistemplates', resourceNames: '-' },
      { actions: 'get, list, watch', apiGroups: 'cdi.kubevirt.io', resources: 'datavolumes/source', resourceNames: '-' },
      { actions: 'create', apiGroups: 'cdi.kubevirt.io', resources: 'uploadtokenrequests', resourceNames: '-' },
    ];
  }
  return [
    { actions: 'get, list, watch', apiGroups: 'apps', resources: 'Deployments', resourceNames: '-' },
    { actions: 'create, update, patch', apiGroups: 'apps', resources: 'Deployments', resourceNames: '-' },
  ];
};

// Mock data for role assignees
interface RoleAssignee {
  subject: string;
  subjectType: 'User' | 'Group';
  roleBinding: string;
  dateCreated: string;
}

const getRoleAssignees = (roleName: string): RoleAssignee[] => {
  // Mock data - in real app, this would come from API
  if (roleName === 'Workbench maintainer') {
    return [
      { subject: 'Deena', subjectType: 'User', roleBinding: 'rb-wb-updater', dateCreated: '30 Oct 2024' },
      { subject: 'Diana', subjectType: 'User', roleBinding: 'rb-wb-updater', dateCreated: '30 Oct 2024' },
      { subject: 'Jeff', subjectType: 'User', roleBinding: 'rb-wb-updater', dateCreated: '30 Oct 2024' },
      { subject: 'workbench team', subjectType: 'Group', roleBinding: 'rb-wb-updater', dateCreated: '30 Oct 2024' },
      { subject: 'youth team', subjectType: 'Group', roleBinding: 'rb-wb-updater-in-cli', dateCreated: '30 Oct 2024' },
    ];
  }
  // Default assignees for other roles - use shared data directly
  const userAssignees: RoleAssignee[] = sharedMockUsers
    .filter(u => u.roles.some(r => r.role === roleName))
    .map(u => ({ subject: u.name, subjectType: 'User' as const, roleBinding: `rb-${roleName.toLowerCase().replace(/\s+/g, '-')}`, dateCreated: u.dateCreated }));
  
  const groupAssignees: RoleAssignee[] = sharedMockGroups
    .filter(g => g.roles.some(r => r.role === roleName))
    .map(g => ({ subject: g.name, subjectType: 'Group' as const, roleBinding: `rb-${roleName.toLowerCase().replace(/\s+/g, '-')}`, dateCreated: g.dateCreated }));
  
  return [...userAssignees, ...groupAssignees];
};

const ProjectDetail: React.FunctionComponent = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(tabParam || 'overview');
  
  // Use shared data with state to ensure re-renders when data changes
  const [mockUsers, setMockUsers] = React.useState<User[]>(sharedMockUsers as User[]);
  const [mockGroups, setMockGroups] = React.useState<Group[]>(sharedMockGroups as Group[]);

  React.useEffect(() => {
    if (tabParam) {
      setActiveTabKey(tabParam);
    }
    // Update state when component mounts or when navigating back from edit pages
    setMockUsers([...sharedMockUsers] as User[]);
    setMockGroups([...sharedMockGroups] as Group[]);
  }, [tabParam, searchParams]); // Re-run when URL params change (e.g., when navigating back)

  const [isActionsOpen, setIsActionsOpen] = React.useState(false);
  const [openKebabMenus, setOpenKebabMenus] = React.useState<Set<string>>(new Set());
  const [usersSortBy, setUsersSortBy] = React.useState<ISortBy>({
    index: 0,
    direction: 'asc',
  });
  const [groupsSortBy, setGroupsSortBy] = React.useState<ISortBy>({
    index: 0,
    direction: 'asc',
  });
  
  // Toolbar state
  const [subjectFilter, setSubjectFilter] = React.useState<string>('All subjects');
  const [isSubjectFilterOpen, setIsSubjectFilterOpen] = React.useState(false);
  const [nameFilter, setNameFilter] = React.useState<string>('Name');
  const [isNameFilterOpen, setIsNameFilterOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState<string>('');
  
  // Role details modal state
  const [isRoleModalOpen, setIsRoleModalOpen] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<{ name: string; roleType: 'openshift-default' | 'openshift-custom' | 'regular' } | null>(null);
  const [roleModalTabKey, setRoleModalTabKey] = React.useState<string | number>(0);
  const [assigneesSortBy, setAssigneesSortBy] = React.useState<ISortBy>({
    index: 0,
    direction: 'asc',
  });
  
  // Variant switcher state for Roles table
  const [rolesVariant, setRolesVariant] = React.useState<'option1' | 'option2' | 'option3'>('option3');
  const [isRolesVariantDropdownOpen, setIsRolesVariantDropdownOpen] = React.useState(false);
  
  // Popover state for Option 2 labels
  const [openPopovers, setOpenPopovers] = React.useState<Set<string>>(new Set());
  const [isComparisonModalOpen, setIsComparisonModalOpen] = React.useState(false);
  const [selectedAssignOption, setSelectedAssignOption] = React.useState<'option1' | 'option2' | null>(null);
  const [isOption2ModalOpen, setIsOption2ModalOpen] = React.useState(false);
  const [option2SubjectType, setOption2SubjectType] = React.useState<'User' | 'Group'>('User');
  const [option2SelectedSubject, setOption2SelectedSubject] = React.useState<string | undefined>();
  const [option2TypeaheadInputValue, setOption2TypeaheadInputValue] = React.useState<string>('');

  // Keep Role table comparison on option1 when switching options in Role assignment flow comparison modal
  React.useEffect(() => {
    if (isComparisonModalOpen || selectedAssignOption) {
      setRolesVariant('option1');
    }
  }, [isComparisonModalOpen, selectedAssignOption]);
  
  const togglePopover = (popoverId: string) => {
    setOpenPopovers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(popoverId)) {
        newSet.delete(popoverId);
      } else {
        newSet.add(popoverId);
      }
      return newSet;
    });
  };
  
  const getLabelPopoverContent = (labelType: 'ai' | 'openshift-default' | 'openshift-custom', roleName?: string) => {
    switch (labelType) {
      case 'ai':
        return {
          title: 'AI Role',
          body: 'This role is an AI-generated role that provides intelligent access control based on usage patterns and requirements. AI roles are automatically created and optimized to match your project\'s specific needs.',
        };
      case 'openshift-default':
        return {
          title: 'OpenShift Default Role',
          body: 'OpenShift default roles are predefined roles provided by the OpenShift platform. These roles have standard permissions that cannot be modified. They are maintained by the platform and provide consistent access control across all projects.',
          roleName: roleName,
        };
      case 'openshift-custom':
        return {
          title: 'OpenShift Custom Role',
          body: 'OpenShift custom roles are user-defined roles created within the OpenShift platform. These roles can be customized to meet specific project requirements and provide fine-grained access control tailored to your organization\'s needs.',
          roleName: roleName,
        };
      default:
        return { title: '', body: '' };
    }
  };

  const toggleKebabMenu = (id: string) => {
    setOpenKebabMenus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getUsersSortParams = (columnIndex: number) => ({
    sortBy: usersSortBy,
    onSort: (_event: any, index: number, direction: 'asc' | 'desc') => {
      setUsersSortBy({ index, direction });
    },
    columnIndex,
  });

  const getGroupsSortParams = (columnIndex: number) => ({
    sortBy: groupsSortBy,
    onSort: (_event: any, index: number, direction: 'asc' | 'desc') => {
      setGroupsSortBy({ index, direction });
    },
    columnIndex,
  });

  const getAssigneesSortParams = (columnIndex: number) => ({
    sortBy: assigneesSortBy,
    onSort: (_event: any, index: number, direction: 'asc' | 'desc') => {
      setAssigneesSortBy({ index, direction });
    },
    columnIndex,
  });

  const getSortedAssignees = (assignees: RoleAssignee[]): RoleAssignee[] => {
    const sorted = [...assignees];
    const columnIndex = assigneesSortBy.index;
    const direction = assigneesSortBy.direction;

    sorted.sort((a, b) => {
      let comparison = 0;
      
      if (columnIndex === 0) {
        // Sort by Subject
        comparison = a.subject.localeCompare(b.subject);
      } else if (columnIndex === 1) {
        // Sort by Subject kind
        comparison = a.subjectType.localeCompare(b.subjectType);
      } else if (columnIndex === 2) {
        // Sort by Role binding
        comparison = a.roleBinding.localeCompare(b.roleBinding);
      } else if (columnIndex === 3) {
        // Sort by Date created
        comparison = a.dateCreated.localeCompare(b.dateCreated);
      }

      return direction === 'asc' ? comparison : -comparison;
    });

    return sorted;
  };

  const handleRoleClick = (role: string, roleType: 'openshift-default' | 'openshift-custom' | 'regular') => {
    setSelectedRole({ name: role, roleType });
    setIsRoleModalOpen(true);
    setRoleModalTabKey(0);
  };

  const renderAILabel = (popoverId: string) => {
    const isOpen = openPopovers.has(popoverId);
    const content = getLabelPopoverContent('ai');
    const label = (
      <Label
        color="green"
        variant="filled"
        isCompact
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '2px 8px',
          borderRadius: '16px',
          cursor: 'pointer',
        }}
        onClick={(e) => {
          e.stopPropagation();
          const isCurrentlyOpen = openPopovers.has(popoverId);
          if (!isCurrentlyOpen) {
            setOpenPopovers((prev) => {
              const newSet = new Set(prev);
              newSet.add(popoverId);
              return newSet;
            });
          }
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
    
    return (
      <Popover
        headerContent={
          <div style={{ fontWeight: 600 }}>{content.title}</div>
        }
        bodyContent="This is a placeholder. Not real data."
        showClose
        isVisible={isOpen}
        shouldOpen={() => {
          setOpenPopovers((prev) => {
            const newSet = new Set(prev);
            if (!newSet.has(popoverId)) {
              newSet.add(popoverId);
            }
            return newSet;
          });
          return true;
        }}
        shouldClose={() => {
          setOpenPopovers((prev) => {
            const newSet = new Set(prev);
            newSet.delete(popoverId);
            return newSet;
          });
          return true;
        }}
      >
        {label}
      </Popover>
    );
  };

  const renderModalHeaderRoleTypeLabels = (roleName: string, roleType: 'openshift-default' | 'openshift-custom' | 'regular') => {
    if (roleType === 'openshift-default') {
      // For OpenShift default roles, show AI label and OpenShift default label
      const aiPopoverId = `ai-modal-header-${roleName}`;
      const aiContent = getLabelPopoverContent('ai');
      
      const aiLabelWithPopover = (
        <Popover
          headerContent={
            <div style={{ fontWeight: 600 }}>{aiContent.title}</div>
          }
          bodyContent="This is a placeholder. Not real data."
          showClose
          isVisible={openPopovers.has(aiPopoverId)}
          onHide={() => {
            setOpenPopovers((prev) => {
              const newSet = new Set(prev);
              newSet.delete(aiPopoverId);
              return newSet;
            });
          }}
        >
          <Label
            color="grey"
            variant="outline"
            isCompact
            style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setOpenPopovers((prev) => {
                const newSet = new Set(prev);
                if (newSet.has(aiPopoverId)) {
                  newSet.delete(aiPopoverId);
                } else {
                  newSet.add(aiPopoverId);
                }
                return newSet;
              });
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
            <span style={{ marginLeft: '4px' }}>AI role</span>
          </Label>
        </Popover>
      );
      
      const openshiftPopoverId = `openshift-default-modal-header-${roleName}`;
      const openshiftContent = getLabelPopoverContent('openshift-default', roleName);
      
      const openshiftLabelWithPopover = (
        <Popover
          headerContent={
            <div style={{ fontWeight: 600 }}>{openshiftContent.title}</div>
          }
          bodyContent="This is a placeholder. Not real data."
          showClose
          isVisible={openPopovers.has(openshiftPopoverId)}
          onHide={() => {
            setOpenPopovers((prev) => {
              const newSet = new Set(prev);
              newSet.delete(openshiftPopoverId);
              return newSet;
            });
          }}
        >
          <Label 
            color="grey" 
            variant="outline" 
            isCompact
            style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setOpenPopovers((prev) => {
                const newSet = new Set(prev);
                if (newSet.has(openshiftPopoverId)) {
                  newSet.delete(openshiftPopoverId);
                } else {
                  newSet.add(openshiftPopoverId);
                }
                return newSet;
              });
            }}
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
        </Popover>
      );
      
      return (
        <>
          {aiLabelWithPopover}
          {openshiftLabelWithPopover}
        </>
      );
    } else if (roleType === 'openshift-custom') {
      // OpenShift custom roles don't get AI label
      const openshiftPopoverId = `openshift-custom-modal-header-${roleName}`;
      const openshiftContent = getLabelPopoverContent('openshift-custom', roleName);
      
      const openshiftLabelWithPopover = (
        <Popover
          headerContent={
            <div style={{ fontWeight: 600 }}>{openshiftContent.title}</div>
          }
          bodyContent="This is a placeholder. Not real data."
          showClose
          isVisible={openPopovers.has(openshiftPopoverId)}
          onHide={() => {
            setOpenPopovers((prev) => {
              const newSet = new Set(prev);
              newSet.delete(openshiftPopoverId);
              return newSet;
            });
          }}
        >
          <Label 
            color="grey" 
            variant="outline" 
            isCompact
            style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setOpenPopovers((prev) => {
                const newSet = new Set(prev);
                if (newSet.has(openshiftPopoverId)) {
                  newSet.delete(openshiftPopoverId);
                } else {
                  newSet.add(openshiftPopoverId);
                }
                return newSet;
              });
            }}
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
        </Popover>
      );
      
      return openshiftLabelWithPopover;
    } else {
      // Regular role - add AI label
      const aiPopoverId = `ai-modal-header-regular-${roleName}`;
      const aiContent = getLabelPopoverContent('ai');
      
      const aiLabelWithPopover = (
        <Popover
          headerContent={
            <div style={{ fontWeight: 600 }}>{aiContent.title}</div>
          }
          bodyContent="This is a placeholder. Not real data."
          showClose
          isVisible={openPopovers.has(aiPopoverId)}
          onHide={() => {
            setOpenPopovers((prev) => {
              const newSet = new Set(prev);
              newSet.delete(aiPopoverId);
              return newSet;
            });
          }}
        >
          <Label
            color="grey"
            variant="outline"
            isCompact
            style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setOpenPopovers((prev) => {
                const newSet = new Set(prev);
                if (newSet.has(aiPopoverId)) {
                  newSet.delete(aiPopoverId);
                } else {
                  newSet.add(aiPopoverId);
                }
                return newSet;
              });
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
            <span style={{ marginLeft: '4px' }}>AI role</span>
          </Label>
        </Popover>
      );
      
      return aiLabelWithPopover;
    }
  };

  const renderRoleBadge = (
    role: string, 
    roleType: 'openshift-default' | 'openshift-custom' | 'regular',
    subjectType?: 'User' | 'Group',
    subjectName?: string
  ) => {
    const roleNameElement = (
      <Button
        variant="link"
        isInline
        onClick={() => handleRoleClick(role, roleType)}
        style={{ padding: 0, fontSize: 'inherit', textDecoration: 'none' }}
      >
        {role}
      </Button>
    );

    // Option 3: Remove all labels
    if (rolesVariant === 'option3') {
      return roleNameElement;
    }

    // Option 1: Reuse filled labels with popovers from Option 2
    if (rolesVariant === 'option1') {
      if (roleType === 'openshift-default') {
        const openshiftPopoverId = `openshift-default-${subjectType}-${subjectName}-${role}`;
        const openshiftContent = getLabelPopoverContent('openshift-default', role);
        const openshiftLabel = (
          <Label 
            color="grey" 
            variant="outline" 
            isCompact
            style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            onClick={(e) => {
              e.stopPropagation();
              const isCurrentlyOpen = openPopovers.has(openshiftPopoverId);
              if (!isCurrentlyOpen) {
                setOpenPopovers((prev) => {
                  const newSet = new Set(prev);
                  newSet.add(openshiftPopoverId);
                  return newSet;
                });
              }
            }}
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
            <span style={{ marginLeft: '4px' }}>OpenShift default</span>
          </Label>
        );
        
        const openshiftLabelWithPopover = (
          <Popover
            headerContent={
              <div style={{ fontWeight: 600 }}>{openshiftContent.title}</div>
            }
            bodyContent="This is a placeholder. Not real data."
            showClose
            isVisible={openPopovers.has(openshiftPopoverId)}
            shouldOpen={() => {
              setOpenPopovers((prev) => {
                const newSet = new Set(prev);
                if (!newSet.has(openshiftPopoverId)) {
                  newSet.add(openshiftPopoverId);
                }
                return newSet;
              });
              return true;
            }}
            shouldClose={() => {
              setOpenPopovers((prev) => {
                const newSet = new Set(prev);
                newSet.delete(openshiftPopoverId);
                return newSet;
              });
              return true;
            }}
          >
            {openshiftLabel}
          </Popover>
        );
        
        return (
          <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsCenter' }}>
            {roleNameElement}
            {openshiftLabelWithPopover}
          </Flex>
        );
      } else if (roleType === 'openshift-custom') {
        const openshiftPopoverId = `openshift-custom-${subjectType}-${subjectName}-${role}`;
        const openshiftContent = getLabelPopoverContent('openshift-custom', role);
        const openshiftLabel = (
          <Label 
            color="grey" 
            variant="outline" 
            isCompact
            style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            onClick={(e) => {
              e.stopPropagation();
              const isCurrentlyOpen = openPopovers.has(openshiftPopoverId);
              if (!isCurrentlyOpen) {
                setOpenPopovers((prev) => {
                  const newSet = new Set(prev);
                  newSet.add(openshiftPopoverId);
                  return newSet;
                });
              }
            }}
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
            <span style={{ marginLeft: '4px' }}>OpenShift custom</span>
          </Label>
        );
        
        const openshiftLabelWithPopover = (
          <Popover
            headerContent={
              <div style={{ fontWeight: 600 }}>{openshiftContent.title}</div>
            }
            bodyContent="This is a placeholder. Not real data."
            showClose
            isVisible={openPopovers.has(openshiftPopoverId)}
            shouldOpen={() => {
              setOpenPopovers((prev) => {
                const newSet = new Set(prev);
                if (!newSet.has(openshiftPopoverId)) {
                  newSet.add(openshiftPopoverId);
                }
                return newSet;
              });
              return true;
            }}
            shouldClose={() => {
              setOpenPopovers((prev) => {
                const newSet = new Set(prev);
                newSet.delete(openshiftPopoverId);
                return newSet;
              });
              return true;
            }}
          >
            {openshiftLabel}
          </Popover>
        );
        
        return (
          <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsCenter' }}>
            {roleNameElement}
            {openshiftLabelWithPopover}
          </Flex>
        );
      }
      return roleNameElement;
    }

    // Option 2: With all labels (add AI label for regular roles and Admin/Contributor)
    if (rolesVariant === 'option2') {
      if (roleType === 'openshift-default') {
        // For Admin and Contributor, show AI label before OpenShift default label
        const isAdminOrContributor = role === 'Admin' || role === 'Contributor';
        const aiPopoverId = `ai-${subjectType}-${subjectName}-${role}`;
        const openshiftPopoverId = `openshift-default-${subjectType}-${subjectName}-${role}`;
        const openshiftContent = getLabelPopoverContent('openshift-default', role);
        const openshiftLabel = (
          <Label 
            color="grey" 
            variant="outline" 
            isCompact
            style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            onClick={(e) => {
              e.stopPropagation();
              const isCurrentlyOpen = openPopovers.has(openshiftPopoverId);
              if (!isCurrentlyOpen) {
                setOpenPopovers((prev) => {
                  const newSet = new Set(prev);
                  newSet.add(openshiftPopoverId);
                  return newSet;
                });
              }
            }}
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
            <span style={{ marginLeft: '4px' }}>OpenShift default</span>
          </Label>
        );
        
        const openshiftLabelWithPopover = rolesVariant === 'option2' ? (
          <Popover
            headerContent={
              <div style={{ fontWeight: 600 }}>{openshiftContent.title}</div>
            }
            bodyContent="This is a placeholder. Not real data."
            showClose
            isVisible={openPopovers.has(openshiftPopoverId)}
            shouldOpen={() => {
              setOpenPopovers((prev) => {
                const newSet = new Set(prev);
                if (!newSet.has(openshiftPopoverId)) {
                  newSet.add(openshiftPopoverId);
                }
                return newSet;
              });
              return true;
            }}
            shouldClose={() => {
              setOpenPopovers((prev) => {
                const newSet = new Set(prev);
                newSet.delete(openshiftPopoverId);
                return newSet;
              });
              return true;
            }}
          >
            {openshiftLabel}
          </Popover>
        ) : openshiftLabel;
        
        return (
          <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsCenter' }}>
            {roleNameElement}
            {isAdminOrContributor && (
              <>
                {renderAILabel(aiPopoverId)}
                <div style={{ width: '4px' }} />
              </>
            )}
            {openshiftLabelWithPopover}
          </Flex>
        );
      } else if (roleType === 'openshift-custom') {
        const openshiftPopoverId = `openshift-custom-${subjectType}-${subjectName}-${role}`;
        const openshiftContent = getLabelPopoverContent('openshift-custom', role);
        const openshiftLabel = (
          <Label 
            color="grey" 
            variant="outline" 
            isCompact
            style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            onClick={(e) => {
              e.stopPropagation();
              const isCurrentlyOpen = openPopovers.has(openshiftPopoverId);
              if (!isCurrentlyOpen) {
                setOpenPopovers((prev) => {
                  const newSet = new Set(prev);
                  newSet.add(openshiftPopoverId);
                  return newSet;
                });
              }
            }}
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
            <span style={{ marginLeft: '4px' }}>OpenShift custom</span>
          </Label>
        );
        
        const openshiftLabelWithPopover = rolesVariant === 'option2' ? (
          <Popover
            headerContent={
              <div style={{ fontWeight: 600 }}>{openshiftContent.title}</div>
            }
            bodyContent="This is a placeholder. Not real data."
            showClose
            isVisible={openPopovers.has(openshiftPopoverId)}
            shouldOpen={() => {
              setOpenPopovers((prev) => {
                const newSet = new Set(prev);
                if (!newSet.has(openshiftPopoverId)) {
                  newSet.add(openshiftPopoverId);
                }
                return newSet;
              });
              return true;
            }}
            shouldClose={() => {
              setOpenPopovers((prev) => {
                const newSet = new Set(prev);
                newSet.delete(openshiftPopoverId);
                return newSet;
              });
              return true;
            }}
          >
            {openshiftLabel}
          </Popover>
        ) : openshiftLabel;
        
        return (
          <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsCenter' }}>
            {roleNameElement}
            {openshiftLabelWithPopover}
          </Flex>
        );
      } else {
        // Regular role - add AI label
        const aiPopoverId = `ai-${subjectType}-${subjectName}-${role}`;
        return (
          <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsCenter' }}>
            {roleNameElement}
            {renderAILabel(aiPopoverId)}
          </Flex>
        );
      }
    }

    return roleNameElement;
  };

  const handleAssignRoles = () => {
    // Navigate directly to Assign roles page (Option 2 is hidden)
    navigate(`/projects/${projectId}/permissions/assign-roles`);
  };

  // Helper function to get available subjects for Option 2 modal
  const getAvailableSubjectsForOption2 = (): string[] => {
    if (option2SubjectType === 'User') {
      return mockUsers.map(user => user.name);
    } else {
      return mockGroups.map(group => group.name);
    }
  };

  // Create typeahead options for Option 2 modal
  const option2TypeaheadOptions = React.useMemo<TypeaheadSelectOption[]>(() => {
    const subjects = getAvailableSubjectsForOption2();
    const groupHeader = option2SubjectType === 'User' ? 'Users with existing assignment' : 'Groups with existing assignment';
    const options: TypeaheadSelectOption[] = [];
    
    // Filter subjects based on input value
    const filteredSubjects = option2TypeaheadInputValue && option2TypeaheadInputValue.trim()
      ? subjects.filter(subject => 
          subject.toLowerCase().includes(option2TypeaheadInputValue.toLowerCase())
        )
      : subjects;
    
    // If there's input, add create option first
    if (option2TypeaheadInputValue && option2TypeaheadInputValue.trim()) {
      options.push({
        content: `Assign role to "${option2TypeaheadInputValue}"`,
        value: `Assign role to "${option2TypeaheadInputValue}"`,
      });
    }
    
    // Only add group header if there are filtered subjects
    if (filteredSubjects.length > 0) {
      options.push({
        content: groupHeader,
        value: `__group_header_${groupHeader}`,
        isDisabled: true,
        isAriaDisabled: true,
      } as TypeaheadSelectOption);
      
      // Add filtered existing subjects
      options.push(...filteredSubjects.map((subject) => ({
        content: subject,
        value: subject,
        selected: subject === option2SelectedSubject,
      })));
    }
    
    // If selectedSubject is set and not in the existing subjects, add it to options so it displays correctly
    if (option2SelectedSubject && !subjects.includes(option2SelectedSubject)) {
      // Check if it's not already in options
      const alreadyInOptions = options.some(opt => opt.value === option2SelectedSubject);
      if (!alreadyInOptions) {
        options.push({
          content: option2SelectedSubject,
          value: option2SelectedSubject,
          selected: true,
        });
      }
    }
    
    return options;
  }, [option2SubjectType, option2SelectedSubject, option2TypeaheadInputValue, mockUsers, mockGroups]);

  const handleEditUser = (userId: string, userName: string) => {
    const urlParams = new URLSearchParams({
      subjectType: 'User',
      subjectName: userName
    });
    // Always navigate to Option 3 in Manage roles page, regardless of Role table comparison selection
    // Not setting designOption will default to option3 in EditRolesPage
    navigate(`/projects/${projectId}/permissions/edit-roles?${urlParams.toString()}`);
  };

  const handleEditGroup = (groupId: string, groupName: string) => {
    const urlParams = new URLSearchParams({
      subjectType: 'Group',
      subjectName: groupName
    });
    // Always navigate to Option 3 in Manage roles page, regardless of Role table comparison selection
    // Not setting designOption will default to option3 in EditRolesPage
    navigate(`/projects/${projectId}/permissions/edit-roles?${urlParams.toString()}`);
  };

  // User icon component
  const UserIconCircle = () => (
    <div
      style={{
        display: 'inline-block',
        width: '40px',
        height: '40px',
        padding: '4px',
        borderRadius: '20px',
        background: '#ffe8cc',
        color: 'var(--ai-user--IconColor)',
      }}
    >
      <svg
        className="pf-v6-svg"
        viewBox="0 0 36 36"
        fill="currentColor"
        aria-hidden="true"
        role="img"
        width="1em"
        height="1em"
        style={{ width: '32px', height: '32px' }}
      >
        <path d="M21.32,17.8C27.8,14.41,25.42,4.39,18,4.38s-9.8,10-3.32,13.42A13.63,13.63,0,0,0,4.38,31a.61.61,0,0,0,.62.62H31a.61.61,0,0,0,.62-.62A13.63,13.63,0,0,0,21.32,17.8Zm-9.2-6.3c.25-7.76,11.51-7.76,11.76,0C23.63,19.26,12.37,19.26,12.12,11.5ZM5.64,30.38C7,14.79,29.05,14.8,30.36,30.38Z"></path>
      </svg>
    </div>
  );

  // Group icon component
  const GroupIconCircle = () => (
    <div
      style={{
        display: 'inline-block',
        width: '40px',
        height: '40px',
        padding: '4px',
        borderRadius: '20px',
        background: '#ffe8cc',
        color: 'var(--ai-group--IconColor)',
      }}
    >
      <svg
        className="pf-v6-svg"
        viewBox="0 0 36 36"
        fill="currentColor"
        aria-hidden="true"
        role="img"
        width="1em"
        height="1em"
        style={{ width: '32px', height: '32px' }}
      >
        <path d="m 27.87,23.29 a 3.86,3.86 0 1 0 -4.74,0 A 7.11,7.11 0 0 0 18.38,30 0.61,0.61 0 0 0 19,30.62 H 32 A 0.63,0.63 0 0 0 32.63,30 7.13,7.13 0 0 0 27.87,23.29 Z m -5,-3 a 2.62,2.62 0 0 1 5.24,0 2.62,2.62 0 0 1 -5.23,-0.04 z m -3.22,9.13 c 0.84,-6.94 10.84,-6.93 11.68,0 z M 16,19.38 a 0.62,0.62 0 0 0 0,1.24 h 4 a 0.62,0.62 0 0 0 0,-1.24 z m -2.63,-4 a 6,6 0 0 1 9.48,0.18 0.61,0.61 0 0 0 0.66,-0.07 c 1.07,-1 -2.27,-3 -3.13,-3.21 a 3.86,3.86 0 1 0 -4.76,0 c -0.86,0.25 -4.2,2.18 -3.13,3.21 a 0.62,0.62 0 0 0 0.88,-0.11 z m 2,-6.13 a 2.62,2.62 0 0 1 5.24,0 2.62,2.62 0 0 1 -5.23,0 z m -2.5,14.04 a 3.86,3.86 0 1 0 -4.74,0 A 7.11,7.11 0 0 0 3.38,30 0.61,0.61 0 0 0 4,30.62 H 17 A 0.63,0.63 0 0 0 17.63,30 7.13,7.13 0 0 0 12.87,23.29 Z m -5,-3 a 2.62,2.62 0 0 1 5.24,0 2.62,2.62 0 0 1 -5.23,-0.04 z m -3.21,9.09 c 0.84,-6.94 10.84,-6.93 11.68,0 z"></path>
      </svg>
    </div>
  );

  return (
    <>
      {/* Variant Switcher */}
      {activeTabKey === 'permissions' && (
        <div style={{
          backgroundColor: '#f0e6ff',
          padding: '16px',
          borderBottom: '1px solid var(--pf-v5-global--BorderColor--200)'
        }}>
          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsLg' }}>
            <FlexItem>
              <span style={{ fontWeight: 600, fontSize: 'var(--pf-v5-global--FontSize--md)' }}>Role table comparison</span>
            </FlexItem>
            <FlexItem>
              <Select
                isOpen={isRolesVariantDropdownOpen}
                onOpenChange={(isOpen) => setIsRolesVariantDropdownOpen(isOpen)}
                selected={rolesVariant}
                onSelect={(_event, value) => {
                  setRolesVariant(value as 'option1' | 'option2' | 'option3');
                  setIsRolesVariantDropdownOpen(false);
                }}
                toggle={(toggleRef) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setIsRolesVariantDropdownOpen(!isRolesVariantDropdownOpen)}
                    isExpanded={isRolesVariantDropdownOpen}
                    style={{ minWidth: '450px' }}
                  >
                    {rolesVariant === 'option1' ? 'Option 1 - Highlight 2 labels' : rolesVariant === 'option2' ? 'Option 2 - Display label on every role' : '[UXD recommended] Option 3 - Only show the labels and explanation when selecting roles'}
                  </MenuToggle>
                )}
              >
                <SelectList>
                  <SelectOption value="option1">Option 1 - Highlight 2 labels</SelectOption>
                  <SelectOption value="option2">Option 2 - Display label on every role</SelectOption>
                  <SelectOption value="option3">[UXD recommended] Option 3 - Only show the labels and explanation when selecting roles</SelectOption>
                </SelectList>
              </Select>
            </FlexItem>
          </Flex>
        </div>
      )}

      <div className="pf-v6-c-page__main-breadcrumb">
        <div style={{ padding: 'var(--pf-v5-global--spacer--lg) var(--pf-v5-global--spacer--lg)' }}>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/projects">Projects</Link>
            </BreadcrumbItem>
            <BreadcrumbItem isActive>{projectId}</BreadcrumbItem>
          </Breadcrumb>
        </div>
      </div>

      <PageSection>
        <Flex
          direction={{ default: 'row' }}
          alignItems={{ default: 'alignItemsCenter' }}
          justifyContent={{ default: 'justifyContentSpaceBetween' }}
        >
          <FlexItem>
            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
              <FlexItem>
                <div
                  style={{
                    display: 'inline-block',
                    width: '40px',
                    height: '40px',
                    padding: '4px',
                    borderRadius: '20px',
                    background: '#f2f2f2',
                    color: '#151515',
                  }}
                >
                  <svg
                    className="pf-v6-svg"
                    viewBox="0 0 36 36"
                    fill="currentColor"
                    aria-hidden="true"
                    role="img"
                    width="1em"
                    height="1em"
                    style={{ width: '32px', height: '32px' }}
                  >
                    <path d="M31,9.38H27.29l-.52-2.47a.62.62,0,0,0-.61-.49H18.84a.62.62,0,0,0-.61.49l-.52,2.47H8.21a.62.62,0,0,0-.62.62V25a.63.63,0,0,0,1.25,0V10.62h9.37a.61.61,0,0,0,.61-.49l.53-2.46h6.3l.53,2.46a.61.61,0,0,0,.61.49h3.59V28.38H5.62V10a.62.62,0,0,0-1.24,0V29a.62.62,0,0,0,.62.62H31a.62.62,0,0,0,.62-.62V10A.62.62,0,0,0,31,9.38Z"></path>
                  </svg>
                </div>
              </FlexItem>
              <FlexItem>
                <Title headingLevel="h1" size="2xl">
                  {projectId}
                </Title>
              </FlexItem>
              <FlexItem>
                <OutlinedQuestionCircleIcon style={{ color: 'var(--pf-v5-global--Color--200)' }} />
              </FlexItem>
            </Flex>
          </FlexItem>
          <FlexItem>
            <Dropdown
              isOpen={isActionsOpen}
              onSelect={() => setIsActionsOpen(false)}
              onOpenChange={(isOpen: boolean) => setIsActionsOpen(isOpen)}
              toggle={(toggleRef) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setIsActionsOpen(!isActionsOpen)}
                  isExpanded={isActionsOpen}
                  variant="secondary"
                >
                  Actions
                </MenuToggle>
              )}
            >
              <DropdownList>
                <DropdownItem key="edit">Edit project</DropdownItem>
                <DropdownItem key="delete">Delete project</DropdownItem>
              </DropdownList>
            </Dropdown>
          </FlexItem>
        </Flex>
      </PageSection>

      <PageSection type="tabs" padding={{ default: 'noPadding' }}>
        <Tabs
          activeKey={activeTabKey}
          onSelect={(_event, tabIndex) => setActiveTabKey(tabIndex)}
          aria-label="Project tabs"
          role="region"
        >
          <Tab eventKey="overview" title={<TabTitleText>Overview</TabTitleText>} />
          <Tab eventKey="workbenches" title={<TabTitleText>Workbenches</TabTitleText>} />
          <Tab eventKey="pipelines" title={<TabTitleText>Pipelines</TabTitleText>} />
          <Tab eventKey="deployments" title={<TabTitleText>Deployments</TabTitleText>} />
          <Tab eventKey="cluster-storage" title={<TabTitleText>Cluster storage</TabTitleText>} />
          <Tab eventKey="connections" title={<TabTitleText>Connections</TabTitleText>} />
          <Tab eventKey="permissions" title={<TabTitleText>Permissions</TabTitleText>} />
        </Tabs>
      </PageSection>

      <PageSection isFilled>
        {activeTabKey === 'permissions' && (
          <>
            <div className="pf-v6-l-stack__item" style={{ margin: '15px 0' }}>
              Add users and groups that can access the project.
            </div>

            {/* Toolbar */}
            <div style={{ marginBottom: 'var(--pf-v5-global--spacer--lg)' }}>
              <Toolbar id="permissions-toolbar">
                <ToolbarContent>
                  <ToolbarGroup variant="filter-group">
                    <ToolbarItem>
                      <Select
                        aria-label="Subject filter"
                        isOpen={isSubjectFilterOpen}
                        selected={subjectFilter}
                        onSelect={(_event, value) => {
                          setSubjectFilter(value as string);
                          setIsSubjectFilterOpen(false);
                        }}
                        onOpenChange={(isOpen) => setIsSubjectFilterOpen(isOpen)}
                        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                          <MenuToggle
                            ref={toggleRef}
                            onClick={() => setIsSubjectFilterOpen(!isSubjectFilterOpen)}
                            isExpanded={isSubjectFilterOpen}
                            style={{ minWidth: '150px' }}
                          >
                            {subjectFilter}
                          </MenuToggle>
                        )}
                        shouldFocusToggleOnSelect
                      >
                        <SelectList>
                          <SelectOption value="All subjects">All subjects</SelectOption>
                          <SelectOption value="Users">Users</SelectOption>
                          <SelectOption value="Groups">Groups</SelectOption>
                        </SelectList>
                      </Select>
                    </ToolbarItem>
                  </ToolbarGroup>
                  <ToolbarItem>
                    <Divider orientation={{ default: 'vertical' }} style={{ height: '32px', marginLeft: '0.5rem', marginRight: '0.5rem' }} />
                  </ToolbarItem>
                  <ToolbarGroup variant="filter-group">
                    <ToolbarItem>
                      <Select
                        aria-label="Name filter"
                        isOpen={isNameFilterOpen}
                        selected={nameFilter}
                        onSelect={(_event, value) => {
                          setNameFilter(value as string);
                          setIsNameFilterOpen(false);
                        }}
                        onOpenChange={(isOpen) => setIsNameFilterOpen(isOpen)}
                        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                          <MenuToggle
                            ref={toggleRef}
                            onClick={() => setIsNameFilterOpen(!isNameFilterOpen)}
                            isExpanded={isNameFilterOpen}
                            style={{ minWidth: '120px' }}
                          >
                            {nameFilter}
                          </MenuToggle>
                        )}
                        shouldFocusToggleOnSelect
                      >
                        <SelectList>
                          <SelectOption value="Name">Name</SelectOption>
                          <SelectOption value="Role">Role</SelectOption>
                          <SelectOption value="Date created">Date created</SelectOption>
                        </SelectList>
                      </Select>
                    </ToolbarItem>
                    <ToolbarItem>
                      <SearchInput
                        placeholder="Find by name"
                        value={searchValue}
                        onChange={(_event, value) => setSearchValue(value)}
                        onClear={() => setSearchValue('')}
                        aria-label="Find by name"
                      />
                    </ToolbarItem>
                  </ToolbarGroup>
                  <ToolbarItem>
                    <Button variant="primary" id="assign-roles-button" onClick={handleAssignRoles}>
                      Assign roles
                    </Button>
                  </ToolbarItem>
                </ToolbarContent>
              </Toolbar>
            </div>

            {/* Users Section */}
            <div className="pf-v6-l-stack__item" style={{ marginBottom: '24px' }}>
              <div className="pf-v6-l-stack pf-m-gutter">
                <div className="pf-v6-l-stack__item">
                  <div className="pf-v6-l-flex pf-m-row pf-m-align-items-center pf-m-gap-sm user">
                    <UserIconCircle />
                    <div>
                      <Title 
                        headingLevel="h2" 
                        size="xl"
                        id="user-permission-user"
                        className="pf-v6-c-title pf-m-xl"
                        data-ouia-component-type="PF6/Title"
                        data-ouia-safe="true"
                        data-ouia-component-id="OUIA-Generated-Title-1"
                      >
                        Users
                      </Title>
                    </div>
                  </div>
                </div>

                <div className="pf-v6-l-stack__item">
                  <Table 
                    aria-label="Users table" 
                    variant="compact"
                    className="pf-v6-c-table pf-m-grid-md pf-m-compact pf-m-animate-expand"
                    data-ouia-component-type="PF6/Table"
                    data-ouia-safe="true"
                    data-ouia-component-id="OUIA-Generated-Table-1"
                    data-testid="role-binding-table User"
                  >
                    <Thead className="pf-v6-c-table__thead pf-m-nowrap">
                      <Tr>
                        <Th sort={getUsersSortParams(0)} className="pf-v6-c-table__th pf-m-width-30">Name</Th>
                        <Th 
                          className="pf-v6-c-table__th pf-m-width-20"
                          info={rolesVariant === 'option1' || rolesVariant === 'option2' ? {
                            popover: (
                              <Content>
                                <Content component="small" className="pf-v6-c-content--small" style={{ color: 'var(--pf-t--global--text--color--regular)', marginBottom: '8px', display: 'block' }}>
                                  Roles with different labels come from different sources. The meanings of each label are defined as follows:
                                </Content>
                                <Content component="ul" className="pf-v6-c-content--ul" style={{ margin: '0px' }}>
                                  {rolesVariant === 'option2' && (
                                    <Content component="li" className="pf-v6-c-content--li">
                                      <Content component="small" className="pf-v6-c-content--small" style={{ color: 'var(--pf-t--global--text--color--regular)' }}>
                                        <strong>AI:</strong> Description
                                      </Content>
                                    </Content>
                                  )}
                                  <Content component="li" className="pf-v6-c-content--li">
                                    <Content component="small" className="pf-v6-c-content--small" style={{ color: 'var(--pf-t--global--text--color--regular)' }}>
                                      <strong>OpenShift default:</strong> Description
                                    </Content>
                                  </Content>
                                  <Content component="li" className="pf-v6-c-content--li">
                                    <Content component="small" className="pf-v6-c-content--small" style={{ color: 'var(--pf-t--global--text--color--regular)' }}>
                                      <strong>OpenShift custom:</strong> Description
                                    </Content>
                                  </Content>
                                </Content>
                              </Content>
                            ),
                            ariaLabel: 'Role labels help',
                            popoverProps: { headerContent: 'Role Labels' }
                          } : undefined}
                        >
                          Role
                        </Th>
                        <Th 
                          className="pf-v6-c-table__th pf-m-width-25"
                          sort={getUsersSortParams(2)}
                          info={{
                            popover: (
                              <Content>
                                <Content component="small" className="pf-v6-c-content--small" style={{ color: 'var(--pf-t--global--text--color--regular)' }}>
                                  Date when the role assignment was created.
                                </Content>
                              </Content>
                            ),
                            ariaLabel: 'Date created help',
                            popoverProps: { headerContent: 'Date created' }
                          }}
                        >
                          Date created
                        </Th>
                        <Th />
                      </Tr>
                    </Thead>
                    <Tbody>
                      {mockUsers.map((user) => (
                        user.roles.map((userRole, roleIndex) => (
                          <Tr key={`${user.id}-${roleIndex}`}>
                            {roleIndex === 0 && (
                              <Td 
                                dataLabel="Username" 
                                rowSpan={user.roles.length}
                              >
                                <p 
                                  data-ouia-component-type="PF6/Content"
                                  data-ouia-safe="true"
                                  data-pf-content="true"
                                  className="pf-v6-c-content--p"
                                >
                                  <span className="pf-v6-c-truncate">
                                    <span className="pf-v6-c-truncate__start">{user.name}</span>
                                  </span>
                                </p>
                              </Td>
                            )}
                            <Td 
                              dataLabel="Role"
                              style={roleIndex > 0 ? { paddingInlineStart: 'var(--pf-v6-c-table--cell--Padding--base)' } : undefined}
                            >
                              <p 
                                data-ouia-component-type="PF6/Content"
                                data-ouia-safe="true"
                                data-pf-content="true"
                                className="pf-v6-c-content--p"
                              >
                                {renderRoleBadge(userRole.role, userRole.roleType, 'User', user.name)}
                              </p>
                            </Td>
                            <Td 
                              dataLabel="Date created"
                              style={roleIndex > 0 ? { paddingInlineStart: 'var(--pf-v6-c-table--cell--Padding--base)' } : undefined}
                            >
                              <p 
                                data-ouia-component-type="PF6/Content"
                                data-ouia-safe="true"
                                data-pf-content="true"
                                className="pf-v6-c-content--p"
                              >
                                <div style={{ display: 'contents' }}>
                                  <span className="pf-v6-c-timestamp pf-m-help-text" tabIndex={0}>
                                    <time className="pf-v6-c-timestamp__text">{user.dateCreated}</time>
                                  </span>
                                </div>
                              </p>
                            </Td>
                            <Td 
                              isActionCell 
                              className="pf-v6-c-table__td pf-v6-c-table__action pf-m-nowrap" 
                              style={{ textAlign: 'right' }}
                            >
                              <Dropdown
                                isOpen={openKebabMenus.has(`user-${user.id}-${roleIndex}`)}
                                onSelect={() => toggleKebabMenu(`user-${user.id}-${roleIndex}`)}
                                onOpenChange={(isOpen: boolean) => {
                                  if (!isOpen) {
                                    toggleKebabMenu(`user-${user.id}-${roleIndex}`);
                                  }
                                }}
                                toggle={(toggleRef) => (
                                  <MenuToggle
                                    ref={toggleRef}
                                    aria-label="Kebab toggle"
                                    variant="plain"
                                    onClick={() => toggleKebabMenu(`user-${user.id}-${roleIndex}`)}
                                    isExpanded={openKebabMenus.has(`user-${user.id}-${roleIndex}`)}
                                    className="pf-v6-c-menu-toggle pf-m-plain"
                                  >
                                    <EllipsisVIcon />
                                  </MenuToggle>
                                )}
                              >
                                <DropdownList>
                                  <DropdownItem 
                                    key="edit" 
                                    onClick={() => {
                                      handleEditUser(user.id, user.name);
                                      toggleKebabMenu(`user-${user.id}-${roleIndex}`);
                                    }}
                                  >
                                    Manage roles
                                  </DropdownItem>
                                  <DropdownItem key="remove">Unassign</DropdownItem>
                                </DropdownList>
                              </Dropdown>
                            </Td>
                          </Tr>
                        ))
                      ))}
                    </Tbody>
                  </Table>
                </div>
              </div>
            </div>

            {/* Groups Section */}
            <div className="pf-v6-l-stack__item">
              <div className="pf-v6-l-stack pf-m-gutter">
                <div className="pf-v6-l-stack__item">
                  <div className="pf-v6-l-flex pf-m-row pf-m-align-items-center pf-m-gap-sm user">
                    <GroupIconCircle />
                    <div>
                      <Title 
                        headingLevel="h2" 
                        size="xl"
                        id="user-permission-group"
                        className="pf-v6-c-title pf-m-xl"
                        data-ouia-component-type="PF6/Title"
                        data-ouia-safe="true"
                        data-ouia-component-id="OUIA-Generated-Title-2"
                      >
                        Groups
                      </Title>
                    </div>
                  </div>
                </div>

                <div className="pf-v6-l-stack__item">
                  <Table 
                    aria-label="Groups table" 
                    variant="compact"
                    className="pf-v6-c-table pf-m-grid-md pf-m-compact pf-m-animate-expand"
                    data-ouia-component-type="PF6/Table"
                    data-ouia-safe="true"
                    data-ouia-component-id="OUIA-Generated-Table-2"
                    data-testid="role-binding-table Group"
                  >
                    <Thead className="pf-v6-c-table__thead pf-m-nowrap">
                      <Tr>
                        <Th sort={getGroupsSortParams(0)} className="pf-v6-c-table__th pf-m-width-30">Name</Th>
                        <Th 
                          className="pf-v6-c-table__th pf-m-width-20"
                          info={rolesVariant === 'option1' || rolesVariant === 'option2' ? {
                            popover: (
                              <Content>
                                <Content component="small" className="pf-v6-c-content--small" style={{ color: 'var(--pf-t--global--text--color--regular)', marginBottom: '8px', display: 'block' }}>
                                  Roles with different labels come from different sources. The meanings of each label are defined as follows:
                                </Content>
                                <Content component="ul" className="pf-v6-c-content--ul" style={{ margin: '0px' }}>
                                  {rolesVariant === 'option2' && (
                                    <Content component="li" className="pf-v6-c-content--li">
                                      <Content component="small" className="pf-v6-c-content--small" style={{ color: 'var(--pf-t--global--text--color--regular)' }}>
                                        <strong>AI:</strong> Description
                                      </Content>
                                    </Content>
                                  )}
                                  <Content component="li" className="pf-v6-c-content--li">
                                    <Content component="small" className="pf-v6-c-content--small" style={{ color: 'var(--pf-t--global--text--color--regular)' }}>
                                      <strong>OpenShift default:</strong> Description
                                    </Content>
                                  </Content>
                                  <Content component="li" className="pf-v6-c-content--li">
                                    <Content component="small" className="pf-v6-c-content--small" style={{ color: 'var(--pf-t--global--text--color--regular)' }}>
                                      <strong>OpenShift custom:</strong> Description
                                    </Content>
                                  </Content>
                                </Content>
                              </Content>
                            ),
                            ariaLabel: 'Role labels help',
                            popoverProps: { headerContent: 'Role Labels' }
                          } : undefined}
                        >
                          Role
                        </Th>
                        <Th 
                          className="pf-v6-c-table__th pf-m-width-25"
                          sort={getGroupsSortParams(2)}
                          info={{
                            popover: (
                              <Content>
                                <Content component="small" className="pf-v6-c-content--small" style={{ color: 'var(--pf-t--global--text--color--regular)' }}>
                                  Date when the role assignment was created.
                                </Content>
                              </Content>
                            ),
                            ariaLabel: 'Date created help',
                            popoverProps: { headerContent: 'Date created' }
                          }}
                        >
                          Date created
                        </Th>
                        <Th />
                      </Tr>
                    </Thead>
                    <Tbody>
                      {mockGroups.map((group) => (
                        group.roles.map((groupRole, roleIndex) => (
                          <Tr key={`${group.id}-${roleIndex}`}>
                            {roleIndex === 0 && (
                              <Td 
                                dataLabel="Name" 
                                rowSpan={group.roles.length}
                              >
                                <p 
                                  data-ouia-component-type="PF6/Content"
                                  data-ouia-safe="true"
                                  data-pf-content="true"
                                  className="pf-v6-c-content--p"
                                >
                                  <span className="pf-v6-c-truncate">
                                    <span className="pf-v6-c-truncate__start">{group.name}</span>
                                  </span>
                                </p>
                              </Td>
                            )}
                            <Td 
                              dataLabel="Role"
                              style={roleIndex > 0 ? { paddingInlineStart: 'var(--pf-v6-c-table--cell--Padding--base)' } : undefined}
                            >
                              <p 
                                data-ouia-component-type="PF6/Content"
                                data-ouia-safe="true"
                                data-pf-content="true"
                                className="pf-v6-c-content--p"
                              >
                                {renderRoleBadge(groupRole.role, groupRole.roleType, 'Group', group.name)}
                              </p>
                            </Td>
                            <Td 
                              dataLabel="Date created"
                              style={roleIndex > 0 ? { paddingInlineStart: 'var(--pf-v6-c-table--cell--Padding--base)' } : undefined}
                            >
                              <p 
                                data-ouia-component-type="PF6/Content"
                                data-ouia-safe="true"
                                data-pf-content="true"
                                className="pf-v6-c-content--p"
                              >
                                <div style={{ display: 'contents' }}>
                                  <span className="pf-v6-c-timestamp pf-m-help-text" tabIndex={0}>
                                    <time className="pf-v6-c-timestamp__text">{group.dateCreated}</time>
                                  </span>
                                </div>
                              </p>
                            </Td>
                            <Td 
                              isActionCell 
                              className="pf-v6-c-table__td pf-v6-c-table__action pf-m-nowrap" 
                              style={{ textAlign: 'right' }}
                            >
                              <Dropdown
                                isOpen={openKebabMenus.has(`group-${group.id}-${roleIndex}`)}
                                onSelect={() => toggleKebabMenu(`group-${group.id}-${roleIndex}`)}
                                onOpenChange={(isOpen: boolean) => {
                                  if (!isOpen) {
                                    toggleKebabMenu(`group-${group.id}-${roleIndex}`);
                                  }
                                }}
                                toggle={(toggleRef) => (
                                  <MenuToggle
                                    ref={toggleRef}
                                    aria-label="Kebab toggle"
                                    variant="plain"
                                    onClick={() => toggleKebabMenu(`group-${group.id}-${roleIndex}`)}
                                    isExpanded={openKebabMenus.has(`group-${group.id}-${roleIndex}`)}
                                    className="pf-v6-c-menu-toggle pf-m-plain"
                                  >
                                    <EllipsisVIcon />
                                  </MenuToggle>
                                )}
                              >
                                <DropdownList>
                                  <DropdownItem 
                                    key="edit" 
                                    onClick={() => {
                                      handleEditGroup(group.id, group.name);
                                      toggleKebabMenu(`group-${group.id}-${roleIndex}`);
                                    }}
                                  >
                                    Manage roles
                                  </DropdownItem>
                                  <DropdownItem key="remove">Unassign</DropdownItem>
                                </DropdownList>
                              </Dropdown>
                            </Td>
                          </Tr>
                        ))
                      ))}
                    </Tbody>
                  </Table>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTabKey !== 'permissions' && (
          <div>Content for {activeTabKey} tab</div>
        )}
      </PageSection>

      {/* Role Details Modal */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        variant="large"
        aria-labelledby="role-details-modal-title"
      >
        <ModalHeader
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span id="role-details-modal-title">{selectedRole?.name}</span>
              {selectedRole && renderModalHeaderRoleTypeLabels(selectedRole.name, selectedRole.roleType)}
            </div>
          }
          description="Edit the project and manage user access"
        />
        <ModalBody>
          <Tabs
            activeKey={roleModalTabKey}
            onSelect={(_event, tabIndex) => setRoleModalTabKey(tabIndex)}
            aria-label="Role details tabs"
          >
            <Tab eventKey={0} title={<TabTitleText>Role details</TabTitleText>}>
              <div style={{ marginTop: '24px' }}>
                <div style={{ marginBottom: 'var(--pf-v5-global--spacer--md)' }}>
                  <div style={{ marginBottom: 'var(--pf-v5-global--spacer--xs)' }}>
                    <label className="pf-v6-c-form__label">
                      <span className="pf-v6-c-form__label-text" style={{ fontWeight: 600 }}>Role name</span>
                      <OutlinedQuestionCircleIcon style={{ marginLeft: '8px', color: 'var(--pf-v5-global--Color--200)' }} />
                    </label>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ClipboardCopy
                      hoverTip="Copy"
                      clickTip="Copied"
                      isReadOnly
                      variant="inline-compact"
                    >
                      {selectedRole?.name || ''}
                    </ClipboardCopy>
                    {selectedRole?.roleType === 'openshift-default' && (
                      <Label color="purple" variant="outline">Cluster role</Label>
                    )}
                  </div>
                </div>

                <div style={{ marginBottom: 'var(--pf-v5-global--spacer--xs)', marginTop: '16px' }}>
                  <label className="pf-v6-c-form__label">
                    <span className="pf-v6-c-form__label-text" style={{ fontWeight: 600 }}>Rules</span>
                  </label>
                </div>
                <Table variant="compact" aria-label="Role permissions table">
                  <Thead>
                    <Tr>
                      <Th>Actions</Th>
                      <Th>API groups</Th>
                      <Th>Resources</Th>
                      <Th>
                        Resource names
                        <OutlinedQuestionCircleIcon style={{ marginLeft: 'var(--pf-v5-global--spacer--xs)', color: 'var(--pf-v5-global--Color--200)' }} />
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {selectedRole && getRoleRules(selectedRole.name).map((rule, index) => (
                      <Tr key={index}>
                        <Td>{rule.actions}</Td>
                        <Td>{rule.apiGroups}</Td>
                        <Td>{rule.resources}</Td>
                        <Td>{rule.resourceNames}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                {selectedRole && getRoleRules(selectedRole.name).length > 10 && (
                  <div style={{ marginTop: 'var(--pf-v5-global--spacer--md)' }}>
                    <Button variant="link" isInline>
                      View more
                    </Button>
                    <span style={{ marginLeft: 'var(--pf-v5-global--spacer--sm)', color: 'var(--pf-v5-global--Color--200)' }}>
                      Showing 10/{getRoleRules(selectedRole.name).length}
                    </span>
                  </div>
                )}
              </div>
            </Tab>
            <Tab eventKey={1} title={<TabTitleText>Assignees</TabTitleText>}>
              <div style={{ marginTop: '24px' }}>
                <Table variant="compact" aria-label="Role assignees table">
                  <Thead>
                    <Tr>
                      <Th sort={getAssigneesSortParams(0)}>
                        Subject
                      </Th>
                      <Th sort={getAssigneesSortParams(1)}>
                        Subject kind
                      </Th>
                      <Th sort={getAssigneesSortParams(2)}>
                        Role binding
                      </Th>
                      <Th 
                        sort={getAssigneesSortParams(3)}
                        info={{
                          popover: (
                            <Content>
                              <Content component="small" className="pf-v6-c-content--small" style={{ color: 'var(--pf-t--global--text--color--regular)' }}>
                                Date when the role assignment was created.
                              </Content>
                            </Content>
                          ),
                          ariaLabel: 'Date created help',
                          popoverProps: { headerContent: 'Date created' }
                        }}
                      >
                        Date created
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {selectedRole && getSortedAssignees(getRoleAssignees(selectedRole.name)).map((assignee, index) => (
                      <Tr key={index}>
                        <Td>{assignee.subject}</Td>
                        <Td>{assignee.subjectType}</Td>
                        <Td>{assignee.roleBinding}</Td>
                        <Td>{assignee.dateCreated}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </div>
            </Tab>
          </Tabs>
        </ModalBody>
      </Modal>

      {/* Comparison Modal */}
      <Modal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        variant="medium"
        aria-labelledby="comparison-modal-title"
      >
        <ModalHeader
          title="Role assignment flow comparison"
        />
        <ModalBody>
          <Alert
            variant={AlertVariant.info}
            isInline
            title="This is not an actual step of the flow. Please select the options below to walk through the designs, and share your feedback or suggestions. Any inputs are greatly appreciated."
            style={{ marginBottom: '24px' }}
          />
          <div style={{ backgroundColor: '#f0e6ff', padding: '16px', marginBottom: 'var(--pf-v5-global--spacer--md)' }}>
            <Flex spaceItems={{ default: 'spaceItemsMd' }}>
              <Card
                id="option1-card"
                isSelectable
                isSelected={selectedAssignOption === 'option1'}
                onClick={() => setSelectedAssignOption('option1')}
                style={{ cursor: 'pointer', flex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <CardHeader
                  selectableActions={{
                    selectableActionId: 'option1-checkbox',
                    selectableActionAriaLabel: 'Select Option 1 [UXD recommended]',
                    name: 'assign-option',
                    isChecked: selectedAssignOption === 'option1',
                    onChange: () => setSelectedAssignOption('option1'),
                  }}
                >
                  <CardTitle>
                    <Title headingLevel="h2" size="lg">Option 1</Title>
                    <div style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)', marginTop: '4px' }}>
                      [UXD recommended]
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardBody style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Content style={{ marginBottom: 'var(--pf-v5-global--spacer--md)' }}>
                    Both the subject and roles selectors exist on the same form.
                  </Content>
                  <div style={{ marginBottom: '8px' }}>
                    <Title headingLevel="h3" size="md" style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>Pros:</Title>
                    <List>
                      <ListItem>Everything happens in one place, which is efficient for experienced users.</ListItem>
                      <ListItem>Fewer steps and fewer page transitions.</ListItem>
                      <ListItem>Users can quickly change inputs and see the effect.</ListItem>
                    </List>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Title headingLevel="h3" size="md" style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>Cons:</Title>
                    <List>
                      <ListItem>Changing the subject clears previously selected roles, which may surprise users.</ListItem>
                      <ListItem>Requires managing multi-step state and navigation.</ListItem>
                    </List>
                  </div>
                </CardBody>
              </Card>
              <Card
                id="option2-card"
                isSelectable
                isSelected={selectedAssignOption === 'option2'}
                onClick={() => setSelectedAssignOption('option2')}
                style={{ cursor: 'pointer', flex: 1, height: '100%', display: 'none', flexDirection: 'column' }}
              >
                <CardHeader
                  selectableActions={{
                    selectableActionId: 'option2-checkbox',
                    selectableActionAriaLabel: 'Select Option 2',
                    name: 'assign-option',
                    isChecked: selectedAssignOption === 'option2',
                    onChange: () => setSelectedAssignOption('option2'),
                  }}
                >
                  <CardTitle>
                    <Title headingLevel="h2" size="lg">Option 2</Title>
                  </CardTitle>
                </CardHeader>
                <CardBody style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Content style={{ marginBottom: 'var(--pf-v5-global--spacer--md)' }}>
                    The process is split into 2 distinct steps to select subject and roles separately.
                  </Content>
                  <div style={{ marginBottom: '8px' }}>
                    <Title headingLevel="h3" size="md" style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>Pros:</Title>
                    <List>
                      <ListItem>Subject is locked in the role selection step, avoiding accidental loss of selected roles.</ListItem>
                      <ListItem>The user focuses on one task at a time: first 'who', then 'what'.</ListItem>
                      <ListItem>Adding constraints reduces the risk of assigning permissions to the wrong subject.</ListItem>
                    </List>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Title headingLevel="h3" size="md" style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>Cons:</Title>
                    <List>
                      <ListItem>If the wrong subject was selected, the user must exit and restart the flow.</ListItem>
                      <ListItem>Requires managing multi-step state and navigation.</ListItem>
                    </List>
                  </div>
                </CardBody>
              </Card>
            </Flex>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 'var(--pf-v5-global--spacer--sm)', marginTop: '24px' }}>
            <Button
              variant="primary"
              onClick={() => {
                if (selectedAssignOption === 'option1') {
                  // Navigate to existing Assign roles page
                  navigate(`/projects/${projectId}/permissions/assign-roles`);
                  setIsComparisonModalOpen(false);
                } else if (selectedAssignOption === 'option2') {
                  // Show Option 2 modal
                  setIsComparisonModalOpen(false);
                  setIsOption2ModalOpen(true);
                }
              }}
              isDisabled={!selectedAssignOption}
            >
              Go to the real flow
            </Button>
            <Button
              variant="link"
              onClick={() => {
                setIsComparisonModalOpen(false);
                setSelectedAssignOption(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </ModalBody>
      </Modal>

      {/* Option 2 Modal - Select Subject */}
      <Modal
        isOpen={isOption2ModalOpen}
        onClose={() => {
          setIsOption2ModalOpen(false);
          setOption2SelectedSubject(undefined);
          setOption2SubjectType('User');
        }}
        variant="medium"
        aria-labelledby="option2-modal-title"
      >
        <ModalHeader
          title="Assign role"
        />
        <ModalBody>
          <Content style={{ marginBottom: '24px' }}>
            Select the subject first.
          </Content>
          <Form>
            <FormGroup 
              label="Subject kind"
              fieldId="option2-subject-kind"
            >
              <Flex spaceItems={{ default: 'spaceItemsLg' }}>
                <Radio
                  id="option2-subject-type-user"
                  name="option2-subject-type"
                  label="User"
                  isChecked={option2SubjectType === 'User'}
                  onChange={() => {
                    setOption2SubjectType('User');
                    setOption2SelectedSubject(undefined);
                    setOption2TypeaheadInputValue('');
                  }}
                />
                <Radio
                  id="option2-subject-type-group"
                  name="option2-subject-type"
                  label="Group"
                  isChecked={option2SubjectType === 'Group'}
                  onChange={() => {
                    setOption2SubjectType('Group');
                    setOption2SelectedSubject(undefined);
                    setOption2TypeaheadInputValue('');
                  }}
                />
              </Flex>
            </FormGroup>

            <FormGroup 
              label={
                <span>
                  {option2SubjectType === 'User' ? 'User name' : 'Group name'}
                  <span style={{ color: 'var(--pf-v5-global--danger-color--100)' }}> *</span>
                </span>
              } 
              fieldId="option2-subject-name"
            >
              <TypeaheadSelect
                key={`${option2SubjectType}-${option2SelectedSubject || 'none'}`}
                initialOptions={option2TypeaheadOptions}
                placeholder={`Select ${option2SubjectType.toLowerCase()}`}
                noOptionsFoundMessage={(filter) => `No ${option2SubjectType.toLowerCase()} was found for "${filter}"`}
                createOptionMessage={(newValue) => `Assign role to "${newValue}"`}
                onInputChange={(value) => {
                  setOption2TypeaheadInputValue(value || '');
                }}
                onClearSelection={() => {
                  setOption2SelectedSubject(undefined);
                  setOption2TypeaheadInputValue('');
                }}
                onSelect={(_ev, selection) => {
                  let selectedValue = String(selection);
                  // Skip group header selections
                  if (selectedValue.startsWith('__group_header_')) {
                    return;
                  }
                  // If the selection is a create option (starts with "Assign role to"), extract just the value
                  if (selectedValue.startsWith('Assign role to "') && selectedValue.endsWith('"')) {
                    selectedValue = selectedValue.slice('Assign role to "'.length, -1);
                  }
                  // Clear the input value so the dropdown shows the selected value, not the input
                  setOption2TypeaheadInputValue('');
                  setOption2SelectedSubject(selectedValue);
                  // If it's a new subject (not in the list), it will be created when saved
                }}
                isCreatable={false}
              />
              <HelperText>
                <HelperTextItem>
                  {option2SubjectType === 'User' 
                    ? 'Only users that have already been assigned roles appear in the dropdown. To add a new user, type their username.'
                    : 'Only groups that have already been assigned roles appear in the dropdown. To add a new group, type their group name.'}
                </HelperTextItem>
              </HelperText>
            </FormGroup>
          </Form>
          <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 'var(--pf-v5-global--spacer--sm)', marginTop: '24px' }}>
            <Button
              variant="primary"
              onClick={() => {
                if (option2SelectedSubject) {
                  // Navigate to Assign roles page with read-only subject
                  navigate(`/projects/${projectId}/permissions/assign-roles?option=2&subjectType=${option2SubjectType}&subjectName=${encodeURIComponent(option2SelectedSubject)}`);
                  setIsOption2ModalOpen(false);
                  setOption2SelectedSubject(undefined);
                  setOption2SubjectType('User');
                  setOption2TypeaheadInputValue('');
                }
              }}
              isDisabled={!option2SelectedSubject}
            >
              Assign role
            </Button>
            <Button
              variant="link"
              onClick={() => {
                setIsOption2ModalOpen(false);
                setOption2SelectedSubject(undefined);
                setOption2SubjectType('User');
                setOption2TypeaheadInputValue('');
              }}
            >
              Cancel
            </Button>
          </div>
        </ModalBody>
      </Modal>

    </>
  );
};

export { ProjectDetail };

