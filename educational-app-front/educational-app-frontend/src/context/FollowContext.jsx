import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthProvider";

export const FollowContext = createContext();

export function FollowProvider({ children }) {
    const { token, user } = useContext(AuthContext);
    const [following, setFollowing] = useState([]);
    useEffect(() => {
        if (!token || !user) return;

        fetch(`http://localhost:8081/users/${user.id}/following`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                setFollowing(data.map(u => u.id));
            })
            .catch((err) => console.error("Error fetching following list", err));
    }, [token, user]);

    const followUser = async (id) => {
        try {
            await fetch(`http://localhost:8081/follows/follow?userId=${id}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            setFollowing((prev) => [...prev, id]);
        } catch (err) {
            console.error("Error following user", err);
        }
    };


    const unfollowUser = async (id) => {
        try {
            await fetch(`http://localhost:8081/follows/unfollow?userId=${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            setFollowing((prev) => prev.filter((uid) => uid !== id));
        } catch (err) {
            console.error("Error unfollowing user", err);
        }
    };

    return (
        <FollowContext.Provider value={{ following, followUser, unfollowUser }}>
            {children}
        </FollowContext.Provider>
    );
}
