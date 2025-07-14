import streamlit as st
import os

st.set_page_config(page_title="Create Process", layout="centered")
st.title("Create Process")

st.write("Upload your `rules.txt` file here.")

uploaded_rules_file = st.file_uploader(
    "Drag and drop rules.txt here, or click to browse",
    type=["txt"],
    key="rules_file_uploader"
)

if uploaded_rules_file:
    rules_content = uploaded_rules_file.read().decode("utf-8")
    
    # Define the path where rules.txt is expected by the pydantic script
    rules_path = os.path.join(os.getcwd(), "rules.txt")

    try:
        with open(rules_path, "w") as f:
            f.write(rules_content)
        st.success(f"`rules.txt` successfully saved to `{rules_path}`")
        st.subheader("Content of rules.txt:")
        st.code(rules_content)
        st.session_state['rules_file_path'] = rules_path # Store path in session state
    except Exception as e:
        st.error(f"Error saving rules.txt: {e}")
