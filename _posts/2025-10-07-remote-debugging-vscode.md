---
layout: post
title: Remote Debugging on Cluster with VS Code and DebugPy
date: 2025-10-07 12:00:00
description: A comprehensive guide to debugging Python code remotely on computing clusters using VS Code, DebugPy, and SSH port forwarding
tags: debugging vscode python remote-development cluster tutorial
categories: tutorials
author: Josemar Ochoa and Vitaliy Tei
giscus_comments: true
related_posts: false
toc:
  sidebar: left
---

Welcome to this tutorial on remote debugging! When working with machine learning models or computational tasks on a cluster, debugging can be challenging. This guide will show you how to use **VS Code** and **DebugPy** to debug Python code running on a remote cluster as if it were running locally on your machine.

## Why Remote Debugging?

When developing on computing clusters, you often encounter scenarios where:

- Your code runs fine locally but fails on the cluster
- You need to debug with the cluster's specific hardware (GPUs, large memory)
- Long-running processes make print-statement debugging impractical
- You want to inspect variables and step through code in real-time

Remote debugging solves these problems by letting you use VS Code's powerful debugging tools while your code executes on the remote server.

**Beyond the Cluster:** The skills you'll learn here extend far beyond academic computing clusters. These same techniques apply to debugging applications in cloud environments, including containerized applications running in Kubernetes pods, AWS EC2 instances, Google Cloud VMs, or Azure containers. As modern software increasingly runs in distributed and cloud-native architectures, mastering remote debugging becomes an essential skill for any developer working with production systems.

---

## Prerequisites

Before we begin, ensure you have:

- **Conda** installed on your local machine (see our [Python Environment Setup guide]({% post_url 2025-09-26-python-environment-setup %}))
- **VS Code** installed on your local machine
- **Python Extension** for VS Code installed
- **Automated SSH access** to your remote server (covered in our [environment setup guide]({% post_url 2025-09-26-python-environment-setup %}))
- **Git repository** cloned on your local machine
- Basic familiarity with VS Code and Python

**Important:** Before starting setup on the remote server, open a `screen` session to avoid connection drops during installation. Learn about persistent sessions with `screen` in our [environment setup guide]({% post_url 2025-09-26-python-environment-setup %}#practical-example-setting-up-for-lab-projects).

---

## Part 1: Setting Up the Remote Server

### Step 1: Start a Persistent Session (Recommended)

Long installations can break if your SSH connection closes. Start a persistent `screen` session to keep your work alive:

```bash
# SSH to your cluster
ssh cluster_node

# Activate your conda environment
conda activate vulnewdata

# Start a screen session
screen -S setup_env

# Proceed with setup steps below
```

**Screen Commands:**
- Detach: `Ctrl+A`, then `D`
- Reattach: `screen -r setup_env`
- List sessions: `screen -ls`

This ensures installations or debugging sessions stay alive even if you disconnect.

### Step 2: Install DebugPy on the Cluster

[DebugPy](https://github.com/microsoft/debugpy) is Microsoft's debug adapter for Python. It enables VS Code to attach to and debug Python processes remotely.

In your activated conda environment, run:

```bash
conda install anaconda::debugpy
```

Verify the installation:

```bash
python -m debugpy --version
```

You should see the version number (e.g., `1.8.0`).

### Step 3: Run DebugPy on the Remote Server

Before debugging your project code, let's practice with a simple example. Create a test script or use the sample code in your `uncertainty/debug` directory.

**Understanding the DebugPy Command:**

```bash
python -m debugpy --wait-for-client --listen 0.0.0.0:5678 your_script.py
```

Let's break down the parameters:
- `0.0.0.0` - Listens on all network interfaces (allows external connections)
- `5678` - The port for the debug server (use another if this is occupied)
- `--wait-for-client` - Pauses code execution until VS Code attaches
- `your_script.py` - The Python file you want to debug

**Create a Helper Script (Optional):**

For convenience, create a `runpy.sh` script:

```bash
#!/bin/bash
# runpy.sh - Helper script to run Python files with DebugPy
python -m debugpy --wait-for-client --listen 0.0.0.0:5678 "$1"
```

Make it executable:

```bash
chmod +x runpy.sh
```

Run your Python file with debugging:

```bash
./runpy.sh train_model.py
```

Or directly:

```bash
python -m debugpy --wait-for-client --listen 0.0.0.0:5678 train_model.py
```

### Step 4: Verify DebugPy is Listening

Check that the debug server is running and waiting for connections:

```bash
netstat -a -n | grep 5678
```

You should see output indicating port `5678` is in `LISTEN` state:

```
tcp        0      0 0.0.0.0:5678            0.0.0.0:*               LISTEN
```

If you see this, DebugPy is successfully waiting for your VS Code debugger to attach!

---

## Part 2: Setting Up Your Local Machine

### Step 1: Configure VS Code for Remote Debugging

VS Code uses `launch.json` to configure debugging sessions. Let's create one for remote debugging.

**Create or Edit `.vscode/launch.json`:**

In your project's root directory, create `.vscode/launch.json` with the following configuration:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Python Debugger: Remote Attach without Mappings",
            "type": "debugpy",
            "request": "attach",
            "connect": {
                "host": "localhost",
                "port": 55678
            }
        },
        {
            "name": "Python Debugger: Remote Attach",
            "type": "debugpy",
            "request": "attach",
            "connect": {
                "host": "localhost",
                "port": 55678
            },
            "pathMappings": [
                {
                    "localRoot": "${workspaceFolder}",
                    "remoteRoot": "/home/vulnewdata"
                }
            ]
        }
    ]
}
```

**Understanding the Configuration:**

We have two debug configurations:

1. **Without Mappings:** Use this if your local and remote directory structures are identical
2. **With Mappings:** Use this when your local workspace is in a different location than the remote one

**Path Mappings Explained:**
- `localRoot`: Your local project directory (`${workspaceFolder}` refers to your VS Code workspace)
- `remoteRoot`: The absolute path to the project on the remote cluster

**Important:** Update `remoteRoot` to match your actual remote directory path!

### Step 2: Set Up Conda Environment in VS Code

To ensure VS Code uses the correct Python interpreter:

**If Conda isn't recognized by VS Code:**

Initialize Conda in your shells (run in **Anaconda Prompt** on Windows):

```bash
conda init powershell
conda init cmd.exe
```

**Select the Python Interpreter:**

1. Restart VS Code
2. Open Command Palette: `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
3. Type and select: **"Python: Select Interpreter"**
4. Choose your conda environment:
   ```
   ~\miniconda3\envs\vulnewdata\python.exe  (Windows)
   ~/miniconda3/envs/vulnewdata/bin/python  (Linux/Mac)
   ```

