import requests

# Define the API endpoint
url = "http://localhost:3000/trigger-task"  # Local
# url = "https://isph-sse.vercel.app/teacher/add-event"  # Vercel
# url = "https://isph-se-pubsub-services-e18f2fd3b798.herokuapp.com/trigger-task" # Heroku

# Test cases
test_cases = [
    {
        "description": "Valid request",
        "payload": {
            "eventId": "c0b31539-858d-44a9-9142-42635ab70b3f"   
        },
        "expected_status": 200
    },
    {
        "description": "Missing eventDetails",
        "payload": {},
        "expected_status": 400
    },
    {
        "description": "Missing required fields",
        "payload": {
            "eventDetails": {
                "event_name": "Science Fair"
            }
        },
        "expected_status": 400
    }
]

# Run tests
# for case in test_cases:
#     print(f"Running test: {case['description']}")
#     response = requests.post(url, json=case['payload'])
#     print(f"Status Code: {response.status_code}")
#     print(f"Response: {response.text}")
#     assert response.status_code == case['expected_status'], f"Test failed for {case['description']}"

response = requests.post(url, json=test_cases[0]['payload'])
print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")
