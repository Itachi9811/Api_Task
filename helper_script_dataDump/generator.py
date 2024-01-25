import names
import csv
from datetime import datetime, timedelta
import pycountry
import random
import re

# create an empty list to store the leaderboard data
leaderboard_data = []

# loop to generate 1000 sample data
for i in range(0, 15000):
    uid = f"{i}"
    name = names.get_full_name()
    score = random.randint(1, 1000)

    # Get a random ISO 2 letter country code
    country_code = random.choice(list(pycountry.countries)).alpha_2

    # Remove spaces and special characters from the country code
    country_code = re.sub(r'[^a-zA-Z]', '', country_code)

    # Generate a random timestamp within the last 4 months
    random_days_ago = random.randint(0, 120)  # 4 months = 120 days
    timestamp = (datetime.now() - timedelta(days=random_days_ago, hours=random.randint(0, 23), minutes=random.randint(0, 59), seconds=random.randint(0, 59))).strftime("%Y-%m-%d %H:%M:%S")

    leaderboard_data.append((uid, name, score, country_code, timestamp))

# Save the leaderboard data to a text file with SQL insert statements
sql_filename = "leaderboard_data.sql"
with open(sql_filename, "w") as file:
    for data in leaderboard_data:
        insert_query = f"INSERT INTO leaderboard (UID, Name, Score, Country, TimeStamp) VALUES ('{data[0]}', '{data[1]}', {data[2]}, '{data[3]}', '{data[4]}');"
        file.write(insert_query + "\n")