Now you can activate your conda environment directly in VS Code's integrated terminal!

### Step 3: Sync Local and Remote Code

**Critical:** Your local code must match the remote code, or breakpoints won't align correctly!

Before debugging, always sync your repository:

```bash
# Pull latest changes from remote repository
git pull origin main

# Or if you have local changes, commit and push them first
git add .
git commit -m "Your changes"
git push origin main

# Then pull on the cluster
ssh cluster_node "cd /path/to/project && git pull"
```

**Best Practice:** Use Git as the single source of truth. Both your local machine and cluster should pull from the same repository.

### Step 4: Set Up SSH Port Forwarding

This is the crucial step that connects your local VS Code to the remote DebugPy server.

**Create the SSH Tunnel:**

Open a terminal on your local machine and run:

```bash
ssh -L 55678:localhost:5678 cluster_node
```

**Understanding the Command:**
- `-L 55678:localhost:5678` - Forward local port `55678` to remote port `5678`
- `cluster_node` - Your SSH alias or `user@hostname`

This creates a secure tunnel: VS Code connects to `localhost:55678`, which forwards to the cluster's `5678` where DebugPy is listening.

**Verify the Connection:**

Use the modern `ss` command (socket statistics):

```bash
ss -tln | grep 55678
```

You should see:

```
LISTEN    0    128    127.0.0.1:55678    0.0.0.0:*
```

**Alternative with netstat (older systems):**

If `ss` is not available, you can use the traditional `netstat` command:

Windows PowerShell:

```powershell
netstat -a -n | select-string "55678"
```

Linux/Mac:

```bash
netstat -a -n | grep 55678
```

Expected output:

```
TCP    127.0.0.1:55678        0.0.0.0:0              LISTENING
```

**Keep This Terminal Open!** If you close it, the tunnel closes and debugging stops.

---

## Part 3: Start Debugging!

Now that everything is set up, let's start debugging.

### The Debugging Workflow

**On the Remote Cluster:**

1. Ensure your screen session is running (if you detached)
2. Start your Python script with DebugPy:
   ```bash
   python -m debugpy --wait-for-client --listen 0.0.0.0:5678 your_script.py
   ```
3. You should see output indicating DebugPy is waiting:
   ```
   Waiting for debugger attach...
   ```

**On Your Local Machine:**

1. Ensure SSH port forwarding is active (the tunnel terminal is open)
2. Open your project in VS Code
3. Set breakpoints by clicking in the left margin next to line numbers
4. Go to the **Run and Debug** tab (or press `Ctrl+Shift+D`)
5. Select **"Python Debugger: Remote Attach"** from the dropdown
6. Click the green play button ▶ or press `F5`

**Success!** VS Code should connect, and you'll see:
- Your breakpoint indicators turn red (active)
- The debug toolbar appears
- Variables panel populates
- Your code pauses at breakpoints

