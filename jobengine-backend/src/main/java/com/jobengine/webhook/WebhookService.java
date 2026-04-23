package com.jobengine.webhook;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

/**
 * Sends webhook events to n8n for automation workflows.
 * Triggered on: status changes, new applications, interview scheduling.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class WebhookService {

    @Value("${n8n.webhook.base-url}")
    private String n8nBaseUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendStatusChangeWebhook(Map<String, Object> payload) {
        sendWebhook("/status-change", payload);
    }

    public void sendNewApplicationWebhook(Map<String, Object> payload) {
        sendWebhook("/new-application", payload);
    }

    public void sendAutoRejectWebhook(Map<String, Object> payload) {
        sendWebhook("/auto-reject", payload);
    }

    public void sendInterviewWebhook(Map<String, Object> payload) {
        sendWebhook("/interview", payload);
    }

    private void sendWebhook(String path, Map<String, Object> payload) {
        try {
            String url = n8nBaseUrl + path;
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            restTemplate.postForEntity(url, request, String.class);
            log.info("Webhook sent successfully to: {}", url);
        } catch (Exception e) {
            // Don't fail the main operation if webhook fails
            log.warn("Failed to send webhook to n8n: {}", e.getMessage());
        }
    }
}
