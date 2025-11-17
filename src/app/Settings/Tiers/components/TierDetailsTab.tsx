import * as React from 'react';
import {
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
  PageSection,
  Badge,
  Flex,
  FlexItem,
  Content,
  ContentVariants,
  Alert,
  Popover,
  Button,
} from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons';
import { Tier } from '../types';
import { getGroupById, getModelById } from '../mockData';

interface TierDetailsTabProps {
  tier: Tier;
}

const TierDetailsTab: React.FunctionComponent<TierDetailsTabProps> = ({ tier }) => {
  const renderModelsList = (modelIds: string[]) => {
    if (modelIds.length === 0) {
      return <span style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>No models assigned</span>;
    }

    return (
      <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsXs' }}>
        {modelIds.map(id => {
          const model = getModelById(id);
          return model ? (
            <FlexItem key={id}>{model.name}</FlexItem>
          ) : (
            <FlexItem key={id}>{id}</FlexItem>
          );
        })}
      </Flex>
    );
  };

  const renderGroupsList = (groupIds: string[]) => {
    if (groupIds.length === 0) {
      return <span style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>No groups assigned</span>;
    }

    return (
      <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsXs' }}>
        {groupIds.map(id => {
          const group = getGroupById(id);
          return group ? (
            <FlexItem key={id}>{group.name}</FlexItem>
          ) : (
            <FlexItem key={id}>{id}</FlexItem>
          );
        })}
      </Flex>
    );
  };

  const renderLimits = () => {
    const hasLimits = tier.limits.tokenLimit || tier.limits.rateLimit || tier.limits.apiKeyExpirationDays !== undefined;
    
    if (!hasLimits) {
      return <span style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>No limits configured</span>;
    }

    return (
      <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
        {tier.limits.tokenLimit && (
          <FlexItem>
            <strong>Token limit:</strong> {tier.limits.tokenLimit.amount.toLocaleString()} tokens per {tier.limits.tokenLimit.period}
          </FlexItem>
        )}
        {tier.limits.rateLimit && (
          <FlexItem>
            <strong>Rate limit:</strong> {tier.limits.rateLimit.amount.toLocaleString()} requests per {tier.limits.rateLimit.period}
          </FlexItem>
        )}
        {tier.limits.apiKeyExpirationDays !== undefined && (
          <FlexItem>
            <strong>API key expiration:</strong>{' '}
            {tier.limits.apiKeyExpirationDays === 0 
              ? 'Never expires' 
              : `${tier.limits.apiKeyExpirationDays} days`}
          </FlexItem>
        )}
      </Flex>
    );
  };

  return (
    <PageSection>
      {tier.isReadOnly && tier.gitSource && (
        <Alert 
          variant="info" 
          isInline 
          title="This tier is managed in git"
          id="tier-git-managed-alert"
        >
          This tier is managed in git. To make changes, please edit the tier in the{' '}
          <a href={tier.gitSource} target="_blank" rel="noopener noreferrer">
            Git source
          </a>{' '}
          because editing is disabled in-Console.
        </Alert>
      )}

      <Content component={ContentVariants.h2} id="tier-details-heading">
        Tier details
      </Content>
      <DescriptionList columnModifier={{ default: '2Col' }}>
        <DescriptionListGroup>
          <DescriptionListTerm>Name</DescriptionListTerm>
          <DescriptionListDescription>{tier.name}</DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup>
          <DescriptionListTerm>Description</DescriptionListTerm>
          <DescriptionListDescription>
            {tier.description || 'No description provided'}
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup>
          <DescriptionListTerm>
            <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
              <FlexItem>Level</FlexItem>
              <FlexItem>
                <Popover
                  aria-label="Level information"
                  headerContent="Tier level"
                  bodyContent={
                    <div>
                      <p style={{ marginBottom: '0.5rem' }}>
                        Numeric hierarchy for tier precedence. Higher numbers indicate higher tiers.
                      </p>
                      <p style={{ marginBottom: '0.5rem' }}>
                        When a user belongs to multiple groups, the highest level tier is selected.
                      </p>
                      <p style={{ margin: 0 }}>
                        <strong>Examples:</strong> 1 (lowest), 10 (medium), 20 (highest)
                      </p>
                    </div>
                  }
                >
                  <Button
                    variant="plain"
                    aria-label="More info for tier level"
                    id="tier-level-help-button"
                    style={{ padding: 0, minWidth: 'auto' }}
                  >
                    <HelpIcon />
                  </Button>
                </Popover>
              </FlexItem>
            </Flex>
          </DescriptionListTerm>
          <DescriptionListDescription>
            <Badge id="tier-level-badge" isRead>Level {tier.level}</Badge>
          </DescriptionListDescription>
        </DescriptionListGroup>

        {tier.gitSource && (
          <DescriptionListGroup>
            <DescriptionListTerm>Git source</DescriptionListTerm>
            <DescriptionListDescription>
              <a href={tier.gitSource} target="_blank" rel="noopener noreferrer" id="git-source-link">
                {tier.gitSource}
              </a>
            </DescriptionListDescription>
          </DescriptionListGroup>
        )}

        {!tier.gitSource && (
          <DescriptionListGroup>
            <DescriptionListTerm>Git source</DescriptionListTerm>
            <DescriptionListDescription>None</DescriptionListDescription>
          </DescriptionListGroup>
        )}
      </DescriptionList>

      <Content component={ContentVariants.h2} id="groups-heading" style={{ marginTop: '2rem' }}>
        Groups
      </Content>
      <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '1rem' }}>
        All users in these groups will have access to this tier's models and inherit its limits.
      </div>
      <DescriptionList>
        <DescriptionListGroup>
          <DescriptionListTerm>Assigned groups</DescriptionListTerm>
          <DescriptionListDescription>
            {renderGroupsList(tier.groups)}
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>

      <Content component={ContentVariants.h2} id="models-heading" style={{ marginTop: '2rem' }}>
        Models
      </Content>
      <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '1rem' }}>
        Only AI asset model endpoints can be assigned to tiers.
      </div>
      <DescriptionList>
        <DescriptionListGroup>
          <DescriptionListTerm>Available models in this tier</DescriptionListTerm>
          <DescriptionListDescription>
            {renderModelsList(tier.models)}
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>

      <Content component={ContentVariants.h2} id="limits-heading" style={{ marginTop: '2rem' }}>
        Limits
      </Content>
      <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '1rem' }}>
        These limits apply to all API keys created by users in this tier's groups.
      </div>
      <DescriptionList>
        <DescriptionListGroup>
          <DescriptionListTerm>Configured limits</DescriptionListTerm>
          <DescriptionListDescription>
            {renderLimits()}
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </PageSection>
  );
};

export { TierDetailsTab };

