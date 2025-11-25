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
  Popover,
  Button,
  Divider,
} from '@patternfly/react-core';
import { HelpIcon, ExternalLinkAltIcon } from '@patternfly/react-icons';
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
          const groupName = group ? group.name : id;
          return (
            <FlexItem key={id}>
              <Popover
                aria-label="Group link information"
                headerContent="External link"
                bodyContent={
                  <div style={{ color: 'deeppink' }}>
                    This link will take users to the relevant Group Details page of the OpenShift Web Console.
                  </div>
                }
              >
                <Button
                  variant="link"
                  isInline
                  icon={<ExternalLinkAltIcon />}
                  iconPosition="right"
                  style={{ padding: 0, fontSize: 'inherit' }}
                  id={`group-link-${id}`}
                >
                  {groupName}
                </Button>
              </Popover>
            </FlexItem>
          );
        })}
      </Flex>
    );
  };

  const renderLimits = () => {
    const hasLimits = tier.limits.tokenLimit || tier.limits.rateLimit;
    
    if (!hasLimits) {
      return <span style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>No limits configured</span>;
    }

    const formatPeriod = (period: string): string => {
      switch (period) {
        case 'minute':
          return 'min';
        case 'hour':
          return 'hr';
        case 'day':
          return 'day';
        default:
          return period;
      }
    };

    return (
      <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
        {tier.limits.tokenLimit && (
          <FlexItem>
            <strong>Token limit:</strong> {tier.limits.tokenLimit.amount.toLocaleString()} tokens/{formatPeriod(tier.limits.tokenLimit.period)}
          </FlexItem>
        )}
        {tier.limits.rateLimit && (
          <FlexItem>
            <strong>Rate limit:</strong> {tier.limits.rateLimit.amount.toLocaleString()} requests/{formatPeriod(tier.limits.rateLimit.period)}
          </FlexItem>
        )}
      </Flex>
    );
  };

  return (
    <PageSection>
      <Content component={ContentVariants.h2} id="tier-details-heading" style={{ marginTop: '1rem' }}>
        Tier details
      </Content>
      <DescriptionList columnModifier={{ default: '2Col' }}>
        <DescriptionListGroup>
          <DescriptionListTerm>Name</DescriptionListTerm>
          <DescriptionListDescription>{tier.name}</DescriptionListDescription>
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
                        Higher numbers indicate higher tiers.
                      </p>
                      <p style={{ marginBottom: '0.5rem' }}>
                        When a user belongs to multiple groups, the highest level tier is selected.
                      </p>
                      <p style={{ margin: 0 }}>
                        <strong>Example:</strong> 1 (lowest), 10 (medium), 100 (highest)
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
            <Badge id="tier-level-badge" isRead>{tier.level}</Badge>
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup>
          <DescriptionListTerm>Description</DescriptionListTerm>
          <DescriptionListDescription>
            {tier.description || 'No description provided'}
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup>
          <DescriptionListTerm>Default expiration</DescriptionListTerm>
          <DescriptionListDescription>
            {tier.limits.apiKeyExpirationDays === 0 
              ? 'Never expires' 
              : tier.limits.apiKeyExpirationDays !== undefined && tier.limits.apiKeyExpirationDays < 1
              ? `${Math.round(tier.limits.apiKeyExpirationDays * 24)} hours`
              : `${tier.limits.apiKeyExpirationDays} days`}
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>

      <Divider style={{ marginTop: '2rem', marginBottom: '2rem' }} />

      <Content component={ContentVariants.h2} id="groups-heading">
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

      <Divider style={{ marginTop: '2rem', marginBottom: '2rem' }} />

      <Content component={ContentVariants.h2} id="models-heading">
        Models
      </Content>
      <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '1rem' }}>
        These AI asset models will be available to users who can access this tier.
      </div>
      <DescriptionList>
        <DescriptionListGroup>
          <DescriptionListTerm>Available models</DescriptionListTerm>
          <DescriptionListDescription>
            {renderModelsList(tier.models)}
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>

      <Divider style={{ marginTop: '2rem', marginBottom: '2rem' }} />

      <Content component={ContentVariants.h2} id="limits-heading">
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

