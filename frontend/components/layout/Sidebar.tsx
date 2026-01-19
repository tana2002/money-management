"use client";

/* サイドバーコンポーネント */

import {
  Box,
  Divider,
  Button,
  Drawer,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import DeleteAccountDialog from "./DeleteAccountDialog";
import MenuIcon from '@mui/icons-material/Menu';

export default function Sidebar() {
  const [openDelete, setOpenDelete] = useState(false);
  const [open, setOpen] = useState(false);

  const isGuest = false;

  const toggleDrawer =
    (open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        }
        setOpen(open);
      };

  // Drawer内のコンテンツ
  const DrawerList = (
    <div>
      <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      </Box>
      <Box
        sx={{
          width: 240,
          height: "100vh",
          borderRight: "1px solid #ddd",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ mt: "auto", p: 2 }}>
          <Divider sx={{ mb: 2 }} />
          <Button
            color="error"
            variant="outlined"
            fullWidth
            disabled={isGuest}
            onClick={() => setOpenDelete(true)}
          >
            アカウント削除
          </Button>
        </Box>
        <DeleteAccountDialog
          open={openDelete}
          onClose={() => setOpenDelete(false)}
        />
      </Box>
    </div>
  );

  return (
    <div>
      <IconButton onClick={toggleDrawer(true)}>
        <MenuIcon />
      </IconButton>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>

  );
}
