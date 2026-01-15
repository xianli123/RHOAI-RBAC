import * as React from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { updateUserRoles, updateGroupRoles, mockUsers, mockGroups } from './sharedPermissionsData';
import { TypeaheadSelect, TypeaheadSelectOption } from '@patternfly/react-templates';
import {
  PageSection,
  Title,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Checkbox,
  Flex,
  FlexItem,
  Label,
  Stack,
  StackItem,
  Alert,
  AlertVariant,
  Radio,
  Form,
  FormGroup,
  Content,
  HelperText,
  HelperTextItem,
  SearchInput,
  Modal,
  ModalHeader,
  ModalBody,
  Popover,
} from '@patternfly/react-core';
import {
  OutlinedQuestionCircleIcon,
} from '@patternfly/react-icons';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  ISortBy,
} from '@patternfly/react-table';

interface Role {
  id: string;
  name: string;
  description: string;
  roleType: 'openshift-default' | 'openshift-custom' | 'regular';
  originallyAssigned: boolean;
  currentlyAssigned: boolean;
  rules?: RoleRule[];
}

interface RoleRule {
  actions: string[];
  apiGroups: string[];
  resources: string[];
  resourceNames?: string[];
}

// All available roles (same as EditRolesPage)
const mockAvailableRoles: Role[] = [
  {
    id: '1',
    name: 'custom-pipeline-super-user',
    description: 'Custom OpenShift role with pipeline super user permissions.',
    roleType: 'openshift-custom',
    originallyAssigned: false,
    currentlyAssigned: false,
    rules: [
      {
        actions: ['create', 'delete', 'get', 'list', 'patch', 'update', 'watch'],
        apiGroups: ['tekton.dev'],
        resources: ['Pipelines'],
        resourceNames: undefined,
      },
    ],
  },
  {
    id: '2',
    name: 'Deployment maintainer',
    description: 'User can view and manage all model deployments.',
    roleType: 'regular',
    originallyAssigned: false,
    currentlyAssigned: false,
    rules: [
      {
        actions: ['create', 'delete', 'deletecollection', 'get', 'list', 'patch', 'update', 'watch'],
        apiGroups: ['api.groups.name'],
        resources: ['ModelDeployments'],
        resourceNames: undefined,
      },
      {
        actions: ['get', 'list', 'patch'],
        apiGroups: ['api.groups.name.aa'],
        resources: ['Project'],
        resourceNames: ['project name'],
      },
    ],
  },
  {
    id: '3',
    name: 'Deployment reader',
    description: 'User can view and open model deployments without modifying their configuration.',
    roleType: 'regular',
    originallyAssigned: false,
    currentlyAssigned: false,
    rules: [
      {
        actions: ['get', 'list', 'watch'],
        apiGroups: ['api.groups.name'],
        resources: ['ModelDeployments'],
        resourceNames: undefined,
      },
    ],
  },
  {
    id: '4',
    name: 'Workbench maintainer',
    description: 'User can view and manage all workbenches. Applies to all workbenches.',
    roleType: 'regular',
    originallyAssigned: false,
    currentlyAssigned: false,
    rules: [
      {
        actions: ['create', 'delete', 'deletecollection', 'get', 'list', 'patch', 'update', 'watch'],
        apiGroups: ['api.groups.name'],
        resources: ['Workbenches'],
        resourceNames: undefined,
      },
      {
        actions: ['get', 'list', 'patch'],
        apiGroups: ['api.groups.name.aa'],
        resources: ['Project'],
        resourceNames: ['project name'],
      },
    ],
  },
  {
    id: '5',
    name: 'Workbench reader',
    description: 'User can view and open workbenches without modifying their configuration.',
    roleType: 'regular',
    originallyAssigned: false,
    currentlyAssigned: false,
    rules: [
      {
        actions: ['get', 'list', 'watch'],
        apiGroups: ['api.groups.name'],
        resources: ['Workbenches'],
        resourceNames: undefined,
      },
    ],
  },
  {
    id: '6',
    name: 'Workbench updater',
    description: 'User can view workbenches and modify their configuration, but cannot create or delete them.',
    roleType: 'regular',
    originallyAssigned: false,
    currentlyAssigned: false,
    rules: [
      {
        actions: ['get', 'list', 'patch', 'update', 'watch'],
        apiGroups: ['api.groups.name'],
        resources: ['Workbenches'],
        resourceNames: undefined,
      },
    ],
  },
  {
    id: '7',
    name: 'Admin',
    description: 'User can edit the project and manage user access. User can view and manage any project resource.',
    roleType: 'openshift-default',
    originallyAssigned: false,
    currentlyAssigned: false,
    rules: [
      {
        actions: ['create', 'delete', 'deletecollection', 'get', 'list', 'patch', 'update', 'watch'],
        apiGroups: ['*'],
        resources: ['*'],
        resourceNames: undefined,
      },
    ],
  },
  {
    id: '8',
    name: 'Contributor',
    description: 'User can view and manage any project resource. Users with this role can manage all resources in the namespace, including workbenches, model deployments, and cluster storage, except for permissions controlling.',
    roleType: 'openshift-default',
    originallyAssigned: false,
    currentlyAssigned: false,
    rules: [
      {
        actions: ['create', 'delete', 'get', 'list', 'patch', 'update', 'watch'],
        apiGroups: ['api.groups.name'],
        resources: ['Workbenches', 'ModelDeployments', 'Pipelines'],
        resourceNames: undefined,
      },
    ],
  },
  {
    id: '9',
    name: 'Deployment updater',
    description: 'User can view model deployments and update existing deployments.',
    roleType: 'regular',
    originallyAssigned: false,
    currentlyAssigned: false,
    rules: [
      {
        actions: ['get', 'list', 'patch', 'update', 'watch'],
        apiGroups: ['api.groups.name'],
        resources: ['ModelDeployments'],
        resourceNames: undefined,
      },
    ],
  },
  {
    id: '10',
    name: 'Pipeline maintainer',
    description: 'User can view and manage all pipelines.',
    roleType: 'regular',
    originallyAssigned: false,
    currentlyAssigned: false,
    rules: [
      {
        actions: ['create', 'delete', 'deletecollection', 'get', 'list', 'patch', 'update', 'watch'],
        apiGroups: ['tekton.dev'],
        resources: ['Pipelines'],
        resourceNames: undefined,
      },
    ],
  },
  {
    id: '11',
    name: 'Pipeline updater',
    description: 'User can view pipelines and modify their configuration, but cannot create or delete them.',
    roleType: 'regular',
    originallyAssigned: false,
    currentlyAssigned: false,
    rules: [
      {
        actions: ['get', 'list', 'patch', 'update', 'watch'],
        apiGroups: ['tekton.dev'],
        resources: ['Pipelines'],
        resourceNames: undefined,
      },
    ],
  },
  {
    id: '12',
    name: 'Pipeline reader',
    description: 'User can view and open pipelines without modifying their configuration.',
    roleType: 'regular',
    originallyAssigned: false,
    currentlyAssigned: false,
    rules: [
      {
        actions: ['get', 'list', 'watch'],
        apiGroups: ['tekton.dev'],
        resources: ['Pipelines'],
        resourceNames: undefined,
      },
    ],
  },
];

