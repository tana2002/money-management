"use client";

/* ユーザー新規登録画面コンポーネント */

import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { register } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();

  const [login_id, setLogin_id] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const LOGIN_ID_REGEX = /^[a-zA-Z0-9]*$/;

  const handleLoginIdChange = (value: string) => {
    setLogin_id(value);

    // 半角英数字チェック
    if (!LOGIN_ID_REGEX.test(value)) {
      setLoginError("ログインIDは半角英数字のみ使用できます");
    } else {
      setLoginError(null);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    // 半角英数字チェック
    if (!LOGIN_ID_REGEX.test(value)) {
      setPasswordError("パスワードは半角英数字のみ使用できます");
    } else {
      setPasswordError(null);
    }
  };

  /**
   * 新規登録処理
   */
  const handleRegister = async () => {
    setError(null);

    if (!login_id || !password) {
      setError("ログインIDとパスワードを入力してください");
      return;
    }

    // 入力時にエラーが残っていれば送信しない
    if (loginError || passwordError) {
      return;
    }

    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      return;
    }

    setLoading(true);

    try {
      await register(login_id, password);
      // 登録完了後はログイン画面へ
      router.push("/login");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 400,
        mx: "auto",
        mt: 8,
        p: 4,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        gutterBottom color="black">
        新規登録
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="ログインID"
          value={login_id}
          onChange={(e) => handleLoginIdChange(e.target.value)}
          fullWidth
          error={Boolean(loginError)}
          helperText={loginError ?? "半角英数字で入力してください"}
        />
        <TextField
          label="パスワード"
          type="password"
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          fullWidth
          error={Boolean(passwordError)}
          helperText={passwordError ?? "半角英数字で入力してください"}
        />
        <TextField
          label="パスワード（確認）"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
        />
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Button
          variant="contained"
          size="large"
          onClick={handleRegister}
          disabled={loading}
        >
          登録する
        </Button>
        <Button
          variant="text"
          onClick={() => router.push("/login")}
        >
          ログイン画面に戻る
        </Button>
      </Stack>
    </Box>
  );
}
