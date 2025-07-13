# To run this code you need to install the following dependencies:
# pip install google-genai python-dotenv

import os
import argparse
from google import genai
from google.genai import types
from dotenv import load_dotenv


def call_gemini(prompt, model="gemini-2.5-pro"):
    load_dotenv()
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY not found in .env file.")
        return
    
    client = genai.Client(
        api_key=os.environ.get("GEMINI_API_KEY"),
    )

    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=prompt),
            ],
        ),
    ]

    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
    ):
        print(chunk.text, end="")

    return chunk.text

def generate(csv_file_path, rules_file_path):
    """
    Generates system table configurations based on a CSV file and a set of rules.

    Args:
        csv_file_path (str): The path to the CSV file containing customer requirements.
        rules_file_path (str): The path to the text file containing transformation rules.
    """

    # Read the content of the CSV and rules files
    try:
        with open(csv_file_path, 'r', encoding='utf-8') as f:
            csv_content = f.read()
    except FileNotFoundError:
        print(f"Error: The file '{csv_file_path}' was not found.")
        return

    try:
        with open(rules_file_path, 'r', encoding='utf-8') as f:
            rules_content = f.read()
    except FileNotFoundError:
        print(f"Error: The file '{rules_file_path}' was not found.")
        return

    # Construct the prompt
    prompt = f"""
    Based on the following rules:

    {rules_content}

    And the following CSV data:

    {csv_content}

    Generate the corresponding JSON configurations for the system tables.
    The output should be a valid JSON object containing the configurations for the following tables:
    - wt_employeetypes
    - wt_activities
    - wt_activitytypes
    - wt_day_types
    - wt_et_cols_defs
    - wt_et_cols_display
    - wt_et_dt
    - wt_et_pcols
    """

    try:
        response = call_gemini(prompt)
        print(response)
    except Exception as e:
        print(f"An error occurred during the API call: {e}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate system table configurations from a CSV file.")
    parser.add_argument("csv_file", help="The path to the CSV file containing customer requirements.")
    args = parser.parse_args()

    rules_file = "/Users/edenlumbroso/personal_projects/Ovdimnet/src/transformation_rules.txt"
    generate(args.csv_file, rules_file)
