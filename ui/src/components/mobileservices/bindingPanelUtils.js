import React from 'react';

// This renders the json fields using the rules from the form definition.
export const OpenShiftObjectTemplate = function({
  TitleField,
  uiSchema,
  schema,
  properties,
  formData,
  idSchema,
  title,
  description
}) {
  const { form } = uiSchema;
  return (
    <div>
      <TitleField title={title} />
      <div className="row">
        {form.map(key => getOpenShiftField(key, properties, idSchema, schema, formData, uiSchema))}
      </div>
      {description}
    </div>
  );
};

function getOpenShiftField(field, properties, idSchema, schema, formData, uiSchema) {
  if (!field.items) {
    const property = properties.find(prop => prop.name === field);
    const id = idSchema[field].$id;

    if (field === 'CLIENT_ID') {
      return (
        <div key={property.content.key}>
          <label className="control-label" htmlFor={id}>
            {schema.properties[field].title}
          </label>
          <input
            className="form-control"
            type="text"
            id={id}
            readOnly
            onBlur={event => property.content.props.onChange(event.target.value)}
            defaultValue={schema.properties[field].default}
          />
        </div>
      );
    } else if (field === 'CLIENT_TYPE') {
      const enumArray = schema.properties[field].enum;
      const defaultValue = schema.properties[field].default;
      return (
        <div key={property.content.key}>
          <label className="control-label" htmlFor={id}>
            {schema.properties[field].title}
          </label>
          <select
            className="form-control"
            multiple={false}
            defaultValue={typeof defaultValue === 'undefined' ? '' : defaultValue}
            id={id}
            onChange={event => {
              property.content.props.onChange(event.target.value);
            }}
          >
            {enumArray.map((value, i) => (
              <option key={i} value={value}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </option>
            ))}
          </select>
        </div>
      );
    }
    return <div key={property.content.key}>{property.content}</div>;
  }
  return getFieldSet(field, properties, idSchema, schema, formData, uiSchema);
}

function getPasswordField(property, item, idSchema, schema, confirmation) {
  const id = idSchema[item.key].$id;

  const passwordField = (
    <div key={`${property.content.key}`}>
      <label className="control-label" htmlFor={id}>
        {schema.properties[item.key].title}
      </label>
      <input
        className="form-control"
        type="password"
        id={id}
        onBlur={event => property.content.props.onChange(event.target.value)}
      />
    </div>
  );

  if (confirmation) {
    return (
      <div key={`${property.content.key}-parent`}>
        {passwordField}
        <div key={`${property.content.key}-confirm`}>
          <label className="control-label" htmlFor={`${id}2`}>
            {'Confirm Password'}
          </label>
          <input className="form-control" type="password" id={`${id}2`} />
        </div>
      </div>
    );
  }
  return passwordField;
}

function getFieldSet(field, properties, idSchema, schema, formData, uiSchema) {
  const { title, items } = field;

  const fieldSetItems = items.map(item => {
    if (typeof item === 'string') {
      return properties.find(prop => prop.name === item).content;
    }
    const property = properties.find(prop => prop.name === item.key);
    const id = idSchema[item.key].$id;

    switch (item.type) {
      case 'textarea':
        return (
          <div key={property.content.key}>
            <label className="control-label" htmlFor={id}>
              {schema.properties[item.key].title}
            </label>
            <textarea
              className="form-control"
              type="text"
              id={id}
              onBlur={event => property.content.props.onChange(event.target.value)}
            />
          </div>
        );
      case 'password':
        return getPasswordField(property, item, idSchema, schema);
      default:
        return property.content;
    }
  });
  if (uiSchema.form.filterDisplayGroupBy) {
    if (field.title.toLowerCase().localeCompare(formData[uiSchema.form.filterDisplayGroupBy].toLowerCase()) === 0) {
      return (
        <fieldset key={field.title}>
          <h2>{title}</h2>
          {fieldSetItems}
        </fieldset>
      );
    }
    return <div />;
  }
  return (
    <fieldset key={field.title}>
      <h2>{title}</h2>
      {fieldSetItems}
    </fieldset>
  );
}
