import { Phone, PhoneOff, PhoneIncoming } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

import { useSipPhone } from './hooks/useSipPhone';

function App() {
  const {
    connectionState,
    callState,
    error,
    connect,
    disconnect,
    call,
    answer,
    hangup,
    setRemoteAudio,
  } = useSipPhone();

  // フォームの状態
  const [sipUrl, setSipUrl] = useState('');
  const [sipUser, setSipUser] = useState('');
  const [sipPassword, setSipPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // オーディオ要素の参照
  const audioRef = useRef<HTMLAudioElement>(null);

  // オーディオ要素をフックに渡す
  useEffect(() => {
    setRemoteAudio(audioRef.current);
  }, [setRemoteAudio]);

  // 接続ボタンのクリックハンドラ
  const handleConnect = () => {
    const aor = `sip:${sipUser}`;
    void connect({
      server: sipUrl,
      aor,
      password: sipPassword,
    });
  };

  // 発信ボタンのクリックハンドラ
  const handleCall = () => {
    if (phoneNumber) {
      // sip: プレフィックスを追加
      const destination = phoneNumber.startsWith('sip:') ? phoneNumber : `sip:${phoneNumber}`;
      void call(destination);
    }
  };

  // 切断ボタンのクリックハンドラ
  const handleDisconnect = () => {
    void disconnect();
  };

  // 応答ボタンのクリックハンドラ
  const handleAnswer = () => {
    void answer();
  };

  // 切断ボタンのクリックハンドラ
  const handleHangup = () => {
    void hangup();
  };

  // 状態表示の取得
  const getStatusDisplay = () => {
    if (connectionState === 'disconnected') return '未接続';
    if (connectionState === 'connecting') return '接続中...';
    if (connectionState === 'error') return 'エラー';

    switch (callState) {
      case 'idle': return '待機中';
      case 'calling': return '発信中';
      case 'ringing': return '着信中';
      case 'connected': return '通話中';
      default: return '不明';
    }
  };

  // 接続ボタンの有効/無効を判定
  const canConnect = sipUrl.length > 0 && sipUser.length > 0 && sipPassword.length > 0 && connectionState === 'disconnected';

  // 各ボタンの有効/無効を判定
  const canCall = connectionState === 'connected' && callState === 'idle' && phoneNumber.length > 0;
  const canAnswer = connectionState === 'connected' && callState === 'ringing';
  const canHangup = connectionState === 'connected' && (callState === 'connected' || callState === 'calling');
  const canDisconnect = connectionState === 'connected';

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-primary">SIP Phone</h1>

        {/* エラー表示 */}
        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        {/* 接続設定フォーム */}
        <div className="card bg-base-100 shadow-2xl mb-6 border-2 border-base-300">
          <div className="card-body">
            <h2 className="card-title text-primary text-xl font-bold">接続設定</h2>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content font-semibold text-sm">SIP WebSocket URL</span>
              </label>
              <input
                type="text"
                placeholder="wss://sip.example.com"
                className="input input-bordered border-2 border-base-300 bg-base-200 focus:border-primary focus:bg-base-100 text-base-content placeholder:text-base-content/50"
                value={sipUrl}
                onChange={(e) => { setSipUrl(e.target.value); }}
                disabled={connectionState !== 'disconnected'}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content font-semibold text-sm">SIP User</span>
              </label>
              <input
                type="text"
                placeholder="username"
                className="input input-bordered border-2 border-base-300 bg-base-200 focus:border-primary focus:bg-base-100 text-base-content placeholder:text-base-content/50"
                value={sipUser}
                onChange={(e) => { setSipUser(e.target.value); }}
                disabled={connectionState !== 'disconnected'}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content font-semibold text-sm">SIP Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered border-2 border-base-300 bg-base-200 focus:border-primary focus:bg-base-100 text-base-content placeholder:text-base-content/50"
                value={sipPassword}
                onChange={(e) => { setSipPassword(e.target.value); }}
                disabled={connectionState !== 'disconnected'}
              />
            </div>

            <div className="card-actions justify-end mt-4">
              {connectionState === 'disconnected'
                ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleConnect}
                      disabled={!canConnect}
                    >
                      接続
                    </button>
                  )
                : (
                    <button
                      type="button"
                      className="btn btn-error"
                      onClick={handleDisconnect}
                      disabled={!canDisconnect}
                    >
                      切断
                    </button>
                  )}
            </div>
          </div>
        </div>

        {/* 通話コントロール */}
        <div className="card bg-base-100 shadow-2xl border-2 border-base-300">
          <div className="card-body">
            <h2 className="card-title text-primary text-xl font-bold">通話コントロール</h2>

            {/* 状態表示 */}
            <div className="stat bg-base-200 rounded-box mb-4 border-2 border-base-300 shadow-lg">
              <div className="stat-title text-base-content/80 font-medium">現在の状態</div>
              <div className="stat-value text-lg text-base-content font-bold">{getStatusDisplay()}</div>
            </div>

            {/* 発信フォーム */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-base-content font-semibold text-sm">発信番号</span>
              </label>
              <input
                type="text"
                placeholder="1234 または sip:user@example.com"
                className="input input-bordered border-2 border-base-300 bg-base-200 focus:border-primary focus:bg-base-100 text-base-content placeholder:text-base-content/50"
                value={phoneNumber}
                onChange={(e) => { setPhoneNumber(e.target.value); }}
                disabled={connectionState !== 'connected'}
              />
            </div>

            {/* アクションボタン */}
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                className="btn btn-success"
                onClick={handleCall}
                disabled={!canCall}
              >
                <Phone className="h-5 w-5" />
                発信
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAnswer}
                disabled={!canAnswer}
              >
                <PhoneIncoming className="h-5 w-5" />
                応答
              </button>

              <button
                type="button"
                className="btn btn-error"
                onClick={handleHangup}
                disabled={!canHangup}
              >
                <PhoneOff className="h-5 w-5" />
                切断
              </button>
            </div>
          </div>
        </div>

        {/* リモートオーディオ要素（非表示） */}
        <audio ref={audioRef} autoPlay style={{ display: 'none' }} />
      </div>
    </div>
  );
}

export default App;
