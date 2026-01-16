# AutoClaude Research

> **Research Date**: January 15, 2026
> **Source**: Exa MCP web search

---

## Overview

**Repository**: `AndyMik90/Auto-Claude`
**Latest Version**: v2.7.4 (Released January 14, 2026)
**License**: AGPL-3.0

## What It Does

AutoClaude is an autonomous multi-session AI coding framework that plans, builds, and validates software with minimal human intervention.

## Key Features

| Feature | Description |
|---------|-------------|
| **Autonomous Tasks** | Planning, implementation, validation |
| **Parallel Execution** | Up to 12 agent terminals simultaneously |
| **Isolated Workspaces** | Git worktrees for each task |
| **Self-Validating QA** | Automated quality checks |
| **AI-Powered Merge** | Smart conflict resolution |
| **Memory Layer** | Context persistence across sessions |
| **Integrations** | GitHub, GitLab, Linear |
| **Cross-Platform** | Windows, macOS, Linux native apps |

## Requirements

- Claude Pro/Max subscription
- Claude Code CLI installed

## v2.7.4 Release Notes (Jan 14, 2026)

**New Features**:
- Task worktrees section in terminal with YOLO mode
- Searchable branch combobox
- Claude Code version rollback feature
- Embedded Sentry DSN for error tracking

**Improvements**:
- Enhanced worktree isolation visibility
- Reliable terminal recreation with retry
- Improved worktree name UX
- Better Claude CLI detection
- Synced worktree config on terminal restoration

**Bug Fixes**:
- Windows validation fixes
- Profile manager initialization
- Terminal recreation issues
- Duplicate Kanban task creation
- GitHub PR preloading
- Security profile inheritance in worktrees

## Relevance to Specky

**Patterns to Adopt**:
- Kanban-style task visualization
- Parallel agent execution model
- Memory layer for context persistence

**Patterns to Avoid**:
- Git worktrees complexity (use DEEPSHAFT instead)
- Heavy desktop app approach (start with CLI/web)

## Sources

- https://github.com/AndyMik90/Auto-Claude
- https://github.com/AndyMik90/Auto-Claude/releases
- https://medium.com/@joe.njenga/i-tested-this-autonomous-framework-that-turns-claude-code-into-a-virtual-dev-team-a030ab702630
