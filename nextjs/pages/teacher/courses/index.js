import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CourseCard from "../../../components/courseCard";

function courses(props) {
  const [courses, setCourses] = useState([]);
  console.log(props);

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
        <CourseCard data={item} />
      ))}
    </Container>
  );
}

// export async function getServerSideProps() {
//   if (typeof window !== "undefined") {
//     let token = JSON.parse(localStorage.getItem("loginTeacher"));
//     console.log(token);

//     const result = await axios.get("http://localhost:8000/teacher/courses", {
//       headers: {
//         Authorization: token.token,
//       },
//     });
//     console.log(result.data);
//     return {
//       props: {
//         courses: result.data,
//       },
//     };
//   } else {
//     return { props: { test: "ac" } };
//   }
// }

export default courses;
