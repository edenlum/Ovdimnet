import streamlit as st
import os

st.set_page_config(page_title="Edit Process", layout="centered")
st.title("Edit Process")

# Check if rules_file_path exists in session state
if 'rules_file_path' not in st.session_state or not st.session_state['rules_file_path']:
    st.warning("No rules file found. Please go to the 'Create Process' page to upload or create one.")
    st.stop()

rules_file_path = st.session_state['rules_file_path']

# Load current rules content
try:
    with open(rules_file_path, "r") as f:
        current_rules_content = f.read()
except FileNotFoundError:
    st.error(f"Rules file not found at: {rules_file_path}. Please re-upload or create it.")
    st.stop()
except Exception as e:
    st.error(f"Error reading rules file: {e}")
    st.stop()

st.subheader("Manual Rule Editor")
edited_rules_content = st.text_area(
    "Edit the rules below:",
    current_rules_content,
    height=400,
    key="manual_rules_editor"
)

if st.button("Save Manual Changes"):
    try:
        with open(rules_file_path, "w") as f:
            f.write(edited_rules_content)
        st.success("Rules saved successfully!")
        # Update session state to reflect saved changes (though it's the same path, content might have changed)
        st.session_state['rules_file_path'] = rules_file_path
    except Exception as e:
        st.error(f"Error saving rules: {e}")

st.download_button(
    label="Download Current Rules",
    data=current_rules_content.encode("utf-8"),
    file_name="rules.txt",
    mime="text/plain"
)

st.subheader("AI-Powered Rule Correction")
expected_output = st.text_area("Expected Output:", height=150)
actual_output = st.text_area("Actual Output:", height=150)

if st.button("Correct Rules with AI"):
    if expected_output and actual_output:
        try:
            # Call the AI function to update rules
            from src.pydantic.main import update_rules_with_feedback
            updated_rules = update_rules_with_feedback(current_rules_content, expected_output, actual_output)
            
            # Save the updated rules back to the file
            with open(rules_file_path, "w") as f:
                f.write(updated_rules)
            st.success("Rules updated successfully with AI feedback!")
            # Refresh the displayed content
            current_rules_content = updated_rules
            st.session_state['rules_file_path'] = rules_file_path # Re-confirm session state
            st.experimental_rerun() # Rerun to update text area with new content
        except Exception as e:
            st.error(f"Error applying AI correction: {e}")
    else:
        st.warning("Please provide both Expected Output and Actual Output for AI correction.")
