import { Routes, Route, useLocation } from "react-router-dom";
import { useContext } from "react";
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
import MessagesPage from "./pages/MessagesPage";
import ConversationPage from "./pages/ConversationPage";

import { AuthProvider, AuthContext } from "./context/AuthProvider";
import { FollowProvider } from "./context/FollowContext";
import { ThemeProvider } from "./context/ThemeContext";
import {MessagesProvider} from "./context/MessageContext";
import EditQuizPage from "./pages/EditQuizPage";
import EditCoursePage from "./pages/EditCoursePage";

import Navbar from "./components/Navbar";
import ChatWidget from "./components/ChatWidget";
import {ScreenReaderProvider} from "./context/ScreenReaderContext";
import ScreenReaderButton from "./components/ScreenReaderButton";

function AppRoutes() {
    const location = useLocation();
    const authPages = ["/login", "/register", "/"];
    const isAuthPage = authPages.includes(location.pathname);
    const isQuizDetailsPage = /^\/quizzes\/(?!create)[^/]+$/.test(location.pathname);

    return (
        <div className={isQuizDetailsPage ? "full-screen" : ""}>
            {!isAuthPage && !isQuizDetailsPage && (
                <>
                    <Navbar />
                    <ChatWidget />
                </>
            )}

            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<HomePage />} />
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
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/conversation/:otherUserId" element={<ConversationPage />} />
                <Route path="/courses/:courseId/edit" element={<EditCoursePage />} />
                <Route path="/quizzes/:quizId/edit" element={<EditQuizPage />} />

            </Routes>
        </div>
    );
}

function AppWithMessages() {
    const { token } = useContext(AuthContext);

    return (
        <MessagesProvider token={token}>
            <ThemeProvider>
                <AppRoutes />
            </ThemeProvider>
        </MessagesProvider>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <ScreenReaderProvider>
                <FollowProvider>
                    <AppWithMessages />
                    <ScreenReaderButton />
                </FollowProvider>
            </ScreenReaderProvider>
        </AuthProvider>
    );
}
