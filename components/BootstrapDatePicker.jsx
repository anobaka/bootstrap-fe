import React from "react";
import moment from "moment";
import { DatePicker } from "@alifd/next";

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

export default function BootstrapDatePicker(props) {
  const { disabledDate: _, min, max, onChange, ...otherProps } = props;
  
  let disabledDate;

  if (min || max) {
    const minDate = min && parse(min);
    const maxDate = max && parse(max);

    // console.log(minDate, maxDate);

    if (minDate || maxDate) {
      disabledDate = (moment, view) => {
        let valid = true;
        if (minDate) {
          valid = valid && moment >= minDate;
        }
        if (maxDate) {
          valid = valid && moment <= maxDate;
        }
        // console.log(moment, valid)
        return !valid;
      };
    }
  }

  // console.log(disabledDate)

  return (
    <DatePicker
      onChange={m =>
        onChange((moment.isMoment(m) && m.format("YYYY-MM-DD HH:mm:ss")) || m)
      }
      {...otherProps}
      disabledDate={disabledDate}
    />
  );
}

BootstrapDatePicker.RangePicker = function(props) {
  const { disabledDate: _, min, max, onChange, ...otherProps } = props;

  let disabledDate;

  if (min || max) {
    const minDate = min && parse(min);
    const maxDate = max && parse(max);

    // console.log(minDate, maxDate);

    if (minDate || maxDate) {
      disabledDate = (moment, view) => {
        let valid = true;
        if (minDate) {
          valid = valid && moment >= minDate;
        }
        if (maxDate) {
          valid = valid && moment <= maxDate;
        }
        // console.log(moment, valid)
        return !valid;
      };
    }
  }

  return (
    <DatePicker.RangePicker
      {...otherProps}
      onChange={moments =>
        onChange(
          moments.map(
            m => (moment.isMoment(m) && m.format("YYYY-MM-DD HH:mm:ss")) || m
          )
        )
      }
      disabledDate={disabledDate}
    />
  );
};
