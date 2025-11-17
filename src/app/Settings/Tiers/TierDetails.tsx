import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  PageSection,
  Content,
  ContentVariants,
  Tabs,
  Tab,
  TabTitleText,
  Breadcrumb,
  BreadcrumbItem,
  Alert,
  PageBreadcrumb,
  Badge,
} from '@patternfly/react-core';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { getTierById } from './mockData';
import { TierDetailsTab } from './components/TierDetailsTab';
import { CodeBlock, CodeBlockCode } from '@patternfly/react-core';

type TabKey = 'details' | 'yaml';

const TierDetails: React.FunctionComponent = () => {
  const { tierId, tab } = useParams<{ tierId: string; tab?: string }>();
  const navigate = useNavigate();
  const [activeTabKey, setActiveTabKey] = React.useState<TabKey>((tab as TabKey) || 'details');

  useDocumentTitle('Tier Details');

  const tier = tierId ? getTierById(tierId) : undefined;

  React.useEffect(() => {
    if (tab && ['details', 'yaml'].includes(tab)) {
      setActiveTabKey(tab as TabKey);
    }
  }, [tab]);

  const handleTabSelect = (
    _event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    const newTab = tabIndex as TabKey;
    setActiveTabKey(newTab);
    navigate(`/settings/tiers/${tierId}/${newTab}`, { replace: true });
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
        <Content component={ContentVariants.h1}>{tier.name}</Content>
        <Badge id={`tier-status-badge-${tier.id}`} isRead={tier.status === 'Inactive'}>
          {tier.status}
        </Badge>
        {' '}
        <Badge id={`tier-level-badge-${tier.id}`} isRead>
          Level {tier.level}
        </Badge>
      </PageSection>

      <PageSection type="tabs">
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabSelect}
          aria-label="Tier details tabs"
          role="region"
          id="tier-details-tabs"
        >
          <Tab eventKey="details" title={<TabTitleText>Details</TabTitleText>} aria-label="Details tab">
            <TierDetailsTab tier={tier} />
          </Tab>
          <Tab eventKey="yaml" title={<TabTitleText>YAML</TabTitleText>} aria-label="YAML tab">
            <PageSection>
              <CodeBlock id="tier-yaml-code">
                <CodeBlockCode>
                  {tier.yaml || '# No YAML available for this tier'}
                </CodeBlockCode>
              </CodeBlock>
            </PageSection>
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export { TierDetails };

