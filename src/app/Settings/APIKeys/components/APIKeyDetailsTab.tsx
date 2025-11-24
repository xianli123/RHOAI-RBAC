import * as React from 'react';
import {
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
  PageSection,
  Content,
  ContentVariants,
  Divider,
  CodeBlock,
  CodeBlockCode,
} from '@patternfly/react-core';
import { APIKey } from '../types';

interface APIKeyDetailsTabProps {
  apiKey: APIKey;
}

const APIKeyDetailsTab: React.FunctionComponent<APIKeyDetailsTabProps> = ({ apiKey }) => {
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <PageSection>
      <Content component={ContentVariants.h2} id="api-key-details-heading" style={{ marginTop: '1rem' }}>
        Details
      </Content>
      <DescriptionList columnModifier={{ default: '2Col' }}>
        <DescriptionListGroup>
          <DescriptionListTerm>Name</DescriptionListTerm>
          <DescriptionListDescription>{apiKey.name}</DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup>
          <DescriptionListTerm>Date created</DescriptionListTerm>
          <DescriptionListDescription>
            {formatDate(apiKey.dateCreated)}
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup>
          <DescriptionListTerm>Owner</DescriptionListTerm>
          <DescriptionListDescription>
            {apiKey.owner.name}
          </DescriptionListDescription>
        </DescriptionListGroup>

        {apiKey.limits?.expirationDate && (
          <DescriptionListGroup>
            <DescriptionListTerm>Expiration date</DescriptionListTerm>
            <DescriptionListDescription>
              {formatDate(apiKey.limits.expirationDate)}
            </DescriptionListDescription>
          </DescriptionListGroup>
        )}
      </DescriptionList>

      <Divider style={{ marginTop: '2rem', marginBottom: '2rem' }} />

      <Content component={ContentVariants.h2} id="usage-example-heading">
        Usage example
      </Content>
      <div style={{ fontSize: '0.875rem', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '1rem' }}>
        Use this API key to authenticate requests to the chat completions endpoint:
      </div>
      <CodeBlock id="usage-example-code">
        <CodeBlockCode>
{`curl -X POST https://api.example.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <key-value-here>" \\
  -d '{
    "model": "gpt-oss-20b",
    "messages": [
      {
        "role": "user",
        "content": "Hello, how are you?"
      }
    ],
    "temperature": 0.7,
    "max_tokens": 150
  }'`}
        </CodeBlockCode>
      </CodeBlock>
    </PageSection>
  );
};

export { APIKeyDetailsTab };
