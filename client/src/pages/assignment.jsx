import React, { useEffect } from "react";
import Navbar from "../components/navbar";
import AssignmentForm from "../components/assignmentForm";
import api from "../features/api";
import Card from "../components/card";
import { useSelector } from "react-redux";

const Assignment = () => {
  const role = useSelector((state) => state.auth.data.role);
  const [assignments, setAssignments] = React.useState([]);
  useEffect(() => {
    const fetchApi = async () => {
      const response = await api.get("/assignments");
      console.log(response.data.data.assignment);
      setAssignments(response.data.data.assignment);
    };

    fetchApi();
  }, []);

  const allAssignments = assignments.map((assignment) => {
    return (
      <Card key={assignment.id} type="assignment">
        <div className="card-body gap-2">
          <h1 className="title text-2xl">{assignment.title}</h1>
          <p className="text-xs">{`${assignment.faculty.firstName} ${assignment.faculty.lastName}`}</p>
        </div>
        <div className="card-footer">
          <div>
            Assignment File :{" "}
            <a href={`http://127.0.0.1:3000/api/v1/files/${assignment.file}`}>
              Link
            </a>
          </div>
        </div>
      </Card>
    );
  });
  return (
    <>
      <Navbar />
      <div className="container">
        {role === "faculty" && <AssignmentForm />}
        {allAssignments}
      </div>
    </>
  );
};

export default Assignment;
