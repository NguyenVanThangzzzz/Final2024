import { useAuthStore } from "../../../store/authStore";
import { formatDate } from "../../../utils/date";

function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <div>
      <h2>Profile Ìnormation</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>
        <span>Last Login</span>
        {user.lastLogin ? formatDate(user.lastLogin) : "No login yet"}
      </p>
    </div>
  );
}

export default ProfilePage;
