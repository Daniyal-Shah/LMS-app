import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Link from "next/link";

export default function CourseCard({ data }) {
  const getFullName = (sname) => {
    if (sname == "CS") return "Computer Science";
    else if (sname == "BBA") return "Business Administration";
    else if (sname == "BED") return "Education";
    else return "N/A Department ";
  };
  return (
    <Card sx={{ maxWidth: 345 }}>
      <Link href={`/teacher/courses/${data._id}`}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image="https://image.shutterstock.com/shutterstock/photos/451321816/display_1500/stock-photo-education-graduation-and-people-concept-silhouettes-of-many-happy-students-in-gowns-throwing-451321816.jpg"
            alt="Image"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {data.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {getFullName(data.department)}
            </Typography>

            <Typography variant="body1" color="text.secondary">
              {`Students : ${data.enrolledStudents.length}`}
            </Typography>

            <Typography variant="body1" color="text.secondary">
              {`Creation Date : ${data.dateCreated}`}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
}
