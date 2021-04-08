import React, { useEffect, useRef, useState } from "react";
import { HubConnectionState } from "@microsoft/signalr";
import { Dialog, Message } from "@alifd/next";
import useProgressorHubConnection from "./index";

const styles = {
  dialog: {
    item: {
      display: 'flex',
      margin: 10,
      fontSize: 18
    },
    key: {
      width: 100,
      textAlign: 'center',
      fontWeight: 'bold'
    },
    value: {
      width: 400
    }
  }
}

export default function useSimpleProgressorHubConnection({
  key, url, onStateChange = (s) => { }, onProgressChange = (p) => { },
}) {
  const connection = useRef();
  const dialog = useRef();

  const onConnStateChange = (state: HubConnectionState) => {
    if (dialog.current) {
      dialog.current.hide();
    }
    const options = {
      title: state,
      content: <>
        <div style={styles.dialog.item}>
          <div style={styles.dialog.key}>Key</div>
          <div style={styles.dialog.value}>{key}</div>
        </div>
        <div style={styles.dialog.item}>
          <div style={styles.dialog.key}>Url</div>
          <div style={styles.dialog.value}>{url}</div>
        </div>
      </>,
      footer: false,
      hasMask: false,
    };
    switch (state) {
    case HubConnectionState.Disconnected:
    case HubConnectionState.Connecting:
    case HubConnectionState.Disconnecting:
    case HubConnectionState.Reconnecting:
      dialog.current = Dialog.show(options);
      break;
    case HubConnectionState.Connected:
      Message.success(`Progressor [${key}] connected to ${url} successfully.`);
      break;
    }
  };

  const conn = useProgressorHubConnection({ key, url, onConnStateChange, onStateChange, onProgressChange });

  useEffect(() => {
    connection.current = {
      start: (params) => {
        Message.success("Starting");
        conn.current.start(params);
      },
      stop: () => {
        Message.success("Stopping");
        conn.current.stop();
      },
      dispose: () => {
        conn.current.dispose();
        if (dialog.current) {
          dialog.current.hide();
        }
      },
    };

    return () => {
      if (connection.current) {
        conn.current.dispose();
      }
    };
  }, []);

  return connection;
}
