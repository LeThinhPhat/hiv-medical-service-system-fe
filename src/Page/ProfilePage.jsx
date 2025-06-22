// src/pages/ProfilePage.jsx
import { useParams } from "react-router-dom";
import ProfileDoctor from "../Components/Doctor/ProfileDoctor";

const ProfilePage = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  return <ProfileDoctor doctorId={id} token={token} />;
};

export default ProfilePage;
