import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { TypeaheadSelect, TypeaheadSelectOption, SimpleDropdown } from '@patternfly/react-templates';
import {
  PageSection,
  Title,
  Content,
  Breadcrumb,
  BreadcrumbItem,
  PageBreadcrumb,
  Button,
  Grid,
  GridItem,
  Card,
  CardBody,
  Form,
  FormGroup,
  TextInput,
  TextArea,
  Select,
  SelectList,
  SelectOption,
  MenuToggle,
  Checkbox,
  Split,
  SplitItem,
  Divider,
  ExpandableSection,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalVariant,
  SearchInput,
  HelperText,
  HelperTextItem,
  Drawer,
  DrawerContent,
  DrawerPanelContent,
  DrawerHead,
  DrawerActions,
  DrawerCloseButton,
  DrawerPanelBody,
  DrawerContentBody,
  ToggleGroup,
  ToggleGroupItem,
  TextInputGroup,
  TextInputGroupMain,
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
} from '@patternfly/react-table';
import { DownloadIcon, MinusCircleIcon, PlusIcon, SearchIcon } from '@patternfly/react-icons';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';

type VerbsState = {
  get: boolean;
  list: boolean;
  watch: boolean;
  create: boolean;
  update: boolean;
  patch: boolean;
  delete: boolean;
  deletecollection: boolean;
  bind: boolean;
  escalate: boolean;
  impersonate: boolean;
  use: boolean;
  approve: boolean;
  all: boolean;
};

const defaultVerbs: VerbsState = {
  get: false,
  list: false,
  watch: false,
  create: false,
  update: false,
  patch: false,
  delete: false,
  deletecollection: false,
  bind: false,
  escalate: false,
  impersonate: false,
  use: false,
  approve: false,
  all: false,
};

type Rule = {
  id: string;
  apiGroups: string;
  resources: string;
  verbs: VerbsState;
};

