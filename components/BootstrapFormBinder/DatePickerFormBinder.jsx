import React, { useState, useEffect } from "react";
import { Dialog, Grid, Balloon, Icon, Switch } from "@alifd/next";
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError
} from "@icedesign/form-binder";
import moment from "moment";

function parse(obj) {
  if (typeof obj == "string") {
    let date = Date.parse(obj);
    if (date) {
      return new Date(date);
    } else {
      // 1y, 1M, 1d, 1h, 1m, 1s, -1y, ...
      const regMatch = /^(?<o>-?)(?<n>\d+)(?<f>[a-zA-Z])$/.exec(obj);
      if (regMatch) {
        const { groups } = regMatch;
        const n = parseInt(groups["n"]);
        const f = groups["f"];
        const now = new Date();
        const factor = (groups["o"] == "-" ? -1 : 1) * n;
        // console.log(`set${dateMethodKeys[f]}`, now[`get${dateMethodKeys[f]}`](), factor)
        now[`set${dateMethodKeys[f]}`](
          now[`get${dateMethodKeys[f]}`]() + factor
        );
        return now;
      } else {
        throw `Can not parse range parameter: ${obj && obj.toString()}`;
      }
    }
  }
  if (obj instanceof Date) {
    return date;
  }
}

const dateMethodKeys = {
  y: "FullYear",
  M: "Month",
  d: "Date",
  h: "Hours",
  m: "Minutes",
  s: "Seconds",
  f: "Milliseconds"
};

export default function BootstrapFormBinderWrapper(props) {
  const { min, max, validator: _, ...otherProps } = props;

  let validator;

  if (min || max) {
    const minDate = min && parse(min);
    const maxDate = max && parse(max);

    // console.log(minDate, maxDate);

    if (minDate || maxDate) {
      validator = (rule, values, callback) => {
        let valid = true;
        const current = moment.isMoment(values)
          ? values
          : new Date(Date.parse(values));
        if (minDate) {
          valid = valid && current >= minDate;
        }
        if (maxDate) {
          valid = valid && current <= maxDate;
        }

        if (valid) {
          callback();
        } else {
          callback(otherProps.message || "error");
        }

        // console.log(moment, valid)
        return !valid;
      };
    }
  }

  return <IceFormBinder {...otherProps} validator={validator} />;
}
