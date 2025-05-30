// SIP電話の状態を表す型
export type CallState = 'idle' | 'calling' | 'ringing' | 'connected';

// SIP接続の状態を表す型
export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

// SIP設定の型
export interface SipConfig {
  server: string;
  aor: string;
  password: string;
}

// SIP電話の状態を管理する型
export interface SipPhoneState {
  connectionState: ConnectionState;
  callState: CallState;
  error: string | null;
}
