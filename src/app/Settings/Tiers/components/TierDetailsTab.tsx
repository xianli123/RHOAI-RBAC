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
    const hasLimits = (tier.limits.tokenLimits && tier.limits.tokenLimits.length > 0) || 
                      (tier.limits.rateLimits && tier.limits.rateLimits.length > 0);
    
    if (!hasLimits) {
      return <span style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>No limits configured</span>;
    }

    const formatUnit = (quantity: number, unit: string): string => {
      const unitLabel = quantity === 1 ? unit : `${unit}s`;
      return `${quantity} ${unitLabel}`;
    };

    return (
      <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
        {tier.limits.tokenLimits && tier.limits.tokenLimits.length > 0 && (
          <>
            <FlexItem>
              <strong>Token limits:</strong>
            </FlexItem>
            {tier.limits.tokenLimits.map((limit, index) => (
              <FlexItem key={limit.id} style={{ marginLeft: '1rem' }}>
                {limit.amount.toLocaleString()} tokens per {formatUnit(limit.quantity, limit.unit)}
              </FlexItem>
            ))}
          </>
        )}
        {tier.limits.rateLimits && tier.limits.rateLimits.length > 0 && (
          <>
            <FlexItem>
              <strong>Request rate limits:</strong>
            </FlexItem>
            {tier.limits.rateLimits.map((limit, index) => (
              <FlexItem key={limit.id} style={{ marginLeft: '1rem' }}>
                {limit.amount.toLocaleString()} requests per {formatUnit(limit.quantity, limit.unit)}
              </FlexItem>
            ))}
          </>
        )}
      </Flex>
    );
  };

  return (
    <PageSection>
      <Content component={ContentVariants.h2} id="tier-details-heading" style={{ marginTop: '1rem' }}>
        Details
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
      </DescriptionList>

      <Divider style={{ marginTop: '2rem', marginBottom: '2rem' }} />

      <Content component={ContentVariants.h2} id="groups-heading">
        Groups
      </Content>
      <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '1rem' }}>
        Users in these groups will have access to this tier's models.
      </div>
      <DescriptionList>
        <DescriptionListGroup>
          <DescriptionListTerm>Groups</DescriptionListTerm>
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
        These models will be available to users who can access this tier.
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
        These limits will apply to every API key created by users in this tier's groups.
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

