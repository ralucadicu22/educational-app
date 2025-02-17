package com.example.educational_app.utils;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

public class KeycloakUtil {

    public static String getKeycloakIdFromToken() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth instanceof JwtAuthenticationToken jwtToken) {
            Object sub = jwtToken.getTokenAttributes().get("sub");
            if (sub != null) {
                return sub.toString();
            }
        }
        return null;
    }
}