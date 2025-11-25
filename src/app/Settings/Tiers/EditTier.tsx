import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  PageSection,
  Content,
  ContentVariants,
  Breadcrumb,
  BreadcrumbItem,
  PageBreadcrumb,
  Alert,
} from '@patternfly/react-core';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { TierForm } from './components/TierForm';
import { CreateTierForm } from './types';
import { getTierById } from './mockData';

const EditTier: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const { tierId } = useParams<{ tierId: string }>();
  const tier = tierId ? getTierById(tierId) : undefined;

  const [formData, setFormData] = React.useState<CreateTierForm>({
    name: tier?.name || '',
    description: tier?.description || '',
    level: tier?.level || 1,
    groups: tier?.groups || [],
    models: tier?.models || [],
    limits: tier?.limits || {},
  });

  useDocumentTitle('Edit Tier');

  if (!tier) {
    return (
      <>
        <PageBreadcrumb>
          <Breadcrumb>
            <BreadcrumbItem to="/settings/tiers">Tiers</BreadcrumbItem>
            <BreadcrumbItem isActive>Edit tier</BreadcrumbItem>
          </Breadcrumb>
        </PageBreadcrumb>
        <PageSection>
          <Alert variant="danger" title="Tier not found">
            The requested tier could not be found.
          </Alert>
        </PageSection>
      </>
    );
  }

  const breadcrumb = (
    <PageBreadcrumb>
      <Breadcrumb>
        <BreadcrumbItem to="/settings/tiers">Tiers</BreadcrumbItem>
        <BreadcrumbItem to={`/settings/tiers/${tierId}`}>{tier.name}</BreadcrumbItem>
        <BreadcrumbItem isActive>Edit tier</BreadcrumbItem>
      </Breadcrumb>
    </PageBreadcrumb>
  );

  const handleFormDataChange = (data: CreateTierForm) => {
    setFormData(data);
  };

  const handleSubmit = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Navigate back to the tier details page
    navigate(`/settings/tiers/${tierId}`);
  };

  const handleCancel = () => {
    navigate(`/settings/tiers/${tierId}`);
  };

  return (
    <>
      {breadcrumb}
      <PageSection>
        <Content component={ContentVariants.h1}>Edit tier</Content>
        <Content component={ContentVariants.p} style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
          Edit the tier configuration to control which models users can access based on their group membership.
        </Content>

        <TierForm
          formData={formData}
          onChange={handleFormDataChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEditMode
        />
      </PageSection>
    </>
  );
};

export { EditTier };

