---
layout: post
title: Distributed Machine Learning Training and Infererence using Ray
date: 2026-05-18 12:00:00
description: An introduction to set up distributed training and inference using Ray.
tags: [machine learning, distributed training, distributed inference, python, ray]
categories: tutorials
author: Josemar Ochoa
giscus_comments: false
related_posts: false
toc:
  sidebar: left
---

This is an introductory guide for distributed machine learning using
[Ray](https://github.com/ray-project/ray). This guide was written to
speed up computation for [uncertainty quantification
estimation](https://doi.org/10.1109/TSE.2025.3612278) using model ensemble.

## Prerequisites

### Install Ray Package

```bash
pip install -U ray
```

## Introduction

Ray (Core) is a distributed computing framework for Python that makes it easy
to parallelize workloads across multiple machines (nodes) and GPUs.

In machine learning workflows, Ray is commonly used to:

- Train multiple models in parallel
- Manage GPU scheduling across cluster nodes

Instead of manually handling SSH, multiprocessing, or GPU assignment, Ray
manages task scheduling and resource allocation automatically.

## Ray Cluster

This is how Ray communicates and allocates resources across machines.

### Starting Head Node

The head node is the main Ray process that manages scheduling and cluster coordination.

It is responsible for:

- tracking available resources
- assigning tasks to workers
- managing actors
- monitoring cluster state

Start with:

```bash
ray start --head --port=6379
```

### Connecting Worker Nodes

Worker nodes are used to connect other nodes/machines to the head node and
provide additional CPUs/GPUs.

On a separate node, connect with:

```bash
ray start --address='<Head_Node_IP>:6379'
# Ensure your project files and any required data are available on this node
# at the same filesystem path as on other nodes, or via shared storage.
```

Once connected, Ray can schedule work across all available nodes.

### Verify Cluster

```bash
ray status
```

This shows:

- active nodes
- allocated CPUs and GPUs
- pending demands

### Connecting Python script to cluster

In top-level script add:

```python
import ray

ray.init(
     address="auto",  # connects to existing cluster
     runtime_env={
         "env_vars": {
             "RAY_RUNTIME_ENV_CREATE_WORKING_DIR": "0",
         }
     },  # only sets env vars; it does not sync code/data across nodes
 )

 # Relative paths only stay consistent if every node uses the same checkout
 # path or shares the same filesystem mount. If workers need the code shipped
 # to them, use runtime_env={"working_dir": "..."} instead.
```

### Stop Ray

```bash
ray stop
```

This stops Ray on the machine where you run the command.
To fully clean old actors, workers, and stale cluster state in a multi-node cluster,
run `ray stop` on every node: the head node and each worker node.
If you need a cluster-wide shutdown, use your cluster manager or run the command
across all nodes via automation/SSH.

---

## Tasks vs Actors

Ray mainly provides two methods of parallel execution:

- Tasks
- Actors

### Tasks

A task is a stateless remote function.

You define a normal Python function and decorate it with `@ray.remote`.

Example:

```python
import ray
# Define the square task.
@ray.remote
def square(x):
    return x * x

```

Calling it:

```python
# Launch four parallel square tasks.
futures = [square.remote(i) for i in range(4)]

# Retrieve results.
print(ray.get(futures))
# -> [0, 1, 4, 9]
```

#### Good for:

- independent model training
- ensemble members
- batch inference
- short-lived jobs

#### Advantages

- simple to implement
- automatically releases GPU after completion
- easier scheduling

#### Limitations

- no persistent state
- cannot store long-lived model state easily

### Ray Actors

An actor is a stateful worker process.

It is a class instance that can live on other worker nodes.

You define a normal Python class and decorate it with `@ray.remote`

```python
# Define the Counter actor.
@ray.remote
class Counter:
    def __init__(self):
        self.i = 0

    def get(self):
        return self.i

    def incr(self, value):
        self.i += value
```

Calling it:

```python
# Create a Counter actor.
c = Counter.remote()

# Submit calls to the actor. These calls run asynchronously but in
# submission order on the remote actor process.
for _ in range(10):
    c.incr.remote(1)

# Retrieve final actor state.
print(ray.get(c.get.remote()))
# -> 10
```

#### Good for:

- long-running services
- persistent trainers
- shared state
- repeated updates to the same object

#### Advantages

- keeps state between method calls
- avoids repeated object serialization
- useful for iterative workflows

#### Limitations

- GPU can remain reserved too long
- harder lifecycle management
- can block scheduling if actors are not cleaned up
- more debugging complexity

---

### Specifying Resources

```python
@ray.remote(num_cpus=4, num_gpus=1)
```

Tasks and Actors can request resources and will automatically wait to execute until they become available

### Which is Better?

For our task of independent ensemble model training, tasks are usually better because:

- each model is independent
- model training is relatively short
- GPU is released automatically after task completion

Since after each training loop, model weights are saved, there is no benefit to maintaining state with Actors.

#### Use Actors When:

- training must keep internal state alive
- repeated communication with the same model is required
- serving/inference stays alive continuously
- reloading models repeatedly is too expensive

## Recommended ML Pattern

### Parallel Ensemble Training with Tasks

Training Task:

```python
@ray.remote(num_gpus=1) # change to available GPUs per node
def trainer_fit(model_idx, model, datasets, config):
    trainer = Trainer(
        model_idx,
        model,
        datasets,
        config)
```

Ensemble training loop:

```python
futures = []

for model_idx, model in enumerate(models):
    future = trainer_fit.remote(
        model_idx,
        model,
        datasets,
        config,
    )
    futures.append(future)

ray.get(futures)
```

## Common Issues

### Forgetting .remote()

Calling a Task or Actor requires it to be called with .remote()

```python
# Wrong:
trainer_fit(model_idx, model, datasets, config)

# Correct:
trainer_fit.remote(model_idx, model, datasets, config)
```

### Forgetting ray.get(futures)

When you call a Ray remote function (like `trainer_fit.remote(...)`), it schedules a training task on a worker node and immediately returns a future (a handle to the result).

Calling `ray.get(futures)` waits for tasks to be completed and retrieves results before continuing the script.

Omitting this line can result in:

- premature checkpoint saving
- premature termination of script
- errors from tasks not getting returned to main process

### GPU Never Gets Released

Cause:

Usually actors holding GPU resources.

Fix:

- use tasks instead of actors
- use `ray.kill(actor)` if needed
- use `ray stop` to fully reset cluster

### Old CUDA Driver Error

Cause:

Node GPU driver too old for installed PyTorch CUDA version.

Fix:

- update NVIDIA driver
- or exclude that node from Ray cluster
