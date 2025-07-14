from pydantic_ai import Agent
from dotenv import load_dotenv
import argparse
import json
import os

from backend.config_classes import Configs

load_dotenv()


def get_prompt(csv_content, rules_content, jsons):
        # Construct the prompt
    prompt = f"""
    Based on the following rules:

    {rules_content}

    the following CSV data:

    {csv_content}

    and the following JSON data:

    {jsons}

    Generate the corresponding JSON configurations for the system tables.
    The output should be a valid JSON object containing the configurations for the following tables:
    - wt_employeetypes
    - wt_et_cols_display
    - wt_et_dt
    """

    return prompt

def system_prompt():
    return """
    You are an expert Data Transformation and System Configuration Agent.

    Your primary mission is to accurately translate customer-specific work agreement rules, provided in a Hebrew CSV file, into a series of structured JSON configuration files for the Ovdimnet time management system. You must act with precision, ensuring perfect data integrity and adherence to the target JSON schema.

    """


def generate(csv_content, rules_content, jsons):
    prompt = get_prompt(csv_content, rules_content, jsons)

    agent = Agent(
        'google-gla:gemini-2.5-flash',
        system_prompt=system_prompt(),  
        output_type=Configs,
    )

    result = agent.run_sync(prompt)  

    return result.output

def update_rules_with_feedback(current_rules, expected_output, actual_output):
    prompt = f"""
    Given the current transformation rules:

    {current_rules}

    And the following discrepancy:
    Expected Output:
    {expected_output}

    Actual Output:
    {actual_output}

    Please update the transformation rules to ensure that this discrepancy does not occur again.
    Provide only the updated rules content, no additional text or explanation.
    """

    agent = Agent(
        'google-gla:gemini-2.5-flash',
        system_prompt="You are an expert in modifying transformation rules based on provided feedback. \
        Your goal is to update the rules to resolve discrepancies between expected and actual outputs. \
        Provide only the updated rules content.",
        output_type=str,
    )

    result = agent.run_sync(prompt)
    return result.output

def save_configs(configs, path):
    with open(path, "w") as f:
        json.dump(configs.model_dump(), f, indent=4)

def run_process(csv_file, rules_file, inputs_dir, output_file):
    with open(rules_file, "r") as f:
        rules_content = f.read()
    with open(csv_file, "r") as f:
        csv_content = f.read()
    jsons = {}
    for file_name in os.listdir(inputs_dir):
        if file_name.endswith(".json"):
            with open(os.path.join(inputs_dir, file_name), "r") as f:
                jsons[file_name] = json.load(f)
    configs = generate(csv_content, rules_content, jsons)
    save_configs(configs, output_file)
