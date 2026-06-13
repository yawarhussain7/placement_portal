import React from "react";
import Template from "../../components/common/Template";
import ProfileContent from "../../components/auth/ProfileContent";

export default function Profile() {
  return (
    <Template title="Profile" description="Manage your personal profile">
      <ProfileContent />
    </Template>
  );
}