const createRule = (overrides?: Partial<Rule>): Rule => ({
  id: `rule-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  apiGroups: '',
  resources: '',
  verbs: { ...defaultVerbs },
  ...overrides,
});

// Shared rule sets: maintainer (full), reader (get/list/watch only), updater (read + update/patch on notebooks)
const MAINTAINER_RULES: Rule[] = [
  { id: 'maint-1', apiGroups: '', resources: 'namespaces', verbs: { ...defaultVerbs, get: true, list: true, watch: true } },
  { id: 'maint-2', apiGroups: 'kubeflow.org', resources: 'notebooks', verbs: { ...defaultVerbs, all: true } },
  { id: 'maint-3', apiGroups: 'image.openshift.io', resources: 'imagestreams', verbs: { ...defaultVerbs, get: true, list: true, watch: true } },
  { id: 'maint-4', apiGroups: '', resources: 'persistentvolumeclaims', verbs: { ...defaultVerbs, all: true } },
  { id: 'maint-5', apiGroups: '', resources: 'persistentvolumeclaims/status', verbs: { ...defaultVerbs, get: true, list: true, watch: true } },
  { id: 'maint-6', apiGroups: '', resources: 'pods, statefulsets', verbs: { ...defaultVerbs, get: true, list: true, watch: true } },
  { id: 'maint-7', apiGroups: '', resources: 'secrets, configmaps', verbs: { ...defaultVerbs, all: true } },
  { id: 'maint-8', apiGroups: 'infrastructure.opendatahub.io', resources: 'hardwareprofiles', verbs: { ...defaultVerbs, get: true, list: true, watch: true } },
  { id: 'maint-9', apiGroups: '', resources: 'events', verbs: { ...defaultVerbs, get: true, list: true, watch: true } },
];

const READER_RULES: Rule[] = [
  { id: 'read-1', apiGroups: '', resources: 'namespaces', verbs: { ...defaultVerbs, get: true, list: true, watch: true } },
  { id: 'read-2', apiGroups: 'kubeflow.org', resources: 'notebooks', verbs: { ...defaultVerbs, get: true, list: true, watch: true } },
  { id: 'read-3', apiGroups: 'image.openshift.io', resources: 'imagestreams', verbs: { ...defaultVerbs, get: true, list: true, watch: true } },
  { id: 'read-4', apiGroups: '', resources: 'persistentvolumeclaims', verbs: { ...defaultVerbs, get: true, list: true, watch: true } },
  { id: 'read-5', apiGroups: '', resources: 'persistentvolumeclaims/status', verbs: { ...defaultVerbs, get: true, list: true, watch: true } },
  { id: 'read-6', apiGroups: '', resources: 'pods, statefulsets', verbs: { ...defaultVerbs, get: true, list: true, watch: true } },
  { id: 'read-7', apiGroups: '', resources: 'secrets, configmaps', verbs: { ...defaultVerbs, get: true, list: true, watch: true } },
  { id: 'read-8', apiGroups: 'infrastructure.opendatahub.io', resources: 'hardwareprofiles', verbs: { ...defaultVerbs, get: true, list: true, watch: true } },
  { id: 'read-9', apiGroups: '', resources: 'events', verbs: { ...defaultVerbs, get: true, list: true, watch: true } },
];

const UPDATER_RULES: Rule[] = [
  { id: 'upd-1', apiGroups: '', resources: 'namespaces', verbs: { ...defaultVerbs, get: true, list: true, watch: true } },
  { id: 'upd-2', apiGroups: 'kubeflow.org', resources: 'notebooks', verbs: { ...defaultVerbs, get: true, list: true, watch: true, update: true, patch: true } },
  { id: 'upd-3', apiGroups: 'image.openshift.io', resources: 'imagestreams', verbs: { ...defaultVerbs, get: true, list: true, watch: true } },
  { id: 'upd-4', apiGroups: '', resources: 'persistentvolumeclaims', verbs: { ...defaultVerbs, all: true } },
  { id: 'upd-5', apiGroups: '', resources: 'persistentvolumeclaims/status', verbs: { ...defaultVerbs, get: true, list: true, watch: true } },
  { id: 'upd-6', apiGroups: '', resources: 'pods, statefulsets', verbs: { ...defaultVerbs, get: true, list: true, watch: true } },
  { id: 'upd-7', apiGroups: '', resources: 'secrets, configmaps', verbs: { ...defaultVerbs, all: true } },
  { id: 'upd-8', apiGroups: 'infrastructure.opendatahub.io', resources: 'hardwareprofiles', verbs: { ...defaultVerbs, get: true, list: true, watch: true } },
  { id: 'upd-9', apiGroups: '', resources: 'events', verbs: { ...defaultVerbs, get: true, list: true, watch: true } },
];

const ruleTemplates = [
  { id: 'maintainer', name: 'Maintainer', category: 'Permissions', description: 'Full access (get, list, watch, create, update, patch, delete) to selected resources.', rules: MAINTAINER_RULES },
  { id: 'reader', name: 'Reader', category: 'Permissions', description: 'Read-only access (get, list, watch) to selected resources.', rules: READER_RULES },
  { id: 'updater', name: 'Updater', category: 'Permissions', description: 'Read and update access (get, list, watch, update, patch) to selected resources.', rules: UPDATER_RULES },
];

/** Shared drawer panel: search (sticky) + filter by category (sticky) + scrollable list. Used by both Browse Resources and Browse API Groups. */
function BrowseDrawerPanelContent(props: {
  title: string;
  onClose: () => void;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchAriaLabel: string;
  filterAriaLabel: string;
  toggleItems: Array<{ buttonId: string; text: string; isSelected: boolean; onChange: () => void }>;
  categoryOrder: string[];
  getItemsForCategory: (category: string) => Array<{ name: string; description: string }>;
  onAddItem: (name: string) => void;
  getItemDisplayName?: (name: string) => string;
}) {
  const {
    title,
    onClose,
    searchPlaceholder,
    searchValue,
    onSearchChange,
    searchAriaLabel,
    filterAriaLabel,
    toggleItems,
    categoryOrder,
    getItemsForCategory,
    onAddItem,
    getItemDisplayName = (name) => name,
  } = props;

  return (
    <DrawerPanelContent defaultSize="500px" minSize="500px" style={{ display: 'flex', flexDirection: 'column' }}>
      <DrawerHead>
        <Title headingLevel="h2" size="xl">{title}</Title>
        <DrawerActions>
          <DrawerCloseButton onClick={onClose} />
        </DrawerActions>
      </DrawerHead>
      <DrawerPanelBody style={{
        paddingTop: 0,
        paddingRight: 'var(--pf-t--global--spacer--md)',
        paddingBottom: 'var(--pf-t--global--spacer--md)',
        paddingLeft: 'var(--pf-t--global--spacer--md)',
        overflowY: 'auto',
        flex: '1 1 0%',
        minHeight: 0,
      }}>
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backgroundColor: 'var(--pf-v5-global--BackgroundColor--100, #ffffff)',
          paddingTop: 'var(--pf-t--global--spacer--md)',
          paddingBottom: 'var(--pf-t--global--spacer--md)',
          marginBottom: 'var(--pf-t--global--spacer--md)',
        }}>
          <div style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
            <TextInputGroup>
              <TextInputGroupMain
                icon={<SearchIcon />}
                value={searchValue}
                onChange={(_event, value) => onSearchChange(value)}
                placeholder={searchPlaceholder}
                aria-label={searchAriaLabel}
              />
            </TextInputGroup>
          </div>
          <Content component="p" style={{
            fontSize: 'var(--pf-v5-global--FontSize--sm)',
            color: 'var(--pf-v5-global--Color--200)',
            marginBottom: 'var(--pf-t--global--spacer--sm)',
          }}>
            Filter by category
          </Content>
          <div style={{ marginBottom: 0 }}>
            <ToggleGroup aria-label={filterAriaLabel}>
              {toggleItems.map((item) => (
                <ToggleGroupItem
                  key={item.buttonId}
                  text={item.text}
                  buttonId={item.buttonId}
                  isSelected={item.isSelected}
                  onChange={item.onChange}
                />
              ))}
            </ToggleGroup>
          </div>
        </div>

        {categoryOrder.map((category) => {
          const items = getItemsForCategory(category);
          if (items.length === 0) return null;
          return (
            <div key={category} style={{ marginBottom: 'var(--pf-t--global--spacer--lg)' }}>
              <Title headingLevel="h3" size="md" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
                {category}
              </Title>
              {items.map((item, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: 'var(--pf-t--global--spacer--md)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{ flex: '1 1 0%' }}>
                    <div style={{ fontWeight: 'var(--pf-v5-global--FontWeight--bold)' }}>
                      {getItemDisplayName(item.name)}
                    </div>
                    <Content component="small" style={{ color: 'var(--pf-v5-global--Color--200)' }}>
                      {item.description}
                    </Content>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => onAddItem(item.name)}>
                    Add
                  </Button>
                </div>
              ))}
            </div>
          );
        })}
      </DrawerPanelBody>
    </DrawerPanelContent>
  );
}

type TemplateTableItem = { id: string; name: string; category: string; description: string };

function TemplateTable<T extends TemplateTableItem>({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  searchAriaLabel,
  items,
  emptyMessage,
  actionLabel,
  onAction,
  tableAriaLabel,
}: {
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchAriaLabel: string;
  items: T[];
  emptyMessage: string;
  actionLabel: string;
  onAction: (item: T) => void;
  tableAriaLabel: string;
}) {
  return (
    <>
      <div style={{ marginBottom: 'var(--pf-v5-global--spacer--md)' }}>
        <SearchInput
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(_event, value) => onSearchChange(value)}
          onClear={() => onSearchChange('')}
          aria-label={searchAriaLabel}
        />
      </div>
      <Table variant="compact" aria-label={tableAriaLabel}>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Category</Th>
            <Th>Description</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.length > 0 ? (
            items.map((template) => (
              <Tr key={template.id}>
                <Td dataLabel="Name">{template.name}</Td>
                <Td dataLabel="Category">{template.category}</Td>
                <Td dataLabel="Description">{template.description}</Td>
                <Td dataLabel="Actions">
                  <Button variant="secondary" onClick={() => onAction(template)}>
                    {actionLabel}
                  </Button>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={4} style={{ textAlign: 'center', padding: 'var(--pf-v5-global--spacer--lg)' }}>
                {emptyMessage}
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </>
  );
}

const CreateRole: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [roleName, setRoleName] = React.useState('my-custom-role');
  const [description, setDescription] = React.useState('');
  const [labels, setLabels] = React.useState<Array<{ key: string; value: string }>>([]);
  const [category, setCategory] = React.useState('');
  const [categoryInputValue, setCategoryInputValue] = React.useState('');
  const [rules, setRules] = React.useState<Rule[]>(() => [
    createRule({ verbs: { ...defaultVerbs, get: true } }),
  ]);
  const [expandedRuleIds, setExpandedRuleIds] = React.useState<Set<string>>(() => new Set());
  const [isTemplateModalOpen, setIsTemplateModalOpen] = React.useState(false);
  const [templateSearchValue, setTemplateSearchValue] = React.useState('');
  const [ruleTemplateSearchValue, setRuleTemplateSearchValue] = React.useState('');
  const [templateModalMode, setTemplateModalMode] = React.useState<'role' | 'rule'>('role');
  const [editingRuleIndex, setEditingRuleIndex] = React.useState(0);
  const [apiGroupsSearchValue, setApiGroupsSearchValue] = React.useState('');
  const [apiGroupsCategoryFilter, setApiGroupsCategoryFilter] = React.useState('All');
  const [isResourcesDrawerOpen, setIsResourcesDrawerOpen] = React.useState(false);
  const [browseDrawerMode, setBrowseDrawerMode] = React.useState<'resources' | 'apiGroups'>('resources');
  const [resourcesSearchValue, setResourcesSearchValue] = React.useState('');
  const [resourcesCategoryFilter, setResourcesCategoryFilter] = React.useState('All');

  useDocumentTitle('Create Role');

  const existingCategories = [
    'Project Management',
    'Deployment Management',
    'Pipeline Management',
    'Workbench Management',
  ];

  // Create typeahead options for category
  const categoryTypeaheadOptions = React.useMemo<TypeaheadSelectOption[]>(() => {
    const options: TypeaheadSelectOption[] = [];
    
    // Filter categories based on input value
    const filteredCategories = categoryInputValue && categoryInputValue.trim()
      ? existingCategories.filter(cat => 
          cat.toLowerCase().includes(categoryInputValue.toLowerCase())
        )
      : existingCategories;
    
    // If there's input, add create option first
    if (categoryInputValue && categoryInputValue.trim()) {
      options.push({
        content: `Create "${categoryInputValue}"`,
        value: `Create "${categoryInputValue}"`,
      });
      // Add divider after create option if there are existing categories
      if (filteredCategories.length > 0) {
        options.push({
          content: '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500',
          value: '__divider__',
          isDisabled: true,
          isAriaDisabled: true,
        } as TypeaheadSelectOption);
      }
    }
    
    // Add filtered existing categories
    if (filteredCategories.length > 0) {
      options.push(...filteredCategories.map((cat) => ({
        content: cat,
        value: cat,
        selected: cat === category,
      })));
    }
    
    // If category is set and not in the existing categories, add it to options so it displays correctly
    if (category && !existingCategories.includes(category)) {
      // Check if it's not already in options
      const alreadyInOptions = options.some(opt => opt.value === category);
      if (!alreadyInOptions) {
        options.push({
          content: category,
          value: category,
          selected: true,
        });
      }
    }
    
    return options;
  }, [category, categoryInputValue]);

  const roleTemplates = [
    {
      id: '1',
      name: 'Admin',
      category: 'Project Management',
      description: 'User can edit the project and manage user access. User can view and manage any project resource.',
      templateRoleName: 'copy-of-Admin',
      templateRules: MAINTAINER_RULES,
    },
    {
      id: '2',
      name: 'Contributor',
      category: 'Project Management',
      description: 'User can view and manage any project resource. Users with this role can manage all resources in the namespace, including workbenches, model deployments, and cluster storage, except for permissions controlling.',
      templateRoleName: 'copy-of-Contributor',
      templateRules: MAINTAINER_RULES,
    },
    {
      id: '3',
      name: 'Deployment maintainer',
      category: 'Deployment Management',
      description: 'User can view and manage all model deployments.',
      templateRoleName: 'copy-of-Deployment Maintainer',
      templateRules: MAINTAINER_RULES,
    },
    {
      id: '4',
      name: 'Deployment reader',
      category: 'Deployment Management',
      description: 'User can view and open model deployments without modifying their configuration.',
      templateRoleName: 'copy-of-Deployment Reader',
      templateRules: READER_RULES,
    },
    {
      id: '5',
      name: 'Deployment updater',
      category: 'Deployment Management',
      description: 'User can view model deployments and update existing deployments.',
      templateRoleName: 'copy-of-Deployment Updater',
      templateRules: UPDATER_RULES,
    },
    {
      id: '6',
      name: 'Pipeline maintainer',
      category: 'Pipeline Management',
      description: 'User can view and manage all pipelines.',
      templateRoleName: 'copy-of-Pipeline Maintainer',
      templateRules: MAINTAINER_RULES,
    },
    {
      id: '7',
      name: 'Pipeline reader',
      category: 'Pipeline Management',
      description: 'User can view and open pipelines without modifying their configuration.',
      templateRoleName: 'copy-of-Pipeline Reader',
      templateRules: READER_RULES,
    },
    {
      id: '8',
      name: 'Pipeline updater',
      category: 'Pipeline Management',
      description: 'User can view pipelines and modify their configuration, but cannot create or delete them.',
      templateRoleName: 'copy-of-Pipeline Updater',
      templateRules: UPDATER_RULES,
    },
    {
      id: '9',
      name: 'Workbench maintainer',
      category: 'Workbench Management',
      description: 'The role that grants minimum permissions to allow users as the admin of the workbench component.',
      templateRoleName: 'copy-of-Workbench Maintainer',
      templateRules: MAINTAINER_RULES,
    },
    {
      id: '10',
      name: 'Workbench reader',
      category: 'Workbench Management',
      description: 'The role that grants minimum permissions to allow users to view the workbench component without modification permissions.',
      templateRoleName: 'copy-of-Workbench Reader',
      templateRules: READER_RULES,
    },
    {
      id: '11',
      name: 'Workbench updater',
      category: 'Workbench Management',
      description: 'The role that grants minimum permissions to allow users as the updater of the workbench component without creation/deletion permissions',
      templateRoleName: 'copy-of-Workbench Updater',
      templateRules: UPDATER_RULES,
    },
  ];

  type RoleTemplate = typeof roleTemplates[0] & {
    templateRoleName?: string;
    templateApiGroups?: string;
    templateResources?: string;
    templateVerbs?: Partial<VerbsState>;
    templateRules?: Rule[];
  };

  const handleUseTemplate = (template: RoleTemplate) => {
    setRoleName(
      template.templateRoleName ?? `copy-of-${template.name.toLowerCase().replace(/\s+/g, '-')}`
    );
    setDescription(template.description);
    setCategory(template.category);
    if (template.templateRules && template.templateRules.length > 0) {
      setRules(template.templateRules.map((r) => ({ ...r, id: r.id || `rule-${Date.now()}-${Math.random().toString(36).slice(2)}` })));
      setExpandedRuleIds(new Set(template.templateRules.map((r) => r.id)));
    } else {
      if (template.templateApiGroups !== undefined || template.templateResources !== undefined || template.templateVerbs) {
        setRules([
          createRule({
            apiGroups: template.templateApiGroups ?? '',
            resources: template.templateResources ?? '',
            verbs: template.templateVerbs ? { ...defaultVerbs, ...template.templateVerbs } : defaultVerbs,
          }),
        ]);
        setExpandedRuleIds(new Set());
      }
    }
    setIsTemplateModalOpen(false);
    setTemplateSearchValue('');
  };

  // Filter templates based on search value
  const filteredTemplates = React.useMemo(() => {
    if (!templateSearchValue.trim()) {
      return roleTemplates;
    }
    const searchLower = templateSearchValue.toLowerCase();
    return roleTemplates.filter(
      (template) =>
        template.name.toLowerCase().includes(searchLower) ||
        template.category.toLowerCase().includes(searchLower) ||
        template.description.toLowerCase().includes(searchLower)
    );
  }, [templateSearchValue]);

  /** Add rules from a role template to the current form (used by "Select rule template" modal). */
  const addRulesFromRoleTemplate = (template: RoleTemplate) => {
    const noRulesDefinedYet = rules.length <= 1;
    if (template.templateRules && template.templateRules.length > 0) {
      const newRules = template.templateRules.map((r, i) => ({
        ...r,
        id: `rule-${Date.now()}-${i}-${Math.random().toString(36).slice(2)}`,
      }));
      setRules((prev) => (noRulesDefinedYet ? newRules : [...prev, ...newRules]));
      setExpandedRuleIds((prev) =>
        noRulesDefinedYet ? new Set(newRules.map((r) => r.id)) : new Set(Array.from(prev).concat(newRules.map((r) => r.id)))
      );
      newRuleIdRef.current = newRules[0].id;
    } else if (
      template.templateApiGroups !== undefined ||
      template.templateResources !== undefined ||
      template.templateVerbs !== undefined
    ) {
      const newRule = createRule({
        apiGroups: template.templateApiGroups ?? '',
        resources: template.templateResources ?? '',
        verbs: template.templateVerbs ? { ...defaultVerbs, ...template.templateVerbs } : defaultVerbs,
      });
      newRule.id = `rule-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setRules((prev) => (noRulesDefinedYet ? [newRule] : [...prev, newRule]));
      setExpandedRuleIds((prev) => (noRulesDefinedYet ? new Set([newRule.id]) : new Set(Array.from(prev).concat(newRule.id))));
      newRuleIdRef.current = newRule.id;
    }
    setIsTemplateModalOpen(false);
    setRuleTemplateSearchValue('');
  };

  const filteredRuleTemplates = React.useMemo(() => {
    if (!ruleTemplateSearchValue.trim()) {
      return roleTemplates;
    }
    const searchLower = ruleTemplateSearchValue.toLowerCase();
    return roleTemplates.filter(
      (template) =>
        template.name.toLowerCase().includes(searchLower) ||
        template.category.toLowerCase().includes(searchLower) ||
        template.description.toLowerCase().includes(searchLower)
    );
  }, [ruleTemplateSearchValue]);

  const updateRule = (ruleIndex: number, updates: Partial<Rule>) => {
    setRules((prev) =>
      prev.map((r, i) => (i === ruleIndex ? { ...r, ...updates } : r))
    );
  };

  const handleVerbChange = (ruleIndex: number, verb: keyof VerbsState, checked: boolean) => {
    setRules((prev) =>
      prev.map((r, i) =>
        i === ruleIndex ? { ...r, verbs: { ...r.verbs, [verb]: checked } } : r
      )
    );
  };

  const isCategoryAllSelected = (verbs: VerbsState, category: 'read' | 'write' | 'delete' | 'advanced'): boolean => {
    if (category === 'read') return verbs.get && verbs.list && verbs.watch;
    if (category === 'write') return verbs.create && verbs.update && verbs.patch;
    if (category === 'delete') return verbs.delete && verbs.deletecollection;
    if (category === 'advanced') return verbs.bind && verbs.escalate && verbs.impersonate && verbs.use && verbs.approve && verbs.all;
    return false;
  };

  const handleSelectAllOrDeselectAll = (ruleIndex: number, category: 'read' | 'write' | 'delete' | 'advanced') => {
    setRules((prev) =>
      prev.map((r, i) => {
        if (i !== ruleIndex) return r;
        const allSelected = isCategoryAllSelected(r.verbs, category);
        const v = { ...r.verbs };
        if (category === 'read') {
          const val = !allSelected;
          v.get = val; v.list = val; v.watch = val;
        } else if (category === 'write') {
          const val = !allSelected;
          v.create = val; v.update = val; v.patch = val;
        } else if (category === 'delete') {
          const val = !allSelected;
          v.delete = val; v.deletecollection = val;
        } else if (category === 'advanced') {
          const val = !allSelected;
          v.bind = val; v.escalate = val; v.impersonate = val; v.use = val; v.approve = val; v.all = val;
        }
        return { ...r, verbs: v };
      })
    );
  };

  const isAllCategoriesSelected = (verbs: VerbsState): boolean =>
    (Object.keys(defaultVerbs) as (keyof VerbsState)[]).every((key) => verbs[key]);

  const handleSelectAllCategories = (ruleIndex: number) => {
    setRules((prev) =>
      prev.map((r, i) => {
        if (i !== ruleIndex) return r;
        const v = { ...r.verbs };
        (Object.keys(defaultVerbs) as (keyof VerbsState)[]).forEach((key) => { v[key] = true; });
        return { ...r, verbs: v };
      })
    );
  };

  const handleDeselectAllCategories = (ruleIndex: number) => {
    setRules((prev) =>
      prev.map((r, i) => {
        if (i !== ruleIndex) return r;
        const v = { ...r.verbs };
        (Object.keys(defaultVerbs) as (keyof VerbsState)[]).forEach((key) => { v[key] = false; });
        return { ...r, verbs: v };
      })
    );
  };

  const newRuleIdRef = React.useRef<string | null>(null);

  const handleAddRule = () => {
    const newRule = createRule();
    setRules((prev) => [...prev, newRule]);
    setExpandedRuleIds((prev) => new Set(Array.from(prev).concat(newRule.id)));
    newRuleIdRef.current = newRule.id;
  };

  React.useEffect(() => {
    const ruleId = newRuleIdRef.current;
    if (!ruleId) return;
    const scrollToNewRule = () => {
      const el = document.querySelector(`[data-rule-id="${ruleId}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      newRuleIdRef.current = null;
    };
    const t = window.setTimeout(scrollToNewRule, 150);
    return () => window.clearTimeout(t);
  }, [rules.length]);

  const handleRemoveRule = (ruleIndex: number) => {
    setRules((prev) => prev.filter((_, i) => i !== ruleIndex));
  };

  const toggleRuleExpanded = (ruleId: string) => {
    setExpandedRuleIds((prev) => {
      const next = new Set(prev);
      if (next.has(ruleId)) next.delete(ruleId);
      else next.add(ruleId);
      return next;
    });
  };

  const generateYAML = () => {
    const ruleBlocks = rules.map((rule) => {
      const selectedVerbs = Object.entries(rule.verbs)
        .filter(([_, checked]) => checked)
        .map(([verb]) => (verb === 'all' ? '*' : verb));
      const apiGroupList = rule.apiGroups
        .split(',')
        .map((g) => g.trim())
        .filter((g) => g !== undefined);
      const resourceList = rule.resources
        .split(',')
        .map((r) => r.trim())
        .filter((r) => r !== undefined);
      const apiGroupsYaml =
        apiGroupList.length > 0
          ? apiGroupList.map((g) => `  - "${g}"`).join('\n')
          : '  - "*"';
      const resourcesYaml =
        resourceList.length > 0
          ? resourceList.map((r) => `  - "${r}"`).join('\n')
          : '  - "*"';
      const verbsYaml =
        selectedVerbs.length > 0
          ? selectedVerbs.map((v) => `  - "${v}"`).join('\n')
          : '  - "*"';
      return `- apiGroups:
${apiGroupsYaml}
  resources:
${resourcesYaml}
  verbs:
${verbsYaml}`;
    });

    const displayName = (roleName || 'my-custom-role').replace(/'/g, "''");
    const descriptionAnnotation = (description || '').replace(/'/g, "''");

    return `apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: ${roleName}
  labels:
    opendatahub.io/dashboard: 'true'
  annotations:
    openshift.io/display-name: '${displayName}'
    openshift.io/description: '${descriptionAnnotation}'
rules:
${ruleBlocks.join('\n')}
`;
  };

  const [yamlContent, setYamlContent] = React.useState(generateYAML());

  React.useEffect(() => {
    setYamlContent(generateYAML());
  }, [roleName, description, rules]);

  const handleSubmit = () => {
    // Handle form submission
    navigate('/settings/user-management/roles');
  };

  const handleCancel = () => {
    navigate('/settings/user-management/roles');
  };

  // API Groups data
  interface ApiGroup {
    name: string;
    description: string;
    category: 'Core' | 'KubeVirt' | 'Networking' | 'Storage';
  }

  const apiGroupsData: ApiGroup[] = [
    { name: '', description: 'Core Kubernetes APIs (pods, services, etc.)', category: 'Core' },
    { name: 'apps', description: 'Deployments, StatefulSets, DaemonSets', category: 'Core' },
    { name: 'batch', description: 'Jobs and CronJobs', category: 'Core' },
    { name: 'rbac.authorization.k8s.io', description: 'Roles and role bindings', category: 'Core' },
    { name: 'kubeflow.org', description: 'Kubeflow resources (e.g. notebooks)', category: 'Core' },
    { name: 'image.openshift.io', description: 'OpenShift image streams', category: 'Core' },
    { name: 'infrastructure.opendatahub.io', description: 'Open Data Hub infrastructure (e.g. hardware profiles)', category: 'Core' },
    { name: 'kubevirt.io', description: 'KubeVirt virtualization APIs', category: 'KubeVirt' },
    { name: 'cdi.kubevirt.io', description: 'Containerized Data Importer', category: 'KubeVirt' },
    { name: 'instancetype.kubevirt.io', description: 'VM instance types', category: 'KubeVirt' },
    { name: 'networking.k8s.io', description: 'Network policies and ingress', category: 'Networking' },
    { name: 'k8s.cni.cncf.io', description: 'Network attachment definitions', category: 'Networking' },
    { name: 'storage.k8s.io', description: 'Storage classes and volume attachments', category: 'Storage' },
    { name: 'snapshot.storage.k8s.io', description: 'Volume snapshots', category: 'Storage' },
  ];

  const filteredApiGroups = React.useMemo(() => {
    let filtered = apiGroupsData;
    
    // Filter by category
    if (apiGroupsCategoryFilter !== 'All') {
      filtered = filtered.filter(group => group.category === apiGroupsCategoryFilter);
    }
    
    // Filter by search
    if (apiGroupsSearchValue.trim()) {
      const searchLower = apiGroupsSearchValue.toLowerCase();
      filtered = filtered.filter(group => 
        group.name.toLowerCase().includes(searchLower) ||
        group.description.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  }, [apiGroupsSearchValue, apiGroupsCategoryFilter]);

  const groupedApiGroups = React.useMemo(() => {
    const groups: Record<string, ApiGroup[]> = {};
    filteredApiGroups.forEach(group => {
      if (!groups[group.category]) {
        groups[group.category] = [];
      }
      groups[group.category].push(group);
    });
    return groups;
  }, [filteredApiGroups]);

  const handleAddApiGroup = (groupName: string) => {
    const rule = rules[editingRuleIndex];
    if (!rule) return;
    const currentGroups = rule.apiGroups.split(',').map((g) => g.trim()).filter((g) => g !== undefined);
    if (!currentGroups.includes(groupName)) {
      const newGroups = [...currentGroups, groupName].join(', ');
      updateRule(editingRuleIndex, { apiGroups: newGroups });
    }
  };

  // Resources data
  interface Resource {
    name: string;
    description: string;
    category: 'Core' | 'Apps' | 'Storage' | 'Networking' | 'RBAC';
  }

  const resourcesData: Resource[] = [
    { name: 'pods', description: 'Pod resources', category: 'Core' },
    { name: 'services', description: 'Service resources', category: 'Core' },
    { name: 'configmaps', description: 'ConfigMap resources', category: 'Core' },
    { name: 'secrets', description: 'Secret resources', category: 'Core' },
    { name: 'namespaces', description: 'Namespace resources', category: 'Core' },
    { name: 'events', description: 'Event resources', category: 'Core' },
    { name: 'notebooks', description: 'Kubeflow notebook resources', category: 'Apps' },
    { name: 'imagestreams', description: 'OpenShift image stream resources', category: 'Apps' },
    { name: 'hardwareprofiles', description: 'Hardware profile resources', category: 'Apps' },
    { name: 'deployments', description: 'Deployment resources', category: 'Apps' },
    { name: 'statefulsets', description: 'StatefulSet resources', category: 'Apps' },
    { name: 'daemonsets', description: 'DaemonSet resources', category: 'Apps' },
    { name: 'jobs', description: 'Job resources', category: 'Apps' },
    { name: 'cronjobs', description: 'CronJob resources', category: 'Apps' },
    { name: 'persistentvolumes', description: 'PersistentVolume resources', category: 'Storage' },
    { name: 'persistentvolumeclaims', description: 'PersistentVolumeClaim resources', category: 'Storage' },
    { name: 'persistentvolumeclaims/status', description: 'PersistentVolumeClaim status subresource', category: 'Storage' },
    { name: 'storageclasses', description: 'StorageClass resources', category: 'Storage' },
    { name: 'networkpolicies', description: 'NetworkPolicy resources', category: 'Networking' },
    { name: 'ingresses', description: 'Ingress resources', category: 'Networking' },
    { name: 'roles', description: 'Role resources', category: 'RBAC' },
    { name: 'rolebindings', description: 'RoleBinding resources', category: 'RBAC' },
    { name: 'clusterroles', description: 'ClusterRole resources', category: 'RBAC' },
    { name: 'clusterrolebindings', description: 'ClusterRoleBinding resources', category: 'RBAC' },
  ];

  const filteredResources = React.useMemo(() => {
    let filtered = resourcesData;
    
    // Filter by category
    if (resourcesCategoryFilter !== 'All') {
      filtered = filtered.filter(resource => resource.category === resourcesCategoryFilter);
    }
    
    // Filter by search
    if (resourcesSearchValue.trim()) {
      const searchLower = resourcesSearchValue.toLowerCase();
      filtered = filtered.filter(resource => 
        resource.name.toLowerCase().includes(searchLower) ||
        resource.description.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  }, [resourcesSearchValue, resourcesCategoryFilter]);

  const groupedResources = React.useMemo(() => {
    const groups: Record<string, Resource[]> = {};
    filteredResources.forEach(resource => {
      if (!groups[resource.category]) {
        groups[resource.category] = [];
      }
      groups[resource.category].push(resource);
    });
    return groups;
  }, [filteredResources]);

  const handleAddResource = (resourceName: string) => {
    const rule = rules[editingRuleIndex];
    if (!rule) return;
    const currentResources = rule.resources.split(',').map((r) => r.trim()).filter((r) => r);
    if (!currentResources.includes(resourceName)) {
      const newResources = [...currentResources, resourceName].join(', ');
      updateRule(editingRuleIndex, { resources: newResources });
    }
  };

  const breadcrumb = (
    <PageBreadcrumb>
      <Breadcrumb>
        <BreadcrumbItem to="/settings/user-management/roles">Roles</BreadcrumbItem>
        <BreadcrumbItem isActive>Create custom role</BreadcrumbItem>
      </Breadcrumb>
    </PageBreadcrumb>
  );

  return (
    <Drawer isExpanded={isResourcesDrawerOpen}>
      <DrawerContent
        panelContent={
          browseDrawerMode === 'apiGroups' ? (
            <BrowseDrawerPanelContent
              title="Browse API Groups"
              onClose={() => setIsResourcesDrawerOpen(false)}
              searchPlaceholder="Search API groups..."
              searchValue={apiGroupsSearchValue}
              onSearchChange={setApiGroupsSearchValue}
              searchAriaLabel="Search API groups"
              filterAriaLabel="API group category filter"
              toggleItems={[
                { buttonId: 'api-group-filter-all', text: 'All', isSelected: apiGroupsCategoryFilter === 'All', onChange: () => setApiGroupsCategoryFilter('All') },
                { buttonId: 'api-group-filter-core', text: 'Core', isSelected: apiGroupsCategoryFilter === 'Core', onChange: () => setApiGroupsCategoryFilter('Core') },
                { buttonId: 'api-group-filter-kubevirt', text: 'KubeVirt', isSelected: apiGroupsCategoryFilter === 'KubeVirt', onChange: () => setApiGroupsCategoryFilter('KubeVirt') },
                { buttonId: 'api-group-filter-networking', text: 'Networking', isSelected: apiGroupsCategoryFilter === 'Networking', onChange: () => setApiGroupsCategoryFilter('Networking') },
                { buttonId: 'api-group-filter-storage', text: 'Storage', isSelected: apiGroupsCategoryFilter === 'Storage', onChange: () => setApiGroupsCategoryFilter('Storage') },
              ]}
              categoryOrder={['Core', 'KubeVirt', 'Networking', 'Storage']}
              getItemsForCategory={(category) => groupedApiGroups[category] || []}
              onAddItem={handleAddApiGroup}
              getItemDisplayName={(name) => name || '(core)'}
            />
          ) : (
            <BrowseDrawerPanelContent
              title="Browse Resources"
              onClose={() => setIsResourcesDrawerOpen(false)}
              searchPlaceholder="Search resources..."
              searchValue={resourcesSearchValue}
              onSearchChange={setResourcesSearchValue}
              searchAriaLabel="Search resources"
              filterAriaLabel="Resource category filter"
              toggleItems={[
                { buttonId: 'resource-filter-all', text: 'All', isSelected: resourcesCategoryFilter === 'All', onChange: () => setResourcesCategoryFilter('All') },
                { buttonId: 'resource-filter-core', text: 'Core', isSelected: resourcesCategoryFilter === 'Core', onChange: () => setResourcesCategoryFilter('Core') },
                { buttonId: 'resource-filter-apps', text: 'Apps', isSelected: resourcesCategoryFilter === 'Apps', onChange: () => setResourcesCategoryFilter('Apps') },
                { buttonId: 'resource-filter-storage', text: 'Storage', isSelected: resourcesCategoryFilter === 'Storage', onChange: () => setResourcesCategoryFilter('Storage') },
                { buttonId: 'resource-filter-networking', text: 'Networking', isSelected: resourcesCategoryFilter === 'Networking', onChange: () => setResourcesCategoryFilter('Networking') },
                { buttonId: 'resource-filter-rbac', text: 'RBAC', isSelected: resourcesCategoryFilter === 'RBAC', onChange: () => setResourcesCategoryFilter('RBAC') },
              ]}
              categoryOrder={['Core', 'Apps', 'Storage', 'Networking', 'RBAC']}
              getItemsForCategory={(category) => groupedResources[category] || []}
              onAddItem={handleAddResource}
            />
          )
        }
      >
        <DrawerContentBody>
          {breadcrumb}
                <PageSection>
        <Title headingLevel="h1" size="2xl" style={{ marginBottom: 'var(--pf-v5-global--spacer--md)' }}>Create custom role</Title>
        <Content style={{ marginBottom: '16px', color: 'var(--pf-v5-global--Color--200)' }}>
          Create a custom role to control what users can see and do across your cluster resources. Define permissions, navigation access, and resource scopes to implement fine-grained access control.
        </Content>
        <Button variant="link" isInline style={{ paddingLeft: 0, marginBottom: '16px' }} onClick={() => { setTemplateModalMode('role'); setIsTemplateModalOpen(true); }}>
          Select templates
        </Button>

        <Grid hasGutter>
          <GridItem span={6}>
            <Card>
              <CardBody>
                <Split hasGutter>
                  <SplitItem isFilled>
                    <Title headingLevel="h2" size="lg">Role Configuration</Title>
                  </SplitItem>
                  <SplitItem>
                    <Button variant="link" isInline style={{ paddingLeft: 0, textDecoration: 'none' }}>Clear all</Button>
                  </SplitItem>
                </Split>

                <Form style={{ marginTop: '16px' }}>
                  <FormGroup
                    label="Role Name"
                    isRequired
                    fieldId="role-name"
                  >
                    <TextInput
                      id="role-name"
                      value={roleName}
                      onChange={(_event, value) => setRoleName(value)}
                    />
                    <Content component="small" style={{ color: 'var(--pf-v5-global--Color--200)' }}>
                      Use lowercase letters, numbers, and hyphens only
                    </Content>
                  </FormGroup>

                  <FormGroup
                    label="Labels"
                    fieldId="labels"
                  >
                    <Content component="p" style={{ color: 'var(--pf-v5-global--Color--200)', fontSize: 'var(--pf-v5-global--FontSize--sm)', marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
                      Add key/value labels to organize and find this role (for example by organization or team).
                    </Content>
                    {labels.map((label, index) => (
                      <Split key={index} hasGutter style={{ marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
                        <SplitItem isFilled>
                          <TextInput
                            id={`label-key-${index + 1}`}
                            value={label.key}
                            onChange={(_event, value) => {
                              setLabels((prev) => prev.map((l, i) => (i === index ? { ...l, key: value ?? '' } : l)));
                            }}
                            placeholder="Key (e.g., team, environment)"
                            aria-label="Label key"
                          />
                        </SplitItem>
                        <SplitItem isFilled>
                          <TextInput
                            id={`label-value-${index + 1}`}
                            value={label.value}
                            onChange={(_event, value) => {
                              setLabels((prev) => prev.map((l, i) => (i === index ? { ...l, value: value ?? '' } : l)));
                            }}
                            placeholder="Value (e.g., platform, production)"
                            aria-label="Label value"
                          />
                        </SplitItem>
                        <SplitItem>
                          <Button
                            variant="plain"
                            aria-label="Remove label"
                            onClick={() => setLabels((prev) => prev.filter((_, i) => i !== index))}
                          >
                            <MinusCircleIcon />
                          </Button>
                        </SplitItem>
                      </Split>
                    ))}
                    <Button
                      variant="link"
                      isInline
                      icon={<PlusIcon />}
                      style={{ paddingLeft: 0 }}
                      onClick={() => setLabels((prev) => [...prev, { key: '', value: '' }])}
                    >
                      Add label
                    </Button>
                  </FormGroup>

                  <FormGroup
                    label="Description"
                    fieldId="description"
                  >
                    <TextArea
                      id="description"
                      value={description}
                      onChange={(_event, value) => setDescription(value)}
                      placeholder="Explain what this role is for and who should use it"
                      rows={4}
                    />
                  </FormGroup>

                  <FormGroup
                    label="Category"
                    fieldId="category"
                  >
                    <Content component="p" style={{ color: 'var(--pf-v5-global--Color--200)', fontSize: 'var(--pf-v5-global--FontSize--sm)', marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
                      Assign this role to a category to help organize and filter roles.
                    </Content>
                    <TypeaheadSelect
                      key={`category-${category || 'none'}`}
                      initialOptions={categoryTypeaheadOptions}
                      placeholder="Select a category"
                      noOptionsFoundMessage={(filter) => `No category was found for "${filter}"`}
                      createOptionMessage={(newValue) => `Create "${newValue}"`}
                      onInputChange={(value) => {
                        setCategoryInputValue(value || '');
                      }}
                      onClearSelection={() => {
                        setCategory('');
                        setCategoryInputValue('');
                      }}
                      onSelect={(_ev, selection) => {
                        let selectedValue = String(selection);
                        // Skip divider selections
                        if (selectedValue === '__divider__') {
                          return;
                        }
                        // If the selection is a create option (starts with "Create"), extract just the value
                        if (selectedValue.startsWith('Create "') && selectedValue.endsWith('"')) {
                          selectedValue = selectedValue.slice('Create "'.length, -1);
                        }
                        // Clear the input value so the dropdown shows the selected value, not the input
                        setCategoryInputValue('');
                        setCategory(selectedValue);
                      }}
                      isCreatable={false}
                    />
                    <HelperText>
                      <HelperTextItem>
                        Select an existing category or type a new one to create it.
                      </HelperTextItem>
                    </HelperText>
                  </FormGroup>

                  <Divider style={{ margin: 'var(--pf-v5-global--spacer--lg) 0' }} />

                  <Split hasGutter style={{ marginTop: 'var(--pf-v5-global--spacer--lg)' }}>
                    <SplitItem isFilled>
                      <Title headingLevel="h3" size="md">Permission Rules</Title>
                    </SplitItem>
                    <SplitItem>
                      <SimpleDropdown
                        toggleContent="Add rule"
                        initialItems={[
                          { value: 'from-scratch', content: 'Add rule from scratch' },
                          { value: 'via-template', content: 'Add rule via template' },
                        ]}
                        onSelect={(_event, value) => {
                          if (value === 'from-scratch') {
                            handleAddRule();
                          } else if (value === 'via-template') {
                            setTemplateModalMode('rule');
                            setIsTemplateModalOpen(true);
                          }
                        }}
                      />
                    </SplitItem>
                  </Split>

                  {rules.map((rule, ruleIndex) => (
                    <div key={rule.id} data-rule-id={rule.id}>
                      <Card style={{ marginTop: ruleIndex === 0 ? 'var(--pf-v5-global--spacer--md)' : '16px', overflow: 'visible' }}>
                        <CardBody style={{ overflow: 'visible' }}>
                          <div style={{ position: 'relative', overflow: 'visible' }}>
                            <div style={{ minWidth: 0 }}>
                              <ExpandableSection
                              toggleText={`Rule ${ruleIndex + 1}`}
                              isExpanded={expandedRuleIds.has(rule.id) || (rules.length === 1 && expandedRuleIds.size === 0)}
                              onToggle={() => toggleRuleExpanded(rule.id)}
                            >
                              <FormGroup
                                label="API Groups"
                                fieldId={`api-groups-${ruleIndex}`}
                                style={{ marginTop: 'var(--pf-v5-global--spacer--md)' }}
                              >
                                <Content component="p" style={{ color: 'var(--pf-v5-global--Color--200)', fontSize: 'var(--pf-v5-global--FontSize--sm)' }}>
                                  Enter one or more API groups for this rule. Separate multiple values with commas.
                                </Content>
                                <TextInput
                                  id={`api-groups-${ruleIndex}`}
                                  value={rule.apiGroups}
                                  onChange={(_event, value) => updateRule(ruleIndex, { apiGroups: value ?? '' })}
                                  placeholder="Enter API groups (empty for core)"
                                />
                                <Button
                                  variant="link"
                                  isInline
                                  style={{ paddingLeft: 0, marginTop: 'var(--pf-v5-global--spacer--sm)' }}
                                  onClick={() => { setEditingRuleIndex(ruleIndex); setBrowseDrawerMode('apiGroups'); setIsResourcesDrawerOpen(true); }}
                                >
                                  Browse and select API groups
                                </Button>
                              </FormGroup>

                              <Divider style={{ margin: '16px 0' }} />

                              <FormGroup
                                label="Resources"
                                fieldId={`resources-${ruleIndex}`}
                              >
                                <Content component="p" style={{ color: 'var(--pf-v5-global--Color--200)', fontSize: 'var(--pf-v5-global--FontSize--sm)' }}>
                                  Enter one or more resource types for the selected API groups. Separate multiple values with commas.
                                </Content>
                                <TextInput
                                  id={`resources-${ruleIndex}`}
                                  value={rule.resources}
                                  onChange={(_event, value) => updateRule(ruleIndex, { resources: value ?? '' })}
                                  placeholder="Enter resources"
                                />
                                <Button
                                  variant="link"
                                  isInline
                                  style={{ paddingLeft: 0, marginTop: 'var(--pf-v5-global--spacer--sm)' }}
                                  onClick={() => { setEditingRuleIndex(ruleIndex); setBrowseDrawerMode('resources'); setIsResourcesDrawerOpen(true); }}
                                >
                                  Browse and select resources
                                </Button>
                              </FormGroup>

                              <Divider style={{ margin: '16px 0' }} />

                              <FormGroup
                                label="Verbs (Permissions)"
                                fieldId={`verbs-${ruleIndex}`}
                              >
                                <Split hasGutter style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
                                  <SplitItem isFilled>
                                    <Content component="p" style={{ color: 'var(--pf-v5-global--Color--200)', fontSize: 'var(--pf-v5-global--FontSize--sm)' }}>
                                      Select the actions this rule allows on the chosen resources.
                                    </Content>
                                  </SplitItem>
                                  <SplitItem>
                                    <Button variant="link" isInline style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)' }} onClick={() => (isAllCategoriesSelected(rule.verbs) ? handleDeselectAllCategories(ruleIndex) : handleSelectAllCategories(ruleIndex))}>
                                      {isAllCategoriesSelected(rule.verbs) ? 'Deselect all categories' : 'Select all categories'}
                                    </Button>
                                  </SplitItem>
                                </Split>

                                {/* Read Operations */}
                                <Card style={{ marginBottom: '16px' }}>
                                  <CardBody>
                                    <Split hasGutter style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
                                      <SplitItem isFilled>
                                        <Content style={{ fontWeight: 600, margin: 0 }}>Read Operations</Content>
                                        <Content component="small" style={{ color: 'var(--pf-v5-global--Color--200)', fontSize: 'var(--pf-v5-global--FontSize--sm)' }}>
                                          View and monitor resources
                                        </Content>
                                      </SplitItem>
                                      <SplitItem>
                                        <Button variant="link" isInline style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)' }} onClick={() => handleSelectAllOrDeselectAll(ruleIndex, 'read')}>
                                          {isCategoryAllSelected(rule.verbs, 'read') ? 'Deselect all' : 'Select all'}
                                        </Button>
                                      </SplitItem>
                                    </Split>
                                    <Grid hasGutter style={{ marginTop: '8px' }}>
                                      <GridItem span={4}>
                                        <Checkbox
                                          id={`verb-${ruleIndex}-get`}
                                          label={<><strong>Get</strong><br /><span style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)' }}>Read individual resources</span></>}
                                          isChecked={rule.verbs.get}
                                          onChange={(_event, checked) => handleVerbChange(ruleIndex, 'get', checked ?? false)}
                                        />
                                      </GridItem>
                                      <GridItem span={4}>
                                        <Checkbox
                                          id={`verb-${ruleIndex}-list`}
                                          label={<><strong>List</strong><br /><span style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)' }}>List multiple resources</span></>}
                                          isChecked={rule.verbs.list}
                                          onChange={(_event, checked) => handleVerbChange(ruleIndex, 'list', checked ?? false)}
                                        />
                                      </GridItem>
                                      <GridItem span={4}>
                                        <Checkbox
                                          id={`verb-${ruleIndex}-watch`}
                                          label={<><strong>Watch</strong><br /><span style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)' }}>Watch for resource changes</span></>}
                                          isChecked={rule.verbs.watch}
                                          onChange={(_event, checked) => handleVerbChange(ruleIndex, 'watch', checked ?? false)}
                                        />
                                      </GridItem>
                                    </Grid>
                                  </CardBody>
                                </Card>

                                {/* Write Operations */}
                                <Card style={{ marginBottom: '16px' }}>
                                  <CardBody>
                                    <Split hasGutter style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
                                      <SplitItem isFilled>
                                        <Content style={{ fontWeight: 600, margin: 0 }}>Write Operations</Content>
                                        <Content component="small" style={{ color: 'var(--pf-v5-global--Color--200)', fontSize: 'var(--pf-v5-global--FontSize--sm)' }}>Create and modify resources</Content>
                                      </SplitItem>
                                      <SplitItem>
                                        <Button variant="link" isInline style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)' }} onClick={() => handleSelectAllOrDeselectAll(ruleIndex, 'write')}>{isCategoryAllSelected(rule.verbs, 'write') ? 'Deselect all' : 'Select all'}</Button>
                                      </SplitItem>
                                    </Split>
                                    <Grid hasGutter style={{ marginTop: '8px' }}>
                                      <GridItem span={4}>
                                        <Checkbox id={`verb-${ruleIndex}-create`} label={<><strong>Create</strong><br /><span style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)' }}>Create new resources</span></>} isChecked={rule.verbs.create} onChange={(_event, checked) => handleVerbChange(ruleIndex, 'create', checked ?? false)} />
                                      </GridItem>
                                      <GridItem span={4}>
                                        <Checkbox id={`verb-${ruleIndex}-update`} label={<><strong>Update</strong><br /><span style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)' }}>Update existing resources</span></>} isChecked={rule.verbs.update} onChange={(_event, checked) => handleVerbChange(ruleIndex, 'update', checked ?? false)} />
                                      </GridItem>
                                      <GridItem span={4}>
                                        <Checkbox id={`verb-${ruleIndex}-patch`} label={<><strong>Patch</strong><br /><span style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)' }}>Partially update resources</span></>} isChecked={rule.verbs.patch} onChange={(_event, checked) => handleVerbChange(ruleIndex, 'patch', checked ?? false)} />
                                      </GridItem>
                                    </Grid>
                                  </CardBody>
                                </Card>

                                {/* Delete Operations */}
                                <Card style={{ marginBottom: '16px' }}>
                                  <CardBody>
                                    <Split hasGutter style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
                                      <SplitItem isFilled>
                                        <Content style={{ fontWeight: 600, margin: 0 }}>Delete Operations</Content>
                                        <Content component="small" style={{ color: 'var(--pf-v5-global--Color--200)', fontSize: 'var(--pf-v5-global--FontSize--sm)' }}>Remove resources</Content>
                                      </SplitItem>
                                      <SplitItem>
                                        <Button variant="link" isInline style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)' }} onClick={() => handleSelectAllOrDeselectAll(ruleIndex, 'delete')}>{isCategoryAllSelected(rule.verbs, 'delete') ? 'Deselect all' : 'Select all'}</Button>
                                      </SplitItem>
                                    </Split>
                                    <Grid hasGutter style={{ marginTop: '8px' }}>
                                      <GridItem span={4}>
                                        <Checkbox id={`verb-${ruleIndex}-delete`} label={<><strong>Delete</strong><br /><span style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)' }}>Delete individual resources</span></>} isChecked={rule.verbs.delete} onChange={(_event, checked) => handleVerbChange(ruleIndex, 'delete', checked ?? false)} />
                                      </GridItem>
                                      <GridItem span={4}>
                                        <Checkbox id={`verb-${ruleIndex}-deletecollection`} label={<><strong>Delete Collection</strong><br /><span style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)' }}>Delete multiple resources at once</span></>} isChecked={rule.verbs.deletecollection} onChange={(_event, checked) => handleVerbChange(ruleIndex, 'deletecollection', checked ?? false)} />
                                      </GridItem>
                                    </Grid>
                                  </CardBody>
                                </Card>

                                {/* Advanced Operations */}
                                <Card>
                                  <CardBody>
                                    <Split hasGutter style={{ marginBottom: 'var(--pf-v5-global--spacer--sm)' }}>
                                      <SplitItem isFilled>
                                        <Content style={{ fontWeight: 600, margin: 0 }}>Advanced Operations</Content>
                                        <Content component="small" style={{ color: 'var(--pf-v5-global--Color--200)', fontSize: 'var(--pf-v5-global--FontSize--sm)' }}>Special permissions (use with caution)</Content>
                                      </SplitItem>
                                      <SplitItem>
                                        <Button variant="link" isInline style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)' }} onClick={() => handleSelectAllOrDeselectAll(ruleIndex, 'advanced')}>{isCategoryAllSelected(rule.verbs, 'advanced') ? 'Deselect all' : 'Select all'}</Button>
                                      </SplitItem>
                                    </Split>
                                    <Grid hasGutter style={{ marginTop: '8px' }}>
                                      <GridItem span={4}>
                                        <Checkbox id={`verb-${ruleIndex}-bind`} label={<><strong>Bind</strong><br /><span style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)' }}>Bind roles to users or groups</span></>} isChecked={rule.verbs.bind} onChange={(_event, checked) => handleVerbChange(ruleIndex, 'bind', checked ?? false)} />
                                      </GridItem>
                                      <GridItem span={4}>
                                        <Checkbox id={`verb-${ruleIndex}-escalate`} label={<><strong>Escalate</strong><br /><span style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)' }}>Grant permissions above current role</span></>} isChecked={rule.verbs.escalate} onChange={(_event, checked) => handleVerbChange(ruleIndex, 'escalate', checked ?? false)} />
                                      </GridItem>
                                      <GridItem span={4}>
                                        <Checkbox id={`verb-${ruleIndex}-impersonate`} label={<><strong>Impersonate</strong><br /><span style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)' }}>Impersonate another user</span></>} isChecked={rule.verbs.impersonate} onChange={(_event, checked) => handleVerbChange(ruleIndex, 'impersonate', checked ?? false)} />
                                      </GridItem>
                                      <GridItem span={4} style={{ minWidth: 0 }}>
                                        <div style={{ minWidth: 0, maxWidth: '100%' }}>
                                          <Checkbox id={`verb-${ruleIndex}-use`} label={<><strong>Use</strong><br /><span style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)', display: 'block', wordBreak: 'break-word', overflowWrap: 'break-word' }}>Use named resources (e.g., SecurityContextConstraints)</span></>} isChecked={rule.verbs.use} onChange={(_event, checked) => handleVerbChange(ruleIndex, 'use', checked ?? false)} />
                                        </div>
                                      </GridItem>
                                      <GridItem span={4}>
                                        <Checkbox id={`verb-${ruleIndex}-approve`} label={<><strong>Approve</strong><br /><span style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)' }}>Approve certificate signing requests</span></>} isChecked={rule.verbs.approve} onChange={(_event, checked) => handleVerbChange(ruleIndex, 'approve', checked ?? false)} />
                                      </GridItem>
                                      <GridItem span={4}>
                                        <Checkbox id={`verb-${ruleIndex}-all`} label={<><strong>All (*)</strong><br /><span style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)', color: 'var(--pf-v5-global--Color--200)' }}>All operations (admin level)</span></>} isChecked={rule.verbs.all} onChange={(_event, checked) => handleVerbChange(ruleIndex, 'all', checked ?? false)} />
                                      </GridItem>
                                    </Grid>
                                  </CardBody>
                                </Card>
                              </FormGroup>
                            </ExpandableSection>
                          </div>
                          {rules.length > 1 && (
                            <Button variant="link" isDanger onClick={() => handleRemoveRule(ruleIndex)} style={{ position: 'absolute', right: 0, top: 0 }}>
                              Remove rule
                            </Button>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                    </div>
                  ))}
                </Form>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem span={6}>
            <Card isFullHeight>
              <CardBody>
                <Split hasGutter style={{ marginBottom: 'var(--pf-v5-global--spacer--md)' }}>
                  <SplitItem isFilled>
                    <Title headingLevel="h2" size="lg">Live YAML</Title>
                  </SplitItem>
                  <SplitItem>
                    <Button variant="plain" aria-label="Download YAML" icon={<DownloadIcon />} />
                  </SplitItem>
                </Split>
                <Content component="small" style={{ color: 'var(--pf-v5-global--Color--200)', marginBottom: 'var(--pf-v5-global--spacer--md)' }}>
                  Auto-generated from the form. You can manually edit the YAML directly.
                </Content>
                <div style={{ position: 'relative' }}>
                  <TextArea
                    value={yamlContent}
                    onChange={(_event, value) => setYamlContent(value)}
                    aria-label="YAML editor"
                    style={{ fontFamily: 'monospace', fontSize: '14px', minHeight: '600px', resize: 'vertical' }}
                  />
                </div>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </PageSection>

      <section className="pf-v6-c-page__main-section pf-m-sticky-bottom" aria-label="Create role actions">
        <div className="pf-v6-l-stack pf-m-gutter">
          <div className="pf-v6-l-stack__item">
            <div className="pf-v6-l-stack pf-m-gutter">
              <div className="pf-v6-l-stack__item">
                <div className="pf-v6-c-action-list">
                  <div className="pf-v6-c-action-list__item">
                    <Button variant="primary" onClick={handleSubmit}>Create Role</Button>
                  </div>
                  <div className="pf-v6-c-action-list__item">
                    <Button variant="link" onClick={handleCancel}>Cancel</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Template Selection Modal - reused for both role templates and rule templates */}
      <Modal
        variant={ModalVariant.large}
        isOpen={isTemplateModalOpen}
        onClose={() => {
          setIsTemplateModalOpen(false);
          setTemplateSearchValue('');
          setRuleTemplateSearchValue('');
        }}
        aria-labelledby={templateModalMode === 'role' ? 'template-modal-title' : 'rule-template-modal-title'}
      >
        <ModalHeader title={templateModalMode === 'role' ? 'Select template' : 'Select rule template'} />
        <ModalBody>
          <TemplateTable
            searchPlaceholder="Search templates"
            searchValue={templateModalMode === 'role' ? templateSearchValue : ruleTemplateSearchValue}
            onSearchChange={templateModalMode === 'role' ? setTemplateSearchValue : setRuleTemplateSearchValue}
            searchAriaLabel="Search templates"
            items={templateModalMode === 'role' ? filteredTemplates : filteredRuleTemplates}
            emptyMessage="No templates found matching your search."
            actionLabel={templateModalMode === 'role' ? 'Use template' : 'Add'}
            onAction={templateModalMode === 'role' ? handleUseTemplate : addRulesFromRoleTemplate}
            tableAriaLabel={templateModalMode === 'role' ? 'Role templates table' : 'Rule templates table'}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="link" onClick={() => {
            setIsTemplateModalOpen(false);
            setTemplateSearchValue('');
            setRuleTemplateSearchValue('');
          }}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
};

export { CreateRole };
