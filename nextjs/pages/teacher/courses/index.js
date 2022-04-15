import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

function courses(props) {
  const router = useRouter();

  const [courses, setCourses] = useState([]);

  useEffect(async () => {
    let token = JSON.parse(localStorage.getItem("loginTeacher"));

    const result = await axios.get("http://localhost:8000/teacher/courses", {
      headers: {
        Authorization: token.token,
      },
    });

    setCourses(result.data);
  }, []);

  return (
    <Container>
      <h1>Teacher All Courses</h1>

      {courses.map((item) => (
        <Link href={`/teacher/courses/${item._id}`}>
          <Container
            maxWidth="lg"
            sx={{
              padding: "1rem",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#aeb1b4",
              cursor: "pointer",
            }}
          >
            <Box sx={{ padding: "0.2rem" }}>
              <Grid container spacing={0}>
                <Grid item xs={6}>
                  <Typography variant="h5" sx={{ marginBottom: "10px" }}>
                    {item.name}
                  </Typography>
                  <Typography variant="subtitle2">{item.department}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">
                    {item.dateCreated}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </Link>
      ))}
    </Container>
  );
}

export async function getStaticProps(context) {
  return {
    props: {
      testing: true,
    },
  };
}

export default courses;
