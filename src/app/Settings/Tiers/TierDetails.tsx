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
import { CodeEditor, Language } from '@patternfly/react-code-editor';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { getTierById } from './mockData';
import { TierDetailsTab } from './components/TierDetailsTab';

type TabKey = 'details' | 'yaml';

// ConfigMap YAML used for all tiers
const TIER_CONFIG_YAML = `apiVersion: v1
kind: ConfigMap
metadata:
  name: tier-to-group-mapping
  namespace: maas-api
data:
  tiers: |
    - name: free
      description: Free tier for basic users
      level: 1
      groups:
      - system:authenticated
    - name: premium
      description: Premium tier
      level: 10
      groups:
      - premium-users
    - name: enterprise
      description: Enterprise tier
      level: 20
      groups:
      - enterprise-users`;

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
        {tier.description && (
          <Content component={ContentVariants.p} style={{ marginTop: '0.5rem', color: 'var(--pf-t--global--text--color--subtle)' }}>
            {tier.description}
          </Content>
        )}
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
              <CodeEditor
                id="tier-yaml-code-editor"
                code={TIER_CONFIG_YAML}
                language={Language.yaml}
                isDarkTheme
                isLineNumbersVisible
                isReadOnly
                height="400px"
              />
            </PageSection>
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};

export { TierDetails };

