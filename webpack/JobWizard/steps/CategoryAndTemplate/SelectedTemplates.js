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
      {selected.map(({ name, id }, index) => (
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

const SelectedRuntimeTemplate = ({ selected, setSelected, categoryName }) => (
  <ChipGroup className="templates-chip-group" categoryName={categoryName}>
    {selected.map((item, index) => (
      /* runtime templates do not have an id, as they are not yet saved in db */
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

export const SelectedTemplates = ({
  selectedOutputTemplates,
  setOutputTemplates,
  runtimeTemplates,
  setRuntimeTemplates,
}) => {
  const clearAll = () => {
    setOutputTemplates(() => []);
    setRuntimeTemplates(() => []);
  };
  return (
    <div className="selected-chips">
      <SelectedTemplate
        selected={selectedOutputTemplates}
        categoryName="Predefined templates"
        setSelected={setOutputTemplates}
      />
      <SelectedRuntimeTemplate
        selected={runtimeTemplates}
        categoryName="Runtime templates"
        setSelected={setRuntimeTemplates}
      />
      <Button variant="link" className="clear-chips" onClick={clearAll}>
        {__('Clear templates')}
      </Button>
    </div>
  );
};

SelectedTemplates.propTypes = {
  selectedOutputTemplates: PropTypes.array.isRequired,
  setOutputTemplates: PropTypes.func.isRequired,
  runtimeTemplates: PropTypes.array.isRequired,
  setRuntimeTemplates: PropTypes.func.isRequired,
};

SelectedTemplate.propTypes = {
  categoryName: PropTypes.string.isRequired,
  selected: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired,
};

SelectedRuntimeTemplate.propTypes = {
  categoryName: PropTypes.string.isRequired,
  selected: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired,
};
