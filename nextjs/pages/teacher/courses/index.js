import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";

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
    <div>
      <h1>Teacher All Courses</h1>
      <ul>
        {courses.map((item) => (
          <li>
            <a href={`courses/${item._id}`}>{item.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default courses;
