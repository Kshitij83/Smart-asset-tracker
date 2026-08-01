package com.assettrackr.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    @NotBlank
    private String emailOrUsername;

    @NotBlank
    private String password;

    public String getEmailOrUsername() { return emailOrUsername; }
    public void setEmailOrUsername(String emailOrUsername) { this.emailOrUsername = emailOrUsername; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
