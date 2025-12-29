"use client";

/* ログイン画面コンポーネント */

import { Box, Button, TextField, Typography, Stack, Divider } from "@mui/material";
import { useState } from "react";
import { login, guestLogin, } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const [login_id, setLogin_id] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ログイン処理 */
  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await login(login_id, password);
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  /**
 * ゲストログイン処理
 * - バックエンド側でゲストユーザーを特定しトークンを発行
 */
  const handleGuestLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await guestLogin();
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
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
        gutterBottom color="black"
      >
        ログイン
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="ログインID"
          value={login_id}
          onChange={(e) => setLogin_id(e.target.value)}
          fullWidth
        />
        <TextField
          label="パスワード"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
        {error && (
          <Typography
            color="error"
            variant="body2"
          >
            {error}
          </Typography>
        )}
        <Button
          variant="contained"
          size="large"
          onClick={handleLogin}
          disabled={loading}
        >
          ログイン
        </Button>
        <Divider
          sx={{
            color: "black",
            "&::before, &::after": {
              borderColor: "black",
            },
          }}
        >
          または
        </Divider>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleGuestLogin}
          disabled={loading}
        >
          ゲストログイン
        </Button>
        <Typography
          variant="body2"
          align="center"
          color="black"
        >
          アカウントをお持ちでないですか？
        </Typography>
        <Button
          variant="text"
          onClick={() => router.push("/register")}
        >
          新規登録
        </Button>
      </Stack>
    </Box>
  );
}
