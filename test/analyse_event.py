import time

import requests

# Define the API endpoint
url = "http://localhost:3000/trigger-task"  # Local
# url = "https://isph-se-pubsub-services-e18f2fd3b798.herokuapp.com/trigger-task"  # Heroku

# Test cases
event_ids = [
    'c0b31539-858d-44a9-9142-42635ab70b3f',
    '7aa08ff7-82d9-4be2-afaf-85582a15fb3b',
    'd80bca12-8f32-4eb8-82c8-e7cdd54fe6cc',
    'e706e547-d6f0-4541-ae5a-49c3d7b75cc5',
    'fe80fb1e-ab40-441f-9941-063628deca65',
]

for event_id in event_ids:
    payload = {"eventId": event_id}
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    time.sleep(20)
