---
layout: post
title: Running Ollama Without Root Previledge (sudo) on a Remote Linux GPU Cluster
date: 2026-05-26 12:00:00
description: An introduction to set up Ollama without root previlege on Linux systems
tags: [Ollama, Linux, root]
categories: tutorials
author: Kevin Lewis
giscus_comments: false
related_posts: false
toc:
  sidebar: left
---

This tutorial walks through how to install and run Ollama on a remote Linux
cluster without root/sudo access, including GPU acceleration and SSH tunneling
for local API access.

## Overview

In this setup we:

- Install Ollama manually without sudo
- Run Ollama on a remote Ubuntu GPU node
- Enable CUDA GPU acceleration
- Use SSH tunneling to access the API locally
- Run Llama 3 through the Ollama REST API

Tested on:

- Ubuntu 22.04
- NVIDIA RTX 3080 Ti
- CUDA-enabled cluster environment
- No sudo/root permissions

## Why This Method?

The default Ollama install script requires sudo because it:

- checks drivers/devices,
- configures services,
- creates an `ollama` system user.

However, the prebuilt binaries can run perfectly fine without administrator access.

## Step 1 — SSH Into the GPU Node

Assume we have configured `bc_cs_cluster_node4` in `.ssh/config`:

```bash
ssh bc_cs_cluster_node4
```

## Step 2 — Download Ollama Manually

```bash
wget https://github.com/ollama/ollama/releases/download/v0.9.6/ollama-linux-amd64.tgz -O ollama.tgz
```

Or:

```bash
curl -L https://github.com/ollama/ollama/releases/download/v0.9.6/ollama-linux-amd64.tgz -o ollama.tgz
```

## Step 3 — Extract the Files

```bash
tar -xzf ollama.tgz
```

## Step 4 — Make Ollama Executable

```bash
chmod +x bin/ollama
```

## Step 5 — Start the Ollama Server

```bash
./bin/ollama serve
```

## Step 6 — Verify GPU Acceleration

Look for logs showing CUDA initialization and GPU offloading.

## Step 7 — Open an SSH Tunnel

```bash
ssh -L 11434:127.0.0.1:11434 bc_cs_cluster_node4
```

## Step 8 — Verify the API

```bash
curl http://127.0.0.1:11434/api/tags
```

## Step 9 — Chat With the LLM

```bash
curl http://127.0.0.1:11434/api/chat -d '{
  "model": "llama3:latest",
  "messages": [
    {
      "role": "user",
      "content": "Hello"
    }
  ],
  "stream": false
}'
```

## Step 10 — Generate Text

```bash
curl http://127.0.0.1:11434/api/generate -d '{
  "model": "llama3:latest",
  "prompt": "Explain CUDA in simple terms",
  "stream": false
}'
```

## Troubleshooting

### Model Not Found

Use the exact model name returned from:

```bash
curl http://127.0.0.1:11434/api/tags
```

### Port Already In Use

Check what is using the port:

```bash
lsof -i :11434
```

Kill old SSH tunnels:

```bash
pkill -f "ssh.*11434"
```

Or use another local port:

```bash
ssh -L 11435:127.0.0.1:11434 bc_cs_cluster_node4
```

## Final Thoughts

Running Ollama without sudo is completely possible using the prebuilt binaries.
Once configured correctly, it provides a lightweight and powerful way to run
local LLMs on remote GPU infrastructure.
