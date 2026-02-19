import streamlit as st
import pandas as pd
from autogluon.tabular import TabularPredictor
import shutil
import os
from streamlit_pandas_profiling import st_profile_report
import ydata_profiling
import dtale

st.set_page_config(layout="wide", page_title="Automated ML Builder")

# -----------------------------
# Initialize session state
# -----------------------------
if "uploaded_file" not in st.session_state:
    st.session_state["uploaded_file"] = None
if "automl_predictor" not in st.session_state:
    st.session_state["automl_predictor"] = None
if "leaderboard" not in st.session_state:
    st.session_state["leaderboard"] = None
if "active_page" not in st.session_state:
    st.session_state["active_page"] = "Welcome"
if "dtale_url" not in st.session_state:
    st.session_state["dtale_url"] = None

# -----------------------------
# Page Functions
# -----------------------------
def welcome_window():
    st.markdown("<h1 style='text-align: center; color: #4B8BBE;'>🤖 Welcome to Automated ML Builder</h1>", unsafe_allow_html=True)
    st.markdown("<p style='text-align: center; font-size:18px;'>Build, train, and deploy machine learning models with just a few clicks!</p>", unsafe_allow_html=True)

    st.write("---")
    st.subheader("🚀 Key Features")
    st.markdown("""
    - Automated Model Selection
    - Data Preprocessing
    - Hyperparameter Tuning
    - Interactive Visualizations
    - Export Models
    """)
    st.write("---")
    st.subheader("🛠️ Quick Start")
    st.markdown("""
    1. Upload your dataset (CSV or Excel)
    2. Select your target column
    3. Choose task type: Classification or Regression
    4. Click Build Model and watch it work!
    """)

    st.markdown("<h3 style='text-align: center;'>Ready to get started?</h3>", unsafe_allow_html=True)
    if st.button("🚀 Start Building Models"):
        st.session_state["active_page"] = "Upload CSV"

    st.markdown("<p style='text-align: center; color: gray;'>© 2026 Automated ML Builder</p>", unsafe_allow_html=True)


def upload_csv_window():
    st.title("📤 Upload CSV File")
    uploaded_file = st.file_uploader("Upload your CSV", type=["csv"])
    if uploaded_file:
        df = pd.read_csv(uploaded_file)
        st.session_state["uploaded_file"] = df
        st.success("File uploaded successfully!")
        st.dataframe(df.head())

    if st.session_state["uploaded_file"] is not None:
        if st.button("➡️ Next: Data Operations"):
            st.session_state["active_page"] = "Data Operations"


def data_operations_window():
    st.title("⚙️ Data Operations / Cleaning")
    df = st.session_state.get("uploaded_file")
    if df is not None:
        st.subheader("Preview CSV")
        st.dataframe(df.head())

        st.subheader("Remove Columns")
        cols_to_drop = st.multiselect("Select columns to remove", options=df.columns.tolist())
        if st.button("Remove Selected Columns"):
            if cols_to_drop:
                df.drop(columns=cols_to_drop, inplace=True)
                st.session_state["uploaded_file"] = df
                st.success(f"Removed columns: {', '.join(cols_to_drop)}")
                st.dataframe(df.head())
            else:
                st.warning("Select at least one column to remove.")

        col1, col2 = st.columns(2)
        with col1:
            if st.button("⬅️ Back to Upload CSV"):
                st.session_state["active_page"] = "Upload CSV"
        with col2:
            if st.button("➡️ Next: Data Exploration"):
                st.session_state["active_page"] = "Data Exploration"
    else:
        st.warning("Please upload a CSV first in the Upload CSV window.")


def data_exploration_window():
    st.title("📊 Data Exploration (D-Tale / Pandas Profiling)")
    df = st.session_state.get("uploaded_file")
    if df is not None:
        st.subheader("Preview CSV")
        st.dataframe(df.head())

        # Start D-Tale once
        if st.session_state.get("dtale_url") is None:
            if st.button("Open D-Tale Interface"):
                st.info("Starting D-Tale session...")
                d = dtale.show(df, ignore_duplicate=True)
                st.session_state["dtale_url"] = d._main_url
                st.success("D-Tale session started!")

        if st.session_state.get("dtale_url"):
            st.components.v1.iframe(src=st.session_state["dtale_url"], height=500, scrolling=True)

        # Pandas profiling
        if st.button("Generate Pandas Profiling Report"):
            profile = df.profile_report()
            st_profile_report(profile)

        col1, col2 = st.columns(2)
        with col1:
            if st.button("⬅️ Back to Data Operations"):
                st.session_state["active_page"] = "Data Operations"
        with col2:
            if st.button("➡️ Next: AutoML"):
                st.session_state["active_page"] = "AutoML"
    else:
        st.warning("Please upload a CSV first.")


def automl_window():
    st.title("🤖 AutoML (AutoGluon)")
    df = st.session_state.get("uploaded_file")
    if df is not None:
        target_column = st.selectbox("Select target column for AutoML", options=df.columns)
        if st.button("Run AutoML"):
            with st.spinner("Running AutoGluon... this may take a while"):
                predictor = TabularPredictor(label=target_column).fit(df, presets='medium_quality')
                st.session_state["automl_predictor"] = predictor
                st.session_state["leaderboard"] = predictor.leaderboard(df, silent=True)
            st.success("AutoGluon finished!")

        if st.session_state.get("leaderboard") is not None:
            st.subheader("Leaderboard")
            st.dataframe(st.session_state["leaderboard"])

        col1, col2 = st.columns(2)
        with col1:
            if st.button("⬅️ Back to Data Exploration"):
                st.session_state["active_page"] = "Data Exploration"
        with col2:
            if st.button("➡️ Next: Download"):
                st.session_state["active_page"] = "Download Files"
    else:
        st.warning("Please upload a CSV first.")


def download_window():
    st.title("💾 Download Files / Model")
    df = st.session_state.get("uploaded_file")
    predictor = st.session_state.get("automl_predictor")

    if df is not None:
        st.download_button(
            label="Download Processed CSV",
            data=df.to_csv(index=False).encode('utf-8'),
            file_name="processed_data.csv"
        )

    if predictor is not None:
        model_dir = "AutogluonModels"
        predictor.save(model_dir)
        shutil.make_archive("autogluon_model", 'zip', model_dir)
        st.download_button(
            label="Download AutoGluon Model",
            data=open("autogluon_model.zip", "rb"),
            file_name="autogluon_model.zip"
        )
        shutil.rmtree(model_dir)
        os.remove("autogluon_model.zip")

    if st.button("⬅️ Back to AutoML"):
        st.session_state["active_page"] = "AutoML"


# -----------------------------
# Sidebar Navigation
# -----------------------------
st.sidebar.title("Navigation")
pages = {
    "Welcome": welcome_window,
    "Upload CSV": upload_csv_window,
    "Data Operations": data_operations_window,
    "Data Exploration": data_exploration_window,
    "AutoML": automl_window,
    "Download Files": download_window
}
selected_page = st.sidebar.radio("Go to", list(pages.keys()), index=list(pages.keys()).index(st.session_state["active_page"]))
st.session_state["active_page"] = selected_page

# -----------------------------
# Render Active Page
# -----------------------------
pages[st.session_state["active_page"]]()