const RoleAssignmentPage: React.FunctionComponent = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Check if this is Option 2 flow (read-only subject)
  const isOption2 = searchParams.get('option') === '2';
  const option2SubjectType = searchParams.get('subjectType') as 'User' | 'Group' | null;
  const option2SubjectName = searchParams.get('subjectName');
  
  const [subjectType, setSubjectType] = React.useState<'User' | 'Group'>(
    isOption2 && option2SubjectType ? option2SubjectType : 'User'
  );
  const [selectedSubject, setSelectedSubject] = React.useState<string | undefined>(
    isOption2 && option2SubjectName ? decodeURIComponent(option2SubjectName) : undefined
  );
  const [roles, setRoles] = React.useState<Role[]>(mockAvailableRoles.map(role => ({ 
    ...role, 
    originallyAssigned: false, 
    currentlyAssigned: false 
  })));
  const [roleNameSortBy, setRoleNameSortBy] = React.useState<ISortBy>({
    index: 1,
    direction: 'asc',
  });
  const [option2StatusSortBy, setOption2StatusSortBy] = React.useState<ISortBy>({
    index: 4,
    direction: 'asc',
  });
  const [option2ActiveSort, setOption2ActiveSort] = React.useState<'roleName' | 'status'>('roleName');
  const [searchValue, setSearchValue] = React.useState('');
  const [isRoleModalOpen, setIsRoleModalOpen] = React.useState(false);
  const [selectedRoleForModal, setSelectedRoleForModal] = React.useState<Role | null>(null);
  const [rulesSortBy, setRulesSortBy] = React.useState<ISortBy>({
    index: 0,
    direction: 'asc',
  });
  const [rulesPageSize, setRulesPageSize] = React.useState(10);
  const [openPopovers, setOpenPopovers] = React.useState<Set<string>>(new Set());
  const [typeaheadInputValue, setTypeaheadInputValue] = React.useState<string>('');

  // Get available subjects based on type
  const getAvailableSubjects = (): string[] => {
    if (subjectType === 'User') {
      return mockUsers.map(u => u.name);
    } else {
      return mockGroups.map(g => g.name);
    }
  };

  // Create typeahead options
  const typeaheadOptions = React.useMemo<TypeaheadSelectOption[]>(() => {
    const subjects = getAvailableSubjects();
    const groupHeader = subjectType === 'User' ? 'Users with existing assignment' : 'Groups with existing assignment';
    const options: TypeaheadSelectOption[] = [];
    
    // Filter subjects based on input value
    const filteredSubjects = typeaheadInputValue && typeaheadInputValue.trim()
      ? subjects.filter(subject => 
          subject.toLowerCase().includes(typeaheadInputValue.toLowerCase())
        )
      : subjects;
    
    // If there's input, add create option first
    if (typeaheadInputValue && typeaheadInputValue.trim()) {
      options.push({
        content: `Assign role to "${typeaheadInputValue}"`,
        value: `Assign role to "${typeaheadInputValue}"`,
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
        selected: subject === selectedSubject,
      })));
    }
    
    // If selectedSubject is set and not in the existing subjects, add it to options so it displays correctly
    if (selectedSubject && !subjects.includes(selectedSubject)) {
      // Check if it's not already in options
      const alreadyInOptions = options.some(opt => opt.value === selectedSubject);
      if (!alreadyInOptions) {
        options.push({
          content: selectedSubject,
          value: selectedSubject,
          selected: true,
        });
      }
    }
    
    return options;
  }, [subjectType, selectedSubject, typeaheadInputValue]);

  // Reset when subject kind changes (only if not Option 2)
  React.useEffect(() => {
    if (!isOption2) {
      setSelectedSubject(undefined);
    setSearchValue('');
      setRoles(mockAvailableRoles.map(role => ({ 
        ...role, 
        originallyAssigned: false, 
        currentlyAssigned: false 
      })));
    }
  }, [subjectType, isOption2]);

  // Initialize roles when subject is selected
  React.useEffect(() => {
    if (selectedSubject) {
      // Get subject's current roles from shared data
      let subjectRoles: string[] = [];
      let isExistingSubject = false;
      if (subjectType === 'User') {
        const user = mockUsers.find(u => u.name === selectedSubject);
        isExistingSubject = !!user;
        subjectRoles = user?.roles.map(r => r.role) || [];
      } else {
        const group = mockGroups.find(g => g.name === selectedSubject);
        isExistingSubject = !!group;
        subjectRoles = group?.roles.map(r => r.role) || [];
      }
      
      // Check if subject has any OpenShift custom roles
      const hasOpenShiftCustomRole = subjectRoles.some(roleName => {
        const role = mockAvailableRoles.find(r => r.name === roleName);
        return role?.roleType === 'openshift-custom';
      });
      
      // Filter out OpenShift custom roles if subject is new or doesn't have any OpenShift custom roles
      const filteredRoles = (!isExistingSubject || !hasOpenShiftCustomRole)
        ? mockAvailableRoles.filter(role => role.roleType !== 'openshift-custom')
        : mockAvailableRoles;
      
      setRoles(filteredRoles.map(role => {
        const isAssigned = subjectRoles.includes(role.name);
        return {
          ...role,
          originallyAssigned: isAssigned,
          currentlyAssigned: isAssigned,
        };
      }));
    } else {
      setRoles(mockAvailableRoles.map(role => ({ 
        ...role, 
        originallyAssigned: false, 
        currentlyAssigned: false 
      })));
    }
  }, [selectedSubject, subjectType]);

  const handleRoleToggle = (roleId: string) => {
    setRoles((prev) =>
      prev.map((role) =>
        role.id === roleId ? { ...role, currentlyAssigned: !role.currentlyAssigned } : role
      )
    );
  };

  const getRoleStatus = (role: Role): string => {
    if (role.currentlyAssigned && role.originallyAssigned) {
      return 'Currently assigned';
    } else if (role.currentlyAssigned && !role.originallyAssigned) {
      return 'To be assigned';
    } else if (!role.currentlyAssigned && role.originallyAssigned) {
      return 'To be unassigned';
    }
    return '---';
  };

  const getStatusPriority = (status: string): number => {
    if (status === 'Currently assigned') return 1;
    if (status === 'To be assigned') return 2;
    if (status === 'To be unassigned') return 3;
    return 4; // '---'
  };

  const getFilteredRoles = (): Role[] => {
    if (!searchValue) return roles;
    return roles.filter((role) =>
      role.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  const getSortedRoles = (): Role[] => {
    const filtered = getFilteredRoles();
    return filtered.sort((a, b) => {
      if (option2ActiveSort === 'status') {
        const statusA = getRoleStatus(a);
        const statusB = getRoleStatus(b);
        
        // Special handling: "To be unassigned" roles maintain their alphabetical order
        // Treat them as priority 1 (same as "Currently assigned") but keep their relative order
        const isUnassignedA = statusA === 'To be unassigned';
        const isUnassignedB = statusB === 'To be unassigned';
        
        // If both are "To be unassigned", maintain alphabetical order
        if (isUnassignedA && isUnassignedB) {
          return a.name.localeCompare(b.name);
        }
        
        // If one is "To be unassigned", treat it as priority 1 (same as "Currently assigned")
        const priorityA = isUnassignedA ? 1 : getStatusPriority(statusA);
        const priorityB = isUnassignedB ? 1 : getStatusPriority(statusB);

        if (priorityA !== priorityB) {
          return option2StatusSortBy.direction === 'asc'
            ? priorityA - priorityB
            : priorityB - priorityA;
        }
        // If status priority is the same, sort by role name as secondary
        return a.name.localeCompare(b.name);
      } else {
        // Sort by role name
        const comparison = a.name.localeCompare(b.name);
        return roleNameSortBy.direction === 'asc' ? comparison : -comparison;
      }
    });
  };

  const getRoleNameSortParams = () => ({
    sortBy: roleNameSortBy,
    onSort: (_event: any, index: number, direction: 'asc' | 'desc') => {
      setRoleNameSortBy({ index, direction });
      setOption2ActiveSort('roleName');
    },
    columnIndex: 1,
  });

  const getOption2StatusSortParams = () => {
    // Status column index: 4 (because Role type column is always present)
    return {
      sortBy: option2StatusSortBy,
      onSort: (_event: any, index: number, direction: 'asc' | 'desc') => {
        setOption2StatusSortBy({ index, direction });
        setOption2ActiveSort('status');
      },
      columnIndex: 4,
    };
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
          if (!isOpen) {
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
        AI
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

  const renderRoleTypeLabels = (role: Role) => {
    if (role.roleType === 'openshift-default') {
      // For OpenShift default roles, show AI label and OpenShift default label
      const aiPopoverId = `ai-assign-${role.id}`;
      const openshiftPopoverId = `openshift-default-assign-${role.id}`;
      const openshiftContent = getLabelPopoverContent('openshift-default', role.name);
      const openshiftLabel = (
        <Label 
          color="blue" 
          variant="filled" 
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
          {renderAILabel(aiPopoverId)}
          <div style={{ width: '4px' }} />
          {openshiftLabelWithPopover}
        </Flex>
      );
    } else if (role.roleType === 'openshift-custom') {
      // OpenShift custom roles don't get AI label
      const openshiftPopoverId = `openshift-custom-assign-${role.id}`;
      const openshiftContent = getLabelPopoverContent('openshift-custom', role.name);
      const openshiftLabel = (
        <Label 
          color="purple" 
          variant="filled" 
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
      
      return openshiftLabelWithPopover;
    } else {
      // Regular role - add AI label
      const aiPopoverId = `ai-assign-${role.id}`;
      return renderAILabel(aiPopoverId);
    }
  };

  const renderStatusBadge = (role: Role) => {
    const status = getRoleStatus(role);
    
    // If role was originally assigned but is now deselected, only show "To be unassigned" label
    if (role.originallyAssigned && !role.currentlyAssigned) {
      return <Label color="orange" variant="outline" isCompact>To be unassigned</Label>;
    }
    
    // Otherwise show single status label
    if (status === 'Currently assigned') {
      return <Label color="green" variant="outline" isCompact>{status}</Label>;
    } else if (status === 'To be assigned') {
      return <Label color="blue" variant="outline" isCompact>{status}</Label>;
    } else if (status === 'To be unassigned') {
      return <Label color="orange" variant="outline" isCompact>{status}</Label>;
    }
    return <span style={{ color: 'var(--pf-v5-global--Color--200)' }}>---</span>;
  };

  const handleRoleNameClick = (role: Role) => {
    setSelectedRoleForModal(role);
    setRulesPageSize(10);
    setIsRoleModalOpen(true);
  };

  const getSortedRules = (rules: RoleRule[]): RoleRule[] => {
    const sorted = [...rules];
    const columnIndex = rulesSortBy.index;
    const direction = rulesSortBy.direction;

    sorted.sort((a, b) => {
      let comparison = 0;
      
      if (columnIndex === 0) {
        // Sort by Actions
        const aActions = a.actions.join(', ');
        const bActions = b.actions.join(', ');
        comparison = aActions.localeCompare(bActions);
      } else if (columnIndex === 1) {
        // Sort by API Groups
        const aApiGroups = a.apiGroups.join(', ');
        const bApiGroups = b.apiGroups.join(', ');
        comparison = aApiGroups.localeCompare(bApiGroups);
      } else if (columnIndex === 2) {
        // Sort by Resources
        const aResources = a.resources.join(', ');
        const bResources = b.resources.join(', ');
        comparison = aResources.localeCompare(bResources);
      } else if (columnIndex === 3) {
        // Sort by Resource names
        const aResourceNames = (a.resourceNames || []).join(', ') || '-';
        const bResourceNames = (b.resourceNames || []).join(', ') || '-';
        comparison = aResourceNames.localeCompare(bResourceNames);
      }

      return direction === 'asc' ? comparison : -comparison;
    });

    return sorted;
  };

  const getRulesSortParams = (columnIndex: number) => ({
    sortBy: rulesSortBy,
    onSort: (_event: any, index: number, direction: 'asc' | 'desc') => {
      setRulesSortBy({ index, direction });
    },
    columnIndex,
  });

  const sortedRoles = getSortedRoles();
  const hasChanges = roles.some((role) => {
    // Check if the role's currentlyAssigned state differs from its originallyAssigned state
    return role.currentlyAssigned !== role.originallyAssigned;
  });

  return (
    <>
      <style>{`
        .pf-v6-c-button.pf-m-link.pf-m-inline {
          text-decoration: none !important;
        }
        .pf-v6-c-button.pf-m-link.pf-m-inline:hover {
          text-decoration: none !important;
        }
      `}</style>
      <div className="pf-v6-c-page__main-breadcrumb">
        <div style={{ padding: 'var(--pf-v5-global--spacer--lg) var(--pf-v5-global--spacer--lg)' }}>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/projects">Projects</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Link to={`/projects/${projectId}`}>{projectId}</Link>
            </BreadcrumbItem>
            <BreadcrumbItem isActive>Assign roles</BreadcrumbItem>
          </Breadcrumb>
        </div>
      </div>

      <PageSection>
        <Title headingLevel="h1" size="2xl">
          Assign roles
        </Title>
      </PageSection>

      <PageSection isFilled>
        <div style={{ maxWidth: '840px' }}>
          <Stack hasGutter>
            <StackItem>
              <Title headingLevel="h2" size="lg">Subject</Title>
              <Form style={{ marginTop: '16px' }}>
                {!isOption2 && (
                  <FormGroup label="Subject kind" fieldId="subject-type">
                <Flex spaceItems={{ default: 'spaceItemsLg' }}>
                  <Radio
                    id="subject-type-user"
                    name="subject-type"
                    label="User"
                    isChecked={subjectType === 'User'}
                    onChange={() => setSubjectType('User')}
                  />
                  <Radio
                    id="subject-type-group"
                    name="subject-type"
                    label="Group"
                    isChecked={subjectType === 'Group'}
                    onChange={() => setSubjectType('Group')}
                  />
                </Flex>
              </FormGroup>
                )}

                <FormGroup 
                  label={subjectType === 'User' ? 'User name' : 'Group name'}
                  fieldId="subject-name"
                  isRequired
                >
                  {isOption2 ? (
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: 'var(--pf-v5-global--spacer--sm) var(--pf-v5-global--spacer--md)',
                      backgroundColor: 'var(--pf-v5-global--BackgroundColor--200)',
                      border: '1px solid var(--pf-v5-global--BorderColor--300)',
                      borderRadius: 'var(--pf-v5-global--BorderRadius--sm)',
                      color: 'var(--pf-v5-global--Color--100)'
                    }}>
                      {subjectType === 'User' ? (
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '16px',
                          height: '16px',
                          borderRadius: '8px',
                          background: 'var(--ai-user--BackgroundColor, #f5e6d3)',
                          color: 'var(--ai-user--IconColor, #000)',
                          flexShrink: 0
                        }}>
                          <svg className="pf-v6-svg" viewBox="0 0 36 36" fill="currentColor" aria-hidden="true" role="img" width="16px" height="16px" style={{ width: '16px', height: '16px' }}>
                            <path d="M21.32,17.8C27.8,14.41,25.42,4.39,18,4.38s-9.8,10-3.32,13.42A13.63,13.63,0,0,0,4.38,31a.61.61,0,0,0,.62.62H31a.61.61,0,0,0,.62-.62A13.63,13.63,0,0,0,21.32,17.8Zm-9.2-6.3c.25-7.76,11.51-7.76,11.76,0C23.63,19.26,12.37,19.26,12.12,11.5ZM5.64,30.38C7,14.79,29.05,14.8,30.36,30.38Z"></path>
                          </svg>
                        </div>
                      ) : (
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '16px',
                          height: '16px',
                          borderRadius: '8px',
                          background: 'var(--ai-group--BackgroundColor, #f5e6d3)',
                          color: 'var(--ai-group--IconColor, #000)',
                          flexShrink: 0
                        }}>
                          <svg className="pf-v6-svg" viewBox="0 0 36 36" fill="currentColor" aria-hidden="true" role="img" width="16px" height="16px" style={{ width: '16px', height: '16px' }}>
                            <path d="m 27.87,23.29 a 3.86,3.86 0 1 0 -4.74,0 A 7.11,7.11 0 0 0 18.38,30 0.61,0.61 0 0 0 19,30.62 H 32 A 0.63,0.63 0 0 0 32.63,30 7.13,7.13 0 0 0 27.87,23.29 Z m -5,-3 a 2.62,2.62 0 0 1 5.24,0 2.62,2.62 0 0 1 -5.23,-0.04 z m -3.22,9.13 c 0.84,-6.94 10.84,-6.93 11.68,0 z M 16,19.38 a 0.62,0.62 0 0 0 0,1.24 h 4 a 0.62,0.62 0 0 0 0,-1.24 z m -2.63,-4 a 6,6 0 0 1 9.48,0.18 0.61,0.61 0 0 0 0.66,-0.07 c 1.07,-1 -2.27,-3 -3.13,-3.21 a 3.86,3.86 0 1 0 -4.76,0 c -0.86,0.25 -4.2,2.18 -3.13,3.21 a 0.62,0.62 0 0 0 0.88,-0.11 z m 2,-6.13 a 2.62,2.62 0 0 1 5.24,0 2.62,2.62 0 0 1 -5.23,0 z m -2.5,14.04 a 3.86,3.86 0 1 0 -4.74,0 A 7.11,7.11 0 0 0 3.38,30 0.61,0.61 0 0 0 4,30.62 H 17 A 0.63,0.63 0 0 0 17.63,30 7.13,7.13 0 0 0 12.87,23.29 Z m -5,-3 a 2.62,2.62 0 0 1 5.24,0 2.62,2.62 0 0 1 -5.23,-0.04 z m -3.21,9.09 c 0.84,-6.94 10.84,-6.93 11.68,0 z"></path>
                          </svg>
                        </div>
                      )}
                      <span>{selectedSubject || `Select ${subjectType.toLowerCase()}`}</span>
                  </div>
                  ) : (
                    <>
                      <TypeaheadSelect
                        key={`${subjectType}-${selectedSubject || 'none'}`}
                        initialOptions={typeaheadOptions}
                        placeholder={`Select ${subjectType.toLowerCase()}`}
                        noOptionsFoundMessage={(filter) => `No ${subjectType.toLowerCase()} was found for "${filter}"`}
                        createOptionMessage={(newValue) => `Assign role to "${newValue}"`}
                        onInputChange={(value) => {
                          setTypeaheadInputValue(value || '');
                        }}
                        onClearSelection={() => {
                          setSelectedSubject(undefined);
                          setTypeaheadInputValue('');
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
                          setTypeaheadInputValue('');
                          setSelectedSubject(selectedValue);
                          // If it's a new subject (not in the list), it will be created when saved
                        }}
                        isCreatable={false}
                      />
                      <HelperText>
                        <HelperTextItem>
                          {subjectType === 'User' 
                            ? 'Only users with existing roles are listed. To add someone new, enter their username.'
                            : 'Only groups with existing roles are listed. To add someone new, enter their group name.'}
                        </HelperTextItem>
                      </HelperText>
                      {!selectedSubject && (
                        <Alert 
                          variant={AlertVariant.info} 
                          isInline 
                          isPlain
                          title="Please select a user or group before assigning roles."
                          style={{ marginTop: '8px' }}
                        />
                      )}
                      {!isOption2 && selectedSubject && (
                        <Alert 
                          variant={AlertVariant.warning} 
                          isInline 
                          isPlain
                          title="Switching to a different user will discard any changes you've made in the Role assignment section."
                          style={{ marginTop: '8px' }}
                        />
                      )}
                    </>
                  )}
              </FormGroup>
            </Form>
          </StackItem>

            {selectedSubject && (
          <StackItem style={{ marginTop: '40px' }}>
            <Title headingLevel="h2" size="lg">Role assignment</Title>
            <Content style={{ marginTop: '16px', marginBottom: 'var(--pf-v5-global--spacer--md)' }}>
              Check the role to grant the relevant permissions.
            </Content>

            <div style={{ marginBottom: 'var(--pf-v5-global--spacer--md)' }}>
              <SearchInput
                placeholder="Find by name"
                value={searchValue}
                onChange={(_event, value) => setSearchValue(value)}
                onClear={() => setSearchValue('')}
                aria-label="Find by name"
              />
            </div>

              <Table variant="compact" aria-label="Roles table">
                  <Thead>
                    <Tr>
                      <Th />
                      <Th 
                        sort={getRoleNameSortParams()}
                        info={{
                          popover: (
                            <Content>
                              <Content component="small" className="pf-v6-c-content--small" style={{ color: 'var(--pf-t--global--text--color--regular)', marginBottom: '8px', display: 'block' }}>
                                Roles with different labels come from different sources. The meanings of each label are defined as follows:
                              </Content>
                              <Content component="ul" className="pf-v6-c-content--ul" style={{ margin: '0px' }}>
                                <Content component="li" className="pf-v6-c-content--li">
                                  <Content component="small" className="pf-v6-c-content--small" style={{ color: 'var(--pf-t--global--text--color--regular)' }}>
                                    <strong>AI:</strong> Description
                                  </Content>
                                </Content>
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
                        }}
                      >
                        Role
                      </Th>
                      <Th>Description</Th>
                      <Th 
                        info={{
                          popover: (
                            <Content>
                              <Content component="small" className="pf-v6-c-content--small" style={{ color: 'var(--pf-t--global--text--color--regular)', marginBottom: '8px', display: 'block' }}>
                                Roles with different labels come from different sources. The meanings of each label are defined as follows:
                              </Content>
                              <Content component="ul" className="pf-v6-c-content--ul" style={{ margin: '0px' }}>
                                <Content component="li" className="pf-v6-c-content--li">
                                  <Content component="small" className="pf-v6-c-content--small" style={{ color: 'var(--pf-t--global--text--color--regular)' }}>
                                    <strong>AI:</strong> Description
                                  </Content>
                                </Content>
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
                          ariaLabel: 'Role type labels help',
                          popoverProps: { headerContent: 'Role Labels' }
                        }}
                      >
                        Role type
                      </Th>
                      <Th sort={getOption2StatusSortParams()}>
                        Status
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {sortedRoles.length === 0 ? (
                      <Tr>
                        <Td colSpan={5} style={{ textAlign: 'center', padding: 'var(--pf-v5-global--spacer--xl)' }}>
                          No roles available
                        </Td>
                      </Tr>
                    ) : (
                      sortedRoles.map((role) => (
                        <Tr key={role.id}>
                          <Td>
                                <Checkbox
                                  id={`role-${role.id}`}
                                  isChecked={role.currentlyAssigned}
                                  onChange={() => handleRoleToggle(role.id)}
                                  aria-label={`Select role ${role.name}`}
                                />
                            </Td>
                            <Td>
                              <Button
                                variant="link"
                                onClick={() => handleRoleNameClick(role)}
                                isInline
                                style={{ padding: 0, fontSize: 'inherit', textDecoration: 'none' }}
                                className="pf-v6-c-button__text"
                              >
                                {role.name}
                              </Button>
                            </Td>
                            <Td>{role.description}</Td>
                            <Td>
                              {renderRoleTypeLabels(role)}
                            </Td>
                            <Td>{renderStatusBadge(role)}</Td>
                          </Tr>
                      ))
                    )}
                  </Tbody>
                </Table>
              </StackItem>
            )}
        </Stack>
        </div>
      </PageSection>

      <PageSection className="pf-m-sticky-bottom">
        <div className="pf-v6-l-stack pf-m-gutter">
          <div className="pf-v6-l-stack__item">
            <Alert variant={AlertVariant.info} isInline title="Information">
              Make sure to inform newly added user about the updated project access.
            </Alert>
          </div>
          <div className="pf-v6-l-stack__item">
            <div className="pf-v6-l-stack pf-m-gutter">
              <div className="pf-v6-l-stack__item">
                <div className="pf-v6-c-action-list">
                  <div className="pf-v6-c-action-list__item">
                    <Button
                      variant="primary"
                      onClick={() => {
                        // Get all currently assigned roles
                        const assignedRoles = roles
                          .filter(role => role.currentlyAssigned)
                          .map(role => role.name);
                        
                        // Update shared data
                        if (subjectType === 'User' && selectedSubject) {
                          updateUserRoles(selectedSubject, assignedRoles);
                        } else if (subjectType === 'Group' && selectedSubject) {
                          updateGroupRoles(selectedSubject, assignedRoles);
                        }
                        
                        // Navigate back to permissions tab
                        navigate(`/projects/${projectId}?tab=permissions`);
                      }}
                      isDisabled={!hasChanges || !selectedSubject}
                      data-testid="submit-button"
                      id="save-button"
                    >
                      Save
                    </Button>
                  </div>
                  <div className="pf-v6-c-action-list__item">
                    <Button
                      variant="link"
                      onClick={() => navigate(`/projects/${projectId}?tab=permissions`)}
                      id="cancel-button"
                      data-testid="cancel-button"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageSection>

      {/* Role Rules Modal */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        variant="large"
        aria-labelledby="role-rules-modal-title"
      >
        <ModalHeader
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span id="role-rules-modal-title">{selectedRoleForModal?.name}</span>
              {selectedRoleForModal?.roleType === 'openshift-default' && (
                <Label color="blue" variant="outline">OpenShift default</Label>
              )}
              {selectedRoleForModal?.roleType === 'openshift-custom' && (
                <Label color="purple" variant="outline">OpenShift custom</Label>
              )}
            </div>
          }
        />
        <ModalBody>
          <Content style={{ marginBottom: 'var(--pf-v5-global--spacer--md)' }}>
            The table below presents the rules of this role.
          </Content>
          {selectedRoleForModal && selectedRoleForModal.rules && selectedRoleForModal.rules.length > 0 ? (
            <>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <Table variant="compact" aria-label="Role rules table">
                  <Thead>
                    <Tr>
                      <Th sort={getRulesSortParams(0)}>
                        Actions
                      </Th>
                      <Th sort={getRulesSortParams(1)}>
                        API Groups
                      </Th>
                      <Th sort={getRulesSortParams(2)}>
                        Resources
                      </Th>
                      <Th sort={getRulesSortParams(3)}>
                        Resource names
                        <OutlinedQuestionCircleIcon style={{ marginLeft: 'var(--pf-v5-global--spacer--xs)', color: 'var(--pf-v5-global--Color--200)' }} />
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {getSortedRules(selectedRoleForModal.rules)
                      .slice(0, rulesPageSize)
                      .map((rule, index) => (
                        <Tr key={index}>
                          <Td>{rule.actions.join(', ')}</Td>
                          <Td>{rule.apiGroups.join(', ')}</Td>
                          <Td>{rule.resources.join(', ')}</Td>
                          <Td>{rule.resourceNames?.join(', ') || '-'}</Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </div>
              {selectedRoleForModal.rules.length > rulesPageSize && (
                <div style={{ marginTop: 'var(--pf-v5-global--spacer--md)' }}>
                  <Button
                    variant="link"
                    isInline
                    onClick={() => setRulesPageSize(prev => prev + 10)}
                  >
                    View more
                  </Button>
                  <span style={{ marginLeft: 'var(--pf-v5-global--spacer--sm)', color: 'var(--pf-v5-global--Color--200)' }}>
                    Showing {Math.min(rulesPageSize, selectedRoleForModal.rules.length)}/{selectedRoleForModal.rules.length}
                  </span>
                </div>
              )}
            </>
          ) : (
            <div style={{ color: 'var(--pf-v5-global--Color--200)', padding: 'var(--pf-v5-global--spacer--md)' }}>
              No rules available
            </div>
          )}
        </ModalBody>
      </Modal>
    </>
  );
};

export { RoleAssignmentPage };
