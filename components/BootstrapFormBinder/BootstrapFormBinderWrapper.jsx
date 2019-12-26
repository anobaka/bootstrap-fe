import React, { useState, useEffect } from "react";
import { Dialog, Grid, Balloon, Icon, Switch } from "@alifd/next";
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError
} from "@icedesign/form-binder";

import "./BootstrapFormBinderWrapper.scss";

const { Col, Row } = Grid;

export default function BootstrapFormBinderWrapper(props) {
  const { value, fields } = props;

  const [formValue, setFormValue] = useState(value);

  // useEffect(() => {
  //   // setFormValue(formValue);
  //   console.log("123");
  // }, [formValue]);

  function getDisplayName(field) {
    return field.displayName || field.name;
  }

  function generateMessage(field) {
    if (field.message) {
      return field.message;
    }
    if (field.required) {
      const name = getDisplayName(field);
      return `请输入正确的${name}`;
    }
  }

  function generateFormError(field) {
    return (
      field.FormError ||
      (generateMessage(field) && (
        <div>
          <IceFormError name={field.name} />
        </div>
      ))
    );
  }

  function generateLabelTrailingIcon(field) {
    if (field.required) {
      return <span className="required">*</span>;
    }
  }

  function generateRow(field) {
    // console.log("regenerate rows: ", formValue);
    // todo: showIf not working
    // console.log(formValue, field.showIf && field.showIf(formValue));
    const formBinderProps = {
      name: field.name,
      required: field.required || false,
      message: generateMessage(field),
      ...(field.formBinderProps || {})
    };
    const FormBinder = field.FormBinder || IceFormBinder;
    return (
      (!field.showIf || field.showIf(formValue)) && (
        <Row className="item">
          <Col>
            <Row className="label-value">
              <Col
                span={props.labelSpan == undefined ? 8 : props.labelSpan}
                className="label"
              >
                {getDisplayName(field)}
                {field.tip && (
                  <Balloon
                    align="t"
                    closable={false}
                    trigger={<Icon type="help" size="small" className="tip" />}
                  >
                    {field.tip}
                  </Balloon>
                )}
                {generateLabelTrailingIcon(field)}&emsp;
              </Col>
              <Col span={props.valueSpan == undefined ? 16 : props.valueSpan}>
                <FormBinder {...formBinderProps}>
                  {field.formComponent}
                </FormBinder>
              </Col>
            </Row>
            <Row className="error">
              <Col offset={props.labelSpan == undefined ? 8 : props.labelSpan}>
                {generateFormError(field)}
              </Col>
            </Row>
          </Col>
        </Row>
      )
    );
  }

  function submit(resolve, reject) {
    form.validateAll((errors, values) => {
      console.log("errors", errors, "values", values);
      if (!errors) {
        props.submit(formValue, resolve, reject);
      } else {
        props.onError && props.onError(values, value);
        reject && reject();
      }
    });
  }

  props.submitRef(submit);

  function onChange() {
    // console.log(`onChange: `, formValue);
    setFormValue({ ...formValue });
    props.onChange && props.onChange(formValue);
  }

  let form;

  // console.log("render");

  return (
    <div className="bootstrap-form-binder-wrapper">
      <IceFormBinderWrapper
        value={formValue}
        ref={f => (form = f)}
        onChange={onChange}
      >
        {(fields || []).map(f => generateRow(f)).filter(t => t)}
      </IceFormBinderWrapper>
    </div>
  );
}

BootstrapFormBinderWrapper.dialog = function(props) {
  const {
    iceDialogMethod,
    shouldUpdatePosition,
    closeable,
    fields,
    ...otherProps
  } = props;

  let sw;

  Dialog[iceDialogMethod || "show"]({
    style: { maxHeight: "auto" },
    content: (
      <BootstrapFormBinderWrapper
        {...otherProps}
        fields={fields}
        submitRef={s => (sw = s)}
      />
    ),
    onOk: () =>
      new Promise((resolve, reject) => {
        sw(resolve, reject);
      }),
    shouldUpdatePosition:
      shouldUpdatePosition == undefined ? true : shouldUpdatePosition,
    closeable: closeable == undefined ? true : closeable,
    ...otherProps
  });
};
