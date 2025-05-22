from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_create_event():
    event_data = {
        "site_id": "test-site",
        "type": "page_view",
        "data": {
            "url": "http://test.com",
            "referrer": "http://google.com",
            "timestamp": "2024-01-01T00:00:00Z"
        }
    }
    response = client.post(
        "/api/v1/events",
        json=event_data,
        headers={"X-Site-ID": "test-site"}
    )
    assert response.status_code == 200
    assert response.json()["message"] == "Event recorded" 