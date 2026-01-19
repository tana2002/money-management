"use client";

/* アカウント削除確認用ダイアログコンポーネント */

import { deleteAccount } from "@/lib/api/auth";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Box,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Snackbar } from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function DeleteAccountDialog({ open, onClose }: Props) {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  /* アカウント削除処理 */
  const handleDelete = async () => {
    try {
      await deleteAccount();  // アカウント削除API呼び出し
      localStorage.removeItem("token");
      onClose();
      setSuccessOpen(true);
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1} color="error.main">
            <WarningAmberIcon />
            アカウント削除の確認
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography align="center" mt={2}>
            この操作は<strong>取り消せません</strong>。
          </Typography>
          <Typography align="center" mt={1}>
            本当にアカウントを削除しますか？
          </Typography>
          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            キャンセル
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            disabled={loading}
          >
            削除する
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={successOpen}
        autoHideDuration={2000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          アカウントを削除しました
        </Alert>
      </Snackbar>
    </>
  );
}