### Using the Debugger

Once connected, you can:

**Navigate Through Code:**
- **Continue** (`F5`): Resume execution until next breakpoint
- **Step Over** (`F10`): Execute current line, don't enter functions
- **Step Into** (`F11`): Enter function calls to debug them
- **Step Out** (`Shift+F11`): Exit current function

**Inspect Variables:**
- View local and global variables in the Variables panel
- Hover over variables in the code to see their values
- Add variables to the Watch panel for continuous monitoring

**Evaluate Expressions:**
- Use the Debug Console to evaluate Python expressions in real-time
- Type any valid Python code to test hypotheses

**Call Stack:**
- See the execution path that led to the current point
- Click on different frames to inspect variables at each level

---

## Example: Debugging a Training Script

Let's walk through a practical example of debugging a machine learning training script.

### Remote Cluster (in screen session):

```bash
# Navigate to your project
cd ~/vulnewdata

# Activate environment
conda activate vulnewdata

# Start debugging the training script
python -m debugpy --wait-for-client --listen 0.0.0.0:5678 \
    uncertainty/scripts/train_model.py --epochs 10 --dataset data/train.csv
```

### Local Machine:

1. **Open project in VS Code**
2. **Set breakpoints** in `train_model.py`:
   - Line where model is initialized
   - Beginning of training loop
   - Loss calculation
   - Validation step

3. **Start SSH tunnel** (separate terminal):
   ```bash
   ssh -L 55678:localhost:5678 cluster_node
   ```

4. **Attach debugger** in VS Code:
   - Press `F5` or click the debug play button
   - Select "Python Debugger: Remote Attach"

5. **Debug your code:**
   - Inspect model parameters
   - Check tensor shapes
   - Verify loss calculations
   - Step through the training loop

### Common Debugging Scenarios

**Scenario 1: Unexpected NaN Loss**

```python
# Set breakpoint here
loss = criterion(outputs, labels)
```

In Debug Console, inspect:
```python
>>> outputs
tensor([...])  # Check for NaN or inf values
>>> labels.shape
torch.Size([32, 10])  # Verify dimensions
>>> (outputs != outputs).any()  # Check for NaN
```

**Scenario 2: Dimension Mismatch**

```python
# Set breakpoint before the error
x = model(inputs)
# Inspect x.shape in Variables panel
y = classifier(x)  # Dimension mismatch here
```

Check in Variables panel or Debug Console:
```python
>>> x.shape
torch.Size([32, 512])
>>> classifier.in_features
256  # Ah, there's the problem!
```

---

## Troubleshooting Common Issues

### Issue 1: VS Code Can't Connect to Debug Server

**Symptoms:**
- "Connection refused" or timeout error
- Debugger doesn't attach

**Solutions:**

1. **Verify DebugPy is running on cluster:**
   ```bash
   netstat -a -n | grep 5678
   ```

2. **Check SSH tunnel is active:**
   ```bash
   # Local machine
   netstat -a -n | grep 55678
   ```

3. **Ensure ports match:**
   - Remote: `5678` (or your chosen port)
   - Local tunnel: `ssh -L 55678:localhost:5678`
   - VS Code `launch.json`: `"port": 55678`

4. **Firewall issues:** Ensure cluster firewall allows port 5678

### Issue 2: Breakpoints Are Gray (Not Active)

**Symptoms:**
- Breakpoints appear gray/hollow
- Code doesn't pause at breakpoints

**Solutions:**

1. **Check path mappings in `launch.json`:**
   ```json
   "pathMappings": [
       {
           "localRoot": "${workspaceFolder}",
           "remoteRoot": "/home/username/vulnewdata"  // Must match exactly!
       }
   ]
   ```

2. **Verify files are in sync:**
   ```bash
   git status  # On both local and remote
   ```

3. **Use absolute paths:** Try specifying exact paths instead of `${workspaceFolder}`

### Issue 3: SSH Connection Drops

**Symptoms:**
- Debugging suddenly stops
- "Connection lost" message

**Solutions:**

1. **Use screen on the cluster:**
   ```bash
   screen -S debug_session
   python -m debugpy --wait-for-client --listen 0.0.0.0:5678 script.py
   # Detach with Ctrl+A, D
   ```

2. **Configure SSH keepalive** in `~/.ssh/config`:
   ```
   Host cluster_node
       ServerAliveInterval 60
       ServerAliveCountMax 10
   ```

3. **Use persistent SSH tunnel:**
   ```bash
   ssh -N -L 55678:localhost:5678 cluster_node
   ```
   (`-N` means no remote command, just tunneling)

### Issue 4: Port Already in Use

**Symptoms:**
- "Address already in use" error

**Solutions:**

