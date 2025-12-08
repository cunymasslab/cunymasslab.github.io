---
layout: post
title: Setting Up Python Development Environment for Lab Research
date: 2025-09-26 12:00:00
description: A comprehensive guide for newcomers to set up Python environments using Conda, pip, and uv for reproducible research
tags: python conda pip uv tutorial environment
categories: tutorials
author: Vitaliy Tei and Josemar Ochoa
giscus_comments: true
related_posts: false
toc:
  sidebar: left
---

Welcome to the CUNY MASS Lab! This tutorial will guide you through setting up a robust Python development environment for your research work. We'll use **Conda** to manage system-level environments and explore two popular tools for managing Python dependencies: **pip** and **uv**.

## Why Environment Management Matters

When working on research projects, especially in machine learning and data science, you'll often need:

- Different Python versions for different projects
- Isolated package dependencies to avoid conflicts
- Reproducible environments that your collaborators can recreate
- Clean separation between projects
- Distinction between system-level and Python package isolation

**System vs. Package Environments:** It's important to understand two layers of isolation. **System environments** manage the Python interpreter itself along with system-level libraries and dependencies (like CUDA drivers, compilers, and native binaries). **Python package environments** manage pure Python packages and their dependencies. Conda excels at creating system environments—for example, it can install CUDA libraries, different Python versions, and compiled packages like NumPy with optimized BLAS libraries. In contrast, pip and uv focus on Python package management within an existing Python installation. Conda actually provides both layers, while pip/uv only handle the package layer.

This is where environment management tools become essential.

---

## Prerequisites

Before we begin, ensure you have:

- **Windows 10/11** (for local development) or **Linux** (for cluster work)
- **Git** installed on your system
- Access to your lab's computing cluster (if applicable)

---

## Part 1: Setting Up Conda

