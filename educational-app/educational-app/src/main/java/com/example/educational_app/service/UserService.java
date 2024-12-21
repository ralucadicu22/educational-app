package com.example.educational_app.service;

import com.example.educational_app.KeycloakHelper;
import com.example.educational_app.entities.User;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    public void addKeycloakUser(User user) {
        Keycloak adminClient = KeycloakHelper.getAdminClient();
        RealmResource realmResource = adminClient.realm("educationalApp");
        String userType = user.getRole();
        KeycloakHelper.addUser(realmResource, user, userType);

    }
}