1. **Find and kill the process:**
   ```bash
   # On cluster
   lsof -ti:5678 | xargs kill -9
   
   # On local machine
   lsof -ti:55678 | xargs kill -9  # Mac/Linux
   netstat -ano | findstr :55678   # Windows (then use taskkill)
   ```

2. **Use different ports:**
   ```bash
   # On cluster
   python -m debugpy --wait-for-client --listen 0.0.0.0:5679 script.py
   
   # On local machine
   ssh -L 55679:localhost:5679 cluster_node
   
   # Update launch.json port to 55679
   ```

### Issue 5: Wrong Python Interpreter

**Symptoms:**
- Import errors for packages you know are installed
- Different Python version than expected

**Solutions:**

1. **Verify remote Python:**
   ```bash
   which python
   python --version
   ```

2. **Explicitly use conda python:**
   ```bash
   conda activate vulnewdata
   which python  # Should show conda env path
   python -m debugpy ...
   ```

3. **Update VS Code interpreter:**
   - `Ctrl+Shift+P` → "Python: Select Interpreter"
   - Choose the correct conda environment

---

## Best Practices

### Do's ✅

1. **Always use screen sessions** for remote debugging
2. **Keep code synchronized** between local and remote via Git
3. **Use descriptive debug configurations** in `launch.json`
4. **Set conditional breakpoints** for specific scenarios
5. **Use logpoints** instead of print statements (they don't require code changes)
6. **Document your debug port assignments** if working in a shared cluster
7. **Close debug sessions properly** to free up resources

### Don'ts ❌

1. **Don't hardcode paths** - use variables like `${workspaceFolder}`
2. **Don't debug in production environments** - use development/staging clusters
3. **Don't leave debug servers running** - they consume resources
4. **Don't commit `launch.json` with personal paths** - use relative paths or .gitignore
5. **Don't debug with print statements** when you can use VS Code's tools
6. **Don't forget to pull latest code** before debugging
7. **Don't close the SSH tunnel terminal** while debugging

---

## Advanced Tips

### Tip 1: Debug with Command-Line Arguments

```bash
python -m debugpy --wait-for-client --listen 0.0.0.0:5678 script.py \
    --epochs 10 \
    --batch-size 32 \
    --learning-rate 0.001
```

### Tip 2: Conditional Breakpoints

Right-click on a breakpoint in VS Code and set a condition:

```python
epoch > 5  # Only break after epoch 5
loss > 1.0  # Only break if loss is high
batch_idx == 100  # Break at specific batch
```

### Tip 3: Logpoints

Instead of adding print statements, right-click in the margin and choose "Add Logpoint":

```python
Loss: {loss.item()}, Accuracy: {acc}
```

This prints to the Debug Console without modifying code!

### Tip 4: Multiple Debug Sessions

Debug multiple processes simultaneously:

```bash
# Terminal 1: Debug main training
ssh -L 55678:localhost:5678 cluster_node

# Terminal 2: Debug data preprocessing  
ssh -L 55679:localhost:5679 cluster_node
```

Add separate configurations in `launch.json` for each.

### Tip 5: Debug Jupyter Notebooks

You can also debug Jupyter notebooks running on the cluster:

```bash
# On cluster
python -m debugpy --listen 0.0.0.0:5678 -m jupyter notebook --no-browser --port=8888
```

Then connect with both Jupyter port forwarding and debug port forwarding!

---

## Quick Reference

### Essential Commands

**Remote Cluster:**
```bash
# Start debug server
python -m debugpy --wait-for-client --listen 0.0.0.0:5678 script.py

# Check if listening
netstat -a -n | grep 5678

# Kill debug process
pkill -f debugpy
```

**Local Machine:**
```bash
# SSH tunnel
ssh -L 55678:localhost:5678 cluster_node

# Check tunnel
netstat -a -n | grep 55678

# Persistent tunnel
ssh -N -L 55678:localhost:5678 cluster_node
```

**VS Code:**
- Open Debug panel: `Ctrl+Shift+D`
- Start debugging: `F5`
- Toggle breakpoint: `F9`
- Step over: `F10`
- Step into: `F11`
- Step out: `Shift+F11`
- Continue: `F5`

---

## Additional Resources

- [VS Code Python Debugging](https://code.visualstudio.com/docs/python/debugging)
- [DebugPy Documentation](https://github.com/microsoft/debugpy)
- [SSH Port Forwarding Guide](https://www.ssh.com/academy/ssh/tunneling-example)

---

## Getting Help

If you encounter issues:

1. Check this guide's troubleshooting section
2. Verify all prerequisites are met
3. Test with a simple Python script first
4. Ask in our lab Slack/Discord channel
5. File an issue in the lab's GitHub repository

Happy debugging! 🐛✨

---

**Maintained by:** CUNY MASS Lab  
**Last Updated:** October 7, 2025  
**Questions?** Contact the lab administrators or the authors of the blog post.
