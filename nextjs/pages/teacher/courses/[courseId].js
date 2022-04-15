import React from "react";
import { useRouter } from "next/router";

function CourseDetails(props) {
  const router = useRouter();
  return (
    <div>
      <h1>Teacher CourseDetails {router.query.courseId}</h1>
    </div>
  );
}

export default CourseDetails;
