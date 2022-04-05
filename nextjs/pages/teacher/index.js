import React from "react";
import Container from "@mui/material/Container";
import { Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

function index(props) {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));
  return (
    <Container
      fixed
      sx={{
        border: "1px solid black",
      }}
    >
      Teacher Main Page
      <Box>
        <Grid
          container
          spacing={2}
          direction="column"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <Grid item xs={12}>
            <Item>xs=6 md=8</Item>
          </Grid>
          <Grid item xs={12}>
            <Item>xs=6 md=8</Item>
          </Grid>
          <Grid item xs={12}>
            <Item>xs=6 md=8</Item>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default index;
