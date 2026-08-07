import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

export function useWebSocket(
  projectId: string | number | undefined,
  onMessage: (message: any) => void
) {
  const token = useSelector((state: RootState) => state.auth.token);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!projectId || !token) return;

    // Build WebSocket client with SockJS fallback. Relative URL so this resolves against
    // the current origin — proxied to the backend in dev (see vite.config.ts) and expected
    // to be reverse-proxied alongside /api in any real deployment, same as the REST calls.
    const client = new Client({
      webSocketFactory: () => new SockJS('/ws-levi'),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = function () {
      client.subscribe(`/topic/projects/${projectId}/issues`, (message) => {
        if (message.body) {
          const issue = JSON.parse(message.body);
          onMessage(issue);
        }
      });
    };

    client.onStompError = function (frame) {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [projectId, token, onMessage]);

  return clientRef.current;
}
