// ログイン画面
import { useState } from "react";
import { Factory, AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!employeeNumber.trim() || !password.trim()) {
      setError('社員番号とパスワードを入力してください');
      return;
    }

    const ok = login(employeeNumber.trim(), password);
    if (!ok) {
      setError('社員番号またはパスワードが正しくありません');
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#f4f6fb' }}
    >
      <div
        className="bg-white rounded-2xl shadow-lg p-10"
        style={{ width: 400 }}
      >
        {/* ロゴ・タイトル */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: '#eef0fd' }}
          >
            <Factory size={28} style={{ color: '#4361ee' }} />
          </div>
          <h1 className="text-lg font-bold text-gray-800 text-center leading-snug">
            製造実績管理システム
          </h1>
          <p className="text-sm text-gray-400 mt-1">信和工業株式会社</p>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit}>
          {/* エラーメッセージ */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
              <AlertCircle size={15} className="text-red-500 shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* 社員番号 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              社員番号
            </label>
            <input
              type="text"
              value={employeeNumber}
              onChange={(e) => setEmployeeNumber(e.target.value)}
              placeholder="例: EMP001"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-[#4361ee] focus:ring-2 focus:ring-[#4361ee]/20 transition-all"
            />
          </div>

          {/* パスワード */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワードを入力"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-[#4361ee] focus:ring-2 focus:ring-[#4361ee]/20 transition-all"
            />
          </div>

          {/* ログインボタン */}
          <button
            type="submit"
            className="w-full py-2.5 text-sm font-semibold text-white rounded-lg transition-colors"
            style={{ backgroundColor: '#4361ee' }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#3451d1')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#4361ee')}
          >
            ログイン
          </button>
        </form>
      </div>
    </div>
  );
}
