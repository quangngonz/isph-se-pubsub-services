from datetime import datetime

# Function to convert a date to a timestamp and update the rules
def update_rules(input_date_str):
    try:
        # Parse the input date
        input_date = datetime.strptime(input_date_str, '%d-%m-%Y')
        
        # Convert the date to milliseconds since epoch
        timestamp = int(input_date.timestamp() * 1000)
        
        # Update the rules with the new timestamp
        rules = {
            ".read": f"now < {timestamp}",
            ".write": f"now < {timestamp}",
        }
        
        # Print the updated rules
        print("Updated rules:")
        for key, value in rules.items():
            print(f'  "{key}": "{value}"')
    except ValueError:
        print("Invalid date format. Please use dd-mm-yyyy.")

# Input date in dd-mm-yyyy format
user_input = input("Enter a date (dd-mm-yyyy): ")
update_rules(user_input)
