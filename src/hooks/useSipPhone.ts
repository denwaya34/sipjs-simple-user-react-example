import type { SimpleUser } from 'sip.js/lib/platform/web';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Web } from 'sip.js';

import type { CallState, ConnectionState, SipConfig } from '../types/sip';

export const useSipPhone = () => {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [callState, setCallState] = useState<CallState>('idle');
  const [error, setError] = useState<string | null>(null);

  const simpleUserRef = useRef<SimpleUser | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  // オーディオ要素を設定
  const setRemoteAudio = useCallback((element: HTMLAudioElement | null) => {
    remoteAudioRef.current = element;
  }, []);

  // SIPサーバーに接続
  const connect = useCallback(async (config: SipConfig) => {
    try {
      setConnectionState('connecting');
      setError(null);

      // 既存の接続がある場合は切断
      if (simpleUserRef.current) {
        await simpleUserRef.current.disconnect();
      }

      // SimpleUserのオプションを設定
      const options: Web.SimpleUserOptions = {
        aor: config.aor,
        // 認証情報を設定
        userAgentOptions: {
          authorizationUsername: config.aor.split('@')[0], // SIPユーザー名を抽出
          authorizationPassword: config.password,
        },
        media: {
          constraints: { audio: true, video: false },
          remote: remoteAudioRef.current ? { audio: remoteAudioRef.current } : undefined,
        },
        // コールバック関数を設定
        delegate: {
          onRegistered: () => {
            setConnectionState('connected');
            setCallState('idle');
          },
          onUnregistered: () => {
            setConnectionState('disconnected');
            setCallState('idle');
          },
          onCallReceived: () => {
            setCallState('ringing');
          },
          onCallAnswered: () => {
            setCallState('connected');
          },
          onCallHangup: () => {
            setCallState('idle');
          },
          onServerConnect: () => {
            console.log('WebSocket connected');
          },
          onServerDisconnect: () => {
            setConnectionState('disconnected');
            setCallState('idle');
          },
        },
      };

      // SimpleUserインスタンスを作成
      const simpleUser = new Web.SimpleUser(config.server, options);
      simpleUserRef.current = simpleUser;

      // サーバーに接続してレジスター
      await simpleUser.connect();
      await simpleUser.register();
    }
    catch (err) {
      setConnectionState('error');
      setError(err instanceof Error ? err.message : '接続エラーが発生しました');
      console.error('Connection error:', err);
    }
  }, []);

  // 切断
  const disconnect = useCallback(async () => {
    try {
      if (simpleUserRef.current) {
        await simpleUserRef.current.disconnect();
        simpleUserRef.current = null;
      }
      setConnectionState('disconnected');
      setCallState('idle');
      setError(null);
    }
    catch (err) {
      setError(err instanceof Error ? err.message : '切断エラーが発生しました');
      console.error('Disconnect error:', err);
    }
  }, []);

  // 発信
  const call = useCallback(async (destination: string) => {
    try {
      if (!simpleUserRef.current) {
        throw new Error('SIPサーバーに接続されていません');
      }

      setCallState('calling');
      setError(null);

      await simpleUserRef.current.call(destination);
    }
    catch (err) {
      setCallState('idle');
      setError(err instanceof Error ? err.message : '発信エラーが発生しました');
      console.error('Call error:', err);
    }
  }, []);

  // 応答
  const answer = useCallback(async () => {
    try {
      if (!simpleUserRef.current) {
        throw new Error('SIPサーバーに接続されていません');
      }

      await simpleUserRef.current.answer();
    }
    catch (err) {
      setError(err instanceof Error ? err.message : '応答エラーが発生しました');
      console.error('Answer error:', err);
    }
  }, []);

  // 切断
  const hangup = useCallback(async () => {
    try {
      if (!simpleUserRef.current) {
        throw new Error('SIPサーバーに接続されていません');
      }

      await simpleUserRef.current.hangup();
    }
    catch (err) {
      setError(err instanceof Error ? err.message : '切断エラーが発生しました');
      console.error('Hangup error:', err);
    }
  }, []);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (simpleUserRef.current) {
        simpleUserRef.current.disconnect().catch(console.error);
      }
    };
  }, []);

  return {
    // 状態
    connectionState,
    callState,
    error,

    // メソッド
    connect,
    disconnect,
    call,
    answer,
    hangup,
    setRemoteAudio,
  };
};
