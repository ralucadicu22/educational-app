import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CoursesPage from "./pages/CoursePage";
import CourseDetailsPage from "./pages/CourseDetailsPage";
import CreateQuizPage from "./pages/CreateQuizPage";
import QuizDetailsPage from "./pages/QuizDetailsPage";
import QuizAttemptListPage from "./pages/QuizAttemptListPage";
import UploadFilePage from "./pages/UploadFilePage";
import GenerateCodePage from "./pages/GenerateCodePage";
import ForumPage from "./pages/ForumPage";
import PostDetailPage from "./pages/PostDetailPage";
import UserList from "./pages/UserList";
import UserProfile from "./pages/UserProfile";
import { AuthProvider } from "./context/AuthProvider";
import { FollowProvider } from "./context/FollowContext";


function App() {


    return (
        <AuthProvider>
            <FollowProvider>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/courses" element={<CoursesPage />} />
                        <Route path="/courses/:courseId" element={<CourseDetailsPage />} />
                        <Route path="/quizzes/create" element={<CreateQuizPage />} />
                        <Route path="/quizzes/:quizId" element={<QuizDetailsPage />} />
                        <Route path="/attempts/user/:userId" element={<QuizAttemptListPage />} />
                        <Route path="/attempts/leaderboard/course/:courseId" element={<QuizAttemptListPage />} />
                        <Route path="/course-files/:courseId/upload" element={<UploadFilePage />} />
                        <Route path="/courses/:courseId/generate-code" element={<GenerateCodePage />} />
                        <Route path="/forum" element={<ForumPage />} />
                        <Route path="/forum/:postId" element={<PostDetailPage />} />
                        <Route path="/users" element={<UserList />} />
                        <Route path="/users/:id" element={<UserProfile />} />
                    </Routes>

            </FollowProvider>
        </AuthProvider>
    );
}

export default App;
