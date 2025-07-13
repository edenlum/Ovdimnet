import streamlit as st
import os
import tempfile
import json
from app_streamlit.backend.main import run_process

st.set_page_config(layout="centered", page_title="Ovdimnet File Processor")
st.title("Ovdimnet File Processor")

st.write("Upload your `requirements.csv` and other JSON files here.")

uploaded_files = st.file_uploader(
    "Drag and drop files here, or click to browse",
    type=["csv", "json"],
    accept_multiple_files=True,
    key="file_uploader"
)

if uploaded_files:
    st.write("Files uploaded:")
    for file in uploaded_files:
        st.write(f"- {file.name}")

    process_button = st.button("Process Files")

    if process_button:
        requirements_csv = None
        json_files = []

        for uploaded_file in uploaded_files:
            if uploaded_file.name.lower().endswith('.csv') and "requirements" in uploaded_file.name.lower():
                requirements_csv = uploaded_file
            elif uploaded_file.name.lower().endswith('.json'):
                json_files.append(uploaded_file)

        if not requirements_csv:
            st.error("Please upload a `requirements.csv` file.")
        elif not json_files:
            st.error("Please upload at least one JSON file.")
        else:
            with tempfile.TemporaryDirectory() as tmpdir:
                # Save requirements.csv
                req_csv_path = os.path.join(tmpdir, requirements_csv.name)
                with open(req_csv_path, "wb") as f:
                    f.write(requirements_csv.getbuffer())

                # Create inputs directory and save JSON files
                inputs_dir = os.path.join(tmpdir, "inputs")
                os.makedirs(inputs_dir, exist_ok=True)
                for json_file in json_files:
                    json_path = os.path.join(inputs_dir, json_file.name)
                    with open(json_path, "wb") as f:
                        f.write(json_file.getbuffer())

                # Define rules file path and output path
                # Path to the rules file (now managed by Create Process page)
                if 'rules_file_path' not in st.session_state:
                    st.error("Rules file not found. Please upload the rules file in the 'Create Process' page first.")
                    st.stop()
                rules_path = st.session_state['rules_file_path']
                output_path = os.path.join(tmpdir, "configs.json")

                try:
                    st.info("Processing files...")
                    run_process(req_csv_path, rules_path, inputs_dir, output_path)
                    st.success("Processing complete!")

                    # Display and allow download of the output
                    if os.path.exists(output_path):
                        with open(output_path, "r") as f:
                            output_json = json.load(f)
                        st.subheader("Generated Configuration:")
                        st.json(output_json)

                        st.download_button(
                            label="Download configs.json",
                            data=json.dumps(output_json, indent=4),
                            file_name="configs.json",
                            mime="application/json"
                        )
                    else:
                        st.error("Output file not found.")

                except Exception as e:
                    st.error(f"An unexpected error occurred: {e}")