# Contributing to Browser Pool Game

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/browser-pool-game.git`
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Make your changes
5. Test thoroughly
6. Commit: `git commit -m 'Add amazing feature'`
7. Push: `git push origin feature/amazing-feature`
8. Open a Pull Request

## 📋 Code Style Guidelines

### JavaScript
- Use ES5 syntax for consistency with existing codebase
- Follow prototypal inheritance pattern
- Add JSDoc comments for functions
- Use descriptive variable names
- Keep functions focused and under 50 lines when possible

Example:
```javascript
/**
 * Calculate distance between two points
 * @param {Vector2} point1 - First point
 * @param {Vector2} point2 - Second point
 * @returns {number} Distance
 */
function calculateDistance(point1, point2) {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
}
```

### CSS
- Use BEM naming convention where appropriate
- Keep selectors specific but not overly nested
- Add comments for complex layouts
- Maintain responsive design principles

### HTML
- Semantic HTML5 elements
- Proper indentation
- Descriptive IDs and classes

## 🧪 Testing Checklist

Before submitting a PR, ensure:
- [ ] Game starts without console errors
- [ ] Ball physics work correctly
- [ ] Turn switching functions properly
- [ ] Foul detection works
- [ ] Win conditions trigger correctly
- [ ] UI is responsive
- [ ] No visual glitches
- [ ] Code is documented

## 🎯 Areas for Contribution

### High Priority
- Mobile touch controls
- Sound effects system
- Ball spin mechanics
- Performance optimizations

### Medium Priority
- AI opponent
- Tutorial mode
- Statistics tracking
- Accessibility improvements

### Low Priority
- Alternative game modes
- Custom themes
- Replay system
- Achievement system

## 🐛 Bug Reports

When reporting bugs, include:
1. Browser and version
2. Steps to reproduce
3. Expected vs actual behavior
4. Screenshots if applicable
5. Console errors if any

## 💡 Feature Requests

For new features:
1. Describe the feature clearly
2. Explain the use case
3. Consider implementation complexity
4. Discuss potential alternatives

## 📝 Commit Messages

Use clear, descriptive commit messages:
- `feat: Add ball spin mechanics`
- `fix: Correct pocket collision detection`
- `docs: Update README with new features`
- `style: Format code according to style guide`
- `refactor: Simplify collision detection logic`
- `test: Add tests for turn switching`

## 🤝 Code Review Process

1. All PRs require review before merging
2. Address reviewer feedback promptly
3. Keep PRs focused on single features
4. Update documentation as needed
5. Ensure CI checks pass

## 📞 Questions?

Feel free to open an issue for discussion or reach out directly.

Thank you for contributing! 🎱
