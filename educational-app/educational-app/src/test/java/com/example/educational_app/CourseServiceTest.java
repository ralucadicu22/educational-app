package com.example.educational_app;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.example.educational_app.entities.Courses;
import com.example.educational_app.entities.User;
import com.example.educational_app.repository.CoursesRepository;
import com.example.educational_app.repository.UserRepository;
import com.example.educational_app.service.CoursesService;
import com.example.educational_app.utils.KeycloakUtil;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class CoursesServiceTest {
    @Mock
    CoursesRepository coursesRepository;
    @Mock
    UserRepository userRepository;

    CoursesService coursesService;
    MockedStatic<KeycloakUtil> keycloakMock;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        coursesService = new CoursesService(coursesRepository, userRepository);
        keycloakMock = mockStatic(KeycloakUtil.class);

        lenient().when(coursesRepository.save(any(Courses.class)))
                .thenAnswer(inv -> inv.getArgument(0));
    }

    @AfterEach
    void tearDown() {
        keycloakMock.close();
    }

    @Test
    void createCourse_WhenUserIsTeacher() {
        keycloakMock.when(KeycloakUtil::getKeycloakIdFromToken)
                .thenReturn("teacher123");

        User teacher = new User();
        teacher.setKeycloakId("teacher123");
        teacher.setRole("Teacher");
        when(userRepository.findByKeycloakId("teacher123"))
                .thenReturn(teacher);

        Courses saved = coursesService.createCourse("My Course", "Description");
        ArgumentCaptor<Courses> cap = ArgumentCaptor.forClass(Courses.class);
        verify(coursesRepository).save(cap.capture());

        Courses toSave = cap.getValue();
        assertEquals("My Course", toSave.getName());
        assertEquals("Description", toSave.getDescription());
        assertEquals("teacher123", toSave.getCreator().getKeycloakId());
        assertSame(toSave, saved);
    }

    @Test
    void createCourse_WhenUserIsNotTeacher() {

        keycloakMock.when(KeycloakUtil::getKeycloakIdFromToken)
                .thenReturn("student123");

        User student = new User();
        student.setKeycloakId("student123");
        student.setRole("Student");
        when(userRepository.findByKeycloakId("student123"))
                .thenReturn(student);

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                coursesService.createCourse("My Course", "My description")
        );
        assertTrue(ex.getMessage().contains("Only Teachers"),
                "Expected exception message to mention Only Teachers");
    }
}
