import React from "react";
import { useRouter } from "next/router";

function CourseDetails(props) {
  const router = useRouter();
  console.log();
  return (
    <div>
      <h1>CourseDetails {router.query.courseId}</h1>
    </div>
  );
}

export default CourseDetails;
