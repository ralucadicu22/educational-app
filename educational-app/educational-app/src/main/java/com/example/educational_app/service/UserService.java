package com.example.educational_app.service;


import com.example.educational_app.KeycloakHelper;
import com.example.educational_app.entities.User;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    public void addKeycloakUser(User user) {

        Keycloak admin = KeycloakHelper.getAdminClient();
        RealmResource keycloakRealm = admin.realm("educationalApp");
        String group = user.getRole().equalsIgnoreCase("teacher") ? "teachers" : "students";
    }
}