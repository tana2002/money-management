'use client';

/* 認証系API通信をまとめたモジュール */

/* 通常ログイン */
export async function login(login_id: string, password: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login_id, password }),
    }
  );

  if (!res.ok) throw new Error('ログインIDかパスワードが間違っています');

  return res.json();
}

/* ゲストログイン
  * - 認証情報は送らず、バックエンドでゲストユーザーを特定しトークンを発行
*/
export async function guestLogin() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/guest-login`,
    { method: 'POST' }
  );

  if (!res.ok) throw new Error('ゲストログインに失敗しました');
  return res.json();
}

/* ユーザー新規登録 */
export async function register(login_id: string, password: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login_id, password }),
    }
  );

  if (!res.ok) {
    throw new Error('登録に失敗しました');
  }

  return res.json(); // { token, user }
}

/* アカウント削除 */
export async function deleteAccount() {
  const token = localStorage.getItem('token');

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/users/me`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? 'アカウント削除に失敗しました');
  }
}