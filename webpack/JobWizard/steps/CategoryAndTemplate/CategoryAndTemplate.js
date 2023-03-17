import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Text, TextVariants, Form, Alert, SelectVariant } from '@patternfly/react-core';
import { SelectGQL } from '../HostsAndInputs/SelectGQL';
import { translate as __ } from 'foremanReact/common/I18n';
import { SelectField } from '../form/SelectField';
import { GroupedSelectField } from '../form/GroupedSelectField';
import { WizardTitle } from '../form/WizardTitle';
import { SearchSelect } from '../form/SearchSelect';
import { WIZARD_TITLES, JOB_TEMPLATES, OUTPUT_TEMPLATES, outputTemplatesUrl } from '../../JobWizardConstants';
import { selectIsLoading } from '../../JobWizardSelectors';
import { OutputSelect } from './searchOutputTemplates';

export const CategoryAndTemplate = ({
  jobCategories,
  jobTemplates,
  selectedOutputTemplates,
  setJobTemplate,
  setOutputTemplates,
  selectedTemplateID,
  selectedCategory,
  setCategory,
  errors,
}) => {
  const templatesGroups = {};
  const isTemplatesLoading = useSelector(state =>
    selectIsLoading(state, JOB_TEMPLATES)
  );
  if (!isTemplatesLoading) {
    jobTemplates.forEach(template => {
      if (templatesGroups[template.provider_type]?.options)
        templatesGroups[template.provider_type].options.push({
          label: template.name,
          value: template.id,
        });
      else
        templatesGroups[template.provider_type] = {
          options: [{ label: template.name, value: template.id }],
          groupLabel: template.provider_type,
        };
    });
  }

  const setSelectedOutputTemplates = newSelected =>
    setOutputTemplates(prevSelected => ({
      ...prevSelected,
      output_templates: newSelected(prevSelected.output_templates),
    }));

  const selectedTemplate = jobTemplates.find(
    template => template.id === selectedTemplateID
  )?.name;

  const onSelectCategory = newCategory => {
    if (selectedCategory !== newCategory) {
      setCategory(newCategory);
      setJobTemplate(null);
    }
  };

  const {
    categoryError,
    allTemplatesError,
    templateError,
    outputTemplateError,
  } = errors;
  const isError = !!(
    categoryError ||
    allTemplatesError ||
    templateError ||
    outputTemplateError
  );

  return (
    <>
      <WizardTitle title={WIZARD_TITLES.categoryAndTemplate} />
      <Text component={TextVariants.p}>{__('All fields are required.')}</Text>
      <Form>
        <SelectField
          label={__('Job category')}
          fieldId="job_category"
          options={jobCategories}
          setValue={onSelectCategory}
          value={selectedCategory}
          placeholderText={categoryError ? __('Error') : ''}
          isDisabled={!!categoryError}
          isRequired
        />
        <GroupedSelectField
          label={__('Job template')}
          fieldId="job_template"
          groups={Object.values(templatesGroups)}
          setSelected={setJobTemplate}
          selected={isTemplatesLoading ? [] : selectedTemplate}
          isDisabled={
            !!(categoryError || allTemplatesError || isTemplatesLoading)
          }
          placeholderText={allTemplatesError ? __('Error') : ''}
        />
        <OutputSelect
          selected={selectedOutputTemplates.output_templates}
          setSelected={setSelectedOutputTemplates}
          apiKey={OUTPUT_TEMPLATES}
          name="output_templates"
          url={outputTemplatesUrl}
          placeholderText={__('Output templates')}
        />

        {isError && (
          <Alert variant="danger" title={__('Errors:')}>
            {categoryError && (
              <span>
                {__('Categories list failed with:')} {categoryError}
              </span>
            )}
            {allTemplatesError && (
              <span>
                {__('Templates list failed with:')} {allTemplatesError}
              </span>
            )}
            {templateError && (
              <span>
                {__('Template failed with:')} {templateError}
              </span>
            )}
            {outputTemplateError && (
              <span>
                {__('Output template failed with:')} {outputTemplateError}
              </span>
            )}
          </Alert>
        )}
      </Form>
    </>
  );
};

CategoryAndTemplate.propTypes = {
  jobCategories: PropTypes.array,
  jobTemplates: PropTypes.array,
  selectedOutputTemplates: PropTypes.shape({
    output_templates: PropTypes.array.isRequired,
  }).isRequired,
  setJobTemplate: PropTypes.func.isRequired,
  setOutputTemplates: PropTypes.func.isRequired,
  selectedTemplateID: PropTypes.number,
  setCategory: PropTypes.func.isRequired,
  selectedCategory: PropTypes.string,
  errors: PropTypes.shape({
    categoryError: PropTypes.string,
    allTemplatesError: PropTypes.string,
    templateError: PropTypes.string,
    outputTemplateError: PropTypes.string,
  }),
};
CategoryAndTemplate.defaultProps = {
  jobCategories: [],
  jobTemplates: [],
  selectedTemplateID: null,
  selectedCategory: null,
  errors: {},
};

export default CategoryAndTemplate;
