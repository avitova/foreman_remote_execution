import React from 'react';
import PropTypes from 'prop-types';
import { Chip, ChipGroup, Button } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';

const SelectedTemplate = ({ selected, setSelected, categoryName }) => {
  const deleteItem = itemToRemove => {
    setSelected(oldSelected =>
      oldSelected.filter(item => item.id !== itemToRemove)
    );
  };
  return (
    <ChipGroup className="templates-chip-group" categoryName={categoryName}>
      {selected.output_templates.map(({ name, id }, index) => (
        <Chip
          key={index}
          id={`${categoryName}-${id}`}
          onClick={() => deleteItem(id)}
          closeBtnAriaLabel={`Close ${name}`}
        >
          {name}
        </Chip>
      ))}
    </ChipGroup>
  );
};

const SelectedRuntimeTemplate = ({ selected, setSelected, categoryName }) => {
  return (
    <ChipGroup className="templates-chip-group" categoryName={categoryName}>
      {selected.map((item, index) => (
        <Chip
          key={index}
          id={`${categoryName}-${index}`}
          onClick={() =>
            setSelected(templates =>
              templates.filter((_, selectedIndex) => index !== selectedIndex)
            )
          }
          closeBtnAriaLabel={`Close ${item}`}
        >
          {item}
        </Chip>
      ))}
    </ChipGroup>
  );
};

export const SelectedTemplates = ({
  selectedOutputTemplates,
  setOutputTemplates,
  selectedRuntimeTemplates,
  setRuntimeTemplates,
}) => {
  const clearAll = () => {
    setOutputTemplates(() => []);
    setRuntimeTemplates(() => []);
  };
  // const showClear = selectedOutputTemplates.output_templates.length;
  return (
    <div className="selected-chips">
      <SelectedTemplate
        selected={selectedOutputTemplates}
        categoryName="Predefined templates"
        setSelected={setOutputTemplates}
      />
      <SelectedRuntimeTemplate
        selected={selectedRuntimeTemplates}
        categoryName="Runtime templates"
        setSelected={setRuntimeTemplates}
      />
      <Button variant="link" className="clear-chips" onClick={clearAll}>
        {__('Clear filters')}
      </Button>
    </div>
  );
};

SelectedTemplates.propTypes = {
  selectedOutputTemplates: PropTypes.shape({
    output_templates: PropTypes.array.isRequired,
  }).isRequired,
  setOutputTemplates: PropTypes.func.isRequired,
  selectedRuntimeTemplates: PropTypes.array.isRequired,
  setRuntimeTemplates: PropTypes.func.isRequired,
};

SelectedTemplate.propTypes = {
  categoryName: PropTypes.string.isRequired,
  selected: PropTypes.shape({
    output_templates: PropTypes.array.isRequired,
  }).isRequired,
  setSelected: PropTypes.func.isRequired,
};

SelectedRuntimeTemplate.propTypes = {
  categoryName: PropTypes.string.isRequired,
  selected: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired,
};
