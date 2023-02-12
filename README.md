
# Table of contents

- [Challenge](#challenge)
- [Solution](#solution)
- [Technical](#technical)
    - [Mediator](#mediator)
    - [Handler](#handler)
    - [Controller](#controller)
    - [Worker](#worker)

# [Challenge](https://github.com/guardrailsio/NodeJS-backend-challenge)

# Solution
For this challenge, there are 3 main logics that I need to handle: triggering a scan event, scanning a repo, and getting a scan result.

To handle these logics, I have created three separate handlers. This is a good approach as it keeps the code modular and makes it easier to maintain and modify in the future.

I have also created a controller to expose the Trigger a scan event and Get a scan result handlers as APIs. This is a common approach and allows users to interact with the application in a standardized way.

Finally, I have a worker that interval calls the Scan a repo handler. This is a good way to ensure that scans are performed on a regular basis, without putting too much strain on the system.

Overall, it seems like I have a well-designed architecture that separates concerns and makes it easy to manage the various components of my application.

# Technical
## Mediator
There are three main things in my mediator: **container**, **mediator**, **pipeline behavior**.

### Container
The container includes 3 properties:
- **handlers** property is a list of all handlers that can process requests.
- **validators** property includes rules for validating requests
- **cacheCommands** property contains the names of commands that require caching and their time to live
- There are two [class decorators](https://www.typescriptlang.org/docs/handbook/decorators.html#class-decorators):
  - **RegisterHandler** add handler to **handlers** property.
  - **RegisterValidator** add handler to **validators** property and set required roles for that handler.
  - **RegisterCacheCommand**

### Mediator
- The mediator has two public methods:
  - **addPipelineBehavior**: adds a pipeline behavior to run before/after each command.
  - **send**: receives a command and selects the appropriate handler from the **container** to process the command.

### Behavior
- The behavior is responsible for adding additional functionality to the request processing pipeline, such as logging, validation, caching, authorization, etc. 
- These behaviors can be attached before or after the request is processed.

This separation of concerns allows for modularity and flexibility in managing requests and handling behavior.

## Handler
The Handler folder structure follows a clean architecture pattern, where each folder represents a feature or a command in the application. It encapsulates all business logic related to the command, including the request and response models, validators, and unit-tests. This approach simplifies the process of adding new features because it is as simple as adding a new command.

Maintaining this architecture is also easier because changes are limited to a single command, and all related files can be found in one place. Encapsulation helps to minimize sharing between commands, which reduces the risk of breaking changes. However, code reuse is still encouraged within a single command to avoid duplication of code.

## Controller
A controller is responsible for defining the routing of our application and transforming HTTP requests into a corresponding command that can be handled by the mediator.

## Worker
A worker is responsible for handling asynchronous tasks or jobs that need to be executed at a specific interval or schedule. This can include tasks like scanning a repository or performing backups. By using a worker, we can keep the main thread of our application free to handle other requests and avoid blocking or slowing down the entire system.