[Conda](https://docs.conda.io/en/latest/) is an open-source package and environment management system that works across platforms. We'll use **Miniconda**, a minimal installer for Conda.

### Installing Miniconda

#### On Windows

1. Download Miniconda from the [official website](https://www.anaconda.com/docs/getting-started/miniconda/install)
2. Run the installer
3. **Important:** Check "Add Miniconda to PATH" during installation (or use Anaconda Prompt)
4. Open **Anaconda Prompt** (or Command Prompt if added to PATH)
5. Verify installation:

```bash
conda --version
```

#### On Linux (Cluster)

SSH into your cluster and run:

```bash
# Download Miniconda installer
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh

# Run the installer
bash Miniconda3-latest-Linux-x86_64.sh

# Follow the prompts, accept the license, and confirm the installation location
# When asked "Do you wish to update your shell profile to automatically initialize conda?" answer yes

# Reload your shell configuration
source ~/.bashrc

# Verify installation
conda --version
```

### Accepting Conda Terms of Service (if required)

Recent versions of Conda may require accepting Terms of Service:

```bash
conda tos accept --override-channels --channel https://repo.anaconda.com/pkgs/main
conda tos accept --override-channels --channel https://repo.anaconda.com/pkgs/r
conda tos accept --override-channels --channel https://repo.anaconda.com/pkgs/msys2
```

### Creating Your First Environment

Let's create an environment called `research-env` with Python 3.10:

```bash
# Create environment with specific Python version
conda create -n research-env python=3.10 -y

# Activate the environment
conda activate research-env

# Your prompt should now show (research-env)
```

### Installing Core Scientific Packages with Conda

Conda is excellent for installing complex scientific packages with C/C++ dependencies:

```bash
conda install -y numpy pandas scikit-learn matplotlib jupyter
```

### Verifying Your Conda Environment

Test that everything works:

```bash
python -c "import numpy, pandas, sklearn, matplotlib; print('Environment setup successful ✅')"
```

### Useful Conda Commands

```bash
# List all environments
conda env list

# Deactivate current environment
conda deactivate

# Remove an environment
conda env remove -n research-env

# Update conda itself
conda update conda

# List packages in current environment
conda list
```

### Exporting and Sharing Environments

To make your environment reproducible:

```bash
# Export environment to a file
conda env export > environment.yml

# Share environment.yml with collaborators
# They can recreate it with:
# conda env create -f environment.yml
```

**Example `environment.yml`:**

```yaml
name: research-env
channels:
  - defaults
dependencies:
  - python=3.10
  - numpy
  - pandas
  - scikit-learn
  - matplotlib
  - jupyter
  - pip
  - pip:
    - some-pip-only-package
```

---

## Part 2: Managing Dependencies with pip

[pip](https://pip.pypa.io/en/stable/) is the standard package installer for Python. It's bundled with Python and comes pre-installed in Conda environments.

### Why Use pip with Conda?

While Conda can install Python packages, pip is often necessary because:

- Many packages are only available on PyPI (Python Package Index)
- Some packages release newer versions on PyPI first
- Your project may have dependencies only available via pip

### Using pip in a Conda Environment

**Best Practice:** Always activate your Conda environment before using pip!

```bash
# Activate your environment
conda activate research-env

# Verify pip is from your conda environment
which pip  # Linux/Mac
where pip  # Windows

# Expected output should show path inside your conda environment
# e.g., ~/miniconda3/envs/research-env/bin/pip
```

### Installing Packages with pip

```bash
# Install a single package
pip install requests

# Install a specific version
pip install torch==2.0.0

# Install from requirements file
pip install -r requirements.txt

# Install in editable mode (for development)
pip install -e .
```

### Creating a requirements.txt File

A `requirements.txt` file lists all pip-installed packages:

```bash
# Generate requirements.txt from current environment
pip freeze > requirements.txt

# Install all packages from requirements.txt
pip install -r requirements.txt
```

**Example `requirements.txt`:**

```text
numpy==1.24.3
pandas==2.0.2
scikit-learn==1.3.0
matplotlib==3.7.1
torch==2.0.0
transformers==4.30.0
```

### Managing Dependencies

```bash
# List installed packages
pip list

# Show details about a package
pip show numpy

# Upgrade a package
pip install --upgrade numpy

# Uninstall a package
pip uninstall numpy
```

### Common pip Issues and Solutions

#### Issue: pip installs to wrong location

**Solution:** Make sure your conda environment is activated first!

```bash
conda activate research-env
which pip  # Verify correct location
pip install package-name
```

#### Issue: Permission denied errors

**Solution:** Never use `sudo pip`! Use conda environments or virtual environments instead.

```bash
# Wrong: sudo pip install package-name
# Right: activate environment first
conda activate research-env
pip install package-name
```

#### Issue: Conflicting dependencies

**Solution:** Create a fresh environment:

```bash
conda create -n fresh-env python=3.10
conda activate fresh-env
pip install -r requirements.txt
```

---

## Part 3: Managing Dependencies with uv

[uv](https://github.com/astral-sh/uv) is a modern, extremely fast Python package installer and resolver, written in Rust. It's designed to be a drop-in replacement for pip but with significant performance improvements.

### Why Consider uv?

- **Speed:** Faster than pip
- **Reliable:** Better dependency resolution
- **Compatible:** Works as a drop-in replacement for pip
- **Modern:** Built with Rust for performance and reliability

### Installing uv

#### On Windows

```bash
# Using pip in your conda environment
conda activate research-env
pip install uv

# Or using the standalone installer
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

#### On Linux

```bash
# Using pip in your conda environment
conda activate research-env
pip install uv

# Or using curl
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Verify installation:

```bash
uv --version
```

### Using uv in Your Workflow

uv commands mirror pip commands, making it easy to switch:

#### Installing Packages

```bash
# Activate your conda environment first!
conda activate research-env

# Install a package (replaces: pip install numpy)
uv pip install numpy

# Install multiple packages
uv pip install numpy pandas scikit-learn

# Install from requirements.txt
uv pip install -r requirements.txt

# Install specific version
uv pip install "torch==2.0.0"
```

#### Creating Requirements Files

```bash
# Generate requirements (replaces: pip freeze)
uv pip freeze > requirements.txt

# Show package information
uv pip show numpy

# List installed packages
uv pip list
```

#### Upgrading and Uninstalling

```bash
# Upgrade a package
uv pip install --upgrade numpy

# Uninstall a package
uv pip uninstall numpy
```

### uv vs pip: When to Use Each?

| Use Case | Recommendation |
|----------|----------------|
| Small projects, quick installs | Either pip or uv |
| Large projects with many dependencies | uv (faster) |
| CI/CD pipelines | uv (much faster) |
| Installing compiled packages (numpy, scipy) | pip or conda (more tested) |
| Maximum compatibility | pip |
| Maximum speed | uv |

### Example Workflow with uv

Let's set up a deep learning project using Conda + uv:

```bash
# 1. Create conda environment with system dependencies
conda create -n ml-project python=3.10 -y
conda activate ml-project

# 2. Install heavy scientific packages with conda
conda install -y numpy scipy matplotlib jupyter

# 3. Install uv
pip install uv

# 4. Use uv for pure Python packages
uv pip install transformers datasets wandb
uv pip install torch torchvision

# 5. Generate requirements
uv pip freeze > requirements.txt
```

### Creating a Hybrid environment.yml

Combine the best of both worlds:

```yaml
name: ml-project
channels:
  - defaults
  - conda-forge
dependencies:
  - python=3.10
  - numpy
  - scipy
  - matplotlib
  - jupyter
  - pip
  - pip:
    - uv  # Install uv via pip
# Then use uv for remaining packages:
# uv pip install -r requirements.txt
```

---

## Practical Example: Setting Up for Lab Projects

Let's walk through setting up an environment for a typical research project in our lab.

### Scenario: Machine Learning for Vulnerability Detection

```bash
# 1. Create conda environment
conda create -n vulndetect python=3.10 -y
conda activate vulndetect

# 2. Install scientific computing stack via conda
conda install -y numpy pandas scikit-learn matplotlib jupyter

# 3. Install uv for faster package management
pip install uv

# 4. Clone your research repository
git clone git@github.com:cunymasslab/your-project.git
cd your-project

# 5. Install project dependencies with uv
uv pip install -r requirements.txt

# 6. Install your package in development mode
uv pip install -e .

# 7. Verify installation
python -c "import numpy, pandas, sklearn; print('Ready for research! ✅')"

# 8. Start Jupyter
jupyter notebook
```

### Working on the Cluster

For long-running experiments on the cluster:

```bash
# SSH to cluster
ssh cluster_node

# Set up conda (first time only)
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh
source ~/.bashrc

# Create environment
conda create -n vulndetect python=3.10 -y
conda activate vulndetect

# Install packages
conda install -y numpy pandas scikit-learn matplotlib
pip install uv
cd your-project
uv pip install -r requirements.txt

# Use screen for long-running jobs
screen -S experiment1
# Your command here
# Detach with Ctrl+A, Ctrl+D
```

---

## Best Practices Summary

### Do's ✅

1. **Always use virtual environments** - Never install packages globally
2. **Activate environment before installing** - Avoid pip/uv installing to wrong location
3. **Keep requirements files updated** - Document your dependencies
4. **Use conda for system libraries** - NumPy, SciPy, CUDA, etc.
5. **Use pip/uv for pure Python packages** - Transformers, requests, etc.
6. **Pin versions for reproducibility** - Specify exact versions in production
7. **Export environments** - Share `environment.yml` with collaborators

### Don'ts ❌

1. **Don't use `sudo pip install`** - This breaks system Python
2. **Don't mix conda and pip carelessly** - Install pip packages after conda packages
3. **Don't ignore dependency conflicts** - They'll cause runtime errors
4. **Don't commit virtual environments** - Use `.gitignore` for `venv/`, `.conda/`
5. **Don't skip testing** - Verify imports work after setup

---

## Troubleshooting Common Issues

### Issue: "conda: command not found"

**Solution:**
```bash
# Reload shell configuration
source ~/.bashrc  # Linux
# or restart terminal on Windows
```

### Issue: Packages installing to system Python

**Solution:**
```bash
conda activate your-env-name
which python  # Verify correct Python
which pip     # Verify correct pip
```

### Issue: Dependency conflicts

**Solution:**
```bash
# Create fresh environment
conda create -n fresh-env python=3.10
conda activate fresh-env
# Install packages one by one, starting with largest frameworks
```

### Issue: Slow pip installs

**Solution:**
```bash
# Switch to uv!
pip install uv
uv pip install -r requirements.txt
```

---

## Additional Resources

- [Conda Documentation](https://docs.conda.io/)
- [pip Documentation](https://pip.pypa.io/)
- [uv GitHub Repository](https://github.com/astral-sh/uv)
- [Python Packaging Guide](https://packaging.python.org/)

---

## Getting Help

If you encounter issues:

1. Check this guide's troubleshooting section
2. Search error messages online (Stack Overflow, GitHub Issues)
3. Ask in our lab Slack/Discord channel
4. Reach out to senior lab members
5. File an issue in the lab's GitHub repository

Happy coding! 🐍✨

---

**Maintained by:** CUNY MASS Lab  
**Last Updated:** December 8, 2025  
**Questions?** Contact the lab administrators or the authors of this post.
