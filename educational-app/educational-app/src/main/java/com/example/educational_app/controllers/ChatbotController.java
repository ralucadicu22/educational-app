package com.example.educational_app.controllers;

import com.example.educational_app.entities.Courses;
import com.example.educational_app.entities.User;
import com.example.educational_app.entities.chatbot.ChatRequest;
import com.example.educational_app.repository.UserRepository;
import com.example.educational_app.service.CoursesService;
import com.example.educational_app.utils.KeycloakUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/chatbot")
public class ChatbotController {

    private final RestTemplate restTemplate;
    private final UserRepository userRepository;
    @Autowired
    private CoursesService coursesService;
    @Autowired
    public ChatbotController(RestTemplate restTemplate, UserRepository userRepository) {
        this.restTemplate = restTemplate;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<String> chat(@RequestBody ChatRequest chatRequest) {
        String keycloakId = KeycloakUtil.getKeycloakIdFromToken();
        if (keycloakId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing JWT or sub");
        }
        User user = userRepository.findByKeycloakId(keycloakId);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found in DB for sub = " + keycloakId);
        }

        List<String> favSubjects = user.getFavoriteSubjects();
        String subjects = (favSubjects == null || favSubjects.isEmpty())
                ? "none"
                : String.join(", ", favSubjects);

        List<Courses> userCourses = coursesService.getCoursesByUser(user.getId());
        String courseNames = userCourses.stream()
                .map(Courses::getName)
                .collect(Collectors.joining(", "));

        String systemContext = String.format(
                "You are an educational tutor. The user is interested in the following topics: %s. " +
                        "They are currently involved in courses: %s. " +
                        "Please provide suggestions relevant to these interests. User says: %s",
                subjects,
                courseNames,
                chatRequest.getPrompt()
        );

        ObjectMapper mapper = new ObjectMapper();
        ObjectNode payload = mapper.createObjectNode();
        payload.put("model", "codellama");
        payload.put("prompt", systemContext);
        payload.put("stream", false);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String body = mapper.writeValueAsString(payload);
            HttpEntity<String> request = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.postForEntity("http://localhost:11434/api/generate", request, String.class);

            String responseBody = response.getBody();
            if (responseBody == null) {
                return ResponseEntity.ok("No content returned from AI endpoint.");
            }

            JsonNode root = mapper.readTree(responseBody);
            String generatedText = root.path("response").asText();

            return ResponseEntity.ok(generatedText);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed: " + e.getMessage());
        }
    }

}
