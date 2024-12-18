package com.example.educational_app;


import com.example.educational_app.entities.User;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.GroupRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Collections;

import static org.keycloak.admin.client.CreatedResponseUtil.getCreatedId;

public class KeycloakHelper {
    public static Keycloak getAdminClient() {
        return KeycloakBuilder.builder()
                .serverUrl(" http://127.0.0.1:8080")
                .realm("educationalApp")
                .grantType(OAuth2Constants.PASSWORD)
                .clientId("educational-web-app")
                .username("admin")
                .password("admin")
                .build();
    }


    public static GroupRepresentation findGroup(RealmResource realm, String groupName) {
        return realm.groups().groups().stream().filter(group -> group.getName().equals(groupName)).findFirst()
                .orElse(null);
    }


    public static String addUser(RealmResource realm, User user, String userType) {
        UserRepresentation keycloakUser = new UserRepresentation();
        keycloakUser.setEnabled(true);
        keycloakUser.setUsername(user.getUsername());
        String group = userType + "s";

        GroupRepresentation userGroup = findGroup(realm, group);
        if (userGroup == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "NoSuchGroup");
        keycloakUser.setGroups(new ArrayList<>(Collections.singletonList(group)));


        UsersResource userResource = realm.users();
        try (Response response = userResource.create(keycloakUser)) {
            String userId = getCreatedId(response);
            CredentialRepresentation password = new CredentialRepresentation();
            password.setTemporary(false);
            password.setType(CredentialRepresentation.PASSWORD);
            password.setValue(user.getPassword());
            password.setTemporary(false);
            userResource.get(userId).resetPassword(password);
            return userId;
        } catch (WebApplicationException e) {
            throw new ResponseStatusException(HttpStatus.valueOf(e.getResponse().getStatus()), "Could not create Keycloak user");
        }

    }
}
