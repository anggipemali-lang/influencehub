# InfluenceHub Campaigns REST API Design

This document outlines the REST API design for the Campaigns, Applications, and Approval systems.

## Base URL
`/api`

## Authentication
Most endpoints require a Firebase ID Token passed in the `Authorization` header.
`Authorization: Bearer <ID_TOKEN>`

## 1. Campaigns Module

### List Campaigns
*   **Endpoint:** `GET /campaigns`
*   **Description:** Retrieve all active campaigns.
*   **Response:** `200 OK`
```json
[
  {
    "id": "camp_123",
    "title": "Summer Collection 2024",
    "brandId": "brand_456",
    "status": "active",
    "budget": 5000,
    "createdAt": "2024-05-01T10:00:00Z"
  }
]
```

### Create Campaign
*   **Endpoint:** `POST /campaigns`
*   **Role Required:** `brand`
*   **Request Body:**
```json
{
  "title": "New Tech Review",
  "description": "Influencers needed for unboxing newest laptops.",
  "budget": 2500,
  "targetAudience": { "niche": ["tech", "gaming"] }
}
```
*   **Response:** `201 Created`

### Update Campaign
*   **Endpoint:** `PATCH /campaigns/:id`
*   **Role Required:** `brand` (owner)

### Delete Campaign
*   **Endpoint:** `DELETE /campaigns/:id`

---

## 2. Influencer Application System

### Apply to Campaign
*   **Endpoint:** `POST /campaigns/:id/apply`
*   **Role Required:** `influencer`
*   **Request Body:**
```json
{
  "message": "I'd love to work on this! I have 50k followers in the tech niche."
}
```
*   **Response:** `201 Created`

### List Applications for a Campaign
*   **Endpoint:** `GET /campaigns/:id/applications`
*   **Role Required:** `brand` (owner of the campaign)
*   **Response:**
```json
[
  {
    "id": "app_789",
    "influencerId": "inf_001",
    "status": "pending",
    "appliedAt": "2024-05-02T12:00:00Z"
  }
]
```

---

## 3. Approval/Rejection System

### Review Application
*   **Endpoint:** `POST /applications/:id/review`
*   **Role Required:** `brand`
*   **Request Body:**
```json
{
  "status": "approved" // or "rejected"
}
```
*   **Response:** `200 OK`

---

## Database Schema (Firestore)

### Collection: `campaigns`
*   `title`: string
*   `description`: string
*   `brandId`: string (ref: users.uid)
*   `budget`: number
*   `status`: enum (draft, active, completed)
*   `createdAt`: timestamp

### Collection: `applications`
*   `campaignId`: string (ref: campaigns.id)
*   `influencerId`: string (ref: users.uid)
*   `message`: string
*   `status`: enum (pending, approved, rejected)
*   `appliedAt`: timestamp
*   `reviewedAt`: timestamp (optional)
