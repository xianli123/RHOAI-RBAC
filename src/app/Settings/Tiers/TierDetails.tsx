import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  PageSection,
  Content,
  ContentVariants,
  Breadcrumb,
  BreadcrumbItem,
  Alert,
  PageBreadcrumb,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  Flex,
  FlexItem,
  Tabs,
  Tab,
  TabTitleText,
} from '@patternfly/react-core';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { getTierById } from './mockData';
import { TierDetailsTab } from './components/TierDetailsTab';
import { DeleteTierModal } from './components/DeleteTierModal';

const TierDetails: React.FunctionComponent = () => {
  const { tierId } = useParams<{ tierId: string }>();
  const navigate = useNavigate();
  const [isActionsOpen, setIsActionsOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [activeTabKey, setActiveTabKey] = React.useState<number>(0);

  useDocumentTitle('Tier Details');

  const tier = tierId ? getTierById(tierId) : undefined;

  const handleEditTier = () => {
    navigate(`/settings/tiers/${tierId}/edit`);
  };

  const handleDeleteTier = () => {
    setIsDeleteModalOpen(true);
    setIsActionsOpen(false);
  };

  const handleConfirmDelete = () => {
    // Delete the tier and navigate back to the list
    console.log('Tier deleted:', tierId);
    navigate('/settings/tiers');
  };

  const handleTabSelect = (
    _event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex as number);
  };

  if (!tier) {
    return (
      <PageSection>
        <Alert variant="danger" title="Tier not found">
          The requested tier could not be found.
        </Alert>
      </PageSection>
    );
  }

  const breadcrumb = (
    <PageBreadcrumb>
      <Breadcrumb>
        <BreadcrumbItem to="/settings/tiers">Tiers</BreadcrumbItem>
        <BreadcrumbItem isActive>{tier.name}</BreadcrumbItem>
      </Breadcrumb>
    </PageBreadcrumb>
  );

  return (
    <>
      {breadcrumb}
      <PageSection>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <Content component={ContentVariants.h1}>{tier.name}</Content>
          </FlexItem>
          <FlexItem>
            <Dropdown
              isOpen={isActionsOpen}
              onOpenChange={(isOpen: boolean) => setIsActionsOpen(isOpen)}
              toggle={(toggleRef: React.Ref<HTMLButtonElement>) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={() => setIsActionsOpen(!isActionsOpen)}
                  isExpanded={isActionsOpen}
                  variant="secondary"
                  id="tier-details-actions-toggle"
                >
                  Actions
                </MenuToggle>
              )}
              popperProps={{ position: 'right' }}
              id="tier-details-actions-dropdown"
            >
              <DropdownList>
                <DropdownItem key="edit" onClick={handleEditTier} id="tier-details-edit-action">
                  Edit tier
                </DropdownItem>
                <DropdownItem key="delete" onClick={handleDeleteTier} id="tier-details-delete-action">
                  Delete tier
                </DropdownItem>
              </DropdownList>
            </Dropdown>
          </FlexItem>
        </Flex>
      </PageSection>

      <PageSection type="tabs">
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabSelect}
          aria-label="Tier details tabs"
          role="region"
          id="tier-details-tabs"
        >
          <Tab eventKey={0} title={<TabTitleText>Details</TabTitleText>} aria-label="Details tab">
            <TierDetailsTab tier={tier} />
          </Tab>
        </Tabs>
      </PageSection>

      <DeleteTierModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        tier={tier}
        onDelete={handleConfirmDelete}
      />
    </>
  );
};

export { TierDetails };

