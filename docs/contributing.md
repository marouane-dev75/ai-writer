# Contributing Guidelines

Thank you for considering contributing to this project! This document provides guidelines and instructions for contributing.

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of experience level, background, or identity.

### Expected Behavior

- Be respectful and considerate
- Welcome newcomers and help them get started
- Accept constructive criticism gracefully
- Focus on what is best for the project
- Show empathy towards other contributors

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Trolling or insulting/derogatory comments
- Public or private harassment
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

## How to Contribute

### Reporting Bugs

Before creating a bug report:

1. **Check existing issues** to avoid duplicates
2. **Verify the bug** in the latest version
3. **Collect information** about the bug

When creating a bug report, include:

- **Clear title** describing the issue
- **Steps to reproduce** the behavior
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (OS, Node version, Rust version)
- **Error messages** or logs

**Example:**

```markdown
**Bug**: Theme doesn't persist after restart

**Steps to Reproduce:**
1. Toggle dark mode
2. Close application
3. Reopen application
4. Theme reverts to light mode

**Expected:** Theme should remain dark

**Environment:**
- OS: Windows 11
- App Version: 0.1.0
```

### Suggesting Features

Before suggesting a feature:

1. **Check existing issues** for similar suggestions
2. **Consider if it fits** the project's scope
3. **Think about implementation** complexity

When suggesting a feature, include:

- **Clear description** of the feature
- **Use case** explaining why it's needed
- **Proposed implementation** if you have ideas
- **Alternatives considered**

**Example:**

```markdown
**Feature**: Auto-save for editor

**Use Case:** Users want their work saved automatically to prevent data loss

**Proposed Implementation:**
- Add auto-save toggle in settings
- Save every 30 seconds when content changes
- Show "Saving..." indicator

**Alternatives:**
- Manual save only (current)
- Save on every keystroke (too frequent)
```

### Pull Requests

#### Before Starting

1. **Open an issue** to discuss major changes
2. **Check existing PRs** to avoid duplicates
3. **Read the documentation** to understand the architecture

#### Creating a Pull Request

1. **Fork the repository**

```bash
# Fork on GitHub, then clone
git clone https://github.com/your-username/platejs-test.git
cd platejs-test
```

2. **Create a feature branch**

```bash
git checkout -b feature/your-feature-name
```

3. **Make your changes**

Follow the [Developer Guide](./developer-guide.md) for coding standards.

4. **Test your changes**

```bash
# Run the application
pnpm tauri dev

# Build to verify
pnpm tauri build
```

5. **Commit your changes**

Use [conventional commits](https://www.conventionalcommits.org/):

```bash
git commit -m "✨ (scope): add new feature"
```

See [Commit Message Format](#commit-message-format) below.

6. **Push to your fork**

```bash
git push origin feature/your-feature-name
```

7. **Open a Pull Request**

- Use a clear title describing the change
- Reference related issues
- Describe what changed and why
- Include screenshots for UI changes
- List any breaking changes

#### Pull Request Template

```markdown
## Description
Brief description of changes

## Related Issues
Fixes #123

## Changes Made
- Added X feature
- Fixed Y bug
- Updated Z documentation

## Screenshots
(if applicable)

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tested locally
```

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## Thank You!

Your contributions make this project better. We appreciate your time and effort! 🎉