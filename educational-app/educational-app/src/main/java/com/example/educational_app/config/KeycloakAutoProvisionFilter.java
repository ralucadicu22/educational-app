package com.example.educational_app.config;

import com.example.educational_app.entities.User;
import com.example.educational_app.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Component
@Order(99)
public class KeycloakAutoProvisionFilter extends OncePerRequestFilter {

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        var principal = request.getUserPrincipal();
        if (principal instanceof JwtAuthenticationToken jwtToken) {
            String sub = (String) jwtToken.getTokenAttributes().get("sub");
            if (sub != null && !sub.isEmpty()) {

                User userBySub = userRepository.findByKeycloakId(sub);
                if (userBySub == null) {
                    String preferredUsername = (String) jwtToken.getTokenAttributes().get("preferred_username");
                    if (preferredUsername == null || preferredUsername.isEmpty()) {
                        preferredUsername = sub;
                    }
                    User userByName = userRepository.findByUsername(preferredUsername);

                    if (userByName != null) {
                        userByName.setKeycloakId(sub);
                        userByName.setRole(detectRole(jwtToken));
                        userRepository.save(userByName);
                    } else {
                        User newUser = new User();
                        newUser.setKeycloakId(sub);
                        newUser.setUsername(preferredUsername);
                        newUser.setRole(detectRole(jwtToken));


                        userRepository.save(newUser);
                    }
                }
            }
        }


        filterChain.doFilter(request, response);
    }


    private String detectRole(JwtAuthenticationToken jwtToken) {
        List<String> roles = extractRealmRoles(jwtToken);
        if (roles.contains("Teacher")) {
            return "Teacher";
        } else if (roles.contains("Student")) {
            return "Student";
        }
        return "Student";
    }

    private List<String> extractRealmRoles(JwtAuthenticationToken jwt) {
        Map<String, Object> realmAccess = (Map<String, Object>) jwt.getTokenAttributes().get("realm_access");
        if (realmAccess != null) {
            List<String> roles = (List<String>) realmAccess.get("roles");
            if (roles != null) {
                return roles;
            }
        }
        return List.of();
    }
}
